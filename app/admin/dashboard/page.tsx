import { DailyDashboardPage } from "@/app/admin/dashboard/DailyDashboardPage";
import { AdminShellProvider } from "@/components/layout/NavigationDrawer";

export default function DashboardPage() {
  return (
    <AdminShellProvider>
      <DailyDashboardPage />
    </AdminShellProvider>
  );
}
