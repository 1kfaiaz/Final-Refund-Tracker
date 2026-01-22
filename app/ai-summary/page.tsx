"use client";

import { useState } from "react";

type Refund = {
  platform: string;
  refunded_amount: number;
  fault_source: string | null;
};

export default function AIReportPage() {
  const [week, setWeek] = useState("");
  const [loading, setLoading] = useState(false);
  const [refunds, setRefunds] = useState<Refund[]>([]);

  async function generateReport() {
    if (!week) {
      alert("Please select a week first");
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/refunds?week=${week}`);
    const data = await res.json();
    setRefunds(data);
    setLoading(false);
  }

  /* ---------- ANALYSIS ---------- */

  const totalRefunded = refunds.reduce(
    (sum, r) => sum + Number(r.refunded_amount || 0),
    0
  );

  const byPlatform = refunds.reduce<Record<string, number>>((acc, r) => {
    acc[r.platform] = (acc[r.platform] || 0) + r.refunded_amount;
    return acc;
  }, {});

  const byFault = refunds.reduce<Record<string, number>>((acc, r) => {
    const key = r.fault_source || "Unknown";
    acc[key] = (acc[key] || 0) + r.refunded_amount;
    return acc;
  }, {});

  const topPlatform =
    Object.entries(byPlatform).sort((a, b) => b[1] - a[1])[0]?.[0];

  const topFault =
    Object.entries(byFault).sort((a, b) => b[1] - a[1])[0]?.[0];

  /* ---------- RENDER ---------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white p-10 space-y-10">
      {/* HEADER */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">AI Weekly Management Report</h1>
        <p className="text-zinc-400">
          Automatically generated insights from refund data
        </p>

        {/* WEEK PICKER */}
        <div className="flex justify-center gap-4 mt-6">
          <input
            type="week"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={generateReport}
            disabled={loading}
            className="rounded-xl px-6 py-3 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition"
          >
            {loading ? "Generating…" : "Generate Weekly Report"}
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {refunds.length === 0 && !loading && (
        <p className="text-center text-zinc-500">
          No data loaded for this week.
        </p>
      )}

      {/* REPORT */}
      {refunds.length > 0 && (
        <div className="space-y-6">
          <ReportCard title="Executive Summary">
            £{totalRefunded.toFixed(2)} refunded this week across{" "}
            {refunds.length} orders.
          </ReportCard>

          <ReportCard title="Key Trends">
            {topPlatform
              ? `${topPlatform} generated the highest refund value.`
              : "No trends detected."}
          </ReportCard>

          <ReportCard title="Operational Issues">
            {topFault
              ? `Most refunds were caused by ${topFault}.`
              : "No major operational issues detected."}
          </ReportCard>

          <ReportCard title="Recommendations">
            {topFault
              ? `Investigate ${topFault}-related issues to reduce refunds next week.`
              : "Maintain current operational standards."}
          </ReportCard>
        </div>
      )}
    </div>
  );
}

/* ---------- COMPONENT ---------- */

function ReportCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-lg">
      <h3 className="font-semibold mb-2 text-lg">{title}</h3>
      <p className="text-zinc-300">{children}</p>
    </div>
  );
}
