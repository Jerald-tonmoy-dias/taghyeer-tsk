const EMOJIS = [
  "😀",
  "😂",
  "😊",
  "😍",
  "🤔",
  "🙌",
  "👍",
  "👎",
  "🎉",
  "🔥",
  "❤️",
  "👋",
] as const;

type EmojiPickerProps = {
  onPick: (emoji: string) => void;
};

/**
 * Small Unicode set inserted into the composer text.
 * @param props.onPick - Chosen character
 * @returns JSX.Element
 */
export function EmojiPicker({ onPick }: EmojiPickerProps) {
  return (
    <div className="absolute bottom-full left-0 z-20 mb-2 grid w-56 grid-cols-6 gap-1 rounded-xl border border-landing-border bg-landing-surface p-2 shadow-lg">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onPick(emoji)}
          className="rounded-lg p-1.5 text-base hover:bg-slate-100"
          aria-label={`Insert ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
