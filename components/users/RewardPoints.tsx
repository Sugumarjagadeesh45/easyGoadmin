// D:\Sugumar\taxi-store\components\users\RewardPoints.tsx
"use client";
import React from "react";

interface RewardPointsProps {
  points: number;
}

export default function RewardPoints({ points }: RewardPointsProps) {
  return (
    <div className="bg-white p-6 rounded shadow border">
      <h3 className="text-lg font-semibold mb-4">Reward Points</h3>
      <div className="text-center">
        <p className="text-3xl font-bold text-blue-600">{points} Points</p>
      </div>
    </div>
  );
}
// "use client";
// import React from "react";

// interface RewardPointsProps {
//   points: number;
// }

// export default function RewardPoints({ points }: RewardPointsProps) {
//   return (
//     <div className="bg-white p-4 rounded shadow border mb-4">
//       <h2 className="text-lg font-semibold mb-2">Reward Points</h2>
//       <p className="text-xl font-bold text-green-600">{points} Points</p>
//     </div>
//   );
// }
