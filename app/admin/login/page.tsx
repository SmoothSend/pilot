"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#07080F" }}
    >
      {/* Blob */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(117,149,255,0.10) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.18,
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex w-10 h-10 rounded-xl items-center justify-center text-sm font-bold text-white mb-4"
            style={{
              background: "linear-gradient(135deg, #7595FF, #5B7ADD)",
              boxShadow: "0 0 20px rgba(117,149,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            S
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Admin Access
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            SmoothSend Pilot Program
          </p>
        </div>

        {/* Card */}
        <div className="card-elevated rounded-2xl p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="form-label">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                className="form-input"
                placeholder="team@smoothsend.xyz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  className="form-input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-foreground-ghost"
                  onClick={() => setShowPw((p) => !p)}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs flex items-center gap-1.5 text-destructive">
                <span className="w-1 h-1 rounded-full flex-shrink-0 bg-destructive" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-4"
              style={{ display: "flex", padding: "0.75rem 1.25rem" }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
