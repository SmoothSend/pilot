"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Twitter, CheckCircle, ExternalLink } from "lucide-react";
import { buildTwitterShareUrl } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const projectName = searchParams.get("name") ?? "Your Project";
  const shareUrl = buildTwitterShareUrl(projectName);

  return (
    <div className="page-bg min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Ambient blob — success green tint */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.10) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div className="blob-primary" style={{ opacity: 0.5 }} />

      <div className="relative z-10 w-full max-w-md">

        {/* Check icon */}
        <div className="flex justify-center mb-8 animate-scale-in">
          <div className="relative flex items-center justify-center">
            {/* Pulse rings */}
            <div
              className="absolute w-24 h-24 rounded-full animate-pulse-ring"
              style={{ border: "1px solid rgba(16,185,129,0.25)" }}
            />
            <div
              className="absolute w-20 h-20 rounded-full animate-pulse-ring delay-200"
              style={{ border: "1px solid rgba(16,185,129,0.15)" }}
            />
            {/* Circle */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(16,185,129,0.10)",
                border: "1px solid rgba(16,185,129,0.30)",
                boxShadow: "0 0 40px rgba(16,185,129,0.15), 0 0 0 1px rgba(16,185,129,0.08)",
              }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: "#10B981" }} />
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="text-center mb-10 animate-fade-up delay-100">
          <h1
            className="text-3xl font-semibold tracking-tight mb-3 text-foreground"
          >
            You&apos;re in the queue.
          </h1>
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            We review applications weekly. You&apos;ll hear from us via email or Telegram if selected.
          </p>
        </div>

        {/* Share card */}
        <div className="card p-7 mb-5 animate-fade-up delay-200">
          {/* Header */}
          <div className="flex items-start gap-3.5 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Twitter className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Want to jump the queue?
              </h2>
              <p className="text-xs mt-0.5 leading-relaxed text-muted-foreground">
                Tagging us on X puts your application at the{" "}
                <strong style={{ color: "#7595FF", fontWeight: 500 }}>top of our review stack.</strong>
              </p>
            </div>
          </div>

          {/* Tweet preview */}
          <div
            className="rounded-xl p-4 mb-5 text-sm leading-relaxed text-muted-foreground"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            Preparing for the AIP-141 gas spike. Just applied to the{" "}
            <span style={{ color: "#7595FF" }}>@SmoothSend</span> Pilot Program to bring 100% gasless
            txs to <strong className="font-medium text-foreground">{projectName}</strong> on{" "}
            <span style={{ color: "#7595FF" }}>@Aptos_Network</span>! ⛽🚫
          </div>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center"
            style={{ display: "flex" }}
          >
            <Twitter className="w-4 h-4" />
            Share on X
            <ExternalLink className="w-3 h-3 opacity-50" />
          </a>
        </div>

        {/* Secondary */}
        <div className="text-center animate-fade-up delay-300">
          <a
            href="https://docs.smoothsend.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ display: "inline-flex" }}
          >
            Explore the integration docs <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <div className="mt-6">
            <Link href="/" className="btn-ghost text-xs">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="page-bg min-h-screen flex items-center justify-center">
          <div
            className="w-6 h-6 rounded-full border-2 animate-spin"
            style={{ borderColor: "#7595FF", borderTopColor: "transparent" }}
          />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
