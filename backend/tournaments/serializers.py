from rest_framework import serializers
from .models import Tournament, Team
from accounts.serializers import UserSerializer

class TournamentSerializer(serializers.ModelSerializer):
    """
    Serializer for the tournaments.
    """
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'sport', 'city', 'start_date', 'organizer', 'created_at']
        read_only_fields = ['id', 'created_at', 'organizer']

class TeamSerializer(serializers.ModelSerializer):
    """
    Serializer for the teams.
    """
    available_spots = serializers.IntegerField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'tournament', 'max_capacity', 'current_capacity', 'members', 'created_at','available_spots', 'is_full']
        read_only_fields = ['id', 'created_at', 'available_spots', 'is_full', 'current_capacity', 'members']