"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useEffect, useRef, useState } from "react";

import { AdminAppBar } from "@/components/layout/AdminAppBar";
import { useAdminShell } from "@/components/layout/NavigationDrawer";
import { BottomSheet } from "@/components/ui/BottomSheet";
import {
  MonthShiftGrid,
  type DayCell,
  type DriverMonthRow,
  type MonthShiftGridHandle,
} from "@/features/shift/components/MonthShiftGrid";
import {
  ShiftCopySheet,
  type ShiftCopyValue,
} from "@/features/shift/components/ShiftCopySheet";
import {
  ShiftEditSheet,
  type ShiftEditValue,
} from "@/features/shift/components/ShiftEditSheet";
import { ShiftsActionSheet } from "@/features/shift/components/ShiftsActionSheet";
import {
  countActiveShiftsFilters,
  DEFAULT_SHIFTS_FILTER,
  ShiftsFilterSheet,
  type ShiftsFilterValue,
} from "@/features/shift/components/ShiftsFilterSheet";

const ISO = "yyyy-MM-dd";
const MAX_MONTHS_AHEAD = 3;

type DriverPattern = {
  driverId: string;
  name: string;
  company: string;
  initial: string;
  // 0 = Mon ... 6 = Sun
  weekdayPattern: ReadonlyArray<DayCell>;
};

const MOCK_DRIVER_PATTERNS: ReadonlyArray<DriverPattern> = [
  {
    driverId: "sato",
    name: "佐藤 次郎",
    company: "個人",
    initial: "佐",
    weekdayPattern: [
      {
        shifts: [
          {
            id: "sato-mon-1",
            label: "1便 8–11",
            project: "Amazon品川",
            status: "confirmed",
          },
          {
            id: "sato-mon-2",
            label: "2便 15–18",
            project: "日産・新宿",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "sato-tue-1",
            label: "1便 8–11",
            project: "Amazon品川",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "sato-wed-1",
            label: "1便 8–11",
            project: "Amazon品川",
            status: "confirmed",
          },
          {
            id: "sato-wed-2",
            label: "2便 14–17",
            project: "近鉄・大阪",
            status: "confirmed",
          },
          {
            id: "sato-wed-3",
            label: "3便 20–23",
            project: "日産・栃木",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "sato-thu-1",
            label: "1便 8–11",
            project: "Amazon品川",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "sato-fri-1",
            label: "1便 8–11",
            project: "Amazon品川",
            status: "confirmed",
          },
        ],
      },
      { shifts: [] },
      { shifts: [] },
    ],
  },
  {
    driverId: "suzuki",
    name: "鈴木 三郎",
    company: "B運送",
    initial: "鈴",
    weekdayPattern: [
      {
        shifts: [
          {
            id: "suzuki-mon",
            label: "1便 8:30–17",
            project: "ヤマト江東",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "suzuki-tue",
            label: "1便 8:30–17",
            project: "ヤマト江東",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "suzuki-wed",
            label: "1便 8:30–17",
            project: "ヤマト江東",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "suzuki-thu",
            label: "1便 8:30–17",
            project: "ヤマト江東",
            status: "confirmed",
          },
        ],
      },
      { shifts: [] },
      {
        shifts: [
          {
            id: "suzuki-sat",
            label: "1便 8:30–17",
            project: "ヤマト江東",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "suzuki-sun",
            label: "1便 8:30–17",
            project: "ヤマト江東",
            status: "confirmed",
          },
        ],
      },
    ],
  },
  {
    driverId: "tanaka",
    name: "田中 四郎",
    company: "自社",
    initial: "田",
    weekdayPattern: [
      {
        shifts: [
          {
            id: "tanaka-mon",
            label: "1便 9–12",
            project: "スポット便",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "tanaka-tue",
            label: "1便 13–18",
            project: "渋谷・品川",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "tanaka-wed",
            label: "1便 13–18",
            project: "渋谷・品川",
            status: "pending",
          },
        ],
      },
      {
        shifts: [
          {
            id: "tanaka-thu",
            label: "1便 9–15",
            project: "スポット便",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "tanaka-fri",
            label: "1便 未定",
            project: "—",
            status: "pending",
          },
        ],
      },
      { shifts: [] },
      { shifts: [] },
    ],
  },
  {
    driverId: "yamada",
    name: "山田 花子",
    company: "ABC運送",
    initial: "山",
    weekdayPattern: [
      {
        shifts: [
          {
            id: "yamada-mon-1",
            label: "1便 7:30–12",
            project: "佐川急便",
            status: "confirmed",
          },
          {
            id: "yamada-mon-2",
            label: "2便 18–22",
            project: "日通・練馬",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "yamada-tue",
            label: "1便 7:30–12",
            project: "佐川急便",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "yamada-wed",
            label: "1便 7:30–12",
            project: "佐川急便",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "yamada-thu",
            label: "1便 7:30–12",
            project: "佐川急便",
            status: "confirmed",
          },
        ],
      },
      {
        shifts: [
          {
            id: "yamada-fri",
            label: "1便 7:30–12",
            project: "佐川急便",
            status: "confirmed",
          },
        ],
      },
      { shifts: [] },
      { shifts: [] },
    ],
  },
];

