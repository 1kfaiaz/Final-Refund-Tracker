import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/app/lib/supabase";
import { getCurrentWeekKey } from "@/app/lib/week";

/* =========================
   GET — fetch all refunds
   ========================= */
export async function GET() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("refunds")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/* =========================
   POST — log a refund
   ========================= */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabase();

    const { error } = await supabase.from("refunds").insert({
      platform: body.platform,
      order_date_time: new Date().toISOString(),
      week_key: getCurrentWeekKey(),
      total_order_value: Number(body.totalOrderValue),
      refunded_amount: Number(body.refundedAmount),
      items_refunded: Number(body.itemsRefunded),
      refund_reason: body.refundReason,
      fault_source: body.faultSource,
      manager_notes: body.managerNotes ?? null,
      photos: body.photos ?? null,
      status: "valid",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
