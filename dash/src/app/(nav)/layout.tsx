import { type ReactNode } from "react";

import Menubar from "@/components/Menubar";
import IconLabelButton from "@/components/IconLabelButton";

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<div className="min-h-screen relative overflow-hidden">
			<style>{`
        :root {
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
          --glass-shadow: rgba(0, 0, 0, 0.1);
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .glass-dark {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #FF1E42 0%, #FF6B35 25%, #00D4FF 50%, #7B68EE 75%, #FF1E42 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .neon-glow {
          box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
        }
      `}</style>

			{/* Animated Background */}
			<div className="fixed inset-0 gradient-bg">

			</div>
			<div className="  fixed top-6 left-6 right-6 z-50">
				<div className="glass rounded-2xl p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">

								<img
									src="/icons/logo.png"
									alt="F1 AI Stream Logo"

								/>

							<div>
								<p className="text-xs text-white/70">Next-Gen Racing</p>
							</div>
						</div>

						<Menubar />

				<div className="hidden items-center gap-4 pr-2 sm:flex">
					<IconLabelButton icon="bmc" href="https://buymeacoffee.com/fedighribi">
						Coffee
					</IconLabelButton>

					<IconLabelButton icon="github" href="https://github.com/ghfedi/">
						GitHub
					</IconLabelButton>
				</div>
					</div>
				</div>
			</div>

			{children}
		</div>
	);
}
