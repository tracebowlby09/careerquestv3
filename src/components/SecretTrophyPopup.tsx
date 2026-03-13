"use client";

import { useEffect, useState, useCallback } from "react";

interface SecretTrophyPopupProps {
  show: boolean;
  achievementType?: string | null;
  onClose: () => void;
}

const trophyContent: Record<string, { icon: string; title: string; message: string; gradient: string }> = {
  "konami-master": {
    icon: "👾",
    title: "SECRET TROPHY UNLOCKED!",
    message: "You found the legendary Konami code!",
    gradient: "from-purple-600 via-pink-500 to-red-500",
  },
  "career-master": {
    icon: "👑",
    title: "CAREER MASTER!",
    message: "You've earned all trophies for this career!",
    gradient: "from-yellow-400 via-orange-500 to-red-500",
  },
  "quick-recall-champion": {
    icon: "⚡",
    title: "QUICK RECALL CHAMPION!",
    message: "You completed Quick Recall mode!",
    gradient: "from-blue-400 via-cyan-500 to-teal-500",
  },
  "perfect-recall": {
    icon: "🎯",
    title: "PERFECT RECALL!",
    message: "You got every question right!",
    gradient: "from-green-400 via-emerald-500 to-teal-500",
  },
  "all-careers-master": {
    icon: "🌟",
    title: "ULTIMATE CAREER MASTER!",
    message: "You've completed ALL careers on ALL difficulties!",
    gradient: "from-amber-400 via-yellow-500 to-orange-500",
  },
  "all-quick-recalls-master": {
    icon: "🏅",
    title: "QUICK RECALL LEGEND!",
    message: "You've completed Quick Recall for ALL careers!",
    gradient: "from-indigo-400 via-purple-500 to-pink-500",
  },
  "lightning-reflex": {
    icon: "⚡",
    title: "LIGHTNING REFLEX!",
    message: "Answered 5 questions correctly in under 10 seconds each!",
    gradient: "from-yellow-300 via-orange-400 to-red-400",
  },
  "marathon-runner": {
    icon: "🏃",
    title: "MARATHON RUNNER!",
    message: "Completed a career without making any mistakes!",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
  },
  "speed-demon": {
    icon: "🔥",
    title: "SPEED DEMON!",
    message: "Completed Quick Recall with a perfect score in under 30 seconds!",
    gradient: "from-red-400 via-orange-500 to-yellow-500",
  },
  "jack-of-all-trades": {
    icon: "🎭",
    title: "JACK OF ALL TRADES!",
    message: "Played at least one question from each career!",
    gradient: "from-violet-400 via-purple-500 to-fuchsia-500",
  },
  "lucky-star": {
    icon: "🍀",
    title: "LUCKY STAR!",
    message: "Got a question wrong but still passed on Hard mode!",
    gradient: "from-green-300 via-emerald-400 to-teal-500",
  },
  "night-owl": {
    icon: "🦉",
    title: "NIGHT OWL!",
    message: "Playing the game after 10 PM - the career quest continues!",
    gradient: "from-indigo-600 via-purple-700 to-slate-800",
  },
  "early-bird": {
    icon: "🐦",
    title: "EARLY BIRD!",
    message: "Starting your career journey before 6 AM - rising star!",
    gradient: "from-amber-300 via-yellow-400 to-orange-400",
  },
  "pi-pioneer": {
    icon: "🥧",
    title: "PI PIONEER!",
    message: "You typed the first 3 digits of Pi: 3.14!",
    gradient: "from-orange-400 via-red-500 to-pink-500",
  },
  "pi-explorer": {
    icon: "🔢",
    title: "PI EXPLORER!",
    message: "You typed 4 digits of Pi: 3.141!",
    gradient: "from-amber-500 via-orange-600 to-red-600",
  },
  "pi-master": {
    icon: "🧮",
    title: "PI MASTER!",
    message: "You typed 5 digits of Pi: 3.1415!",
    gradient: "from-yellow-500 via-amber-600 to-orange-700",
  },
  "pi-genius": {
    icon: "💡",
    title: "PI GENIUS!",
    message: "You typed 6 digits of Pi: 3.14159!",
    gradient: "from-blue-500 via-indigo-600 to-purple-700",
  },
  "pi-legend": {
    icon: "🏆",
    title: "PI LEGEND!",
    message: "You typed 9 digits of Pi: 3.1415926! Mathematical!",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
  },
};

export default function SecretTrophyPopup({ show, achievementType, onClose }: SecretTrophyPopupProps) {
  const [isClosing, setIsClosing] = useState(false);

  // Get content based on achievement type, with fallback for unknown types
  const content = achievementType ? trophyContent[achievementType] : null;

  // Handle close animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  // Auto-hide timer
  useEffect(() => {
    if (show && !isClosing) {
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, isClosing, handleClose]);

  if (!show && !isClosing) return null;

  // Fallback content for when no achievement type is specified
  const displayContent = content || {
    icon: "🏆",
    title: "SECRET TROPHY UNLOCKED!",
    message: "You've discovered a secret achievement!",
    gradient: "from-purple-600 via-pink-500 to-red-500",
  };

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isClosing ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
      <div className={`bg-gradient-to-r ${displayContent.gradient} text-white px-8 py-4 rounded-xl shadow-2xl border-2 border-yellow-400`}>
        <div className="flex items-center gap-4">
          <div className="text-4xl animate-bounce">{displayContent.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-yellow-300">
              {displayContent.title}
            </h3>
            <p className="text-white font-semibold">
              {displayContent.message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 text-white hover:text-yellow-300 text-2xl font-bold"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
