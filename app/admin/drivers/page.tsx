// app/admin/drivers/page.tsx
import React from "react";
import DriversTable from "@/components/admin/DriversTable";

export default function DriversPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Drivers</h1>
          <p className="text-sm text-gray-500 mb-4">View & manage drivers — edit, settle payments, or remove.</p>
          <DriversTable />
        </div>
      </div>
    </div>
  );
}
