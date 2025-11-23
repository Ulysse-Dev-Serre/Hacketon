```plaintext
AUTHENTICATION
└── GET /api/auth/me/    Get current user info✅ 

PROFILES
├── GET   /api/player/profile/    My player profile✅ 
└── PATCH /api/player/profile/    Update profile✅ 

TOURNAMENTS
├── POST /api/tournaments/        Create a tournament✅
├── GET  /api/tournaments/mine/   My tournaments✅ 
├── GET  /api/tournaments/:id/    Tournament details✅
└── GET  /api/tournaments/         All tournaments (with filters)✅🆕
       ├──?city={city_name}       Filter by city✅🆕
       ├──?sport={sport_name}     Filter by sport✅🆕
       └──?city={city}&sport={sport} Combined filters✅🆕
TEAMS
├── POST /api/teams/              Create a team✅
├── GET  /api/teams/available/    Available teams (with filters)✅
│      ├── ?city={city_name}      Filter by city✅
│      ├── ?sport={sport_name}    Filter by sport✅
│      └── ?city={city}&sport={sport} Combined filters✅
├── GET  /api/teams/:id/          Team details✅
├── GET  /api/teams/mine/         My teams (player)✅
└── GET  /api/teams/              All teams✅

JOIN REQUESTS
├── POST  /api/join-requests/           Send a join request                  ✅
├── GET   /api/join-requests/my-requests/ My join requests                   ✅
├── GET   /api/join-requests/           Received requests (organizer)        ✅ 
└── POST  /api/join-requests/:id/respond/ Accept/Reject request              ✅

MATCHES
├── POST  /api/matches/           Create a match✅
├── GET   /api/matches/my/        My matches✅
└── PATCH /api/matches/:id/       Update scores✅
     
```
✅ = tested
🔄 = waiting for testing
🆕 = new feature