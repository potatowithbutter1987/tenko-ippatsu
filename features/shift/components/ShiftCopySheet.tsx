"use client";

import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { useState } from "react";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { InfoModal } from "@/components/ui/InfoModal";
import { SelectInput } from "@/components/ui/SelectInput";

export type ShiftCopyValue = {
  fromMonth: string;
  toMonth: string;
  driverId: string;
};

type Errors = Partial<{
  fromMonth: string;
  toMonth: string;
}>;

type DriverOption = {
  id: string;
  name: string;
};

type Props = {
  referenceMonth: Date;
  drivers: ReadonlyArray<DriverOption>;
  onCancel: () => void;
  onSave: (value: ShiftCopyValue) => void;
};

const FROM_MONTHS_BACK = 11;
const TO_MONTHS_FORWARD = 3;

const buildFromMonthOptions = (around: Date) => {
  const start = subMonths(startOfMonth(around), FROM_MONTHS_BACK);
  const total = FROM_MONTHS_BACK + 1;
  return Array.from({ length: total }, (_, i) => {
    const m = addMonths(start, i);
    return { value: format(m, "yyyy-MM"), label: format(m, "yyyy年M月") };
  });
};

const buildToMonthOptions = (around: Date) =>
  Array.from({ length: TO_MONTHS_FORWARD }, (_, i) => {
    const m = addMonths(startOfMonth(around), i + 1);
    return { value: format(m, "yyyy-MM"), label: format(m, "yyyy年M月") };
  });

const requiredMessage = (label: string): string => `${label}を選択してください`;

const validateForm = (v: ShiftCopyValue): Errors => {
  const errors: Errors = {};
  if (v.fromMonth === "") errors.fromMonth = requiredMessage("コピー元");
  if (v.toMonth === "") errors.toMonth = requiredMessage("コピー先");
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

export const ShiftCopySheet = ({
  referenceMonth,
  drivers,
  onCancel,
  onSave,
}: Props) => {
  const fromMonthOptions = buildFromMonthOptions(referenceMonth);
  const toMonthOptions = buildToMonthOptions(referenceMonth);

  const defaultFrom = format(
    startOfMonth(subMonths(referenceMonth, 1)),
    "yyyy-MM",
  );
  const defaultTo = format(
    startOfMonth(addMonths(referenceMonth, 1)),
    "yyyy-MM",
  );

  const [value, setValue] = useState<ShiftCopyValue>({
    fromMonth: defaultFrom,
    toMonth: defaultTo,
    driverId: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const driverOptions = drivers.map((d) => ({ value: d.id, label: d.name }));

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
    setConfirmOpen(true);
  };

  const handleConfirmCancel = () => setConfirmOpen(false);
  const handleConfirmExecute = () => {
    // TODO: シフトコピー API
    setConfirmOpen(false);
    setSuccessOpen(true);
  };
  const handleSuccessClose = () => {
    setSuccessOpen(false);
    onSave(value);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full leading-[normal]"
        noValidate
      >
        <div className="flex flex-col gap-2 w-full">
          <FieldLabel required>コピー元</FieldLabel>
          <SelectInput
            placeholder="月を選択"
            value={value.fromMonth}
            onChange={(v) => {
              setValue((prev) => ({ ...prev, fromMonth: v }));
              if (v !== "") clearError("fromMonth");
            }}
            options={fromMonthOptions}
            error={errors.fromMonth !== undefined}
          />
          {errors.fromMonth !== undefined ? (
            <span className="text-[12px] text-[#e23b4a]">
              {errors.fromMonth}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel required>コピー先</FieldLabel>
          <SelectInput
            placeholder="月を選択"
            value={value.toMonth}
            onChange={(v) => {
              setValue((prev) => ({ ...prev, toMonth: v }));
              if (v !== "") clearError("toMonth");
            }}
            options={toMonthOptions}
            error={errors.toMonth !== undefined}
          />
          {errors.toMonth !== undefined ? (
            <span className="text-[12px] text-[#e23b4a]">{errors.toMonth}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>対象ドライバー</FieldLabel>
          <SelectInput
            placeholder="全員"
            value={value.driverId}
            onChange={(v) => setValue((prev) => ({ ...prev, driverId: v }))}
            options={driverOptions}
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
            コピーする
          </button>
        </div>
      </form>

      <ConfirmModal
        open={confirmOpen}
        title="確認"
        message="シフトをコピーします。上書きしますがよろしいですか？"
        cancelLabel="キャンセル"
        confirmLabel="コピーする"
        variant="primary"
        onCancel={handleConfirmCancel}
        onConfirm={handleConfirmExecute}
      />

      <InfoModal
        open={successOpen}
        title="Info"
        message="シフトをコピーしました。"
        buttonLabel="OK"
        onClose={handleSuccessClose}
      />
    </>
  );
};
