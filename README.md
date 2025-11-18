## **Wansu : Backend Django + Stripe**
- Installer Django + Django REST Framework
- Créer les endpoints API (produits, commandes, profils)
- Valider les JWT StackAuth côté Django
- Intégrer Stripe (sessions de paiement + webhook)
- Connecter Django à Neon Postgres
- Documenter les endpoints pour B

## **Meryem : Frontend React + Auth**
- Installer React + StackAuth (login/signup/logout)
- Créer l'UI (pages login, produits, checkout, confirmation)
- Mocker les API au début, puis connecter au vrai backend
- Gérer l'état global (Zustand ou Context)
- Envoyer les JWT dans les requêtes vers Django
- Intégrer le flow Stripe Checkout

## **Ulysse : Infra + DB + Intégration + Git**
- Configurer StackAuth (clés API, redirects)
- Créer la base Neon Postgres + tables (products, orders, profiles)
- Fournir un script SQL de seed data
- Tester la connexion Django ↔ Postgres ↔ StackAuth
- Déployer frontend + backend en prod
- Tests finaux du flow complet (E2E)
- **Gérer GitHub : créer les branches, reviewer et merger les PRs**

https://trello.com/b/L1D4h5Q8/groupe1

---

# backend

### Démarrer un projet Django
django-admin startproject backend .

### Créer une app Django (ex: payment, products, orders)
python manage.py startapp payment
python manage.py startapp products
python manage.py startapp orders


### Créer et appliquer les migrations
python manage.py makemigrations
python manage.py migrate

### Créer un superuser (admin Django)
python manage.py createsuperuser

### Lancer le serveur Django
python manage.py runserver
Accessible sur http://127.0.0.1:8000

# frontend

### install react + vite
npm create vite@latest mon-app -- --template react
cd mon-app
npm install
npm run dev




