"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogRefundPage() {
  const router = useRouter()

  const [platform, setPlatform] = useState("")
  const [refundedAmount, setRefundedAmount] = useState("")
  const [faultSource, setFaultSource] = useState("")

  function getWeekKey() {
    const d = new Date()
    const year = d.getFullYear()
    const week = Math.ceil(
      (((d.getTime() - new Date(year, 0, 1).getTime()) / 86400000) +
        new Date(year, 0, 1).getDay() +
        1) /
        7
    )
    return `${year}-W${week}`
  }

  async function submit() {
    const res = await fetch("/api/refunds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        refunded_amount: Number(refundedAmount), // ✅ NUMBER
        fault_source: faultSource,
        week_key: getWeekKey(),
        status: "valid",
      }),
    })

    if (!res.ok) {
      alert("Failed to save refund")
      return
    }

    router.refresh()
    router.push("/refunds")
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-14 space-y-4">
      <input
        placeholder="Platform (Uber, Deliveroo)"
        className="input"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      />

      <input
        placeholder="Refunded Amount (£)"
        className="input"
        type="number"
        value={refundedAmount}
        onChange={(e) => setRefundedAmount(e.target.value)}
      />

      <input
        placeholder="Fault Source"
        className="input"
        value={faultSource}
        onChange={(e) => setFaultSource(e.target.value)}
      />

      <button onClick={submit} className="btn-primary w-full">
        Save Refund
      </button>
    </div>
  )
}
