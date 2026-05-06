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
  lawyer: "Lawyer",
  retail: "Retail Worker",
  electrician: "Electrician",
};

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

const SECRET_TROPHY_ID = "konami-master";

interface SecretTrophyDisplay {
  id: string;
  name: string;
  description: string;
  icon: string;
  hint: string;
}

const secretTrophies: SecretTrophyDisplay[] = [
  {
    id: SECRET_TROPHY_ID,
    name: "Konami Code Master",
    description: "Entered the legendary Konami code",
    icon: "👾",
    hint: "Only true OG's know this code",
  },
  {
    id: "career-master",
    name: "Career Master",
    description: "Earned all trophies for a career",
    icon: "👑",
    hint: "Master every challenge in a single career path",
  },
  {
    id: "quick-recall-champion",
    name: "Quick Recall Champion",
    description: "Completed Quick Recall mode",
    icon: "⚡",
    hint: "Speed through the fast-paced trivia mode",
  },
  {
    id: "perfect-recall",
    name: "Perfect Recall",
    description: "Got all Quick Recall questions right",
    icon: "🎯",
    hint: "Flawless memory in rapid-fire questions",
  },
  {
    id: "all-careers-master",
    name: "Ultimate Career Master",
    description: "Completed all difficulties for ALL careers",
    icon: "🌟",
    hint: "Conquer every career on every difficulty level",
  },
  {
    id: "all-quick-recalls-master",
    name: "Quick Recall Legend",
    description: "Completed Quick Recall for ALL careers",
    icon: "🏅",
    hint: "Speed master across all six career paths",
  },
  {
    id: "lightning-reflex",
    name: "Lightning Reflex",
    description: "Answered 5 questions correctly in under 10 seconds each",
    icon: "⚡",
    hint: "Quick thinking under pressure",
  },
  {
    id: "marathon-runner",
    name: "Marathon Runner",
    description: "Completed a challenge with no wrong answers",
    icon: "🏃",
    hint: "Flawless execution through an entire challenge",
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Completed Quick Recall with perfect score under 30 seconds",
    icon: "🔥",
    hint: "Speed and accuracy combined",
  },
  {
    id: "jack-of-all-trades",
    name: "Jack of All Trades",
    description: "Played at least one question from each career",
    icon: "🎭",
    hint: "A well-rounded career explorer",
  },
  {
    id: "lucky-star",
    name: "Lucky Star",
    description: "Got a question wrong but still passed on Hard mode",
    icon: "🍀",
    hint: "Sometimes fortune favors the bold",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Played after 10 PM",
    icon: "🦉",
    hint: "The career quest continues after dark",
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Played before 6 AM",
    icon: "🐦",
    hint: "The early bird catches the career",
  },
  {
    id: "pi-pioneer",
    name: "Pi Pioneer",
    description: "Typed the first 3 digits of Pi (3.14)",
    icon: "🥧",
    hint: "The ratio of circumference to diameter begins...",
  },
  {
    id: "pi-explorer",
    name: "Pi Explorer",
    description: "Typed 4 digits of Pi (3.141)",
    icon: "🔢",
    hint: "One more digit into the infinite sequence",
  },
  {
    id: "pi-master",
    name: "Pi Master",
    description: "Typed 5 digits of Pi (3.1415)",
    icon: "🧮",
    hint: "Halfway to a perfect circle's secret",
  },
  {
    id: "pi-genius",
    name: "Pi Genius",
    description: "Typed 6 digits of Pi (3.14159)",
    icon: "💡",
    hint: "The mathematical constant reveals more",
  },
  {
    id: "pi-legend",
    name: "Pi Legend",
    description: "Typed 9 digits of Pi (3.1415926)",
    icon: "🏆",
    hint: "Nine digits of transcendental perfection",
  },
  {
    id: "state-week",
    name: "State Week",
    description: "Logged in during State Week (April 27-29, 2026)",
    icon: "🗽",
    hint: "A special event in the calendar",
  },
  {
    id: "today-checkin",
    name: "Today Check-in",
    description: "Checked in today",
    icon: "📅",
    hint: "Thanks for playing Career Quest today!",
  },
  {
    id: "phoenix",
    name: "Phoenix",
    description: "Lose all hearts in Quick Recall but still complete the game",
    icon: "🔥",
    hint: "Rise from the ashes of defeat",
  },
  {
    id: "keyboard-warrior",
    name: "Keyboard Warrior",
    description: "Play an entire game using only keyboard navigation",
    icon: "⌨️",
    hint: "Navigate like a true developer",
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Visit every screen in the game",
    icon: "🧭",
    hint: "A true adventurer explores all corners",
  },
  {
    id: "patience",
    name: "Patience",
    description: "Wait 60+ seconds before submitting your first answer",
    icon: "⏳",
    hint: "Slow and steady wins the race",
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "Win 5 games in a row",
    icon: "🔥",
    hint: "Unstoppable momentum",
  },
  {
    id: "return-customer",
    name: "Return Customer",
    description: "Play on 7 different days",
    icon: "🔄",
    hint: "A loyal player returns again and again",
  },
  {
    id: "committed",
    name: "Committed",
    description: "Play for 30 minutes in one session",
    icon: "⏰",
    hint: "Dedication to the craft",
  },
  {
    id: "tech-savvy",
    name: "Tech Savvy",
    description: "Change the settings (music/SFX volume)",
    icon: "⚙️",
    hint: "A user who knows their way around",
  },
  {
    id: "variety-pack",
    name: "Variety Pack",
    description: "Complete games in all 3 difficulty levels in one session",
    icon: "📦",
    hint: "The complete package",
  },
  {
    id: "second-chance",
    name: "Second Chance",
    description: "Retry the same question twice and still get it right",
    icon: "🔄",
    hint: "Perseverance pays off",
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
  // Separate secret trophies from regular trophies
  const regularTrophies = trophies.filter((t) => !t.isSecret);
  const secretTrophiesList = trophies.filter((t) => t.isSecret);

  // Group REGULAR trophies by career (exclude secret trophies)
  const trophiesByCareer = regularTrophies.reduce((acc, trophy) => {
    if (!acc[trophy.career]) {
      acc[trophy.career] = [];
    }
    acc[trophy.career].push(trophy);
    return acc;
  }, {} as Record<Career, Trophy[]>);

  const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect", "lawyer", "retail", "electrician"];
  const earnedCareers = new Set(regularTrophies.map((t) => t.career));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-600 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
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

          {/* Trophy Case Shelf Display */}
          <div className="mb-8">
            <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl p-6 border-2 border-gray-300 shadow-inner">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-700 flex items-center justify-center gap-2">
                  <span className="text-3xl">🖼️</span>
                  Your Career Achievements
                  <span className="text-3xl">🖼️</span>
                </h3>
                <p className="text-gray-500 text-sm">
                  Display your hard-earned career trophies on the shelf
                </p>
              </div>
              
              {/* Three-tier shelf display */}
              <div className="space-y-6">
                {/* Top Shelf */}
                <div className="trophy-shelf">
                  <div className="bg-gradient-to-b from-orange-100 to-orange-200 rounded-lg p-4 border-2 border-orange-300">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm font-bold text-orange-700">🏆 Top Shelf - Gold Trophies</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {regularTrophies.filter(t => t.difficulty === "hard").map((trophy, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-4xl mb-1">🥇</div>
                          <div className="text-xs font-bold text-gray-700">
                            {careerNames[trophy.career]}
                          </div>
                        </div>
                      ))}
                      {regularTrophies.filter(t => t.difficulty === "hard").length === 0 && (
                        <p className="text-sm text-gray-400 italic">No gold trophies yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle Shelf */}
                <div className="trophy-shelf">
                  <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg p-4 border-2 border-blue-300">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm font-bold text-blue-700">🥈 Middle Shelf - Silver Trophies</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {regularTrophies.filter(t => t.difficulty === "medium").map((trophy, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-4xl mb-1">🥈</div>
                          <div className="text-xs font-bold text-gray-700">
                            {careerNames[trophy.career]}
                          </div>
                        </div>
                      ))}
                      {regularTrophies.filter(t => t.difficulty === "medium").length === 0 && (
                        <p className="text-sm text-gray-400 italic">No silver trophies yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Shelf */}
                <div className="trophy-shelf">
                  <div className="bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-lg p-4 border-2 border-yellow-300">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm font-bold text-yellow-700">🥉 Bottom Shelf - Bronze Trophies</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {regularTrophies.filter(t => t.difficulty === "easy").map((trophy, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-4xl mb-1">🥉</div>
                          <div className="text-xs font-bold text-gray-700">
                            {careerNames[trophy.career]}
                          </div>
                        </div>
                      ))}
                      {regularTrophies.filter(t => t.difficulty === "easy").length === 0 && (
                        <p className="text-sm text-gray-400 italic">No bronze trophies yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          <div className="mt-8 pt-8 border-t-2 border-purple-300">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🔮</div>
              <h3 className="text-2xl font-bold text-purple-700">
                Secret Trophies
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {secretTrophiesList.length} of {secretTrophies.length} discovered
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {secretTrophies.map((secretTrophy) => {
                const isUnlocked = secretTrophiesList.some(
                  (t) => t.achievementType === secretTrophy.id
                );
                return (
                  <div
                    key={secretTrophy.id}
                    className={`flex items-center justify-between px-6 py-4 rounded-xl border-2 shadow-lg transition-all duration-300 ${
                      isUnlocked
                        ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white border-yellow-400"
                        : "bg-gray-100 text-gray-400 border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-4xl ${!isUnlocked ? "opacity-50" : ""}`}>
                        {isUnlocked ? secretTrophy.icon : "🔒"}
                      </span>
                      <div>
                        <p className={`font-bold text-lg ${
                          isUnlocked ? "text-yellow-300" : "text-gray-500"
                        }`}>
                          {isUnlocked ? secretTrophy.name : "???"}
                        </p>
                        <p className={`text-sm ${
                          isUnlocked ? "text-white" : "text-gray-400 italic"
                        }`}>
                          {isUnlocked ? secretTrophy.description : secretTrophy.hint}
                        </p>
                      </div>
                    </div>
                    <span className="text-3xl">
                      {isUnlocked ? "⭐" : "❓"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

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
