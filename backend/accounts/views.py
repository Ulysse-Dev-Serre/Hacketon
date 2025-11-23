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
        print(f"DEBUG: CurrentUserView GET called by {request.user.email} (ID: {request.user.id})")
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UpdateRoleView(APIView):
    """
    Update the user's role.
    
    POST /api/auth/update-role/
    """
    permission_classes = [IsAuthenticatedCustom]

    def post(self, request):
        print(f"DEBUG: UpdateRoleView POST called. Data: {request.data}")
        role = request.data.get('role')
        if role not in ['player', 'organizer']:
            return Response({'error': 'Invalid role'}, status=400)
        
        user = request.user
        user.role = role
        user.save()
        print(f"DEBUG: Role updated to {role}")
        
        return Response({'status': 'role updated', 'role': user.role})