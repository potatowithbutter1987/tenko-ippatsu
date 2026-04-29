"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";

import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SelectInput } from "@/components/ui/SelectInput";
import { TextArea } from "@/components/ui/TextArea";
import { TimePicker } from "@/components/ui/TimePicker";

const PROJECT_OPTIONS = [
  { value: "amazon", label: "Amazon 品川" },
  { value: "nissan", label: "日産・栃木" },
];

const VEHICLE_OPTIONS = [
  { value: "vehicle-1", label: "品川 500 あ 1234" },
  { value: "vehicle-2", label: "品川 500 い 5678" },
];

export type ShiftInput = {
  date: string;
  projectId: string;
  startTime: string;
  endTime: string;
  vehicleId: string;
  note: string;
};

type Errors = Partial<{
  projectId: string;
  startTime: string;
  endTime: string;
  vehicleId: string;
}>;

const TIME_PATTERN = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;

const validateTime = (value: string): string | null => {
  const trimmed = value.trim();
  if (trimmed === "") return "時刻を入力してください";
  if (!TIME_PATTERN.test(trimmed)) return "HH:mm 形式で入力してください";
  return null;
};

const validateForm = (input: ShiftInput): Errors => {
  const errors: Errors = {};
  if (input.projectId === "") errors.projectId = "案件を選択してください";
  const startError = validateTime(input.startTime);
  if (startError !== null) errors.startTime = startError;
  const endError = validateTime(input.endTime);
  if (endError !== null) errors.endTime = endError;
  if (input.vehicleId === "") errors.vehicleId = "車両を選択してください";
  return errors;
};

type Props = {
  date: Date;
  onCancel: () => void;
  onSave: (input: ShiftInput) => void;
};

export const ShiftAddSheet = ({ date, onCancel, onSave }: Props) => {
  const [projectId, setProjectId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const dateLabel = format(date, "yyyy年 M月 d日（E）", { locale: ja });

  const clearError = (key: keyof Errors) => {
    setErrors((prev) => {
      if (prev[key] === undefined) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const updateError = (key: keyof Errors, message: string | null) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (message === null) {
        delete next[key];
      } else {
        next[key] = message;
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input: ShiftInput = {
      date: format(date, "yyyy-MM-dd"),
      projectId,
      startTime,
      endTime,
      vehicleId,
      note,
    };
    const nextErrors = validateForm(input);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSave(input);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full"
      noValidate
    >
      <div className="bg-[#f7f7f5] rounded-xl px-4 py-3.5 flex items-center justify-center w-full">
        <p className="text-[16px] font-bold text-[#0e0f0c]">{dateLabel}</p>
      </div>

      <FormField label="案件" required error={errors.projectId}>
        <SelectInput
          placeholder="案件を選択してください"
          value={projectId}
          onChange={(v) => {
            setProjectId(v);
            if (v !== "") clearError("projectId");
          }}
          options={PROJECT_OPTIONS}
          error={Boolean(errors.projectId)}
        />
      </FormField>

      <div className="flex gap-3 w-full">
        <div className="flex-1 min-w-0">
          <FormField label="開始時刻" required error={errors.startTime}>
            <TimePicker
              placeholder="09:00"
              value={startTime}
              onChange={(v) => {
                setStartTime(v);
                updateError("startTime", validateTime(v));
              }}
              onBlur={() => updateError("startTime", validateTime(startTime))}
              error={Boolean(errors.startTime)}
            />
          </FormField>
        </div>
        <div className="flex-1 min-w-0">
          <FormField label="終了時刻" required error={errors.endTime}>
            <TimePicker
              placeholder="18:00"
              value={endTime}
              onChange={(v) => {
                setEndTime(v);
                updateError("endTime", validateTime(v));
              }}
              onBlur={() => updateError("endTime", validateTime(endTime))}
              error={Boolean(errors.endTime)}
            />
          </FormField>
        </div>
      </div>

      <FormField label="車両" required error={errors.vehicleId}>
        <SelectInput
          placeholder="車両を選択してください"
          value={vehicleId}
          onChange={(v) => {
            setVehicleId(v);
            if (v !== "") clearError("vehicleId");
          }}
          options={VEHICLE_OPTIONS}
          error={Boolean(errors.vehicleId)}
        />
      </FormField>

      <FormField label="備考">
        <TextArea
          className="min-h-[100px]"
          placeholder="自由入力"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
        />
      </FormField>

      <div className="flex flex-col gap-3 pt-2 w-full">
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-white border border-[#e8ebe5] rounded-full py-4 text-[18px] font-semibold text-[#0e0f0c] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
        >
          キャンセル
        </button>
        <PrimaryButton type="submit">シフトを保存する</PrimaryButton>
      </div>
    </form>
  );
};
