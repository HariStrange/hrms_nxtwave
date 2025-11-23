import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useState } from "react";
import { SplineIcon } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setChecking(false);
      return;
    }

    setChecking(false);
  }, []);

  if (loading || checking) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="flex flex-col items-center">
          <SplineIcon className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
