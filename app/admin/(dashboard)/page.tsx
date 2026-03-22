"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  Copy,
  Check,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Mail,
  Twitter,
  FileText,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export type Application = {
  id: string;
  created_at: string;
  project_name: string;
  website_url: string;
  twitter_url: string;
  one_liner: string;
  mainnet_status: "live" | "testnet" | "migrating";
  daily_txs: "<50" | "50-250" | "250-1000" | "1000+";
  gas_solution: "users_pay" | "built_own" | "third_party";
  why_gasless: string;
  email: string;
  telegram: string;
  data_agreement: boolean;
  status: "new" | "reviewing" | "selected" | "rejected";
  admin_notes: string;
};
import { updateApplicationStatus, updateApplicationNotes } from "@/app/actions";
import { formatDate } from "@/lib/utils";

type Status = Application["status"];

const STATUS_CONFIG: Record<Status, { label: string; bg: string; border: string; color: string }> = {
  new:       { label: "New",        bg: "rgba(117,149,255,0.08)", border: "rgba(117,149,255,0.25)", color: "#7595FF"  },
  reviewing: { label: "Reviewing",  bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.25)",  color: "#FBBF24"  },
  selected:  { label: "Selected",   bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)",  color: "#10B981"  },
  rejected:  { label: "Rejected",   bg: "rgba(239,68,68,0.06)",   border: "rgba(239,68,68,0.20)",   color: "#f87171"  },
};

const MAINNET_LABELS: Record<string, string> = {
  live:       "🟢 Live",
  testnet:    "🟡 Testnet",
  migrating:  "🔵 Migrating",
};

const TX_LABELS: Record<string, string> = {
  "<50":      "< 50/day",
  "50-250":   "50–250",
  "250-1000": "250–1k",
  "1000+":    "1k+",
};

