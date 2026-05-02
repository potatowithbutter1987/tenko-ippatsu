"use client";

import { useState } from "react";

import { AdminAppBar } from "@/components/layout/AdminAppBar";
import { useAdminShell } from "@/components/layout/NavigationDrawer";
import {
  ProjectCard,
  type ProjectType,
} from "@/features/project/components/ProjectCard";

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

const SettingsTabs = ({
  active,
  onChange,
}: {
  active: SettingsTab;
  onChange: (next: SettingsTab) => void;
}) => (
  <div className="flex flex-wrap gap-2 w-full leading-[normal]">
    {TABS.map((t) => {
      const isActive = active === t.value;
      const stateClass = isActive
        ? "bg-[#9fe870] text-[#163300] font-semibold"
        : "bg-white border border-[#e8ebe6] text-[#868685] font-medium hover:bg-[#f7f7f5]";
      return (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={`rounded-full px-4 py-2 text-[12px] cursor-pointer transition-colors ${stateClass}`}
        >
          {t.label}
        </button>
      );
    })}
  </div>
);

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
    <div className="flex gap-3 items-center px-4 py-2.5 w-full">
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
  <div className="px-4 py-12 text-center text-[14px] text-[#868685]">
    {label} は未実装です
  </div>
);

export const SettingsPage = () => {
  const { openDrawer } = useAdminShell();
  const [activeTab, setActiveTab] = useState<SettingsTab>("projects");

  const handleProjectClick = (id: string) => {
    // TODO: 案件編集シート
    console.log("edit project", id);
  };
  const handleAddProject = () => {
    // TODO: 案件追加シート
    console.log("add project");
  };
  const handleActionClick = () => {
    // TODO: 操作ボトムシート
    console.log("open action");
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
        <div className="px-4 pt-4 pb-3 w-full">
          <SettingsTabs active={activeTab} onChange={setActiveTab} />
        </div>
        <ActionRow
          primaryLabel="＋ 案件追加"
          onPrimaryClick={handleAddProject}
          onActionClick={handleActionClick}
        />

        {activeTab === "projects" ? (
          <div className="flex flex-col gap-3 px-4 py-4 w-full">
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
    </div>
  );
};