const buildMonthDates = (month: Date): ReadonlyArray<Date> =>
  eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });

const formatMonthRange = (month: Date): string => {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  return `${format(start, "M/d")} – ${format(end, "M/d")}`;
};

const mondayIndex = (date: Date): number => (date.getDay() + 6) % 7;

const buildMonthRow = (
  pattern: DriverPattern,
  monthDates: ReadonlyArray<Date>,
): DriverMonthRow => ({
  driverId: pattern.driverId,
  name: pattern.name,
  company: pattern.company,
  initial: pattern.initial,
  cells: monthDates.map((date) => ({
    shifts: pattern.weekdayPattern[mondayIndex(date)].shifts.map((chip, i) => ({
      ...chip,
      id: `${pattern.driverId}-${format(date, ISO)}-${i}`,
    })),
  })),
});

const buildEmptyMonthRow = (
  pattern: DriverPattern,
  monthDates: ReadonlyArray<Date>,
): DriverMonthRow => ({
  driverId: pattern.driverId,
  name: pattern.name,
  company: pattern.company,
  initial: pattern.initial,
  cells: monthDates.map(() => ({ shifts: [] })),
});

const PROJECT_ID_BY_LABEL: Record<string, string> = {
  Amazon品川: "amazon",
  ヤマト江東: "yamato",
  "日産・栃木": "nissan",
  佐川急便: "sagawa",
  スポット便: "spot",
};

const SHIFT_LABEL_TIME_PATTERN =
  /(\d{1,2})(?::(\d{2}))?\s*[–-]\s*(\d{1,2})(?::(\d{2}))?/;

const parseShiftLabel = (
  label: string,
): { startTime: string; endTime: string } => {
  const match = SHIFT_LABEL_TIME_PATTERN.exec(label);
  if (match === null) return { startTime: "", endTime: "" };
  const [, sh, sm, eh, em] = match;
  const pad = (s: string | undefined, def: string): string =>
    (s ?? def).padStart(2, "0");
  return {
    startTime: `${pad(sh, "00")}:${pad(sm, "00")}`,
    endTime: `${pad(eh, "00")}:${pad(em, "00")}`,
  };
};

type EditingShiftState =
  | { mode: "edit"; driverId: string; dateIndex: number; chipId: string }
  | { mode: "create"; driverId: string; dateIndex: number };

type EditingShiftContext = {
  mode: "edit" | "create";
  driverName: string;
  date: Date;
  initialValue: ShiftEditValue;
};

const EMPTY_SHIFT_VALUE: ShiftEditValue = {
  startTime: "",
  endTime: "",
  projectId: "",
  vehicleId: "",
  note: "",
};

const buildEditInitial = (
  driver: DriverMonthRow,
  dateIndex: number,
  chipId: string,
): ShiftEditValue | null => {
  const cell = driver.cells[dateIndex];
  if (cell === undefined) return null;
  const chip = cell.shifts.find((c) => c.id === chipId);
  if (chip === undefined) return null;
  const { startTime, endTime } = parseShiftLabel(chip.label);
  return {
    startTime,
    endTime,
    projectId: PROJECT_ID_BY_LABEL[chip.project] ?? "",
    vehicleId: "",
    note: "",
  };
};

const buildEditingContext = (
  state: EditingShiftState | null,
  rows: ReadonlyArray<DriverMonthRow>,
  dates: ReadonlyArray<Date>,
): EditingShiftContext | null => {
  if (state === null) return null;
  const driver = rows.find((d) => d.driverId === state.driverId);
  const date = dates[state.dateIndex];
  if (driver === undefined || date === undefined) return null;
  const initialValue =
    state.mode === "edit"
      ? buildEditInitial(driver, state.dateIndex, state.chipId)
      : EMPTY_SHIFT_VALUE;
  if (initialValue === null) return null;
  return {
    mode: state.mode,
    driverName: driver.name,
    date,
    initialValue,
  };
};

