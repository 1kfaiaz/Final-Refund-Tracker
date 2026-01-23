import { NextResponse, NextRequest } from "next/server";
import { getSupabase } from "@/app/lib/supabase";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const supabase = getSupabase();

    const { error } = await supabase
      .from("refunds")
      .update({ status: body.status })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
