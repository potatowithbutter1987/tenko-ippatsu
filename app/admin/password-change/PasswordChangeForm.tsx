"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FormField } from "@/components/ui/FormField";
import { InfoModal } from "@/components/ui/InfoModal";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextInput } from "@/components/ui/TextInput";

const MIN_PASSWORD_LENGTH = 8;

type Errors = Partial<{
  newPassword: string;
  confirmPassword: string;
}>;

const validateForm = (newPassword: string, confirmPassword: string): Errors => {
  const errors: Errors = {};
  if (newPassword === "") {
    errors.newPassword = "新しいパスワードを入力してください";
  } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
    errors.newPassword = `${MIN_PASSWORD_LENGTH}文字以上で入力してください`;
  }
  if (confirmPassword === "") {
    errors.confirmPassword = "確認用のパスワードを入力してください";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "パスワードが一致しません";
  }
  return errors;
};

export const PasswordChangeForm = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validateForm(newPassword, confirmPassword);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    // TODO: パスワード変更 API 呼び出し
    console.log("change password");
    setSuccessOpen(true);
  };

  const handleConfirmSuccess = () => {
    setSuccessOpen(false);
    router.push("/admin/login");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-9 w-full"
        noValidate
      >
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-[28px] font-bold tracking-[2px] text-[#0e0f0c]">
            点呼一発
          </h1>
          <p className="text-[14px] text-[#888986]">パスワード変更</p>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <FormField label="新しいパスワード" error={errors.newPassword}>
            <TextInput
              type="password"
              placeholder="••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={Boolean(errors.newPassword)}
              maxLength={100}
              autoComplete="new-password"
            />
          </FormField>

          <FormField
            label="新しいパスワード（確認）"
            error={errors.confirmPassword}
          >
            <TextInput
              type="password"
              placeholder="••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={Boolean(errors.confirmPassword)}
              maxLength={100}
              autoComplete="new-password"
            />
          </FormField>
        </div>

        <PrimaryButton type="submit">パスワードを変更する</PrimaryButton>

        <Link
          href="/admin/login"
          className="text-[13px] text-[#9fe870] text-center hover:text-[#8edc5e] transition-colors"
        >
          ← ログイン画面に戻る
        </Link>
      </form>

      <InfoModal
        open={successOpen}
        title="Info"
        message="パスワードを変更しました。"
        buttonLabel="OK"
        onClose={() => setSuccessOpen(false)}
        onConfirm={handleConfirmSuccess}
      />
    </>
  );
};
