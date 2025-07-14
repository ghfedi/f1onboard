import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TimingStatsDriver, Message, Driver } from "@/types/state.type";

type Props = {
	fastestLapDriver: TimingStatsDriver | undefined;
	latestRaceControlMessage: Message | undefined;
	fastestdriver: Driver | undefined;
};

export default function FastestLapOverlay({ fastestLapDriver, latestRaceControlMessage, fastestdriver }: Props) {
	const [overallFastestLap, setOverallFastestLap] = useState<TimingStatsDriver | undefined>(fastestLapDriver);
	const [displayedMessage, setDisplayedMessage] = useState<Message | undefined>(latestRaceControlMessage);
	const [showFastestLap, setShowFastestLap] = useState<boolean>(false);

	useEffect(() => {
		if (showFastestLap) {
			const timer = setTimeout(() => setShowFastestLap(false), 5000);
			return () => clearTimeout(timer);
		}
	}, [showFastestLap]);


	useEffect(() => {
		if (latestRaceControlMessage) {
			setDisplayedMessage(latestRaceControlMessage);
			const timer = setTimeout(() => setDisplayedMessage(undefined), 8000);
			return () => clearTimeout(timer);
		}
	}, [latestRaceControlMessage]);

	useEffect(() => {
		if (
			fastestLapDriver &&
			(!overallFastestLap || fastestLapDriver.personalBestLapTime.value < overallFastestLap.personalBestLapTime.value)
		) {
			setOverallFastestLap(fastestLapDriver);
			setShowFastestLap(true); // Le second useEffect démarre alors le timer
		}
	}, [fastestLapDriver, overallFastestLap]);

	return (
		<div className="z-50 p-0">
			<AnimatePresence>
				 {showFastestLap && overallFastestLap && fastestdriver && (
                    <motion.div
                        key="fastestLap"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        style={{ backgroundImage: `url('https://cdn.animaapp.com/projects/671282d572d2d77050fbb37d/releases/6712864285c7960cfebf0bbc/img/bg-1.svg')`, backgroundSize: 'cover' }}

                        className="font-formula1 text-2xl  p-2 mb-2 rounded"
                    >
                        Fastest Lap- <span style={{ color: `#${fastestdriver.teamColour}` }}>{fastestdriver.lastName}</span> - {overallFastestLap.personalBestLapTime.value}
                    </motion.div>
                )}
				{displayedMessage && (
					<motion.div
						key="raceControl"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
						className="px-2 font-formula1 text-blue-950"
					>
						<div className={`flex items-center justify-between rounded-xl bg-blue-950 px-1.5`}>
							<img
								src="https://cdn.animaapp.com/projects/671282d572d2d77050fbb37d/releases/6712864285c7960cfebf0bbc/img/fia-logo.png"
								alt="FIA Logo"
								className="h-12 w-12 p-1"
							/>
							<div style={{ backgroundImage: `url('')`, backgroundSize: "cover" }} className="pr-2 text-white">
								Race Control
							</div>
							<span className={`rounded-xl bg-white px-2 text-blue-950`}>{displayedMessage.message}</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
