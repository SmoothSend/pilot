import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";
export const contentType = "image/png";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const projectName = searchParams.get("name") ?? "Your Project";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0C15",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(117,149,255,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            position: "relative",
            zIndex: 1,
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          {/* Pilot badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "100px",
              background: "rgba(6,182,212,0.1)",
              border: "1px solid rgba(6,182,212,0.35)",
              color: "#06b6d4",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            🚀 SmoothSend Pilot Program
          </div>

          {/* Main headline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: "64px",
                fontWeight: "900",
                color: "white",
                lineHeight: 1.1,
                maxWidth: "480px",
                wordBreak: "break-word",
              }}
            >
              {projectName}
            </span>
            <span style={{ fontSize: "48px", color: "#475569" }}>×</span>
            <span
              style={{
                fontSize: "64px",
                fontWeight: "900",
                background: "linear-gradient(135deg, #7595FF, #94ABFF)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                lineHeight: 1.1,
              }}
            >
              SmoothSend
            </span>
          </div>

          {/* Subtext */}
          <p
            style={{
              fontSize: "22px",
              color: "#94A3B8",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            30 Days of 100% Gasless Transactions on Aptos ⛽🚫
          </p>

          {/* URL */}
          <p
            style={{
              fontSize: "16px",
              color: "#475569",
              margin: 0,
            }}
          >
            pilot.smoothsend.xyz
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
