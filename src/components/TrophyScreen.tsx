"use client";

import { Trophy, Career, Difficulty, AchievementType } from "@/types/game";
import { GameButton, GradientCard, AnimatedIcon, AnimatedContainer } from "./ui/UIComponents";

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

const careerColors: Record<Career, string> = {
  programmer: "from-blue-500 to-indigo-600",
  nurse: "from-red-500 to-rose-600",
  engineer: "from-cyan-500 to-blue-600",
  teacher: "from-indigo-400 to-blue-500",
  chef: "from-amber-500 to-orange-600",
  architect: "from-violet-500 to-purple-600",
  lawyer: "from-blue-600 to-indigo-700",
  retail: "from-pink-500 to-rose-600",
  electrician: "from-yellow-500 to-amber-600",
  firefighter: "from-red-600 to-orange-600",
  police: "from-blue-700 to-indigo-800",
  pilot: "from-sky-500 to-blue-600",
  veterinarian: "from-green-500 to-emerald-600",
  journalist: "from-slate-700 to-gray-800",
  "social-worker": "from-teal-500 to-cyan-600",
  accountant: "from-emerald-600 to-green-700",
  dentist: "from-blue-400 to-sky-500",
  construction: "from-orange-600 to-red-700",
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
    hint: "Speed master across all career paths",
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
    id: "nationals",
    name: "Nationals Champion",
    description: "Played during Nationals (June 29 - July 2, 2026)",
    icon: "🇺🇸",
    hint: "A special summer event for champions",
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
  {
    id: "certification-master",
    name: "Certification Master",
    description: "Passed a certification exam",
    icon: "📜",
    hint: "Prove your expertise with real certification",
  },
  {
    id: "all-certifications-master",
    name: "Certified Expert",
    description: "Passed all certifications across all careers",
    icon: "🎓",
    hint: "Master of every professional certification",
  },
];

const getAchievementInfo = (achievementType?: AchievementType): SecretTrophyDisplay | undefined => {
  if (!achievementType) return undefined;
  return secretTrophies.find((s) => s.id === achievementType);
};

const difficultyIcons: Record<Difficulty, string> = {
  easy: "🥉",
  medium: "🥈",
  hard: "🥇",
};

const difficultyColors: Record<Difficulty, string> = {
  easy: "from-green-400 to-emerald-500",
  medium: "from-yellow-400 to-orange-500",
  hard: "from-purple-400 to-pink-500",
};

export default function TrophyScreen({ trophies, onBack }: TrophyScreenProps) {
  const regularTrophies = trophies.filter((t) => !t.isSecret);
  const secretTrophiesList = trophies.filter((t) => t.isSecret);

  const trophiesByCareer = regularTrophies.reduce((acc, trophy) => {
    if (!acc[trophy.career]) {
      acc[trophy.career] = [];
    }
    acc[trophy.career].push(trophy);
    return acc;
  }, {} as Record<Career, Trophy[]>);

  const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect", "lawyer", "retail", "electrician", "firefighter", "police", "pilot", "veterinarian", "journalist", "social-worker", "accountant", "dentist", "construction"];

  const unlockedCount = secretTrophiesList.length;
  const totalCount = secretTrophies.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-600 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <GradientCard className="p-8 md:p-12" gradient="from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <div className="text-center mb-10">
            <AnimatedIcon animate="bounce" className="text-7xl mb-4 inline-block">🏆</AnimatedIcon>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
              Trophy Case
            </h2>
            <p className="text-gray-700 text-lg">
              You have earned <span className="font-bold text-amber-600">{trophies.length}</span> {trophies.length !== 1 ? "trophies" : "trophy"}!
            </p>
          </div>

          {trophies.length === 0 ? (
            <div className="text-center py-16">
              <AnimatedIcon animate="pulse" className="text-8xl mb-6 inline-block">🎮</AnimatedIcon>
              <p className="text-2xl text-gray-700 mb-4 font-bold">No trophies yet!</p>
              <p className="text-gray-500 text-lg">
                Complete career challenges to earn trophies and unlock achievements.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCareers.map((career, idx) => {
                const careerTrophies = trophiesByCareer[career] || [];
                const hasTrophies = careerTrophies.length > 0;
                
                return (
                  <AnimatedContainer key={career} delay={idx * 50}>
                    <GradientCard 
                      className="p-6 text-center" 
                      gradient={hasTrophies ? `${careerColors[career]}/90` : "from-gray-600/50 to-gray-700/50"}
                    >
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <AnimatedIcon animate={hasTrophies ? "none" : "pulse"} className="text-4xl">
                          {careerIcons[career]}
                        </AnimatedIcon>
                        <span className={`text-xl font-bold ${hasTrophies ? "text-white" : "text-gray-300"}`}>
                          {careerNames[career]}
                        </span>
                      </div>
                      
                      {hasTrophies ? (
                        <div className="space-y-2">
                          {careerTrophies.map((trophy, trophyIdx) => (
                            <div
                              key={trophyIdx}
                              className={`flex items-center justify-between bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg`}
                            >
                              <span className="font-semibold text-sm">
                                {difficultyLabels[trophy.difficulty]} Challenge
                              </span>
                              <span className="text-2xl">
                                {difficultyIcons[trophy.difficulty]}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4">
                          <p className="text-gray-300 text-sm mb-2">Locked</p>
                          <div className="w-16 h-16 mx-auto rounded-full bg-gray-700/50 flex items-center justify-center">
                            <span className="text-3xl opacity-30">🔒</span>
                          </div>
                        </div>
                      )}
                    </GradientCard>
                  </AnimatedContainer>
                );
              })}
            </div>
          )}

          <div className="mt-12 pt-8 border-t-2 border-amber-400/30">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-amber-800 mb-2 flex items-center justify-center gap-3">
                <span>🔮</span> Secret Trophies
              </h3>
              <p className="text-amber-900/70">
                {unlockedCount} of {totalCount} discovered
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {secretTrophies.map((secretTrophy, idx) => {
                const isUnlocked = secretTrophiesList.some(
                  (t) => t.achievementType === secretTrophy.id
                );
                return (
                  <AnimatedContainer key={secretTrophy.id} delay={idx * 30}>
                    <div className={`
                      flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-300
                      ${isUnlocked 
                        ? "bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-red-500/90 text-white border-yellow-400/50 shadow-lg" 
                        : "bg-gray-100/80 text-gray-500 border-gray-300"}
                    `}>
                      <div className="flex items-center gap-4">
                        <span className={`text-4xl ${!isUnlocked ? "opacity-40" : ""}`}>
                          {isUnlocked ? secretTrophy.icon : "🔒"}
                        </span>
                        <div className="text-left">
                          <p className={`font-bold text-lg ${isUnlocked ? "text-yellow-300" : "text-gray-500"}`}>
                            {isUnlocked ? secretTrophy.name : "???"}
                          </p>
                          <p className={`text-sm ${isUnlocked ? "text-white/90" : "text-gray-500"}`}>
                            {isUnlocked ? secretTrophy.description : secretTrophy.hint}
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl">
                        {isUnlocked ? "⭐" : "❓"}
                      </span>
                    </div>
                  </AnimatedContainer>
                );
              })}
            </div>
          </div>

          <div className="mt-10 text-center">
            <GameButton onClick={onBack} className="text-lg px-10 py-4 bg-gradient-to-r from-gray-700 to-gray-800">
              ← Back to Menu
            </GameButton>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Bronze",
  medium: "Silver",
  hard: "Gold",
};