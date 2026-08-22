export type PreviewRow = {
  id: string;
  title: string;
  preview: string;
  time: string;
  selected: boolean;
  online?: boolean;
};

export type PreviewBubble = {
  id: string;
  text: string;
  time: string;
  mine: boolean;
};

export const previewInbox: PreviewRow[] = [
  {
    id: "ada",
    title: "Ada Lovelace",
    preview: "See you in five.",
    time: "Just now",
    selected: true,
    online: true,
  },
  {
    id: "design",
    title: "Design Team Sync (3)",
    preview: "Jules: Are we still on for 3?",
    time: "11:20 AM",
    selected: false,
  },
];

export const previewThread: PreviewBubble[] = [
  {
    id: "1",
    text: "Did you get a chance to look at my last note?",
    time: "10:45 AM",
    mine: false,
  },
  {
    id: "2",
    text: "Yes — just walked in. I’ll send the notes in a minute.",
    time: "10:46 AM",
    mine: true,
  },
  {
    id: "3",
    text: "Perfect. Send a line when you’re ready.",
    time: "10:47 AM",
    mine: false,
  },
];
