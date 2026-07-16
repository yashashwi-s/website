"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";

const ACCENT = "#67e4d2";
const STORAGE_KEY = "fadeo.diag.adminSecret";

function fmtSeconds(total) {
  const h = Math.floor(total / 3600);
  if (h >= 1) return `${h.toLocaleString()}h`;
  const m = Math.floor(total / 60);
  return `${m.toLocaleString()}m`;
}

export default function DiagnosticsClient() {
  const [secret, setSecret] = useState("");
  const [entered, setEntered] = useState(false);
  const [data, setData] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      setSecret(saved);
      setEntered(true);
    }
  }, []);

  useEffect(() => {
    if (!entered || !secret) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    const headers = { "x-admin-secret": secret };
    Promise.all([
      fetch("/api/fadeo-diagnostics", { headers }).then(async (r) => {
        if (!r.ok) throw new Error(r.status === 401 ? "Wrong secret." : `Request failed (${r.status})`);
        return r.json();
      }),
      fetch("/api/fadeo-feedback", { headers }).then((r) => (r.ok ? r.json() : { feedback: [] })),
      fetch("/api/fadeo-subscribe", { headers }).then((r) => (r.ok ? r.json() : { subscribers: [] })),
    ])
      .then(([diag, fb, subs]) => {
        if (cancelled) return;
        setData(diag);
        setFeedback(fb.feedback || []);
        setSubscribers(subs.subscribers || []);
        sessionStorage.setItem(STORAGE_KEY, secret);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
        sessionStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [entered, secret]);

  return (
    <div
      id="puremac-page"
      className="cursor-auto min-h-screen bg-[#050505] text-white"
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
    >
      <style>{`body:has(#puremac-page) .noise-bg { display: none; }`}</style>
      <CustomCursor />

      <header className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 pb-2 flex items-center justify-between">
        <a href="/puremac/fadeo" className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors" data-cursor="snap">
          <ArrowLeft size={13} /> Fadeo
        </a>
        <span className="text-[13px] text-white/30">by Yashashwi Singhania</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 pt-14 pb-24">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
            <span className="text-[13px] tracking-wide text-white/45 uppercase">Fadeo diagnostics</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] max-w-xl">
            Who uses Fadeo, and how.
          </h1>
          <p className="text-white/55 text-[16px] mt-4 max-w-lg leading-relaxed">
            Anonymous, opt-in aggregates only — never workspace names, app names, or file paths. Just shape-of-usage
            numbers to guide what to build next.
          </p>
        </div>

        {!entered ? (
          <form onSubmit={(e) => { e.preventDefault(); setEntered(true); }} className="max-w-xs">
            <input
              type="password" autoFocus value={secret} onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="w-full border-b border-white/15 bg-transparent py-2 text-[14px] outline-none focus:border-white/40 placeholder:text-white/30"
            />
            <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium text-black transition-opacity hover:opacity-85" style={{ backgroundColor: ACCENT }} data-cursor="snap">
              View
            </button>
          </form>
        ) : (
          <>
            {loading && <p className="text-white/45 text-[14px]">Loading…</p>}
            {error && <p className="text-red-400/80 text-[14px]">{error}</p>}
            {data && <Dashboard data={data} feedback={feedback} subscribers={subscribers} />}
          </>
        )}
      </main>
    </div>
  );
}

function Dashboard({ data, feedback, subscribers }) {
  const s = data.summary;
  return (
    <>
      <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10 pb-8 border-b border-white/8">
        <Stat label="Installs" value={s.totalInstalls.toLocaleString()} />
        <Stat label="Active 7d" value={s.activeLast7d.toLocaleString()} />
        <Stat label="Licensed" value={`${s.licensedCount} (${pct(s.conversionRate)})`} />
        <Stat label="Avg rating" value={s.ratedCount ? `${s.avgRating.toFixed(1)}★ (${s.ratedCount})` : "—"} />
        <Stat label="Avg session" value={fmtSeconds(s.avgSessionSeconds)} />
        <Stat label="Avg switches/session" value={s.avgSwitchesPerSession.toFixed(1)} />
        <Stat label="Total active time" value={fmtSeconds(s.totalActiveSeconds)} />
        <Stat label="Sessions" value={s.totalSessions.toLocaleString()} />
      </div>

      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 mb-12">
        <Bars title="Sources used (installs)" counts={s.sourceAdoption} total={s.totalInstalls} />
        <Bars title="Triggers used (installs)" counts={s.triggerAdoption} total={s.totalInstalls} />
        <Bars title="Ambient presets (installs)" counts={s.presetAdoption} total={s.totalInstalls} />
        <RatingBars ratings={s.ratings} total={s.ratedCount} />
        <Bars title="By app version" counts={s.byVersion} total={s.totalInstalls} />
        <Bars title="By OS" counts={s.byOS} total={s.totalInstalls} />
      </div>

      <section className="mb-12">
        <SectionTitle>Feedback ({feedback.length})</SectionTitle>
        {feedback.length === 0 && <p className="text-white/35 text-[14px]">No feedback yet.</p>}
        <ul className="space-y-3">
          {feedback.map((f, i) => (
            <li key={i} className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
              <div className="flex items-center gap-3 mb-1.5 text-[12.5px] text-white/40">
                {f.rating ? <span className="text-yellow-400">{"★".repeat(f.rating)}<span className="text-white/15">{"★".repeat(5 - f.rating)}</span></span> : <span>no rating</span>}
                <span>v{f.appVersion}</span>
                <span className="font-mono">{(f.installID || "").slice(0, 6)}</span>
                <span className="ml-auto">{new Date(f.submittedAt).toLocaleDateString()}</span>
              </div>
              {f.text && <p className="text-[14px] text-white/80 whitespace-pre-wrap">{f.text}</p>}
            </li>
          ))}
        </ul>
      </section>

      <Subscribers subscribers={subscribers} />

      <section>
        <SectionTitle>Installs ({data.installs.length})</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] whitespace-nowrap">
            <thead>
              <tr className="text-left text-white/40 border-b border-white/8">
                <Th>Install</Th><Th>Ver</Th><Th>Lic</Th><Th>Rating</Th><Th>Days</Th><Th>Sess</Th><Th>Switch</Th><Th>Active</Th><Th>WS</Th><Th>Last seen</Th>
              </tr>
            </thead>
            <tbody>
              {data.installs.map((r) => (
                <tr key={r.installID} className="border-b border-white/5 text-white/70">
                  <td className="py-2 pr-4 font-mono text-white/40">{r.installID.slice(0, 8)}</td>
                  <td className="py-2 pr-4">{r.appVersion}</td>
                  <td className="py-2 pr-4">{r.licensed ? "✓" : "—"}</td>
                  <td className="py-2 pr-4">{r.rating ? `${r.rating}★` : "—"}</td>
                  <td className="py-2 pr-4">{r.daysSinceFirstLaunch}</td>
                  <td className="py-2 pr-4">{r.sessionCount}</td>
                  <td className="py-2 pr-4">{r.totalSwitches}</td>
                  <td className="py-2 pr-4">{fmtSeconds(r.totalActiveSeconds)}</td>
                  <td className="py-2 pr-4">{r.workspaceCount}</td>
                  <td className="py-2 text-white/40">{new Date(r.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Subscribers({ subscribers }) {
  const [copied, setCopied] = useState(false);
  function copyAll() {
    navigator.clipboard.writeText(subscribers.map((s) => s.email).join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <section className="mb-12">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-[12.5px] uppercase tracking-wide text-white/40">Subscribers ({subscribers.length})</h2>
        {subscribers.length > 0 && (
          <button
            onClick={copyAll}
            className="rounded-full border border-white/10 px-3 py-1 text-[12px] text-white/50 hover:text-white/80 transition-colors"
            data-cursor="snap"
          >
            {copied ? "Copied" : "Copy all emails"}
          </button>
        )}
      </div>
      {subscribers.length === 0 ? (
        <p className="text-white/35 text-[14px]">No subscribers yet.</p>
      ) : (
        <ul className="space-y-1.5">
          {subscribers.map((s) => (
            <li key={s.email} className="flex items-baseline gap-3 text-[13px]">
              <span className="text-white/75">{s.email}</span>
              {s.subscribedAt && (
                <span className="text-[12px] text-white/30">{new Date(s.subscribedAt).toLocaleDateString()}</span>
              )}
              {s.source && <span className="text-[11.5px] text-white/25">{s.source}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function pct(x) { return `${Math.round((x || 0) * 100)}%`; }
function Th({ children }) { return <th className="py-2 pr-4 font-normal">{children}</th>; }
function SectionTitle({ children }) {
  return <h2 className="text-[12.5px] uppercase tracking-wide text-white/40 mb-4">{children}</h2>;
}
function Stat({ label, value }) {
  return (
    <div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-[12.5px] text-white/40 mt-0.5">{label}</div>
    </div>
  );
}

function Bars({ title, counts, total }) {
  const entries = Object.entries(counts || {}).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(([, v]) => v));
  return (
    <div>
      <div className="text-[12.5px] text-white/40 uppercase tracking-wide mb-3">{title}</div>
      {entries.length === 0 && <div className="text-[13px] text-white/30">No data.</div>}
      <div className="space-y-2">
        {entries.map(([k, v]) => (
          <div key={k}>
            <div className="flex justify-between text-[12.5px] text-white/70 mb-1">
              <span>{k}</span>
              <span className="text-white/40 tabular-nums">{v}{total ? ` · ${Math.round((v / total) * 100)}%` : ""}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(v / max) * 100}%`, backgroundColor: ACCENT }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RatingBars({ ratings, total }) {
  const max = Math.max(1, ...[1, 2, 3, 4, 5].map((n) => ratings?.[n] || 0));
  return (
    <div>
      <div className="text-[12.5px] text-white/40 uppercase tracking-wide mb-3">Ratings</div>
      {(!total || total === 0) && <div className="text-[13px] text-white/30">No ratings yet.</div>}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((n) => {
          const v = ratings?.[n] || 0;
          return (
            <div key={n}>
              <div className="flex justify-between text-[12.5px] text-white/70 mb-1">
                <span className="text-yellow-400">{"★".repeat(n)}</span>
                <span className="text-white/40 tabular-nums">{v}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(v / max) * 100}%`, backgroundColor: "#eab308" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
