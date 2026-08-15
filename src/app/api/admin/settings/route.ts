import { isAdmin } from "@/lib/data/queries";
import { createClientOrNull } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const supabase = await createClientOrNull();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      message: "Settings saved locally. Connect Supabase to persist.",
    });
  }

  const { id: _id, ...updates } = body;

  const { data: existing } = await supabase
    .from("store_settings")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("store_settings")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabase.from("store_settings").insert(updates);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
