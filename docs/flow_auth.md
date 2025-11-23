# Flux d'Authentification et Synchronisation des Rôles

Ce document détaille le fonctionnement technique de l'authentification entre le Frontend (React + Clerk) et le Backend (Django REST Framework), ainsi que la logique de mise à jour des rôles.

## 1. Le Token JWT (Frontend)

La gestion du token est centralisée dans `frontend/src/api/axios.js` grâce à un **intercepteur**.

1.  **Récupération** : Nous utilisons le hook `useAuth` de Clerk pour appeler `getToken()`.
2.  **Injection** : À chaque requête API, le token est automatiquement injecté dans les en-têtes HTTP :
    ```http
    Authorization: Bearer <TOKEN_JWT_CLERK>
    ```

## 2. Authentification et Synchronisation (Backend)

Côté Django, tout se passe dans `backend/config/authentication.py` via la classe `ClerkAuthentication`.

1.  **Interception** : Django lit le header `Authorization`.
2.  **Décodage** : Le JWT est décodé pour extraire le `clerk_id` (sub), l'email et le nom.
3.  **Auto-Sync (Get or Create)** :
    *   Le backend vérifie si cet utilisateur existe dans la table `users` (PostgreSQL).
    *   **Si non** : Il crée l'utilisateur instantanément avec un rôle par défaut (`role='player'`).
    *   **Si oui** : Il met à jour ses infos (email/nom) si nécessaire et connecte l'utilisateur à la requête (`request.user`).

## 3. Le Problème du Rôle et la Solution

Par défaut, un nouvel utilisateur est un **"player"**. Si l'utilisateur choisit d'être **"organizer"**, nous devons synchroniser ce choix entre Clerk et notre base de données.

### Le Workflow "Assign Role" :

1.  **Action Utilisateur** : L'utilisateur clique sur "Je suis Organisateur".
2.  **Mise à jour Clerk** : Le frontend met à jour les métadonnées de l'utilisateur côté Clerk (`unsafeMetadata.role`).
3.  **Appel API Backend** : Le frontend appelle immédiatement l'endpoint `POST /api/auth/update-role/`.
4.  **Persistance DB** : La vue Django `UpdateRoleView` reçoit la demande, vérifie le token, et force la mise à jour du champ `role` dans PostgreSQL.

```mermaid
sequenceDiagram
    participant U as User
    participant F as React (Frontend)
    participant C as Clerk (Auth)
    participant B as Django (Backend)
    participant DB as PostgreSQL

    U->>F: Clique sur "Je suis Organisateur"
    
    Note over F, C: Étape 1 : Métadonnées Clerk
    F->>C: user.update({ role: 'organizer' })
    C-->>F: Succès

    Note over F, DB: Étape 2 : Synchro Base de Données
    F->>F: getToken()
    F->>B: POST /api/auth/update-role/ { role: 'organizer' }
    
    Note right of F: Header: Bearer Token
    
    B->>B: ClerkAuthentication (Decode JWT)
    B->>DB: User.objects.get(clerk_id)
    B->>DB: user.role = 'organizer'; user.save()
    B-->>F: 200 OK

    F->>U: Redirection vers Dashboard
```
