"use client";

import { audioSystem } from "@/lib/audio";
import { GameMode } from "@/types/game";
import { GameButton, GradientCard, AnimatedIcon, Confetti } from "./ui/UIComponents";
import { useState, useEffect } from "react";

interface TitleScreenProps {
  onStart: (mode: GameMode) => void;
  onOpenSettings: () => void;
  onViewTrophies: () => void;
}

export default function TitleScreen({ onStart, onOpenSettings, onViewTrophies }: TitleScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    audioSystem.initialize();
    audioSystem.playTitleMusic();
    const timer = setTimeout(() => setShowConfetti(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = (mode: GameMode) => {
    audioSystem.playClickSound();
    onStart(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      <Confetti show={showConfetti} />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '8s' }}></div>
      </div>
      
      <div className="max-w-3xl w-full relative z-10">
        <div className="absolute top-0 right-0 animate-fadeIn">
          <button
            onClick={() => {
              audioSystem.playClickSound();
              onOpenSettings();
            }}
            className="rounded-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-xl"
            title="Settings"
          >
            <AnimatedIcon animate="spin" className="text-2xl">⚙️</AnimatedIcon>
          </button>
        </div>
        
        <GradientCard className="p-10 md:p-16 text-center" gradient="from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <div className="mb-8">
            <AnimatedIcon animate="bounce" className="text-7xl mb-6 inline-block">🎯</AnimatedIcon>
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4 tracking-tight">
              Career Quest
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl mx-auto">
              Explore careers through interactive challenges. Master real-world skills across 9 exciting career paths.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <span className="text-amber-400">✨</span>
              <span className="text-white/80 font-medium">From coding to cooking, nursing to engineering</span>
            </div>
          </div>

          <div className="grid gap-4 max-w-lg mx-auto">
            <GameButton onClick={() => handleStart("challenge")} className="text-xl relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center gap-3">
                🎮 Challenge Mode
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </GameButton>
            
            <GameButton 
              onClick={() => handleStart("quick-recall")} 
              className="text-xl bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                ⚡ Quick Recall
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </GameButton>

            <GameButton 
              onClick={() => handleStart("certification")} 
              className="text-xl bg-gradient-to-r from-purple-500 to-pink-600 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                📜 Certification Mode
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </GameButton>
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                audioSystem.playClickSound();
                onViewTrophies();
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-amber-400/50 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-300 font-bold text-lg hover:from-amber-400/30 hover:to-yellow-500/30 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              🏆 View Trophy Case
            </button>
          </div>
          
          <div className="mt-8 text-sm text-white/60">
            Choose your path. Learn real skills. Shape your future.
          </div>
        </GradientCard>
      </div>
    </div>
  );
}