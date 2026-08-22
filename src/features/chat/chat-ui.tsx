import { cn } from "@/lib/utils";

export const chatFieldClass =
  "w-full rounded-xl border border-landing-border bg-landing-sand-light/70 px-3.5 py-2 text-xs font-medium text-landing-ink placeholder:text-landing-muted-light transition-all focus:border-landing-primary focus:bg-landing-surface focus:ring-2 focus:ring-landing-primary/10 focus:outline-none disabled:opacity-60";

/**
 * Two-letter initials from a display name.
 * @param name - Person or group name
 * @returns string
 */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

type ChatAvatarProps = {
  name: string;
  size?: "sm" | "md";
  connected?: boolean;
};

/**
 * Initials tile. Optional green dot is only for the signed-in user’s socket.
 * @param props.name - Label used for initials
 * @param props.size - Tile size
 * @param props.connected - Show a live-session dot
 * @returns JSX.Element
 */
export function ChatAvatar({
  name,
  size = "md",
  connected = false,
}: ChatAvatarProps) {
  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white shadow-xs",
          size === "md" ? "h-10 w-10 text-xs" : "h-8 w-8 text-[11px]",
        )}
      >
        {initials(name)}
      </div>
      {connected ? (
        <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
      ) : null}
    </div>
  );
}

/**
 * Square T mark used in the workspace header.
 * @returns JSX.Element
 */
export function ChatMark() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-landing-primary text-xs font-bold text-landing-surface shadow-sm shadow-blue-500/20">
      T
    </span>
  );
}
