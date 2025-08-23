// D:\Sugumar\taxi-store\components\users\UserProfile.tsx
"use client";
import React from "react";

interface UserProfileProps {
  id: string;
  name: string;
  location: string;
  phoneNumber: string;
  active: boolean;
}

export default function UserProfile({ id, name, location, phoneNumber, active }: UserProfileProps) {
  return (
    <div className="bg-white p-6 rounded shadow border">
      <h3 className="text-lg font-semibold mb-4">User Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Customer ID</p>
          <p className="font-medium">{id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className={active ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {active ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-600">Name</p>
          <p className="font-medium">{name}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-600">Phone Number</p>
          <p className="font-medium">{phoneNumber}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-600">Address</p>
          <p className="font-medium">{location || "Not available"}</p>
        </div>
      </div>
    </div>
  );
}