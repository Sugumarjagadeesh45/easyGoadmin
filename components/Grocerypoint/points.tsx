// app/admin/points.tsx
import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const PointsGroceryPage = () => {
  const data = [
    {
      id: 1,
      name: "John Doe",
      rides: 45,
      totalPoints: 4500,
      pointsSpent: 2000,
      remainingPoints: 2500,
      shopVisits: 12,
      expiryDate: "2025-12-31",
    },
    {
      id: 2,
      name: "Jane Smith",
      rides: 28,
      totalPoints: 3000,
      pointsSpent: 1000,
      remainingPoints: 2000,
      shopVisits: 8,
      expiryDate: "2025-11-15",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Points / Grocery Management</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">User</th>
              <th className="p-3">Total Rides</th>
              <th className="p-3">Total Points</th>
              <th className="p-3">Points Spent</th>
              <th className="p-3">Remaining Points</th>
              <th className="p-3">Grocery Visits</th>
              <th className="p-3">Expiry Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((user, idx) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-3">{idx + 1}</td>
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3">{user.rides}</td>
                <td className="p-3 text-green-600 font-semibold">
                  {user.totalPoints}
                </td>
                <td className="p-3 text-red-500">{user.pointsSpent}</td>
                <td className="p-3 text-blue-600 font-semibold">
                  {user.remainingPoints}
                </td>
                <td className="p-3">{user.shopVisits}</td>
                <td className="p-3">{user.expiryDate}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button className="p-2 rounded-lg hover:bg-blue-100">
                    <Pencil size={18} className="text-blue-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-100">
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PointsGroceryPage;
