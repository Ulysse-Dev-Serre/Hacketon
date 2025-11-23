from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import JoinRequest
from .serializers import JoinRequestSerializer
from tournaments.models import Team
from accounts.permissions import IsAuthenticatedCustom

class JoinRequestViewSet(viewsets.ModelViewSet):
    queryset = JoinRequest.objects.all()
    serializer_class = JoinRequestSerializer
    permission_classes = [IsAuthenticatedCustom]

    def get_queryset(self):
        """
        Filtre les demandes selon le rôle de l'utilisateur.
        - Joueur : Voit ses propres demandes.
        - Organisateur : Voit les demandes pour les équipes de ses tournois.
        """
        user = self.request.user
        print(f"DEBUG: JoinRequest get_queryset called by {user}")
        if user.role == 'organizer':
            return JoinRequest.objects.filter(team__tournament__organizer=user)
        return JoinRequest.objects.filter(player=user)

    def create(self, request):
        """
        Créer une demande d'adhésion (Joueur uniquement).
        POST /api/join-requests/
        """
        print(f"DEBUG: JoinRequest create called by {request.user.email}")
        print(f"DEBUG: Data received: {request.data}")

        if request.user.role != 'player':
            print("DEBUG: User is not a player")
            return Response({"error": "Seuls les joueurs peuvent postuler"}, status=403)

        team_id = request.data.get('team')
        message = request.data.get('message', '')

        if not team_id:
            print("DEBUG: Missing team ID")
            return Response({"error": "Team ID is required"}, status=400)

        # Vérifier si l'équipe existe
        team = get_object_or_404(Team, id=team_id)

        # Vérifier si déjà membre
        if team.members.filter(id=request.user.id).exists():
             print("DEBUG: Already member")
             return Response({"error": "Vous êtes déjà membre de cette équipe"}, status=400)

        # Vérifier si demande déjà existante
        if JoinRequest.objects.filter(player=request.user, team=team).exists():
             print("DEBUG: Request already exists")
             return Response({"error": "Vous avez déjà une demande en cours pour cette équipe"}, status=400)
        
        # Vérifier si l'équipe est pleine
        if team.is_full:
            print("DEBUG: Team is full")
            return Response({"error": "Cette équipe est complète"}, status=400)

        join_request = JoinRequest.objects.create(
            player=request.user,
            team=team,
            message=message
        )

        serializer = self.get_serializer(join_request)
        return Response(serializer.data, status=201)

    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        """
        Accepter ou refuser une demande (Organisateur uniquement).
        POST /api/join-requests/{id}/respond/
        Body: { "action": "accept" | "reject" }
        """
        print(f"DEBUG: Respond to request called by {request.user}. ID={pk}, Data={request.data}")
        if request.user.role != 'organizer':
            return Response({"error": "Action réservée aux organisateurs"}, status=403)

        join_request = self.get_object()
        
        # Vérifier que l'organisateur possède bien le tournoi de cette équipe
        if join_request.team.tournament.organizer != request.user:
            return Response({"error": "Vous ne gérez pas cette équipe"}, status=403)

        action_type = request.data.get('action')
        
        if action_type == 'accept':
            # Vérifier capacité
            if join_request.team.is_full:
                return Response({"error": "L'équipe est pleine impossible d'accepter"}, status=400)
            
            join_request.status = 'accepted'
            join_request.save()
            
            # Ajouter le joueur à l'équipe
            join_request.team.members.add(join_request.player)
            # Incrémenter la capacité actuelle
            join_request.team.current_capacity += 1
            join_request.team.save()
            print("DEBUG: Request accepted and player added.")
            
            return Response({"status": "accepted", "message": "Joueur ajouté à l'équipe"})
            
        elif action_type == 'reject':
            join_request.status = 'rejected'
            join_request.save()
            print("DEBUG: Request rejected.")
            return Response({"status": "rejected", "message": "Demande refusée"})
            
        else:
            return Response({"error": "Action invalide (accept/reject attendu)"}, status=400)

    @action(detail=False, methods=['get'], url_path='my-requests')
    def my_requests(self, request):
        """
        Endpoint explicite pour les demandes du joueur.
        GET /api/join-requests/my-requests/
        """
        print(f"DEBUG: JoinRequest my_requests called by {request.user}")
        if request.user.role != 'player':
             print("DEBUG: User is not a player")
             return Response({"error": "Réservé aux joueurs"}, status=403)
             
        requests = JoinRequest.objects.filter(player=request.user)
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        print(f"DEBUG: JoinRequest update called by {request.user} for ID {kwargs.get('pk')}. Data: {request.data}")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        print(f"DEBUG: JoinRequest destroy called by {request.user} for ID {kwargs.get('pk')}")
        return super().destroy(request, *args, **kwargs)

