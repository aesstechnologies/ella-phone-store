import { createClientOrNull } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const repairSchema = z.object({
  deviceModel: z.string().min(1),
  issueDescription: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = repairSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = await createClientOrNull();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      message: "Request noted. Connect Supabase to persist repairs.",
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("repairs").insert({
    user_id: user?.id ?? null,
    device_model: parsed.data.deviceModel,
    issue_description: parsed.data.issueDescription,
    status: "received",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
