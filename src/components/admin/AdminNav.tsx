"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  Smartphone,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";

const links = [
  { href: "/admin", icon: LayoutDashboard, key: "title" as const },
  { href: "/admin/products", icon: Smartphone, key: "products" as const },
  { href: "/admin/repairs", icon: Wrench, key: "repairs" as const },
  { href: "/admin/orders", icon: Package, key: "orders" as const },
  { href: "/admin/messages", icon: MessageSquare, key: "messages" as const },
  { href: "/admin/settings", icon: Settings, key: "settings" as const },
];

export function AdminNav() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 lg:flex-col">
      {links.map(({ href, icon: Icon, key }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition",
            pathname === href || (href !== "/admin" && pathname.startsWith(href))
              ? "bg-ella-rose/20 text-ella-rose-deep"
              : "hover:bg-ella-blush",
          )}
        >
          <Icon className="h-4 w-4" />
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
