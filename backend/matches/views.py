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
    
    def create(self, request):
        """
        Creates a new match.

        POST /api/matches/
        """
        if request.user.role != 'organizer':
            return Response({"error": "Only organizers can create matches"}, status=403)
        return super().create(request)
    
    @action(detail=False, methods=['get'])
    def my(self, request):
        """
        Retrieves matches involving teams the user is part of.

        GET /api/matches/my/
        """
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
    def update_scores(self, request):
        """
        Updates scores of a match.

        PATCH /api/matches/:id/ 
        """
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

