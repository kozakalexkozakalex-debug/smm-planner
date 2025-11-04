"use client";

import { useMemo, useState } from "react";
import Filters from "@/components/posts/Filters";
import PostsTable from "@/components/posts/Table";
import { mockPosts } from "@/lib/data";

const channelOptions = ["Instagram", "Facebook", "TikTok", "YouTube", "X"] as const;
const statusOptions = ["Draft", "Scheduled", "Published"] as const;

export default function PostsPage() {
  const [channel, setChannel] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return mockPosts.filter((p) => {
      if (channel && p.channel !== channel) return false;
      if (status && p.status !== status) return false;
      if (term && !p.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [channel, status, search]);

  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Posts</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Список запланованих і опублікованих постів.
          </p>
        </div>
      </header>

      <Filters
        channelOptions={[...channelOptions]}
        statusOptions={[...statusOptions]}
        selectedChannel={channel}
        selectedStatus={status}
        search={search}
        onChannelChange={setChannel}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
      />

      <PostsTable posts={filtered} />
    </section>
  );
}
