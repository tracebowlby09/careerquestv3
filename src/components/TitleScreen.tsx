"use client";

import { audioSystem } from "@/lib/audio";
import { GameMode, calculateXPForNextLevel, Career, Difficulty, getDailyChallenge } from "@/types/game";
import { GameButton, GradientCard, AnimatedIcon } from "./ui/UIComponents";

interface TitleScreenProps {
  onStart: (mode: GameMode) => void;
  onOpenSettings: () => void;
  onViewTrophies: () => void;
  onViewStats: () => void;
  onOpenProfile: () => void;
  level: number;
  xp: number;
  streak: number;
  completedToday: boolean;
  onAcceptDailyChallenge: (career: Career, difficulty: Difficulty) => void;
}

const careerIcons: Record<Career, string> = {
  programmer: "💻",
  nurse: "🏥",
  engineer: "🏗️",
  teacher: "📚",
  chef: "👨‍🍳",
  architect: "🏛️",
  lawyer: "⚖️",
  retail: "🛍️",
  electrician: "⚡",
};

const careerNames: Record<Career, string> = {
  programmer: "Programmer",
  nurse: "Nurse",
  engineer: "Engineer",
  teacher: "Teacher",
  chef: "Chef",
  architect: "Architect",
  lawyer: "Lawyer",
  retail: "Retail Worker",
  electrician: "Electrician",
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "🥉 Bronze",
  medium: "🥈 Silver",
  hard: "🥇 Gold",
};

export default function TitleScreen({ onStart, onOpenSettings, onViewTrophies, onViewStats, onOpenProfile, level, xp, streak, completedToday, onAcceptDailyChallenge }: TitleScreenProps) {
  const handleStart = (mode: GameMode) => {
    audioSystem.playClickSound();
    onStart(mode);
  };

  const xpProgress = calculateXPForNextLevel(xp);
  const todayChallenge = getDailyChallenge();
  const streakXP = Math.min((streak + 1) * 5, 50);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full relative z-10">
        {/* Profile Button - Top Right */}
        <button
          onClick={onOpenProfile}
          className="absolute top-4 right-4 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-500/30 backdrop-blur-sm text-white font-bold hover:scale-110 transition-transform"
          title="View Profile"
        >
          <span className="text-2xl">👤</span>
          <span className="hidden md:inline">Level {level}</span>
        </button>
        
        <GradientCard className="p-10 md:p-16 text-center" gradient="from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <div className="mb-8">
            <AnimatedIcon animate="bounce" className="text-7xl mb-6 inline-block">🎯</AnimatedIcon>
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4 tracking-tight">
              Career Quest
            </h1>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 backdrop-blur-sm px-6 py-3 rounded-full mb-4">
              <span className="text-yellow-400 font-bold">⚡ Level {level}</span>
              <span className="text-white/80 font-medium">| {xp} XP</span>
            </div>
            
            <div className="max-w-md mx-auto mb-6">
              <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress.needed > 0 ? (xpProgress.current / xpProgress.needed) * 100 : 100}%` }}
                />
              </div>
              {streak > 0 && (
                <p className="text-white/60 text-sm mt-1">
                  🔥 {streak} day streak | +{streakXP} XP bonus
                </p>
              )}
            </div>
            
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

          {!completedToday && (
            <div className="mt-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/30 to-red-500/30 backdrop-blur-sm px-6 py-3 rounded-full mb-4">
                <span className="text-orange-300 font-bold">🔥 Daily Challenge</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-3xl">{careerIcons[todayChallenge.career]}</span>
                  <div className="text-left">
                    <p className="font-bold text-white">{careerNames[todayChallenge.career]}</p>
                    <p className="text-white/70 text-sm">{difficultyLabels[todayChallenge.difficulty]} Challenge</p>
                    <p className="text-orange-300 text-sm">+ {streakXP} XP Streak Bonus!</p>
                  </div>
                </div>
                <button
                  onClick={() => onAcceptDailyChallenge(todayChallenge.career, todayChallenge.difficulty)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg hover:scale-105 transition-transform"
                >
                  🎮 Accept Challenge
                </button>
              </div>
            </div>
          )}

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
          
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                audioSystem.playClickSound();
                onViewStats();
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-blue-400/50 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 text-blue-300 font-bold text-lg hover:from-blue-400/30 hover:to-indigo-500/30 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              📊 Stats & Analytics
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