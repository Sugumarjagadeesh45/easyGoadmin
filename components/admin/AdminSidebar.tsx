// components/AdminSidebar.tsx
"use client";
import Link from "next/link";
import React from "react";

export default function AdminSidebar() {
  const items = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/drivers", label: "Drivers" },
    { href: "/admin/live", label: "Live Rides" },
    { href: "/admin/points", label: "Points / Grocery" },
    { href: "/admin/payments", label: "Payments" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/Ecommerce", label: "Ecommerce" },
  ];

  return (
    <aside className="w-64 bg-white border-r px-4 py-6 hidden md:block">
      <nav className="flex flex-col gap-2">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700"
          >
            {it.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
