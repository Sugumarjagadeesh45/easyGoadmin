// components/DriversTable.tsx
"use client";
import React from "react";

const drivers = [
  { id: 1, name: "Suresh", vehicle: "EV - Model X", number: "TN01AB1234", status: "online", earnings: 1200 },
  { id: 2, name: "Raja", vehicle: "Auto", number: "TN01CD5678", status: "offline", earnings: 850 },
];

export default function DriversTable() {
  return (
    <div className="bg-white rounded shadow-sm overflow-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left text-sm text-gray-600">#</th>
            <th className="p-3 text-left text-sm text-gray-600">Driver</th>
            <th className="p-3 text-left text-sm text-gray-600">Vehicle</th>
            <th className="p-3 text-left text-sm text-gray-600">Number</th>
            <th className="p-3 text-left text-sm text-gray-600">Status</th>
            <th className="p-3 text-left text-sm text-gray-600">Earnings</th>
            <th className="p-3 text-left text-sm text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="p-3 text-sm">{d.id}</td>
              <td className="p-3 text-sm">{d.name}</td>
              <td className="p-3 text-sm">{d.vehicle}</td>
              <td className="p-3 text-sm">{d.number}</td>
              <td className="p-3 text-sm">
                <span className={`px-2 py-1 rounded text-xs ${d.status === "online" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  {d.status}
                </span>
              </td>
              <td className="p-3 text-sm">₹{d.earnings}</td>
              <td className="p-3 text-sm">
                <button className="text-blue-600 hover:underline mr-2">Details</button>
                <button className="text-red-600 hover:underline">Disable</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
