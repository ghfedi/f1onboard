export type WindowKey =
	| "rcm"
	| "track-map"
	| "lap-series"
	| "tire-pace"
	| "head-to-head"
	| "track-limits"
	| "battle-mode"
	| "team-radios";

export type Window = {
	key: WindowKey;
	label: string;
};

export const windows: Window[] = [
	{
		key: "rcm",
		label: "Race Control Messages",
	},
	{
		key: "track-map",
		label: "Track Map",
	},
	{
		key: "team-radios",
		label: "Team Radios",
	},
	{
		key: "track-limits",
		label: "Track Limits Tracker",
	},
	{
	 	key: "battle-mode",
		label: "Battle Mode",
	 },
	// {
	// 	key: "tire-pace",
	// 	label: "🚧 Tire Pace Comparison",
	// },
	// {
	// 	key: "head-to-head",
	// 	label: "🚧 Head-to-Head",
	// },
];
