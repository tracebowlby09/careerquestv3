"use client";

import { audioSystem } from "@/lib/audio";
import { GameMode } from "@/types/game";

interface TitleScreenProps {
  onStart: (mode: GameMode) => void;
  onOpenSettings: () => void;
  onViewTrophies: () => void;
}

export default function TitleScreen({ onStart, onOpenSettings, onViewTrophies }: TitleScreenProps) {
  const handleStart = (mode: GameMode) => {
    audioSystem.initialize();
    audioSystem.startBackgroundMusic();
    audioSystem.playClickSound();
    onStart(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 flex items-center justify-center p-4 relative">
      <button
        onClick={() => {
          audioSystem.playClickSound();
          onOpenSettings();
        }}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
        title="Settings"
      >
        ⚙️
      </button>
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Career Quest
        </h1>
        
        <div className="mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-xl text-gray-700 mb-4">
            Explore careers through interactive challenges
          </p>
          <p className="text-gray-600">
            Step into different career worlds, complete skill-based tasks, 
            and discover what each profession requires.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleStart("challenge")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-bold py-4 px-12 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 w-full"
          >
            🎮 Challenge Mode
          </button>
          
          <button
            onClick={() => handleStart("quick-recall")}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xl font-bold py-4 px-12 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 w-full"
          >
            ⚡ Quick Recall
          </button>

          <button
            onClick={() => handleStart("simulation")}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xl font-bold py-4 px-12 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 w-full"
          >
            🔬 Career Simulation
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Choose your path. Learn real skills. Shape your future.
        </div>

        <button
          onClick={() => {
            audioSystem.playClickSound();
            onViewTrophies();
          }}
          className="mt-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold py-3 px-8 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          🏆 View Trophies
        </button>
      </div>
    </div>
  );
}
