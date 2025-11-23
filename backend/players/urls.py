from django.urls import path

from . import views

urlpatterns = [
    path('player/profile/', views.PlayerProfileView.as_view(), name='player-profile'),
    path('players/<uuid:user__id>/', views.PublicPlayerProfileView.as_view({'get': 'retrieve'}), name='public-player-profile'),
]