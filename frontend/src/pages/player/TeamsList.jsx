import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, MapPin, Trophy, Calendar } from 'lucide-react';
import useApi from '../../api/axios';

const TeamsList = () => {
  const api = useApi();
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);
  
  const [filters, setFilters] = useState({
    search: '',
    sport: '',
    city: '',
    available_only: false
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Teams (with filters)
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.sport) params.append('sport', filters.sport);
        if (filters.city) params.append('city', filters.city);
        if (filters.available_only) params.append('available', 'true');

        const teamsRes = await api.get(`/teams/available/?${params.toString()}`);
        setTeams(teamsRes.data);

        // 2. Fetch Tournaments & Matches for sidebar
        // Only fetch once or if not dependent on team filters (usually independent)
        // We'll fetch them here to keep it simple
        const [tournamentsRes, matchesRes] = await Promise.all([
            api.get('/tournaments/'),
            api.get('/matches/')
        ]);
        setTournaments(tournamentsRes.data);
        setMatches(matchesRes.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        setTeams([]);
      }
    };

    const timeoutId = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Helper to get matches for a tournament
  const getTournamentMatches = (tournamentId) => {
    return matches
        .filter(m => m.team_a?.tournament === tournamentId) // Check if team object has tournament ID
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3); // Show top 3 matches
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 min-h-screen bg-[#CFCFCF]">

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT/MAIN COLUMN: TEAMS LIST */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* HEADER */}
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-[#2A800A]">Rejoindre une équipe</h1>
                <p className="text-[#737572]">Trouvez votre place et entrez dans la compétition</p>
            </div>

            {/* SEARCH + FILTERS */}
            <div className="flex flex-col gap-4">
                
                {/* SEARCH BAR */}
                <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                    type="text"
                    name="search"
                    placeholder="Rechercher une équipe..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="w-full bg-white border border-[#D0D0D0] rounded-lg pl-10 pr-4 py-2 text-gray-700 focus:outline-none focus:border-[#2A800A]"
                    />
                </div>

                {/* FILTER BUTTON */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition 
                    ${showFilters 
                        ? 'bg-[#2A800A] border-[#2A800A] text-white'
                        : 'bg-white border-[#D0D0D0] text-gray-700 hover:bg-gray-100'}
                    `}
                >
                    <Filter className="h-5 w-5" /> Filtres
                </button>
                </div>

                {/* FILTER PANEL */}
                {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-[#D0D0D0] shadow-sm">

                    {/* VILLE */}
                    <div>
                    <label className="block text-sm text-gray-600 mb-1">Ville</label>
                    <input
                        type="text"
                        name="city"
                        placeholder="Ex: Paris"
                        value={filters.city}
                        onChange={handleFilterChange}
                        className="w-full bg-white border border-[#D0D0D0] rounded px-3 py-2 text-gray-700 focus:border-[#2A800A]"
                    />
                    </div>

                    {/* SPORT */}
                    <div>
                    <label className="block text-sm text-gray-600 mb-1">Sport</label>
                    <select
                        name="sport"
                        value={filters.sport}
                        onChange={handleFilterChange}
                        className="w-full bg-white border border-[#D0D0D0] rounded px-3 py-2 text-gray-700 focus:border-[#2A800A]"
                    >
                        <option value="">Tous</option>
                        <option value="Football">Football</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Esport">Esport</option>
                    </select>
                    </div>

                    {/* CHECKBOX */}
                    <div className="flex items-center">
                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                        <input
                        type="checkbox"
                        name="available_only"
                        checked={filters.available_only}
                        onChange={handleFilterChange}
                        className="w-4 h-4 border-[#D0D0D0] text-[#2A800A]"
                        />
                        Places disponibles uniquement
                    </label>
                    </div>
                </div>
                )}
            </div>

            {/* TEAMS GRID */}
            <div className="grid md:grid-cols-2 gap-6">
                {teams.map((team) => (
                <div
                    key={team.id}
                    className="bg-white border border-[#D0D0D0] rounded-xl p-6 shadow-sm hover:border-[#2A800A] transition flex flex-col justify-between"
                >
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-12 w-12 bg-[#2A800A] text-white rounded-lg flex items-center justify-center font-bold text-lg">
                                {team.name.substring(0, 2).toUpperCase()}
                            </div>
                            {/* Can add tournament name here */}
                        </div>

                        <h3 className="text-xl font-bold text-[#2A800A] mb-2">{team.name}</h3>

                        <div className="space-y-2 text-gray-600 text-sm mb-6">
                            <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-[#2A800A]" />
                                {team.tournament?.name || 'Tournoi Inconnu'}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#2A800A]" /> {team.city}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-[#2A800A]" />
                                {team.current_capacity} / {team.max_capacity} Joueurs
                            </div>
                        </div>
                    </div>

                    <Link
                    to={`/teams/${team.id}`}
                    className="block w-full text-center py-2 border border-[#D0D0D0] rounded-lg text-gray-700 hover:bg-gray-100 transition"
                    >
                    Voir les détails
                    </Link>
                </div>
                ))}

                {teams.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-600 bg-white border border-[#D0D0D0] rounded-xl">
                    Aucune équipe trouvée correspondant à vos critères.
                </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: UPCOMING TOURNAMENTS */}
        <div className="space-y-6">
            <div className="bg-[#F2F2F2] rounded-xl border border-[#D0D0D0] p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-[#2A800A] mb-6 flex items-center gap-2">
                    <Calendar className="h-6 w-6" /> Prochain Tournoi
                </h2>

                <div className="space-y-8">
                    {tournaments.length > 0 ? (
                         tournaments.slice(0, 1).map(tournament => {
                            const tMatches = getTournamentMatches(tournament.id);
                            
                            return (
                                <div key={tournament.id} className="">
                                    <Link to={`/tournaments/${tournament.id}`} className="block mb-3">
                                        <h3 className="font-bold text-[#4A4A4A] hover:text-[#2A800A] text-lg">
                                            {tournament.name}
                                        </h3>
                                        <p className="text-xs text-[#737572]">{tournament.city} • {tournament.sport}</p>
                                    </Link>

                                    {tMatches.length > 0 ? (
                                        <div className="space-y-2">
                                            {tMatches.map(m => (
                                                <div key={m.id} className="bg-white p-2 rounded border border-[#E0E0E0] text-xs">
                                                    <div className="font-medium text-[#2A800A] mb-1">
                                                        {m.team_a?.name} <span className="text-[#737572]">vs</span> {m.team_b?.name}
                                                    </div>
                                                    <div className="flex justify-between text-[#737572]">
                                                        <span>{new Date(m.date).toLocaleDateString('fr-FR', {weekday:'short', day:'numeric', month:'short'})}</span>
                                                        <span>{new Date(m.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-[#737572] italic">Aucun match planifié.</p>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-[#737572] text-center">Aucun tournoi à venir.</p>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#D0D0D0] text-center">
                    <Link to="/tournaments" className="text-sm font-bold text-[#2A800A] hover:underline">
                        Voir tous les tournois
                    </Link>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default TeamsList;

