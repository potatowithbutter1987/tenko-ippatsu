import { ShiftsPage } from "@/app/admin/shifts/ShiftsPage";
import { AdminShellProvider } from "@/components/layout/NavigationDrawer";

export default function Page() {
  return (
    <AdminShellProvider>
      <ShiftsPage />
    </AdminShellProvider>
  );
}
