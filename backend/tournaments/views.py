from django.db import models
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.utils import timezone
from .models import Tournament, Team
from matches.models import Match
from JoinRequest.models import JoinRequest
from .serializers import TournamentSerializer, TeamSerializer, SimpleTeamSerializer
from accounts.permissions import IsAuthenticatedCustom


# Create your views here.
class TournamentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the tournaments.
    """
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    
    def get_permissions(self):
        """
        Assign permissions based on action.
        """
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAuthenticatedCustom()]

    def list(self, request):
        """
        Lists all tournaments.
        GET /api/tournaments/
        """
        print(f"DEBUG: Tournament list called by {request.user}")
        tournaments = Tournament.objects.all()

        city = request.query_params.get('city')
        if city:
            tournaments = tournaments.filter(city=city)
        sport = request.query_params.get('sport')
        if sport:
            tournaments = tournaments.filter(sport=sport)

        tournaments = tournaments.order_by('-created_at')

        serializer = self.get_serializer(tournaments, many=True)
        data = serializer.data
        return Response(data)
        
    def create(self, request):
        """
        Creates a new tournament.
        POST /api/tournaments/
        """
        print(f"DEBUG: Tournament create called. Data: {request.data}")

        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can create tournaments"}, status=403)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(organizer=request.user)
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        print(f"DEBUG: Tournament update called by {request.user} for ID {kwargs.get('pk')}. Data: {request.data}")
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can update tournaments"}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        print(f"DEBUG: Tournament destroy called by {request.user} for ID {kwargs.get('pk')}")
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can delete tournaments"}, status=403)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def mine(self, request):
        """
        Retrieves tournaments created by the current user.
        GET /api/tournaments/mine/
        """
        print(f"DEBUG: Tournament mine called by {request.user}")
        tournaments = Tournament.objects.filter(organizer=request.user)
        serializer = self.get_serializer(tournaments, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieves a tournament by its ID.
        GET /api/tournaments/{id}/
        """
        print(f"DEBUG: Tournament retrieve called by {request.user} for ID {pk}")
        tournament = self.get_object()
        serializer = self.get_serializer(tournament)       
        data = serializer.data

        # Utilisation de SimpleTeamSerializer pour éviter d'exposer trop d'infos (ex: liste des membres pour les visiteurs)
        # et pour être plus léger, mais suffisant pour le frontend (besoin des IDs et noms pour mapper les matchs)
        data['teams'] = SimpleTeamSerializer(tournament.teams.all(), many=True).data
        data['stats'] = {
            'team_count': tournament.teams.count(),
            'total_players': sum(team.current_capacity for team in tournament.teams.all())
        }
        return Response(data)   
    
    @action(detail=False, methods=['get'])
    def my_stats(self, request):
        """
        Retrieves statistics about tournaments organized by the current organizer.
        GET /api/tournaments/my_stats/
        """
        print(f"DEBUG: Tournament my_stats called by {request.user}")
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can view stats"}, status=403)
        tournaments = Tournament.objects.filter(organizer=request.user)
        tournament_count = tournaments.count()
        team_count = Team.objects.filter(tournament__organizer=request.user).count()
        data = {
            'tournaments_count': tournament_count,
            'total_teams_count': team_count,
        }
        return Response(data)


# CORRECTION: TeamViewSet doit être au même niveau que TournamentViewSet
class TeamViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the teams.
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def get_permissions(self):
        """
        Assign permissions based on action.
        """
        if self.action in ['list', 'retrieve', 'available']:
            return [permissions.AllowAny()]
        return [IsAuthenticatedCustom()]
    
    def list(self, request):
        """
        Lists all teams.
        GET /api/teams/
        """
        print(f"DEBUG: Team list called by {request.user}")
        teams = Team.objects.all()
        serializer = self.get_serializer(teams, many=True)
        data = serializer.data
        return Response(data)

    def retrieve(self, request, pk=None):
        """
        Retrieves a team by its ID.
        GET /api/teams/{id}/
        """
        print(f"DEBUG: Team retrieve called by {request.user} for ID {pk}")
        team = self.get_object()
        serializer = self.get_serializer(team)       
        data = serializer.data
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def mine(self, request):
        """
        Check which teams the current user is a part of OR manages (as organizer).
        GET /api/teams/mine/
        """
        print(f"DEBUG: Team mine called by {request.user}")
        if request.user.role == 'organizer':
            teams = Team.objects.filter(tournament__organizer=request.user)
        else:
            teams = Team.objects.filter(members=request.user)
            
        serializer = self.get_serializer(teams, many=True)
        data = serializer.data
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """
        Retrieves available teams.
        GET /api/teams/available/
        """
        print(f"DEBUG: Team available called by {request.user}")
        city = request.query_params.get('city', None)
        sport = request.query_params.get('sport', None)
        
        queryset = self.get_queryset().filter(current_capacity__lt=models.F('max_capacity')) 
        
        if city:
            queryset = queryset.filter(tournament__city=city)
        if sport:
            queryset = queryset.filter(tournament__sport=sport)

        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        return Response(data)
  
    def create(self, request, pk=None):
        """
        Creates a new team.
        POST /api/teams/
        """
        print(f"DEBUG: Team create called. Data: {request.data}")
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can create teams"}, status=403)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        print(f"DEBUG: Team update called by {request.user} for ID {kwargs.get('pk')}. Data: {request.data}")
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can update teams"}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        print(f"DEBUG: Team destroy called by {request.user} for ID {kwargs.get('pk')}")
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can delete teams"}, status=403)
        return super().destroy(request, *args, **kwargs)


# CORRECTION: OrganizerDashboardView doit aussi être au même niveau
class OrganizerDashboardView(APIView):
    """
    Dashboard view for organizers.
    """
    permission_classes = [IsAuthenticatedCustom]

    def get(self, request):
        print(f"DEBUG: OrganizerDashboardView GET called by {request.user}")
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can view dashboard"}, status=403)
        
        tournaments = Tournament.objects.filter(organizer=request.user)
        teams_count = Team.objects.filter(tournament__in=tournaments).count()
        
        upcoming_matches = Match.objects.filter(
            team_a__tournament__in=tournaments,
            date__gte=timezone.now()
        ).count()

        pending_requests = JoinRequest.objects.filter(
            team__tournament__in=tournaments,
            status='pending'
        ).count()

        stats = {
            "tournaments": tournaments.count(),
            "teams": teams_count,
            "upcoming_matches": upcoming_matches,
            "requests": pending_requests
        }

        recent_tournaments_data = []
        recent_objs = tournaments.order_by('-created_at')[:5]
        
        for t in recent_objs:
            next_match_obj = Match.objects.filter(
                team_a__tournament=t,
                date__gte=timezone.now()
            ).order_by('date').first()
            
            next_match_date = next_match_obj.date if next_match_obj else "-"
            
            recent_tournaments_data.append({
                "id": t.id,
                "name": t.name,
                "next_match": next_match_date,
                "status": "En cours", 
                "teams": t.teams.count()
            })

        return Response({
            "stats": stats,
            "recent_tournaments": recent_tournaments_data
        })
