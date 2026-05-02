"use client";

import { useState } from "react";

import { AdminAppBar } from "@/components/layout/AdminAppBar";
import { useAdminShell } from "@/components/layout/NavigationDrawer";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { PillSegmentedToggle } from "@/components/ui/PillSegmentedToggle";
import { ProjectActionSheet } from "@/features/project/components/ProjectActionSheet";
import {
  ProjectCard,
  type ProjectType,
} from "@/features/project/components/ProjectCard";
import {
  ProjectEditSheet,
  type ProjectEditValue,
} from "@/features/project/components/ProjectEditSheet";

type SettingsTab = "projects" | "companies" | "vehicles" | "admins";

type ProjectEntry = {
  id: string;
  type: ProjectType;
  name: string;
  startTime: string;
  endTime: string;
  pickupLocation: string;
  deliveryLocation: string;
  contact: string;
};

const TABS: ReadonlyArray<{ value: SettingsTab; label: string }> = [
  { value: "projects", label: "案件・現場" },
  { value: "companies", label: "協力会社" },
  { value: "vehicles", label: "車両設定" },
  { value: "admins", label: "管理者" },
];

const MOCK_PROJECTS: ReadonlyArray<ProjectEntry> = [
  {
    id: "p1",
    type: "regular",
    name: "日通-品川",
    startTime: "8:00",
    endTime: "11:00",
    pickupLocation: "品川",
    deliveryLocation: "品川",
    contact: "佐藤",
  },
  {
    id: "p2",
    type: "regular",
    name: "日通-特輸",
    startTime: "6:00",
    endTime: "8:00",
    pickupLocation: "大井",
    deliveryLocation: "大井",
    contact: "田中",
  },
  {
    id: "p3",
    type: "regular",
    name: "日通-鎌倉",
    startTime: "13:00",
    endTime: "22:00",
    pickupLocation: "鎌倉",
    deliveryLocation: "鎌倉",
    contact: "山田",
  },
  {
    id: "p4",
    type: "spot",
    name: "近鉄-名古屋",
    startTime: "6:00",
    endTime: "9:00",
    pickupLocation: "東京",
    deliveryLocation: "浜松",
    contact: "浜松運送",
  },
];

