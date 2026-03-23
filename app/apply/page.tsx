"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Building2,
  BarChart3,
  Handshake,
} from "lucide-react";
import { submitApplication } from "@/app/actions";
import type { FullApplication } from "@/lib/validators";

type FormData = Partial<FullApplication>;
const TOTAL_STEPS = 3;

const STEP_META = [
  { icon: Building2, label: "Project Identity", color: "#7595FF" },
  { icon: BarChart3, label: "Tech & Traction", color: "#10B981" },
  { icon: Handshake, label: "Contact", color: "#a78bfa" },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

const transition = { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const };

// ─── Field Error ──────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-xs mt-1.5 flex items-center gap-1.5 text-destructive">
      <span className="w-1 h-1 rounded-full flex-shrink-0 bg-destructive" />
      {msg}
    </p>
  );
}

// ─── Radio Option ─────────────────────────────────────────────────────────────
function RadioOption({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="radio-option"
      data-selected={selected}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200"
          style={{
            borderColor: selected ? "#7595FF" : "rgba(255,255,255,0.18)",
            background: selected ? "#7595FF" : "transparent",
          }}
        >
          {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
        <div>
          <p className={`text-sm font-medium ${selected ? "text-foreground" : "text-muted-foreground"}`}>
            {label}
          </p>
          {description && (
            <p className="form-hint !mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function Step1({ data, onChange, errors }: { data: FormData; onChange: (k: keyof FormData, v: string) => void; errors: Record<string, string> }) {
  const charCount = (data.one_liner ?? "").length;
  return (
    <div className="space-y-5">
      {[
        { key: "project_name" as const, label: "Project Name", placeholder: "e.g. Neptune Protocol", type: "text" },
        { key: "website_url" as const, label: "Website / dApp URL", placeholder: "https://yourproject.xyz", type: "url" },
        { key: "twitter_url" as const, label: "Twitter / X Profile", placeholder: "https://x.com/yourproject", type: "url", hint: "Used to verify your project presence" },
      ].map(({ key, label, placeholder, type, hint }) => (
        <div key={key}>
          <label className="form-label">
            {label} <span className="text-destructive">*</span>
          </label>
          <input
            id={key}
            type={type}
            className="form-input"
            placeholder={placeholder}
            value={data[key] ?? ""}
            onChange={(e) => onChange(key, e.target.value)}
          />
          {hint && <p className="form-hint">{hint}</p>}
          <FieldError msg={errors[key]} />
        </div>
      ))}
      <div>
        <label className="form-label">
          One-liner <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            id="one_liner"
            className="form-input pr-14"
            placeholder="e.g. Decentralized perpetuals on Aptos with zero liquidation surprises"
            value={data.one_liner ?? ""}
            onChange={(e) => onChange("one_liner", e.target.value)}
            maxLength={150}
          />
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${charCount > 135 ? "text-destructive" : "text-foreground-dim"}`}
          >
            {charCount}/150
          </span>
        </div>
        <FieldError msg={errors.one_liner} />
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function Step2({ data, onChange, errors }: { data: FormData; onChange: (k: keyof FormData, v: string) => void; errors: Record<string, string> }) {
  return (
    <div className="space-y-7">
      <div>
        <label className="form-label mb-3">
          Aptos Mainnet Status <span className="text-destructive">*</span>
        </label>
        <div className="space-y-2">
          {[
            { value: "live", label: "Live on Mainnet", description: "Transactions running now" },
            { value: "testnet", label: "Testnet / Development", description: "Building and testing" },
            { value: "migrating", label: "Migrating Soon", description: "Moving to Aptos in the next 60 days" },
          ].map((opt) => (
            <RadioOption key={opt.value} label={opt.label} description={opt.description}
              selected={data.mainnet_status === opt.value} onSelect={() => onChange("mainnet_status", opt.value)} />
          ))}
        </div>
        <FieldError msg={errors.mainnet_status} />
      </div>

      <div>
        <label className="form-label mb-3">
          Average Daily Transactions <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "<50", label: "< 50 / day" },
            { value: "50-250", label: "50 – 250" },
            { value: "250-1000", label: "250 – 1,000" },
            { value: "1000+", label: "1,000+" },
          ].map((opt) => (
            <RadioOption key={opt.value} label={opt.label}
              selected={data.daily_txs === opt.value} onSelect={() => onChange("daily_txs", opt.value)} />
          ))}
        </div>
        <FieldError msg={errors.daily_txs} />
      </div>

      <div>
        <label className="form-label mb-3">
          Current Gas Solution <span className="text-destructive">*</span>
        </label>
        <div className="space-y-2">
          {[
            { value: "users_pay", label: "Users pay their own gas", description: "No sponsorship currently" },
            { value: "built_own", label: "Built our own sponsorship", description: "Internal solution" },
            { value: "third_party", label: "Using a third-party service", description: "Partner or competitor" },
          ].map((opt) => (
            <RadioOption key={opt.value} label={opt.label} description={opt.description}
              selected={data.gas_solution === opt.value} onSelect={() => onChange("gas_solution", opt.value)} />
          ))}
        </div>
        <FieldError msg={errors.gas_solution} />
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function Step3({ data, onChange, errors }: { data: FormData; onChange: (k: keyof FormData, v: string | boolean) => void; errors: Record<string, string> }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="form-label">
          Lead Dev / Founder Email <span className="text-destructive">*</span>
        </label>
        <input id="email" type="email" className="form-input" placeholder="you@yourproject.xyz"
          value={data.email ?? ""} onChange={(e) => onChange("email", e.target.value)} />
        <FieldError msg={errors.email} />
      </div>

      <div>
        <label className="form-label">
          Telegram Handle <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-foreground-ghost">@</span>
          <input id="telegram" className="form-input pl-7" placeholder="yourhandle"
            value={(data.telegram ?? "").replace(/^@/, "")}
            onChange={(e) => onChange("telegram", "@" + e.target.value.replace(/^@/, ""))} />
        </div>
        <FieldError msg={errors.telegram} />
      </div>

      {/* Honeypot field - hidden from humans, catches bots */}
      <input
        type="text"
        name="website_field"
        autoComplete="off"
        tabIndex={-1}
        value={data.website_field ?? ""}
        onChange={(e) => onChange("website_field", e.target.value)}
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
        }}
        aria-hidden="true"
      />

      {/* Agreement */}
      <button
        type="button"
        className="w-full text-left p-4 rounded-xl transition-all duration-200 flex items-start gap-3"
        onClick={() => onChange("data_agreement", !data.data_agreement)}
        style={{
          background: data.data_agreement ? "rgba(117,149,255,0.06)" : "rgba(3,4,10,0.5)",
          border: data.data_agreement ? "1px solid rgba(117,149,255,0.35)" : "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="w-4.5 h-4.5 rounded flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-150"
          style={{
            width: "18px",
            height: "18px",
            background: data.data_agreement ? "#7595FF" : "transparent",
            border: data.data_agreement ? "2px solid #7595FF" : "2px solid rgba(255,255,255,0.18)",
            boxShadow: data.data_agreement ? "0 0 10px rgba(117,149,255,0.3)" : "none",
          }}
        >
          {data.data_agreement && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
        <span className="text-sm leading-relaxed text-muted-foreground">
          I agree to share{" "}
          <strong className="font-medium text-foreground">before/after transaction volume data</strong>{" "}
          with the SmoothSend team if selected. Used only to measure pilot effectiveness.
        </span>
      </button>
      <FieldError msg={errors.data_agreement} />
    </div>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────
export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { icon: StepIcon, label: stepLabel, color: stepColor } = STEP_META[step - 1];

  function handleChange(k: keyof FormData, v: string | boolean) {
    setFormData((p) => ({ ...p, [k]: v }));
    setErrors((p) => { const n = { ...p }; delete n[k as string]; return n; });
  }

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!formData.project_name?.trim() || formData.project_name.length < 2) e.project_name = "Required (min 2 chars)";
      try { if (!formData.website_url) throw new Error(); new URL(formData.website_url); } catch { e.website_url = "Valid URL required"; }
      try {
        if (!formData.twitter_url) throw new Error(); const u = new URL(formData.twitter_url);
        if (!u.hostname.includes("twitter.com") && !u.hostname.includes("x.com")) e.twitter_url = "Must be x.com or twitter.com";
      } catch { if (!e.twitter_url) e.twitter_url = "Valid X/Twitter URL required"; }
      if (!formData.one_liner?.trim() || formData.one_liner.length < 10) e.one_liner = "At least 10 characters";
    }
    if (step === 2) {
      if (!formData.mainnet_status) e.mainnet_status = "Please select one";
      if (!formData.daily_txs) e.daily_txs = "Please select one";
      if (!formData.gas_solution) e.gas_solution = "Please select one";
    }
    if (step === 3) {
      if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "Valid email required";
      if (!formData.telegram?.trim()) e.telegram = "Required";
      if (!formData.data_agreement) e.data_agreement = "You must agree to continue";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleNext = useCallback(async () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep((s) => s + 1);
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const result = await submitApplication(formData as FullApplication);
      if (result.success) {
        router.push(`/success?name=${encodeURIComponent(formData.project_name ?? "")}&id=${result.id}`);
      } else {
        setSubmitError(result.error);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, formData, router]);

  function handlePrev() {
    if (step > 1) { setDirection(-1); setStep((s) => s - 1); setErrors({}); }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (e.key === "Enter" && target.tagName !== "TEXTAREA" && target.tagName !== "BUTTON" && !isSubmitting) {
        e.preventDefault();
        handleNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, isSubmitting]);

  const progressPct = ((step - 1) / TOTAL_STEPS) * 100;

  return (
    <div className="page-bg min-h-screen overflow-hidden">
      {/* Ambient blobs */}
      <div className="blob-primary" style={{ opacity: 0.7 }} />

      {/* Top progress bar */}
      <div className="absolute top-0 left-0 right-0 z-50 h-[2px]" style={{ background: "rgba(255,255,255,0.04)" }}>
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${progressPct}%`,
            background: "linear-gradient(90deg, #7595FF, #94ABFF)",
            boxShadow: "0 0 8px rgba(117,149,255,0.6)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-16 pt-24">

        {/* Logo / back to home */}
        <div className="w-full max-w-lg mb-8 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 btn-ghost px-0">
            <img 
              src="/logo.svg" 
              alt="SmoothSend" 
              className="w-6 h-6"
            />
            <span className="text-sm font-medium text-muted-foreground">SmoothSend</span>
          </a>

          {/* Step indicator pills */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
              const done = i + 1 < step;
              const active = i + 1 === step;
              return (
                <div
                  key={i}
                  className="transition-all duration-300"
                  style={{
                    width: active ? "24px" : "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: done
                      ? "#7595FF"
                      : active
                      ? "#7595FF"
                      : "rgba(255,255,255,0.12)",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Main card */}
        <div className="card-elevated w-full max-w-lg rounded-2xl overflow-hidden mb-16">

          {/* Card header */}
          <div
            className="px-8 pt-7 pb-6 flex items-center gap-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `${stepColor}14`,
                border: `1px solid ${stepColor}22`,
              }}
            >
              <StepIcon className="w-4 h-4" style={{ color: stepColor }} />
            </div>
            <div>
              <p className="label-mono" style={{ color: stepColor }}>
                Step {step} of {TOTAL_STEPS}
              </p>
              <h2 className="text-lg font-semibold tracking-tight mt-0.5 text-foreground">
                {stepLabel}
              </h2>
            </div>
          </div>

          {/* Animated step body */}
          <div className="px-8 py-7 overflow-hidden min-h-[280px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                {step === 1 && <Step1 data={formData} onChange={handleChange} errors={errors} />}
                {step === 2 && <Step2 data={formData} onChange={handleChange} errors={errors} />}
                {step === 3 && <Step3 data={formData} onChange={handleChange} errors={errors} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div
            className="px-8 pt-5 pb-7 flex items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className="btn-ghost"
              style={{ opacity: step === 1 ? 0.25 : 1, pointerEvents: step === 1 ? "none" : "auto" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <div className="flex flex-col items-end gap-1.5">
              {submitError && (
                <p className="text-xs text-destructive">{submitError}</p>
              )}
              <button type="button" onClick={handleNext} disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting…</>
                ) : step === TOTAL_STEPS ? (
                  <><Check className="w-3.5 h-3.5" /> Submit Application</>
                ) : (
                  <>Continue <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
                Press{" "}
                <kbd
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.35)",
                    borderRadius: "4px",
                    padding: "1px 5px",
                    fontSize: "0.6875rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >Enter ↵</kbd>{" "}
                to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
