import { RecordsPage } from "@/app/admin/records/RecordsPage";
import { AdminShellProvider } from "@/components/layout/NavigationDrawer";

export default function AdminRecordsPage() {
  return (
    <AdminShellProvider>
      <RecordsPage />
    </AdminShellProvider>
  );
}
