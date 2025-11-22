from rest_framework import serializers
from .models import PlayerProfile

class PlayerProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source='user.id', read_only=True)
    
    class Meta:
        model = PlayerProfile
        fields = ['id', 'user_id', 'city', 'favorite_sport', 'level', 'position', ]
        read_only_fields = ['id', 'user_id']
        
