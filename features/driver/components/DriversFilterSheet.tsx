"use client";

import { useState } from "react";

import { SelectInput } from "@/components/ui/SelectInput";
import { TextInput } from "@/components/ui/TextInput";
import type { DriverManagementStatus } from "@/features/driver/components/DriverManagementCard";

export type DriverStatusFilter = DriverManagementStatus;

export type DriversFilterValue = {
  driverName: string;
  status: ReadonlyArray<DriverStatusFilter>;
  ageMin: string;
  ageMax: string;
  affiliationId: string;
  projectId: string;
  role: string;
};

export const DEFAULT_DRIVERS_FILTER: DriversFilterValue = {
  driverName: "",
  status: [],
  ageMin: "",
  ageMax: "",
  affiliationId: "",
  projectId: "",
  role: "",
};

export const countActiveDriversFilters = (
  filter: DriversFilterValue,
): number => {
  let count = filter.status.length;
  if (filter.driverName.trim() !== "") count += 1;
  if (filter.ageMin !== "" || filter.ageMax !== "") count += 1;
  if (filter.affiliationId !== "") count += 1;
  if (filter.projectId !== "") count += 1;
  if (filter.role !== "") count += 1;
  return count;
};

const STATUS_OPTIONS: ReadonlyArray<{
  value: DriverStatusFilter;
  label: string;
}> = [
  { value: "active", label: "稼働中" },
  { value: "pending", label: "新規登録" },
  { value: "retired", label: "退職" },
];

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
];

const ROLE_OPTIONS = [
  { value: "driver", label: "ドライバ" },
  { value: "admin", label: "管理者" },
  { value: "super_admin", label: "全体管理者" },
];

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[13px] font-semibold text-[#0e0f0c]">{children}</span>
);

type ChipProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const Chip = ({ selected, onClick, children }: ChipProps) => {
  const stateClass = selected
    ? "bg-[#9fe870] text-[#163300] border-[#9fe870]"
    : "bg-white border-[#e8ebe6] text-[#0e0f0c] hover:bg-[#f7f7f5]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-[9px] rounded-full border text-[14px] font-medium cursor-pointer transition-colors ${stateClass}`}
    >
      {children}
    </button>
  );
};

type Props = {
  initialValue?: DriversFilterValue;
  onApply: (value: DriversFilterValue) => void;
};

export const DriversFilterSheet = ({
  initialValue = DEFAULT_DRIVERS_FILTER,
  onApply,
}: Props) => {
  const [value, setValue] = useState<DriversFilterValue>(initialValue);

  const toggleStatus = (status: DriverStatusFilter) => {
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

  const handleReset = () => setValue(DEFAULT_DRIVERS_FILTER);
  const handleApply = () => onApply(value);

  return (
    <div className="flex flex-col gap-4 w-full leading-[normal]">
      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>名前</FieldLabel>
        <div className="bg-white border border-[#e8ebe6] rounded-[10px] flex gap-2 items-center px-4 py-3.5 w-full">
          <span className="text-[14px] text-black">🔍</span>
          <input
            type="text"
            placeholder="名前で検索"
            value={value.driverName}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, driverName: e.target.value }))
            }
            maxLength={50}
            className="flex-1 min-w-0 outline-none bg-transparent text-[14px] text-[#0e0f0c] placeholder:text-[#bfbfbf]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
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

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>年齢</FieldLabel>
        <div className="flex gap-2 items-center w-full">
          <div className="flex-1 min-w-0">
            <TextInput
              type="text"
              inputMode="numeric"
              placeholder="18"
              value={value.ageMin}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, ageMin: e.target.value }))
              }
              maxLength={3}
              className="text-center"
            />
          </div>
          <span className="text-[14px] font-normal text-[#868685]">〜</span>
          <div className="flex-1 min-w-0">
            <TextInput
              type="text"
              inputMode="numeric"
              placeholder="65"
              value={value.ageMax}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, ageMax: e.target.value }))
              }
              maxLength={3}
              className="text-center"
            />
          </div>
          <span className="text-[13px] font-normal text-[#868685]">歳</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>所属会社</FieldLabel>
        <SelectInput
          placeholder="会社を選択"
          value={value.affiliationId}
          onChange={(v) => setValue((prev) => ({ ...prev, affiliationId: v }))}
          options={AFFILIATION_OPTIONS}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>案件</FieldLabel>
        <SelectInput
          placeholder="案件を選択"
          value={value.projectId}
          onChange={(v) => setValue((prev) => ({ ...prev, projectId: v }))}
          options={PROJECT_OPTIONS}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>権限</FieldLabel>
        <SelectInput
          placeholder="すべて"
          value={value.role}
          onChange={(v) => setValue((prev) => ({ ...prev, role: v }))}
          options={ROLE_OPTIONS}
        />
      </div>

      <div className="flex gap-3 justify-center pt-2 w-full">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 bg-white border border-[#e8ebe6] rounded-full px-6 py-3.5 text-[14px] font-bold text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
        >
          リセット
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 bg-[#9fe870] rounded-full px-6 py-3.5 text-[14px] font-bold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
        >
          絞り込む
        </button>
      </div>
    </div>
  );
};
