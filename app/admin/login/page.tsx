import { AdminLoginForm } from "@/app/admin/login/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="bg-[#f7f7f5] flex flex-col items-center justify-center min-h-screen px-8">
      <div className="w-full max-w-[400px]">
        <AdminLoginForm />
      </div>
    </main>
  );
}
