# Workflow Organisateur

Ce document décrit le parcours complet d'un utilisateur avec le rôle **"Organisateur"**, ainsi que les détails techniques (endpoints, fichiers backend) associés à chaque étape.

## Architecture Backend Pertinente

*   **Tournois & Équipes** : `backend/tournaments/`
*   **Matchs** : `backend/matches/`
*   **Demandes (Join Requests)** : `backend/JoinRequest/`
*   **Authentification** : `backend/accounts/`

---

## 1. Inscription et Assignation du Rôle

L'utilisateur se connecte via Clerk. Si c'est sa première connexion ou s'il n'a pas de rôle, il est redirigé vers la page de choix de rôle.

1.  **Action** : L'utilisateur clique sur "Je suis un Organisateur".
2.  **Frontend** : Appelle l'API pour mettre à jour le rôle.
3.  **Backend** :
    *   **Fichier** : `backend/accounts/views.py` (Ligne 30)
    *   **Endpoint** : `POST /api/auth/update-role/`
    *   **Logique** : Met à jour `user.role = 'organizer'` dans la base de données PostgreSQL.

---

## 2. Dashboard (Tableau de Bord)

Après connexion, l'organisateur arrive sur son dashboard (`/organizer/dashboard`).

1.  **Action** : Chargement de la page.
2.  **Frontend** : Récupère les statistiques, les tournois récents et les équipes.
3.  **Backend** :
    *   **Fichier** : `backend/tournaments/views.py` (Ligne 227 - `OrganizerDashboardView`)
    *   **Endpoint** : `GET /api/organizer/dashboard/`
    *   **Données** : Nombre de tournois, équipes, matchs à venir, demandes en attente.

---

## 3. Gestion des Tournois

### A. Création d'un Tournoi
1.  **Action** : Clic sur "Créer un tournoi". Remplissage du formulaire (Nom, Sport, Ville...).
2.  **Backend** :
    *   **Fichier** : `backend/tournaments/views.py` (Ligne 51 - `create`)
    *   **Endpoint** : `POST /api/tournaments/`
    *   **Permission** : Vérifie `request.user.role == 'organizer'`.

### B. Liste des Tournois
1.  **Action** : Consultation de "Mes Tournois".
2.  **Backend** :
    *   **Fichier** : `backend/tournaments/views.py` (Ligne 79 - `mine`)
    *   **Endpoint** : `GET /api/tournaments/mine/`
    *   **Logique** : Filtre `Tournament.objects.filter(organizer=request.user)`.

---

## 4. Gestion des Équipes

### A. Création d'une Équipe
1.  **Action** : Ajout d'une équipe dans un tournoi existant.
2.  **Backend** :
    *   **Fichier** : `backend/tournaments/views.py` (Ligne 200 - `create` dans `TeamViewSet`)
    *   **Endpoint** : `POST /api/teams/`
    *   **Données** : Nom, Tournoi ID, Capacité max.

### B. Consultation d'une Équipe
1.  **Action** : Clic sur une équipe pour voir les détails et les joueurs inscrits.
2.  **Backend** :
    *   **Fichier** : `backend/tournaments/views.py` (Ligne 152 - `retrieve`)
    *   **Endpoint** : `GET /api/teams/:id/`
    *   **Détail** : Renvoie la liste des membres (User objects) grâce au `TeamSerializer` mis à jour.

---

## 5. Gestion des Demandes (Join Requests)

Les joueurs postulent pour rejoindre les équipes. L'organisateur doit valider ces demandes.

1.  **Action** : Consultation des demandes en attente.
2.  **Backend** :
    *   **Fichier** : `backend/JoinRequest/views.py` (Ligne 15 - `get_queryset`)
    *   **Endpoint** : `GET /api/join-requests/`
    *   **Logique** : Renvoie les demandes pour les équipes appartenant aux tournois de l'organisateur.

3.  **Action** : Accepter ou Refuser une demande.
4.  **Backend** :
    *   **Fichier** : `backend/JoinRequest/views.py` (Ligne 74 - `respond`)
    *   **Endpoint** : `POST /api/join-requests/:id/respond/`
    *   **Logique** :
        *   Si `accept` : Ajoute le joueur à `team.members`, incrémente `current_capacity`, passe le statut à `accepted`.
        *   Si `reject` : Passe le statut à `rejected`.

---

## 6. Gestion des Matchs

### A. Création d'un Match
1.  **Action** : Planifier une rencontre entre deux équipes d'un tournoi.
2.  **Backend** :
    *   **Fichier** : `backend/matches/views.py` (Ligne 26 - `create`)
    *   **Endpoint** : `POST /api/matches/`
    *   **Données** : `team_a_id`, `team_b_id`, `date`, `location`.

### B. Saisie des Scores
1.  **Action** : Une fois le match terminé, l'organisateur entre le score.
2.  **Backend** :
    *   **Fichier** : `backend/matches/views.py` (Ligne 78 - `update_scores`)
    *   **Endpoint** : `PATCH /api/matches/:id/` (via l'action standard `update` ou `partial_update` qui appelle souvent la même logique ou une action dédiée si configurée, ici on utilise souvent le standard PATCH sur l'ID). *Note: Dans notre code, nous avons aussi une action `update_scores` spécifique mais le frontend utilise souvent PATCH sur l'ID directement.*

### C. Calendrier (Vue Organisateur)
1.  **Action** : Voir tous les matchs de ses tournois.
2.  **Backend** :
    *   **Fichier** : `backend/matches/views.py` (Ligne 50 - `my`)
    *   **Endpoint** : `GET /api/matches/my/`
    *   **Logique** : Renvoie les matchs où `team_a.tournament.organizer == request.user`.
