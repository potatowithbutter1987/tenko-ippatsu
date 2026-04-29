"use client";

import { addMonths } from "date-fns";
import { useState } from "react";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  ShiftAddSheet,
  type ShiftInput,
} from "@/features/shift/components/ShiftAddSheet";
import {
  ShiftCalendar,
  type DayShift,
} from "@/features/shift/components/ShiftCalendar";
import {
  ShiftDayPanel,
  type ShiftEntry,
} from "@/features/shift/components/ShiftDayPanel";

const MOCK_DAY_SHIFTS: ReadonlyArray<DayShift> = [
  { date: "2026-04-02", status: "registered" },
  { date: "2026-04-03", status: "registered" },
  { date: "2026-04-07", status: "registered" },
  { date: "2026-04-08", status: "registered" },
  { date: "2026-04-09", status: "registered" },
  { date: "2026-04-10", status: "registered" },
  { date: "2026-04-14", status: "registered" },
  { date: "2026-04-15", status: "registered" },
  { date: "2026-04-16", status: "registered" },
  { date: "2026-04-17", status: "registered" },
  { date: "2026-04-21", status: "pending" },
  { date: "2026-04-22", status: "pending" },
  { date: "2026-04-23", status: "pending" },
  { date: "2026-04-24", status: "pending" },
  { date: "2026-04-28", status: "pending" },
  { date: "2026-04-29", status: "pending" },
  { date: "2026-04-30", status: "pending" },
];

const MOCK_DETAILS_BY_DATE: Record<string, ReadonlyArray<ShiftEntry>> = {
  "2026-04-09": [
    {
      id: "shift-1",
      trip: 1,
      projectName: "Amazon 品川",
      startTime: "09:00",
      endTime: "18:00",
      breakMinutes: 60,
      status: "pending",
    },
    {
      id: "shift-2",
      trip: 2,
      projectName: "日産・栃木",
      startTime: "14:00",
      endTime: "20:00",
      breakMinutes: 45,
      status: "registered",
    },
  ],
};

const INITIAL_DATE = new Date(2026, 3, 9);
const MAX_DATE = addMonths(INITIAL_DATE, 3);

export const ShiftRegisterPage = () => {
  const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);
  const [selectedDate, setSelectedDate] = useState(INITIAL_DATE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  const dailyShifts =
    MOCK_DETAILS_BY_DATE[
      `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    ] ?? [];

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddClick = () => {
    setSheetOpen(true);
  };

  const handleSave = (input: ShiftInput) => {
    console.log("save shift", input);
    setSheetOpen(false);
  };

  const handleConfirmCopy = () => {
    // TODO: 先月のシフトをコピーする処理
    console.log("copy last month shifts");
    setCopyModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="px-6 pt-5 pb-4">
          <ShiftCalendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            shifts={MOCK_DAY_SHIFTS}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            maxDate={MAX_DATE}
          />
        </div>
        <ShiftDayPanel
          date={selectedDate}
          shifts={dailyShifts}
          onEdit={(id) => console.log("edit", id)}
          onDelete={(id) => console.log("delete", id)}
        />
        <div className="px-6 py-4 flex flex-col gap-3 w-full">
          <button
            type="button"
            onClick={() => setCopyModalOpen(true)}
            className="w-full bg-white border border-[#e8ebe5] rounded-full py-3.5 text-[16px] font-semibold text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
          >
            先月のシフトをコピー
          </button>
          <button
            type="button"
            onClick={handleAddClick}
            className="w-full bg-[#9fe870] rounded-full py-3.5 px-6 text-[16px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
          >
            ＋ シフトを追加する
          </button>
        </div>
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="シフトを追加"
      >
        <ShiftAddSheet
          date={selectedDate}
          onCancel={() => setSheetOpen(false)}
          onSave={handleSave}
        />
      </BottomSheet>

      <ConfirmModal
        open={copyModalOpen}
        title="確認"
        message="先月のシフトをコピーします。上書きしますがよろしいですか？"
        cancelLabel="キャンセル"
        confirmLabel="コピーする"
        onCancel={() => setCopyModalOpen(false)}
        onConfirm={handleConfirmCopy}
      />
    </>
  );
};
