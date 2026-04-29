"use client";

import Link from "next/link";
import { useState } from "react";

import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextInput } from "@/components/ui/TextInput";

type Errors = Partial<{
  loginId: string;
  password: string;
}>;

const validateForm = (loginId: string, password: string): Errors => {
  const errors: Errors = {};
  if (loginId.trim() === "") errors.loginId = "ログインIDを入力してください";
  if (password === "") errors.password = "パスワードを入力してください";
  return errors;
};

export const AdminLoginForm = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validateForm(loginId, password);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    // TODO: ログイン処理
    console.log("admin login", { loginId, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-9 w-full"
      noValidate
    >
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-[28px] font-bold tracking-[2px] text-[#0e0f0c]">
          点呼一発
        </h1>
        <p className="text-[14px] text-[#888986]">管理者ログイン</p>
      </div>

      <div className="flex flex-col gap-6 w-full">
        <FormField label="ログインID" error={errors.loginId}>
          <TextInput
            placeholder="example@example.com"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            error={Boolean(errors.loginId)}
            maxLength={254}
            autoComplete="username"
          />
        </FormField>

        <FormField label="パスワード" error={errors.password}>
          <TextInput
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
            maxLength={100}
            autoComplete="current-password"
          />
        </FormField>
      </div>

      <PrimaryButton type="submit">ログイン</PrimaryButton>

      <div className="flex flex-col gap-4 items-center">
        <Link
          href="/admin/password-change"
          className="text-[13px] text-[#9fe870] underline hover:text-[#8edc5e] transition-colors"
        >
          パスワードを忘れた方はこちら
        </Link>
        <p className="text-[13px] text-[#888986]">LINE認証が必要です</p>
      </div>
    </form>
  );
};
