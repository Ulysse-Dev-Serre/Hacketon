from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('tournaments', views.TournamentViewSet, basename='tournament')
router.register('teams', views.TeamViewSet, basename='team')

urlpatterns = [
    # ViewSets via the router
    path('', include(router.urls)),
    path('organizer/dashboard/', views.OrganizerDashboardView.as_view(), name='organizer-dashboard'),
]