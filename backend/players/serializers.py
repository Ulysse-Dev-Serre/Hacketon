from rest_framework import serializers
from .models import PlayerProfile

class PlayerProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source='user.id', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = PlayerProfile
        fields = ['id', 'user_id', 'full_name', 'city', 'favorite_sport', 'level', 'position', ]
        read_only_fields = ['id', 'user_id']
        
