from django.db import models
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Tournament, Team
from .serializers import TournamentSerializer, TeamSerializer

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
            return [permissions.AllowAny()]  # open to all users for listing and retrieving
        return [permissions.IsAuthenticated()]

    def list(self, request):
        """
        Lists all tournaments.

        GET /api/tournaments/
        """
        tournaments = Tournament.objects.all()

        # Filter tournaments based on query parameters:city and sport
        city = request.query_params.get('city')
        if city:
            tournaments = tournaments.filter(city=city)
        sport = request.query_params.get('sport')
        if sport:
            tournaments = tournaments.filter(sport=sport)

        # Order tournaments by creation date descending
        tournaments = tournaments.order_by('-created_at')

        serializer = self.get_serializer(tournaments, many=True)
        data=serializer.data
        return Response(data)
    
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)
        
    def create(self, request):
        """
        Creates a new tournament.

        POST /api/tournaments/
        """

        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can create tournaments"}, status=403)
        
        serializer = self.get_serializer(data=request.data)

        return super().create(request)

    @action(detail=False, methods=['get'])
    def mine(self, request):
        """
        Retrieves tournaments created by the current user.

        GET /api/tournaments/mine/
        """
        tournaments = Tournament.objects.filter(organizer=request.user)
        serializer = self.get_serializer(tournaments, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieves a tournament by its ID.

        GET /api/tournaments/{id}/
        """
        tournament = self.get_object()
        serializer = self.get_serializer(tournament)       
        data = serializer.data

        # Add additional data about teams and stats
        data['teams'] = TeamSerializer(tournament.teams.all(), many=True).data
        data['stats'] = {
            'team_count': tournament.teams.count(),
            'total_players': sum(team.current_capacity for team in tournament.teams.all())
        }
        return Response(data)   
    
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
            return [permissions.AllowAny()]  # open to all users for listing and retrieving and checking available teams
        return [permissions.IsAuthenticated()]
    
    def list(self, request):
        """
        Lists all teams.

        GET /api/teams/
        """
        teams = Team.objects.all()
        serializer = self.get_serializer(teams, many=True)
        data=serializer.data
        return Response(data)

    def retrieve(self, request, pk=None):
        """
        Retrieves a team by its ID.

        GET /api/teams/{id}/
        """
        team = self.get_object()
        serializer = self.get_serializer(team)       
        data = serializer.data

        return Response(data)
    
    @action(detail=False, methods=['get'])
    def mine(self, request):
        """
        Check which teams the current user is a part of.

        GET /api/teams/mine/
        """
        user_teams = Team.objects.filter(members=request.user)
        serializer = self.get_serializer(user_teams, many=True)
        data = serializer.data
        return Response(data)
    @action(detail=False, methods=['get'])
    def available(self, request):
        """
        Retrieves available teams.

        GET /api/teams/available/
        """
        city = request.query_params.get('city', None)
        sport = request.query_params.get('sport', None)
        
        # Filter teams with available capacity database side, more efficient than fetching all records and filtering in Python（F:Field)
        queryset =self.get_queryset().filter(current_capacity__lt=models.F('max_capacity')) 

        # Filter teams by city and sport
        if city:
            queryset = queryset.filter(tournament__city=city)
        if sport:
            queryset = queryset.filter(tournament__sport=sport)

        serializer = self.get_serializer(queryset, many=True)
        data=serializer.data
        return Response(data)
    
  
    def create(self, request, pk=None):
        """
        Creates a new team.

        POST /api/teams/
        """
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can create teams"}, status=403)
        return super().create(request)
       
