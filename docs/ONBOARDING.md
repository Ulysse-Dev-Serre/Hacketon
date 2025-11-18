#  Guide de Démarrage Hackathon - Team 1
Stack technique : **Django (Backend)** + **React/Vite (Frontend)** + **PostgreSQL (Neon)** + **Clerk (Auth)**.

##  Installation & Démarrage Rapide

### 1. Cloner le projet

---

###  Backend (Pour Wansu)

** Dossier :** `/backend`

> ** Note importante :**
> Les applications (`products`, `orders`, `profiles`) et les migrations actuelles ont été créées uniquement pour **valider la connexion Infrastructure** (Django ↔ Neon Postgres ↔ Clerk).
>
> **L'infrastructure est prête, mais le schéma de données est flexible.**
> on peut modifier les modèles, supprimer les migrations ou refaire la structure selon le sujet du Hackathon vendredi. Tout est prêt à être édité.

**Configuration :**

1.  **Créer le fichier `.env`** dans `backend/` (copier `.env.example` ou demander les clés à Ulysse) :
    ```ini
    DATABASE_URL=postgres://...  (Lien Neon Tech)
    CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    ```

2.  **Lancer le serveur :**
    ```bash
    cd backend

    # 1. Activer l'environnement virtuel
    # Windows :
    source myenv/Scripts/activate
    # Mac/Linux :
    source myenv/bin/activate

    # 2. Installer les dépendances
    pip install -r requirements.txt

    # 3. Lancer le serveur
    python manage.py runserver
    ```

---

###  Frontend (Pour Meryem)

** Dossier :** `/frontend`

> **Info :**
> React est configuré avec **Vite** et **Tailwind CSS**.
> Le SDK **Clerk** est déjà installé et configuré dans `main.jsx`.

**Configuration :**

1.  **Créer le fichier `.env`** dans `frontend/` (demander la clé à Ulysse) :
    ```ini
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
    ```

2.  **Lancer le serveur de dev :**
    ```bash
    cd frontend

    npm install
    npm run dev
    ```

---

###  Authentification (Infos Infra)

L'authentification est gérée par **Clerk**.
- **Frontend :** Utilise `<ClerkProvider>` et les composants `<SignIn>`, `<UserButton>`.
- **Backend :** Une classe `ClerkAuthentication` (dans `config/authentication.py`) vérifie les JWT entrants.
