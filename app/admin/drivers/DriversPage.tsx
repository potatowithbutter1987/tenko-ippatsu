"use client";

import { useMemo, useState } from "react";

import { AdminAppBar } from "@/components/layout/AdminAppBar";
import { useAdminShell } from "@/components/layout/NavigationDrawer";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { SearchResultCount } from "@/components/ui/SearchResultCount";
import {
  AffiliationChangeSheet,
  type AffiliationChangeValue,
} from "@/features/driver/components/AffiliationChangeSheet";
import {
  DriverEditSheet,
  type DriverEditValue,
} from "@/features/driver/components/DriverEditSheet";
import {
  DriverManagementCard,
  type DriverManagementStatus,
} from "@/features/driver/components/DriverManagementCard";
import {
  countActiveDriversFilters,
  DEFAULT_DRIVERS_FILTER,
  DriversFilterSheet,
  type DriversFilterValue,
} from "@/features/driver/components/DriversFilterSheet";

type DriverEntry = {
  id: string;
  status: DriverManagementStatus;
  driverName: string;
  age: number;
  affiliation: string;
  affiliationId: string;
  affiliationTier: string;
  affiliationSinceDate: string;
  registeredDate: string;
  role: string;
  roleId: string;
  vehicle: string;
  vehicleId: string;
  project: string;
  projectId: string;
  phone: string;
  email: string;
};

const MOCK_DRIVERS: ReadonlyArray<DriverEntry> = [
  {
    id: "1",
    status: "active",
    driverName: "佐藤 次郎",
    age: 34,
    affiliation: "個人",
    affiliationId: "personal",
    affiliationTier: "3次",
    affiliationSinceDate: "2025-04-01",
    registeredDate: "2026/04/01",
    role: "ドライバ",
    roleId: "driver",
    vehicle: "足立 400 あ 1234",
    vehicleId: "vehicle-1",
    project: "Amazon 品川",
    projectId: "amazon",
    phone: "090-1111-xxxx",
    email: "sato.jiro@example.com",
  },
  {
    id: "2",
    status: "pending",
    driverName: "鈴木 三郎",
    age: 28,
    affiliation: "B運送",
    affiliationId: "b-unsou",
    affiliationTier: "2次",
    affiliationSinceDate: "2026-04-15",
    registeredDate: "2026/04/15",
    role: "管理者",
    roleId: "admin",
    vehicle: "品川 500 わ 9999",
    vehicleId: "vehicle-2",
    project: "ヤマト 江東",
    projectId: "yamato",
    phone: "080-3333-xxxx",
    email: "suzuki.saburo@example.com",
  },
  {
    id: "3",
    status: "active",
    driverName: "田中 四郎",
    age: 45,
    affiliation: "自社",
    affiliationId: "self",
    affiliationTier: "1次",
    affiliationSinceDate: "2024-10-01",
    registeredDate: "2024/10/01",
    role: "全体管理者",
    roleId: "super_admin",
    vehicle: "—",
    vehicleId: "",
    project: "—",
    projectId: "",
    phone: "03-1234-xxxx",
    email: "tanaka.shiro@example.com",
  },
  {
    id: "4",
    status: "retired",
    driverName: "高橋 健太",
    age: 31,
    affiliation: "個人",
    affiliationId: "personal",
    affiliationTier: "3次",
    affiliationSinceDate: "2025-08-10",
    registeredDate: "2025/08/10",
    role: "ドライバ",
    roleId: "driver",
    vehicle: "足立 400 あ 5555",
    vehicleId: "vehicle-3",
    project: "Amazon 品川",
    projectId: "amazon",
    phone: "090-9999-xxxx",
    email: "takahashi.kenta@example.com",
  },
];

type DriverPredicate = (
  driver: DriverEntry,
  filter: DriversFilterValue,
) => boolean;

const passesName: DriverPredicate = (d, f) => {
  const q = f.driverName.trim();
  return q === "" || d.driverName.includes(q);
};

const passesStatus: DriverPredicate = (d, f) =>
  f.status.length === 0 || f.status.includes(d.status);

const passesAffiliation: DriverPredicate = (d, f) =>
  f.affiliationId === "" || d.affiliationId === f.affiliationId;

