"use client";

import { useEffect } from "react";
import { getPosts, updatePost } from "@/lib/store";

function runSweep() {
  const now = Date.now();
  const posts = getPosts();
  for (const p of posts) {
    if (p.status === "Scheduled") {
      const when = new Date(p.date).getTime();
      if (!Number.isNaN(when) && when <= now) {
        updatePost(p.id, { status: "Published" });
      }
    }
  }
}

export default function Scheduler() {
  useEffect(() => {
    // Initial sweep on mount
    runSweep();

    // Repeat every 60 seconds
    const t = setInterval(runSweep, 60_000);

    // Also sweep when tab becomes visible again
    const onVis = () => {
      if (document.visibilityState === "visible") runSweep();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return null;
}

