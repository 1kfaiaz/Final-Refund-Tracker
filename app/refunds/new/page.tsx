"use client"

import { useState } from "react"
import { PLATFORMS, FAULT_SOURCES } from "@/app/lib/constants"

export default function NewRefundPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    await fetch("/api/refunds", {
      method: "POST",
      body: JSON.stringify({
        platform: form.get("platform"),
        order_id: form.get("order_id") || null,
        order_date_time: form.get("order_date_time"),
        total_order_value: Number(form.get("total_order_value")),
        refunded_amount: Number(form.get("refunded_amount")),
        items_refunded: Number(form.get("items_refunded")),
        refund_reason: form.get("refund_reason"),
        fault_source: form.get("fault_source"),
        manager_notes: form.get("manager_notes") || null,
      }),
    })

    setLoading(false)
    e.currentTarget.reset()
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Log Refund</h1>
      <p className="text-gray-400 mb-6">
        Record delivery refunds for Uber, Deliveroo & Just Eat
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl"
      >
        {/* Platform */}
        <div>
          <label className="label">Platform</label>
          <select name="platform" required className="input">
            <option value="">Select platform</option>
            {PLATFORMS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="label">
            Order Date & Time <span className="text-purple-400">(click field)</span>
          </label>
          <input
            type="datetime-local"
            name="order_date_time"
            required
            className="input cursor-pointer"
          />
        </div>

        {/* Order ID */}
        <div>
          <label className="label">Order ID (optional)</label>
          <input name="order_id" className="input" placeholder="Uber / Just Eat Order ID" />
        </div>

        {/* Total */}
        <div>
          <label className="label">Total Order Value (£)</label>
          <input name="total_order_value" type="number" step="0.01" required className="input" />
        </div>

        {/* Refunded */}
        <div>
          <label className="label">Refunded Amount (£)</label>
          <input name="refunded_amount" type="number" step="0.01" required className="input" />
        </div>

        {/* Items */}
        <div>
          <label className="label">Items Refunded</label>
          <input name="items_refunded" type="number" required className="input" />
        </div>

        {/* Reason */}
        <div>
          <label className="label">Refund Reason</label>
          <input name="refund_reason" required className="input" />
        </div>

        {/* Fault */}
        <div>
          <label className="label">Fault Source</label>
          <select name="fault_source" required className="input">
            <option value="">Select</option>
            {FAULT_SOURCES.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="label">Manager Notes</label>
          <textarea name="manager_notes" rows={3} className="input" />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition"
          >
            {loading ? "Saving..." : "Log Refund"}
          </button>
        </div>
      </form>
    </div>
  )
}
