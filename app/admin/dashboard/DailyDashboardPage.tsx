"use client";

import { addDays, format, isSameDay, subDays } from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";

import { AdminAppBar } from "@/components/layout/AdminAppBar";
import { useAdminShell } from "@/components/layout/NavigationDrawer";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { DailyActionSheet } from "@/features/tenko/components/DailyActionSheet";
import {
  countActiveDailyFilters,
  DailyFilterSheet,
  DEFAULT_DAILY_FILTER,
  type DailyFilterValue,
} from "@/features/tenko/components/DailyFilterSheet";
import {
  DriverStatusCard,
  type DriverCheckSnapshot,
  type TenkoOverallStatus,
} from "@/features/tenko/components/DriverStatusCard";

type DriverEntry = {
  id: string;
  status: TenkoOverallStatus;
  driverName: string;
  affiliation: string;
  vehicleAffiliation: string;
  beforeCheck: DriverCheckSnapshot;
  afterCheck: DriverCheckSnapshot;
};

const MOCK_SUMMARY = {
  scheduled: 102,
  completed: 96,
  missing: 5,
  warning: 1,
};

const MOCK_DRIVERS: ReadonlyArray<DriverEntry> = [
  {
    id: "1",
    status: "missing",
    driverName: "山田 太郎",
    affiliation: "個人",
    vehicleAffiliation: "日通-品川",
    beforeCheck: { time: null, alcohol: null, health: null },
    afterCheck: { time: null, alcohol: null, health: null },
  },
  {
    id: "2",
    status: "warning",
    driverName: "田中 一郎",
    affiliation: "個人",
    vehicleAffiliation: "日通-品川",
    beforeCheck: { time: "08:00", alcohol: "ok", health: "ng" },
    afterCheck: { time: null, alcohol: null, health: null },
  },
  {
    id: "3",
    status: "completed",
    driverName: "佐藤 次郎",
    affiliation: "ABC運送",
    vehicleAffiliation: "日通-新宿",
    beforeCheck: { time: "08:20", alcohol: "ok", health: "ok" },
    afterCheck: { time: "17:45", alcohol: "ok", health: "ok" },
  },
  {
    id: "4",
    status: "completed",
    driverName: "斎藤 三郎",
    affiliation: "ABC運送",
    vehicleAffiliation: "日通-新宿",
    beforeCheck: { time: "09:20", alcohol: "ok", health: "ok" },
    afterCheck: { time: "18:30", alcohol: "ok", health: "ok" },
  },
  {
    id: "5",
    status: "completed",
    driverName: "藤井 健一",
    affiliation: "ABC運送",
    vehicleAffiliation: "日通-新宿",
    beforeCheck: { time: "10:00", alcohol: "ok", health: "ok" },
    afterCheck: { time: "19:00", alcohol: "ok", health: "ok" },
  },
  {
    id: "6",
    status: "missing",
    driverName: "山形 洋介",
    affiliation: "東北運送",
    vehicleAffiliation: "日通-東北",
    beforeCheck: { time: null, alcohol: null, health: null },
    afterCheck: { time: null, alcohol: null, health: null },
  },
];

const INITIAL_DATE = new Date(2026, 3, 8);

