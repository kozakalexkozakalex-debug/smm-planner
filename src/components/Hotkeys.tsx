"use client";

import { useEffect } from "react";

type HotkeyMap = {
  onNew?: () => void; // n
  onFocusSearch?: () => void; // f
};

export default function Hotkeys({ onNew, onFocusSearch }: HotkeyMap) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "n" && onNew) {
        e.preventDefault();
        onNew();
      } else if (e.key === "f" && onFocusSearch) {
        e.preventDefault();
        onFocusSearch();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNew, onFocusSearch]);
  return null;
}

