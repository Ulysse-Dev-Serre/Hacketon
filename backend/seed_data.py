import os
import django
import random
from datetime import date, datetime, timedelta
from django.utils import timezone

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User
from players.models import PlayerProfile
from tournaments.models import Tournament, Team
from JoinRequest.models import JoinRequest
from matches.models import Match

def clean_database():
    print("Cleaning database...")
    JoinRequest.objects.all().delete()
    Match.objects.all().delete()
    Team.objects.all().delete()
    Tournament.objects.all().delete()
    PlayerProfile.objects.all().delete()
    User.objects.all().delete()
    print("Database cleaned.")

def create_users_and_profiles():
    print("Creating users and profiles...")
    users = []
    
    # 1. Create Organizers
    organizer = User.objects.create(
        clerk_id="user_org_001",
        email="organizer@example.com",
        full_name="Alice Organizer",
        role="organizer"
    )
    users.append(organizer)

    # 2. Create Players
    player_names = [
        "Bob Striker", "Charlie Goalie", "David Defender", "Eve Midfield", 
        "Frank Forward", "Grace Guard", "Hank Hammer", "Ivy Intercept"
    ]
    
    cities = ["Paris", "Lyon", "Marseille", "Bordeaux"]
    positions = ["Attaquant", "Défenseur", "Gardien", "Milieu"]
    levels = ["beginner", "intermediate", "advanced"]

    players_list = []

    for i, name in enumerate(player_names):
        user = User.objects.create(
            clerk_id=f"user_player_{i+1:03d}",
            email=f"player{i+1}@example.com",
            full_name=name,
            role="player"
        )
        users.append(user)
        players_list.append(user)

        # Create associated PlayerProfile
        PlayerProfile.objects.create(
            user=user,
            city=random.choice(cities),
            favorite_sport="Football",
            level=random.choice(levels),
            position=random.choice(positions)
        )
    
    print(f"Created {len(users)} users.")
    return organizer, players_list

def create_tournament_and_teams(organizer, players):
    print("Creating tournament and teams...")
    
    # Create Tournament
    tournament = Tournament.objects.create(
        name="Ligue des Champions Hackathon",
        sport="Football",
        city="Paris",
        start_date=date.today() + timedelta(days=7),
        organizer=organizer
    )

    # Create Teams
    team_names = ["Les Tigres", "Les Lions", "Les Aigles", "Les Requins"]
    teams = []

    for name in team_names:
        team = Team.objects.create(
            name=name,
            tournament=tournament,
            max_capacity=5
        )
        teams.append(team)

    # Assign some players to teams (leave some free for join requests)
    # Tigres gets 2 players
    teams[0].members.add(players[0], players[1])
    teams[0].current_capacity = 2
    teams[0].save()

    # Lions gets 2 players
    teams[1].members.add(players[2], players[3])
    teams[1].current_capacity = 2
    teams[1].save()

    print(f"Created tournament '{tournament.name}' with {len(teams)} teams.")
    return tournament, teams

def create_join_requests(players, teams):
    print("Creating join requests...")
    
    # Players[4] wants to join 'Les Tigres' (Pending)
    JoinRequest.objects.create(
        player=players[4],
        team=teams[0],
        status='pending',
        message="Salut, je suis un super attaquant, prenez-moi !"
    )

    # Players[5] wanted to join 'Les Lions' (Accepted - simulates history)
    # Note: In a real app, accepting would add to members. Here we just log the request.
    JoinRequest.objects.create(
        player=players[5],
        team=teams[1],
        status='accepted',
        message="J'ai déjà joué avec vous l'an dernier."
    )

    # Players[6] wanted to join 'Les Aigles' (Rejected)
    JoinRequest.objects.create(
        player=players[6],
        team=teams[2],
        status='rejected',
        message="Je débute."
    )

    print("Created 3 join requests.")

def create_matches(teams):
    print("Creating matches...")
    
    # Match 1: Tigres vs Lions (Scheduled for tomorrow)
    Match.objects.create(
        team_a=teams[0],
        team_b=teams[1],
        date=timezone.now() + timedelta(days=1),
        location="Stade Charléty, Paris"
    )

    # Match 2: Aigles vs Requins (Past match with score)
    Match.objects.create(
        team_a=teams[2],
        team_b=teams[3],
        date=timezone.now() - timedelta(days=2),
        location="Parc des Princes, Paris",
        score_a=2,
        score_b=1
    )

    print("Created 2 matches.")

def run_seed():
    clean_database()
    organizer, players = create_users_and_profiles()
    tournament, teams = create_tournament_and_teams(organizer, players)
    create_join_requests(players, teams)
    create_matches(teams)
    print("\nSeed completed successfully! 🌱")

if __name__ == '__main__':
    run_seed()
