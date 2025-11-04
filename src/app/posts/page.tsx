"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/lib/types";
import Filters from "@/components/posts/Filters";
import PostsTable, { type SortDir, type SortKey } from "@/components/posts/Table";
import { getPosts, subscribe } from "@/lib/store";
import { CHANNELS as channelOptions, STATUSES as statusOptions } from "@/lib/data";

export default function PostsPage() {
  const [channel, setChannel] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>(() => getPosts());
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    return subscribe(() => setPosts(getPosts()));
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((p) => {
      if (channel && p.channel !== channel) return false;
      if (status && p.status !== status) return false;
      if (term && !p.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [channel, status, search, posts]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "date":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "channel":
          cmp = a.channel.localeCompare(b.channel);
          break;
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
  }

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

      <PostsTable posts={sorted} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
    </section>
  );
}
