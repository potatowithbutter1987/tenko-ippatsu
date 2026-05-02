import { SettingsPage } from "@/app/admin/settings/SettingsPage";
import { AdminShellProvider } from "@/components/layout/NavigationDrawer";

export default function Page() {
  return (
    <AdminShellProvider>
      <SettingsPage />
    </AdminShellProvider>
  );
}
