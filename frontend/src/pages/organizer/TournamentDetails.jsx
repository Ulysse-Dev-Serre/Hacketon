import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Users, ArrowLeft, Plus } from 'lucide-react';
import useApi from '../../api/axios';

const TournamentDetails = () => {
  const { id } = useParams();
  const api = useApi();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Standings State
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Tournament Details (includes teams)
        const tRes = await api.get(`/tournaments/${id}/`);
        const tData = tRes.data;
        setTournament(tData);

        // 2. Get All Matches (and filter by tournament)
        // Note: In a real app, we should have /api/matches/?tournament=ID
        const mRes = await api.get('/matches/');
        // Filter matches belonging to this tournament
        const tourneyMatches = mRes.data.filter(m => 
          tData.teams.some(team => team.id === m.team_a || team.id === m.team_b)
        );
        setMatches(tourneyMatches);

        // 3. Calculate Standings
        calculateStandings(tData.teams, tourneyMatches);

      } catch (error) {
        console.error("Error fetching tournament details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const calculateStandings = (teams, matches) => {
    // Initialize stats for each team
    const stats = {};
    teams.forEach(team => {
      stats[team.id] = { 
        id: team.id, 
        name: team.name, 
        wins: 0, 
        losses: 0, 
        draws: 0, 
        points: 0, 
        played: 0 
      };
    });

    // Process matches
    matches.forEach(match => {
      if (match.score_a !== null && match.score_b !== null) {
        // Match is played
        const teamA = stats[match.team_a]; // match.team_a is likely an ID
        const teamB = stats[match.team_b];

        if (teamA && teamB) {
          teamA.played++;
          teamB.played++;

          if (match.score_a > match.score_b) {
            teamA.wins++;
            teamA.points += 3;
            teamB.losses++;
          } else if (match.score_b > match.score_a) {
            teamB.wins++;
            teamB.points += 3;
            teamA.losses++;
          } else {
            teamA.draws++;
            teamA.points += 1;
            teamB.draws++;
            teamB.points += 1;
          }
        }
      }
    });

    // Convert to array and sort
    const sorted = Object.values(stats).sort((a, b) => b.points - a.points);
    setStandings(sorted);
  };

  if (loading) return <div className="p-10 text-center text-[#737572]">Chargement...</div>;
  if (!tournament) return <div className="p-10 text-center text-red-500">Tournoi introuvable</div>;

  return (
    <div className="min-h-screen bg-[#CFCFCF] py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation */}
        <Link to="/organizer/tournaments" className="flex items-center text-[#737572] hover:text-[#2A800A]">
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux tournois
        </Link>

        {/* Header */}
        <div className="bg-[#F2F2F2] border border-[#D0D0D0] rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#2A800A] mb-4">{tournament.name}</h1>
              <div className="flex flex-wrap gap-6 text-[#737572]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#2A800A]" />
                  {tournament.city}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#2A800A]" />
                  {tournament.start_date}
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#2A800A]" />
                  {tournament.sport}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
               <Link 
                  to={`/organizer/teams/create?tournament=${tournament.id}`}
                  className="px-4 py-2 bg-white border border-[#2A800A] text-[#2A800A] rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  + Ajouter Équipe
               </Link>
               <Link 
                  to="/organizer/matches/create"
                  className="px-6 py-2 bg-[#2A800A] hover:bg-[#256E08] text-white rounded-lg font-bold transition shadow-sm"
                >
                  Gérer les Matchs
               </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Standings */}
          <div className="md:col-span-2 bg-[#F2F2F2] border border-[#D0D0D0] rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#2A800A] mb-6 flex items-center gap-2">
              <Users className="h-5 w-5" /> Classement
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[#4A4A4A]">
                <thead>
                  <tr className="border-b border-[#D0D0D0]">
                    <th className="pb-4 font-medium pl-2">#</th>
                    <th className="pb-4 font-medium">Équipe</th>
                    <th className="pb-4 font-medium">J</th>
                    <th className="pb-4 font-medium text-green-600">V</th>
                    <th className="pb-4 font-medium text-red-600">D</th>
                    <th className="pb-4 font-medium text-gray-600">N</th>
                    <th className="pb-4 font-medium text-right pr-2">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D0D0D0]">
                  {standings.length > 0 ? standings.map((team, index) => (
                    <tr key={team.id} className="hover:bg-gray-100 transition">
                      <td className="py-4 pl-2 font-semibold">{index + 1}</td>
                      <td className="py-4 font-medium text-[#2A800A]">{team.name}</td>
                      <td className="py-4">{team.played}</td>
                      <td className="py-4 text-green-600">{team.wins}</td>
                      <td className="py-4 text-red-600">{team.losses}</td>
                      <td className="py-4 text-gray-600">{team.draws}</td>
                      <td className="py-4 text-right font-bold text-[#2A800A] pr-2">{team.points}</td>
                    </tr>
                  )) : (
                     <tr><td colSpan="7" className="py-4 text-center italic text-gray-500">Aucune équipe inscrite</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Matches List (Recent / Upcoming) */}
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
                      {/* We need to find team names from IDs since match object only has IDs */}
                      <span>{tournament.teams.find(t => t.id === match.team_a)?.name || 'Équipe A'}</span>
                      
                      {match.score_a !== null ? (
                         <span className="bg-[#2A800A] text-white px-2 py-1 rounded text-sm">
                           {match.score_a} - {match.score_b}
                         </span>
                      ) : (
                         <span className="text-xs bg-gray-200 px-2 py-1 rounded">VS</span>
                      )}

                      <span>{tournament.teams.find(t => t.id === match.team_b)?.name || 'Équipe B'}</span>
                    </div>
                 </div>
              )) : (
                 <p className="text-[#737572] italic text-center">Aucun match prévu.</p>
              )}
              
              <Link to="/organizer/matches/create" className="block w-full py-2 text-center text-sm text-[#2A800A] border border-[#2A800A] rounded hover:bg-green-50 transition mt-4">
                + Planifier un match
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
