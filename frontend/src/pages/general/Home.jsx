import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar, ArrowRight } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useDbUser } from '../../context/AuthContext';

const Home = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { dbUser, loadingDb } = useDbUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Si connecté et que le profil DB est chargé
    if (isLoaded && isSignedIn && !loadingDb && dbUser) {
      const role = dbUser.role;
      
      // Redirection intelligente basée sur le rôle DB
      if (role === 'player') navigate('/player/profile');
      else if (role === 'organizer') navigate('/organizer/dashboard');
    }
  }, [isLoaded, isSignedIn, loadingDb, dbUser, navigate]);

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
