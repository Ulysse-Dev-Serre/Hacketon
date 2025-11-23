# Guide de Test Utilisateur (End-to-End)

Ce guide décrit le scénario complet pour tester l'application manuellement en simulant les deux rôles : **Organisateur** et **Joueur**.

> **Prérequis :** Vous aurez besoin de **deux navigateurs différents** (ex: Chrome et Firefox) ou d'une fenêtre de navigation privée pour être connecté avec deux comptes distincts simultanément.

---

## 1. Rôle Organisateur (Navigateur A)
**Objectif :** Configurer un tournoi et créer une équipe.

1.  **Inscription/Connexion :**
    *   Allez sur la page d'accueil.
    *   Cliquez sur "Connexion".
    *   Une fois connecté, choisissez le rôle **"Je suis un Organisateur"**.
    *   *Résultat :* Redirection vers le **Tableau de bord** (`/organizer/dashboard`).

2.  **Créer un Tournoi :**
    *   Sur le dashboard, cliquez sur le bouton **"Créer un tournoi"**.
    *   Remplissez le formulaire :
        *   **Nom :** "Ligue d'Hiver 2025"
        *   **Sport :** "Football"
        *   **Ville :** "Montréal"
    *   Validez.
    *   *Résultat :* Le tournoi apparaît dans la liste "Mes Tournois".

3.  **Créer une Équipe :**
    *   Cliquez sur le tournoi que vous venez de créer pour voir ses détails.
    *   Cliquez sur le bouton **"Ajouter une équipe"** (ou via le dashboard "Créer une équipe").
    *   Remplissez les infos :
        *   **Nom :** "Les Aigles"
        *   **Capacité :** 12 joueurs
    *   Validez.
    *   *Résultat :* L'équipe est créée avec 0/12 joueurs.

---

## 2. Rôle Joueur (Navigateur B - Navigation Privée)
**Objectif :** Trouver une équipe, s'inscrire et postuler.

1.  **Inscription/Connexion :**
    *   Connectez-vous avec un **autre compte email**.
    *   Choisissez le rôle **"Je suis un Joueur"**.

2.  **Compléter le Profil :**
    *   Allez dans le menu **"Mon Profil"**.
    *   Remplissez les informations :
        *   **Ville :** "Montréal"
        *   **Sport favori :** "Football"
        *   **Niveau :** "Intermédiaire"
    *   Cliquez sur "Sauvegarder".

3.  **Rejoindre une équipe :**
    *   Allez dans le menu **"Tournois"** (ou "Rechercher").
    *   Trouvez le tournoi "Ligue d'Hiver 2025".
    *   Cliquez sur la carte du tournoi pour voir les détails.
    *   Dans la liste des équipes, trouvez "Les Aigles".
    *   Cliquez sur le nom de l'équipe (ou le bouton action).
    *   Sur la page de l'équipe, cliquez sur le bouton **"Rejoindre"**.
    *   Ajoutez un message : *"Je suis un attaquant motivé !"*.
    *   Envoyez.
    *   *Résultat :* Allez dans **"Mes Demandes"**, vous verrez votre demande avec un badge **"En attente"** (jaune).

---

## 3. Retour Organisateur (Navigateur A)
**Objectif :** Valider le joueur et vérifier l'effectif.

1.  **Gérer la demande :**
    *   Revenez sur votre Tableau de bord.
    *   Vérifiez le widget "Demandes en attente" (le compteur doit être à 1).
    *   Cliquez sur **"Gérer les demandes"**.
    *   Vous verrez la demande du Joueur avec son message.
    *   Cliquez sur le bouton **"Accepter"** (vert).

2.  **Vérifier l'équipe :**
    *   Allez dans "Mes Équipes" et cliquez sur "Les Aigles".
    *   *Résultat :*
        *   Le compteur de places affiche **1/12**.
        *   Le joueur apparaît dans la liste des membres ("Effectif").
    *   **Test Profil Public :** Cliquez sur le nom du joueur dans la liste.
    *   *Résultat :* Vous voyez la page "Profil Public" du joueur avec ses infos (Ville, Niveau, etc.).

---

## 4. Retour Joueur (Navigateur B)
**Objectif :** Confirmation finale.

1.  **Vérification :**
    *   Actualisez la page **"Mes Demandes"**.
    *   *Résultat :* Le statut est passé à **"Acceptée"** (badge vert).
    *   Retournez sur la page de l'équipe "Les Aigles".
    *   *Résultat :* Le bouton "Rejoindre" n'est plus là, vous voyez un indicateur que vous êtes membre.

---

## 5. Gestion des Matchs (Suite)

### Rôle Organisateur (Navigateur A)
**Objectif :** Créer un match et saisir les scores.

> **Prérequis :** Il faut au moins **deux équipes** dans le même tournoi pour créer un match. Créez une deuxième équipe (ex: "Les Tigres") dans le même tournoi si ce n'est pas déjà fait.

1.  **Créer un Match :**
    *   Allez sur le Tableau de bord et cliquez sur **"Gérer les Matchs"** (ou via le menu).
    *   Cliquez sur **"Nouveau Match"**.
    *   Remplissez le formulaire :
        *   **Tournoi :** "Ligue d'Hiver 2025"
        *   **Équipe A :** "Les Aigles"
        *   **Équipe B :** "Les Tigres"
        *   **Date :** Choisissez une date.
        *   **Lieu :** "Stade Olympique"
    *   Validez.
    *   *Résultat :* Le match apparaît dans la liste avec le statut "À venir".

2.  **Saisir le Score :**
    *   Dans la liste des matchs, trouvez le match créé.
    *   Cliquez sur le bouton **"Saisir Score"** (icône crayon).
    *   Entrez les scores (ex: Aigles **2** - Tigres **1**).
    *   Sauvegardez.
    *   *Résultat :* Le score est affiché sur la carte du match.

### Rôle Joueur (Navigateur B)
**Objectif :** Voir ses matchs.

1.  **Consulter les Matchs :**
    *   Allez dans le menu **"Mes Matchs"**.
    *   *Résultat :*
        *   Vous devez voir le match "Les Aigles vs Les Tigres".
        *   Vous devez voir le score **2 - 1** que l'organisateur vient de saisir.
        *   Vous devez voir les détails (Date, Lieu).
