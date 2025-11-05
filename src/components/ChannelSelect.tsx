"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/types";
import { getChannels, subscribeChannels } from "@/lib/channels";

type Props = {
  value: Post["channel"] | "";
  onChange: (next: Post["channel"] | "") => void;
  className?: string;
};

export default function ChannelSelect({ value, onChange, className }: Props) {
  const [options, setOptions] = useState(getChannels());
  useEffect(() => subscribeChannels(() => setOptions(getChannels())), []);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Post["channel"] | "")}
      className={className}
    >
      <option value="">Select…</option>
      {options.map((c) => (
        <option key={c.id} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

