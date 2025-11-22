from django.urls import path

from . import views

urlpatterns = [
    path('player/profile/', views.PlayerProfileView.as_view(), name='player-profile'),
]