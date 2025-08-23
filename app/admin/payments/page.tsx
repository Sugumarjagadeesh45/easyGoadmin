// app/admin/payments/page.tsx
import PaymentsTable from "@/components/Payments/PaymentsTable";
import React from "react";


export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Payments</h1>
        <p className="text-sm text-gray-500 mb-6">View and manage payments (QR / Cash) — edit details or remove records.</p>
        <PaymentsTable />
      </div>
    </div>
  );
}
