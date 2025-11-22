from rest_framework.views import APIView
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PlayerProfile
from .serializers import PlayerProfileSerializer
from accounts.permissions import IsAuthenticatedCustom

class PlayerProfileView(APIView):
    """
    View for the player profiles.
    """
    permission_classes = [IsAuthenticatedCustom]
    
    def get(self, request):
        """
        Retrieve the authenticated user's player profile.

        GET /api/player/profile/

        """
        profile, created = PlayerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'city': '', 
                'favorite_sport': '', 
                'level': 'beginner', 
                'position': ''
            })
        serializer = PlayerProfileSerializer(profile)
        data = serializer.data
        return Response(data)
    
    def patch(self, request):
        """
        Update the authenticated user's player profile.

        PATCH /api/player/profile/

        """
        try:
            profile = PlayerProfile.objects.get(user=request.user)
        except PlayerProfile.DoesNotExist:
            return Response({"error": "Player profile not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PlayerProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = serializer.data
        return Response(data)