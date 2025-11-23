import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // No token → skip check
    if (!token) {
      setChecking(false);
      return;
    }

    // Token exists → allow AuthContext to validate it (AuthProvider already calls /profile)
    setChecking(false);
  }, []);

  if (loading || checking) {
    return <div className="p-4">Loading...</div>;
  }

  const token = localStorage.getItem("token");

  // No user or token → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
