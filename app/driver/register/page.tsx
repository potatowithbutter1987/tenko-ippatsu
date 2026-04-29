import { RegisterForm } from "@/app/driver/register/RegisterForm";
import { AppHeader } from "@/components/layout/AppHeader";

export default function RegisterPage() {
  return (
    <div className="w-full bg-white flex flex-col">
      <AppHeader />

      <div className="w-full max-w-[765px] mx-auto flex flex-col">
        <section className="flex flex-col gap-2 pt-8 pb-2 px-6">
          <h1 className="text-[28px] font-bold leading-[34px] text-[#0e0f0c]">
            初回登録
          </h1>
          <p className="text-[14px] leading-[22px] text-[#888986]">
            点呼一発を利用するための基本情報を登録してください。
          </p>
        </section>

        <RegisterForm />
      </div>
    </div>
  );
}
