export type PreviewRow = {
  id: string;
  title: string;
  preview: string;
  time: string;
  initials: string;
  tint: "indigo" | "amber" | "emerald";
  selected: boolean;
};

export type PreviewBubble = {
  id: string;
  text: string;
  time: string;
  mine: boolean;
};

export const previewInbox: PreviewRow[] = [
  {
    id: "grace",
    title: "Grace Hopper",
    preview: "See you in five.",
    time: "11:56 AM",
    initials: "GH",
    tint: "indigo",
    selected: true,
  },
  {
    id: "alan",
    title: "Alan Turing",
    preview: "Did you see Grace’s note?",
    time: "10:45 AM",
    initials: "AT",
    tint: "amber",
    selected: false,
  },
  {
    id: "margaret",
    title: "Margaret Hamilton",
    preview: "Bring the good mugs.",
    time: "Yesterday",
    initials: "MH",
    tint: "emerald",
    selected: false,
  },
];

export const previewThread: PreviewBubble[] = [
  {
    id: "1",
    text: "You home yet?",
    time: "11:55 AM",
    mine: false,
  },
  {
    id: "2",
    text: "Just walked in. Come over if you want tea.",
    time: "11:56 AM",
    mine: true,
  },
];
