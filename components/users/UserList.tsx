// D:\Sugumar\taxi-store\components\users\UserList.tsx
"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios";
import UserProfile from "./UserProfile";

interface User {
  customerId: string;
  name: string;
  address: string;
  phoneNumber: string;
  active?: boolean;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users/registered");
        setUsers(Array.isArray(response.data.data) ? response.data.data : []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Portal - User List</h1>
      {users.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <UserProfile
              key={user.customerId}
              id={user.customerId}
              name={user.name}
              location={user.address}
              phoneNumber={user.phoneNumber}
              active={user.active ?? false}
            />
          ))}
        </div>
      )}
    </div>
  );
}