# Modèles de Données

Ce document détaille la structure de la base de données PostgreSQL.

## Users (accounts)
Table: `users`
Modèle central synchronisé avec Clerk.

- `id` : **UUID** (PK) - Identifiant unique généré automatiquement.
- `clerk_id` : **String(255)** (Unique) - ID provenant de l'authentification Clerk.
- `email` : **Email** (Unique) - Adresse email de l'utilisateur.
- `full_name` : **String(255)** - Nom complet.
- `role` : **String(20)** - Rôle de l'utilisateur.
  - Choix : `'player'`, `'organizer'`
- `created_at` : **DateTime** - Date de création du compte.

## PlayerProfile (players)
Table: `player_profiles`
Extension du profil utilisateur pour les joueurs.

- `user` : **OneToOne (User)** (PK) - Lien vers l'utilisateur (suppression en cascade).
- `city` : **String(100)** - Ville du joueur.
- `favorite_sport` : **String(50)** - Sport favori.
- `level` : **String(20)** - Niveau déclaré.
  - Choix : `'beginner'`, `'intermediate'`, `'advanced'`
- `position` : **String(50)** (Optionnel) - Poste préféré (ex: Gardien, Attaquant).

## Tournament (tournaments)
Table: `tournaments`
Ligue ou tournoi créé par un organisateur.

- `id` : **UUID** (PK) - Identifiant unique.
- `name` : **String(200)** - Nom du tournoi.
- `sport` : **String(50)** - Sport concerné.
- `city` : **String(100)** - Ville où se déroule le tournoi.
- `start_date` : **Date** - Date de début.
- `organizer` : **ForeignKey (User)** - L'organisateur créateur (suppression en cascade).
- `created_at` : **DateTime** - Date de création.

## Team (tournaments)
Table: `teams`
Équipe participant à un tournoi.

- `id` : **UUID** (PK) - Identifiant unique.
- `name` : **String(200)** - Nom de l'équipe.
- `tournament` : **ForeignKey (Tournament)** - Tournoi auquel l'équipe appartient.
- `max_capacity` : **Integer** - Nombre max de joueurs (Défaut: 15).
- `current_capacity` : **Integer** - Nombre actuel de joueurs (Défaut: 0).
- `members` : **ManyToMany (User)** - Liste des joueurs membres de l'équipe.
- `created_at` : **DateTime** - Date de création.

*Propriétés calculées :*
- `available_spots` : Places restantes.
- `is_full` : Booléen indiquant si l'équipe est complète.

## JoinRequest (JoinRequest)
Table: `join_requests`
Demande d'adhésion d'un joueur à une équipe.
*Contrainte : Unique pour le couple (player, team).*

- `id` : **UUID** (PK) - Identifiant unique.
- `player` : **ForeignKey (User)** - Le joueur demandeur.
- `team` : **ForeignKey (Team)** - L'équipe visée.
- `status` : **String(20)** - État de la demande.
  - Choix : `'pending'` (En attente), `'accepted'` (Accepté), `'rejected'` (Refusé).
  - Défaut : `'pending'`
- `message` : **Text** (Optionnel) - Message de motivation du joueur.
- `created_at` : **DateTime** - Date de la demande.
- `updated_at` : **DateTime** - Date de dernière modification (ex: lors de la réponse).

## Match (matches)
Table: `matches`
Rencontre entre deux équipes.

- `id` : **UUID** (PK) - Identifiant unique.
- `team_a` : **ForeignKey (Team)** - Équipe A (Domicile/Premier).
- `team_b` : **ForeignKey (Team)** - Équipe B (Extérieur/Second).
- `date` : **DateTime** - Date et heure du match.
- `location` : **String(200)** - Lieu précis (Stade, Terrain).
- `score_a` : **Integer** (Optionnel) - Score équipe A (Null avant le match).
- `score_b` : **Integer** (Optionnel) - Score équipe B (Null avant le match).
- `created_at` : **DateTime** - Date de création.
