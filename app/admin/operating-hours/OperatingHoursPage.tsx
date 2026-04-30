"use client";

import {
  addMonths,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ja } from "date-fns/locale";
import { useMemo, useState } from "react";

import { AdminAppBar } from "@/components/layout/AdminAppBar";
import { useAdminShell } from "@/components/layout/NavigationDrawer";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { SearchResultCount } from "@/components/ui/SearchResultCount";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { DriverHoursCard } from "@/features/operating-hours/components/DriverHoursCard";
import { OperatingHoursActionSheet } from "@/features/operating-hours/components/OperatingHoursActionSheet";
import { OperatingHoursFilterSheet } from "@/features/operating-hours/components/OperatingHoursFilterSheet";
import {
  calcRemainingHours,
  countActiveOperatingHoursFilters,
  DEFAULT_OPERATING_HOURS_FILTER,
  resolveOperatingHoursStatus,
  type DriverOperatingHoursEntry,
  type OperatingHoursFilterValue,
  type OperatingHoursStatus,
  type OperatingHoursStatusFilter,
} from "@/features/operating-hours/types";

const INITIAL_MONTH = startOfMonth(new Date(2026, 3, 1));

const MOCK_DRIVERS: ReadonlyArray<DriverOperatingHoursEntry> = [
  {
    id: "1",
    driverName: "山田 太郎",
    affiliation: "個人",
    affiliationId: "personal",
    totalHours: 295.5,
  },
  {
    id: "2",
    driverName: "田中 一郎",
    affiliation: "個人",
    affiliationId: "personal",
    totalHours: 280.0,
  },
  {
    id: "3",
    driverName: "佐藤 次郎",
    affiliation: "ABC運送",
    affiliationId: "abc",
    totalHours: 245.2,
  },
  {
    id: "4",
    driverName: "斎藤 三郎",
    affiliation: "ABC運送",
    affiliationId: "abc",
    totalHours: 220.0,
  },
  {
    id: "5",
    driverName: "藤井 健一",
    affiliation: "ABC運送",
    affiliationId: "abc",
    totalHours: 277.5,
  },
  {
    id: "6",
    driverName: "山形 洋介",
    affiliation: "東北運送",
    affiliationId: "tohoku",
    totalHours: 162.4,
  },
];

type SummaryStats = {
  counts: Record<OperatingHoursStatus, number>;
  average: number;
};

const computeSummary = (
  drivers: ReadonlyArray<DriverOperatingHoursEntry>,
): SummaryStats => {
  const counts: Record<OperatingHoursStatus, number> = {
    exceeded: 0,
    warning: 0,
    normal: 0,
  };
  let sum = 0;
  drivers.forEach((d) => {
    counts[resolveOperatingHoursStatus(d.totalHours)] += 1;
    sum += d.totalHours;
  });
  const average = drivers.length === 0 ? 0 : sum / drivers.length;
  return { counts, average };
};

const parseRangeNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num)) return null;
  return num;
};

type FilterPredicate = (
  driver: DriverOperatingHoursEntry,
  filter: OperatingHoursFilterValue,
) => boolean;

const passesStatus: FilterPredicate = (d, f) => {
  if (f.status.length === 0) return true;
  return f.status.includes(resolveOperatingHoursStatus(d.totalHours));
};

const passesDriverName: FilterPredicate = (d, f) => {
  const q = f.driverName.trim();
  return q === "" || d.driverName.includes(q);
};

const passesAffiliation: FilterPredicate = (d, f) =>
  f.affiliationId === "" || d.affiliationId === f.affiliationId;

const passesTotalRange: FilterPredicate = (d, f) => {
  const min = parseRangeNumber(f.totalHoursMin);
  const max = parseRangeNumber(f.totalHoursMax);
  if (min !== null && d.totalHours < min) return false;
  if (max !== null && d.totalHours > max) return false;
  return true;
};

const passesRemainingRange: FilterPredicate = (d, f) => {
  const remaining = calcRemainingHours(d.totalHours);
  const min = parseRangeNumber(f.remainingHoursMin);
  const max = parseRangeNumber(f.remainingHoursMax);
  if (min !== null && remaining < min) return false;
  if (max !== null && remaining > max) return false;
  return true;
};

const FILTER_PREDICATES: ReadonlyArray<FilterPredicate> = [
  passesStatus,
  passesDriverName,
  passesAffiliation,
  passesTotalRange,
  passesRemainingRange,
];

const matchesFilter = (
  driver: DriverOperatingHoursEntry,
  filter: OperatingHoursFilterValue,
): boolean => FILTER_PREDICATES.every((p) => p(driver, filter));