const DateNav = ({
  date,
  onChange,
  onJumpToToday,
  isToday,
}: {
  date: Date;
  onChange: (next: Date) => void;
  onJumpToToday: () => void;
  isToday: boolean;
}) => (
  <div className="bg-white border-y border-[#e8ebe6] w-full">
    <div className="max-w-[765px] mx-auto flex items-center justify-between px-4 py-2.5">
      <button
        type="button"
        onClick={() => onChange(subDays(date, 1))}
        aria-label="前日"
        className="bg-[#f7f7f5] w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-[#0e0f0c] cursor-pointer hover:bg-[#e8ebe6] transition-colors"
      >
        ◀
      </button>
      <div className="flex-1 flex flex-col items-center">
        <p className="text-[16px] font-bold text-[#0e0f0c]">
          {format(date, "yyyy年 M月 d日（E）", { locale: ja })}
        </p>
      </div>
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={onJumpToToday}
          disabled={isToday}
          className="bg-[#e2f6d5] h-10 px-2 rounded-full flex items-center justify-center w-[66px] text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#d4ebc6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          今日
        </button>
        <button
          type="button"
          onClick={() => onChange(addDays(date, 1))}
          aria-label="翌日"
          className="bg-[#f7f7f5] w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-[#0e0f0c] cursor-pointer hover:bg-[#e8ebe6] transition-colors"
        >
          ▶
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
  <div className="bg-white border-b border-[#e8ebe6] w-full">
    <div className="max-w-[765px] mx-auto flex gap-2 items-center px-4 py-2.5">
      <button
        type="button"
        onClick={onFilterClick}
        className="flex-1 bg-white border border-[#e8ebe6] rounded-full flex gap-2 items-center px-4 py-3 cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        <span className="text-[14px]">🔍</span>
        <span className="flex-1 text-left text-[14px] font-medium text-[#868685]">
          絞り込み
        </span>
        {filterCount > 0 ? (
          <span className="bg-[#9fe870] rounded-full px-2 py-0.5 text-[11px] font-bold text-[#163300]">
            {filterCount}
          </span>
        ) : null}
      </button>
      <button
        type="button"
        onClick={onActionClick}
        className="bg-white border border-[#e8ebe6] rounded-full flex gap-1.5 items-center px-3.5 py-3 cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        <span className="text-[13px] text-[#0e0f0c]">⋯</span>
        <span className="text-[13px] font-semibold text-[#0e0f0c]">操作</span>
      </button>
    </div>
  </div>
);

export const DailyDashboardPage = () => {
  const { openDrawer } = useAdminShell();
  const [date, setDate] = useState(INITIAL_DATE);
  const [filter, setFilter] = useState<DailyFilterValue>(DEFAULT_DAILY_FILTER);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const isToday = isSameDay(date, new Date());
  const filterCount = countActiveDailyFilters(filter);

  // TODO: 当日表示のとき 30 秒間隔で自動更新（Figma コメント由来）

  return (
    <div className="bg-[#f7f7f5] flex flex-col min-h-screen w-full">
      <AdminAppBar
        title="日常業務"
        notificationCount={3}
        userInitial="佐"
        onMenuClick={openDrawer}
      />

      <div className="flex flex-col gap-4 pt-4 pb-4 w-full">
        <div className="w-full max-w-[765px] mx-auto px-4">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 w-full">
              <SummaryCard
                icon="🚚"
                label="本日の予定"
                value={MOCK_SUMMARY.scheduled}
              />
              <SummaryCard
                icon="✅"
                label="点呼完了"
                value={MOCK_SUMMARY.completed}
                valueColor="text-[#163300]"
              />
            </div>
            <div className="flex gap-2 w-full">
              <SummaryCard
                icon="🟥"
                label="未点呼"
                value={MOCK_SUMMARY.missing}
                valueColor="text-[#e23b4a]"
              />
              <SummaryCard
                icon="⚠"
                label="要確認"
                value={MOCK_SUMMARY.warning}
                valueColor="text-[#ec7e00]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <DateNav
            date={date}
            onChange={setDate}
            onJumpToToday={() => setDate(new Date())}
            isToday={isToday}
          />
          <Toolbar
            filterCount={filterCount}
            onFilterClick={() => setFilterSheetOpen(true)}
            onActionClick={() => setActionSheetOpen(true)}
          />
        </div>

        <div className="w-full max-w-[765px] mx-auto px-4">
          <div className="flex flex-col gap-3 w-full">
            {MOCK_DRIVERS.map((driver) => (
              <DriverStatusCard
                key={driver.id}
                status={driver.status}
                driverName={driver.driverName}
                affiliation={driver.affiliation}
                vehicleAffiliation={driver.vehicleAffiliation}
                beforeCheck={driver.beforeCheck}
                afterCheck={driver.afterCheck}
                onClick={() => console.log("open driver detail", driver.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="絞り込み"
      >
        <DailyFilterSheet
          initialValue={filter}
          onApply={(next) => {
            setFilter(next);
            setFilterSheetOpen(false);
          }}
        />
      </BottomSheet>

      <BottomSheet
        open={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        title="点呼状況操作"
      >
        <DailyActionSheet
          onCsvExport={() => {
            // TODO: CSV 出力処理
            console.log("export csv");
            setActionSheetOpen(false);
          }}
        />
      </BottomSheet>
    </div>
  );
};
