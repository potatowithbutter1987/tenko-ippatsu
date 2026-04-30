"use client";

import { useState } from "react";

import { SelectInput } from "@/components/ui/SelectInput";
import { TextInput } from "@/components/ui/TextInput";
import {
  DEFAULT_OPERATING_HOURS_FILTER,
  type OperatingHoursFilterValue,
  type OperatingHoursStatusFilter,
} from "@/features/operating-hours/types";

const STATUS_OPTIONS: ReadonlyArray<{
  value: OperatingHoursStatusFilter;
  label: string;
}> = [
  { value: "exceeded", label: "法定超過" },
  { value: "warning", label: "警告ライン" },
  { value: "normal", label: "正常" },
];

const AFFILIATION_OPTIONS = [
  { value: "abc", label: "ABC運送" },
  { value: "tohoku", label: "東北運送" },
  { value: "personal", label: "個人" },
];

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

type Props = {
  initialValue?: OperatingHoursFilterValue;
  onApply: (value: OperatingHoursFilterValue) => void;
};

export const OperatingHoursFilterSheet = ({
  initialValue = DEFAULT_OPERATING_HOURS_FILTER,
  onApply,
}: Props) => {
  const [value, setValue] = useState<OperatingHoursFilterValue>(initialValue);

  const toggleStatus = (status: OperatingHoursStatusFilter) => {
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

  const handleReset = () => setValue(DEFAULT_OPERATING_HOURS_FILTER);
  const handleApply = () => onApply(value);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2.5 w-full">
        <FieldLabel>ステータス</FieldLabel>
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
        <FieldLabel>拘束時間（h）</FieldLabel>
        <div className="flex gap-2 items-center w-full">
          <div className="flex-1 min-w-0">
            <TextInput
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={value.totalHoursMin}
              onChange={(e) =>
                setValue((prev) => ({
                  ...prev,
                  totalHoursMin: e.target.value,
                }))
              }
              maxLength={5}
            />
          </div>
          <span className="text-[14px] text-[#868685]">〜</span>
          <div className="flex-1 min-w-0">
            <TextInput
              type="text"
              inputMode="decimal"
              placeholder="284"
              value={value.totalHoursMax}
              onChange={(e) =>
                setValue((prev) => ({
                  ...prev,
                  totalHoursMax: e.target.value,
                }))
              }
              maxLength={5}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        <FieldLabel>残時間（h）</FieldLabel>
        <div className="flex gap-2 items-center w-full">
          <div className="flex-1 min-w-0">
            <TextInput
              type="text"
              inputMode="decimal"
              placeholder="-50"
              value={value.remainingHoursMin}
              onChange={(e) =>
                setValue((prev) => ({
                  ...prev,
                  remainingHoursMin: e.target.value,
                }))
              }
              maxLength={5}
            />
          </div>
          <span className="text-[14px] text-[#868685]">〜</span>
          <div className="flex-1 min-w-0">
            <TextInput
              type="text"
              inputMode="decimal"
              placeholder="284"
              value={value.remainingHoursMax}
              onChange={(e) =>
                setValue((prev) => ({
                  ...prev,
                  remainingHoursMax: e.target.value,
                }))
              }
              maxLength={5}
            />
          </div>
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
