"use client";

import { useState, useEffect } from "react";
import { SignupForm } from "@/components/forms/signup-form";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirm = e.target["confirm-password"].value.trim();

    if (!email || !password || !confirm) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const res = await register(name, email, password);

    if (!res.success) {
      setError(res.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm onSubmit={handleRegister} error={error} loading={loading} />
      </div>
    </div>
  );
}