const passesProject: DriverPredicate = (d, f) =>
  f.projectId === "" || d.projectId === f.projectId;

const passesRole: DriverPredicate = (d, f) =>
  f.role === "" || d.roleId === f.role;

const parseAge = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || !Number.isInteger(num)) return null;
  return num;
};

const passesAge: DriverPredicate = (d, f) => {
  const min = parseAge(f.ageMin);
  const max = parseAge(f.ageMax);
  if (min !== null && d.age < min) return false;
  if (max !== null && d.age > max) return false;
  return true;
};

const DRIVER_PREDICATES: ReadonlyArray<DriverPredicate> = [
  passesName,
  passesStatus,
  passesAffiliation,
  passesProject,
  passesRole,
  passesAge,
];

const matchesFilter = (
  driver: DriverEntry,
  filter: DriversFilterValue,
): boolean => DRIVER_PREDICATES.every((p) => p(driver, filter));

const Toolbar = ({
  filterCount,
  onFilterClick,
}: {
  filterCount: number;
  onFilterClick: () => void;
}) => (
  <div className="bg-white w-full leading-[normal]">
    <div className="max-w-[765px] mx-auto flex items-center px-4 py-2.5">
      <button
        type="button"
        onClick={onFilterClick}
        className="flex-1 bg-white border border-[#e8ebe6] rounded-full flex gap-2 items-center px-4 py-3.5 cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        <span className="text-[14px] text-black">🔍</span>
        <span className="flex-1 text-left text-[14px] font-normal text-[#868685]">
          絞り込み
        </span>
        {filterCount > 0 ? (
          <span className="bg-[#9fe870] rounded-full px-2 py-0.5 text-[11px] font-bold text-[#163300]">
            {filterCount}
          </span>
        ) : null}
      </button>
    </div>
  </div>
);

type EditingSheetsProps = {
  driver: DriverEntry | null;
  editOpen: boolean;
  affiliationChangeOpen: boolean;
  onEditClose: () => void;
  onSaveEdit: (value: DriverEditValue) => void;
  onChangeAffiliation: () => void;
  onAffiliationChangeCancel: () => void;
  onAffiliationChangeSave: (value: AffiliationChangeValue) => void;
};

const EditingSheets = ({
  driver,
  editOpen,
  affiliationChangeOpen,
  onEditClose,
  onSaveEdit,
  onChangeAffiliation,
  onAffiliationChangeCancel,
  onAffiliationChangeSave,
}: EditingSheetsProps) => (
  <>
    <BottomSheet open={editOpen} onClose={onEditClose} title="ドライバー編集">
      {driver !== null ? (
        <DriverEditSheet
          key={driver.id}
          registeredDate={driver.registeredDate}
          affiliation={`${driver.affiliation} (${driver.affiliationTier})`}
          affiliationSinceDate={driver.affiliationSinceDate}
          initialValue={{
            name: driver.driverName,
            vehicleId: driver.vehicleId,
            projectId: driver.projectId,
            phone: driver.phone,
            email: driver.email,
            active: driver.status === "active",
          }}
          onCancel={onEditClose}
          onSave={onSaveEdit}
          onChangeAffiliation={onChangeAffiliation}
        />
      ) : null}
    </BottomSheet>

    <BottomSheet
      open={affiliationChangeOpen}
      onClose={onAffiliationChangeCancel}
      title="所属変更"
    >
      {driver !== null ? (
        <AffiliationChangeSheet
          key={`${driver.id}-affiliation`}
          driverName={driver.driverName}
          currentAffiliation={`${driver.affiliation} (${driver.affiliationTier})`}
          currentAffiliationSinceDate={driver.affiliationSinceDate}
          onCancel={onAffiliationChangeCancel}
          onSave={onAffiliationChangeSave}
        />
      ) : null}
    </BottomSheet>
  </>
);

