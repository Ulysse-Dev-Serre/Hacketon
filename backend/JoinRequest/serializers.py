from rest_framework import serializers
from .models import JoinRequest
from accounts.serializers import UserSerializer
from tournaments.serializers import TeamSerializer

class JoinRequestSerializer(serializers.ModelSerializer):
    # On utilise read_only=True pour l'affichage (nested objects)
    # L'organisateur aura ainsi toutes les infos du joueur (nom, email) directement
    player_details = UserSerializer(source='player', read_only=True)
    team_details = TeamSerializer(source='team', read_only=True)

    class Meta:
        model = JoinRequest
        fields = ['id', 'player', 'player_details', 'team', 'team_details', 'status', 'message', 'created_at']
        read_only_fields = ['id', 'player', 'status', 'created_at'] # Le player est auto-assigné à request.user
