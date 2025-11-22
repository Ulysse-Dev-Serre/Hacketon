import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Plus, Trash2, Calendar, MapPin } from 'lucide-react';
import useApi from '../../api/axios';

const Matches = () => {
  const api = useApi();
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'scheduled', 'completed'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches/mine/'); // 🔥 DY-NAMIC
        setMatches(res.data);
      } catch (error) {
        console.error('Erreur chargement matchs :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
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

  const filteredMatches = matches.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  if (loading)
    return <p className="text-center text-[#737572] py-10">Chargement...</p>;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2A800A]">Gestion des Matchs</h1>
          <p className="text-[#737572]">Planifiez et gérez les rencontres</p>
        </div>

        <Link
          to="/organizer/matches/create"
          className="flex items-center gap-2 bg-[#2A800A] hover:bg-[#256E08] text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="h-5 w-5" /> Nouveau Match
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">
        {['all', 'scheduled', 'completed'].map((btn) => (
          <button
            key={btn}
            onClick={() => setFilter(btn)}
            className={`px-4 py-2 rounded-lg font-medium transition 
              ${filter === btn
                ? "bg-[#2A800A] text-white"
                : "bg-[#E5E5E5] text-[#737572] hover:bg-[#D9D9D9]"
              }`}
          >
            {btn === 'all' && 'Tous'}
            {btn === 'scheduled' && 'À venir'}
            {btn === 'completed' && 'Terminés'}
          </button>
        ))}
      </div>

      {/* MATCHES LIST */}
      <div className="space-y-4">

        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className="bg-white border border-[#D0D0D0] rounded-xl p-6 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

              {/* MATCH INFOS */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-4 text-sm text-[#737572] mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> 
                    {match.date} - {match.time}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> 
                    {match.location}
                  </span>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-6 text-xl font-bold text-[#2A800A]">
                  <span className="w-32 text-right truncate">{match.team_a}</span>

                  <span
                    className={`px-4 py-2 rounded-lg border font-mono 
                      ${match.status === "completed"
                        ? "bg-[#F2F2F2] border-[#D0D0D0] text-[#2A800A]"
                        : "bg-[#EDEDED] border-[#D0D0D0] text-[#737572]"
                      }`}
                  >
                    {match.status === "completed"
                      ? `${match.score_a} - ${match.score_b}`
                      : "VS"}
                  </span>

                  <span className="w-32 text-left truncate">{match.team_b}</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 border-[#D0D0D0] pt-4 lg:pt-0">

                {/* ENTER SCORE */}
                {match.status === "scheduled" ? (
                  <Link
                    to={`/organizer/matches/${match.id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E5F6E0] text-[#2A800A] border border-[#2A800A] rounded-lg hover:bg-[#D3EECF] transition"
                  >
                    <Edit2 className="h-4 w-4" /> Saisir Score
                  </Link>
                ) : (
                  <Link
                    to={`/organizer/matches/${match.id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 bg-[#EDEDED] text-[#737572] border border-[#D0D0D0] rounded-lg hover:bg-[#D9D9D9] transition"
                  >
                    <Edit2 className="h-4 w-4" /> Modifier
                  </Link>
                )}

                {/* DELETE */}
                <button
                  onClick={() => handleDelete(match.id)}
                  className="p-2 bg-red-100 text-red-600 hover:bg-red-200 border border-red-300 rounded-lg transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

              </div>
            </div>
          </div>
        ))}

        {filteredMatches.length === 0 && (
          <div className="text-center py-12 text-[#737572] bg-white border border-[#D0D0D0] rounded-xl">
            Aucun match trouvé.
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;

