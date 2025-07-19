import { CarDataChannels } from "@/types/state.type";

import DriverPedals from "./DriverPedals";
import { useSpeedPreference } from "@/context/SpeedPreferenceContext";

type Props = {
	carData: CarDataChannels;
};

function convertKmhToMph(kmhValue: number) {
	return Math.floor(kmhValue / 1.609344);
}

export default function DriverCarMetrics({ carData }: Props) {
	const { speedPreference } = useSpeedPreference();

	// Vérifications de sécurité pour éviter l'erreur TypeError
	if (!carData) {
		return (
			<div className="flex items-center gap-2 place-self-start">
				<div className="text-zinc-400 text-sm">No car data</div>
			</div>
		);
	}

	// Valeurs par défaut sécurisées
	const gear = carData["3"] ?? 0;
	const speed = carData["2"] ?? 0;
	const brake = carData["5"] ?? 0;
	const throttle = carData["4"] ?? 0;
	const rpm = carData["0"] ?? 0;

	return (
		<div className="flex items-center gap-2 place-self-start">
			<p className="flex h-8 w-8 items-center justify-center font-mono text-lg">{gear}</p>

			<div>
				<p className="text-right font-mono font-medium leading-none">
					{speedPreference === "km/h" ? speed : convertKmhToMph(speed)}
				</p>
				<p className="text-sm leading-none text-zinc-400">{speedPreference}</p>
			</div>

			<div className="flex flex-col">
				<div className="flex flex-col gap-1">
					<DriverPedals className="bg-red-500" value={brake} maxValue={1} />
					<DriverPedals className="bg-emerald-500" value={throttle} maxValue={100} />
					<DriverPedals className="bg-blue-500" value={rpm} maxValue={15000} />
				</div>
			</div>
		</div>
	);
}
