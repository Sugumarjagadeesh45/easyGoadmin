"use client"  ;
import React from "react";
import { Pencil, Trash2 } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  status: "Live" | "Offline";
  totalPayment: number;
  settlement: number;
  hoursLive: number;
  location: string;
  active: boolean;
  dailyHours: number;
  vehicleType: string;
  dailyRides: number;
  loginTime: string;
  logoutTime: string;
}

const drivers: Driver[] = [
  {
    id: "DR001",
    name: "John Doe",
    status: "Live",
    totalPayment: 4500,
    settlement: 3000,
    hoursLive: 8,
    location: "Chennai",
    active: true,
    dailyHours: 6,
    vehicleType: "Sedan",
    dailyRides: 12,
    loginTime: "08:30 AM",
    logoutTime: "05:00 PM",
  },
  {
    id: "DR002",
    name: "Alex Kumar",
    status: "Offline",
    totalPayment: 3200,
    settlement: 2500,
    hoursLive: 5,
    location: "Bangalore",
    active: false,
    dailyHours: 4,
    vehicleType: "SUV",
    dailyRides: 8,
    loginTime: "09:00 AM",
    logoutTime: "03:00 PM",
  },
];

const DriversTable: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Drivers</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-sm">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Total Payment</th>
            <th className="p-3 text-left">Settlement</th>
            <th className="p-3 text-left">Hours Live</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Active</th>
            <th className="p-3 text-left">Daily Hours</th>
            <th className="p-3 text-left">Vehicle Type</th>
            <th className="p-3 text-left">Daily Rides</th>
            <th className="p-3 text-left">Login Time</th>
            <th className="p-3 text-left">Logout Time</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr
              key={driver.id}
              className="border-b hover:bg-gray-50 text-sm transition"
            >
              <td className="p-3">{driver.id}</td>
              <td className="p-3">{driver.name}</td>
              <td className={`p-3 font-medium ${driver.status === "Live" ? "text-green-600" : "text-red-500"}`}>
                {driver.status}
              </td>
              <td className="p-3">₹{driver.totalPayment}</td>
              <td className="p-3">₹{driver.settlement}</td>
              <td className="p-3">{driver.hoursLive} hrs</td>
              <td className="p-3">{driver.location}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    driver.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {driver.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-3">{driver.dailyHours} hrs</td>
              <td className="p-3">{driver.vehicleType}</td>
              <td className="p-3">{driver.dailyRides}</td>
              <td className="p-3">{driver.loginTime}</td>
              <td className="p-3">{driver.logoutTime}</td>
              <td className="p-3 flex justify-center gap-2">
                <button className="p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <Pencil size={16} />
                </button>
                <button className="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriversTable;
