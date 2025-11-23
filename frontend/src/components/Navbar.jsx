import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy } from 'lucide-react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useDbUser } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isSignedIn, user, isLoaded } = useUser();
  const { dbUser } = useDbUser(); // Use DB User for role
  
  // Fallback to metadata if DB not ready yet (for UI smoothness), but DB takes precedence
  const userRole = dbUser?.role || user?.unsafeMetadata?.role;
  
  console.log("NAVBAR DEBUG:", { dbRole: dbUser?.role, clerkRole: user?.unsafeMetadata?.role, finalRole: userRole });

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#2A800A] border-b border-green-900 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="src/assets/logo.png" 
              alt="" 
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-white font-semibold underline' : 'text-white/80 hover:text-white'} transition-colors`}
            >
              Accueil
            </Link>

            {isSignedIn && userRole === 'player' && (
              <>
                <Link to="/player/tournaments" className="text-white/80 hover:text-white flex items-center gap-1">
                   <Trophy className="h-4 w-4" /> Tournois
                </Link>
                <Link to="/teams" className="text-white/80 hover:text-white">Équipes</Link>
                <Link to="/player/matches" className="text-white/80 hover:text-white">Mes Matchs</Link>
              </>
            )}

            {isSignedIn && userRole === 'organizer' && (
              <>
                <Link to="/organizer/dashboard" className="text-white/80 hover:text-white">Dashboard</Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
          {!isLoaded ? (
            <div className="h-8 w-20 bg-green-900 rounded animate-pulse"></div>
          ) : isSignedIn ? (
            <div className="flex items-center space-x-4">
              <Link 
                to={userRole === 'player' ? "/player/profile" : "/organizer/dashboard"} 
                className="text-sm text-white/80 hover:text-white hover:underline transition"
              >
                {user.firstName}
              </Link>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{ elements: { avatarBox: "h-9 w-9" } }} 
              />
            </div>
          ) : (
              <>
                <Link to="/login" className="text-white/80 hover:text-white font-medium">
                  Connexion
                </Link>

                <Link
                  to="/register"
                  className="bg-white text-[#2A800A] hover:bg-green-100 px-4 py-2 rounded-md font-medium transition shadow"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-900 text-white p-4 border-t border-green-700">
          <div className="flex flex-col space-y-4">
            
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-green-200">
              Accueil
            </Link>

            {isSignedIn ? (
              <>
                {userRole === 'player' ? (
                  <>
                    <Link to="/player/tournaments" className="hover:text-green-200" onClick={() => setIsOpen(false)}>Trouver un Tournoi</Link>
                    <Link to="/teams" className="hover:text-green-200" onClick={() => setIsOpen(false)}>Équipes</Link>
                    <Link to="/player/matches" className="hover:text-green-200" onClick={() => setIsOpen(false)}>Mes Matchs</Link>
                    <Link to="/player/profile" className="hover:text-green-200" onClick={() => setIsOpen(false)}>Mon Profil</Link>
                  </>
                ) : (
                  <>
                    <Link to="/organizer/dashboard" className="hover:text-green-200" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  </>
                )}

                <div className="pt-3 border-t border-green-700 flex items-center justify-between">
                  <span className="text-green-200">{user.fullName}</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-200" onClick={() => setIsOpen(false)}>
                  Connexion
                </Link>

                <Link 
                  to="/register" 
                  className="py-2 text-green-300 hover:text-white font-semibold" 
                  onClick={() => setIsOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
