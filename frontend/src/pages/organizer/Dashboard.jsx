import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, Activity, Plus, ArrowRight } from 'lucide-react';
import useApi from '../../api/axios';
import MatchesCalendar from '../../components/MatchesCalendar';

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

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Tournaments & Teams */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Tournaments List */}
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

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
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
                    <p className="text-center py-8 text-[#737572]">Aucun tournoi.</p>
                    )}
                </div>
            </div>

            {/* Teams List */}
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

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {teams.length > 0 ? (
                    teams.map((t) => (
                        <Link 
                        key={t.id}
                        to={`/teams/${t.id}`}
                        className="block p-4 bg-white rounded-lg border border-[#D0D0D0] hover:bg-[#EDEDED] transition group"
                        >
                        <div className="flex items-center justify-between">
                            <div>
                            <h3 className="font-bold text-[#2A800A] group-hover:text-green-700">{t.name}</h3>
                            <div className="text-sm text-[#737572] mt-1">
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
                        </Link>
                    ))
                    ) : (
                    <p className="text-center py-8 text-[#737572]">Aucune équipe.</p>
                    )}
                </div>
            </div>

        </div>

        {/* RIGHT COLUMN: Calendar & Quick Actions */}
        <div className="space-y-8">
            
            {/* Calendar Widget */}
            <div className="bg-[#F2F2F2] rounded-xl border border-[#D0D0D0] p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-[#2A800A]">Calendrier</h2>
                    <Link to="/organizer/matches" className="text-xs text-[#737572] hover:text-[#2A800A]">Voir tout</Link>
                </div>
                <div className="bg-white rounded-lg border border-[#D0D0D0] overflow-hidden">
                    <MatchesCalendar compact={true} />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#F2F2F2] rounded-xl border border-[#D0D0D0] p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#2A800A] mb-4">Actions Rapides</h2>
                <div className="space-y-3">
                    <Link 
                        to="/organizer/matches"
                        className="flex items-center justify-between p-3 bg-white hover:bg-[#EAEAEA] rounded-lg border border-[#D0D0D0] text-[#2A800A] font-medium transition"
                    >
                        <div className="flex items-center gap-3">
                            <Trophy className="h-5 w-5" /> Gérer les Matchs
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#D0D0D0]" />
                    </Link>

                    <Link 
                        to="/organizer/requests"
                        className="flex items-center justify-between p-3 bg-white hover:bg-[#EAEAEA] rounded-lg border border-[#D0D0D0] text-[#2A800A] font-medium transition"
                    >
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5" /> Gérer les Demandes
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                            {stats?.requests || 0}
                        </span>
                    </Link>

                    <Link 
                        to="/organizer/tournaments"
                        className="flex items-center justify-between p-3 bg-white hover:bg-[#EAEAEA] rounded-lg border border-[#D0D0D0] text-[#2A800A] font-medium transition"
                    >
                        <div className="flex items-center gap-3">
                            <Activity className="h-5 w-5" /> Voir toutes les stats
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#D0D0D0]" />
                    </Link>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;

