"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Props = {
  speedData?: number[]; // Tableau des vitesses, index = temps/chronologie
  unit?: string; // km/h ou mph
};

export default function DriverChart({ speedData, unit = "km/h" }: Props) {
  if (!speedData || speedData.length === 0) return null;

  // Prépare les données pour le graphique
  const chartData = speedData.map((speed, idx) => ({ idx, speed }));

  return (
    <div className="w-full h-32 bg-zinc-900 rounded p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="idx" hide />
          <YAxis dataKey="speed" unit={unit} width={35} />
          <Tooltip formatter={(value: number) => `${value} ${unit}`} />
          <Line type="monotone" dataKey="speed" stroke="#3b82f6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
