import { EndTenkoForm } from "@/app/driver/tenko/end/EndTenkoForm";
import { AppHeader } from "@/components/layout/AppHeader";

export default function TenkoEndPage() {
  return (
    <div className="w-full bg-white flex flex-col">
      <AppHeader title="終了点呼（帰着）" />
      <div className="w-full max-w-[765px] mx-auto flex flex-col">
        <EndTenkoForm />
      </div>
    </div>
  );
}
