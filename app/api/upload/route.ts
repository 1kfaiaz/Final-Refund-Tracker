import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/app/lib/supabase"
import { getCurrentWeekKey } from "@/app/lib/week"

export async function GET() {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("refunds")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = getSupabaseAdmin()

    const {
      platform,
      totalOrderValue,
      refundedAmount,
      itemsRefunded,
      refundReason,
      faultSource,
      managerNotes,
      photos
    } = body

    const { error } = await supabase.from("refunds").insert({
      platform,
      order_date_time: new Date().toISOString(),
      week_key: getCurrentWeekKey(),
      total_order_value: Number(totalOrderValue),
      refunded_amount: Number(refundedAmount),
      items_refunded: Number(itemsRefunded),
      refund_reason: refundReason,
      fault_source: faultSource,
      manager_notes: managerNotes ?? null,
      photos: photos ?? null,
      status: "valid"
    })

    if (error) {
      console.error("INSERT FAILED:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("POST ERROR:", err)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
