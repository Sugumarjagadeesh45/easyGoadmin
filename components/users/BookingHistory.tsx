// D:\Sugumar\taxi-store\components\users\BookingHistory.tsx
"use client";
import React from "react";

interface Booking {
  date: string;
  time: string;
  travelTime: string;
  from: string;
  to: string;
}

interface BookingHistoryProps {
  bookings: Booking[];
}

export default function BookingHistory({ bookings }: BookingHistoryProps) {
  return (
    <div className="bg-white p-6 rounded shadow border">
      <h3 className="text-lg font-semibold mb-4">Booking History</h3>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No booking history available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm text-gray-600">Date</th>
                <th className="p-3 text-left text-sm text-gray-600">Time</th>
                <th className="p-3 text-left text-sm text-gray-600">Travel Time</th>
                <th className="p-3 text-left text-sm text-gray-600">From</th>
                <th className="p-3 text-left text-sm text-gray-600">To</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 text-sm">{booking.date}</td>
                  <td className="p-3 text-sm">{booking.time}</td>
                  <td className="p-3 text-sm">{booking.travelTime}</td>
                  <td className="p-3 text-sm">{booking.from}</td>
                  <td className="p-3 text-sm">{booking.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
// "use client";
// import React from "react";

// interface Booking {
//   date: string;
//   time: string;
//   travelTime: string;
//   from: string;
//   to: string;
// }

// interface BookingHistoryProps {
//   bookings: Booking[];
// }

// export default function BookingHistory({ bookings }: BookingHistoryProps) {
//   return (
//     <div className="bg-white p-4 rounded shadow border mb-4">
//       <h2 className="text-lg font-semibold mb-2">Booking History</h2>
//       <table className="w-full border">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border p-2">Date</th>
//             <th className="border p-2">Time</th>
//             <th className="border p-2">Travel Time</th>
//             <th className="border p-2">From</th>
//             <th className="border p-2">To</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((b, i) => (
//             <tr key={i}>
//               <td className="border p-2">{b.date}</td>
//               <td className="border p-2">{b.time}</td>
//               <td className="border p-2">{b.travelTime}</td>
//               <td className="border p-2">{b.from}</td>
//               <td className="border p-2">{b.to}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
