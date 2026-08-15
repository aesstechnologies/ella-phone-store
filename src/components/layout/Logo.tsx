import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { StoreSettings } from "@/types/database";

export function Logo({
  settings,
  className = "",
}: {
  settings: Pick<StoreSettings, "logo_url" | "store_name">;
  className?: string;
}) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <Image
        src={settings.logo_url || "/logo.svg"}
        alt={settings.store_name}
        width={140}
        height={36}
        className="h-9 w-auto"
        priority
      />
    </Link>
  );
}
