import { PasswordChangeForm } from "@/app/admin/password-change/PasswordChangeForm";

export default function AdminPasswordChangePage() {
  return (
    <main className="bg-[#f7f7f5] flex flex-col items-center justify-center min-h-screen px-8">
      <div className="w-full max-w-[400px]">
        <PasswordChangeForm />
      </div>
    </main>
  );
}
