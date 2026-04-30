"use client";

import { useState } from "react";

import { SelectInput } from "@/components/ui/SelectInput";
import { TextInput } from "@/components/ui/TextInput";

export type DriverEditValue = {
  name: string;
  vehicleId: string;
  projectId: string;
  phone: string;
  email: string;
  active: boolean;
};

type Props = {
  registeredDate: string;
  affiliation: string;
  affiliationSinceDate: string;
  initialValue: DriverEditValue;
  onCancel: () => void;
  onSave: (value: DriverEditValue) => void;
  onChangeAffiliation: () => void;
};

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

const FieldLabel = ({
  children,
  muted,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) => (
  <span
    className={`text-[14px] font-semibold ${muted === true ? "text-[#868685]" : "text-[#0e0f0c]"}`}
  >
    {children}
  </span>
);

const ReadOnlyDisplay = ({
  value,
  fillContainer,
}: {
  value: string;
  fillContainer?: boolean;
}) => {
  const flexClass =
    fillContainer === true ? "flex-1 self-stretch min-w-0" : "w-full";
  return (
    <div
      className={`bg-[#f7f7f5] border border-[#e8ebe6] rounded-[10px] px-4 py-3.5 flex items-center ${flexClass}`}
    >
      <span className="text-[14px] font-normal text-[#868685] truncate">
        {value}
      </span>
    </div>
  );
};

export const DriverEditSheet = ({
  registeredDate,
  affiliation,
  affiliationSinceDate,
  initialValue,
  onCancel,
  onSave,
  onChangeAffiliation,
}: Props) => {
  const [value, setValue] = useState<DriverEditValue>(initialValue);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full leading-[normal]"
      noValidate
    >
      <div className="flex flex-col gap-2 w-full">
        <FieldLabel muted>初回登録日</FieldLabel>
        <ReadOnlyDisplay value={registeredDate} />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>氏名</FieldLabel>
        <TextInput
          value={value.name}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, name: e.target.value }))
          }
          maxLength={50}
          placeholder="氏名を入力"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>所属会社</FieldLabel>
        <div className="flex gap-2 items-stretch w-full">
          <ReadOnlyDisplay value={affiliation} fillContainer />
          <button
            type="button"
            onClick={onChangeAffiliation}
            className="shrink-0 bg-white border border-[#e8ebe6] rounded-full px-4 py-3 text-[14px] font-semibold text-[#0e0f0c] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
          >
            所属変更
          </button>
        </div>
        <p className="text-[12px] font-normal text-[#868685]">
          ※ {affiliationSinceDate} 〜 から所属
        </p>
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
        <FieldLabel>電話番号</FieldLabel>
        <TextInput
          type="tel"
          inputMode="tel"
          value={value.phone}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, phone: e.target.value }))
          }
          maxLength={15}
          placeholder="090-0000-0000"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>メールアドレス</FieldLabel>
        <TextInput
          type="email"
          inputMode="email"
          value={value.email}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, email: e.target.value }))
          }
          maxLength={254}
          placeholder="example@email.com"
        />
      </div>

      <div className="flex gap-3 justify-center pt-2 w-full">
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
          保存する
        </button>
      </div>
    </form>
  );
};
