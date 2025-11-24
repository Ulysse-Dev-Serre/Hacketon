import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, MapPin, ArrowRight, Shield } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import useApi from '../../api/axios';
import MatchesCalendar from '../../components/MatchesCalendar';
import WeeklyCalendar from '../../components/WeeklyCalendar';

const Home = () => {
  const { isSignedIn } = useUser();
  const api = useApi();
  const [featuredTeams, setFeaturedTeams] = useState([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [teamsRes, tournamentsRes] = await Promise.all([
                api.get('/teams/'),
                api.get('/tournaments/')
            ]);

            // Teams: 3 aléatoires
            const allTeams = teamsRes.data;
            const shuffledTeams = [...allTeams].sort(() => 0.5 - Math.random());
            setFeaturedTeams(shuffledTeams.slice(0, 3));

            // Tournaments: 2 plus proches dans le futur
            const allTournaments = tournamentsRes.data;
            const futureTournaments = allTournaments
                .filter(t => new Date(t.start_date) >= new Date())
                .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            
            setUpcomingTournaments(futureTournaments.slice(0, 2));

        } catch (error) {
            console.error("Erreur chargement Home:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#D5D5D5] text-[#4A4A4A]">
      
      {/* Hero Section */}
      <div className="w-full bg-[#CFCFCF] py-10">
        <div className="container mx-auto px-4">

          {/* HERO */}
          <div className="rounded-xl overflow-hidden shadow-md bg-white h-[300px] grid grid-cols-1 md:grid-cols-2">

            {/* LEFT SIDE — fond gris clair */}
            <div className="flex flex-col justify-center px-12 bg-[#F2F2F2]">
              <h1 className="text-4xl font-extrabold text-[#2A800A] mb-4">
                L'Esprit de la Compétition
              </h1>

              <p className="text-gray-700 mb-8">
                Rejoignez la communauté sportive ultime. Participez à des tournois, 
                suivez vos statistiques et vivez votre passion du sport.
              </p>

              <div className="flex gap-4">
                {!isSignedIn && (
                  <>
                    <Link 
                      to="/assign-role"
                      className="bg-[#2A800A] hover:bg-[#256E08] text-white px-6 py-3 rounded-lg font-semibold transition shadow-sm"
                    >
                      Commencer
                    </Link>

                    <Link 
                      to="/login"
                      className="bg-white border border-[#2A800A] text-[#2A800A] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Se connecter
                    </Link>
                  </>
                )}
                {isSignedIn && (
                    <p className="text-[#2A800A] font-medium italic">
                        Bienvenue sur la plateforme ! Utilisez le menu pour naviguer.
                    </p>
                )}
              </div>
            </div>

            {/* RIGHT SIDE — image */}
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


      {/* Dynamic Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column (Tournaments + Calendar) */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            
            {/* Upcoming Tournaments */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-[#2A800A] flex items-center gap-2">
                  <Trophy className="h-6 w-6" /> Prochains Tournois
                </h2>
                <Link to="/tournaments" className="text-sm font-medium text-[#4A4A4A] hover:text-[#2A800A] flex items-center gap-1">
                  Voir tout <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {loading ? (
                    <div className="col-span-2 text-center py-8 text-gray-500">Chargement...</div>
                ) : upcomingTournaments.length > 0 ? (
                    upcomingTournaments.map(t => (
                    <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm border border-[#E0E0E0] hover:shadow-md transition group">
                        <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#F2F2F2] p-2 rounded-lg text-[#2A800A] group-hover:bg-[#2A800A] group-hover:text-white transition">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold bg-[#E8F5E9] text-[#2A800A] px-2 py-1 rounded-full">
                            {t.sport}
                        </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-800">{t.name}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(t.start_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {t.city}
                        </div>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        Aucun tournoi à venir pour le moment.
                    </div>
                )}
              </div>
            </div>

            {/* Calendar Section */}
            <div>
               <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-[#2A800A] flex items-center gap-2">
                  <Calendar className="h-6 w-6" /> Calendrier de la Semaine
                </h2>
              </div>
              <WeeklyCalendar />
            </div>

          </div>

          {/* Sidebar Column (Featured Teams) */}
          <div className="lg:col-span-1">
             <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-[#2A800A] flex items-center gap-2">
                  <Users className="h-6 w-6" /> Équipes à la Une
                </h2>
                <Link to="/teams" className="text-sm font-medium text-[#4A4A4A] hover:text-[#2A800A]">
                  Voir tout
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Chargement...</div>
                ) : featuredTeams.length > 0 ? (
                    featuredTeams.map(team => (
                    <Link  key={team.id} to={`/teams/${team.id}`} className="bg-white p-4 rounded-xl shadow-sm border border-[#E0E0E0] hover:border-[#2A800A] transition cursor-pointer">
                        <div className="flex items-center gap-4">
                        <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center text-[#2A800A]">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{team.name}</h4>
                            <p className="text-xs text-gray-500">
                                {team.current_capacity}/{team.max_capacity} Joueurs
                            </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                    </Link>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        Aucune équipe trouvée.
                    </div>
                )}
              </div>
              
          </div>

        </div>
      </div>


      {/* Features Section */
}
      <div className="bg-[#C7C7C7] py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">

            <FeatureCard 
              icon={<Trophy className="h-10 w-10 text-[#2A800A]" />}
              title="Tournois Passionnants"
              description="Découvrez des compétitions locales et nationales dans divers sports."
            />

            <FeatureCard 
              icon={<Users className="h-10 w-10 text-[#4A4A4A]" />}
              title="Communauté Active"
              description="Rejoignez des équipes, trouvez des partenaires et partagez vos exploits."
            />

            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-[#2A800A]" />}
              title="Calendrier Live"
              description="Ne ratez aucun match grâce à notre calendrier interactif mis à jour en temps réel."
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
