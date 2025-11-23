# Workflow Joueur

Ce document décrit le parcours complet d'un utilisateur avec le rôle **"Joueur"**, ainsi que les détails techniques (endpoints, fichiers backend) associés à chaque étape.

## Architecture Backend Pertinente

*   **Profils** : `backend/players/`
*   **Recherche (Équipes/Tournois)** : `backend/tournaments/`
*   **Demandes** : `backend/JoinRequest/`
*   **Matchs** : `backend/matches/`

---

## 1. Inscription et Profil

1.  **Action** : L'utilisateur choisit "Je suis un Joueur".
2.  **Backend** :
    *   **Fichier** : `backend/accounts/views.py` (Ligne 30)
    *   **Endpoint** : `POST /api/auth/update-role/`

3.  **Action** : Édition du profil (Ville, Sport, Niveau).
4.  **Backend** :
    *   **Fichier** : `backend/players/views.py` (Ligne 35 - `patch`)
    *   **Endpoint** : `PATCH /api/player/profile/`
    *   **Fichier** : `backend/players/views.py` (Ligne 15 - `get`)
    *   **Endpoint** : `GET /api/player/profile/` (Pour l'affichage initial).

---

## 2. Recherche et Candidature (Rejoindre une équipe)

Le joueur cherche une équipe pour participer aux tournois.

1.  **Action** : Recherche d'équipes disponibles (Filtres par ville, sport).
2.  **Backend** :
    *   **Fichier** : `backend/tournaments/views.py` (Ligne 180 - `available`)
    *   **Endpoint** : `GET /api/teams/available/`
    *   **Logique** : Renvoie les équipes où `current_capacity < max_capacity`.

3.  **Action** : Consultation des détails d'une équipe (et du tournoi associé).
4.  **Backend** :
    *   **Fichier** : `backend/tournaments/views.py` (Ligne 152 - `retrieve`)
    *   **Endpoint** : `GET /api/teams/:id/`

5.  **Action** : Envoyer une demande d'adhésion ("Rejoindre").
6.  **Backend** :
    *   **Fichier** : `backend/JoinRequest/views.py` (Ligne 27 - `create`)
    *   **Endpoint** : `POST /api/join-requests/`
    *   **Données** : `team` (ID), `message`.
    *   **Vérifications** : Vérifie si déjà membre, si demande déjà existante, ou si équipe pleine.

7.  **Action** : Suivre l'état de ses demandes.
8.  **Backend** :
    *   **Fichier** : `backend/JoinRequest/views.py` (Ligne 119 - `my_requests`)
    *   **Endpoint** : `GET /api/join-requests/my-requests/`

---

## 3. Calendrier et Matchs

Une fois accepté dans une équipe, le joueur veut voir ses matchs.

1.  **Action** : Consultation du **Calendrier**.
2.  **Backend** :
    *   **Récupération Globale** :
        *   **Fichier** : `backend/matches/views.py` (Ligne 18 - `list`)
        *   **Endpoint** : `GET /api/matches/` (Tous les matchs de la ligue).
    *   **Surbrillance (Mes Matchs)** :
        *   **Fichier** : `backend/matches/views.py` (Ligne 50 - `my`)
        *   **Endpoint** : `GET /api/matches/my/`
        *   **Logique** : Renvoie les matchs des équipes dont le joueur est membre (`request.user.teams.all()`).

---

## 4. Profils Publics

Le joueur peut consulter le profil des autres joueurs (coéquipiers ou adversaires).

1.  **Action** : Clic sur un joueur dans la liste d'une équipe.
2.  **Backend** :
    *   **Fichier** : `backend/players/views.py` (Ligne 66 - `PublicPlayerProfileView`)
    *   **Endpoint** : `GET /api/players/:user_id/`
    *   **Détail** : Renvoie les infos publiques (Ville, Sport, Niveau) sans permettre l'édition.
