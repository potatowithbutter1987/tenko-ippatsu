"use client";

import { useState } from "react";

import { SelectInput } from "@/components/ui/SelectInput";

export type ShiftsFilterValue = {
  affiliationId: string;
  projectId: string;
  driverName: string;
};

export const DEFAULT_SHIFTS_FILTER: ShiftsFilterValue = {
  affiliationId: "",
  projectId: "",
  driverName: "",
};

export const countActiveShiftsFilters = (filter: ShiftsFilterValue): number => {
  let count = 0;
  if (filter.affiliationId !== "") count += 1;
  if (filter.projectId !== "") count += 1;
  if (filter.driverName.trim() !== "") count += 1;
  return count;
};

const AFFILIATION_OPTIONS = [
  { value: "self", label: "自社" },
  { value: "abc", label: "ABC運送" },
  { value: "tohoku", label: "東北運送" },
  { value: "personal", label: "個人" },
  { value: "b-unsou", label: "B運送" },
];

const PROJECT_OPTIONS = [
  { value: "amazon", label: "Amazon 品川" },
  { value: "yamato", label: "ヤマト 江東" },
  { value: "nissan", label: "日産・栃木" },
  { value: "sagawa", label: "佐川急便" },
  { value: "spot", label: "スポット便" },
];

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[13px] font-semibold text-[#0e0f0c]">{children}</span>
);

type Props = {
  initialValue?: ShiftsFilterValue;
  onApply: (value: ShiftsFilterValue) => void;
};

export const ShiftsFilterSheet = ({
  initialValue = DEFAULT_SHIFTS_FILTER,
  onApply,
}: Props) => {
  const [value, setValue] = useState<ShiftsFilterValue>(initialValue);

  const handleReset = () => setValue(DEFAULT_SHIFTS_FILTER);
  const handleApply = () => onApply(value);

  return (
    <div className="flex flex-col gap-4 w-full leading-[normal]">
      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>所属会社</FieldLabel>
        <SelectInput
          placeholder="すべて"
          value={value.affiliationId}
          onChange={(v) => setValue((prev) => ({ ...prev, affiliationId: v }))}
          options={AFFILIATION_OPTIONS}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>案件名</FieldLabel>
        <SelectInput
          placeholder="すべて"
          value={value.projectId}
          onChange={(v) => setValue((prev) => ({ ...prev, projectId: v }))}
          options={PROJECT_OPTIONS}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>ドライバー名</FieldLabel>
        <div className="bg-white border border-[#e8ebe6] rounded-[10px] flex gap-2 items-center px-4 py-3 w-full">
          <span className="text-[14px] text-black">🔍</span>
          <input
            type="text"
            placeholder="氏名で検索"
            value={value.driverName}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, driverName: e.target.value }))
            }
            maxLength={50}
            className="flex-1 min-w-0 outline-none bg-transparent text-[14px] text-[#0e0f0c] placeholder:text-[#bfbfbf]"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-center pt-2 w-full">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 bg-white border border-[#e8ebe6] rounded-full py-3.5 text-[14px] font-semibold text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
        >
          リセット
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 bg-[#9fe870] rounded-full py-3.5 text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
        >
          適用
        </button>
      </div>
    </div>
  );
};
