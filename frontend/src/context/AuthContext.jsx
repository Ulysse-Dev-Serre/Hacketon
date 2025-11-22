import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import useApi from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const api = useApi();
  
  const [dbUser, setDbUser] = useState(null);
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    const fetchDbUser = async () => {
      // 1. Si Clerk n'est pas encore chargé, on attend
      if (!isLoaded) return;

      // 2. Si l'utilisateur n'est pas connecté, on arrête de charger (pas de user DB)
      if (!isSignedIn) {
        setDbUser(null);
        setLoadingDb(false);
        return;
      }

      // 3. Si connecté, on demande au Backend "Qui suis-je ?"
      try {
        const response = await api.get('/auth/me/');
        setDbUser(response.data); // Contient { id, role, email, ... } venant de Postgres
      } catch (error) {
        console.error("Erreur lors de la récupération du profil DB:", error);
        setDbUser(null);
      } finally {
        setLoadingDb(false);
      }
    };

    fetchDbUser();
  }, [isLoaded, isSignedIn]); // Se relance si le statut de connexion change

  return (
    <AuthContext.Provider value={{ dbUser, loadingDb }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser ce contexte facilement
export const useDbUser = () => useContext(AuthContext);
