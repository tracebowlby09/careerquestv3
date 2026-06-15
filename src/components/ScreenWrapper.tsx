"use client";

import { useState } from "react";
import { audioSystem } from "@/lib/audio";
import { GradientCard, AnimatedIcon } from "./ui/UIComponents";

interface ScreenWrapperProps {
  children: React.ReactNode;
  onOpenSettings?: () => void;
  onExit?: () => void;
  dark?: boolean;
  showExitWarning?: boolean;
  fullScreen?: boolean;
  backgroundImage?: string;
}

export default function ScreenWrapper({ 
  children, 
  onOpenSettings, 
  onExit, 
  dark = false, 
  showExitWarning = false, 
  fullScreen = false, 
  backgroundImage 
}: ScreenWrapperProps) {
  const [showWarning, setShowWarning] = useState(false);

  const bgClass = backgroundImage 
    ? ""
    : dark 
      ? "bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" 
      : "bg-gradient-to-br from-slate-800 via-indigo-800 to-purple-900";

  const bgStyle = backgroundImage 
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }
    : {};

  const overlayClass = backgroundImage ? "bg-black/30 min-h-screen" : "";
  const containerClass = fullScreen 
    ? "min-h-screen" 
    : "min-h-screen p-4 md:p-8";

  const handleExitClick = () => {
    if (showExitWarning && onExit) {
      setShowWarning(true);
    } else if (onExit) {
      audioSystem.playClickSound();
      onExit();
    }
  };

  const handleConfirmExit = () => {
    audioSystem.playClickSound();
    setShowWarning(false);
    onExit?.();
  };

  const handleCancelExit = () => {
    audioSystem.playClickSound();
    setShowWarning(false);
  };

  return (
    <>
      <div className={`${bgClass} ${containerClass}`} style={bgStyle}>
        {fullScreen ? (
          <>
            <div className="fixed top-4 right-4 flex gap-3 z-10">
              {onOpenSettings && (
                <button
                  onClick={() => {
                    audioSystem.playClickSound();
                    onOpenSettings();
                  }}
                  className="rounded-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-xl"
                  title="Settings"
                >
                  <AnimatedIcon animate="none">⚙️</AnimatedIcon>
                </button>
              )}
              {onExit && (
                <button
                  onClick={handleExitClick}
                  className="rounded-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-red-500/30 transition-all duration-300 shadow-xl"
                  title="Exit to Title"
                >
                  <AnimatedIcon animate="none">🏠</AnimatedIcon>
                </button>
              )}
            </div>
            <div className={overlayClass}>
              {children}
            </div>
          </>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-end gap-3 mb-4">
              {onOpenSettings && (
                <button
                  onClick={() => {
                    audioSystem.playClickSound();
                    onOpenSettings();
                  }}
                  className="rounded-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-xl"
                  title="Settings"
                >
                  <AnimatedIcon animate="none">⚙️</AnimatedIcon>
                </button>
              )}
              {onExit && (
                <button
                  onClick={handleExitClick}
                  className="rounded-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-red-500/30 transition-all duration-300 shadow-xl"
                  title="Exit to Title"
                >
                  <AnimatedIcon animate="none">🏠</AnimatedIcon>
                </button>
              )}
            </div>
            {children}
          </div>
        )}
      </div>

      {showWarning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <GradientCard gradient="from-red-900/90 to-slate-900/90" className="p-8 max-w-md w-full border-2 border-red-500/50">
            <div className="text-center">
              <AnimatedIcon animate="pulse" className="text-7xl mb-4 inline-block">⚠️</AnimatedIcon>
              <h2 className="text-3xl font-bold text-white mb-4">Leave Test?</h2>
              <p className="text-gray-300 mb-4">
                <span className="text-red-400 font-bold">Warning:</span> If you leave now, all your progress on this test will be lost!
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to exit?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCancelExit}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                >
                  Continue Test
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                >
                  Exit Anyway
                </button>
              </div>
            </div>
          </GradientCard>
        </div>
      )}
    </>
  );
}