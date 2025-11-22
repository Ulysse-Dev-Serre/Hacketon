from django.urls import path
from . import views

urlpatterns = [
    path('auth/me/', views.CurrentUserView.as_view(), name='auth-me'),
    path('auth/update-role/', views.UpdateRoleView.as_view(), name='auth-update-role'),
]