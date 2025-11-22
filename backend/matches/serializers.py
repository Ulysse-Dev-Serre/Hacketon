# matches/serializers.py
from rest_framework import serializers
from .models import Match
from tournaments.serializers import TeamSerializer

class MatchSerializer(serializers.ModelSerializer):
    """
    Serializer for the matches.
    """
    team_a = TeamSerializer(read_only=True)
    team_b = TeamSerializer(read_only=True)   
    team_a_id = serializers.UUIDField(write_only=True)
    team_b_id = serializers.UUIDField(write_only=True)
    class Meta:
        model = Match
        fields = ['id', 'team_a', 'team_b', 'team_a_id', 'team_b_id', 'date', 'location', 'score_a', 'score_b', 'created_at']
        read_only_fields = ['id', 'created_at']