const MonthNav = ({
  month,
  onChange,
  onJumpToCurrent,
  isCurrent,
}: {
  month: Date;
  onChange: (next: Date) => void;
  onJumpToCurrent: () => void;
  isCurrent: boolean;
}) => (
  <div className="bg-white border-y border-[#e8ebe6] w-full">
    <div className="max-w-[765px] mx-auto flex items-center justify-between px-4 py-2.5">
      <button
        type="button"
        onClick={() => onChange(subMonths(month, 1))}
        aria-label="前月"
        className="bg-[#f7f7f5] w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-[#0e0f0c] cursor-pointer hover:bg-[#e8ebe6] transition-colors"
      >
        ◀
      </button>
      <div className="flex-1 flex flex-col items-center gap-0.5 leading-[normal] whitespace-nowrap">
        <p className="text-[15px] font-bold text-[#0e0f0c]">
          {format(month, "yyyy年 M月", { locale: ja })}度
        </p>
        <p className="text-[11px] font-normal text-[#868685]">
          {format(startOfMonth(month), "M/d")} –{" "}
          {format(endOfMonth(month), "M/d")}
        </p>
      </div>
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={onJumpToCurrent}
          disabled={isCurrent}
          className="bg-[#e2f6d5] h-10 px-2 rounded-full flex items-center justify-center w-[66px] text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#d4ebc6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          今月
        </button>
        <button
          type="button"
          onClick={() => onChange(addMonths(month, 1))}
          aria-label="翌月"
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
          <span className="bg-[#9fe870] rounded-full px-2 py-0.5 text-[11px] font-bold text-[#163300]">
            {filterCount}
          </span>
        ) : null}
      </button>
      <button
        type="button"
        onClick={onActionClick}
        className="bg-white border border-[#e8ebe6] rounded-full flex items-center px-3.5 py-3 cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        <span className="text-[13px] font-semibold text-[#0e0f0c] whitespace-pre">{`⋯  操作`}</span>
      </button>
    </div>
  </div>
);

export const OperatingHoursPage = () => {
  const { openDrawer } = useAdminShell();
  const [month, setMonth] = useState(INITIAL_MONTH);
  const [filter, setFilter] = useState<OperatingHoursFilterValue>(
    DEFAULT_OPERATING_HOURS_FILTER,
  );
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);

  const isCurrent = isSameMonth(month, new Date());
  const filterCount = countActiveOperatingHoursFilters(filter);

  const filteredDrivers = useMemo(
    () => MOCK_DRIVERS.filter((d) => matchesFilter(d, filter)),
    [filter],
  );

  const summary = useMemo(
    () => computeSummary(filteredDrivers),
    [filteredDrivers],
  );

  const handleJumpToCurrent = () => {
    setMonth(startOfMonth(new Date()));
  };

  const handleSummaryClick = (status: OperatingHoursStatusFilter) => {
    setFilter((prev) => ({ ...prev, status: [status] }));
  };

  const handleExportRow = (driverId: string) => {
    // TODO: ドライバー個別の CSV 出力
    console.log("export csv", driverId);
  };

  return (
    <div className="bg-[#f7f7f5] flex flex-col min-h-screen w-full">
      <AdminAppBar
        title="月間運行時間"
        notificationCount={3}
        userInitial="佐"
        onMenuClick={openDrawer}
      />

      <div className="flex flex-col gap-4 pt-4 pb-4 w-full">
        <div className="w-full max-w-[765px] mx-auto px-4">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 w-full">
              <SummaryCard
                icon="🟥"
                label="法定超過"
                value={summary.counts.exceeded}
                valueColor="text-[#e23b4a]"
                onClick={() => handleSummaryClick("exceeded")}
                ariaLabel="法定超過のドライバーで絞り込む"
              />
              <SummaryCard
                icon="⚠"
                label="警告ライン"
                value={summary.counts.warning}
                valueColor="text-[#ec7e00]"
                onClick={() => handleSummaryClick("warning")}
                ariaLabel="警告ラインのドライバーで絞り込む"
              />
            </div>
            <div className="flex gap-2 w-full">
              <SummaryCard
                icon="🟢"
                label="正常"
                value={summary.counts.normal}
                valueColor="text-[#163300]"
                onClick={() => handleSummaryClick("normal")}
                ariaLabel="正常のドライバーで絞り込む"
              />
              <SummaryCard
                icon="⏱"
                label="平均拘束時間"
                value={`${summary.average.toFixed(1)}h`}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <MonthNav
            month={month}
            onChange={setMonth}
            onJumpToCurrent={handleJumpToCurrent}
            isCurrent={isCurrent}
          />
          <Toolbar
            filterCount={filterCount}
            onFilterClick={() => setFilterSheetOpen(true)}
            onActionClick={() => setActionSheetOpen(true)}
          />
        </div>

        <div className="w-full max-w-[765px] mx-auto px-4 flex flex-col gap-3">
          <SearchResultCount count={filteredDrivers.length} />
          <div className="flex flex-col gap-3 w-full">
            {filteredDrivers.length === 0 ? (
              <div className="bg-white rounded-2xl flex items-center justify-center px-4 py-10 w-full">
                <p className="text-[14px] text-[#868685]">
                  該当するドライバーがいません
                </p>
              </div>
            ) : (
              filteredDrivers.map((driver) => (
                <DriverHoursCard
                  key={driver.id}
                  driverName={driver.driverName}
                  affiliation={driver.affiliation}
                  totalHours={driver.totalHours}
                  onExportReport={() => handleExportRow(driver.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <BottomSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="絞り込み"
      >
        <OperatingHoursFilterSheet
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
        title="月間運行時間操作"
      >
        <OperatingHoursActionSheet
          onCsvExport={() => {
            // TODO: 一括 CSV 出力
            console.log("export csv (bulk)");
            setActionSheetOpen(false);
          }}
        />
      </BottomSheet>
    </div>
  );
};
