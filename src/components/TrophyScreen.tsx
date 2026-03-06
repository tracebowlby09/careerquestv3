"use client";

import { Trophy, Career, Difficulty, AchievementType } from "@/types/game";

interface TrophyScreenProps {
  trophies: Trophy[];
  onBack: () => void;
}

const careerNames: Record<Career, string> = {
  programmer: "Programmer",
  nurse: "Nurse",
  engineer: "Engineer",
  teacher: "Teacher",
  chef: "Chef",
  architect: "Architect",
};

const careerIcons: Record<Career, string> = {
  programmer: "💻",
  nurse: "🏥",
  engineer: "🏗️",
  teacher: "📚",
  chef: "👨‍🍳",
  architect: "🏛️",
};

const SECRET_TROPHY_ID = "konami-master";

interface SecretTrophyDisplay {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const secretTrophies: SecretTrophyDisplay[] = [
  {
    id: SECRET_TROPHY_ID,
    name: "Konami Code Master",
    description: "Entered the legendary Konami code",
    icon: "👾",
  },
  {
    id: "career-master",
    name: "Career Master",
    description: "Earned all trophies for a career",
    icon: "👑",
  },
  {
    id: "quick-recall-champion",
    name: "Quick Recall Champion",
    description: "Completed Quick Recall mode",
    icon: "⚡",
  },
  {
    id: "perfect-recall",
    name: "Perfect Recall",
    description: "Got all Quick Recall questions right",
    icon: "🎯",
  },
  {
    id: "all-careers-master",
    name: "Ultimate Career Master",
    description: "Completed all difficulties for ALL careers",
    icon: "🌟",
  },
  {
    id: "all-quick-recalls-master",
    name: "Quick Recall Legend",
    description: "Completed Quick Recall for ALL careers",
    icon: "🏅",
  },
];

const getAchievementInfo = (achievementType?: AchievementType): SecretTrophyDisplay | undefined => {
  if (!achievementType) return undefined;
  return secretTrophies.find((s) => s.id === achievementType);
};

const isSecretTrophyUnlocked = (trophy: Trophy): boolean => {
  return trophy.isSecret === true;
};

const difficultyColors: Record<Difficulty, string> = {
  easy: "from-green-400 to-emerald-500",
  medium: "from-yellow-400 to-orange-500",
  hard: "from-purple-400 to-pink-500",
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Bronze",
  medium: "Silver",
  hard: "Gold",
};

const difficultyIcons: Record<Difficulty, string> = {
  easy: "🥉",
  medium: "🥈",
  hard: "🥇",
};

export default function TrophyScreen({ trophies, onBack }: TrophyScreenProps) {
  // Group trophies by career
  const trophiesByCareer = trophies.reduce((acc, trophy) => {
    if (!acc[trophy.career]) {
      acc[trophy.career] = [];
    }
    acc[trophy.career].push(trophy);
    return acc;
  }, {} as Record<Career, Trophy[]>);

  // Separate secret trophies from regular trophies
  const regularTrophies = trophies.filter((t) => !t.isSecret);
  const secretTrophiesList = trophies.filter((t) => t.isSecret);

  const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect"];
  const earnedCareers = new Set(regularTrophies.map((t) => t.career));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Trophy Case
            </h2>
            <p className="text-gray-600">
              You have earned {trophies.length} trophy{trophies.length !== 1 ? "s" : ""}!
            </p>
          </div>

          {trophies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-xl text-gray-600 mb-4">
                No trophies yet!
              </p>
              <p className="text-gray-500">
                Complete career challenges to earn trophies.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allCareers.map((career) => {
                const careerTrophies = trophiesByCareer[career] || [];
                const hasTrophies = careerTrophies.length > 0;
                
                return (
                  <div
                    key={career}
                    className={`border-2 rounded-xl p-4 ${
                      hasTrophies
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{careerIcons[career]}</span>
                      <span className="text-xl font-bold text-gray-800">
                        {careerNames[career]}
                      </span>
                    </div>
                    
                    {hasTrophies ? (
                      <div className="space-y-2">
                        {careerTrophies.map((trophy, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between bg-gradient-to-r ${difficultyColors[trophy.difficulty]} text-white px-4 py-2 rounded-lg`}
                          >
                            <span className="font-semibold">
                              {difficultyLabels[trophy.difficulty]}
                            </span>
                            <span className="text-2xl">
                              {difficultyIcons[trophy.difficulty]}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No trophies earned yet
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Secret Trophies Section */}
          {secretTrophiesList.length > 0 && (
            <div className="mt-8 pt-8 border-t-2 border-purple-300">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🔮</div>
                <h3 className="text-2xl font-bold text-purple-700">
                  Secret Trophies
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {secretTrophiesList.map((trophy, idx) => {
                  const secretInfo = getAchievementInfo(trophy.achievementType);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-4 rounded-xl border-2 border-yellow-400 shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{secretInfo?.icon || "🏆"}</span>
                        <div>
                          <p className="font-bold text-lg text-yellow-300">
                            {secretInfo?.name || "Secret Trophy"}
                          </p>
                          <p className="text-white text-sm">
                            {secretInfo?.description || "A hidden achievement"}
                          </p>
                        </div>
                      </div>
                      <span className="text-3xl">⭐</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={onBack}
            className="w-full mt-8 bg-gray-800 text-white font-bold py-4 rounded-lg hover:bg-gray-900 transition-colors"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
