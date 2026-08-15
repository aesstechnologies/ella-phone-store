"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClientOrNull } from "@/lib/supabase/client";
import { MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function ChatWidget({ userId }: { userId?: string | null }) {
  const t = useTranslations("chat");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; content: string; isMine: boolean }[]
  >([{ id: "greeting", content: t("greeting"), isMine: false }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const supabase = createClientOrNull();
    if (!supabase || !userId) return;

    const channel = supabase
      .channel("ella-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as { id: string; content: string; sender_id: string };
          if (msg.sender_id !== userId) {
            setMessages((prev) => [
              ...prev,
              { id: msg.id, content: msg.content, isMine: false },
            ]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const content = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), content, isMine: true },
    ]);

    if (!userId) return;

    setSending(true);
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-ella-rose-deep to-ella-lilac text-white shadow-lg shadow-ella-rose/30 transition hover:scale-105"
        aria-label={t("title")}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[420px] w-[340px] flex-col overflow-hidden rounded-3xl border border-ella-border bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-ella-blush to-ella-lavender/40 px-4 py-3">
            <p className="font-medium">{t("title")}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-5 w-5 text-ella-muted" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  msg.isMine
                    ? "ml-auto bg-ella-rose/30"
                    : "bg-ella-blush text-foreground"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-ella-border p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              disabled={sending}
            />
            <Button type="submit" size="sm" disabled={sending}>
              {t("send")}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
