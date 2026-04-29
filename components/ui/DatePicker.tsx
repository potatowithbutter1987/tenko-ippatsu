"use client";

import { format, parse } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  startYear?: number;
  endYear?: number;
};

const VALUE_FORMAT = "yyyy-MM-dd";
const DISPLAY_FORMAT = "yyyy/MM/dd";

const parseValue = (value: string): Date | undefined => {
  if (value === "") return undefined;
  const parsed = parse(value, VALUE_FORMAT, new Date());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export const DatePicker = ({
  value,
  onChange,
  placeholder = "YYYY/MM/DD",
  error,
  startYear = 1940,
  endYear = new Date().getFullYear(),
}: Props) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selectedDate = parseValue(value);
  const displayValue =
    selectedDate !== undefined ? format(selectedDate, DISPLAY_FORMAT) : "";
  const isPlaceholder = displayValue === "";
  const borderClass = error ? "border-[#e23b4a]" : "border-[#e8ebe5]";

  const handleSelect = (day: Date | undefined) => {
    if (day === undefined) {
      onChange("");
      return;
    }
    onChange(format(day, VALUE_FORMAT));
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`w-full bg-white border ${borderClass} rounded-[10px] px-4 py-[14px] flex items-center justify-between outline-none cursor-pointer`}
      >
        <span
          className={`text-[14px] ${isPlaceholder ? "text-[#bfbfbf]" : "text-[#0e0f0c]"}`}
        >
          {isPlaceholder ? placeholder : displayValue}
        </span>
        <span className="text-[12px] text-[#868685]">▼</span>
      </button>
      {open ? (
        <div
          role="dialog"
          className="absolute z-10 mt-2 bg-white border border-[#e8ebe6] rounded-[16px] p-2"
          style={
            {
              "--rdp-accent-color": "#163300",
              "--rdp-accent-background-color": "#9fe870",
              "--rdp-day-selected-color": "#163300",
            } as React.CSSProperties
          }
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            captionLayout="dropdown"
            startMonth={new Date(startYear, 0)}
            endMonth={new Date(endYear, 11)}
            defaultMonth={selectedDate ?? new Date(endYear - 30, 0)}
            locale={ja}
          />
        </div>
      ) : null}
    </div>
  );
};
