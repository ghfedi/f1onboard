import { Suspense } from "react";

import Footer from "@/components/Footer";

import NextRound from "@/components/schedule/NextRound";
import FullSchedule from "@/components/schedule/FullSchedule";

export default async function SchedulePage() {
	return (
		<div className="container mx-auto max-w-screen-lg px-4">
			<div className="my-4">
				<h1 className="text-3xl">Up Next</h1>
				<p className="text-zinc-400">All times are local time</p>
			</div>

			<Suspense fallback={<NextRoundLoading />}>
				<NextRound />
			</Suspense>

			<div className="my-4">
				<h1 className="text-3xl">Schedule</h1>
				<p className="text-zinc-400">All times are local time</p>
			</div>

			<Suspense fallback={<FullScheduleLoading />}>
				<FullSchedule />
			</Suspense>

			<Footer />
		</div>
	);
}

const RoundLoading = () => {
	return (
		<div className="flex flex-col gap-1">
			<div className="h-12 w-full animate-pulse rounded-md bg-zinc-800" />

			<div className="grid grid-cols-3 gap-8 pt-1">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`day.${i}`} className="grid grid-rows-2 gap-2">
						<div className="h-12 w-full animate-pulse rounded-md bg-zinc-800" />
						<div className="h-12 w-full animate-pulse rounded-md bg-zinc-800" />
					</div>
				))}
			</div>
		</div>
	);
};

const NextRoundLoading = () => {
	return (
		<div className="grid h-44 grid-cols-1 gap-8 sm:grid-cols-2">
			<div className="flex flex-col gap-4">
				<div className="h-1/2 w-3/4 animate-pulse rounded-md bg-zinc-800" />
				<div className="h-1/2 w-3/4 animate-pulse rounded-md bg-zinc-800" />
			</div>

			<RoundLoading />
		</div>
	);
};

const FullScheduleLoading = () => {
	return (
		<div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
			{Array.from({ length: 6 }).map((_, i) => (
				<RoundLoading key={`round.${i}`} />
			))}
		</div>
	);
};
