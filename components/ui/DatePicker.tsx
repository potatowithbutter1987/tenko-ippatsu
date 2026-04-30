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
  defaultMonth?: Date;
  align?: "left" | "right";
  disabledBefore?: Date;
  disabledAfter?: Date;
};

const buildDisabledMatcher = (
  before: Date | undefined,
  after: Date | undefined,
):
  | { before: Date }
  | { after: Date }
  | { before: Date; after: Date }
  | undefined => {
  if (before !== undefined && after !== undefined) return { before, after };
  if (before !== undefined) return { before };
  if (after !== undefined) return { after };
  return undefined;
};

const VALUE_FORMAT = "yyyy-MM-dd";
const DISPLAY_FORMAT = "yyyy/MM/dd";

const parseValue = (value: string): Date | undefined => {
  if (value === "") return undefined;
  const parsed = parse(value, VALUE_FORMAT, new Date());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const resolveDefaultMonth = (
  selected: Date | undefined,
  fallback: Date | undefined,
  endYear: number,
): Date => selected ?? fallback ?? new Date(endYear - 30, 0);

const ALIGN_CLASS: Record<"left" | "right", string> = {
  left: "left-0",
  right: "right-0",
};

export const DatePicker = ({
  value,
  onChange,
  placeholder = "YYYY/MM/DD",
  error,
  startYear = 1940,
  endYear = new Date().getFullYear(),
  defaultMonth,
  align = "left",
  disabledBefore,
  disabledAfter,
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
  const alignClass = ALIGN_CLASS[align];

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
        className={`w-full bg-white hover:bg-[#f7f7f5] border ${borderClass} rounded-[10px] px-4 py-[14px] flex items-center justify-between outline-none cursor-pointer transition-colors`}
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
          className={`absolute z-10 mt-2 ${alignClass} bg-white border border-[#e8ebe6] rounded-[16px] p-2`}
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
            defaultMonth={resolveDefaultMonth(
              selectedDate,
              defaultMonth,
              endYear,
            )}
            disabled={buildDisabledMatcher(disabledBefore, disabledAfter)}
            locale={ja}
            modifiers={{
              sunday: (date) => date.getDay() === 0,
              saturday: (date) => date.getDay() === 6,
            }}
            modifiersClassNames={{
              sunday: "rdp-weekend-sun",
              saturday: "rdp-weekend-sat",
            }}
          />
          <style>{`
            .rdp-weekend-sun:not(.rdp-selected) { color: #e23b4a; }
            .rdp-weekend-sat:not(.rdp-selected) { color: #3b82f6; }
            .rdp-weekday:first-child { color: #e23b4a; }
            .rdp-weekday:last-child { color: #3b82f6; }
            .rdp-nav button { color: #868685; }
            .rdp-chevron { fill: #868685; }
            .rdp-selected .rdp-day_button {
              background-color: #9fe870;
              color: #163300;
              border-color: #9fe870;
            }
          `}</style>
        </div>
      ) : null}
    </div>
  );
};
