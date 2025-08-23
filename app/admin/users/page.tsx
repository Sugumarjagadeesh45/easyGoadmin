// D:\Sugumar\taxi-store\app\admin\users\page.tsx
"use client";
import React, { useState, useEffect } from "react";
import UserProfile from "@/components/users/UserProfile";
import RewardPoints from "@/components/users/RewardPoints";
import PaymentHistory from "@/components/users/PaymentHistory";
import BookingHistory from "@/components/users/BookingHistory";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UsersTable from "@/components/admin/UsersTable";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
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

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Sample data for reward points, payments, and bookings
  const sampleRewardPoints = 320;
  const samplePayments = [
    { date: "2025-08-01", amount: 500, method: "UPI" },
    { date: "2025-07-25", amount: 350, method: "Credit Card" },
  ];
  const sampleBookings = [
    { date: "2025-08-10", time: "10:30 AM", travelTime: "35 mins", from: "Chennai Central", to: "Marina Beach" },
    { date: "2025-08-05", time: "6:00 PM", travelTime: "20 mins", from: "T Nagar", to: "Adyar" },
  ];

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading users...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        
        {/* Users Table */}
        <div className="mb-8">
          <UsersTable users={users} onUserSelect={handleUserSelect} />
        </div>

        {/* User Details Section - Only show when a user is selected */}
        {selectedUser && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">User Details</h2>
            
            {/* User Profile */}
            <UserProfile 
              id={selectedUser.customerId} 
              name={selectedUser.name} 
              location={selectedUser.address} 
              phoneNumber={selectedUser.phoneNumber} 
              active={selectedUser.active ?? false} 
            />
            
            {/* Reward Points */}
            <RewardPoints points={sampleRewardPoints} />
            
            {/* Payment History */}
            <PaymentHistory payments={samplePayments} />
            
            {/* Booking History */}
            <BookingHistory bookings={sampleBookings} />
          </div>
        )}
      </main>
    </div>
  );
}