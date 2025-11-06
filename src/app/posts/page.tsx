"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Post } from "@/lib/types";
import Filters from "@/components/posts/Filters";
import Hotkeys from "@/components/Hotkeys";
import PostsTable, { type SortDir, type SortKey } from "@/components/posts/Table";
import Pagination from "@/components/Pagination";
import { addPost, deletePost, duplicatePost, getPosts, subscribe, updatePost, refresh, isRemote, publishPost } from "@/lib/posts";
import { CHANNELS as channelOptions, STATUSES as statusOptions } from "@/lib/data";
import NewPostModal from "@/components/NewPostModal";
import { formatDateYMD } from "@/lib/dates";
import Toast from "@/components/Toast";
import ImportExport from "@/components/posts/ImportExport";
import { t } from "@/lib/i18n";

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
  const [debouncedSearch, setDebouncedSearch] = useState<string>(spSearch);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [posts, setPosts] = useState<Post[]>(() => getPosts());
  const spPageParam = Number(searchParams.get("page") ?? "1");
  const pageFromUrl = Number.isFinite(spPageParam) && spPageParam > 0 ? spPageParam : 1;
  const pageSize = 10;
  const [sortKey, setSortKey] = useState<SortKey>(validSort);
  const [sortDir, setSortDir] = useState<SortDir>(validDir);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<{ local?: string; channel?: Post["channel"]; title?: string; status?: Post["status"] }>({});
  const [open, setOpen] = useState(false);
  const [undo, setUndo] = useState<{ show: boolean; post?: Post }>({ show: false });
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [importToast, setImportToast] = useState<string | null>(null);
  const [dupToast, setDupToast] = useState(false);
  useEffect(() => {
    if (!importToast) return;
    const t = setTimeout(() => setImportToast(null), 2000);
    return () => clearTimeout(t);
  }, [importToast]);
  useEffect(() => {
    if (!dupToast) return;
    const t = setTimeout(() => setDupToast(false), 1500);
    return () => clearTimeout(t);
  }, [dupToast]);

  useEffect(() => {
    // Subscribe to local changes
    const unsub = subscribe(() => setPosts(getPosts()));
    // If remote is enabled, refresh from server once on mount
    if (isRemote()) {
      void refresh();
    }
    return unsub;
  }, []);

  // Debounce title search for smoother filtering
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    const term = debouncedSearch;
    return posts.filter((p) => {
      if (channel && p.channel !== channel) return false;
      if (status && p.status !== status) return false;
      if (term && !p.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [channel, status, debouncedSearch, posts]);

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

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(Math.max(1, pageFromUrl), totalPages);
  const pagePosts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, safePage, pageSize]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
  }

  const hasActiveFilters = Boolean(channel || status || debouncedSearch);
  function handleClearFilters() {
    setChannel("");
    setStatus("");
    setSearch("");
  }

  // No setState here; viewPage resets to 1 when filtersKey changes

  // Sync state to URL without navigation
  const filtersKey = `${channel}|${status}|${debouncedSearch}|${sortKey}|${sortDir}`;
  const prevFiltersKeyRef = useRef(filtersKey);
  useEffect(() => {
    const params = new URLSearchParams();
    if (channel) params.set("channel", channel);
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    params.set("sort", sortKey);
    params.set("dir", sortDir);
    const desiredPage = prevFiltersKeyRef.current !== filtersKey ? 1 : safePage;
    params.set("page", String(desiredPage));
    const nextQ = params.toString();
    const currQ = typeof window !== "undefined" ? window.location.search.slice(1) : "";
    if (nextQ !== currQ) {
      const path = typeof window !== "undefined" ? window.location.pathname : "/posts";
      router.replace(nextQ ? `${path}?${nextQ}` : path, { scroll: false });
    }
    prevFiltersKeyRef.current = filtersKey;
  }, [channel, status, search, sortKey, sortDir, safePage, filtersKey, router]);

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
    if (!confirm(t("confirm.deletePost"))) return;
    const removed = deletePost(id);
    if (removed) {
      setUndo({ show: true, post: removed });
      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => setUndo({ show: false, post: undefined }), 5000);
    }
  }

  function handleDuplicate(id: string) {
    const clone = duplicatePost(id);
    if (clone) setDupToast(true);
  }

  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{t("posts.title")}</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">{t("posts.subtitle")}</p>
        </div>
        <ImportExport
          onImported={(n) => setImportToast(`Imported ${n} posts`)}
          onError={(m) => setImportToast(m)}
        />
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
        searchRef={searchInputRef}
      />
      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={(p) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", String(p));
          const path = typeof window !== "undefined" ? window.location.pathname : "/posts";
          router.replace(`${path}?${params.toString()}`, { scroll: false });
        }}
      />
      <Hotkeys onNew={() => setOpen(true)} onFocusSearch={() => searchInputRef.current?.focus()} />

      <PostsTable
        posts={pagePosts}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateStatus={(id, status) => updatePost(id, { status })}
        onUpdateTitle={(id, title) => updatePost(id, { title })}
        onDuplicate={handleDuplicate}
        onPublish={(id) => publishPost(id)}
        hasActiveFilters={hasActiveFilters}
        onCreate={() => setOpen(true)}
        onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
      />
      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={(p) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", String(p));
          const path = typeof window !== "undefined" ? window.location.pathname : "/posts";
          router.replace(`${path}?${params.toString()}`, { scroll: false });
        }}
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
        message={t("toast.deleted")}
        actionLabel={t("action.undo")}
        onAction={() => {
          if (undoTimer.current) {
            clearTimeout(undoTimer.current);
            undoTimer.current = null;
          }
          if (undo.post) addPost(undo.post);
          setUndo({ show: false, post: undefined });
        }}
      />
      <Toast show={!!importToast} message={importToast ?? ""} />
      <Toast show={dupToast} message={t("toast.duplicated")} />
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
