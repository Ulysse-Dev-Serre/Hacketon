import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/general/Home';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AssignRole from './pages/auth/AssignRole';

// Player Pages
import Profile from './pages/player/Profile';
import TeamsList from './pages/player/TeamsList';
import TeamDetails from './pages/player/TeamDetails';
import MyRequests from './pages/player/MyRequests';
import PlayerMatches from './pages/player/PlayerMatches';

// Organizer Pages
import Dashboard from './pages/organizer/Dashboard';
import Tournaments from './pages/organizer/Tournaments';
import TournamentCreate from './pages/organizer/TournamentCreate';
import TournamentDetails from './pages/organizer/TournamentDetails';
import TeamCreate from './pages/organizer/TeamCreate';
import RequestsReceived from './pages/organizer/RequestsReceived';
import Matches from './pages/organizer/Matches';
import MatchCreate from './pages/organizer/MatchCreate';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login/*" element={<SignIn />} />
        <Route path="register/*" element={<SignUp />} />
        <Route path="assign-role" element={<AssignRole />} />

        {/* Player Routes */}
        {/* Note: Adjust allowedRoles based on your auth implementation */}
        <Route element={<ProtectedRoute allowedRoles={['player']} />}>
            <Route path="player/profile" element={<Profile />} />
            <Route path="teams" element={<TeamsList />} />
            <Route path="teams/:id" element={<TeamDetails />} />
            <Route path="my-requests" element={<MyRequests />} />
            <Route path="player/matches" element={<PlayerMatches />} />
        </Route>

        {/* Organizer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
            <Route path="organizer/dashboard" element={<Dashboard />} />
            <Route path="organizer/tournaments" element={<Tournaments />} />
            <Route path="organizer/tournaments/create" element={<TournamentCreate />} />
            <Route path="organizer/tournaments/:id" element={<TournamentDetails />} />
            <Route path="organizer/teams/create" element={<TeamCreate />} />
            <Route path="organizer/requests" element={<RequestsReceived />} />
            <Route path="organizer/matches" element={<Matches />} />
            <Route path="organizer/matches/create" element={<MatchCreate />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
