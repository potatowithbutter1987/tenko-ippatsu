"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { InfoModal } from "@/components/ui/InfoModal";
import { SelectInput } from "@/components/ui/SelectInput";
import { TextArea } from "@/components/ui/TextArea";
import { TimePicker } from "@/components/ui/TimePicker";

export type ShiftEditValue = {
  startTime: string;
  endTime: string;
  projectId: string;
  vehicleId: string;
  note: string;
};

type Errors = Partial<{
  startTime: string;
  endTime: string;
  projectId: string;
  vehicleId: string;
}>;

type Props = {
  driverName: string;
  date: Date;
  initialValue: ShiftEditValue;
  onCancel: () => void;
  onSave: (value: ShiftEditValue) => void;
  onDelete?: () => void;
};

const PROJECT_OPTIONS = [
  { value: "amazon", label: "Amazon品川" },
  { value: "yamato", label: "ヤマト江東" },
  { value: "nissan", label: "日産・栃木" },
  { value: "sagawa", label: "佐川急便" },
  { value: "spot", label: "スポット便" },
];

const VEHICLE_OPTIONS = [
  { value: "vehicle-1", label: "足立 400 あ 1234" },
  { value: "vehicle-2", label: "品川 500 わ 9999" },
  { value: "vehicle-3", label: "足立 400 あ 5555" },
];

const TIME_PATTERN = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;

const requiredMessage = (label: string): string => `${label}を入力してください`;

const validateTime = (value: string, label: string): string | null => {
  const trimmed = value.trim();
  if (trimmed === "") return requiredMessage(label);
  if (!TIME_PATTERN.test(trimmed)) return "HH:mm 形式で入力してください";
  return null;
};

const toMinutes = (value: string): number => {
  const [hh, mm] = value.split(":").map(Number);
  return hh * 60 + mm;
};

const validateTimeRange = (start: string, end: string): string | null => {
  if (!TIME_PATTERN.test(start) || !TIME_PATTERN.test(end)) return null;
  if (toMinutes(end) <= toMinutes(start)) {
    return "終了時刻は開始時刻より後にしてください";
  }
  return null;
};

const validateForm = (v: ShiftEditValue): Errors => {
  const errors: Errors = {};
  const startError = validateTime(v.startTime, "開始時刻");
  if (startError !== null) errors.startTime = startError;
  const endError = validateTime(v.endTime, "終了時刻");
  if (endError !== null) errors.endTime = endError;
  if (errors.startTime === undefined && errors.endTime === undefined) {
    const rangeError = validateTimeRange(v.startTime, v.endTime);
    if (rangeError !== null) errors.endTime = rangeError;
  }
  if (v.projectId === "") errors.projectId = requiredMessage("案件名");
  if (v.vehicleId === "") errors.vehicleId = requiredMessage("車両");
  return errors;
};

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[13px] font-semibold text-[#0e0f0c]">{children}</span>
);

export const ShiftEditSheet = ({
  driverName,
  date,
  initialValue,
  onCancel,
  onSave,
  onDelete,
}: Props) => {
  const [value, setValue] = useState<ShiftEditValue>(initialValue);
  const [errors, setErrors] = useState<Errors>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);

  const dateLabel = format(date, "yyyy年 M月d日 (E)", { locale: ja });

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
    onSave(value);
  };

  const handleDeleteClick = () => setDeleteConfirmOpen(true);
  const handleDeleteCancel = () => setDeleteConfirmOpen(false);
  const handleDeleteConfirm = () => {
    // TODO: シフト削除 API
    setDeleteConfirmOpen(false);
    setDeleteSuccessOpen(true);
  };
  const handleDeleteSuccessClose = () => {
    setDeleteSuccessOpen(false);
    onDelete?.();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full leading-[normal]"
        noValidate
      >
        <div className="bg-[#e2f6d5] rounded-[12px] flex flex-col gap-0.5 px-3.5 py-3 w-full">
          <p className="text-[14px] font-semibold text-[#0e0f0c]">
            {driverName}
          </p>
          <p className="text-[11px] font-normal text-[#163300]">{dateLabel}</p>
        </div>

        <div className="flex gap-3 items-start w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <FieldLabel>開始</FieldLabel>
            <TimePicker
              placeholder="08:00"
              value={value.startTime}
              onChange={(v) => {
                setValue((prev) => ({ ...prev, startTime: v }));
                updateError("startTime", validateTime(v, "開始時刻"));
              }}
              onBlur={() =>
                updateError(
                  "startTime",
                  validateTime(value.startTime, "開始時刻"),
                )
              }
              error={errors.startTime !== undefined}
            />
            {errors.startTime !== undefined ? (
              <span className="text-[12px] text-[#e23b4a]">
                {errors.startTime}
              </span>
            ) : null}
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <FieldLabel>終了</FieldLabel>
            <TimePicker
              placeholder="11:00"
              value={value.endTime}
              onChange={(v) => {
                setValue((prev) => ({ ...prev, endTime: v }));
                updateError("endTime", validateTime(v, "終了時刻"));
              }}
              onBlur={() =>
                updateError("endTime", validateTime(value.endTime, "終了時刻"))
              }
              error={errors.endTime !== undefined}
            />
            {errors.endTime !== undefined ? (
              <span className="text-[12px] text-[#e23b4a]">
                {errors.endTime}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>案件名</FieldLabel>
          <SelectInput
            placeholder="案件を選択"
            value={value.projectId}
            onChange={(v) => {
              setValue((prev) => ({ ...prev, projectId: v }));
              if (v !== "") clearError("projectId");
            }}
            options={PROJECT_OPTIONS}
            error={errors.projectId !== undefined}
          />
          {errors.projectId !== undefined ? (
            <span className="text-[12px] text-[#e23b4a]">
              {errors.projectId}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>車両</FieldLabel>
          <SelectInput
            placeholder="車両を選択"
            value={value.vehicleId}
            onChange={(v) => {
              setValue((prev) => ({ ...prev, vehicleId: v }));
              if (v !== "") clearError("vehicleId");
            }}
            options={VEHICLE_OPTIONS}
            error={errors.vehicleId !== undefined}
          />
          {errors.vehicleId !== undefined ? (
            <span className="text-[12px] text-[#e23b4a]">
              {errors.vehicleId}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>備考</FieldLabel>
          <TextArea
            placeholder="例: 休憩時間・申し送り事項など"
            value={value.note}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, note: e.target.value }))
            }
            maxLength={500}
          />
        </div>

        {onDelete !== undefined ? (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="flex gap-1.5 items-center justify-center py-1.5 text-[13px] font-semibold text-[#e23b4a] cursor-pointer hover:opacity-70 transition-opacity"
          >
            <span className="text-[13px] font-normal">🗑</span>
            <span>シフトを削除</span>
          </button>
        ) : null}

        <div className="flex gap-3 justify-center pt-1 w-full">
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
        open={deleteConfirmOpen}
        title="確認"
        message="このシフトを削除します。削除後は元に戻せません。よろしいですか？"
        cancelLabel="キャンセル"
        confirmLabel="削除する"
        variant="danger"
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <InfoModal
        open={deleteSuccessOpen}
        title="Info"
        message="シフトを削除しました。"
        buttonLabel="OK"
        onClose={handleDeleteSuccessClose}
      />
    </>
  );
};
