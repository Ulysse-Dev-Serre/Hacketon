import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, Activity, Plus, ArrowRight } from 'lucide-react';
import useApi from '../../api/axios';

const Dashboard = () => {
  const api = useApi();
  const [stats, setStats] = useState(null);
  const [recentTournaments, setRecentTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/organizer/dashboard/');
        setStats(res.data.stats);
        setRecentTournaments(res.data.recent_tournaments);
      } catch (error) {
        console.error("Erreur chargement Dashboard :", error);
        setStats(null);
        setRecentTournaments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
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
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Recent Tournaments */}
        <div className="lg:col-span-2 bg-[#F2F2F2] rounded-xl border border-[#D0D0D0] p-6 shadow-sm">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#2A800A]">Vos Tournois Récents</h2>
            <Link 
              to="/organizer/tournaments" 
              className="text-[#2A800A] hover:underline flex items-center gap-1 text-sm"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentTournaments.length > 0 ? (
              recentTournaments.map((t) => (
                <div 
                  key={t.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#D0D0D0] hover:bg-[#EDEDED] transition"
                >
                  <div>
                    <h3 className="font-bold text-[#2A800A]">{t.name}</h3>
                    <p className="text-sm text-[#737572]">
                      Prochain match : {t.next_match || "-"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                      {t.status}
                    </span>

                    <span className="text-sm text-[#737572]">
                      {t.teams} équipes
                    </span>

                    <Link 
                      to={`/organizer/tournaments/${t.id}`}
                      className="p-2 hover:bg-[#D0D0D0] rounded-lg text-[#737572] transition"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#737572] py-4">
                Aucun tournoi récent.
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#F2F2F2] rounded-xl border border-[#D0D0D0] p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#2A800A] mb-6">Actions Rapides</h2>

          <div className="space-y-3">
            <Link 
              to="/organizer/matches"
              className="block w-full p-3 bg-white hover:bg-[#EDEDED] rounded-lg border border-[#D0D0D0] text-[#737572] transition"
            >
              Saisir un score de match
            </Link>

            <Link 
              to="/organizer/requests"
              className="block w-full p-3 bg-white hover:bg-[#EDEDED] rounded-lg border border-[#D0D0D0] text-[#737572] transition"
            >
              Gérer les demandes
            </Link>

            <Link 
              to="/organizer/teams/create"
              className="block w-full p-3 bg-white hover:bg-[#EDEDED] rounded-lg border border-[#D0D0D0] text-[#737572] transition"
            >
              Enregistrer une équipe
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;