const MonthNav = ({
  monthRangeLabel,
  onPrevMonth,
  onNextMonth,
  onJumpToCurrent,
  isAtMaxMonth,
}: {
  monthRangeLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToCurrent: () => void;
  isAtMaxMonth: boolean;
}) => (
  <div className="bg-white border-y border-[#e8ebe6] w-full">
    <div className="max-w-[765px] mx-auto flex items-center justify-between px-4 py-2.5">
      <button
        type="button"
        onClick={onPrevMonth}
        aria-label="前月"
        className="flex gap-1.5 items-center pl-1 pr-2 py-1 cursor-pointer hover:opacity-70 transition-opacity"
      >
        <span className="text-[20px] font-normal text-[#0e0f0c] leading-[normal]">
          ‹
        </span>
        <span className="text-[12px] font-medium text-[#868685] leading-[normal]">
          前月
        </span>
      </button>

      <p className="text-[15px] font-bold text-[#0e0f0c] leading-[normal] whitespace-nowrap">
        {monthRangeLabel}
      </p>

      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={onJumpToCurrent}
          className="bg-[#e2f6d5] rounded-full px-4 py-2 text-[13px] font-semibold text-[#163300] cursor-pointer hover:bg-[#d4ebc6] transition-colors leading-[normal]"
        >
          今日
        </button>
        <button
          type="button"
          onClick={onNextMonth}
          disabled={isAtMaxMonth}
          aria-label="翌月"
          className="flex gap-1.5 items-center pl-2 pr-1 py-1 cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:opacity-30"
        >
          <span className="text-[12px] font-medium text-[#868685] leading-[normal]">
            翌月
          </span>
          <span className="text-[20px] font-normal text-[#0e0f0c] leading-[normal]">
            ›
          </span>
        </button>
      </div>
    </div>
  </div>
);

