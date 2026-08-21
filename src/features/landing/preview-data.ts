export type PreviewRow = {
  id: string;
  title: string;
  preview: string;
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
    id: "ada",
    title: "Ada",
    preview: "On my way — kettle’s on.",
    selected: true,
  },
  {
    id: "kitchen",
    title: "Kitchen table",
    preview: "Jules: Bring the good mugs.",
    selected: false,
  },
  {
    id: "jules",
    title: "Jules",
    preview: "Did you see Ada’s note?",
    selected: false,
  },
];

export const previewThread: PreviewBubble[] = [
  {
    id: "1",
    text: "You home yet?",
    time: "7:12 PM",
    mine: false,
  },
  {
    id: "2",
    text: "Just walked in. Come over if you want tea.",
    time: "7:13 PM",
    mine: true,
  },
  {
    id: "3",
    text: "On my way — kettle’s on.",
    time: "7:14 PM",
    mine: false,
  },
];
