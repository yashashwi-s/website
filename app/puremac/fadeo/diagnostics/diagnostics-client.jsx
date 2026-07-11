"use client";

import { useEffect, useState } from "react";

const ACCENT = "#67e4d2";
const STORAGE_KEY = "fadeo.diag.adminSecret";

function fmtSeconds(total) {
  const h = Math.floor(total / 3600);
  if (h >= 1) return `${h.toLocaleString()}h`;
  const m = Math.floor(total / 60);
  return `${m.toLocaleString()}m`;
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function BreakdownList({ title, counts }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-wide text-white/50 mb-2">{title}</div>
      {entries.length === 0 && <div className="text-sm text-white/40">No data yet.</div>}
      <ul className="space-y-1">
        {entries.map(([k, v]) => (
          <li key={k} className="flex justify-between text-sm text-white/80">
            <span className="truncate pr-2">{k}</span>
            <span className="text-white/50 tabular-nums">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
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

  if (!entered) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEntered(true);
          }}
          className="w-full max-w-sm rounded-xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h1 className="text-lg font-semibold mb-1">Fadeo diagnostics</h1>
          <p className="text-sm text-white/50 mb-4">Admin secret required.</p>
          <input
            type="password"
            autoFocus
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Admin secret"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/30"
          />
          <button
            type="submit"
            className="mt-3 w-full rounded-md py-2 text-sm font-medium text-black"
            style={{ background: ACCENT }}
          >
            View
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Fadeo diagnostics</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem(STORAGE_KEY);
              setEntered(false);
              setSecret("");
              setData(null);
            }}
            className="text-xs text-white/40 hover:text-white/70"
          >
            Sign out
          </button>
        </div>

        {loading && <p className="text-sm text-white/50">Loading...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {data && (
          <>
            <p className="text-xs text-white/40 mb-4">
              Anonymous, opt-in only. No workspace names, app bundle IDs, file paths, or config contents are ever sent
              -- see ShareableUsageSummary in the app.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <StatCard label="Installs reporting" value={data.summary.totalInstalls.toLocaleString()} />
              <StatCard label="Active last 7d" value={data.summary.activeLast7d.toLocaleString()} />
              <StatCard label="Total sessions" value={data.summary.totalSessions.toLocaleString()} />
              <StatCard label="Total switches" value={data.summary.totalSwitches.toLocaleString()} />
              <StatCard label="Total active time" value={fmtSeconds(data.summary.totalActiveSeconds)} />
              <StatCard label="Avg workspaces/install" value={data.summary.avgWorkspaceCount.toFixed(1)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <BreakdownList title="By app version" counts={data.summary.byVersion} />
              <BreakdownList title="By OS version" counts={data.summary.byOS} />
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/40 border-b border-white/10">
                    <th className="px-3 py-2 font-normal">Install</th>
                    <th className="px-3 py-2 font-normal">Version</th>
                    <th className="px-3 py-2 font-normal">Days since first launch</th>
                    <th className="px-3 py-2 font-normal">Sessions</th>
                    <th className="px-3 py-2 font-normal">Workspaces</th>
                    <th className="px-3 py-2 font-normal">Switches</th>
                    <th className="px-3 py-2 font-normal">Active time</th>
                    <th className="px-3 py-2 font-normal">Last seen</th>
                  </tr>
                </thead>
                <tbody>
                  {data.installs.map((row) => (
                    <tr key={row.installID} className="border-b border-white/5 last:border-0">
                      <td className="px-3 py-2 text-white/60 font-mono text-xs">{row.installID.slice(0, 8)}</td>
                      <td className="px-3 py-2">{row.appVersion}</td>
                      <td className="px-3 py-2">{row.daysSinceFirstLaunch}</td>
                      <td className="px-3 py-2">{row.sessionCount}</td>
                      <td className="px-3 py-2">{row.workspaceCount}</td>
                      <td className="px-3 py-2">{row.totalSwitches}</td>
                      <td className="px-3 py-2">{fmtSeconds(row.totalActiveSeconds)}</td>
                      <td className="px-3 py-2 text-white/50">{new Date(row.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {data.installs.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-6 text-center text-white/40">
                        No opted-in installs have reported yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
