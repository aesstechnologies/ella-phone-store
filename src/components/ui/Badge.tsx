import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  received: "bg-ella-lavender/50 text-foreground",
  diagnosing: "bg-ella-peach/60 text-foreground",
  in_repair: "bg-ella-rose/30 text-foreground",
  ready: "bg-green-100 text-green-800",
  picked_up: "bg-ella-muted/20 text-ella-muted",
  cancelled: "bg-red-100 text-red-700",
  pending: "bg-ella-peach/60 text-foreground",
  confirmed: "bg-ella-lavender/50 text-foreground",
  completed: "bg-green-100 text-green-800",
};

export function Badge({
  status,
  label,
  className,
}: {
  status: string;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
        colors[status] ?? "bg-ella-blush text-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}
