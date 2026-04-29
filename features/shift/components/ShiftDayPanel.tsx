"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";

import type { ShiftStatus } from "@/features/shift/components/ShiftCalendar";

export type ShiftEntry = {
  id: string;
  trip: number;
  projectName: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  status: ShiftStatus;
};

type Props = {
  date: Date;
  shifts: ReadonlyArray<ShiftEntry>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const STATUS_LABEL: Record<ShiftStatus, string> = {
  registered: "登録済み",
  pending: "申請中",
};

const STATUS_PILL_BG: Record<ShiftStatus, string> = {
  registered: "bg-[#e2f6d5]",
  pending: "bg-[#fff0db]",
};

const STATUS_PILL_TEXT: Record<ShiftStatus, string> = {
  registered: "text-[#163300]",
  pending: "text-[#ec7e00]",
};

const STATUS_DOT: Record<ShiftStatus, string> = {
  registered: "bg-[#9fe870]",
  pending: "bg-[#ec7e00]",
};

const TRIP_TEXT_COLOR: Record<ShiftStatus, string> = {
  registered: "text-[#9fe870]",
  pending: "text-[#ec7e00]",
};

type CardProps = {
  shift: ShiftEntry;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const ShiftCard = ({ shift, onEdit, onDelete }: CardProps) => (
  <div className="bg-white rounded-xl flex flex-col gap-1.5 px-4 py-3.5 w-full">
    <div className="flex items-center justify-between w-full">
      <p
        className={`text-[13px] font-semibold ${TRIP_TEXT_COLOR[shift.status]}`}
      >
        {shift.trip}便
      </p>
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1 px-2 py-[3px] rounded-full ${STATUS_PILL_BG[shift.status]}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[shift.status]}`}
          />
          <span
            className={`text-[11px] font-medium ${STATUS_PILL_TEXT[shift.status]}`}
          >
            {STATUS_LABEL[shift.status]}
          </span>
        </div>
        <p className="text-[13px] font-medium text-[#888986]">
          {shift.projectName}
        </p>
      </div>
    </div>
    <p className="text-[15px] font-medium text-[#0e0f0c]">
      {shift.startTime} - {shift.endTime} 休憩時間 {shift.breakMinutes}分
    </p>
    <div className="flex gap-2.5 w-full mt-1">
      <button
        type="button"
        onClick={() => onEdit(shift.id)}
        className="flex-1 bg-white border border-[#e8ebe5] rounded-full px-5 py-2 text-[13px] font-semibold text-[#0e0f0c] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        編集
      </button>
      <button
        type="button"
        onClick={() => onDelete(shift.id)}
        className="flex-1 bg-white border border-[#e8ebe5] rounded-full px-5 py-2 text-[13px] font-semibold text-[#e23b3e] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        削除
      </button>
    </div>
  </div>
);

export const ShiftDayPanel = ({ date, shifts, onEdit, onDelete }: Props) => {
  const dateLabel = format(date, "M/d（E）", { locale: ja });

  return (
    <div className="bg-[#f7f7f5] rounded-2xl flex flex-col gap-4 px-6 py-5 w-full">
      <p className="text-[16px] font-bold text-[#0e0f0c]">
        {dateLabel}のシフト
      </p>
      {shifts.length === 0 ? (
        <p className="text-[14px] text-[#888986]">
          この日のシフトはまだありません。
        </p>
      ) : (
        shifts.map((shift) => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};
