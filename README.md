Pour la réalisation de ce hackathon, nous avons séparé les rôles en trois :
- une personne pour le front-end, 
- une personne pour le back-end, 
- une personne DevOps, pour synchroniser le back et le front, créer les bases de données et configurer les différents dashboards (NEON, Clerk, Trello, GitHub, etc.).

Les points principaux du projet :

Nous avons 6 tables au total dans la base de données, mais 5 applications, car la table user est créée grâce au JWT de Clerk et configurée via le fichier authentification.py dans backend/config. (C'est la méthode `authenticate` de la classe `ClerkAuthentication` dans ce fichier qui intercepte chaque requête pour valider le token JWT Clerk et synchroniser l'utilisateur dans la base de données locale Django).

Ensuite, nous avons une interface responsive selon le rôle choisi par l’utilisateur lors de son inscription (joueur ou organisateur). Le front-end est capable de déterminer le rôle grâce à : `Navbar.jsx` (via le hook `useUser`) qui expose le rôle stocké dans les `unsafeMetadata`, permettant d'afficher conditionnellement le Dashboard ou l'interface Joueur.

La synchronisation avec le JWT a posé un défi de concurrence des données. Le middleware d'authentification (`backend/config/authentication.py`) réécrase les informations utilisateur (nom, email) dans la base de données locale avec les valeurs du token JWT à chaque requête pour assurer la cohérence. 
Cependant, cela crée un effet de bord : si un utilisateur modifie son profil via l'API, mais que son token JWT n'est pas immédiatement rafraîchi, le middleware détecte une "différence" et restaure les anciennes valeurs du token, annulant la modification en base.
Actuellement, nous contournons cela en privilégiant les métadonnées Clerk côté Frontend pour l'affichage (ex: rôle), mais la solution robuste serait d'utiliser des Webhooks Clerk pour synchroniser la base de données de manière asynchrone plutôt qu'à chaque requête.

Nous n’avons pas non plus eu le temps d’intégrer Stripe ni les différentes fonctionnalités de recherche avancée, en raison des autres tâches à avancer et du manque de temps pour cette partie.


## Les diferent role 

### **Wansu : Backend Django + Stripe**
- Installer Django + Django REST Framework
- Créer les endpoints API 
- Documenter les endpoints pour B
- Intégrer Stripe : sessions de paiement + webhook (optionel)

### **Meryem : Frontend React + Auth**
- Installer React + Clerk (login/signup/logout)
- Créer l'UI (pages login, produits, checkout, confirmation)
- Mocker les API au début, puis connecter au vrai backend
- Envoyer les JWT dans les requêtes vers Django
- Intégrer le flow Stripe Checkout(optionel)

### **Ulysse : Infra + DB + Intégration + Git**
- Configurer clerk (clés API, redirects)
- Créer la base Neon Postgres + tables (products, orders, profiles)
- Fournir un script SQL de seed data
- Valider les JWT Clerk côté Django
- Tester la connexion Django ↔ Postgres ↔ clerk
- **Gérer GitHub : créer les branches, reviewer et merger les PRs**

https://trello.com/b/L1D4h5Q8/groupe1

---






