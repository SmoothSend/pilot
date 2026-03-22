import Link from "next/link";
import { ArrowRight, Zap, BarChart3, Shield, ExternalLink } from "lucide-react";

export default function HomePage() {
  return (
    <div className="page-bg min-h-screen overflow-hidden">
      {/* ── Ambient blobs ── */}
      <div className="blob-primary" />
      <div className="blob-secondary" />
      <div className="blob-tertiary" />

      {/* ── Layer above blobs ── */}
      <div className="relative z-10">

        {/* ── Nav ── */}
        <nav className="container-main flex items-center justify-between py-5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #7595FF 0%, #5B7ADD 100%)",
                boxShadow: "0 0 16px rgba(117,149,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              S
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              SmoothSend
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://docs.smoothsend.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs hidden sm:inline-flex"
            >
              Docs <ExternalLink className="w-3 h-3" />
            </a>
            <Link href="/apply" className="btn-primary text-xs">
              Apply Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="container-main pt-24 pb-32 text-center">

          {/* AIP-141 pill */}
          <div className="inline-flex items-center gap-2 animate-fade-up">
            <div
              className="badge"
              style={{
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(6,182,212,0.22)",
                color: "#22d3ee",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#22d3ee", boxShadow: "0 0 6px #22d3ee" }}
              />
              <span className="label-mono" style={{ color: "#22d3ee", letterSpacing: "0.08em" }}>
                AIP-141 · Gas fees 10× incoming
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up delay-100 mt-12 text-[clamp(2.75rem,6vw,5rem)] font-semibold leading-[1.06] tracking-[-0.03em]"
          >
            <span className="text-gradient-white">Your users shouldn&apos;t</span>
            <br />
            <span className="text-gradient-primary">pay the gas bill.</span>
          </h1>

          {/* Sub */}
          <p
            className="animate-fade-up delay-200 mt-7 text-[1.0625rem] leading-relaxed max-w-[520px] mx-auto text-muted-foreground"
          >
            AIP-141 is 10×-ing Aptos gas fees. The SmoothSend Pilot Program gives your
            dApp <strong className="text-foreground font-semibold">30 days of 100% gasless transactions</strong> — free.
            Selected projects get white-glove integration support.
          </p>

          {/* CTA row */}
          <div
            className="animate-fade-up delay-300 flex items-center justify-center gap-3 mt-10"
          >
            <Link href="/apply" className="btn-primary" style={{ fontSize: "0.9375rem", padding: "0.75rem 1.75rem" }}>
              Apply for the Pilot
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://docs.smoothsend.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: "0.9375rem", padding: "0.75rem 1.5rem" }}
            >
              Read the docs
            </a>
          </div>

          {/* Trust line */}
          <p
            className="animate-fade-up delay-400 mt-8 label-mono text-foreground-dim"
          >
            Limited spots · Curated · Free for 30 days
          </p>
        </section>

        {/* ── Section divider ── */}
        <div className="container-main">
          <div
            className="h-px w-full"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }}
          />
        </div>

        {/* ── Benefits ── */}
        <section className="container-main py-28">
          <div className="text-center mb-12">
            <p className="label-mono mb-4">Why the pilot</p>
            <h2
              className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-tight text-foreground"
            >
              Everything you need to go gasless.
            </h2>
          </div>

          <div
            className="grid md:grid-cols-3 gap-5"
            style={{ gridTemplateRows: "auto" }}
          >
            {[
              {
                icon: Zap,
                accentColor: "#7595FF",
                accentBg: "rgba(117,149,255,0.10)",
                title: "30 Days Free Gas",
                body: "Zero gas fees for every user transaction during the pilot. We sponsor every Aptos transaction — no caps, no catches, no credit card.",
              },
              {
                icon: BarChart3,
                accentColor: "#10B981",
                accentBg: "rgba(16,185,129,0.10)",
                title: "3-Line Integration",
                body: "Drop-in SDK compatible with Aptos Wallet Adapter. Your engineers can ship in an afternoon. Full documentation and support included.",
              },
              {
                icon: Shield,
                accentColor: "#22d3ee",
                accentBg: "rgba(6,182,212,0.10)",
                title: "Real Before/After Data",
                body: "Track transaction volume, user retention, and conversion lifts. Hard data to justify making gasless permanent post-pilot.",
              },
            ].map(({ icon: Icon, accentColor, accentBg, title, body }, i) => (
              <div key={title} className="card p-8 group" style={{ animationDelay: `${i * 80}ms` }}>
                {/* Accent glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${accentBg}, transparent)` }}
                />

                <div
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: accentBg,
                    border: `1px solid ${accentColor}22`,
                    boxShadow: `0 0 20px ${accentColor}20`,
                  }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: accentColor }} />
                </div>

                <h3 className="relative text-base font-semibold mb-3.5 tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="relative text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AIP-141 Explainer ── */}
        <div className="container-main">
          <div
            className="h-px w-full"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }}
          />
        </div>

        <section className="container-main py-28">
          {/* Section label */}
          <div className="text-center mb-16">
            <div
              className="badge mx-auto mb-4"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.20)",
                color: "#f87171",
              }}
            >
              <span className="label-mono" style={{ color: "#f87171" }}>⚠ The AIP-141 Problem</span>
            </div>
            <h2
              className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold tracking-tight text-foreground"
            >
              dApps without gas sponsorship{" "}
              <span className="text-destructive">will lose users.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed max-w-lg mx-auto text-muted-foreground">
              Aptos Improvement Proposal 141 is increasing base gas fees by 10×.
              For users paying their own gas, the friction just got significantly worse.
            </p>
          </div>

          {/* Before / After grid */}
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {/* Before */}
            <div
              className="card p-8"
              style={{
                borderColor: "rgba(16,185,129,0.20)",
                background: "linear-gradient(to bottom, rgba(16,185,129,0.06), rgba(255,255,255,0.02))",
              }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}
                >
                  ✓
                </div>
                <span className="font-semibold text-sm text-foreground">Before AIP-141</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Gas cost ≈ 0.000005 APT per tx",
                  "User friction: minimal",
                  "Drop-off at gas prompt: low",
                  "Wallet top-ups: rarely needed",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: "#10B981" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div
              className="card p-8"
              style={{
                borderColor: "rgba(239,68,68,0.18)",
                background: "linear-gradient(to bottom, rgba(239,68,68,0.06), rgba(255,255,255,0.02))",
              }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}
                >
                  ⚠
                </div>
                <span className="font-semibold text-sm text-foreground">After AIP-141</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Gas cost ≈ 0.00005 APT per tx (10×)",
                  "User friction: noticeable",
                  "Drop-off at gas prompt: significant",
                  "Wallet top-ups: constant barrier",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: "#f87171" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/apply" className="btn-primary" style={{ fontSize: "0.9375rem", padding: "0.75rem 1.75rem" }}>
              Protect your users — Apply free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          className="border-t py-8"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="label-mono text-foreground-hint">
              © 2025 SmoothSend
            </p>
            <div className="flex items-center gap-5">
              {[
                { label: "Docs", href: "https://docs.smoothsend.xyz" },
                { label: "Twitter/X", href: "https://x.com/SmoothSend" },
                { label: "Status", href: "https://status.smoothsend.xyz" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono transition-colors duration-150 hover:text-white text-foreground-dim"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
