"use client";

import { useState } from "react";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PillSegmentedToggle } from "@/components/ui/PillSegmentedToggle";
import { TextInput } from "@/components/ui/TextInput";

export type CompanyEditValue = {
  name: string;
  representative: string;
  phone: string;
  email: string;
  active: boolean;
};

type Errors = Partial<{
  name: string;
  representative: string;
  phone: string;
  email: string;
}>;

type Props = {
  initialValue: CompanyEditValue;
  parentName: string;
  tier: number;
  onCancel: () => void;
  onSave: (value: CompanyEditValue) => void;
};

const FIELD_MAX_LENGTH = {
  name: 100,
  representative: 50,
  phone: 15,
  email: 254,
} as const;

const FIELD_LABEL = {
  name: "会社名",
  representative: "代表者名",
  phone: "電話番号",
  email: "メールアドレス",
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ACTIVE_TOGGLE_OPTIONS = [
  { value: "active", label: "有効化", variant: "primary" },
  { value: "inactive", label: "無効化", variant: "danger" },
] as const;

const requiredMessage = (label: string): string => `${label}を入力してください`;
const maxLengthMessage = (label: string, max: number): string =>
  `${label}は${max}文字以内で入力してください`;

const validateName = (value: string): string | null => {
  if (value.trim() === "") return requiredMessage(FIELD_LABEL.name);
  if (value.length > FIELD_MAX_LENGTH.name)
    return maxLengthMessage(FIELD_LABEL.name, FIELD_MAX_LENGTH.name);
  return null;
};

const validateOptionalText = (
  value: string,
  label: string,
  max: number,
): string | null => {
  if (value === "") return null;
  if (value.length > max) return maxLengthMessage(label, max);
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

const VALIDATORS: ReadonlyArray<{
  key: keyof Errors;
  run: (v: CompanyEditValue) => string | null;
}> = [
  { key: "name", run: (v) => validateName(v.name) },
  {
    key: "representative",
    run: (v) =>
      validateOptionalText(
        v.representative,
        FIELD_LABEL.representative,
        FIELD_MAX_LENGTH.representative,
      ),
  },
  {
    key: "phone",
    run: (v) =>
      validateOptionalText(v.phone, FIELD_LABEL.phone, FIELD_MAX_LENGTH.phone),
  },
  { key: "email", run: (v) => validateEmail(v.email) },
];

const validateForm = (v: CompanyEditValue): Errors =>
  VALIDATORS.reduce<Errors>((acc, { key, run }) => {
    const error = run(v);
    return error === null ? acc : { ...acc, [key]: error };
  }, {});

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
    {required === true ? <span className="ml-1 text-[#e23b4a]">*</span> : null}
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

export const CompanyEditSheet = ({
  initialValue,
  parentName,
  tier,
  onCancel,
  onSave,
}: Props) => {
  const [value, setValue] = useState<CompanyEditValue>(initialValue);
  const [errors, setErrors] = useState<Errors>({});
  const [disableConfirmOpen, setDisableConfirmOpen] = useState(false);

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
    if (initialValue.active && !value.active) {
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

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full leading-[normal]"
        noValidate
      >
        <div className="flex flex-col gap-2 w-full">
          <FieldLabel required>会社名</FieldLabel>
          <TextInput
            placeholder="例：個人事業主 佐藤"
            value={value.name}
            onChange={(e) => {
              setValue((prev) => ({ ...prev, name: e.target.value }));
              if (e.target.value.trim() !== "") clearError("name");
            }}
            onBlur={() => updateError("name", validateName(value.name))}
            maxLength={FIELD_MAX_LENGTH.name}
            error={errors.name !== undefined}
          />
          {errors.name !== undefined ? (
            <span className="text-[12px] text-[#e23b4a]">{errors.name}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>代表者名</FieldLabel>
          <TextInput
            placeholder="例:佐藤 太郎"
            value={value.representative}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, representative: e.target.value }))
            }
            maxLength={FIELD_MAX_LENGTH.representative}
            error={errors.representative !== undefined}
          />
          {errors.representative !== undefined ? (
            <span className="text-[12px] text-[#e23b4a]">
              {errors.representative}
            </span>
          ) : null}
        </div>

        <div className="flex gap-4 items-start w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <FieldLabel muted>親会社</FieldLabel>
            <DisabledSelect value={parentName} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <FieldLabel muted>階層</FieldLabel>
            <DisabledSelect value={`${tier}次`} />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>電話番号</FieldLabel>
          <TextInput
            type="tel"
            inputMode="tel"
            placeholder="03-1111-xxxx"
            value={value.phone}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, phone: e.target.value }))
            }
            maxLength={FIELD_MAX_LENGTH.phone}
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
            placeholder="example@email.com"
            value={value.email}
            onChange={(e) => {
              setValue((prev) => ({ ...prev, email: e.target.value }));
              if (errors.email !== undefined) clearError("email");
            }}
            onBlur={() => updateError("email", validateEmail(value.email))}
            maxLength={FIELD_MAX_LENGTH.email}
            error={errors.email !== undefined}
          />
          {errors.email !== undefined ? (
            <span className="text-[12px] text-[#e23b4a]">{errors.email}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>稼働状態</FieldLabel>
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
        open={disableConfirmOpen}
        title="確認"
        message={`「${value.name}」を無効化します。無効化後は新規案件・シフトに割り当てできなくなります。よろしいですか？`}
        cancelLabel="キャンセル"
        confirmLabel="無効化する"
        variant="danger"
        onCancel={handleDisableConfirmCancel}
        onConfirm={handleDisableConfirmExecute}
      />
    </>
  );
};
