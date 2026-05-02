"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useImperativeHandle, useRef, type Ref } from "react";

export type ShiftChipStatus = "confirmed" | "pending";

export type MonthShiftGridHandle = {
  scrollToToday: () => void;
};

const COL_WIDTH = 94;

export type ShiftChip = {
  id: string;
  label: string;
  project: string;
  status: ShiftChipStatus;
};

export type DayCell = {
  shifts: ReadonlyArray<ShiftChip>;
};

export type DriverMonthRow = {
  driverId: string;
  name: string;
  company: string;
  initial: string;
  cells: ReadonlyArray<DayCell>;
};

type Props = {
  monthDates: ReadonlyArray<Date>;
  todayDateString?: string;
  drivers: ReadonlyArray<DriverMonthRow>;
  onChipClick?: (driverId: string, dateIndex: number, chipId: string) => void;
  onCellClick?: (driverId: string, dateIndex: number) => void;
  ref?: Ref<MonthShiftGridHandle>;
};

const ISO = "yyyy-MM-dd";

const HeaderCell = ({ date, isToday }: { date: Date; isToday: boolean }) => {
  const bg = isToday ? "bg-[#9fe870]" : "bg-[#0e0f0c]";
  const border = isToday ? "border-[#9fe870]" : "border-[#2a2a28]";
  const text = isToday ? "text-[#163300]" : "text-white";
  return (
    <div
      className={`${bg} ${border} ${text} border-r shrink-0 w-[94px] flex flex-col items-center justify-center gap-0.5 py-2 leading-[normal]`}
    >
      <span className="text-[13px] font-bold">{format(date, "M/d")}</span>
      <span className="text-[10px] font-medium">
        ({format(date, "EEE", { locale: ja })})
      </span>
    </div>
  );
};

const ShiftChipPill = ({
  chip,
  onClick,
}: {
  chip: ShiftChip;
  onClick?: () => void;
}) => {
  const bg = chip.status === "pending" ? "bg-[#fff3e0]" : "bg-[#e2f6d5]";
  const labelColor =
    chip.status === "pending" ? "text-[#ec7e00]" : "text-[#163300]";
  const hoverBg =
    chip.status === "pending" ? "hover:bg-[#fde7c4]" : "hover:bg-[#d4ebc6]";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`${bg} ${hoverBg} rounded-[6px] flex flex-col gap-px px-1.5 py-1 w-full text-left cursor-pointer transition-colors leading-[normal]`}
    >
      <span
        className={`${labelColor} text-[10px] font-semibold whitespace-nowrap truncate`}
      >
        {chip.label}
      </span>
      <span className="text-[#868685] text-[9px] font-normal whitespace-nowrap truncate">
        {chip.project}
      </span>
    </button>
  );
};

const DayCellView = ({
  cell,
  onChipClick,
  onCellClick,
}: {
  cell: DayCell;
  onChipClick?: (chipId: string) => void;
  onCellClick?: () => void;
}) => {
  const clickableClass =
    onCellClick !== undefined
      ? "cursor-pointer hover:bg-[#fafafa] transition-colors"
      : "";
  return (
    <div
      role={onCellClick !== undefined ? "button" : undefined}
      tabIndex={onCellClick !== undefined ? 0 : undefined}
      onClick={onCellClick}
      onKeyDown={(e) => {
        if (onCellClick !== undefined && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onCellClick();
        }
      }}
      className={`border-r border-b border-[#e8ebe6] shrink-0 w-[94px] px-1.5 py-8 flex flex-col gap-1 items-start ${clickableClass}`}
    >
      {cell.shifts.map((chip) => (
        <ShiftChipPill
          key={chip.id}
          chip={chip}
          onClick={
            onChipClick !== undefined ? () => onChipClick(chip.id) : undefined
          }
        />
      ))}
    </div>
  );
};

const DriverStickyCell = ({
  name,
  company,
  initial,
}: {
  name: string;
  company: string;
  initial: string;
}) => (
  <div className="sticky left-0 z-10 bg-white border-r border-b border-[#e8ebe6] shrink-0 w-[88px] flex gap-2 items-center pl-2 pr-1 py-2.5">
    <div className="bg-[#0e0f0c] w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0">
      <span className="text-white text-[11px] font-semibold leading-[normal]">
        {initial}
      </span>
    </div>
    <div className="flex flex-col flex-1 min-w-0 leading-[normal]">
      <span className="text-[#0e0f0c] text-[11px] font-semibold truncate">
        {name}
      </span>
      <span className="text-[#868685] text-[10px] font-normal truncate">
        {company}
      </span>
    </div>
  </div>
);

export const MonthShiftGrid = ({
  monthDates,
  todayDateString,
  drivers,
  onChipClick,
  onCellClick,
  ref,
}: Props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      scrollToToday: () => {
        if (todayDateString === undefined) return;
        const idx = monthDates.findIndex(
          (d) => format(d, ISO) === todayDateString,
        );
        if (idx < 0) return;
        scrollerRef.current?.scrollTo({
          left: idx * COL_WIDTH,
          behavior: "smooth",
        });
      },
    }),
    [todayDateString, monthDates],
  );

  return (
    <div ref={scrollerRef} className="bg-white w-full overflow-x-auto">
      <div className="min-w-max">
        <div className="flex items-stretch">
          <div className="sticky left-0 z-20 bg-[#0e0f0c] border-r border-[#2a2a28] shrink-0 w-[88px] flex items-center justify-center py-3.5">
            <span className="text-[11px] font-semibold text-white leading-[normal]">
              ドライバー
            </span>
          </div>
          {monthDates.map((date, i) => (
            <HeaderCell
              key={i}
              date={date}
              isToday={
                todayDateString !== undefined &&
                format(date, ISO) === todayDateString
              }
            />
          ))}
        </div>

        {drivers.map((driver) => (
          <div key={driver.driverId} className="flex items-stretch">
            <DriverStickyCell
              name={driver.name}
              company={driver.company}
              initial={driver.initial}
            />
            {driver.cells.map((cell, i) => (
              <DayCellView
                key={i}
                cell={cell}
                onChipClick={
                  onChipClick !== undefined
                    ? (chipId) => onChipClick(driver.driverId, i, chipId)
                    : undefined
                }
                onCellClick={
                  onCellClick !== undefined
                    ? () => onCellClick(driver.driverId, i)
                    : undefined
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
