import { OperatingHoursPage } from "@/app/admin/operating-hours/OperatingHoursPage";
import { AdminShellProvider } from "@/components/layout/NavigationDrawer";

export default function AdminOperatingHoursPage() {
  return (
    <AdminShellProvider>
      <OperatingHoursPage />
    </AdminShellProvider>
  );
}
