"use client";

import { useState, useEffect } from "react";
import { Trophy, Career, Difficulty, AchievementType } from "@/types/game";
import TrophyShelf from "./TrophyShelf";
import TrophyDetailModal from "./TrophyDetailModal";

const CAREER_ICONS: Record<Career, string> = {
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

const CAREER_NAMES: Record<Career, string> = {
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

export default function TrophyCase({ trophies, onBack }: { trophies: Trophy[]; onBack: () => void }) {
  const [selectedTrophy, setSelectedTrophy] = useState<Trophy | { locked: true; career?: Career; difficulty?: Difficulty; achievementType?: AchievementType }>(null);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour >= 18 || hour < 6);
  }, []);

  const regularTrophies = trophies.filter(t => !t.isSecret);
  const secretTrophies = trophies.filter(t => t.isSecret);

  const careers: Career[] = [
    "programmer", "nurse", "engineer", "teacher",
    "chef", "architect", "lawyer", "retail", "electrician"
  ];

  const handleTrophyClick = (
    trophy: Trophy | { locked: true; career?: Career; difficulty?: Difficulty; achievementType?: AchievementType }
  ) => {
    setSelectedTrophy(trophy);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-orange-50 
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8
                    transition-colors duration-1000"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100">
            Trophy Case
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {trophies.length} trophy{trophies.length !== 1 ? "ies" : "i"} earned
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsNight(!isNight)}
            className="bg-amber-200 dark:bg-gray-700 hover:bg-amber-300 dark:hover:bg-gray-600 
                       text-amber-900 dark:text-amber-100 px-4 py-2 rounded-full 
                       transition-all shadow-md border-2 border-amber-400 dark:border-gray-500"
          >
            {isNight ? "☀️ Day Mode" : "🌙 Night Mode"}
          </button>
        </div>

        <div className="bg-amber-50/50 dark:bg-gray-800/50 rounded-2xl p-6 
                        border-2 border-amber-200 dark:border-gray-700 shadow-xl"
        >
          {trophies.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                No trophies yet!
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Complete career challenges to start your collection.
              </p>
              <button
                onClick={onBack}
                className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-lg"
              >
                ← Back to Menu
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-6 flex items-center gap-2">
                  <span>🎖️</span> Career Mastery
                </h2>

                {careers.map((career) => {
                  const careerTrophies = regularTrophies.filter(
                    (t) => t.career === career
                  );

                  return (
                    <div
                      key={career}
                      className="mb-2 p-3 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 
                                 border-2 border-amber-200 dark:border-amber-800"
                    >
                      <TrophyShelf
                        title={CAREER_NAMES[career]}
                        icon={CAREER_ICONS[career]}
                        trophies={careerTrophies}
                        totalSlots={3}
                        career={career}
                        isNight={isNight}
                        onTrophyClick={handleTrophyClick}
                      />
                    </div>
                  );
                })}
              </div>

              {secretTrophies.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6 flex items-center gap-2">
                    <span>🔮</span> Secret Achievements
                  </h2>

                  <div className="bg-purple-50/50 dark:bg-purple-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
                    <TrophyShelf
                      title="Hidden Trophies"
                      icon="🌟"
                      trophies={secretTrophies}
                      totalSlots={30}
                      isNight={isNight}
                      onTrophyClick={handleTrophyClick}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 
                       text-white font-bold px-8 py-3 rounded-lg transition-all shadow-lg"
          >
            ← Back to Menu
          </button>
        </div>

        {selectedTrophy && (
          <TrophyDetailModal
            trophy={selectedTrophy}
            onClose={() => setSelectedTrophy(null)}
          />
        )}
      </div>
    </div>
  );
}
