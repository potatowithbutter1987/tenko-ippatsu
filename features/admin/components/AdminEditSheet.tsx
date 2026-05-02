"use client";

import { useState } from "react";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { InfoModal } from "@/components/ui/InfoModal";
import { PillSegmentedToggle } from "@/components/ui/PillSegmentedToggle";
import { SelectInput } from "@/components/ui/SelectInput";
import type {
  AdminRole,
  AdminStatus,
} from "@/features/admin/components/AdminCard";

export type AdminEditValue = {
  userId: string;
  role: AdminRole;
  status: AdminStatus;
};

type Errors = Partial<{
  userId: string;
}>;

type Mode = "edit" | "create";

type Props = {
  mode?: Mode;
  initialValue: AdminEditValue;
  users: ReadonlyArray<{ id: string; name: string }>;
  onCancel: () => void;
  onSave: (value: AdminEditValue) => void;
};

const ROLE_OPTIONS = [
  { value: "super_admin", label: "全体管理者" },
  { value: "admin", label: "管理者" },
];

const STATUS_TOGGLE_OPTIONS = [
  { value: "active", label: "有効化", variant: "primary" },
  { value: "inactive", label: "無効化", variant: "danger" },
] as const;

const validateForm = (v: AdminEditValue): Errors => {
  const errors: Errors = {};
  if (v.userId === "") errors.userId = "ドライバーを選択してください";
  return errors;
};

const PASSWORD_CHARS =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

const generateTempPassword = (length = 12): string => {
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => PASSWORD_CHARS[n % PASSWORD_CHARS.length]).join(
    "",
  );
};

const FieldLabel = ({
  children,
  required,
  muted,
}: {
  children: React.ReactNode;
  required?: boolean;
  muted?: boolean;
}) => (
  <span
    className={`text-[13px] font-semibold ${
      muted === true ? "text-[#868685]" : "text-[#0e0f0c]"
    }`}
  >
    {children}
    {required === true ? (
      <span
        className={`ml-1 ${muted === true ? "text-[#868685]" : "text-[#e23b4a]"}`}
      >
        *
      </span>
    ) : null}
  </span>
);

const DisabledSelect = ({ value }: { value: string }) => (
  <div className="bg-[#f7f7f5] border border-[#e8ebe6] rounded-[10px] flex items-center justify-between px-4 py-3.5 w-full">
    <span className="flex-1 min-w-0 text-[14px] font-normal text-[#868685] truncate">
      {value}
    </span>
    <span className="text-[10px] text-[#868685] shrink-0">▼</span>
  </div>
);

export const AdminEditSheet = ({
  mode = "edit",
  initialValue,
  users,
  onCancel,
  onSave,
}: Props) => {
  const [value, setValue] = useState<AdminEditValue>(initialValue);
  const [errors, setErrors] = useState<Errors>({});
  const [disableConfirmOpen, setDisableConfirmOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));
  const selectedUserName = users.find((u) => u.id === value.userId)?.name ?? "";

  const clearError = (key: keyof Errors) => {
    setErrors((prev) => {
      if (prev[key] === undefined) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validateForm(value);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    if (mode === "create") {
      // TODO: 管理者作成 API を実行 → 仮パスワード受け取る
      setTempPassword(generateTempPassword());
      setPasswordModalOpen(true);
      return;
    }
    if (initialValue.status === "active" && value.status === "inactive") {
      setDisableConfirmOpen(true);
      return;
    }
    onSave(value);
  };

  const handleDisableConfirmCancel = () => setDisableConfirmOpen(false);
  const handleDisableConfirmExecute = () => {
    setDisableConfirmOpen(false);
    onSave(value);
  };

  const handlePasswordModalClose = () => {
    setPasswordModalOpen(false);
    onSave(value);
  };

  const isCreate = mode === "create";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full leading-[normal]"
        noValidate
      >
        {isCreate ? (
          <div className="bg-[#e2f6d5] rounded-[10px] flex flex-col px-3.5 py-3 w-full">
            <p className="text-[12px] font-normal text-[#163300] leading-[18px]">
              ※
              有効化済みドライバーから管理者を追加します。初期パスワードは追加後に
              1 回だけ表示されます。
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel required muted={!isCreate}>
            ドライバー選択
          </FieldLabel>
          {isCreate ? (
            <>
              <SelectInput
                placeholder="ドライバーを選択"
                value={value.userId}
                onChange={(v) => {
                  setValue((prev) => ({ ...prev, userId: v }));
                  if (v !== "") clearError("userId");
                }}
                options={userOptions}
                error={errors.userId !== undefined}
              />
              {errors.userId !== undefined ? (
                <span className="text-[12px] text-[#e23b4a]">
                  {errors.userId}
                </span>
              ) : null}
            </>
          ) : (
            <DisabledSelect value={selectedUserName} />
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel required>権限</FieldLabel>
          <SelectInput
            placeholder="権限を選択"
            value={value.role}
            onChange={(v) =>
              setValue((prev) => ({
                ...prev,
                role: v === "super_admin" ? "super_admin" : "admin",
              }))
            }
            options={ROLE_OPTIONS}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>ステータス</FieldLabel>
          <PillSegmentedToggle
            value={value.status}
            onChange={(next) =>
              setValue((prev) => ({
                ...prev,
                status: next === "inactive" ? "inactive" : "active",
              }))
            }
            options={STATUS_TOGGLE_OPTIONS}
          />
        </div>

        <div className="flex gap-3 justify-center pt-2 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-white border border-[#e8ebe6] rounded-full py-3.5 text-[14px] font-semibold text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#9fe870] rounded-full py-3.5 text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
          >
            {isCreate ? "追加する" : "保存する"}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={disableConfirmOpen}
        title="確認"
        message={`「${selectedUserName}」を無効化します。無効化後はこの管理者は管理画面にログインできなくなります。よろしいですか？`}
        cancelLabel="キャンセル"
        confirmLabel="無効化する"
        variant="danger"
        onCancel={handleDisableConfirmCancel}
        onConfirm={handleDisableConfirmExecute}
      />

      <InfoModal
        open={passwordModalOpen}
        title="管理者を追加しました"
        message={
          <div className="flex flex-col gap-3 w-full">
            <p className="text-[14px] text-[#0e0f0c] leading-[22px]">
              「{selectedUserName}」を管理者として追加しました。
              <br />
              以下の初期パスワードでログインできます。
            </p>
            <div className="bg-[#f7f7f5] border border-[#e8ebe6] rounded-[10px] flex items-center justify-center px-4 py-3 w-full">
              <span className="text-[18px] font-semibold text-[#0e0f0c] tracking-[2px] font-mono">
                {tempPassword}
              </span>
            </div>
            <p className="text-[12px] text-[#e23b4a] leading-[18px]">
              ※ このパスワードは一度しか表示されません。必ず控えてください。
            </p>
          </div>
        }
        buttonLabel="OK"
        onClose={handlePasswordModalClose}
      />
    </>
  );
};
