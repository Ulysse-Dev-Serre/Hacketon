from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'clerk_id', 'email', 'full_name', 'role', 'created_at']
        read_only_fields = ['id', 'clerk_id', 'created_at']