"use client";

import { Trophy, Career, Difficulty, XP_PER_LEVEL, calculateXPForNextLevel, getDailyChallenge } from "@/types/game";
import { GradientCard, AnimatedIcon } from "./ui/UIComponents";

interface ProfileScreenProps {
  trophies: Trophy[];
  xp: number;
  level: number;
  streak: number;
  onBack: () => void;
  onAcceptDailyChallenge?: (career: Career, difficulty: Difficulty) => void;
  completedToday?: boolean;
  isGuest?: boolean;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  currentUsername?: string;
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
  firefighter: "🚒",
  police: "👮",
  pilot: "✈️",
  veterinarian: "🐕",
  journalist: "📰",
  "social-worker": "🤝",
  accountant: "📊",
  dentist: "🦷",
  construction: "🏗️",
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
  firefighter: "Firefighter",
  police: "Police Officer",
  pilot: "Commercial Pilot",
  veterinarian: "Veterinarian",
  journalist: "Journalist",
  "social-worker": "Social Worker",
  accountant: "Accountant",
  dentist: "Dentist",
  construction: "Construction Manager",
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "🥉 Bronze",
  medium: "🥈 Silver",
  hard: "🥇 Gold",
};

const achievementNames: Record<string, string> = {
  "career-master": "Career Master",
  "quick-recall-champion": "Quick Recall Champion",
  "certification-master": "Certification Master",
  "all-careers-master": "All Careers Master",
  "all-certifications-master": "All Certifications Master",
  "perfect-recall": "Perfect Recall",
  "konami-master": "Konami Master",
  "all-quick-recalls-master": "All Quick Recalls Master",
  "lightning-reflex": "Lightning Reflex",
  "marathon-runner": "Marathon Runner",
  "speed-demon": "Speed Demon",
  "jack-of-all-trades": "Jack of All Trades",
  "lucky-star": "Lucky Star",
  "night-owl": "Night Owl",
  "early-bird": "Early Bird",
  "pi-pioneer": "Pi Pioneer",
  "pi-explorer": "Pi Explorer",
  "pi-master": "Pi Master",
  "pi-genius": "Pi Genius",
  "pi-legend": "Pi Legend",
  "state-week": "State Week",
  "today-checkin": "Today Check-in",
  "phoenix": "Phoenix",
  "keyboard-warrior": "Keyboard Warrior",
  "explorer": "Explorer",
  "patience": "Patience",
  "streak-master": "Streak Master",
  "return-customer": "Return Customer",
  "committed": "Committed",
  "tech-savvy": "Tech Savvy",
  "variety-pack": "Variety Pack",
  "second-chance": "Second Chance",
  "nationals": "Nationals Champion",
};

