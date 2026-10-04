"use client";

import { Button } from "@/components/ui/Button";
import { Link, useRouter } from "@/i18n/navigation";
import type { DevRole } from "@/lib/dev-auth";
import { Shield, User, UserX } from "lucide-react";
import { useState } from "react";

export function DevRoleSwitcher({ currentRole }: { currentRole: DevRole }) {
  const router = useRouter();
  const [loading, setLoading] = useState<DevRole | null>(null);

  async function setRole(role: DevRole) {
    setLoading(role);
    await fetch("/api/dev/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.refresh();
    setLoading(null);
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-xs rounded-2xl border border-amber-300/80 bg-amber-50/95 p-3 text-xs shadow-lg backdrop-blur">
      <p className="mb-2 font-semibold text-amber-900">Dev mode — view as:</p>
      <div className="flex flex-wrap gap-1.5">
        <Button
          size="sm"
          variant={currentRole === "guest" ? "primary" : "secondary"}
          onClick={() => setRole("guest")}
          disabled={loading !== null}
        >
          <UserX className="h-3 w-3" />
          Guest
        </Button>
        <Button
          size="sm"
          variant={currentRole === "customer" ? "primary" : "secondary"}
          onClick={() => setRole("customer")}
          disabled={loading !== null}
        >
          <User className="h-3 w-3" />
          Customer
        </Button>
        <Button
          size="sm"
          variant={currentRole === "admin" ? "primary" : "secondary"}
          onClick={() => setRole("admin")}
          disabled={loading !== null}
        >
          <Shield className="h-3 w-3" />
          Admin
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-amber-800/80">
        {currentRole === "customer" && (
          <Link href="/account" className="underline">
            My account →
          </Link>
        )}
        {currentRole === "admin" && (
          <Link href="/admin" className="underline">
            Admin panel →
          </Link>
        )}
      </div>
    </div>
  );
}
