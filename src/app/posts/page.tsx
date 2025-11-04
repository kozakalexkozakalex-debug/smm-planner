"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Post } from "@/lib/types";
import Filters from "@/components/posts/Filters";
import PostsTable, { type SortDir, type SortKey } from "@/components/posts/Table";
import { addPost, deletePost, getPosts, subscribe } from "@/lib/store";
import { CHANNELS as channelOptions, STATUSES as statusOptions } from "@/lib/data";
import NewPostModal from "@/components/NewPostModal";
import { formatDateYMD } from "@/lib/dates";
import Toast from "@/components/Toast";

function PostsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const spChannel = searchParams.get("channel") ?? "";
  const spStatus = searchParams.get("status") ?? "";
  const spSearch = searchParams.get("search") ?? "";
  const spSortParam = (searchParams.get("sort") ?? "") as string;
  const spDirParam = (searchParams.get("dir") ?? "") as string;

  const validChannel = (channelOptions as readonly string[]).includes(spChannel)
    ? spChannel
    : "";
  const validStatus = (statusOptions as readonly string[]).includes(spStatus)
    ? spStatus
    : "";
  const allowedSortKeys: ReadonlyArray<SortKey> = ["date", "channel", "title", "status"];
  const allowedDirs: ReadonlyArray<SortDir> = ["asc", "desc"];
  const validSort: SortKey = (allowedSortKeys as readonly string[]).includes(spSortParam)
    ? (spSortParam as SortKey)
    : "date";
  const validDir: SortDir = (allowedDirs as readonly string[]).includes(spDirParam)
    ? (spDirParam as SortDir)
    : validSort === "date"
    ? "desc"
    : "asc";

  const [channel, setChannel] = useState<string>(validChannel);
  const [status, setStatus] = useState<string>(validStatus);
  const [search, setSearch] = useState<string>(spSearch);
  const [posts, setPosts] = useState<Post[]>(() => getPosts());
  const [sortKey, setSortKey] = useState<SortKey>(validSort);
  const [sortDir, setSortDir] = useState<SortDir>(validDir);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<{ local?: string; channel?: Post["channel"]; title?: string; status?: Post["status"] }>({});
  const [open, setOpen] = useState(false);
  const [undo, setUndo] = useState<{ show: boolean; post?: Post }>({ show: false });
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Sync state to URL without navigation
  useEffect(() => {
    const params = new URLSearchParams();
    if (channel) params.set("channel", channel);
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    params.set("sort", sortKey);
    params.set("dir", sortDir);
    const nextQ = params.toString();
    const currQ = typeof window !== "undefined" ? window.location.search.slice(1) : "";
    if (nextQ !== currQ) {
      const path = typeof window !== "undefined" ? window.location.pathname : "/posts";
      router.replace(nextQ ? `${path}?${nextQ}` : path, { scroll: false });
    }
  }, [channel, status, search, sortKey, sortDir, router]);

  function handleEdit(p: Post) {
    setEditingId(p.id);
    setPrefill({
      local: `${formatDateYMD(p.date)}T${new Date(p.date).toTimeString().slice(0, 5)}`,
      channel: p.channel,
      title: p.title,
      status: p.status,
    });
    setOpen(true);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    const removed = deletePost(id);
    if (removed) {
      setUndo({ show: true, post: removed });
      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => setUndo({ show: false, post: undefined }), 5000);
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

      <PostsTable
        posts={sorted}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <NewPostModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingId(null);
          setPrefill({});
        }}
        onSaved={() => {
          setOpen(false);
          setEditingId(null);
          setPrefill({});
        }}
        editingPostId={editingId ?? undefined}
        initialLocalDateTime={prefill.local}
        initialChannel={prefill.channel}
        initialTitle={prefill.title}
        initialStatus={prefill.status}
      />

      <Toast
        show={undo.show}
        message="Deleted"
        actionLabel="Undo"
        onAction={() => {
          if (undoTimer.current) {
            clearTimeout(undoTimer.current);
            undoTimer.current = null;
          }
          if (undo.post) addPost(undo.post);
          setUndo({ show: false, post: undefined });
        }}
      />
    </section>
  );
}

export default function PostsPage() {
  return (
    <Suspense fallback={null}>
      <PostsPageInner />
    </Suspense>
  );
}
