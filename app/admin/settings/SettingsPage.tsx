"use client";

import { useState } from "react";

import { AdminsSection } from "@/app/admin/settings/AdminsSection";
import { CompaniesSection } from "@/app/admin/settings/CompaniesSection";
import { ProjectsSection } from "@/app/admin/settings/ProjectsSection";
import { VehiclesSection } from "@/app/admin/settings/VehiclesSection";
import { AdminAppBar } from "@/components/layout/AdminAppBar";
import { useAdminShell } from "@/components/layout/NavigationDrawer";
import { PillSegmentedToggle } from "@/components/ui/PillSegmentedToggle";

type SettingsTab = "projects" | "companies" | "vehicles" | "admins";

const TABS: ReadonlyArray<{ value: SettingsTab; label: string }> = [
  { value: "projects", label: "案件・現場" },
  { value: "companies", label: "協力会社" },
  { value: "vehicles", label: "車両設定" },
  { value: "admins", label: "管理者" },
];

const PAGE_TITLE_BY_TAB: Record<SettingsTab, string> = {
  projects: "案件・現場設定",
  companies: "協力会社設定",
  vehicles: "車両設定",
  admins: "管理者設定",
};

export const SettingsPage = () => {
  const { openDrawer } = useAdminShell();
  const [activeTab, setActiveTab] = useState<SettingsTab>("projects");

  return (
    <div className="bg-[#f7f7f5] flex flex-col min-h-screen w-full">
      <AdminAppBar
        title={PAGE_TITLE_BY_TAB[activeTab]}
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

        {activeTab === "projects" ? <ProjectsSection /> : null}
        {activeTab === "companies" ? <CompaniesSection /> : null}
        {activeTab === "vehicles" ? <VehiclesSection /> : null}
        {activeTab === "admins" ? <AdminsSection /> : null}
      </div>
    </div>
  );
};
