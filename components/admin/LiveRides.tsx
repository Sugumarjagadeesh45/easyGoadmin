// components/LiveRides.tsx
"use client";
import React from "react";

const sample = [
  { id: 101, from: "Erode", to: "Chennai", driver: "Suresh", eta: "22 min", status: "onride" },
  { id: 102, from: "Salem", to: "Coimbatore", driver: "Raja", eta: "5 min", status: "arrived" },
];

export default function LiveRides() {
  return (
    <div className="bg-white rounded shadow-sm p-4">
      <h3 className="font-semibold mb-3">Live Rides</h3>
      <ul className="space-y-2">
        {sample.map((r) => (
          <li key={r.id} className="flex justify-between items-center border p-3 rounded">
            <div>
              <div className="text-sm font-medium">#{r.id} — {r.from} → {r.to}</div>
              <div className="text-xs text-gray-500">Driver: {r.driver} · ETA: {r.eta}</div>
            </div>
            <div>
              <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">{r.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
