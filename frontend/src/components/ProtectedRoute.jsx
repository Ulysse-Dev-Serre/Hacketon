import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useDbUser } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { dbUser, loadingDb } = useDbUser();

  // 1. Attendre le chargement global (Clerk + Backend)
  if (!isLoaded || loadingDb) {
    return <div className="flex justify-center items-center h-screen bg-[#CFCFCF] text-[#2A800A]">Chargement...</div>;
  }

  // 2. Si pas connecté -> Login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si connecté mais pas d'utilisateur en base de données (Extrêmement rare, car l'API crée le user)
  // Cela peut arriver si l'API est down.
  if (!dbUser) {
    return <div className="p-10 text-center text-red-600">Erreur de connexion au serveur. Veuillez réessayer.</div>;
  }

  // 4. Vérification du rôle venant de la DB
  // Si le rôle est "player" (défaut) et qu'on essaie d'accéder à une route "organizer", on redirige.
  
  // Note: Si on veut forcer le choix de rôle pour les nouveaux users :
  // On pourrait vérifier ici si dbUser.role est null ou "undefined" (mais notre backend met "player" par défaut).
  // Donc on suppose que "player" est un rôle valide.

  if (allowedRoles && !allowedRoles.includes(dbUser.role)) {
    // Si je suis 'player' et que je veux aller sur '/organizer', je suis redirigé vers ma page d'accueil
    // Pour éviter les boucles, on peut rediriger vers la racine ou une page d'erreur 403
    console.warn(`Accès refusé : rôle ${dbUser.role} requis ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
