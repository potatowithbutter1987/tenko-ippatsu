"use client";

import { useState } from "react";

import { PillSegmentedToggle } from "@/components/ui/PillSegmentedToggle";
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

type Errors = Partial<{
  name: string;
  phone: string;
  email: string;
}>;

type Props = {
  registeredDate: string;
  affiliation: string;
  affiliationSinceDate: string;
  initialValue: DriverEditValue;
  onCancel: () => void;
  onSave: (value: DriverEditValue) => void;
  onChangeAffiliation: () => void;
};

const FIELD_MAX_LENGTH = {
  name: 50,
  phone: 15,
  email: 254,
} as const;

const FIELD_LABEL = {
  name: "氏名",
  phone: "電話番号",
  email: "メールアドレス",
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredMessage = (label: string): string => `${label}を入力してください`;
const maxLengthMessage = (label: string, max: number): string =>
  `${label}は${max}文字以内で入力してください`;

const validateName = (value: string): string | null => {
  if (value.trim() === "") return requiredMessage(FIELD_LABEL.name);
  if (value.length > FIELD_MAX_LENGTH.name)
    return maxLengthMessage(FIELD_LABEL.name, FIELD_MAX_LENGTH.name);
  return null;
};

const validatePhone = (value: string): string | null => {
  if (value === "") return requiredMessage(FIELD_LABEL.phone);
  if (value.length > FIELD_MAX_LENGTH.phone)
    return maxLengthMessage(FIELD_LABEL.phone, FIELD_MAX_LENGTH.phone);
  return null;
};

const validateEmail = (value: string): string | null => {
  if (value === "") return null;
  if (value.length > FIELD_MAX_LENGTH.email)
    return maxLengthMessage(FIELD_LABEL.email, FIELD_MAX_LENGTH.email);
  if (!EMAIL_PATTERN.test(value))
    return `正しい${FIELD_LABEL.email}を入力してください`;
  return null;
};

type FieldKey = keyof Errors;

const VALIDATORS: ReadonlyArray<{
  key: FieldKey;
  run: (v: DriverEditValue) => string | null;
}> = [
  { key: "name", run: (v) => validateName(v.name) },
  { key: "phone", run: (v) => validatePhone(v.phone) },
  { key: "email", run: (v) => validateEmail(v.email) },
];

const validate = (v: DriverEditValue): Errors =>
  VALIDATORS.reduce<Errors>((acc, { key, run }) => {
    const error = run(v);
    return error === null ? acc : { ...acc, [key]: error };
  }, {});

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

const ACTIVE_TOGGLE_OPTIONS = [
  { value: "active", label: "有効化", variant: "primary" },
  { value: "inactive", label: "無効化", variant: "danger" },
] as const;

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
  const [errors, setErrors] = useState<Errors>({});

  const clearError = (key: FieldKey) => {
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
      <div className="flex flex-col gap-2 w-full">
        <FieldLabel muted>初回登録日</FieldLabel>
        <ReadOnlyDisplay value={registeredDate} />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>氏名</FieldLabel>
        <TextInput
          value={value.name}
          onChange={(e) => {
            setValue((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name !== undefined) clearError("name");
          }}
          onBlur={() =>
            setErrors((prev) => {
              const error = validateName(value.name);
              const next = { ...prev };
              if (error === null) delete next.name;
              else next.name = error;
              return next;
            })
          }
          maxLength={FIELD_MAX_LENGTH.name}
          placeholder="氏名を入力"
          error={errors.name !== undefined}
        />
        {errors.name !== undefined ? (
          <span className="text-[12px] text-[#e23b4a]">{errors.name}</span>
        ) : null}
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
          onChange={(e) => {
            setValue((prev) => ({ ...prev, phone: e.target.value }));
            if (errors.phone !== undefined) clearError("phone");
          }}
          onBlur={() =>
            setErrors((prev) => {
              const error = validatePhone(value.phone);
              const next = { ...prev };
              if (error === null) delete next.phone;
              else next.phone = error;
              return next;
            })
          }
          maxLength={FIELD_MAX_LENGTH.phone}
          placeholder="090-0000-0000"
          error={errors.phone !== undefined}
        />
        {errors.phone !== undefined ? (
          <span className="text-[12px] text-[#e23b4a]">{errors.phone}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>メールアドレス</FieldLabel>
        <TextInput
          type="email"
          inputMode="email"
          value={value.email}
          onChange={(e) => {
            setValue((prev) => ({ ...prev, email: e.target.value }));
            if (errors.email !== undefined) clearError("email");
          }}
          onBlur={() =>
            setErrors((prev) => {
              const error = validateEmail(value.email);
              const next = { ...prev };
              if (error === null) delete next.email;
              else next.email = error;
              return next;
            })
          }
          maxLength={FIELD_MAX_LENGTH.email}
          placeholder="example@email.com"
          error={errors.email !== undefined}
        />
        {errors.email !== undefined ? (
          <span className="text-[12px] text-[#e23b4a]">{errors.email}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>有効/無効</FieldLabel>
        <PillSegmentedToggle
          value={value.active ? "active" : "inactive"}
          onChange={(next) =>
            setValue((prev) => ({ ...prev, active: next === "active" }))
          }
          options={ACTIVE_TOGGLE_OPTIONS}
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
