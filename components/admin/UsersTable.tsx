// D:\Sugumar\taxi-store\components\admin\UsersTable.tsx
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

interface UsersTableProps {
  users?: User[]; // Make users optional
  onUserSelect: (user: User) => void;
}

export default function UsersTable({ users = [], onUserSelect }: UsersTableProps) {
  return (
    <div className="bg-white rounded shadow-sm overflow-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">All Users</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm text-gray-600">Customer ID</th>
              <th className="p-3 text-left text-sm text-gray-600">Name</th>
              <th className="p-3 text-left text-sm text-gray-600">Phone</th>
              <th className="p-3 text-left text-sm text-gray-600">Address</th>
              <th className="p-3 text-left text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm">{user.customerId}</td>
                  <td className="p-3 text-sm">{user.name}</td>
                  <td className="p-3 text-sm">{user.phoneNumber}</td>
                  <td className="p-3 text-sm">{user.address}</td>
                  <td className="p-3 text-sm">
                    <button 
                      onClick={() => onUserSelect(user)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}