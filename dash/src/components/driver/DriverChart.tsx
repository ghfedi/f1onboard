import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CarDataChannels } from "@/types/state.type";
import { useSpeedPreference } from "@/context/SpeedPreferenceContext";
import React, { useMemo } from "react";

type Props = {
	carData: CarDataChannels | undefined;
};

function convertKmhToMph(kmhValue: number) {
	return Math.floor(Number(kmhValue) / 1.609344);
}

export default function DriverChart({ carData }: Props) {
	const { speedPreference } = useSpeedPreference();

	const speed = carData?.[2] || 0;

	const chartData = useMemo(() => {
		return [
			{
				idx: 0,
				speed: speedPreference === "km/h" ? speed : convertKmhToMph(speed),
			},
		];
	}, [speed, speedPreference]);

	const unit = speedPreference;

	if (!chartData.length) return null;

	return (
		<div className="h-32 w-full rounded p-2">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={chartData}>
					<XAxis dataKey="idx" hide />
					<YAxis dataKey="speed" unit={unit} width={35} tick={{ fill: "#fff", fontSize: 11 }} />
					<Tooltip formatter={(value: number) => `${value} ${unit}`} labelStyle={{ color: "#fff" }} />
					<Line type="monotone" dataKey="speed" stroke="#3b82f6" dot={false} strokeWidth={2} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
