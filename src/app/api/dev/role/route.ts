import { isDevAuthEnabled, type DevRole } from "@/lib/dev-auth";
import { NextResponse } from "next/server";

const validRoles: DevRole[] = ["guest", "customer", "admin"];

export async function POST(request: Request) {
  if (!isDevAuthEnabled()) {
    return NextResponse.json({ error: "Dev auth is disabled" }, { status: 403 });
  }

  const { role } = (await request.json()) as { role?: DevRole };

  if (!role || !validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, role });

  if (role === "guest") {
    response.cookies.delete("ella_dev_role");
  } else {
    response.cookies.set("ella_dev_role", role, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}
