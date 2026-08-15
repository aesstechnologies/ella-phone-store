import { createClientOrNull } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const chatSchema = z.object({
  content: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = chatSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = await createClientOrNull();
  if (!supabase) {
    return NextResponse.json({ ok: true });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!conversation) {
    const { data: created, error: createError } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, subject: "Support" })
      .select("id")
      .single();

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }
    conversation = created;
  }

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversation.id,
    sender_id: user.id,
    content: parsed.data.content,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
