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
