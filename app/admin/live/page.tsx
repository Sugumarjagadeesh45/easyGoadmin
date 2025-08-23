// app/admin/live/page.tsx
"use client";

import { useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";

type RideStatus = "Ongoing" | "Completed" | "Cancelled";

interface Ride {
  id: string;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime?: string;
  userName: string;
  userContact: string;
  userStatus: RideStatus;
  driverName: string;
  vehicleType: string;
  driverStatus: RideStatus;
  totalFare: number;
}

export default function LiveRidesPage() {
  const [rides, setRides] = useState<Ride[]>([
    {
      id: "RIDE-001",
      startLocation: "Chennai Central",
      endLocation: "Marina Beach",
      startTime: "10:05 AM",
      endTime: undefined,
      userName: "Arun Kumar",
      userContact: "9876543210",
      userStatus: "Ongoing",
      driverName: "Ravi Kumar",
      vehicleType: "Sedan",
      driverStatus: "Ongoing",
      totalFare: 250,
    },
    {
      id: "RIDE-002",
      startLocation: "T Nagar",
      endLocation: "Anna Nagar",
      startTime: "9:30 AM",
      endTime: "10:00 AM",
      userName: "Meena Devi",
      userContact: "9876501234",
      userStatus: "Completed",
      driverName: "Suresh Babu",
      vehicleType: "Auto",
      driverStatus: "Completed",
      totalFare: 150,
    },
  ]);

  const handleEdit = (id: string) => {
    console.log("Edit ride", id);
  };

  const handleDelete = (id: string) => {
    setRides(rides.filter((ride) => ride.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Live Rides</h1>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Ride ID</th>
              <th className="px-4 py-3">Start → End</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Fare (₹)</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{ride.id}</td>
                <td className="px-4 py-3">
                  {ride.startLocation} → {ride.endLocation}
                </td>
                <td className="px-4 py-3">
                  {ride.startTime} {ride.endTime ? `→ ${ride.endTime}` : ""}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{ride.userName}</div>
                  <div className="text-xs text-gray-500">{ride.userContact}</div>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                      ride.userStatus === "Ongoing"
                        ? "bg-blue-100 text-blue-700"
                        : ride.userStatus === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ride.userStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{ride.driverName}</div>
                  <div className="text-xs text-gray-500">{ride.vehicleType}</div>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                      ride.driverStatus === "Ongoing"
                        ? "bg-blue-100 text-blue-700"
                        : ride.driverStatus === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ride.driverStatus}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">₹{ride.totalFare}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(ride.id)}
                    className="p-1 rounded hover:bg-blue-100"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(ride.id)}
                    className="p-1 rounded hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
