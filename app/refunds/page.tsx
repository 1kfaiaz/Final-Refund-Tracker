"use client";

import { useEffect, useState } from "react";

type Refund = {
  id: string;
  platform: string;
  refunded_amount: number;
  fault_source: string | null;
  created_at: string;
  status: "valid" | "reversed";
};

export default function RefundListPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);

  const loadRefunds = async () => {
    const res = await fetch("/api/refunds", { cache: "no-store" });
    const data = await res.json();
    setRefunds(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadRefunds();
  }, []);

  const updateStatus = async (id: string, status: Refund["status"]) => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );

    await fetch(`/api/refunds/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6 text-white">
        Refund History
      </h1>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <table className="w-full text-left">
          <thead className="bg-zinc-800 text-zinc-400">
            <tr>
              <th className="p-4">Platform</th>
              <th className="p-4">Fault</th>
              <th className="p-4">Refunded</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {refunds.map((r) => (
              <tr
                key={r.id}
                className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
              >
                <td className="p-4 text-white">{r.platform}</td>

                <td className="p-4 text-zinc-300">
                  {r.fault_source ?? "-"}
                </td>

                <td className="p-4 text-emerald-400 font-medium">
                  £{r.refunded_amount.toFixed(2)}
                </td>

                <td className="p-4 text-zinc-400">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <select
                    value={r.status}
                    onChange={(e) =>
                      updateStatus(
                        r.id,
                        e.target.value as Refund["status"]
                      )
                    }
                    className={`rounded-lg px-3 py-1 text-sm font-medium
                      ${
                        r.status === "valid"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }
                    `}
                  >
                    <option value="valid">Valid</option>
                    <option value="reversed">Reversed</option>
                  </select>
                </td>
              </tr>
            ))}

            {refunds.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-zinc-500"
                >
                  No refunds found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
