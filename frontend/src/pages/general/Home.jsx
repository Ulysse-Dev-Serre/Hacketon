import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar, ArrowRight, Star } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useDbUser } from '../../context/AuthContext';
import useApi from '../../api/axios';

const Home = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const { dbUser, loadingDb } = useDbUser();
  const navigate = useNavigate();
  const api = useApi();
  
  // State for player home feed
  const [featuredTournaments, setFeaturedTournaments] = useState([]);

  useEffect(() => {
    if (isLoaded && isSignedIn && !loadingDb && dbUser) {
      const role = dbUser.role;
      
      // Players keep their custom feed
      if (role === 'player') {
        fetchFeaturedContent();
      }
      
      // Organizers: No auto-redirect anymore. They see the marketing page.
    }
  }, [isLoaded, isSignedIn, loadingDb, dbUser, navigate]);

  const fetchFeaturedContent = async () => {
    try {
      // Fetch 3 recent tournaments
      const res = await api.get('/tournaments/');
      setFeaturedTournaments(res.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching home content:", error);
    }
  };

  // 1. LOADING
  if (!isLoaded || (isSignedIn && loadingDb)) {
    return <div className="min-h-screen bg-[#D5D5D5]"></div>;
  }

  // 2. PLAYER HOME FEED
  if (isSignedIn && dbUser?.role === 'player') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#CFCFCF] py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#2A800A] to-green-800 rounded-2xl p-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">Bonjour, {user.firstName} ! 👋</h1>
            <p className="text-green-100 mb-6">Prêt pour votre prochain match ?</p>
            
            <div className="flex gap-4">
              <Link 
                to="/player/tournaments"
                className="bg-white text-[#2A800A] px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition"
              >
                Trouver un tournoi
              </Link>
              <Link 
                to="/teams"
                className="bg-green-700 text-white border border-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition"
              >
                Rejoindre une équipe
              </Link>
            </div>
          </div>

          {/* Featured Tournaments */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2A800A] flex items-center gap-2">
                <Trophy className="h-6 w-6" /> Tournois à la une
              </h2>
              <Link to="/player/tournaments" className="text-[#737572] hover:text-[#2A800A] text-sm font-medium">
                Voir tout →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredTournaments.map(t => (
                <Link 
                  key={t.id}
                  to={`/tournaments/${t.id}`}
                  className="bg-[#F2F2F2] border border-[#D0D0D0] rounded-xl p-6 hover:border-[#2A800A] hover:shadow-md transition group"
                >
                  <h3 className="font-bold text-lg text-[#2A800A] mb-2 group-hover:text-green-700">{t.name}</h3>
                  <p className="text-sm text-[#737572] mb-4">{t.city} • {t.sport}</p>
                  <div className="flex items-center text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded w-fit">
                    Inscriptions ouvertes
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats / Activity Placeholder */}
          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl border border-[#D0D0D0] shadow-sm">
                <h3 className="font-bold text-[#2A800A] mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Prochains Matchs
                </h3>
                <p className="text-[#737572] text-sm italic">
                  Vous n'avez aucun match prévu pour le moment. Rejoignez une équipe pour commencer la compétition !
                </p>
             </div>

             <div className="bg-white p-6 rounded-xl border border-[#D0D0D0] shadow-sm">
                <h3 className="font-bold text-[#2A800A] mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5" /> Vos Performances
                </h3>
                <div className="flex justify-around text-center">
                   <div>
                      <div className="text-2xl font-bold text-[#2A800A]">0</div>
                      <div className="text-xs text-[#737572]">Matchs</div>
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-[#2A800A]">0</div>
                      <div className="text-xs text-[#737572]">Buts</div>
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-[#2A800A]">-</div>
                      <div className="text-xs text-[#737572]">Ratio</div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    );
  }

  // 3. PUBLIC LANDING PAGE (Non connecté)
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#D5D5D5] text-[#4A4A4A]">
      
{/* Hero Section */}
<div className="w-full bg-[#CFCFCF] py-10">
  <div className="container mx-auto px-4">

    {/* HERO */}
    <div className="rounded-xl overflow-hidden shadow-md bg-white h-[260px] grid grid-cols-1 md:grid-cols-2">

      {/* LEFT SIDE — fond gris clair */}
      <div className="flex flex-col justify-center px-12 bg-[#F2F2F2]">
        <h1 className="text-4xl font-extrabold text-[#2A800A] mb-4">
          Gérez vos tournois facilement
        </h1>

        <p className="text-gray-700 mb-6">
          Une plateforme moderne et intuitive pour organiser des tournois, gérer des
          équipes et suivre les matchs en temps réel.
        </p>

        <div className="flex gap-4">
          {isSignedIn && dbUser?.role === 'organizer' ? (
             <Link 
               to="/organizer/dashboard"
               className="bg-[#2A800A] hover:bg-[#256E08] text-white px-6 py-3 rounded-lg font-semibold transition shadow-sm"
             >
               Accéder à mon Dashboard →
             </Link>
          ) : !isSignedIn ? (
            <>
              <Link 
                to="/assign-role"
                className="bg-[#2A800A] hover:bg-[#256E08] text-white px-6 py-3 rounded-lg font-semibold transition shadow-sm"
              >
                Commencer maintenant →
              </Link>

              <Link 
                to="/login"
                className="bg-white border border-[#2A800A] text-[#2A800A] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition"
              >
                Se connecter
              </Link>
            </>
          ) : null}
        </div>
      </div>

      {/* RIGHT SIDE — image avec même hauteur */}
      <div className="w-full h-full">
        <img
          src="src/assets/image3.jpg"
          alt="Football Hero"
          className="w-full h-full object-cover"
        />
      </div>

    </div>

  </div>
</div>


      {/* Features Section */}
      <div className="bg-[#C7C7C7] py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">

            <FeatureCard 
              icon={<Trophy className="h-10 w-10 text-[#2A800A]" />}
              title="Tournois Simplifiés"
              description="Créez vos tournois, brackets et matchs en quelques clics."
            />

            <FeatureCard 
              icon={<Users className="h-10 w-10 text-[#4A4A4A]" />}
              title="Gestion des Équipes"
              description="Organisez vos effectifs, trouvez des joueurs et formez des équipes rapidement."
            />

            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-[#2A800A]" />}
              title="Calendrier Automatique"
              description="Vos matchs et plannings se génèrent automatiquement."
            />

          </div>
        </div>
      </div>

    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-[#E3E3E3] p-8 rounded-xl border border-[#C0C0C0] shadow-sm hover:shadow-md transition">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-[#2A800A]">{title}</h3>
    <p className="text-[#4A4A4A]">{description}</p>
  </div>
);

export default Home;
