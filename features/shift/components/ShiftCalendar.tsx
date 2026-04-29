"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isSameDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ja } from "date-fns/locale";

export type ShiftStatus = "registered" | "pending";

export type DayShift = {
  date: string;
  status: ShiftStatus;
};

type Props = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  shifts: ReadonlyArray<DayShift>;
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  maxDate?: Date;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

const STATUS_DOT_COLOR: Record<ShiftStatus, string> = {
  registered: "#9fe870",
  pending: "#ec7e00",
};

const resolveWeekdayColor = (index: number): string => {
  if (index === 0) return "text-[#e23b3e]";
  if (index === 6) return "text-[#3366e5]";
  return "text-[#888986]";
};

const resolveDayColor = (day: Date): string => {
  const weekday = day.getDay();
  if (weekday === 0) return "text-[#e23b3e]";
  if (weekday === 6) return "text-[#3366e5]";
  return "text-[#0e0f0c]";
};

const buildCalendarCells = (currentMonth: Date): Array<Date | null> => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startWeekday = getDay(monthStart);
  const cells: Array<Date | null> = Array(startWeekday).fill(null);
  cells.push(...days);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

const buildShiftMap = (
  shifts: ReadonlyArray<DayShift>,
): Map<string, ShiftStatus> => {
  const map = new Map<string, ShiftStatus>();
  shifts.forEach((s) => map.set(s.date, s.status));
  return map;
};

type DayCellProps = {
  day: Date;
  isSelected: boolean;
  status: ShiftStatus | undefined;
  disabled: boolean;
  onClick: () => void;
};

const DayCell = ({
  day,
  isSelected,
  status,
  disabled,
  onClick,
}: DayCellProps) => {
  const dotColor = status !== undefined ? STATUS_DOT_COLOR[status] : null;
  const stateClass = disabled
    ? "opacity-30 cursor-not-allowed"
    : "cursor-pointer hover:bg-[#f7f7f5]";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 h-11 flex flex-col items-center justify-center gap-[3px] rounded transition-colors ${stateClass}`}
    >
      {isSelected ? (
        <div className="bg-[#ec7e00] rounded-full w-[30px] h-[30px] flex items-center justify-center">
          <span className="text-[14px] font-bold text-[#163300]">
            {day.getDate()}
          </span>
        </div>
      ) : (
        <span className={`text-[14px] font-medium ${resolveDayColor(day)}`}>
          {day.getDate()}
        </span>
      )}
      {dotColor !== null && !isSelected ? (
        <span
          className="block w-[6px] h-[6px] rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      ) : null}
    </button>
  );
};

export const ShiftCalendar = ({
  selectedDate,
  onSelectDate,
  shifts,
  currentMonth,
  onMonthChange,
  maxDate,
}: Props) => {
  const effectiveMaxDate = maxDate ?? addMonths(new Date(), 3);
  const canGoNext = !isAfter(
    startOfMonth(addMonths(currentMonth, 1)),
    effectiveMaxDate,
  );
  const cells = buildCalendarCells(currentMonth);
  const shiftMap = buildShiftMap(shifts);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) =>
    cells.slice(i * 7, (i + 1) * 7),
  );

  const nextStateClass = canGoNext
    ? "text-[#888986] cursor-pointer hover:text-[#0e0f0c]"
    : "text-[#bfbfbf] cursor-not-allowed";

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          aria-label="前の月"
          className="text-[18px] text-[#888986] cursor-pointer hover:text-[#0e0f0c] transition-colors px-2"
        >
          ◀
        </button>
        <p className="text-[18px] font-bold text-[#0e0f0c]">
          {format(currentMonth, "yyyy年 M月", { locale: ja })}
        </p>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          aria-label="次の月"
          disabled={!canGoNext}
          className={`text-[18px] transition-colors px-2 ${nextStateClass}`}
        >
          ▶
        </button>
      </div>

      <div className="flex items-start w-full">
        {WEEKDAYS.map((wd, idx) => (
          <div key={wd} className="flex-1 flex items-center justify-center">
            <p
              className={`text-[13px] font-semibold ${resolveWeekdayColor(idx)}`}
            >
              {wd}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 w-full">
        {weeks.map((week, weekIdx) => (
          <div key={`week-${weekIdx}`} className="flex w-full">
            {week.map((day, dayIdx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${weekIdx}-${dayIdx}`}
                    className="flex-1 h-11"
                  />
                );
              }
              const dateStr = format(day, "yyyy-MM-dd");
              const isDisabled = isAfter(day, effectiveMaxDate);
              return (
                <DayCell
                  key={dateStr}
                  day={day}
                  isSelected={isSameDay(day, selectedDate)}
                  status={shiftMap.get(dateStr)}
                  disabled={isDisabled}
                  onClick={() => onSelectDate(day)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#9fe870]" />
          <span className="text-[12px] text-[#888986]">シフト登録済み</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#ec7e00]" />
          <span className="text-[12px] text-[#888986]">申請中</span>
        </div>
      </div>
    </div>
  );
};
