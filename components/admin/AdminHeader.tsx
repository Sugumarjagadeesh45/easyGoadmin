// components/AdminHeader.tsx
"use client";
import React from "react";

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded">GM</div>
        <h1 className="text-xl font-semibold">Gas Monkey — Admin</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">Admin User</div>
        <button className="px-3 py-1 rounded bg-red-500 text-white text-sm">Logout</button>
      </div>
    </header>
  );
}
