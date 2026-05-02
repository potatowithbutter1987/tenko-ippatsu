"use client";

import { useState } from "react";

import { ActionRow } from "@/app/admin/settings/ActionRow";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { VehicleActionSheet } from "@/features/vehicle/components/VehicleActionSheet";
import {
  VehicleCard,
  type OwnershipType,
  type VehicleStatus,
} from "@/features/vehicle/components/VehicleCard";
import {
  VehicleEditSheet,
  type VehicleEditValue,
} from "@/features/vehicle/components/VehicleEditSheet";

type VehicleEntry = {
  id: string;
  plateNumber: string;
  vehicleName: string;
  status: VehicleStatus;
  ownershipType: OwnershipType;
  companyId: string;
  companyName: string | null;
  userId: string;
  userName: string;
  inspectionExpiry: string;
};

const MOCK_COMPANIES: ReadonlyArray<{ id: string; name: string }> = [
  { id: "homy", name: "HOMY EXPRESS" },
  { id: "self", name: "自社" },
  { id: "abc", name: "ABC運送" },
  { id: "tohoku", name: "東北運送" },
  { id: "b-unsou", name: "B運送" },
];

const MOCK_USERS: ReadonlyArray<{ id: string; name: string }> = [
  { id: "sato", name: "佐藤 次郎" },
  { id: "suzuki", name: "鈴木 一郎" },
  { id: "yamada", name: "山田 花子" },
  { id: "takahashi", name: "高橋 健太" },
  { id: "tanaka", name: "田中 四郎" },
];

const MOCK_VEHICLES: ReadonlyArray<VehicleEntry> = [
  {
    id: "v1",
    plateNumber: "足立 400 あ 1234",
    vehicleName: "1号車",
    status: "active",
    ownershipType: "personal",
    companyId: "",
    companyName: null,
    userId: "sato",
    userName: "佐藤 次郎",
    inspectionExpiry: "2027/03/15",
  },
  {
    id: "v2",
    plateNumber: "品川 500 わ 9999",
    vehicleName: "2号車",
    status: "active",
    ownershipType: "company",
    companyId: "b-unsou",
    companyName: "B運送",
    userId: "suzuki",
    userName: "鈴木 一郎",
    inspectionExpiry: "2026/11/20",
  },
  {
    id: "v3",
    plateNumber: "練馬 480 き 5678",
    vehicleName: "マイカー",
    status: "active",
    ownershipType: "personal",
    companyId: "",
    companyName: null,
    userId: "yamada",
    userName: "山田 花子",
    inspectionExpiry: "2027/01/10",
  },
  {
    id: "v4",
    plateNumber: "足立 400 あ 5555",
    vehicleName: "3号車",
    status: "stopped",
    ownershipType: "personal",
    companyId: "",
    companyName: null,
    userId: "takahashi",
    userName: "高橋 健太",
    inspectionExpiry: "2026/08/01",
  },
];

const toIsoDate = (slashDate: string): string => slashDate.replaceAll("/", "-");

const buildEditInitial = (v: VehicleEntry): VehicleEditValue => ({
  plateNumber: v.plateNumber,
  name: v.vehicleName,
  ownershipType: v.ownershipType,
  companyId: v.companyId,
  userId: v.userId,
  status: v.status,
  inspectionExpiry: toIsoDate(v.inspectionExpiry),
});

const buildCreateInitial = (): VehicleEditValue => ({
  plateNumber: "",
  name: "",
  ownershipType: "personal",
  companyId: "",
  userId: "",
  status: "active",
  inspectionExpiry: "",
});

type VehicleSheetState =
  | { mode: "edit"; vehicleId: string }
  | { mode: "create" };

const findEditingVehicle = (
  state: VehicleSheetState | null,
): VehicleEntry | null => {
  if (state === null || state.mode !== "edit") return null;
  return MOCK_VEHICLES.find((v) => v.id === state.vehicleId) ?? null;
};

const resolveSheetTitle = (state: VehicleSheetState | null): string =>
  state?.mode === "create" ? "車両新規登録" : "車両編集";

const resolveSheetKey = (state: VehicleSheetState | null): string => {
  if (state === null) return "";
  if (state.mode === "create") return "create";
  return `edit-${state.vehicleId}`;
};

const resolveSheetInitial = (
  state: VehicleSheetState | null,
  editingVehicle: VehicleEntry | null,
): VehicleEditValue | null => {
  if (state === null) return null;
  if (state.mode === "create") return buildCreateInitial();
  if (editingVehicle === null) return null;
  return buildEditInitial(editingVehicle);
};

export const VehiclesSection = () => {
  const [sheetState, setSheetState] = useState<VehicleSheetState | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const editingVehicle = findEditingVehicle(sheetState);
  const sheetTitle = resolveSheetTitle(sheetState);
  const sheetInitial = resolveSheetInitial(sheetState, editingVehicle);
  const sheetKey = resolveSheetKey(sheetState);

  const handleVehicleClick = (id: string) => {
    setSheetState({ mode: "edit", vehicleId: id });
    setSheetOpen(true);
  };
  const handleAddVehicle = () => {
    setSheetState({ mode: "create" });
    setSheetOpen(true);
  };
  const handleSheetClose = () => setSheetOpen(false);
  const handleSheetSave = (next: VehicleEditValue) => {
    // TODO: 車両作成・更新 API
    console.log("save vehicle", sheetState, next);
    setSheetOpen(false);
  };

  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const handleActionClick = () => setActionSheetOpen(true);
  const handleActionClose = () => setActionSheetOpen(false);
  const handleCsvImport = () => {
    // TODO: CSV登録 API
    console.log("csv import");
    setActionSheetOpen(false);
  };
  const handleCsvExport = () => {
    // TODO: CSV出力 API
    console.log("csv export");
    setActionSheetOpen(false);
  };

  return (
    <>
      <ActionRow
        primaryLabel="＋ 車両追加"
        onPrimaryClick={handleAddVehicle}
        onActionClick={handleActionClick}
      />

      <div className="w-full max-w-[765px] mx-auto flex flex-col gap-3 px-4 py-4">
        {MOCK_VEHICLES.map((v) => (
          <VehicleCard
            key={v.id}
            plateNumber={v.plateNumber}
            vehicleName={v.vehicleName}
            status={v.status}
            ownershipType={v.ownershipType}
            companyName={v.companyName}
            userName={v.userName}
            inspectionExpiry={v.inspectionExpiry}
            onClick={() => handleVehicleClick(v.id)}
          />
        ))}
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        title={sheetTitle}
      >
        {sheetState !== null && sheetInitial !== null ? (
          <VehicleEditSheet
            key={sheetKey}
            initialValue={sheetInitial}
            companies={MOCK_COMPANIES}
            users={MOCK_USERS}
            onCancel={handleSheetClose}
            onSave={handleSheetSave}
          />
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={actionSheetOpen}
        onClose={handleActionClose}
        title="車両操作"
      >
        <VehicleActionSheet
          onCsvImport={handleCsvImport}
          onCsvExport={handleCsvExport}
        />
      </BottomSheet>
    </>
  );
};
