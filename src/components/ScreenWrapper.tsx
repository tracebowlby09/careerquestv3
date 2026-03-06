"use client";

import { audioSystem } from "@/lib/audio";

interface ScreenWrapperProps {
  children: React.ReactNode;
  onOpenSettings?: () => void;
  onExit?: () => void;
  dark?: boolean;
}

export default function ScreenWrapper({ children, onOpenSettings, onExit, dark = false }: ScreenWrapperProps) {
  const bgClass = dark 
    ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" 
    : "bg-gradient-to-br from-slate-700 via-indigo-800 to-gray-900";

  return (
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
              onClick={() => {
                audioSystem.playClickSound();
                onExit();
              }}
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
  );
}
