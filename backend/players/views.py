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
        print(f"DEBUG: PlayerProfile GET called by {request.user}")
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
        print(f"DEBUG: PlayerProfile PATCH called. Data: {request.data}")
        try:
            profile = PlayerProfile.objects.get(user=request.user)
        except PlayerProfile.DoesNotExist:
            return Response({"error": "Player profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # 1. Mise à jour du User (full_name) si fourni
        full_name = request.data.get('full_name')
        if full_name:
            print(f"DEBUG: Updating full_name from '{request.user.full_name}' to '{full_name}'")
            request.user.full_name = full_name
            request.user.save()
            print("DEBUG: User saved.")

        # 2. Mise à jour du Profile
        serializer = PlayerProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # 3. On renvoie les données combinées
        data = serializer.data
        data['full_name'] = request.user.full_name # On ajoute le nom mis à jour à la réponse
        return Response(data)

class PublicPlayerProfileView(viewsets.ReadOnlyModelViewSet):
    """
    Public view for player profiles.
    Lookup by user_id.
    """
    queryset = PlayerProfile.objects.all()
    serializer_class = PlayerProfileSerializer
    permission_classes = [IsAuthenticatedCustom]
    lookup_field = 'user__id'

    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except:
             # If profile doesn't exist for this user, return basic info from User model
            # This handles cases where a user exists but hasn't created a profile yet
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user_id = kwargs.get('user__id')
            try:
                user = User.objects.get(id=user_id)
                return Response({
                    'id': None,
                    'user_id': user.id,
                    'full_name': user.full_name,
                    'city': 'Non renseigné',
                    'favorite_sport': 'Non renseigné',
                    'level': 'Non renseigné',
                    'position': 'Non renseigné'
                })
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)