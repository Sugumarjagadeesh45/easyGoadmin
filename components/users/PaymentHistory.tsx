// D:\Sugumar\taxi-store\components\users\PaymentHistory.tsx
"use client";
import React from "react";

interface Payment {
  date: string;
  amount: number;
  method: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  return (
    <div className="bg-white p-6 rounded shadow border">
      <h3 className="text-lg font-semibold mb-4">Payment History</h3>
      {payments.length === 0 ? (
        <p className="text-gray-500">No payment history available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm text-gray-600">Date</th>
                <th className="p-3 text-left text-sm text-gray-600">Amount</th>
                <th className="p-3 text-left text-sm text-gray-600">Method</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 text-sm">{payment.date}</td>
                  <td className="p-3 text-sm">${payment.amount}</td>
                  <td className="p-3 text-sm">{payment.method}</td>
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

// interface Payment {
//   date: string;
//   amount: number;
//   method: string;
// }

// interface PaymentHistoryProps {
//   payments: Payment[];
// }

// export default function PaymentHistory({ payments }: PaymentHistoryProps) {
//   return (
//     <div className="bg-white p-4 rounded shadow border mb-4">
//       <h2 className="text-lg font-semibold mb-2">Payment History</h2>
//       <table className="w-full border">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border p-2">Date</th>
//             <th className="border p-2">Amount</th>
//             <th className="border p-2">Method</th>
//           </tr>
//         </thead>
//         <tbody>
//           {payments.map((pay, i) => (
//             <tr key={i}>
//               <td className="border p-2">{pay.date}</td>
//               <td className="border p-2">₹{pay.amount}</td>
//               <td className="border p-2">{pay.method}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
