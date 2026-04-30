"use client";

import { format } from "date-fns";
import { useState } from "react";

import { DatePicker } from "@/components/ui/DatePicker";
import { SelectInput } from "@/components/ui/SelectInput";
import { TextArea } from "@/components/ui/TextArea";

export type AffiliationChangeValue = {
  newAffiliationId: string;
  vehicleId: string;
  projectId: string;
  effectiveDate: string;
  reason: string;
};

type Errors = Partial<{
  newAffiliationId: string;
  effectiveDate: string;
  reason: string;
}>;

type Props = {
  driverName: string;
  currentAffiliation: string;
  currentAffiliationSinceDate: string;
  initialValue?: AffiliationChangeValue;
  onCancel: () => void;
  onSave: (value: AffiliationChangeValue) => void;
};

const AFFILIATION_OPTIONS = [
  { value: "self", label: "自社" },
  { value: "abc", label: "ABC運送" },
  { value: "tohoku", label: "東北運送" },
  { value: "personal", label: "個人" },
  { value: "b-unsou", label: "B運送" },
];

const VEHICLE_OPTIONS = [
  { value: "vehicle-1", label: "足立 400 あ 1234" },
  { value: "vehicle-2", label: "品川 500 わ 9999" },
  { value: "vehicle-3", label: "足立 400 あ 5555" },
];

const PROJECT_OPTIONS = [
  { value: "amazon", label: "Amazon 品川" },
  { value: "yamato", label: "ヤマト 江東" },
  { value: "nissan", label: "日産・栃木" },
];

const ISO_FORMAT = "yyyy-MM-dd";

const buildDefaultValue = (): AffiliationChangeValue => ({
  newAffiliationId: "",
  vehicleId: "",
  projectId: "",
  effectiveDate: format(new Date(), ISO_FORMAT),
  reason: "",
});

const FieldLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <span className="text-[14px] font-semibold text-[#0e0f0c]">
    {children}
    {required === true ? <span className="ml-1 text-[#e23b4a]">*</span> : null}
  </span>
);

const validate = (value: AffiliationChangeValue): Errors => {
  const errors: Errors = {};
  if (value.newAffiliationId === "") {
    errors.newAffiliationId = "新しい所属会社を選択してください";
  }
  if (value.effectiveDate === "") {
    errors.effectiveDate = "変更日を入力してください";
  }
  if (value.reason.trim() === "") {
    errors.reason = "変更理由を入力してください";
  }
  return errors;
};

export const AffiliationChangeSheet = ({
  driverName,
  currentAffiliation,
  currentAffiliationSinceDate,
  initialValue,
  onCancel,
  onSave,
}: Props) => {
  const [value, setValue] = useState<AffiliationChangeValue>(
    initialValue ?? buildDefaultValue(),
  );
  const [errors, setErrors] = useState<Errors>({});

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
    const nextErrors = validate(value);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSave(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full leading-[normal]"
      noValidate
    >
      <p className="text-[13px] font-normal text-[#868685]">
        対象ドライバー: {driverName}
      </p>

      <div className="bg-[#f7f7f5] border border-[#e8ebe6] rounded-[10px] flex flex-col gap-1 px-3.5 py-3 w-full">
        <span className="text-[12px] font-medium text-[#868685]">
          現在の所属
        </span>
        <span className="text-[13px] font-semibold text-[#0e0f0c] whitespace-pre">
          {currentAffiliation} {"  /  "} {currentAffiliationSinceDate} 〜 現在
        </span>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>新しい所属会社</FieldLabel>
        <SelectInput
          placeholder="会社を選択"
          value={value.newAffiliationId}
          onChange={(v) => {
            setValue((prev) => ({ ...prev, newAffiliationId: v }));
            if (v !== "") clearError("newAffiliationId");
          }}
          options={AFFILIATION_OPTIONS}
          error={errors.newAffiliationId !== undefined}
        />
        {errors.newAffiliationId !== undefined ? (
          <span className="text-[12px] text-[#e23b4a]">
            {errors.newAffiliationId}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>常用車両</FieldLabel>
        <SelectInput
          placeholder="車両を選択"
          value={value.vehicleId}
          onChange={(v) => setValue((prev) => ({ ...prev, vehicleId: v }))}
          options={VEHICLE_OPTIONS}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>メイン案件</FieldLabel>
        <SelectInput
          placeholder="案件を選択"
          value={value.projectId}
          onChange={(v) => setValue((prev) => ({ ...prev, projectId: v }))}
          options={PROJECT_OPTIONS}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>変更日</FieldLabel>
        <DatePicker
          value={value.effectiveDate}
          onChange={(v) => {
            setValue((prev) => ({ ...prev, effectiveDate: v }));
            if (v !== "") clearError("effectiveDate");
          }}
          startYear={new Date().getFullYear() - 3}
          endYear={new Date().getFullYear() + 1}
          defaultMonth={new Date()}
          error={errors.effectiveDate !== undefined}
        />
        {errors.effectiveDate !== undefined ? (
          <span className="text-[12px] text-[#e23b4a]">
            {errors.effectiveDate}
          </span>
        ) : null}
      </div>

      <div className="bg-[#e2f6d5] rounded-[10px] flex flex-col px-3.5 py-2.5 w-full">
        <p className="text-[12px] font-normal text-[#163300] leading-[18px]">
          ※
          変更日以降の点呼・業務記録は新しい所属で記録されます。過去の記録は実施日時点の所属を保持します。
          <br />※
          変更を保存すると、変更日以降に存在するシフトはキャンセルします。
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>変更理由</FieldLabel>
        <TextArea
          placeholder="例: B運送へ移籍"
          value={value.reason}
          onChange={(e) => {
            setValue((prev) => ({ ...prev, reason: e.target.value }));
            if (e.target.value.trim() !== "") clearError("reason");
          }}
          maxLength={500}
          error={errors.reason !== undefined}
        />
        {errors.reason !== undefined ? (
          <span className="text-[12px] text-[#e23b4a]">{errors.reason}</span>
        ) : null}
      </div>

      <div className="flex gap-3 pt-2 w-full">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white border border-[#e8ebe6] rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="flex-1 bg-[#9fe870] rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
        >
          変更を保存
        </button>
      </div>
    </form>
  );
};
