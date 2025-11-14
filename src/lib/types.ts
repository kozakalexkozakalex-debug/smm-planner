export type Post = {
  id: string;
  date: string; // ISO date string
  channel: "Instagram" | "Facebook" | "TikTok" | "YouTube" | "X";
  title: string;
  body?: string;
  media?: string[]; // list of image URLs (placeholder)
  status: "Draft" | "Scheduled" | "Published";
};

export type Channel = {
  id: string;
  name: Post["channel"];
};
