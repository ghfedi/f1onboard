import { type ReactNode } from "react";

import Menubar from "@/components/Menubar";
import IconLabelButton from "@/components/IconLabelButton";
import ThemeToggle from "../../../theme-toggle";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<div>
			<div className="sticky left-0 top-0 z-10 flex h-12 w-full items-center justify-between gap-4 border-b  p-2">
				<Menubar />

				<div className="hidden items-center gap-4 pr-2 sm:flex">
					<IconLabelButton icon="bmc" href="https://www.buymeacoffee.com/slowlydev">
						Coffee
					</IconLabelButton>

					<IconLabelButton icon="github" href="https://github.com/slowlydev/f1-dash">
						GitHub
					</IconLabelButton>
					<ThemeToggle/>
				</div>
			</div>

			{children}
		</div>
	);
}
