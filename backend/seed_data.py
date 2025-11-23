import os
import django
import uuid
import random
from datetime import date, timedelta
from django.utils import timezone
from faker import Faker

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User
from players.models import PlayerProfile
from tournaments.models import Tournament, Team
from JoinRequest.models import JoinRequest
from matches.models import Match

fake = Faker(['fr_CA'])  # Use Quebec/Canada locale

def create_organizer():
    print("Creating or getting organizer...")
    # On utilise get_or_create pour ne pas crasher si l'organisateur existe déjà
    organizer, created = User.objects.get_or_create(
        clerk_id="user_org_main",
        defaults={
            "email": "organizer@hackathon.com",
            "full_name": "Alice Organisateur",
            "role": "organizer"
        }
    )
    if created:
        print("Organizer created.")
    else:
        print("Organizer already exists. Using existing one.")
    return organizer

def create_tournaments(organizer):
    print("Creating tournaments...")
    tournaments = []
    # On ajoute un suffixe aléatoire pour éviter les doublons de noms exacts si on relance, 
    # ou on accepte d'avoir plusieurs tournois avec le même nom (ce qui est autorisé par le modèle mais peut être confus).
    # Pour faire simple et additif, on crée toujours.
    
    tournament_data = [
        ("Ligue des Champions", "Football", "Montréal"),
        ("Tournoi Basket 3x3", "Basketball", "Québec"),
        ("Open de Tennis", "Tennis", "Laval")
    ]

    for name, sport, city in tournament_data:
        # Ajout d'un identifiant court pour distinguer les runs si on veut, 
        # mais gardons le propre. Le modèle n'a pas de contrainte unique sur le nom.
        t = Tournament.objects.create(
            name=f"{name} {fake.word()}", # Petit ajout pour varier si lancé plusieurs fois
            sport=sport,
            city=city,
            start_date=date.today() + timedelta(days=random.randint(7, 30)),
            organizer=organizer
        )
        tournaments.append(t)
    
    return tournaments

def create_teams(tournaments):
    print("Creating 8 teams...")
    teams = []
    
    # ... distribution ...
    distribution = [3, 3, 2]
    
    team_names_base = [
        "Les Tigres", "Les Lions", "Les Aigles", 
        "Les Requins", "Les Panthères", "Les Loups", 
        "Les Ours", "Les Faucons"
    ]
    
    name_idx = 0
    for i, t in enumerate(tournaments):
        # S'assurer qu'on ne dépasse pas l'index si distribution > tournois dispo
        if i >= len(distribution): break
        
        count = distribution[i]
        for _ in range(count):
            if name_idx < len(team_names_base):
                base_name = team_names_base[name_idx]
                name_idx += 1
            else:
                base_name = f"Équipe {name_idx+1}"
                name_idx += 1
            
            # Ajout d'un suffixe unique pour éviter confusion
            team_name = f"{base_name} {random.randint(100, 999)}"

            team = Team.objects.create(
                name=team_name,
                tournament=t,
                max_capacity=10
            )
            teams.append(team)
            
    return teams

def create_players_and_assign(teams):
    print("Creating 60 players and assigning to teams...")
    players = []
    
    levels = ["beginner", "intermediate", "advanced"]
    positions = ["Attaquant", "Défenseur", "Gardien", "Milieu", "Pivot", "Meneur"]

    # Pour éviter les collisions d'email/clerk_id, on utilise uuid/faker à chaque fois
    for _ in range(60):
        uid = uuid.uuid4().hex[:8]
        user = User.objects.create(
            clerk_id=f"user_player_{uid}",
            email=f"player_{uid}@example.com", # Email unique
            full_name=fake.name(),
            role="player"
        )
        
        PlayerProfile.objects.create(
            user=user,
            city=random.choice(["Montréal", "Québec", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Lévis", "Saguenay"]),
            favorite_sport=random.choice(["Football", "Basketball", "Tennis"]),
            level=random.choice(levels),
            position=random.choice(positions)
        )
        players.append(user)

    # Assign players to teams
    random.shuffle(players)
    
    if not teams:
        print("No teams to assign players to.")
        return players

    for i, player in enumerate(players):
        team_index = i % len(teams)
        team = teams[team_index]
        
        if not team.is_full:
            team.members.add(player)
            team.current_capacity += 1
            team.save()
            
    return players

def create_matches(tournaments):
    print("Creating matches (5 per tournament)...")
    
    for t in tournaments:
        t_teams = list(t.teams.all())
        
        if len(t_teams) < 2:
            print(f"Not enough teams in tournament {t.name} to create matches.")
            continue
            
        for _ in range(5):
            # Pick 2 different teams
            team_a, team_b = random.sample(t_teams, 2)
            
            # Random date within next month or past month
            days_delta = random.randint(-10, 20)
            match_date = timezone.now() + timedelta(days=days_delta)
            
            # Random score if in past
            score_a = None
            score_b = None
            if days_delta < 0:
                score_a = random.randint(0, 5)
                score_b = random.randint(0, 5)
            
            Match.objects.create(
                team_a=team_a,
                team_b=team_b,
                date=match_date,
                location=f"Stade de {t.city}",
                score_a=score_a,
                score_b=score_b
            )

def run_seed():
    # clean_database()  <-- Désactivé pour ne pas supprimer les données existantes
    organizer = create_organizer()
    tournaments = create_tournaments(organizer)
    teams = create_teams(tournaments)
    players = create_players_and_assign(teams)
    create_matches(tournaments)
    
    print("\nSeed completed successfully! 🌱")
    print(f"Generated: {len(players)} players, {len(teams)} teams, {len(tournaments)} tournaments.")

if __name__ == '__main__':
    run_seed()
