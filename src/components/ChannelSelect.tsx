"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/types";
import { getChannels, subscribeChannels } from "@/lib/channels";
import { t } from "@/lib/i18n";

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> & {
  value: Post["channel"] | "";
  onChange: (next: Post["channel"] | "") => void;
  className?: string;
};

export default function ChannelSelect({ value, onChange, className, ...rest }: Props) {
  const [options, setOptions] = useState(getChannels());
  useEffect(() => subscribeChannels(() => setOptions(getChannels())), []);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Post["channel"] | "")}
      className={className}
      {...rest}
    >
      <option value="">{t("select.placeholder")}</option>
      {options.map((c) => (
        <option key={c.id} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
