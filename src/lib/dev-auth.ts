import type { Profile, UserRole } from "@/types/database";
import { cookies } from "next/headers";

export type DevRole = "guest" | "customer" | "admin";

const COOKIE_NAME = "ella_dev_role";

export function isDevAuthEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DEV_AUTH_ENABLED === "true"
  );
}

export async function getDevRole(): Promise<DevRole> {
  if (!isDevAuthEnabled()) return "guest";

  const cookieStore = await cookies();
  const role = cookieStore.get(COOKIE_NAME)?.value as DevRole | undefined;

  if (role === "customer" || role === "admin") return role;
  return "guest";
}

export async function getDevSession() {
  const role = await getDevRole();
  if (role === "guest") return null;

  const userId = role === "admin" ? "dev-admin" : "dev-customer";
  const profile: Profile = {
    id: userId,
    full_name: role === "admin" ? "ELLA Owner (dev)" : "Demo Customer (dev)",
    phone: null,
    role: role as UserRole,
    locale: "en",
    created_at: new Date().toISOString(),
  };

  return {
    user: {
      id: userId,
      email:
        role === "admin"
          ? "ellaphonerepair@gmail.com"
          : "customer@example.com",
    },
    profile,
  };
}

export function isDevUserId(userId: string) {
  return userId.startsWith("dev-");
}
