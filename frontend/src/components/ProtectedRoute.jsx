import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) return <Navigate to="/sign-in" />;

  if (role && user?.publicMetadata?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
