# Scripts Utiles

## Génération de Données (Seed)
Le script **seed_data.py**
- utilise la bibliothèque : **Faker**
- le module:  **random**
pour générer rapidement des utilisateurs, des villes et des données de tournois réalistes (localisées au Québec).

**Exécution :**
```bash
python seed_data.py
```

## Réinitialisation de la Base de Données
Le script **reset_db.py** permet de réinitialiser complètement la base de données.

**Exécution :**
```bash
python reset_db.py
```

# Backend (Django)

### Démarrer un projet
```bash
django-admin startproject backend .
```

### Créer une app
```bash
python manage.py startapp JoinRequest
python manage.py startapp accounts
python manage.py startapp players
python manage.py startapp tournaments
python manage.py startapp matches
```

### Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Créer un superuser
```bash
python manage.py createsuperuser
```

### Lancer le serveur
```bash
python manage.py runserver
```

# Frontend (React + Vite)

### Installation
```bash
npm create vite@latest mon-app -- --template react
cd mon-app
npm install
```

### Lancer le serveur de développement
```bash
npm run dev
```