const GAS_LABELS: Record<string, string> = {
  users_pay:  "Users pay",
  built_own:  "Built own",
  third_party: "3rd party",
};

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyBtn({ text, children }: { text: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="btn-ghost text-xs py-1 px-2 flex items-center gap-1.5 group"
      title={text}
    >
      {children}
      {copied
        ? <Check className="w-3 h-3 flex-shrink-0" style={{ color: "#10B981" }} />
        : <Copy className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
      }
    </button>
  );
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────
function StatusDropdown({ appId, current, onChange }: {
  appId: string; current: Status; onChange: (id: string, s: Status) => void;
}) {
  const [open, setOpen] = useState(false);
  const conf = STATUS_CONFIG[current];
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
        style={{ background: conf.bg, border: `1px solid ${conf.border}`, color: conf.color }}
      >
        {conf.label}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-full mt-1 z-20 rounded-xl overflow-hidden py-1 min-w-[150px]"
            style={{
              background: "#0D0E1A",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
              <button
                key={s}
                onClick={(e) => { e.stopPropagation(); onChange(appId, s); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-all duration-150 hover:bg-[rgba(255,255,255,0.04)] ${s !== current ? "text-muted-foreground" : ""}`}
                style={{
                  background: s === current ? STATUS_CONFIG[s].bg : "transparent",
                  color: s === current ? STATUS_CONFIG[s].color : undefined,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: STATUS_CONFIG[s].color, opacity: s === current ? 1 : 0.4 }}
                />
                {STATUS_CONFIG[s].label}
                {s === current && <Check className="w-3 h-3 ml-auto" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Application Row ──────────────────────────────────────────────────────────
function ApplicationRow({ app, onStatusChange, onNotesSave }: {
  app: Application;
  onStatusChange: (id: string, s: Status) => void;
  onNotesSave: (id: string, notes: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(app.admin_notes ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSaveNotes() {
    setSaving(true);
    await onNotesSave(app.id, notes);
    setSaving(false);
  }

  return (
    <div
      className="border-b last:border-0"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      {/* Main row */}
      <div
        className="row-hover flex items-center gap-4 px-6 py-4 cursor-pointer"
        data-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        <ChevronRight
          className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 text-muted-foreground"
          style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
        />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate text-foreground">
            {app.project_name}
          </p>
          <p className="text-xs truncate mt-0.5 text-foreground-ghost">
            {app.one_liner}
          </p>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <StatusDropdown appId={app.id} current={app.status} onChange={onStatusChange} />
        </div>

        <span className="hidden md:block text-xs flex-shrink-0 text-muted-foreground" style={{ minWidth: "100px" }}>
          {MAINNET_LABELS[app.mainnet_status]}
        </span>

        <span className="hidden lg:block text-xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.30)", minWidth: "70px" }}>
          {TX_LABELS[app.daily_txs]}
        </span>

        <div className="hidden xl:flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <CopyBtn text={app.email}>
            <Mail className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
          </CopyBtn>
          <CopyBtn text={app.telegram}>
            <MessageCircle className="w-3.5 h-3.5" style={{ color: "#60a5fa" }} />
          </CopyBtn>
        </div>

        <span className="text-xs flex-shrink-0 text-right text-foreground-dim" style={{ minWidth: "55px" }}>
          {formatDate(app.created_at)}
        </span>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div
          className="px-6 pb-7"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.15)" }}
        >
          <div className="pt-6 grid md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-5">
              <div>
                <p className="label-mono mb-3">Contact</p>
                <div className="space-y-1">
                  <CopyBtn text={app.email}>
                    <Mail className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
                    <span className="text-xs text-muted-foreground">{app.email}</span>
                  </CopyBtn>
                  <CopyBtn text={app.telegram}>
                    <MessageCircle className="w-3.5 h-3.5" style={{ color: "#60a5fa" }} />
                    <span className="text-xs text-muted-foreground">{app.telegram}</span>
                  </CopyBtn>
                  <a
                    href={app.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn-ghost flex items-center gap-1.5 text-xs py-1 px-2"
                    style={{ color: "#8A8F98" }}
                  >
                    <Twitter className="w-3.5 h-3.5" style={{ color: "#38bdf8" }} />
                    <span className="truncate max-w-[160px]">{app.twitter_url}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-40" />
                  </a>
                  <a
                    href={app.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn-ghost flex items-center gap-1.5 text-xs py-1 px-2"
                    style={{ color: "#8A8F98" }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[160px]">{app.website_url}</span>
                  </a>
                </div>
              </div>

              <div>
                <p className="label-mono mb-3">Tech Profile</p>
                <div className="space-y-2">
                  {([
                    ["Mainnet", MAINNET_LABELS[app.mainnet_status]],
                    ["Daily Txs", TX_LABELS[app.daily_txs]],
                    ["Gas Solution", GAS_LABELS[app.gas_solution]],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2 text-xs">
                      <span className="text-foreground-dim" style={{ minWidth: "90px" }}>{k}</span>
                      <span className="text-muted-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div>
                <p className="label-mono mb-3">Why Gasless?</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{app.why_gasless}</p>
              </div>

              <div>
                <p className="label-mono mb-3">Internal Notes</p>
                <textarea
                  className="form-input text-xs"
                  style={{ minHeight: "90px", resize: "none" }}
                  placeholder="Add review notes…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleSaveNotes(); }}
                  disabled={saving}
                  className="btn-secondary mt-2 text-xs py-1.5 px-3"
                  style={{ display: "inline-flex" }}
                >
                  <FileText className="w-3 h-3" />
                  {saving ? "Saving…" : "Save Notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");

  async function loadApps() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setApps(data as Application[]);
    setLoading(false);
  }

  useEffect(() => { loadApps(); }, []);

  async function handleStatusChange(id: string, status: Status) {
    setApps((p) => p.map((a) => (a.id === id ? { ...a, status } : a)));
    await updateApplicationStatus(id, status);
  }

  async function handleNotesSave(id: string, admin_notes: string) {
    await updateApplicationNotes(id, admin_notes);
    setApps((p) => p.map((a) => (a.id === id ? { ...a, admin_notes } : a)));
  }

  const counts = {
    all: apps.length,
    new: apps.filter((a) => a.status === "new").length,
    reviewing: apps.filter((a) => a.status === "reviewing").length,
    selected: apps.filter((a) => a.status === "selected").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  } as Record<string, number>;

  const visible = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  return (
    <div className="px-6 pt-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Applications</h1>
          <p className="text-sm mt-1 text-muted-foreground">
            {counts.all} total ·{" "}
            <span style={{ color: "#7595FF" }}>{counts.new} new</span>
          </p>
        </div>
        <button onClick={loadApps} disabled={loading} className="btn-secondary text-xs">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div
        className="flex items-center gap-1 mb-6 p-1 rounded-xl w-fit"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {(["all", "new", "reviewing", "selected", "rejected"] as const).map((s) => {
          const isAll = s === "all";
          const conf = isAll ? null : STATUS_CONFIG[s];
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap"
              style={{
                background: active
                  ? conf ? conf.bg : "rgba(255,255,255,0.07)"
                  : "transparent",
                color: active
                  ? conf ? conf.color : "#EDEDEF"
                  : "#8A8F98",
                border: active
                  ? conf ? `1px solid ${conf.border}` : "1px solid rgba(255,255,255,0.10)"
                  : "1px solid transparent",
              }}
            >
              {isAll ? "All" : STATUS_CONFIG[s].label}
              <span
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: active ? "inherit" : "rgba(255,255,255,0.25)",
                }}
              >
                {counts[s]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 4px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Table header */}
        <div
          className="hidden md:flex items-center gap-4 px-6 py-3 border-b"
          style={{
            color: "rgba(255,255,255,0.22)",
            borderColor: "rgba(255,255,255,0.05)",
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <span className="w-3.5" />
          <span className="flex-1">Project</span>
          <span style={{ minWidth: "110px" }}>Status</span>
          <span className="hidden md:block" style={{ minWidth: "100px" }}>Mainnet</span>
          <span className="hidden lg:block" style={{ minWidth: "70px" }}>Txs</span>
          <span className="hidden xl:block" style={{ minWidth: "80px" }}>Contact</span>
          <span style={{ minWidth: "55px", textAlign: "right" }}>Submitted</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2" style={{ color: "#8A8F98" }}>
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: "#7595FF", borderTopColor: "transparent" }}
            />
            <span className="text-xs">Loading…</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 text-sm text-foreground-dim">
            No applications.
          </div>
        ) : (
          visible.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              onStatusChange={handleStatusChange}
              onNotesSave={handleNotesSave}
            />
          ))
        )}
      </div>
    </div>
  );
}
