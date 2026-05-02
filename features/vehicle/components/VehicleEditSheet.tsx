"use client";

import { useState } from "react";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { DatePicker } from "@/components/ui/DatePicker";
import { PillSegmentedToggle } from "@/components/ui/PillSegmentedToggle";
import { SelectInput } from "@/components/ui/SelectInput";
import { TextInput } from "@/components/ui/TextInput";
import type {
  OwnershipType,
  VehicleStatus,
} from "@/features/vehicle/components/VehicleCard";

export type VehicleEditValue = {
  plateNumber: string;
  name: string;
  ownershipType: OwnershipType;
  companyId: string;
  userId: string;
  status: VehicleStatus;
  inspectionExpiry: string;
};

type Errors = Partial<{
  plateNumber: string;
  name: string;
  companyId: string;
  userId: string;
}>;

type Props = {
  initialValue: VehicleEditValue;
  companies: ReadonlyArray<{ id: string; name: string }>;
  users: ReadonlyArray<{ id: string; name: string }>;
  onCancel: () => void;
  onSave: (value: VehicleEditValue) => void;
};

const FIELD_MAX_LENGTH = {
  plateNumber: 20,
  name: 50,
} as const;

const FIELD_LABEL = {
  plateNumber: "車両番号",
  name: "車両名",
  companyId: "会社名",
  userId: "使用ドライバー",
} as const;

const OWNERSHIP_OPTIONS = [
  { value: "personal", label: "個人" },
  { value: "company", label: "会社" },
];

const STATUS_TOGGLE_OPTIONS = [
  { value: "active", label: "稼働中", variant: "primary" },
  { value: "stopped", label: "停止", variant: "danger" },
] as const;

const requiredMessage = (label: string): string => `${label}を入力してください`;
const requiredSelectMessage = (label: string): string =>
  `${label}を選択してください`;
const maxLengthMessage = (label: string, max: number): string =>
  `${label}は${max}文字以内で入力してください`;

const validatePlate = (value: string): string | null => {
  if (value.trim() === "") return requiredMessage(FIELD_LABEL.plateNumber);
  if (value.length > FIELD_MAX_LENGTH.plateNumber)
    return maxLengthMessage(
      FIELD_LABEL.plateNumber,
      FIELD_MAX_LENGTH.plateNumber,
    );
  return null;
};

const validateName = (value: string): string | null => {
  if (value === "") return null;
  if (value.length > FIELD_MAX_LENGTH.name)
    return maxLengthMessage(FIELD_LABEL.name, FIELD_MAX_LENGTH.name);
  return null;
};

const validateCompany = (
  ownershipType: OwnershipType,
  companyId: string,
): string | null => {
  if (ownershipType !== "company") return null;
  if (companyId === "") return requiredSelectMessage(FIELD_LABEL.companyId);
  return null;
};

const validateUser = (
  ownershipType: OwnershipType,
  userId: string,
): string | null => {
  if (ownershipType !== "personal") return null;
  if (userId === "") return requiredSelectMessage(FIELD_LABEL.userId);
  return null;
};

const validateForm = (v: VehicleEditValue): Errors => {
  const errors: Errors = {};
  const plateErr = validatePlate(v.plateNumber);
  if (plateErr !== null) errors.plateNumber = plateErr;
  const nameErr = validateName(v.name);
  if (nameErr !== null) errors.name = nameErr;
  const companyErr = validateCompany(v.ownershipType, v.companyId);
  if (companyErr !== null) errors.companyId = companyErr;
  const userErr = validateUser(v.ownershipType, v.userId);
  if (userErr !== null) errors.userId = userErr;
  return errors;
};

const FieldLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <span className="text-[13px] font-semibold text-[#0e0f0c]">
    {children}
    {required === true ? <span className="ml-1 text-[#e23b4a]">*</span> : null}
  </span>
);

