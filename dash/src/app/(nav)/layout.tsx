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
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .glass {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          box-shadow: 0 8px 32px var(--glass-shadow);
        }
        
        .glass-strong {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, 
            #1e3c72 0%, 
            #2a5298 25%, 
            #667eea 50%, 
            #764ba2 75%, 
            #f093fb 100%);
        }
        
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }
      `}</style>

			{/* Animated Background */}
			<div className="fixed inset-0 gradient-bg">
				<div className="absolute inset-0 opacity-30">
					<div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
					<div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
					<div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
				</div>
			</div>
			<div className="  sticky left-0 top-0 z-10 flex h-12 w-full items-center justify-between gap-4 border-b border-zinc-800 bg-black p-2">
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

			{children}
		</div>
	);
}
