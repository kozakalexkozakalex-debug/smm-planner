export type Post = {
  id: string;
  date: string; // ISO date string
  channel: "Instagram" | "Facebook" | "TikTok" | "YouTube" | "X";
  title: string;
  status: "Draft" | "Scheduled" | "Published";
};

export type Channel = {
  id: string;
  name: Post["channel"];
};
