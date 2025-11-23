"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { LoginForm } from "@/components/login-form";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------------------------------
  // If token already exists → redirect to dashboard
  // -----------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);

  // -----------------------------------------------------
  // Handle Login Submit
  // -----------------------------------------------------
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    const res = await login(email, password);

    if (!res.success) {
      setError(res.message);
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  // -----------------------------------------------------
  // Render
  // -----------------------------------------------------
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
      </div>
    </div>
  );
}
