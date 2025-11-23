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
        Retrieves matches involving teams the user is part of.

        GET /api/matches/my/
        """
        print(f"DEBUG: Match my called by {request.user}")
        user_teams = request.user.teams.all()
        # Find matches where the user's teams are either team_a or team_b and order by date descending
        # Database-level OR filtering with Q(Query) objects, more efficient than Python-side filtering
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

