from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Match
from .serializers import MatchSerializer
from accounts.permissions import IsAuthenticatedCustom


class MatchViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the matches.
    """
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticatedCustom]
    
    def get_permissions(self):
        """
        Assign permissions based on action.
        """
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAuthenticatedCustom()]
    
    def list(self, request, *args, **kwargs):
        print(f"DEBUG: Match list called by {request.user}")
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        print(f"DEBUG: Match retrieve called by {request.user} for ID {kwargs.get('pk')}")
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """
        Creates a new match.

        POST /api/matches/
        """
        print(f"DEBUG: Match create called by {request.user}. Data: {request.data}")
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can create matches"}, status=403)
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        print(f"DEBUG: Match update called by {request.user} for ID {kwargs.get('pk')}. Data: {request.data}")
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can update matches"}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        print(f"DEBUG: Match destroy called by {request.user} for ID {kwargs.get('pk')}")
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can delete matches"}, status=403)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def my(self, request):
        """
        Retrieves matches relevant to the user.
        - Organizer: Matches in their tournaments.
        - Player: Matches of teams they belong to.

        GET /api/matches/my/
        """
        print(f"DEBUG: Match my called by {request.user}")
        
        if request.user.role == 'organizer':
             # Organisateur : Matchs liés aux tournois qu'il a créés
             # On cherche les matchs où l'équipe A (ou B) appartient à un tournoi géré par l'user
             matches = Match.objects.filter(
                 team_a__tournament__organizer=request.user
             ).order_by('-date')
        else:
            # Joueur : Matchs des équipes où il est membre
            user_teams = request.user.teams.all()
            matches = Match.objects.filter(
                Q(team_a__in=user_teams) | Q(team_b__in=user_teams)
            ).order_by('-date')
            
        serializer = self.get_serializer(matches, many=True)
        data = serializer.data
        return Response(data)
    
    @action(detail=True, methods=['patch'])
    def update_scores(self, request, pk=None):
        """
        Updates scores of a match.

        PATCH /api/matches/:id/ 
        """
        print(f"DEBUG: Match update_scores called by {request.user} for ID {pk}. Data: {request.data}")
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can update matches"}, status=403)
        match = self.get_object()
        score_a = request.data.get('score_a')
        score_b = request.data.get('score_b')
        if score_a is not None:
            match.score_a = score_a
        if score_b is not None:
            match.score_b = score_b
        match.save()
        serializer = self.get_serializer(match)
        data = serializer.data
        return Response(data)

