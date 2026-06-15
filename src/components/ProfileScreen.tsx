"use client";

import { Trophy, Career, calculateLevel, XP_PER_LEVEL } from "@/types/game";
import { GradientCard, AnimatedIcon } from "./ui/UIComponents";

interface ProfileScreenProps {
  trophies: Trophy[];
  xp: number;
  level: number;
  onBack: () => void;
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

const difficultyLabels: Record<string, string> = {
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
};

export default function ProfileScreen({ trophies, xp, level, onBack }: ProfileScreenProps) {
  // Get top 3 most prestigious trophies (sort by: achievement > hard difficulty > recent)
  const sortedTrophies = [...trophies].sort((a, b) => {
    // Achievements are most prestigious
    const isAchA = a.isSecret && a.achievementType;
    const isAchB = b.isSecret && b.achievementType;
    if (isAchA && !isAchB) return -1;
    if (!isAchA && isAchB) return 1;
    
    // Among same type, prefer harder difficulty
    const diffOrder = { hard: 3, medium: 2, easy: 1 };
    const diffDiff = (diffOrder[b.difficulty] || 0) - (diffOrder[a.difficulty] || 0);
    if (diffDiff !== 0) return diffDiff;
    
    // Most recent first
    return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
  });
  
  const top3Trophies = sortedTrophies.slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <GradientCard 
        gradient="from-purple-600 via-blue-600 to-indigo-600" 
        className="p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <AnimatedIcon animate="bounce" className="text-6xl mb-3 inline-block">👤</AnimatedIcon>
          <h2 className="text-3xl font-extrabold text-white mb-2">Your Profile</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="rounded-xl p-4 bg-white/10 text-center">
            <p className="text-4xl font-extrabold text-yellow-400 mb-1">⚡ Level {level}</p>
            <p className="text-white/70">{xp} XP Total</p>
          </div>

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