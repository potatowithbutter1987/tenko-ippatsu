"use client";

import { useState } from "react";

import { SelectInput } from "@/components/ui/SelectInput";

export type DailyTenkoStatusFilter = "completed" | "warning" | "missing";
export type DailyCheckResultFilter = "all" | "ok" | "ng";

export type DailyFilterValue = {
  status: ReadonlyArray<DailyTenkoStatusFilter>;
  driverName: string;
  affiliationId: string;
  alcohol: DailyCheckResultFilter;
  health: DailyCheckResultFilter;
};

export const DEFAULT_DAILY_FILTER: DailyFilterValue = {
  status: [],
  driverName: "",
  affiliationId: "",
  alcohol: "all",
  health: "all",
};

export const countActiveDailyFilters = (filter: DailyFilterValue): number => {
  let count = filter.status.length;
  if (filter.driverName.trim() !== "") count += 1;
  if (filter.affiliationId !== "") count += 1;
  if (filter.alcohol !== "all") count += 1;
  if (filter.health !== "all") count += 1;
  return count;
};

const STATUS_OPTIONS: ReadonlyArray<{
  value: DailyTenkoStatusFilter;
  label: string;
}> = [
  { value: "completed", label: "完了" },
  { value: "warning", label: "要確認" },
  { value: "missing", label: "未点呼" },
];

const CHECK_OPTIONS: ReadonlyArray<{
  value: DailyCheckResultFilter;
  label: string;
}> = [
  { value: "all", label: "すべて" },
  { value: "ok", label: "OK" },
  { value: "ng", label: "NG" },
];

const AFFILIATION_OPTIONS = [
  { value: "abc", label: "ABC運送" },
  { value: "tohoku", label: "東北運送" },
  { value: "personal", label: "個人" },
];

type Props = {
  initialValue?: DailyFilterValue;
  onApply: (value: DailyFilterValue) => void;
};

type ChipProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const Chip = ({ selected, onClick, children }: ChipProps) => {
  const stateClass = selected
    ? "bg-[#9fe870] text-[#163300] border border-transparent"
    : "bg-white border border-[#e8ebe6] text-[#0e0f0c] hover:bg-[#f7f7f5]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors ${stateClass}`}
    >
      {children}
    </button>
  );
};

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[13px] font-semibold text-[#0e0f0c]">{children}</span>
);

export const DailyFilterSheet = ({
  initialValue = DEFAULT_DAILY_FILTER,
  onApply,
}: Props) => {
  const [value, setValue] = useState<DailyFilterValue>(initialValue);

  const toggleStatus = (status: DailyTenkoStatusFilter) => {
    setValue((prev) => {
      const has = prev.status.includes(status);
      return {
        ...prev,
        status: has
          ? prev.status.filter((s) => s !== status)
          : [...prev.status, status],
      };
    });
  };

  const handleReset = () => {
    setValue(DEFAULT_DAILY_FILTER);
  };

  const handleApply = () => {
    onApply(value);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2.5 w-full">
        <FieldLabel>点呼ステータス</FieldLabel>
        <div className="flex flex-wrap gap-2 w-full">
          <Chip
            selected={value.status.length === 0}
            onClick={() => setValue((prev) => ({ ...prev, status: [] }))}
          >
            すべて
          </Chip>
          {STATUS_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              selected={value.status.includes(opt.value)}
              onClick={() => toggleStatus(opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        <FieldLabel>ドライバー名</FieldLabel>
        <div className="bg-white border border-[#e8ebe6] rounded-xl flex gap-2 items-center px-4 py-3.5 w-full">
          <span className="text-[14px] leading-none">🔍</span>
          <input
            type="text"
            placeholder="ドライバー名で検索"
            value={value.driverName}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, driverName: e.target.value }))
            }
            maxLength={50}
            className="flex-1 min-w-0 outline-none bg-transparent text-[14px] text-[#0e0f0c] placeholder:text-[#868685]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        <FieldLabel>所属</FieldLabel>
        <SelectInput
          placeholder="すべて"
          value={value.affiliationId}
          onChange={(v) => setValue((prev) => ({ ...prev, affiliationId: v }))}
          options={AFFILIATION_OPTIONS}
        />
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        <FieldLabel>アルコール</FieldLabel>
        <div className="flex flex-wrap gap-2 w-full">
          {CHECK_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              selected={value.alcohol === opt.value}
              onClick={() =>
                setValue((prev) => ({ ...prev, alcohol: opt.value }))
              }
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        <FieldLabel>体調</FieldLabel>
        <div className="flex flex-wrap gap-2 w-full">
          {CHECK_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              selected={value.health === opt.value}
              onClick={() =>
                setValue((prev) => ({ ...prev, health: opt.value }))
              }
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-6 w-full">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 bg-white border border-[#e8ebe6] rounded-full px-5 py-3.5 text-[14px] font-semibold text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
        >
          リセット
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 bg-[#9fe870] rounded-full px-5 py-3.5 text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
        >
          検索
        </button>
      </div>
    </div>
  );
};
