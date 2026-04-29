"use client";

import Link from "next/link";
import { useState } from "react";

import { Checkbox } from "@/components/ui/Checkbox";
import { DatePicker } from "@/components/ui/DatePicker";
import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextInput } from "@/components/ui/TextInput";

type Errors = Partial<{
  name: string;
  company: string;
  vehicle: string;
  birthDate: string;
  phone: string;
  email: string;
  consent: string;
}>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_FIELD_KEYS = [
  "name",
  "company",
  "vehicle",
  "birthDate",
  "phone",
  "email",
] as const;
type RequiredFieldKey = (typeof REQUIRED_FIELD_KEYS)[number];

const FIELD_LABELS: Record<RequiredFieldKey, string> = {
  name: "氏名",
  company: "所属会社",
  vehicle: "車両番号",
  birthDate: "生年月日",
  phone: "電話番号",
  email: "メールアドレス",
};

const CONSENT_REQUIRED_MESSAGE =
  "プライバシーポリシー・利用規約への同意が必要です";

const requiredMessage = (label: string): string => `${label}を入力してください`;

const validateField = (key: RequiredFieldKey, value: string): string | null => {
  if (value === "") return requiredMessage(FIELD_LABELS[key]);
  if (key === "email" && !EMAIL_PATTERN.test(value)) {
    return "正しいメールアドレスを入力してください";
  }
  return null;
};

const validateConsent = (checked: boolean): string | null =>
  checked ? null : CONSENT_REQUIRED_MESSAGE;

export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const fieldValues: Record<RequiredFieldKey, string> = {
    name,
    company,
    vehicle,
    birthDate,
    phone,
    email,
  };

  const updateFieldError = (key: RequiredFieldKey, value: string) => {
    setErrors((prev) => {
      const error = validateField(key, value);
      const next = { ...prev };
      if (error === null) {
        delete next[key];
      } else {
        next[key] = error;
      }
      return next;
    });
  };

  const updateConsentError = (checked: boolean) => {
    setErrors((prev) => {
      const error = validateConsent(checked);
      const next = { ...prev };
      if (error === null) {
        delete next.consent;
      } else {
        next.consent = error;
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fieldErrors = REQUIRED_FIELD_KEYS.reduce<Errors>((acc, key) => {
      const error = validateField(key, fieldValues[key]);
      return error === null ? acc : { ...acc, [key]: error };
    }, {});

    const consentError = validateConsent(consent);

    const nextErrors: Errors = {
      ...fieldErrors,
      ...(consentError !== null && { consent: consentError }),
    };

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    // TODO: 登録 API 呼び出し
    console.log("submit", {
      name,
      company,
      vehicle,
      birthDate,
      phone,
      email,
      consent,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-6 flex-1"
      noValidate
    >
      <FormField label="氏名" required error={errors.name}>
        <TextInput
          placeholder="山田 太郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => updateFieldError("name", name)}
          error={Boolean(errors.name)}
          maxLength={50}
        />
      </FormField>

      <FormField label="所属会社" required error={errors.company}>
        <TextInput
          placeholder="○○運送株式会社"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          onBlur={() => updateFieldError("company", company)}
          error={Boolean(errors.company)}
          maxLength={100}
        />
      </FormField>

      <FormField label="車両番号" required error={errors.vehicle}>
        <TextInput
          placeholder="品川 500 あ 1234"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          onBlur={() => updateFieldError("vehicle", vehicle)}
          error={Boolean(errors.vehicle)}
          maxLength={20}
        />
      </FormField>

      <FormField label="生年月日" required error={errors.birthDate}>
        <DatePicker
          placeholder="1990/01/01"
          value={birthDate}
          onChange={(value) => {
            setBirthDate(value);
            updateFieldError("birthDate", value);
          }}
          error={Boolean(errors.birthDate)}
        />
      </FormField>

      <FormField label="電話番号" required error={errors.phone}>
        <TextInput
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          pattern="^[\x00-\x7F]+$"
          maxLength={15}
          placeholder="090-1234-5678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => updateFieldError("phone", phone)}
          error={Boolean(errors.phone)}
        />
      </FormField>

      <FormField label="メールアドレス" required error={errors.email}>
        <TextInput
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => updateFieldError("email", email)}
          error={Boolean(errors.email)}
          maxLength={254}
        />
      </FormField>

      <div className="flex flex-col gap-1">
        <Checkbox
          id="consent-policy"
          checked={consent}
          onChange={(checked) => {
            setConsent(checked);
            updateConsentError(checked);
          }}
          error={Boolean(errors.consent)}
        >
          <Link
            href="/policy/privacy"
            onClick={(e) => e.stopPropagation()}
            className="text-[#163300] underline"
          >
            プライバシーポリシー
          </Link>
          <span className="text-[#0e0f0c]">・</span>
          <Link
            href="/policy/terms"
            onClick={(e) => e.stopPropagation()}
            className="text-[#163300] underline"
          >
            利用規約
          </Link>
          <span className="text-[#0e0f0c]">に同意する</span>
        </Checkbox>
        {errors.consent ? (
          <p className="text-[12px] text-[#e23b4a]">{errors.consent}</p>
        ) : null}
      </div>

      <PrimaryButton type="submit">登録する</PrimaryButton>
    </form>
  );
};
