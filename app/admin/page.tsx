// D:\Sugumar\taxi-store\app\admin\page.tsx
"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardCards from "@/components/admin/DashboardCards";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/registered');
      
      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data.data) ? data.data : []);
      } else {
        console.error('Failed to fetch users');
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <DashboardCards users={users} />
      </main>
    </div>
  );
}