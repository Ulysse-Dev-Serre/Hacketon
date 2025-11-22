from django.urls import path
from . import views

urlpatterns = [
    path('auth/me/', views.CurrentUserView.as_view(), name='auth-me'),]