import { StartTenkoForm } from "@/app/driver/tenko/start/StartTenkoForm";
import { AppHeader } from "@/components/layout/AppHeader";

export default function TenkoStartPage() {
  return (
    <div className="w-full bg-white flex flex-col">
      <AppHeader title="開始点呼（出発）" />
      <div className="w-full max-w-[765px] mx-auto flex flex-col">
        <StartTenkoForm />
      </div>
    </div>
  );
}
