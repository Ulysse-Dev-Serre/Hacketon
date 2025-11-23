from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'join-requests', views.JoinRequestViewSet, basename='join-request')

urlpatterns = [
    path('', include(router.urls)),
]
