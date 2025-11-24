```plaintext
AUTHENTICATION
├── GET  /api/auth/me/              Get current user info ✅
├── POST /api/auth/update-role/     Update user role (player/organizer) ✅


PLAYER PROFILES
├── GET   /api/player/profile/      Get authenticated user's player profile ✅🆕
├── PATCH /api/player/profile/      Update authenticated user's player profile ✅🆕
└── GET   /api/players/:user_id/    Get public player profile by user_id ✅🆕

TOURNAMENTS
├── GET   /api/tournaments/                  List all tournaments (with filters) ✅🆕
│        ├── ?city={city_name}              Filter by city ✅🆕
│        └── ?sport={sport_name}            Filter by sport ✅🆕
├── POST  /api/tournaments/                  Create a tournament (organizer only) ✅
├── GET   /api/tournaments/mine/             Get user's tournaments (organizer) ✅
├── GET   /api/tournaments/:id/              Get tournament details (with teams array) ✅
└── GET   /api/tournaments/:id/my_stats/    Get organizer stats for tournament ✅🆕

ORGANIZER DASHBOARD
└── GET   /api/organizer/dashboard/        Get organizer dashboard stats (tournaments, teams, matches, requests) ✅ 

TEAMS
├── GET   /api/teams/                        List all teams ✅
├── POST  /api/teams/                        Create a team (organizer only) ✅
├── GET   /api/teams/available/              List available teams (current_capacity < max_capacity) ✅
│        ├── ?city={city_name}              Filter by city ✅
│        └── ?sport={sport_name}            Filter by sport ✅
├── GET   /api/teams/mine/                   Get user's teams (role-based: organizer teams or joined teams) ✅
├── GET   /api/teams/:id/                    Get team details (with members list) ✅
├── PATCH /api/teams/:id/                    Update team (organizer only) ✅🆕
└── DELETE /api/teams/:id/                   Delete team (organizer only) ✅🆕

JOIN REQUESTS
├── POST  /api/join-requests/           Send a join request ✅               
├── GET   /api/join-requests/           Received requests (organizer) ✅ 
├── GET   /api/join-requests/my-requests/ My join requests (player) ✅                  
├── PATCH /api/join-requests/:id/       Update join request ✅
├── DELETE /api/join-requests/:id/      Delete join request ✅
└── POST  /api/join-requests/:id/respond/ Accept/Reject request (organizer only) ✅
          Body: {"action": "accept"} or {"action": "reject"}

MATCHES
├── GET   /api/matches/                      List all matches (public) ✅🆕
├── POST  /api/matches/                      Create a match (organizer only) ✅
├── GET   /api/matches/my/                   Get user's matches (organizer: tournament matches, player: team matches) ✅
├── GET   /api/matches/:id/                  Get match details ✅🆕
├── PATCH /api/matches/:id/                  Update match details (organizer only) ✅
├── PATCH /api/matches/:id/update_scores/   Update match scores (organizer only) ✅🆕
│         Body: {"score_a": number, "score_b": number}
└── DELETE /api/matches/:id/                 Delete match (organizer only) ✅🆕
     
```
✅ = tested
🔄 = waiting for testing
🆕 = new feature