export const DriversPage = () => {
  const { openDrawer } = useAdminShell();
  const [filter, setFilter] = useState<DriversFilterValue>(
    DEFAULT_DRIVERS_FILTER,
  );
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [affiliationChangeOpen, setAffiliationChangeOpen] = useState(false);

  const filterCount = countActiveDriversFilters(filter);

  const filteredDrivers = useMemo(
    () => MOCK_DRIVERS.filter((d) => matchesFilter(d, filter)),
    [filter],
  );

  const handleCopyInvite = () => {
    // TODO: 招待リンク生成 + クリップボードコピー
    if (typeof navigator !== "undefined" && navigator.clipboard !== undefined) {
      void navigator.clipboard.writeText("https://example.com/invite/xxx");
    }
    setInviteCopied(true);
    window.setTimeout(() => setInviteCopied(false), 2000);
  };

  const editingDriver =
    editingDriverId === null
      ? null
      : (MOCK_DRIVERS.find((d) => d.id === editingDriverId) ?? null);

  const handleEdit = (id: string) => {
    setEditingDriverId(id);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleSaveEdit = (next: DriverEditValue) => {
    if (editingDriverId === null) return;
    // TODO: ドライバー更新 API
    console.log("save driver", editingDriverId, next);
    setEditOpen(false);
  };

  const handleChangeAffiliation = () => {
    if (editingDriverId === null) return;
    setEditOpen(false);
    window.setTimeout(() => setAffiliationChangeOpen(true), 220);
  };

  const handleAffiliationChangeCancel = () => {
    setAffiliationChangeOpen(false);
    window.setTimeout(() => setEditOpen(true), 220);
  };

  const handleAffiliationChangeSave = (next: AffiliationChangeValue) => {
    if (editingDriverId === null) return;
    // TODO: 所属変更 API（spec §5.6 履歴管理: driver_company_assignments の valid_to を変更日に閉じる + 新行を INSERT）
    console.log("save affiliation change", editingDriverId, next);
    setAffiliationChangeOpen(false);
    window.setTimeout(() => setEditOpen(true), 220);
  };

  return (
    <div className="bg-[#f7f7f5] flex flex-col min-h-screen w-full">
      <AdminAppBar
        title="ドライバー設定"
        notificationCount={3}
        userInitial="佐"
        onMenuClick={openDrawer}
      />

      <div className="flex flex-col w-full">
        <div className="w-full max-w-[765px] mx-auto px-4 pt-4 pb-2">
          <button
            type="button"
            onClick={handleCopyInvite}
            className="bg-[#9fe870] rounded-full flex items-center justify-center px-5 py-3.5 w-full text-[14px] font-bold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors leading-[normal]"
          >
            {inviteCopied
              ? "招待リンクをコピーしました"
              : "ドライバー招待リンクをコピー"}
          </button>
        </div>

        <Toolbar
          filterCount={filterCount}
          onFilterClick={() => setFilterSheetOpen(true)}
        />

        <div className="w-full max-w-[765px] mx-auto px-4 pt-2 pb-4 flex flex-col gap-3">
          <SearchResultCount count={filteredDrivers.length} />
          <div className="flex flex-col gap-3 w-full">
            {filteredDrivers.length === 0 ? (
              <div className="bg-white rounded-[14px] flex items-center justify-center px-4 py-10 w-full">
                <p className="text-[14px] text-[#868685]">
                  該当するドライバーがいません
                </p>
              </div>
            ) : (
              filteredDrivers.map((driver) => (
                <DriverManagementCard
                  key={driver.id}
                  status={driver.status}
                  driverName={driver.driverName}
                  age={driver.age}
                  affiliation={driver.affiliation}
                  affiliationTier={driver.affiliationTier}
                  role={driver.role}
                  vehicle={driver.vehicle}
                  project={driver.project}
                  phone={driver.phone}
                  onClick={() => handleEdit(driver.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <EditingSheets
        driver={editingDriver}
        editOpen={editOpen}
        affiliationChangeOpen={affiliationChangeOpen}
        onEditClose={handleEditClose}
        onSaveEdit={handleSaveEdit}
        onChangeAffiliation={handleChangeAffiliation}
        onAffiliationChangeCancel={handleAffiliationChangeCancel}
        onAffiliationChangeSave={handleAffiliationChangeSave}
      />

      <BottomSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="絞り込み"
      >
        <DriversFilterSheet
          initialValue={filter}
          onApply={(next) => {
            setFilter(next);
            setFilterSheetOpen(false);
          }}
        />
      </BottomSheet>
    </div>
  );
};
