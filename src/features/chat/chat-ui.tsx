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

const avatarTones = [
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-800",
  "bg-indigo-100 text-indigo-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-cyan-100 text-cyan-700",
] as const;

/**
 * Pick a light avatar tone from the display name. Same name → same color.
 * @param name - Person or group name
 * @returns string — background + text classes
 */
export function avatarTone(name: string): string {
  const key = name.trim().toLowerCase();
  let hash = 0;
  for (const character of key) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return avatarTones[hash % avatarTones.length] ?? avatarTones[0];
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
          "flex items-center justify-center rounded-xl font-bold shadow-xs",
          avatarTone(name),
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
