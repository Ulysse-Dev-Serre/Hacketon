from rest_framework import permissions

class IsAuthenticatedCustom(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user:
            return False
        if hasattr(user, 'is_authenticated'):
            return bool(user.is_authenticated)
        return True 