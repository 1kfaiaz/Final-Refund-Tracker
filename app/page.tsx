"use client";

import { useEffect, useState } from "react";

type Refund = {
  id: string;
  platform: string;
  refunded_amount: number;
  fault_source: string | null;
  week_key: string;
};

export default function DashboardPage() {
  const [selectedWeekKey, setSelectedWeekKey] = useState<string>("");
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedWeekKey) return;

    setLoading(true);
    fetch(`/api/refunds?week=${selectedWeekKey}`)
      .then((res) => res.json())
      .then((data) => setRefunds(data))
      .finally(() => setLoading(false));
  }, [selectedWeekKey]);

  const totalRefunded = refunds.reduce(
    (sum, r) => sum + Number(r.refunded_amount || 0),
    0
  );

  const refundCount = refunds.length;
  const averageRefund = refundCount ? totalRefunded / refundCount : 0;

  const byPlatform = refunds.reduce<Record<string, number>>((acc, r) => {
    acc[r.platform] = (acc[r.platform] || 0) + r.refunded_amount;
    return acc;
  }, {});

  const byFault = refunds.reduce<Record<string, number>>((acc, r) => {
    const key = r.fault_source || "Unknown";
    acc[key] = (acc[key] || 0) + r.refunded_amount;
    return acc;
  }, {});

  const aiInsight =
    refundCount === 0
      ? "No refunds recorded for this week."
      : `${Object.entries(byPlatform).sort(
          (a, b) => b[1] - a[1]
        )[0][0]} generated the highest refund impact this week.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white p-8 space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Weekly Refund Analytics
          </h1>
          <p className="text-zinc-400 mt-1">
            Live operational overview by week
          </p>
        </div>

        {/* WEEK PICKER */}
        <div className="relative">
          <input
            type="week"
            value={selectedWeekKey}
            onChange={(e) => setSelectedWeekKey(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3 pr-12 text-white shadow-lg cursor-pointer focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute right-4 top-3.5 text-indigo-400 text-lg">
            📅
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Refunded"
          value={`£${totalRefunded.toFixed(2)}`}
          accent="emerald"
        />
        <StatCard
          title="Refund Count"
          value={refundCount}
          accent="indigo"
        />
        <StatCard
          title="Average Refund"
          value={`£${averageRefund.toFixed(2)}`}
          accent="pink"
        />
      </div>

      {/* AI INSIGHT */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,white,transparent)]" />
        <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
          🧠 AI Insight
        </h3>
        <p className="text-indigo-100">{aiInsight}</p>
      </div>

      {/* BREAKDOWNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Breakdown title="Refunds by Platform" data={byPlatform} />
        <Breakdown title="Refunds by Fault Source" data={byFault} />
      </div>

      {loading && (
        <p className="text-zinc-400 text-sm animate-pulse">
          Loading refund data…
        </p>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: any;
  accent: "emerald" | "indigo" | "pink";
}) {
  const accentMap = {
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
    indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-400",
    pink: "from-pink-500/20 to-pink-500/5 text-pink-400",
  };

  return (
    <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-lg hover:shadow-xl transition">
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentMap[accent]} opacity-40`}
      />
      <div className="relative">
        <p className="text-zinc-400 text-sm">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
    </div>
  );
}

function Breakdown({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-lg">
      <h3 className="font-semibold mb-4 text-lg">{title}</h3>

      {Object.keys(data).length === 0 ? (
        <p className="text-zinc-500 text-sm">No data available</p>
      ) : (
        <ul className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <li
              key={key}
              className="flex justify-between items-center rounded-xl bg-zinc-800/60 px-4 py-3 hover:bg-zinc-800 transition"
            >
              <span className="text-zinc-300">{key}</span>
              <span className="font-semibold text-emerald-400">
                £{value.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
