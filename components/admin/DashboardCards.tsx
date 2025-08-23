// D:\Sugumar\taxi-store\components\admin\DashboardCards.tsx
// Note: Original code not provided, so this is a corrected example based on typical implementation and error analysis.
// Assumes it uses users.filter for stats like active users.
// Added checks to ensure users is an array and handled active field.
"use client";
import React from "react";

interface User {
  _id: string;
  name: string;
  phoneNumber: string;
  address: string;
  customerId: string;
  active?: boolean;
}

interface DashboardCardsProps {
  users: User[];
}

export default function DashboardCards({ users = [] }: DashboardCardsProps) {
  if (!Array.isArray(users)) {
    return <div>Error: Invalid users data</div>;
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.active ?? false).length; // Fallback to false if active undefined
  const inactiveUsers = totalUsers - activeUsers;

  // Add more stats as needed, e.g., based on other data

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
        <p className="text-3xl font-bold">{totalUsers}</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Active Users</h3>
        <p className="text-3xl font-bold">{activeUsers}</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Inactive Users</h3>
        <p className="text-3xl font-bold">{inactiveUsers}</p>
      </div>
      {/* Add more cards for other dashboard stats */}
    </div>
  );
}