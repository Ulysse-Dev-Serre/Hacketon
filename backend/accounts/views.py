from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import User
from .serializers import UserSerializer
from accounts.permissions import IsAuthenticatedCustom


class CurrentUserView(APIView):
    """
    Retrieve the currently authenticated user's details.
    
    GET /api/auth/me/ 
    """
    permission_classes = [IsAuthenticatedCustom]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)