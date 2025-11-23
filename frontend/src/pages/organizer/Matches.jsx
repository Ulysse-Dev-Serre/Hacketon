import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Plus, Trash2, Calendar, MapPin, Clock, Filter, Trophy } from 'lucide-react';
import useApi from '../../api/axios';

const Matches = () => {
  const api = useApi();
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'upcoming', 'completed'
  const [filterTournament, setFilterTournament] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Parallel fetch
        const [matchesRes, tournamentsRes] = await Promise.all([
            api.get('/matches/my/'),
            api.get('/tournaments/mine/')
        ]);
        setMatches(matchesRes.data);
        setTournaments(tournamentsRes.data);
      } catch (error) {
        console.error('Erreur chargement :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce match ?")) return;

    try {
      await api.delete(`/matches/${id}/`);
      setMatches(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  // Filter Logic
  const filteredMatches = matches.filter((m) => {
    const isCompleted = m.score_a !== null && m.score_b !== null;
    const tournamentMatch = m.team_a?.tournament === filterTournament || m.team_a_tournament_id === filterTournament; // Check data structure

    // Status Filter
    if (filterStatus === 'upcoming' && isCompleted) return false;
    if (filterStatus === 'completed' && !isCompleted) return false;

    // Tournament Filter
    if (filterTournament !== 'all') {
        // Assuming team objects have tournament ID, or we need to check how data is structured.
        // Based on serializers, team object has 'tournament' field which is an ID.
        if (m.team_a?.tournament !== filterTournament) return false;
    }

    return true;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group by Date
  const groupedMatches = filteredMatches.reduce((acc, match) => {
    const dateKey = new Date(match.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {});

  if (loading)
    return <p className="text-center text-[#737572] py-10">Chargement...</p>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 min-h-screen bg-[#CFCFCF]">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2A800A]">Gestion des Matchs</h1>
          <p className="text-[#737572]">Planifiez et suivez les résultats</p>
        </div>

        <Link
          to="/organizer/matches/create"
          className="flex items-center gap-2 bg-[#2A800A] hover:bg-[#256E08] text-white px-6 py-3 rounded-xl shadow-lg transition font-medium"
        >
          <Plus className="h-5 w-5" /> Nouveau Match
        </Link>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-[#F2F2F2] p-4 rounded-xl border border-[#D0D0D0] shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Status Tabs */}
        <div className="flex bg-[#E5E5E5] p-1 rounded-lg w-full md:w-auto">
            {[
                { id: 'all', label: 'Tous' },
                { id: 'upcoming', label: 'À venir' },
                { id: 'completed', label: 'Terminés' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition flex-1 md:flex-none text-center
                        ${filterStatus === tab.id ? 'bg-white text-[#2A800A] shadow-sm' : 'text-[#737572] hover:text-[#4A4A4A]'}
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Tournament Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-5 w-5 text-[#737572]" />
            <select 
                className="bg-white border border-[#D0D0D0] text-[#4A4A4A] text-sm rounded-lg focus:ring-[#2A800A] focus:border-[#2A800A] block w-full p-2.5"
                value={filterTournament}
                onChange={(e) => setFilterTournament(e.target.value)}
            >
                <option value="all">Tous les tournois</option>
                {tournaments.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>
        </div>
      </div>

      {/* MATCHES LIST (Grouped) */}
      <div className="space-y-8">
        {Object.keys(groupedMatches).length > 0 ? (
            Object.entries(groupedMatches).map(([date, matches]) => (
                <div key={date}>
                    <h3 className="text-lg font-bold text-[#4A4A4A] mb-4 capitalize flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#2A800A]" /> {date}
                    </h3>
                    <div className="space-y-3">
                        {matches.map((match) => (
                            <div key={match.id} className="bg-white border border-[#D0D0D0] rounded-xl p-4 hover:shadow-md transition group">
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    
                                    {/* Time & Location */}
                                    <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-1 min-w-[140px] text-[#737572]">
                                        <div className="flex items-center gap-2 font-mono font-bold text-lg text-[#2A800A]">
                                            {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                            <MapPin className="h-3 w-3" /> {match.location}
                                        </div>
                                        <div className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 mt-1 truncate max-w-[120px]">
                                            {tournaments.find(t => t.id === match.team_a?.tournament)?.name}
                                        </div>
                                    </div>

                                    {/* Teams VS */}
                                    <div className="flex-1 flex items-center justify-center gap-4 w-full">
                                        <div className="flex-1 text-right font-bold text-[#4A4A4A] text-lg truncate">
                                            {match.team_a?.name}
                                        </div>
                                        
                                        <div className={`px-3 py-1 rounded-lg font-mono font-bold min-w-[80px] text-center
                                            ${match.score_a !== null ? 'bg-[#2A800A] text-white' : 'bg-[#F2F2F2] text-[#737572] border border-[#D0D0D0]'}
                                        `}>
                                            {match.score_a !== null ? `${match.score_a} - ${match.score_b}` : 'VS'}
                                        </div>

                                        <div className="flex-1 text-left font-bold text-[#4A4A4A] text-lg truncate">
                                            {match.team_b?.name}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 w-full md:w-auto justify-end mt-4 md:mt-0 border-t md:border-t-0 border-[#E0E0E0] pt-3 md:pt-0">
                                        {match.score_a === null ? (
                                            <Link 
                                                to={`/organizer/matches/${match.id}/edit`}
                                                className="bg-[#E5F6E0] hover:bg-[#D3EECF] text-[#2A800A] p-2 rounded-lg transition"
                                                title="Saisir le score"
                                            >
                                                <Trophy className="h-5 w-5" />
                                            </Link>
                                        ) : (
                                            <Link 
                                                to={`/organizer/matches/${match.id}/edit`}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition"
                                                title="Modifier le score"
                                            >
                                                <Edit2 className="h-5 w-5" />
                                            </Link>
                                        )}
                                        
                                        <button 
                                            onClick={() => handleDelete(match.id)}
                                            className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-lg transition"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[#F2F2F2] rounded-xl border border-[#D0D0D0] border-dashed">
                <Trophy className="h-16 w-16 text-[#D0D0D0] mb-4" />
                <h3 className="text-xl font-bold text-[#737572]">Aucun match trouvé</h3>
                <p className="text-gray-500 mb-6">Essayez de modifier vos filtres ou créez un nouveau match.</p>
                <Link
                    to="/organizer/matches/create"
                    className="bg-[#2A800A] text-white px-6 py-2 rounded-lg hover:bg-[#256E08] transition"
                >
                    Créer un match
                </Link>
            </div>
        )}
      </div>

    </div>
  );
};

export default Matches;

