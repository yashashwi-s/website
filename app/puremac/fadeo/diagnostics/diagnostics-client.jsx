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
    fetch("/api/fadeo-diagnostics", { headers: { "x-admin-secret": secret } })
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 401 ? "Wrong secret." : `Request failed (${res.status})`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
        sessionStorage.setItem(STORAGE_KEY, secret);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
        sessionStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
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
        <a
          href="/puremac/fadeo"
          className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors"
          data-cursor="snap"
        >
          <ArrowLeft size={13} />
          Fadeo
        </a>
        <span className="text-[13px] text-white/30">by Yashashwi Singhania</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 pt-16 pb-24">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
            <span className="text-[13px] tracking-wide text-white/45 uppercase">Fadeo diagnostics</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] max-w-xl">
            Usage, anonymous and opt-in.
          </h1>
          <p className="text-white/55 text-[16px] mt-4 max-w-lg leading-relaxed">
            No workspace names, app bundle IDs, file paths, or config contents are ever sent. Just shape-of-usage
            numbers, from installs that opted in.
          </p>
        </div>

        {!entered ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEntered(true);
            }}
            className="max-w-xs"
          >
            <input
              type="password"
              autoFocus
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="w-full border-b border-white/15 bg-transparent py-2 text-[14px] outline-none focus:border-white/40 placeholder:text-white/30"
            />
            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium text-black transition-opacity hover:opacity-85"
              style={{ backgroundColor: ACCENT }}
              data-cursor="snap"
            >
              View
            </button>
          </form>
        ) : (
          <>
            {loading && <p className="text-white/45 text-[14px]">Loading...</p>}
            {error && <p className="text-red-400/80 text-[14px]">{error}</p>}

            {data && (
              <>
                <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10 pb-8 border-b border-white/8">
                  <Stat label="Installs" value={data.summary.totalInstalls.toLocaleString()} />
                  <Stat label="Active last 7d" value={data.summary.activeLast7d.toLocaleString()} />
                  <Stat label="Sessions" value={data.summary.totalSessions.toLocaleString()} />
                  <Stat label="Switches" value={data.summary.totalSwitches.toLocaleString()} />
                  <Stat label="Active time" value={fmtSeconds(data.summary.totalActiveSeconds)} />
                  <Stat label="Avg workspaces" value={data.summary.avgWorkspaceCount.toFixed(1)} />
                </div>

                <div className="flex flex-wrap gap-x-10 gap-y-6 mb-10">
                  <Breakdown title="By version" counts={data.summary.byVersion} />
                  <Breakdown title="By OS" counts={data.summary.byOS} />
                </div>

                <table className="w-full text-[13.5px]">
                  <thead>
                    <tr className="text-left text-white/40 border-b border-white/8">
                      <th className="py-2 pr-4 font-normal">Install</th>
                      <th className="py-2 pr-4 font-normal">Version</th>
                      <th className="py-2 pr-4 font-normal">Days used</th>
                      <th className="py-2 pr-4 font-normal">Sessions</th>
                      <th className="py-2 pr-4 font-normal">Switches</th>
                      <th className="py-2 pr-4 font-normal">Active</th>
                      <th className="py-2 font-normal">Last seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.installs.map((row) => (
                      <tr key={row.installID} className="border-b border-white/5 text-white/70">
                        <td className="py-2 pr-4 font-mono text-white/40">{row.installID.slice(0, 8)}</td>
                        <td className="py-2 pr-4">{row.appVersion}</td>
                        <td className="py-2 pr-4">{row.daysSinceFirstLaunch}</td>
                        <td className="py-2 pr-4">{row.sessionCount}</td>
                        <td className="py-2 pr-4">{row.totalSwitches}</td>
                        <td className="py-2 pr-4">{fmtSeconds(row.totalActiveSeconds)}</td>
                        <td className="py-2 text-white/40">{new Date(row.submittedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {data.installs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-white/35">
                          No opted-in installs have reported yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-[12.5px] text-white/40 mt-0.5">{label}</div>
    </div>
  );
}

function Breakdown({ title, counts }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (
    <div>
      <div className="text-[12.5px] text-white/40 uppercase tracking-wide mb-2">{title}</div>
      {entries.length === 0 && <div className="text-[13px] text-white/35">No data yet.</div>}
      <ul className="space-y-1">
        {entries.map(([k, v]) => (
          <li key={k} className="flex justify-between gap-6 text-[13px] text-white/70">
            <span>{k}</span>
            <span className="text-white/40 tabular-nums">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
