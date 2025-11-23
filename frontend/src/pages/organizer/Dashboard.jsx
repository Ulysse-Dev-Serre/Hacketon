import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, Activity, Plus, ArrowRight } from 'lucide-react';
import useApi from '../../api/axios';

const Dashboard = () => {
  const api = useApi();
  const [stats, setStats] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel fetch for speed
        const [statsRes, tournamentsRes, teamsRes] = await Promise.all([
          api.get('/organizer/dashboard/'),
          api.get('/tournaments/mine/'),
          api.get('/teams/mine/')
        ]);
        
        setStats(statsRes.data.stats);
        setTournaments(tournamentsRes.data);
        setTeams(teamsRes.data);
      } catch (error) {
        console.error("Erreur chargement Dashboard :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#CFCFCF] flex items-center justify-center text-[#737572] text-xl">
        Chargement du tableau de bord...
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 px-4 min-h-screen bg-[#CFCFCF]">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2A800A]">Tableau de bord</h1>
          <p className="text-[#737572]">Bienvenue, Organisateur</p>
        </div>

        <Link 
          to="/organizer/tournaments/create" 
          className="flex items-center gap-2 bg-[#2A800A] hover:bg-[#256E08] text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="h-5 w-5" /> Créer un tournoi
        </Link>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Tournois créés", value: stats.tournaments, icon: Trophy },
            { label: "Équipes totales", value: stats.teams, icon: Users },
            { label: "Matchs à venir", value: stats.upcoming_matches, icon: Calendar },
            { label: "Demandes en attente", value: stats.requests, icon: Activity }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-[#F2F2F2] p-6 rounded-xl border border-[#D0D0D0] shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-white border border-[#D0D0D0]">
                  <stat.icon className="h-6 w-6 text-[#2A800A]" />
                </div>
                <span className="text-2xl font-bold text-[#2A800A]">{stat.value}</span>
              </div>

              <h3 className="text-[#737572] font-medium">{stat.label}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity / Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Tournaments List (Full) */}
        <div className="bg-[#F2F2F2] rounded-xl border border-[#D0D0D0] p-6 shadow-sm">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#2A800A]">Mes Tournois</h2>
            <Link 
              to="/organizer/tournaments/create" 
              className="text-sm text-[#2A800A] hover:underline font-medium"
            >
              + Créer
            </Link>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {tournaments.length > 0 ? (
              tournaments.map((t) => (
                <Link 
                  key={t.id}
                  to={`/organizer/tournaments/${t.id}`}
                  className="block p-4 bg-white rounded-lg border border-[#D0D0D0] hover:bg-[#EDEDED] transition group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#2A800A] group-hover:text-green-700">{t.name}</h3>
                      <div className="flex gap-3 text-sm text-[#737572] mt-1">
                        <span>{t.city}</span>
                        <span>•</span>
                        <span>{t.sport}</span>
                      </div>
                    </div>
                    
                    <ArrowRight className="h-5 w-5 text-[#D0D0D0] group-hover:text-[#2A800A]" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[#737572] mb-4">Aucun tournoi.</p>
                <Link 
                  to="/organizer/tournaments/create" 
                  className="inline-block px-4 py-2 bg-[#2A800A] text-white rounded-lg hover:bg-[#256E08]"
                >
                  Créer
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Teams List (New Section) */}
        <div className="bg-[#F2F2F2] rounded-xl border border-[#D0D0D0] p-6 shadow-sm">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#2A800A]">Mes Équipes</h2>
            <Link 
              to="/organizer/teams/create" 
              className="text-sm text-[#2A800A] hover:underline font-medium"
            >
              + Ajouter
            </Link>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {teams.length > 0 ? (
              teams.map((t) => (
                <div 
                  key={t.id}
                  className="p-4 bg-white rounded-lg border border-[#D0D0D0]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#2A800A]">{t.name}</h3>
                      <div className="text-sm text-[#737572] mt-1">
                        {/* On essaie de retrouver le nom du tournoi, sinon on affiche l'ID ou rien */}
                        Tournoi: {tournaments.find(tour => tour.id === t.tournament)?.name || 'Inconnu'}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="block text-xl font-bold text-[#2A800A]">
                        {t.current_capacity}/{t.max_capacity}
                      </span>
                      <span className="text-xs text-[#737572]">Joueurs</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[#737572] mb-4">Aucune équipe.</p>
                <Link 
                  to="/organizer/teams/create" 
                  className="inline-block px-4 py-2 bg-[#2A800A] text-white rounded-lg hover:bg-[#256E08]"
                >
                  Ajouter
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Quick Actions Row */}
      <div className="grid md:grid-cols-3 gap-6">
         <Link 
           to="/organizer/matches"
           className="flex items-center justify-center gap-3 p-4 bg-[#F2F2F2] hover:bg-[#EAEAEA] rounded-xl border border-[#D0D0D0] text-[#2A800A] font-medium transition shadow-sm"
         >
           <Trophy className="h-5 w-5" /> Gérer les Matchs
         </Link>

         <Link 
           to="/organizer/requests"
           className="flex items-center justify-center gap-3 p-4 bg-[#F2F2F2] hover:bg-[#EAEAEA] rounded-xl border border-[#D0D0D0] text-[#2A800A] font-medium transition shadow-sm"
         >
           <Users className="h-5 w-5" /> Gérer les Demandes
         </Link>

         <Link 
           to="/organizer/tournaments"
           className="flex items-center justify-center gap-3 p-4 bg-[#F2F2F2] hover:bg-[#EAEAEA] rounded-xl border border-[#D0D0D0] text-[#2A800A] font-medium transition shadow-sm"
         >
           <Activity className="h-5 w-5" /> Voir toutes les stats
         </Link>
      </div>

    </div>
  );
};

export default Dashboard;

