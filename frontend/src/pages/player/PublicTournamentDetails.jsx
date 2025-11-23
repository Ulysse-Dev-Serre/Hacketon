import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';
import useApi from '../../api/axios';

const PublicTournamentDetails = () => {
  const { id } = useParams();
  const api = useApi();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tRes = await api.get(`/tournaments/${id}/`);
        const tData = tRes.data;
        setTournament(tData);

        const mRes = await api.get('/matches/');
        const tourneyMatches = mRes.data.filter(m => 
          tData.teams.some(team => team.id === m.team_a?.id || team.id === m.team_b?.id)
        );
        setMatches(tourneyMatches);
      } catch (error) {
        console.error("Error fetching tournament:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-[#737572]">Chargement...</div>;
  if (!tournament) return <div className="p-10 text-center text-red-500">Tournoi introuvable</div>;

  return (
    <div className="min-h-screen bg-[#CFCFCF] py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <Link to="/player/tournaments" className="flex items-center text-[#737572] hover:text-[#2A800A]">
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux tournois
        </Link>

        {/* Header */}
        <div className="bg-[#F2F2F2] border border-[#D0D0D0] rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[#2A800A] mb-4">{tournament.name}</h1>
          <div className="flex flex-wrap gap-6 text-[#737572]">
             <div className="flex items-center gap-2"><MapPin className="h-5 w-5" />{tournament.city}</div>
             <div className="flex items-center gap-2"><Calendar className="h-5 w-5" />{tournament.start_date}</div>
             <div className="flex items-center gap-2"><Trophy className="h-5 w-5" />{tournament.sport}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-8">
          
          {/* Matches List */}
          <div className="bg-[#F2F2F2] border border-[#D0D0D0] rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#2A800A] mb-6">Matchs</h2>
            <div className="space-y-4">
              {matches.length > 0 ? matches.map(match => (
                 <div key={match.id} className="bg-white border border-[#D0D0D0] rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between text-xs text-[#737572] mb-2">
                      <span>{new Date(match.date).toLocaleDateString()}</span>
                      <span>{match.location}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-[#4A4A4A]">
                      {/* Utilisation directe des objets team_a / team_b présents dans le match */}
                      <span className="flex-1 text-right">{match.team_a?.name || 'Eq. A'}</span>
                      
                      <div className="mx-4 min-w-[60px] text-center">
                        {match.score_a !== null ? (
                           <span className="bg-[#2A800A] text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                             {match.score_a} - {match.score_b}
                           </span>
                        ) : (
                           <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">VS</span>
                        )}
                      </div>

                      <span className="flex-1 text-left">{match.team_b?.name || 'Eq. B'}</span>
                    </div>
                 </div>
              )) : <p className="text-[#737572] italic text-center">Aucun match prévu.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PublicTournamentDetails;
