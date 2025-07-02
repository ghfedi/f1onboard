import { Metadata } from "next";

const title = "f1-onboard | Formula 1 live timing";
const description =
	"Experience live telemetry and timing data from Formula 1 races. Get insights into leaderboards, tire choices, gaps, lap times, sector times, team radios, and more.";

const url = "https://f1onboard.azurewebsites.net";

export const metadata: Metadata = {
	generator: "Next.js",

	applicationName: title,

	title,
	description,

	openGraph: {
		title,
		description,
		url,
		type: "website",
		siteName: "F1 Realtime Dashboard",
		images: [
			{
				alt: "Realtime Formula 1 Dashboard",
				url: `${url}/og-image.png`,
				width: 1200,
				height: 630,
			},
		],
	},

	twitter: {
		site: "@FadiGhribi",
		title,
		description,
		creator: "@FadiGhribi",
		card: "summary_large_image",
		images: [
			{
				url: `${url}/twitter-image.png`,
				alt: "Realtime Formula 1 Dashboard",
				width: 1200,
				height: 630,
			},
		],
	},

	category: "Sports & Recreation",

	referrer: "strict-origin-when-cross-origin",

	keywords: ["Formula 1", "f1 dashboard", "realtime telemetry", "f1 timing", "live updates"],

	creator: "FediGhribi",
	publisher: "FediGhribi",
	authors: [{ name: "FediGhribi" }],

	appleWebApp: {
		capable: true,
		title: "f1-onboard",
		statusBarStyle: "black-translucent",
	},

	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},

	assets: [`${url}/fonts`, `${url}/tires`, `${url}/icons`, `${url}/flags`, `${url}/country-flags`],

	metadataBase: new URL(url),

	alternates: {
		canonical: url,
	},

	manifest: "/manifest.json",
};