const ActionRow = ({
  primaryLabel,
  onPrimaryClick,
  onActionClick,
}: {
  primaryLabel: string;
  onPrimaryClick: () => void;
  onActionClick: () => void;
}) => (
  <div className="bg-white w-full leading-[normal]">
    <div className="max-w-[765px] mx-auto flex gap-3 items-center px-4 py-2.5 w-full">
      <button
        type="button"
        onClick={onPrimaryClick}
        className="flex-1 bg-[#9fe870] rounded-full px-6 py-3 text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
      >
        {primaryLabel}
      </button>
      <button
        type="button"
        onClick={onActionClick}
        className="bg-white border border-[#e8ebe6] rounded-full flex gap-1.5 items-center px-[18px] py-3 cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        <span className="text-[14px] font-semibold text-[#0e0f0c]">⋯</span>
        <span className="text-[14px] font-semibold text-[#0e0f0c]">操作</span>
      </button>
    </div>
  </div>
);

const PlaceholderTab = ({ label }: { label: string }) => (
  <div className="w-full max-w-[765px] mx-auto px-4 py-12 text-center text-[14px] text-[#868685]">
    {label} は未実装です
  </div>
);

const MOCK_COMPANIES: ReadonlyArray<{ id: string; name: string }> = [
  { id: "homy", name: "HOMY EXPRESS" },
  { id: "self", name: "自社" },
  { id: "abc", name: "ABC運送" },
  { id: "tohoku", name: "東北運送" },
  { id: "b-unsou", name: "B運送" },
];

const DEFAULT_CONTRACT_COMPANY_ID = MOCK_COMPANIES[0].id;

const padTime = (t: string): string => {
  const [h, m] = t.split(":");
  return `${(h ?? "00").padStart(2, "0")}:${(m ?? "00").padStart(2, "0")}`;
};

const buildEditInitial = (p: ProjectEntry): ProjectEditValue => ({
  name: p.name,
  type: p.type,
  contractCompanyId: DEFAULT_CONTRACT_COMPANY_ID,
  startTime: padTime(p.startTime),
  endTime: padTime(p.endTime),
  pickupLocation: p.pickupLocation,
  deliveryLocation: p.deliveryLocation,
  restLocations: [""],
  active: true,
});

const buildCreateInitial = (): ProjectEditValue => ({
  name: "",
  type: "regular",
  contractCompanyId: DEFAULT_CONTRACT_COMPANY_ID,
  startTime: "",
  endTime: "",
  pickupLocation: "",
  deliveryLocation: "",
  restLocations: [""],
  active: true,
});

type ProjectSheetState =
  | { mode: "edit"; projectId: string }
  | { mode: "create" };

const findEditingProject = (
  state: ProjectSheetState | null,
): ProjectEntry | null => {
  if (state === null || state.mode !== "edit") return null;
  return MOCK_PROJECTS.find((p) => p.id === state.projectId) ?? null;
};

const resolveSheetTitle = (state: ProjectSheetState | null): string =>
  state?.mode === "create" ? "案件新規追加" : "案件編集";

const resolveSheetKey = (state: ProjectSheetState | null): string => {
  if (state === null) return "";
  if (state.mode === "create") return "create";
  return `edit-${state.projectId}`;
};

const resolveSheetInitial = (
  state: ProjectSheetState | null,
  editingProject: ProjectEntry | null,
): ProjectEditValue | null => {
  if (state === null) return null;
  if (state.mode === "create") return buildCreateInitial();
  if (editingProject === null) return null;
  return buildEditInitial(editingProject);
};

export const SettingsPage = () => {
  const { openDrawer } = useAdminShell();
  const [activeTab, setActiveTab] = useState<SettingsTab>("projects");
  const [sheetState, setSheetState] = useState<ProjectSheetState | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const editingProject = findEditingProject(sheetState);
  const sheetTitle = resolveSheetTitle(sheetState);
  const sheetInitial = resolveSheetInitial(sheetState, editingProject);
  const sheetKey = resolveSheetKey(sheetState);

  const handleProjectClick = (id: string) => {
    setSheetState({ mode: "edit", projectId: id });
    setSheetOpen(true);
  };
  const handleSheetClose = () => setSheetOpen(false);
  const handleSheetSave = (next: ProjectEditValue) => {
    // TODO: 案件作成・更新 API
    console.log("save project", sheetState, next);
    setSheetOpen(false);
  };

  const handleAddProject = () => {
    setSheetState({ mode: "create" });
    setSheetOpen(true);
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
    <div className="bg-[#f7f7f5] flex flex-col min-h-screen w-full">
      <AdminAppBar
        title="案件・現場設定"
        notificationCount={3}
        userInitial="佐"
        onMenuClick={openDrawer}
      />

      <div className="flex flex-col w-full">
        <div className="w-full max-w-[765px] mx-auto px-4 pt-4 pb-3">
          <PillSegmentedToggle
            value={activeTab}
            onChange={setActiveTab}
            options={TABS}
          />
        </div>
        <ActionRow
          primaryLabel="＋ 案件追加"
          onPrimaryClick={handleAddProject}
          onActionClick={handleActionClick}
        />

        {activeTab === "projects" ? (
          <div className="w-full max-w-[765px] mx-auto flex flex-col gap-3 px-4 py-4">
            {MOCK_PROJECTS.map((p) => (
              <ProjectCard
                key={p.id}
                type={p.type}
                name={p.name}
                startTime={p.startTime}
                endTime={p.endTime}
                pickupLocation={p.pickupLocation}
                deliveryLocation={p.deliveryLocation}
                contact={p.contact}
                onClick={() => handleProjectClick(p.id)}
              />
            ))}
          </div>
        ) : (
          <PlaceholderTab
            label={TABS.find((t) => t.value === activeTab)?.label ?? ""}
          />
        )}
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        title={sheetTitle}
      >
        {sheetState !== null && sheetInitial !== null ? (
          <ProjectEditSheet
            key={sheetKey}
            mode={sheetState.mode}
            initialValue={sheetInitial}
            companies={MOCK_COMPANIES}
            onCancel={handleSheetClose}
            onSave={handleSheetSave}
          />
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={actionSheetOpen}
        onClose={handleActionClose}
        title="案件・現場操作"
      >
        <ProjectActionSheet
          onCsvImport={handleCsvImport}
          onCsvExport={handleCsvExport}
        />
      </BottomSheet>
    </div>
  );
};
