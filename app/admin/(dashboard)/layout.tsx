import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen" style={{ background: "#07080F" }}>
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.15,
          zIndex: 0,
        }}
      />

      {/* Top bar */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-3.5 border-b"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(7,8,15,0.85)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <img 
            src="/logo.svg" 
            alt="SmoothSend" 
            className="w-6 h-6"
          />
          <span className="font-semibold text-sm tracking-tight text-foreground">
            SmoothSend
          </span>
          <div
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{
              background: "rgba(117,149,255,0.08)",
              border: "1px solid rgba(117,149,255,0.20)",
              color: "#7595FF",
              fontSize: "0.6875rem",
            }}
          >
            Admin
          </div>
        </div>

        <form action="/admin/logout" method="POST">
          <button type="submit" className="btn-ghost text-xs py-1.5 px-3">
            Sign out
          </button>
        </form>
      </header>

      <main className="relative z-10">{children}</main>
    </div>
  );
}
