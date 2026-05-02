"use client";

import { useState } from "react";

import { ActionRow } from "@/app/admin/settings/ActionRow";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ProjectActionSheet } from "@/features/project/components/ProjectActionSheet";
import {
  ProjectCard,
  type ProjectType,
} from "@/features/project/components/ProjectCard";
import {
  ProjectEditSheet,
  type ProjectEditValue,
} from "@/features/project/components/ProjectEditSheet";

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

export const ProjectsSection = () => {
  const [sheetState, setSheetState] = useState<ProjectSheetState | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);

  const editingProject = findEditingProject(sheetState);
  const sheetTitle = resolveSheetTitle(sheetState);
  const sheetInitial = resolveSheetInitial(sheetState, editingProject);
  const sheetKey = resolveSheetKey(sheetState);

  const handleProjectClick = (id: string) => {
    setSheetState({ mode: "edit", projectId: id });
    setSheetOpen(true);
  };
  const handleAddProject = () => {
    setSheetState({ mode: "create" });
    setSheetOpen(true);
  };
  const handleSheetClose = () => setSheetOpen(false);
  const handleSheetSave = (next: ProjectEditValue) => {
    // TODO: 案件作成・更新 API
    console.log("save project", sheetState, next);
    setSheetOpen(false);
  };

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
        primaryLabel="＋ 案件追加"
        onPrimaryClick={handleAddProject}
        onActionClick={handleActionClick}
      />

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
    </>
  );
};