export default function ProfileScreen({ trophies, xp, level, streak, onBack, onAcceptDailyChallenge, completedToday, isGuest, onLogin, onSignup, onLogout, currentUsername }: ProfileScreenProps) {
  const sortedTrophies = [...trophies].sort((a, b) => {
    const isAchA = a.isSecret && a.achievementType;
    const isAchB = b.isSecret && b.achievementType;
    if (isAchA && !isAchB) return -1;
    if (!isAchA && isAchB) return 1;
    const diffOrder = { hard: 3, medium: 2, easy: 1 };
    const diffDiff = (diffOrder[b.difficulty] || 0) - (diffOrder[a.difficulty] || 0);
    if (diffDiff !== 0) return diffDiff;
    return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
  });

  const top3Trophies = sortedTrophies.slice(0, 3);
  const xpProgress = calculateXPForNextLevel(xp);
  const streakXP = Math.min((streak + 1) * 5, 50);
  const todayChallenge = getDailyChallenge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
      <GradientCard gradient="from-purple-600 via-blue-600 to-indigo-600" className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <AnimatedIcon animate="bounce" className="text-6xl mb-3 inline-block">👤</AnimatedIcon>
          <h2 className="text-3xl font-extrabold text-white mb-2">Your Profile</h2>
          {isGuest ? (
            <div className="mt-3 p-3 rounded-lg bg-amber-500/20 border border-amber-400/50">
              <p className="text-amber-200 text-sm font-semibold">⚠️ Guest Mode</p>
              <p className="text-amber-100/80 text-xs mt-1">Progress is only saved in this browser and won&apos;t sync across devices. Create an account to save permanently.</p>
            </div>
          ) : currentUsername ? (
            <p className="text-white/70 text-sm">Playing as <span className="text-yellow-300 font-bold">@{currentUsername}</span></p>
          ) : null}
        </div>

        {isGuest ? (
          <div className="space-y-3 mb-6">
            <button
              onClick={onSignup}
              className="w-full py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:scale-105 transition-transform"
            >
              ✨ Create Account
            </button>
            <button
              onClick={onLogin}
              className="w-full py-3 rounded-full bg-white/10 border-2 border-white/30 text-white font-bold hover:bg-white/20 transition-transform"
            >
              🔑 Log In
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="rounded-xl p-4 bg-white/10 text-center">
                <p className="text-4xl font-extrabold text-yellow-400 mb-1">⚡ Level {level}</p>
                <p className="text-white/70">{xp} XP Total</p>
                {xpProgress.needed > 0 && (
                  <div className="mt-3 max-w-xs mx-auto">
                    <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${(xpProgress.current / xpProgress.needed) * 100}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-sm mt-1">
                      {xpProgress.current} / {xpProgress.needed} XP to Level {level + 1}
                    </p>
                  </div>
                )}
                {streak > 0 && (
                  <p className="text-orange-300 text-sm mt-2">
                    🔥 {streak} day streak | +{streakXP} XP bonus available!
                  </p>
                )}
              </div>

              {onAcceptDailyChallenge && !completedToday && (
                <div className="rounded-xl p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                  <div className="inline-flex items-center gap-2 bg-orange-500/30 px-3 py-1 rounded-full mb-3">
                    <span className="text-orange-300 font-bold">🔥 Daily Challenge</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg mb-3">
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
              )}

              <div className="rounded-xl p-4 bg-white/10">
                <p className="text-white font-bold mb-3 flex items-center gap-2">
                  <span>🏆</span> Top 3 Prestigious Trophies
                </p>
                {top3Trophies.length === 0 ? (
                  <p className="text-white/60 text-sm">No trophies yet. Keep playing!</p>
                ) : (
                  <div className="space-y-2">
                    {top3Trophies.map((trophy, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{careerIcons[trophy.career]}</span>
                          <div className="text-left">
                            <p className="text-white font-semibold text-sm">
                              {trophy.achievementType
                                ? achievementNames[trophy.achievementType] || trophy.achievementType
                                : careerNames[trophy.career]
                              }
                            </p>
                            <p className="text-white/60 text-xs">
                              {trophy.difficulty && difficultyLabels[trophy.difficulty]}
                            </p>
                          </div>
                        </div>
                        <span className="text-yellow-400 font-bold text-lg">#{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl p-4 bg-white/10 text-center">
                <p className="text-white/70 text-sm">
                  Total Trophies: <span className="font-bold text-white">{trophies.length}</span>
                </p>
                <p className="text-white/70 text-sm mt-1">
                  Next Level: <span className="font-bold text-white">{XP_PER_LEVEL[level + 1] - xp} XP needed</span>
                </p>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full py-3 rounded-full bg-red-500/20 border border-red-400/50 text-red-300 font-bold hover:bg-red-500/30 transition-transform mb-2"
              >
                🚪 Log Out
              </button>
            )}
          </>
        )}

        <button
          onClick={onBack}
          className="w-full py-3 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold hover:scale-105 transition-transform"
        >
          Close
        </button>
      </GradientCard>
    </div>
  );
}