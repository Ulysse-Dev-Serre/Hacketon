import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Trophy } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import useApi from '../../api/axios';
import { useDbUser } from '../../context/AuthContext';

const AssignRole = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const { dbUser, loadingDb } = useDbUser(); // On récupère l'info fiable de la DB
  const [searchParams] = useSearchParams();
  const autoRole = searchParams.get('auto_role');

  // Redirection automatique si le rôle existe déjà en base de données
  useEffect(() => {
    if (!loadingDb && dbUser && dbUser.role) {
      console.log("AssignRole: Utilisateur déjà configuré avec rôle", dbUser.role, "-> Redirection");
      if (dbUser.role === 'player') navigate('/player/profile', { replace: true });
      else if (dbUser.role === 'organizer') navigate('/organizer/dashboard', { replace: true });
    }
  }, [dbUser, loadingDb, navigate]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user && autoRole) {
      handleRoleSelect(autoRole);
    }
  }, [isLoaded, isSignedIn, user, autoRole]);

  const handleRoleSelect = async (role) => {
    if (!isSignedIn) {
      navigate(`/register?role=${role}`);
      return;
    }

    try {
      // 1. Update Clerk Metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: role
        }
      });

      // 2. Sync with Backend
      await api.post('/auth/update-role/', { role });

      navigate(role === 'organizer' ? '/organizer/dashboard' : '/player/profile');
    } catch (error) {
      console.error("Error updating role:", error);
      // Try fallback navigation
      navigate(role === 'organizer' ? '/organizer/dashboard' : '/player/profile');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#CFCFCF] px-4">
      {/* DEBUG PANEL */}
      <div className="fixed top-0 left-0 bg-black text-white p-4 z-50 text-xs">
        DEBUG ASSIGN ROLE:<br/>
        LoadingDB: {loadingDb ? 'YES' : 'NO'}<br/>
        UserDB: {dbUser ? 'YES' : 'NO'}<br/>
        Role: {dbUser?.role || 'N/A'}
      </div>

      <div className="max-w-4xl w-full">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2A800A] mb-4">Choisissez votre rôle</h1>
          <p className="text-xl text-[#737572]">Comment souhaitez-vous utiliser TournamentManager ?</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Player */}
          <button
            onClick={() => handleRoleSelect('player')}
            className="group relative p-8 bg-white rounded-2xl border border-[#D0D0D0] shadow-sm hover:border-[#2A800A] transition-all duration-300 hover:-translate-y-1 text-left"
          >
            <div className="bg-[#F2F2F2] w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2A800A] transition-colors">
              <User className="h-8 w-8 text-[#2A800A] group-hover:text-white" />
            </div>

            <h3 className="text-2xl font-bold text-[#2A800A] mb-3">Je suis un Joueur</h3>
            <p className="text-[#737572]">
              Je veux rejoindre des équipes, participer à des tournois et suivre mes performances.
            </p>

            <ul className="mt-6 space-y-3 text-[#737572]">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#2A800A] rounded-full mr-2" />
                Trouver une équipe locale
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#2A800A] rounded-full mr-2" />
                Suivre mes statistiques
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#2A800A] rounded-full mr-2" />
                Gérer mon profil
              </li>
            </ul>
          </button>

          {/* Organizer */}
          <button
            onClick={() => handleRoleSelect('organizer')}
            className="group relative p-8 bg-white rounded-2xl border border-[#D0D0D0] shadow-sm hover:border-[#2A800A] transition-all duration-300 hover:-translate-y-1 text-left"
          >
            <div className="bg-[#F2F2F2] w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2A800A] transition-colors">
              <Trophy className="h-8 w-8 text-[#2A800A] group-hover:text-white" />
            </div>

            <h3 className="text-2xl font-bold text-[#2A800A] mb-3">Je suis Organisateur</h3>
            <p className="text-[#737572]">
              Je veux créer et gérer des tournois, organiser des matchs et gérer les inscriptions.
            </p>

            <ul className="mt-6 space-y-3 text-[#737572]">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#2A800A] rounded-full mr-2" />
                Créer des tournois
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#2A800A] rounded-full mr-2" />
                Gérer les matchs et scores
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#2A800A] rounded-full mr-2" />
                Administrer les équipes
              </li>
            </ul>
          </button>

        </div>
      </div>
    </div>
  );
};

export default AssignRole;
