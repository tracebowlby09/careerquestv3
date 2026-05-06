"use client";

import { Trophy, Career, Difficulty, AchievementType } from "@/types/game";

interface TrophyShelfProps {
  title: string;
  icon: string;
  trophies: Trophy[];
  totalSlots: number;
  career?: Career;
  isNight: boolean;
  onTrophyClick: (trophy: Trophy | { locked: true; career?: Career; difficulty?: Difficulty; achievementType?: AchievementType }) => void;
}

export default function TrophyShelf({
  title,
  icon,
  trophies,
  totalSlots,
  career,
  isNight,
  onTrophyClick,
}: TrophyShelfProps) {
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];
  
  const slotCount = Math.min(totalSlots, 3);
  const slots = Array.from({ length: slotCount }, (_, i) => {
    let earnedTrophy: Trophy | undefined;
    
    if (career) {
      const difficulty = difficulties[i];
      earnedTrophy = trophies.find(
        (t) => t.career === career && t.difficulty === difficulty
      );
    }
    
    return {
      index: i,
      trophy: earnedTrophy,
      difficulty: career ? difficulties[i] : undefined,
    };
  });

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-3 px-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">
          {title}
        </h3>
        <span className="text-sm text-amber-700 dark:text-amber-300">
          ({trophies.length}/{slotCount})
        </span>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 
                        rounded-lg shadow-lg border-4 border-amber-900"
        />

        <div className="relative overflow-x-auto py-6 px-4">
          <div className="flex gap-6" style={{ width: "max-content" }}>
            {slots.map((slot) => {
              const isEarned = !!slot.trophy;
              
              return (
                <div
                  key={`${career}-${slot.index}`}
                  className="flex-shrink-0 w-24 h-32 relative group"
                >
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-3 
                                  bg-gradient-to-b from-amber-950 to-black rounded-full
                                  shadow-lg z-0"
                  />

                  <button
                    onClick={() => {
                      if (isEarned) {
                        onTrophyClick(slot.trophy!);
                      } else if (career) {
                        onTrophyClick({
                          locked: true,
                          career,
                          difficulty: slot.difficulty,
                        });
                      }
                    }}
                    className={`relative w-full h-full flex flex-col items-center justify-end
                      transition-all duration-300 z-10
                      ${isEarned
                        ? "cursor-pointer hover:scale-110 hover:-translate-y-2"
                        : "cursor-pointer hover:scale-105 opacity-60 hover:opacity-100"
                      }
                    `}
                  >
                    <div className="relative mb-2">
                      {isEarned ? (
                        <div className="text-6xl drop-shadow-xl">
                          {getTrophyEmoji(slot.trophy!)}
                        </div>
                      ) : (
                        <div className="text-6xl filter grayscale contrast-125">
                          🔒
                        </div>
                      )}
                    </div>

                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 
                                    bg-black/90 text-amber-200 text-xs px-3 py-1.5 rounded-lg
                                    opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                                    z-20 shadow-xl border border-amber-600/50 whitespace-nowrap">
                      {isEarned
                        ? `${careerNames[career!]} • ${difficultyLabels[slot.difficulty!]}`
                        : "🔒 Click for hint"
                      }
                    </div>

                    {isEarned && (
                      <div className="absolute inset-0 blur-2xl opacity-20 
                                      bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-600 
                                      pointer-events-none"
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute top-1 left-4 right-4 h-1 bg-gradient-to-b from-amber-500/30 to-transparent rounded-full" />
        <div className="absolute bottom-1 left-4 right-4 h-1 bg-gradient-to-t from-black/60 to-transparent rounded-full" />
      </div>
    </div>
  );
}

function getTrophyEmoji(trophy: Trophy): string {
  if (trophy.isSecret && trophy.achievementType) {
    return getSecretEmoji(trophy.achievementType);
  }
  
  const careerEmojis: Record<Career, string> = {
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
  
  const medalEmojis: Record<Difficulty, string> = {
    easy: "🥉",
    medium: "🥈",
    hard: "🥇",
  };
  
  return `${careerEmojis[trophy.career]}${medalEmojis[trophy.difficulty]}`;
}

function getSecretEmoji(type: string): string {
  const emojis: Record<string, string> = {
    "konami-master": "👾",
    "career-master": "👑",
    "quick-recall-champion": "⚡",
    "perfect-recall": "🎯",
    "all-careers-master": "🌟",
    "all-quick-recalls-master": "🏅",
    "lightning-reflex": "⚡",
    "marathon-runner": "🏃",
    "speed-demon": "🔥",
    "jack-of-all-trades": "🎭",
    "lucky-star": "🍀",
    "night-owl": "🦉",
    "early-bird": "🐦",
    "pi-pioneer": "🥧",
    "pi-explorer": "🔢",
    "pi-master": "🧮",
    "pi-genius": "💡",
    "pi-legend": "🏆",
    "state-week": "🗽",
    "today-checkin": "📅",
    "phoenix": "🔥",
    "keyboard-warrior": "⌨️",
    "explorer": "🧭",
    "patience": "⏳",
    "streak-master": "🔥",
    "return-customer": "🔄",
    "committed": "⏰",
    "tech-savvy": "⚙️",
    "variety-pack": "📦",
    "second-chance": "🔄",
  };
  return emojis[type] || "🏆";
}

const careerNames: Record<Career, string> = {
  programmer: "Programmer",
  nurse: "Nurse",
  engineer: "Engineer",
  teacher: "Teacher",
  chef: "Chef",
  architect: "Architect",
  lawyer: "Lawyer",
  retail: "Retail",
  electrician: "Electrician",
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Bronze",
  medium: "Silver",
  hard: "Gold",
};
