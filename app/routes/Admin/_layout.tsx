import AdminHeader from "components/AdminHeader";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <AdminHeader />
      </header>

      <main className="flex-1 w-full px-4 py-6 sm:px-6 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
