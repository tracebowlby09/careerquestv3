"use client";

import { useState } from "react";
import { audioSystem } from "@/lib/audio";

interface ScreenWrapperProps {
  children: React.ReactNode;
  onOpenSettings?: () => void;
  onExit?: () => void;
  dark?: boolean;
  showExitWarning?: boolean;
}

export default function ScreenWrapper({ children, onOpenSettings, onExit, dark = false, showExitWarning = false }: ScreenWrapperProps) {
  const [showWarning, setShowWarning] = useState(false);
  
  const bgClass = dark 
    ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" 
    : "bg-gradient-to-br from-slate-700 via-indigo-800 to-gray-900";

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
      <div className={`min-h-screen ${bgClass} p-4 md:p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end gap-2 mb-4">
            {onOpenSettings && (
              <button
                onClick={() => {
                  audioSystem.playClickSound();
                  onOpenSettings();
                }}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                title="Settings"
              >
                ⚙️
              </button>
            )}
            {onExit && (
              <button
                onClick={handleExitClick}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                title="Exit to Title"
              >
                🚪
              </button>
            )}
          </div>
          {children}
        </div>
      </div>

      {/* Exit Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-red-900 to-slate-900 border-2 border-red-500 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-white mb-4">Leave Test?</h2>
              <p className="text-gray-300 mb-6">
                <strong className="text-red-400">Warning:</strong> If you leave now, all your progress on this test will be lost!
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to exit?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCancelExit}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-semibold transition-colors"
                >
                  Continue Test
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-colors"
                >
                  Exit Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
