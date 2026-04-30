"use client";

import { endOfMonth, format, parse, startOfMonth, subDays } from "date-fns";
import { useState } from "react";

import { DatePicker } from "@/components/ui/DatePicker";
import { SelectInput } from "@/components/ui/SelectInput";

export type RecordsFilterValue = {
  dateFrom: string;
  dateTo: string;
  affiliationId: string;
  projectId: string;
  driverName: string;
};

export const DEFAULT_RECORDS_FILTER: RecordsFilterValue = {
  dateFrom: "",
  dateTo: "",
  affiliationId: "",
  projectId: "",
  driverName: "",
};

export const countActiveRecordsFilters = (
  filter: RecordsFilterValue,
): number => {
  let count = 0;
  if (filter.dateFrom !== "" || filter.dateTo !== "") count += 1;
  if (filter.affiliationId !== "") count += 1;
  if (filter.projectId !== "") count += 1;
  if (filter.driverName.trim() !== "") count += 1;
  return count;
};

const AFFILIATION_OPTIONS = [
  { value: "abc", label: "ABC運送" },
  { value: "tohoku", label: "東北運送" },
  { value: "personal", label: "個人" },
];

const PROJECT_OPTIONS = [
  { value: "amazon", label: "Amazon 品川" },
  { value: "nissan", label: "日産・栃木" },
];

const ISO_FORMAT = "yyyy-MM-dd";

const parseIsoDate = (value: string): Date | undefined => {
  if (value === "") return undefined;
  const parsed = parse(value, ISO_FORMAT, new Date());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[14px] font-semibold text-[#0e0f0c]">{children}</span>
);

type QuickChipProps = {
  onClick: () => void;
  children: React.ReactNode;
};

const QuickChip = ({ onClick, children }: QuickChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white border border-[#e8ebe6] rounded-full flex items-center justify-center px-3.5 py-2 text-[14px] font-medium text-[#0e0f0c] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
  >
    {children}
  </button>
);

type Props = {
  initialValue?: RecordsFilterValue;
  onApply: (value: RecordsFilterValue) => void;
};

export const RecordsFilterSheet = ({
  initialValue = DEFAULT_RECORDS_FILTER,
  onApply,
}: Props) => {
  const [value, setValue] = useState<RecordsFilterValue>(initialValue);

  const handleReset = () => setValue(DEFAULT_RECORDS_FILTER);
  const handleApply = () => onApply(value);

  const setRange = (from: Date, to: Date) => {
    setValue((prev) => ({
      ...prev,
      dateFrom: format(from, ISO_FORMAT),
      dateTo: format(to, ISO_FORMAT),
    }));
  };

  const handleQuickToday = () => {
    const today = new Date();
    setRange(today, today);
  };

  const handleQuickYesterday = () => {
    const yesterday = subDays(new Date(), 1);
    setRange(yesterday, yesterday);
  };

  const handleQuickThisMonth = () => {
    const now = new Date();
    setRange(startOfMonth(now), endOfMonth(now));
  };

  const today = new Date();
  const startYear = today.getFullYear() - 3;
  const endYear = today.getFullYear() + 1;

  return (
    <div className="flex flex-col gap-6 w-full leading-[normal]">
      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>期間</FieldLabel>
        <div className="flex gap-2 items-center w-full">
          <div className="flex-1 min-w-0">
            <DatePicker
              value={value.dateFrom}
              onChange={(v) =>
                setValue((prev) => ({
                  ...prev,
                  dateFrom: v,
                  dateTo:
                    prev.dateTo !== "" && v !== "" && v > prev.dateTo
                      ? ""
                      : prev.dateTo,
                }))
              }
              placeholder="YYYY/MM/DD"
              startYear={startYear}
              endYear={endYear}
              defaultMonth={today}
            />
          </div>
          <span className="text-[14px] font-normal text-[#868685]">〜</span>
          <div className="flex-1 min-w-0">
            <DatePicker
              value={value.dateTo}
              onChange={(v) => setValue((prev) => ({ ...prev, dateTo: v }))}
              placeholder="YYYY/MM/DD"
              startYear={startYear}
              endYear={endYear}
              defaultMonth={parseIsoDate(value.dateFrom) ?? today}
              align="right"
              disabledBefore={parseIsoDate(value.dateFrom)}
            />
          </div>
        </div>
        <div className="flex gap-2 items-start">
          <QuickChip onClick={handleQuickToday}>今日</QuickChip>
          <QuickChip onClick={handleQuickYesterday}>昨日</QuickChip>
          <QuickChip onClick={handleQuickThisMonth}>今月</QuickChip>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>所属</FieldLabel>
        <SelectInput
          placeholder="すべて"
          value={value.affiliationId}
          onChange={(v) => setValue((prev) => ({ ...prev, affiliationId: v }))}
          options={AFFILIATION_OPTIONS}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>案件</FieldLabel>
        <SelectInput
          placeholder="すべて"
          value={value.projectId}
          onChange={(v) => setValue((prev) => ({ ...prev, projectId: v }))}
          options={PROJECT_OPTIONS}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>ドライバー名</FieldLabel>
        <div className="bg-white border border-[#e8ebe6] rounded-[10px] flex gap-2 items-center px-4 py-3.5 w-full">
          <span className="text-[14px] text-[#868685]">🔍</span>
          <input
            type="text"
            placeholder="ドライバー名で検索"
            value={value.driverName}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, driverName: e.target.value }))
            }
            maxLength={50}
            className="flex-1 min-w-0 outline-none bg-transparent text-[14px] text-[#0e0f0c] placeholder:text-[#bfbfbf]"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2 w-full">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 bg-white border border-[#e8ebe6] rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
        >
          リセット
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 bg-[#9fe870] rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
        >
          検索する
        </button>
      </div>
    </div>
  );
};
