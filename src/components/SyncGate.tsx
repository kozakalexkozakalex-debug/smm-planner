"use client";

import { useEffect } from "react";
import { isApiEnabled, pullChannels, pullPosts, watchAndPush } from "@/lib/sync";

export default function SyncGate() {
  useEffect(() => {
    if (!isApiEnabled()) return;
    pullPosts();
    pullChannels();
    const off = watchAndPush();
    return () => off();
  }, []);
  return null;
}

