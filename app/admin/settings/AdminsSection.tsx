"use client";

import { useState } from "react";

import { ActionRow } from "@/app/admin/settings/ActionRow";
import { BottomSheet } from "@/components/ui/BottomSheet";
import {
  AdminCard,
  type AdminRole,
  type AdminStatus,
} from "@/features/admin/components/AdminCard";
import {
  AdminEditSheet,
  type AdminEditValue,
} from "@/features/admin/components/AdminEditSheet";

type AdminEntry = {
  id: string;
  userId: string;
  name: string;
  status: AdminStatus;
  role: AdminRole;
  email: string;
  affiliation: string;
  scope: string;
};

const MOCK_USERS: ReadonlyArray<{ id: string; name: string }> = [
  { id: "sasaki", name: "佐々木 徹" },
  { id: "tanaka", name: "田中 四郎" },
  { id: "yamada-naoko", name: "山田 直子" },
  { id: "suzuki-saburo", name: "鈴木 三郎" },
  { id: "takahashi", name: "高橋 健太" },
  { id: "sato-jiro", name: "佐藤 次郎" },
  { id: "yamada-hanako", name: "山田 花子" },
];

const MOCK_ADMINS: ReadonlyArray<AdminEntry> = [
  {
    id: "a1",
    userId: "sasaki",
    name: "佐々木 徹",
    status: "active",
    role: "super_admin",
    email: "sasaki@homy.co.jp",
    affiliation: "HOMY EXPRESS (1次)",
    scope: "テナント内すべて(6社)",
  },
  {
    id: "a2",
    userId: "tanaka",
    name: "田中 四郎",
    status: "active",
    role: "admin",
    email: "tanaka@homy.co.jp",
    affiliation: "HOMY EXPRESS (1次)",
    scope: "HOMY配下すべて(5社)",
  },
  {
    id: "a3",
    userId: "yamada-naoko",
    name: "山田 直子",
    status: "active",
    role: "admin",
    email: "yamada@a-kyubin.jp",
    affiliation: "A急便 (2次)",
    scope: "A急便配下(3社)",
  },
  {
    id: "a4",
    userId: "suzuki-saburo",
    name: "鈴木 三郎",
    status: "active",
    role: "admin",
    email: "suzuki@b-unso.jp",
    affiliation: "B運送 (3次)",
    scope: "自社のみ",
  },
  {
    id: "a5",
    userId: "takahashi",
    name: "高橋 健太",
    status: "inactive",
    role: "admin",
    email: "takahashi@c-unyu.jp",
    affiliation: "C運輸 (2次)",
    scope: "C運輸配下(2社)—制限あり",
  },
];

const buildEditInitial = (a: AdminEntry): AdminEditValue => ({
  userId: a.userId,
  role: a.role,
  status: a.status,
});

const buildCreateInitial = (): AdminEditValue => ({
  userId: "",
  role: "admin",
  status: "active",
});

type AdminSheetState = { mode: "edit"; adminId: string } | { mode: "create" };

const findEditingAdmin = (state: AdminSheetState | null): AdminEntry | null => {
  if (state === null || state.mode !== "edit") return null;
  return MOCK_ADMINS.find((a) => a.id === state.adminId) ?? null;
};

const resolveSheetTitle = (state: AdminSheetState | null): string =>
  state?.mode === "create" ? "管理者を追加" : "管理者編集";

const resolveSheetKey = (state: AdminSheetState | null): string => {
  if (state === null) return "";
  if (state.mode === "create") return "create";
  return `edit-${state.adminId}`;
};

const resolveSheetInitial = (
  state: AdminSheetState | null,
  editingAdmin: AdminEntry | null,
): AdminEditValue | null => {
  if (state === null) return null;
  if (state.mode === "create") return buildCreateInitial();
  if (editingAdmin === null) return null;
  return buildEditInitial(editingAdmin);
};

export const AdminsSection = () => {
  const [sheetState, setSheetState] = useState<AdminSheetState | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const editingAdmin = findEditingAdmin(sheetState);
  const sheetTitle = resolveSheetTitle(sheetState);
  const sheetInitial = resolveSheetInitial(sheetState, editingAdmin);
  const sheetKey = resolveSheetKey(sheetState);

  const handleAdminClick = (id: string) => {
    setSheetState({ mode: "edit", adminId: id });
    setSheetOpen(true);
  };
  const handleAddAdmin = () => {
    setSheetState({ mode: "create" });
    setSheetOpen(true);
  };
  const handleSheetClose = () => setSheetOpen(false);
  const handleSheetSave = (next: AdminEditValue) => {
    // TODO: 管理者作成・更新 API
    console.log("save admin", sheetState, next);
    setSheetOpen(false);
  };

  return (
    <>
      <ActionRow
        primaryLabel="＋ 管理者を追加"
        onPrimaryClick={handleAddAdmin}
      />

      <div className="w-full max-w-[765px] mx-auto flex flex-col gap-3 px-4 py-4">
        {MOCK_ADMINS.map((a) => (
          <AdminCard
            key={a.id}
            name={a.name}
            status={a.status}
            role={a.role}
            email={a.email}
            affiliation={a.affiliation}
            scope={a.scope}
            onClick={() => handleAdminClick(a.id)}
          />
        ))}
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        title={sheetTitle}
      >
        {sheetState !== null && sheetInitial !== null ? (
          <AdminEditSheet
            key={sheetKey}
            mode={sheetState.mode}
            initialValue={sheetInitial}
            users={MOCK_USERS}
            onCancel={handleSheetClose}
            onSave={handleSheetSave}
          />
        ) : null}
      </BottomSheet>
    </>
  );
};
