import type { Post } from "./types";

export const mockPosts: Post[] = [
  {
    id: "1",
    date: "2025-11-05T09:00:00.000Z",
    channel: "Instagram",
    title: "Behind the scenes: team intro",
    status: "Draft",
  },
  {
    id: "2",
    date: "2025-11-07T14:30:00.000Z",
    channel: "Facebook",
    title: "Customer testimonial highlight",
    status: "Scheduled",
  },
  {
    id: "3",
    date: "2025-11-09T12:00:00.000Z",
    channel: "TikTok",
    title: "Quick tip: editing hack",
    status: "Published",
  },
  {
    id: "4",
    date: "2025-11-12T10:00:00.000Z",
    channel: "YouTube",
    title: "Full tutorial: product walkthrough",
    status: "Scheduled",
  },
  {
    id: "5",
    date: "2025-11-14T18:00:00.000Z",
    channel: "X",
    title: "Release notes v1.2",
    status: "Draft",
  },
  {
    id: "6",
    date: "2025-11-17T08:00:00.000Z",
    channel: "Instagram",
    title: "Morning motivation quote",
    status: "Published",
  },
  {
    id: "7",
    date: "2025-11-20T16:00:00.000Z",
    channel: "Facebook",
    title: "Event announcement: AMA next week",
    status: "Scheduled",
  },
  {
    id: "8",
    date: "2025-11-23T11:30:00.000Z",
    channel: "TikTok",
    title: "BTS: bloopers reel",
    status: "Draft",
  },
  {
    id: "9",
    date: "2025-11-27T15:45:00.000Z",
    channel: "YouTube",
    title: "Case study: success story",
    status: "Published",
  },
  {
    id: "10",
    date: "2025-12-02T09:15:00.000Z",
    channel: "X",
    title: "Poll: next feature priority?",
    status: "Scheduled",
  },
];

export const CHANNELS = [
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
  "X",
] as const;

export const STATUSES = ["Draft", "Scheduled", "Published"] as const;

export function addPost(post: Post) {
  // Prepend so newest appears first
  mockPosts.unshift(post);
}
