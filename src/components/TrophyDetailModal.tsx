"use client";

import { Trophy, Career, Difficulty, AchievementType } from "@/types/game";

type TrophyView = 
  | Trophy 
  | { locked: true; career?: Career; difficulty?: Difficulty; achievementType?: AchievementType };

interface TrophyDetailModalProps {
  trophy: TrophyView;
  onClose: () => void;
}

export default function TrophyDetailModal({ trophy, onClose }: TrophyDetailModalProps) {
  const isLocked = 'locked' in trophy && trophy.locked;
  const isSecret = !isLocked && trophy.isSecret;
  
  let title: string;
  let description: string;
  let icon: string;
  
  if (isLocked) {
    if (trophy.achievementType) {
      const secretInfo = getSecretInfo(trophy.achievementType);
      title = `🔒 ${secretInfo?.name || "Secret Trophy"}`;
      description = secretInfo?.hint || "Keep exploring to discover this hidden achievement!";
      icon = "❓";
    } else if (trophy.career && trophy.difficulty) {
      title = `Locked: ${careerNames[trophy.career]} — ${difficultyLabels[trophy.difficulty]}`;
      description = getUnlockHint(trophy.career, trophy.difficulty);
      icon = "🔒";
    } else {
      title = "Locked";
      description = "Complete more challenges to unlock this trophy.";
      icon = "🔒";
    }
  } else {
    const earnedTrophy = trophy as Trophy;
    if (earnedTrophy.isSecret && earnedTrophy.achievementType) {
      const secretInfo = getSecretInfo(earnedTrophy.achievementType);
      title = secretInfo?.name || "Secret Trophy";
      description = secretInfo?.description || "A secret achievement!";
      icon = getSecretEmoji(earnedTrophy.achievementType);
    } else {
      title = `${careerNames[earnedTrophy.career]} Mastery`;
      description = `You completed the ${careerNames[earnedTrophy.career]} career on ${earnedTrophy.difficulty} difficulty with a passing score.`;
      icon = `${careerEmojis[earnedTrophy.career]}${medalEmojis[earnedTrophy.difficulty]}`;
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl p-8 max-w-md w-full 
                   shadow-2xl border-4 border-amber-600"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          <div className="text-8xl drop-shadow-2xl">
            {icon}
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            {title}
          </h2>
          {!isLocked && (
            <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full
              ${trophy.difficulty === "easy" ? "bg-green-100 text-green-800" :
                trophy.difficulty === "medium" ? "bg-gray-100 text-gray-800" :
                "bg-yellow-100 text-yellow-800"}
            `}>
              {trophy.difficulty.charAt(0).toUpperCase() + trophy.difficulty.slice(1)}
            </span>
          )}
          {isLocked && (
            <span className="inline-block bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              🔒 LOCKED
            </span>
          )}
        </div>

        <div className="bg-amber-200/60 rounded-lg p-4 mb-6">
          <p className="text-gray-800 text-center leading-relaxed">
            {description}
          </p>
        </div>

        {!isLocked && (
          <div className="bg-amber-200/50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Earned On</p>
                <p className="font-semibold text-gray-900">
                  {(trophy as Trophy).earnedAt.toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Type</p>
                <p className="font-semibold text-gray-900">
                  {isSecret ? "Hidden Achievement" : "Career Completion"}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 
                     hover:to-orange-700 text-white font-bold py-3 rounded-lg 
                     transition-all shadow-lg active:scale-95"
        >
          {isLocked ? "Got it!" : "Close"}
        </button>
      </div>
    </div>
  );
}

const careerNames: Record<Career, string> = {
  programmer: "Software Programmer",
  nurse: "Registered Nurse",
  engineer: "Civil Engineer",
  teacher: "Teacher",
  chef: "Head Chef",
  architect: "Architect",
  lawyer: "Lawyer",
  retail: "Retail Worker",
  electrician: "Electrician",
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Bronze",
  medium: "Silver",
  hard: "Gold",
};

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

function getSecretEmoji(type: AchievementType): string {
  const emojis: Record<AchievementType, string> = {
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

function getUnlockHint(career: Career, difficulty: Difficulty): string {
  const hints: Record<string, string> = {
    "programmer-easy": "Complete the Programmer career on Easy difficulty.",
    "programmer-medium": "Complete the Programmer career on Medium difficulty.",
    "programmer-hard": "Complete the Programmer career on Hard difficulty.",
    "nurse-easy": "Complete the Nurse career on Easy difficulty.",
    "nurse-medium": "Complete the Nurse career on Medium difficulty.",
    "nurse-hard": "Complete the Nurse career on Hard difficulty.",
    "engineer-easy": "Complete the Engineer career on Easy difficulty.",
    "engineer-medium": "Complete the Engineer career on Medium difficulty.",
    "engineer-hard": "Complete the Engineer career on Hard difficulty.",
    "teacher-easy": "Complete the Teacher career on Easy difficulty.",
    "teacher-medium": "Complete the Teacher career on Medium difficulty.",
    "teacher-hard": "Complete the Teacher career on Hard difficulty.",
    "chef-easy": "Complete the Chef career on Easy difficulty.",
    "chef-medium": "Complete the Chef career on Medium difficulty.",
    "chef-hard": "Complete the Chef career on Hard difficulty.",
    "architect-easy": "Complete the Architect career on Easy difficulty.",
    "architect-medium": "Complete the Architect career on Medium difficulty.",
    "architect-hard": "Complete the Architect career on Hard difficulty.",
    "lawyer-easy": "Complete the Lawyer career on Easy difficulty.",
    "lawyer-medium": "Complete the Lawyer career on Medium difficulty.",
    "lawyer-hard": "Complete the Lawyer career on Hard difficulty.",
    "retail-easy": "Complete the Retail Worker career on Easy difficulty.",
    "retail-medium": "Complete the Retail Worker career on Medium difficulty.",
    "retail-hard": "Complete the Retail Worker career on Hard difficulty.",
    "electrician-easy": "Complete the Electrician career on Easy difficulty.",
    "electrician-medium": "Complete the Electrician career on Medium difficulty.",
    "electrician-hard": "Complete the Electrician career on Hard difficulty.",
  };
  
  const key = `${career}-${difficulty}`;
  return hints[key] || `Complete the ${careerNames[career]} career on ${difficulty} difficulty to unlock this trophy!`;
}

function getSecretInfo(type: AchievementType): { name: string; description: string; hint: string } | null {
  const info: Record<AchievementType, { name: string; description: string; hint: string }> = {
    "konami-master": {
      name: "Konami Code Master",
      description: "You discovered the legendary Konami code hidden in the game!",
      hint: "Enter the classic cheat code: ↑↑↓↓←→←→BA",
    },
    "career-master": {
      name: "Career Master",
      description: "You've earned all three difficulty trophies for a single career path!",
      hint: "Complete all three difficulties (Bronze, Silver, Gold) for any one career.",
    },
    "quick-recall-champion": {
      name: "Quick Recall Champion",
      description: "You completed a Quick Recall session!",
      hint: "Play and complete a Quick Recall game in any career.",
    },
    "perfect-recall": {
      name: "Perfect Recall",
      description: "Every answer correct in Quick Recall mode!",
      hint: "Get ALL questions right in a Quick Recall session.",
    },
    "all-careers-master": {
      name: "Ultimate Career Master",
      description: "You've conquered all nine careers on all difficulties!",
      hint: "Earn the Gold trophy for every single career.",
    },
    "all-quick-recalls-master": {
      name: "Quick Recall Legend",
      description: "Completed Quick Recall for every career path!",
      hint: "Complete Quick Recall mode for all 9 careers.",
    },
    "lightning-reflex": {
      name: "Lightning Reflex",
      description: "Five correct answers in under ten seconds each!",
      hint: "Answer 5 questions correctly in a row with response times under 10 seconds each.",
    },
    "marathon-runner": {
      name: "Marathon Runner",
      description: "Completed a full challenge without a single wrong answer!",
      hint: "Complete a career challenge (Challenge Mode) with zero mistakes.",
    },
    "speed-demon": {
      name: "Speed Demon",
      description: "Perfect Quick Recall score under 30 seconds!",
      hint: "Complete Quick Recall with 100% accuracy in under 30 seconds.",
    },
    "jack-of-all-trades": {
      name: "Jack of All Trades",
      description: "You've sampled every career!",
      hint: "Play at least one question from each of the 9 careers.",
    },
    "lucky-star": {
      name: "Lucky Star",
      description: "Got a question wrong but still passed on Hard!",
      hint: "Miss at least one question but still achieve a passing score on Hard difficulty.",
    },
    "night-owl": {
      name: "Night Owl",
      description: "Playing after 10 PM — the career quest never sleeps!",
      hint: "Start a game session between 10 PM and 11:59 PM.",
    },
    "early-bird": {
      name: "Early Bird",
      description: "Starting before 6 AM — the early bird catches the career!",
      hint: "Start a game session between 12 AM and 5:59 AM.",
    },
    "pi-pioneer": {
      name: "Pi Pioneer",
      description: "You typed the first three digits of π: 3.14!",
      hint: 'Type "3.14" on your keyboard while on any screen.',
    },
    "pi-explorer": {
      name: "Pi Explorer",
      description: "Four digits of π: 3.141!",
      hint: 'Type "3.141" on your keyboard.',
    },
    "pi-master": {
      name: "Pi Master",
      description: "Five digits of π: 3.1415!",
      hint: 'Type "3.1415" on your keyboard.',
    },
    "pi-genius": {
      name: "Pi Genius",
      description: "Six digits of π: 3.14159!",
      hint: 'Type "3.14159" on your keyboard.',
    },
    "pi-legend": {
      name: "Pi Legend",
      description: "Nine digits of π: 3.1415926!",
      hint: 'Type "3.1415926" on your keyboard.',
    },
    "state-week": {
      name: "State Week",
      description: "Logged in during State Week (April 27–29, 2026)!",
      hint: "Play the game between April 27-29, 2026.",
    },
    "today-checkin": {
      name: "Today Check-in",
      description: "Thanks for playing Career Quest today!",
      hint: "Simply start the game on any day.",
    },
    "phoenix": {
      name: "Phoenix",
      description: "Lost all hearts but still completed Quick Recall!",
      hint: "In Quick Recall, let your hearts reach zero but keep playing until the end.",
    },
    "keyboard-warrior": {
      name: "Keyboard Warrior",
      description: "Played using only keyboard navigation!",
      hint: "Complete an entire game session without using the mouse.",
    },
    "explorer": {
      name: "Explorer",
      description: "Visited every screen in Career Quest!",
      hint: "Navigate to every distinct screen/menu in the game at least once.",
    },
    "patience": {
      name: "Patience",
      description: "Waited over 60 seconds before your first answer!",
      hint: "After a question appears, wait at least 60 seconds before submitting your first answer.",
    },
    "streak-master": {
      name: "Streak Master",
      description: "Five victories in a row!",
      hint: "Win 5 games consecutively (any mode).",
    },
    "return-customer": {
      name: "Return Customer",
      description: "Played on seven different days!",
      hint: "Launch the game on 7 separate days.",
    },
    "committed": {
      name: "Committed",
      description: "30 minutes in one session!",
      hint: "Play continuously for 30 minutes in a single sitting.",
    },
    "tech-savvy": {
      name: "Tech Savvy",
      description: "You explored the settings menu!",
      hint: "Open the Settings panel from any screen.",
    },
    "variety-pack": {
      name: "Variety Pack",
      description: "Completed all three difficulty levels in one session!",
      hint: "Finish a career on Easy, Medium, and Hard difficulties without exiting to the title screen.",
    },
    "second-chance": {
      name: "Second Chance",
      description: "Retried a question twice and still got it right!",
      hint: "Fail a question twice, then get it correct on your third attempt.",
    },
  };
  return info[type] || null;
}
