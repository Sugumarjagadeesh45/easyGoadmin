// app/admin/page.tsx
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardCards from "@/components/admin/DashboardCards";
import DriversTable from "@/components/admin/DriversTable";
import LiveRides from "@/components/admin/LiveRides";
import UsersTable from "@/components/admin/UsersTable";

import React from "react";

import UserList from "@/components/users/UserList";


export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <section className="mb-6">
            <DashboardCards />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Users</h2>
              <UsersTable />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-3">Drivers</h2>
              <DriversTable />
            </div>
          </section>

          <UserList/>

          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Live Rides</h2>
            <LiveRides />
          </section>
        </main>
      </div>
    </div>
  );
}
