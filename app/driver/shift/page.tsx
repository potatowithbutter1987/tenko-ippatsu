import { ShiftRegisterPage } from "@/app/driver/shift/ShiftRegisterPage";
import { AppHeader } from "@/components/layout/AppHeader";

export default function ShiftPage() {
  return (
    <div className="w-full bg-white flex flex-col">
      <AppHeader title="シフト登録" />
      <div className="w-full max-w-[765px] mx-auto flex flex-col">
        <ShiftRegisterPage />
      </div>
    </div>
  );
}