export const VehicleEditSheet = ({
  initialValue,
  companies,
  users,
  onCancel,
  onSave,
}: Props) => {
  const [value, setValue] = useState<VehicleEditValue>(initialValue);
  const [errors, setErrors] = useState<Errors>({});
  const [stopConfirmOpen, setStopConfirmOpen] = useState(false);

  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }));
  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));

  const updateError = (key: keyof Errors, message: string | null) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (message === null) delete next[key];
      else next[key] = message;
      return next;
    });
  };
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
    if (initialValue.status === "active" && value.status === "stopped") {
      setStopConfirmOpen(true);
      return;
    }
    onSave(value);
  };

  const handleStopConfirmCancel = () => setStopConfirmOpen(false);
  const handleStopConfirmExecute = () => {
    setStopConfirmOpen(false);
    onSave(value);
  };

  const isCompanyOwned = value.ownershipType === "company";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full leading-[normal]"
        noValidate
      >
        <div className="flex flex-col gap-2 w-full">
          <FieldLabel required>車両番号</FieldLabel>
          <TextInput
            placeholder="例：足立 400 あ 1234"
            value={value.plateNumber}
            onChange={(e) => {
              setValue((prev) => ({ ...prev, plateNumber: e.target.value }));
              if (e.target.value.trim() !== "") clearError("plateNumber");
            }}
            onBlur={() =>
              updateError("plateNumber", validatePlate(value.plateNumber))
            }
            maxLength={FIELD_MAX_LENGTH.plateNumber}
            error={errors.plateNumber !== undefined}
          />
          {errors.plateNumber !== undefined ? (
            <span className="text-[12px] text-[#e23b4a]">
              {errors.plateNumber}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>車両名</FieldLabel>
          <TextInput
            placeholder="例：1号車"
            value={value.name}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, name: e.target.value }))
            }
            maxLength={FIELD_MAX_LENGTH.name}
            error={errors.name !== undefined}
          />
          {errors.name !== undefined ? (
            <span className="text-[12px] text-[#e23b4a]">{errors.name}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel required>所有形態</FieldLabel>
          <SelectInput
            placeholder="所有形態を選択"
            value={value.ownershipType}
            onChange={(v) => {
              const next: OwnershipType =
                v === "company" ? "company" : "personal";
              setValue((prev) => ({
                ...prev,
                ownershipType: next,
                companyId: next === "company" ? prev.companyId : "",
                userId: next === "personal" ? prev.userId : "",
              }));
              clearError("companyId");
              clearError("userId");
            }}
            options={OWNERSHIP_OPTIONS}
          />
        </div>

        {isCompanyOwned ? (
          <div className="flex flex-col gap-2 w-full">
            <FieldLabel required>会社名</FieldLabel>
            <SelectInput
              placeholder="会社を選択"
              value={value.companyId}
              onChange={(v) => {
                setValue((prev) => ({ ...prev, companyId: v }));
                if (v !== "") clearError("companyId");
              }}
              options={companyOptions}
              error={errors.companyId !== undefined}
            />
            {errors.companyId !== undefined ? (
              <span className="text-[12px] text-[#e23b4a]">
                {errors.companyId}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <FieldLabel required>使用ドライバー</FieldLabel>
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
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>ステータス</FieldLabel>
          <PillSegmentedToggle
            value={value.status}
            onChange={(next) =>
              setValue((prev) => ({
                ...prev,
                status: next === "stopped" ? "stopped" : "active",
              }))
            }
            options={STATUS_TOGGLE_OPTIONS}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>車検満了日</FieldLabel>
          <DatePicker
            placeholder="2027/03/15"
            value={value.inspectionExpiry}
            onChange={(v) =>
              setValue((prev) => ({ ...prev, inspectionExpiry: v }))
            }
            startYear={new Date().getFullYear()}
            endYear={new Date().getFullYear() + 5}
            disabledBefore={new Date()}
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
            保存する
          </button>
        </div>
      </form>

      <ConfirmModal
        open={stopConfirmOpen}
        title="確認"
        message={`「${value.plateNumber}」を停止します。停止後は新規シフトに割り当てできなくなります。よろしいですか？`}
        cancelLabel="キャンセル"
        confirmLabel="停止する"
        variant="danger"
        onCancel={handleStopConfirmCancel}
        onConfirm={handleStopConfirmExecute}
      />
    </>
  );
};
