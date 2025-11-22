import React from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Users } from 'lucide-react';

const TournamentDetails = () => {
  const { id } = useParams();

  // Mock data
  const tournament = {
    id: id,
    name: 'Summer Cup 2025',
    location: 'Paris, France',
    dates: '10 - 25 Juin 2025',
    status: 'En cours',
    teams: [
      { id: 1, name: 'Paris United', wins: 2, losses: 0 },
      { id: 2, name: 'Lyon Warriors', wins: 1, losses: 1 },
      { id: 3, name: 'Marseille Titans', wins: 0, losses: 2 },
      { id: 4, name: 'Bordeaux Eagles', wins: 1, losses: 1 },
    ]
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">{tournament.name}</h1>
            <div className="flex flex-wrap gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-500" />
                {tournament.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                {tournament.dates}
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-indigo-500" />
                {tournament.status}
              </div>
            </div>
          </div>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-indigo-500/20">
            Gérer le bracket
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Standings */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="h-5 w-5" /> Classement
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-400">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="pb-4 font-medium">#</th>
                  <th className="pb-4 font-medium">Équipe</th>
                  <th className="pb-4 font-medium">V</th>
                  <th className="pb-4 font-medium">D</th>
                  <th className="pb-4 font-medium text-right">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {tournament.teams.map((team, index) => (
                  <tr key={team.id}>
                    <td className="py-4">{index + 1}</td>
                    <td className="py-4 font-medium text-white">{team.name}</td>
                    <td className="py-4 text-green-400">{team.wins}</td>
                    <td className="py-4 text-red-400">{team.losses}</td>
                    <td className="py-4 text-right font-bold text-white">{team.wins * 3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Derniers Matchs</h2>
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Match de poule</span>
                <span>Hier</span>
              </div>
              <div className="flex justify-between items-center font-bold text-white">
                <span>Paris United</span>
                <span className="text-indigo-400">2 - 0</span>
                <span>Lyon Warriors</span>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Match de poule</span>
                <span>Avant-hier</span>
              </div>
              <div className="flex justify-between items-center font-bold text-white">
                <span>Marseille Titans</span>
                <span className="text-indigo-400">1 - 3</span>
                <span>Bordeaux Eagles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
