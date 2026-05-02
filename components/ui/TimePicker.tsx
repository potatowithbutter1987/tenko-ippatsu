"use client";

import { useEffect, useRef, useState } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const MINUTES_5 = Array.from({ length: 12 }, (_, i) =>
  (i * 5).toString().padStart(2, "0"),
);

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: boolean;
};

const splitTime = (value: string): [string, string] => {
  if (value === "") return ["", ""];
  const [hh, mm] = value.split(":");
  return [hh ?? "", mm ?? ""];
};

export const TimePicker = ({
  value,
  onChange,
  onBlur,
  placeholder = "HH:mm",
  error,
}: Props) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourColRef = useRef<HTMLDivElement>(null);
  const minuteColRef = useRef<HTMLDivElement>(null);
  const [hh, mm] = splitTime(value);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
      onBlur?.();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onBlur]);

  useEffect(() => {
    if (!open) return;
    const scrollToSelected = (container: HTMLDivElement | null) => {
      if (container === null) return;
      const selected = container.querySelector<HTMLElement>(
        '[data-selected="true"]',
      );
      if (selected === null) return;
      container.scrollTop =
        selected.offsetTop -
        container.clientHeight / 2 +
        selected.clientHeight / 2;
    };
    scrollToSelected(hourColRef.current);
    scrollToSelected(minuteColRef.current);
  }, [open]);

  const handleHourClick = (h: string) => {
    onChange(`${h}:${mm === "" ? "00" : mm}`);
  };

  const handleMinuteClick = (m: string) => {
    onChange(`${hh === "" ? "00" : hh}:${m}`);
  };

  const isPlaceholder = value === "";
  const borderClass = error ? "border-[#e23b4a]" : "border-[#e8ebe5]";

  const renderColumn = (
    items: ReadonlyArray<string>,
    selected: string,
    onSelect: (v: string) => void,
    columnRef: React.RefObject<HTMLDivElement | null>,
  ) => (
    <div
      ref={columnRef}
      className="flex flex-col gap-1 max-h-[200px] overflow-y-auto px-1 py-1"
    >
      {items.map((item) => {
        const isSelected = item === selected;
        const stateClass = isSelected
          ? "bg-[#9fe870] text-[#163300] font-semibold"
          : "text-[#0e0f0c] hover:bg-[#f7f7f5]";
        return (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            data-selected={isSelected}
            className={`px-3 py-1.5 rounded-md text-[14px] cursor-pointer transition-colors ${stateClass}`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`w-full bg-white hover:bg-[#f7f7f5] border ${borderClass} rounded-[10px] px-4 py-[14px] flex items-center justify-between outline-none cursor-pointer transition-colors`}
      >
        <span
          className={`text-[14px] ${isPlaceholder ? "text-[#bfbfbf]" : "text-[#0e0f0c]"}`}
        >
          {isPlaceholder ? placeholder : value}
        </span>
        <span className="text-[12px] text-[#868685]">▼</span>
      </button>
      {open ? (
        <div
          role="dialog"
          className="absolute z-10 mt-2 bg-white border border-[#e8ebe6] rounded-[16px] p-2 flex gap-1"
        >
          {renderColumn(HOURS, hh, handleHourClick, hourColRef)}
          <div className="w-px bg-[#e8ebe6]" />
          {renderColumn(MINUTES_5, mm, handleMinuteClick, minuteColRef)}
        </div>
      ) : null}
    </div>
  );
};