const Toolbar = ({
  filterCount,
  onFilterClick,
  onActionClick,
}: {
  filterCount: number;
  onFilterClick: () => void;
  onActionClick: () => void;
}) => (
  <div className="bg-white border-b border-[#e8ebe6] w-full leading-[normal]">
    <div className="max-w-[765px] mx-auto flex gap-2 items-center px-4 py-2.5">
      <button
        type="button"
        onClick={onFilterClick}
        className="flex-1 bg-white border border-[#e8ebe6] rounded-full flex gap-2 items-center px-4 py-3 cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        <span className="text-[14px] text-black">🔍</span>
        <span className="flex-1 text-left text-[14px] font-medium text-[#868685]">
          絞り込み
        </span>
        {filterCount > 0 ? (
          <span className="bg-[#9fe870] rounded-full px-2 py-0.5 text-[12px] font-semibold text-[#0e0f0c]">
            {filterCount}
          </span>
        ) : null}
      </button>
      <button
        type="button"
        onClick={onActionClick}
        className="bg-white border border-[#e8ebe6] rounded-full flex gap-1.5 items-center px-3.5 py-3 cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        <span className="text-[13px] font-normal text-[#0e0f0c]">⋯</span>
        <span className="text-[13px] font-semibold text-[#0e0f0c]">操作</span>
      </button>
    </div>
  </div>
);

export const ShiftsPage = () => {
  const { openDrawer } = useAdminShell();
  const today = new Date();
  const [month, setMonth] = useState<Date>(() => startOfMonth(today));

  const gridRef = useRef<MonthShiftGridHandle>(null);
  const pendingScrollRef = useRef(false);

  const maxMonth = startOfMonth(addMonths(today, MAX_MONTHS_AHEAD));
  const monthDates = buildMonthDates(month);
  const monthRangeLabel = formatMonthRange(month);
  const isCurrent = isSameMonth(month, today);
  const isAtMaxMonth = isSameMonth(month, maxMonth);
  const todayDateString = format(today, ISO);

  const drivers = MOCK_DRIVER_PATTERNS.map((p) =>
    isCurrent
      ? buildMonthRow(p, monthDates)
      : buildEmptyMonthRow(p, monthDates),
  );

  useEffect(() => {
    if (pendingScrollRef.current && isCurrent) {
      gridRef.current?.scrollToToday();
      pendingScrollRef.current = false;
    }
  }, [month, isCurrent]);

  const handlePrevMonth = () => setMonth(subMonths(month, 1));
  const handleNextMonth = () => {
    if (isAtMaxMonth) return;
    setMonth(addMonths(month, 1));
  };
  const handleJumpToCurrent = () => {
    if (isCurrent) {
      gridRef.current?.scrollToToday();
      return;
    }
    pendingScrollRef.current = true;
    setMonth(startOfMonth(today));
  };

  const [filter, setFilter] = useState<ShiftsFilterValue>(
    DEFAULT_SHIFTS_FILTER,
  );
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const filterCount = countActiveShiftsFilters(filter);
  const actionMonthLabel = format(month, "yyyy年M月");

  const handleFilterClick = () => setFilterSheetOpen(true);
  const handleFilterClose = () => setFilterSheetOpen(false);
  const handleFilterApply = (next: ShiftsFilterValue) => {
    setFilter(next);
    setFilterSheetOpen(false);
  };

  const handleActionClick = () => setActionSheetOpen(true);
  const handleActionClose = () => setActionSheetOpen(false);
  const handleCsvImport = () => {
    // TODO: CSV取込
    console.log("csv import", actionMonthLabel);
    setActionSheetOpen(false);
  };
  const handleCsvExport = () => {
    // TODO: CSV出力
    console.log("csv export", actionMonthLabel);
    setActionSheetOpen(false);
  };
  const handleCopyShift = () => {
    setActionSheetOpen(false);
    window.setTimeout(() => setCopySheetOpen(true), 220);
  };

  const [copySheetOpen, setCopySheetOpen] = useState(false);
  const handleCopyClose = () => setCopySheetOpen(false);
  const handleCopySave = (next: ShiftCopyValue) => {
    // TODO: シフトコピー API
    console.log("copy shift", next);
    setCopySheetOpen(false);
  };

  const [editingShift, setEditingShift] = useState<EditingShiftState | null>(
    null,
  );
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const editingContext = buildEditingContext(editingShift, drivers, monthDates);
  const editSheetTitle =
    editingContext?.mode === "create" ? "シフトを新規作成" : "シフトを編集";

  const handleChipClick = (
    driverId: string,
    dateIndex: number,
    chipId: string,
  ) => {
    setEditingShift({ mode: "edit", driverId, dateIndex, chipId });
    setEditSheetOpen(true);
  };
  const handleCellClick = (driverId: string, dateIndex: number) => {
    setEditingShift({ mode: "create", driverId, dateIndex });
    setEditSheetOpen(true);
  };
  const handleEditClose = () => setEditSheetOpen(false);
  const handleEditSave = (next: ShiftEditValue) => {
    // TODO: シフト更新 / 新規作成 API
    console.log("save shift", editingShift, next);
    setEditSheetOpen(false);
  };
  const handleEditDelete = () => {
    // TODO: シフト削除 API
    console.log("delete shift", editingShift);
    setEditSheetOpen(false);
  };

  return (
    <div className="bg-[#f7f7f5] flex flex-col min-h-screen w-full">
      <AdminAppBar
        title="シフト管理"
        notificationCount={3}
        userInitial="佐"
        onMenuClick={openDrawer}
      />

      <div className="flex flex-col w-full">
        <MonthNav
          monthRangeLabel={monthRangeLabel}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onJumpToCurrent={handleJumpToCurrent}
          isAtMaxMonth={isAtMaxMonth}
        />
        <Toolbar
          filterCount={filterCount}
          onFilterClick={handleFilterClick}
          onActionClick={handleActionClick}
        />
        <MonthShiftGrid
          ref={gridRef}
          monthDates={monthDates}
          todayDateString={todayDateString}
          drivers={drivers}
          onChipClick={handleChipClick}
          onCellClick={handleCellClick}
        />
      </div>

      <BottomSheet
        open={filterSheetOpen}
        onClose={handleFilterClose}
        title="絞り込み"
      >
        <ShiftsFilterSheet initialValue={filter} onApply={handleFilterApply} />
      </BottomSheet>

      <BottomSheet
        open={actionSheetOpen}
        onClose={handleActionClose}
        title="シフト操作"
      >
        <ShiftsActionSheet
          monthLabel={actionMonthLabel}
          onCsvImport={handleCsvImport}
          onCsvExport={handleCsvExport}
          onCopyShift={handleCopyShift}
        />
      </BottomSheet>

      <BottomSheet
        open={editSheetOpen}
        onClose={handleEditClose}
        title={editSheetTitle}
      >
        {editingContext !== null && editingShift !== null ? (
          <ShiftEditSheet
            key={
              editingShift.mode === "edit"
                ? `edit-${editingShift.driverId}-${editingShift.dateIndex}-${editingShift.chipId}`
                : `create-${editingShift.driverId}-${editingShift.dateIndex}`
            }
            driverName={editingContext.driverName}
            date={editingContext.date}
            initialValue={editingContext.initialValue}
            onCancel={handleEditClose}
            onSave={handleEditSave}
            onDelete={
              editingContext.mode === "edit" ? handleEditDelete : undefined
            }
          />
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={copySheetOpen}
        onClose={handleCopyClose}
        title="シフトコピー"
      >
        <ShiftCopySheet
          referenceMonth={month}
          drivers={MOCK_DRIVER_PATTERNS.map((p) => ({
            id: p.driverId,
            name: p.name,
          }))}
          onCancel={handleCopyClose}
          onSave={handleCopySave}
        />
      </BottomSheet>
    </div>
  );
};
