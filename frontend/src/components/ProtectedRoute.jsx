import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    // Loading spinner or placeholder
    return <div className="flex justify-center items-center h-screen bg-slate-950 text-white">Chargement...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check role from metadata
  const userRole = user?.unsafeMetadata?.role;

  // If user is signed in but has no role yet, redirect to assignment
  if (isSignedIn && !userRole) {
    return <Navigate to="/assign-role" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to a default page if role doesn't match, e.g., home or their own dashboard
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
