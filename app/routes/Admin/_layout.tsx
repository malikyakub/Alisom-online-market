import { useEffect, useState } from "react";
import AdminHeader from "components/AdminHeader";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="w-full mx-auto max-w-[1170px] px-4 sm:px-6">
          <AdminHeader />
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-[1170px] px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
