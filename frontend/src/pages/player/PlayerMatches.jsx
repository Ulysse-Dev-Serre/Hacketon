import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Trophy } from 'lucide-react';
import api from '../../api/axios';

const PlayerMatches = () => {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches/my-teams/'); // 🔥 API réelle
        setMatches(res.data);
      } catch (error) {
        console.error('Erreur chargement matchs :', error);
        setMatches([]); // pas de données → vide (pas statique)
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Filtrage dynamique
  const filteredMatches = matches.filter((match) => {
    if (filter === 'upcoming') return match.status === 'scheduled';
    return match.status === 'completed';
  });

  return (
    <div className="max-w-4xl mx-auto py-6 min-h-screen bg-[#CFCFCF] px-4">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2A800A]">Mes Matchs</h1>
        <p className="text-[#737572]">Calendrier et résultats de vos équipes</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-[#737572]">
          Chargement des matchs...
        </div>
      )}

      {/* Filters */}
      {!loading && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors
              ${
                filter === 'upcoming'
                  ? 'bg-[#2A800A] text-white'
                  : 'bg-[#F2F2F2] text-[#737572] border border-[#D0D0D0] hover:bg-[#E5E5E5]'
              }`}
          >
            À venir
          </button>

          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors
              ${
                filter === 'past'
                  ? 'bg-[#2A800A] text-white'
                  : 'bg-[#F2F2F2] text-[#737572] border border-[#D0D0D0] hover:bg-[#E5E5E5]'
              }`}
          >
            Terminés
          </button>
        </div>
      )}

      {/* Matches List */}
      {!loading && (
        <div className="space-y-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <div
                key={match.id}
                className="bg-[#F2F2F2] border border-[#D0D0D0] rounded-xl p-6 shadow-sm"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1 w-full">
                    
                    {/* Dates */}
                    <div className="flex justify-between text-sm text-[#737572] mb-4">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> {match.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {match.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {match.location}
                      </span>
                    </div>

                    {/* VS Block */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-right flex-1">
                        <span className="block font-bold text-[#2A800A] text-lg">
                          {match.home}
                        </span>
                      </div>

                      <div className="px-4 py-2 bg-white border border-[#D0D0D0] rounded-lg font-mono font-bold text-[#2A800A]">
                        {match.score || 'VS'}
                      </div>

                      <div className="text-left flex-1">
                        <span className="block font-bold text-[#2A800A] text-lg">
                          {match.away}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-[#737572] bg-[#F2F2F2] rounded-xl border border-[#D0D0D0] border-dashed">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30 text-[#737572]" />
              <p>Aucun match {filter === 'upcoming' ? 'à venir' : 'terminé'}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerMatches;


