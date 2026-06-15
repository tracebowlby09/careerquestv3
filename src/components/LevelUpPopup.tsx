"use client";

import { GradientCard, GameButton, AnimatedIcon, AnimatedContainer } from "./ui/UIComponents";

interface LevelUpPopupProps {
  show: boolean;
  oldLevel: number;
  newLevel: number;
  onClose: () => void;
}

const levelRewards: Record<number, string[]> = {
  2: ["Unlock: Quick Recall Mode hint"],
  3: ["Unlock: Additional Career Info"],
  4: ["XP Boost: +10% for next 5 games"],
  5: ["Unlock: Career Comparison Tool"],
  6: ["Title: Career Explorer"],
  7: ["XP Boost: +20% for next 10 games"],
  8: ["Title: Master Careerist"],
  9: ["Unlock: All Secret Trophy Hints"],
  10: ["Title: Ultimate Career Master"],
};

export default function LevelUpPopup({ show, oldLevel, newLevel, onClose }: LevelUpPopupProps) {
  if (!show) return null;

  const rewards = levelRewards[newLevel] || ["Keep progressing!"];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <GradientCard 
        gradient="from-yellow-500 via-orange-500 to-red-500" 
        className="p-8 max-w-md w-full border-4 border-yellow-300"
      >
        <div className="text-center">
          <AnimatedIcon animate="bounce" className="text-7xl mb-4 inline-block">
            🌟
          </AnimatedIcon>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            LEVEL UP!
          </h2>
          <p className="text-yellow-100 text-lg mb-6">
            You've advanced from Level {oldLevel} to Level {newLevel}
          </p>

          <div className="rounded-xl p-5 mb-6 bg-white/20 border border-yellow-300">
            <p className="text-white font-bold mb-3">🏆 New Rewards Unlocked:</p>
            {rewards.map((reward, idx) => (
              <AnimatedContainer key={idx} delay={idx * 100}>
                <div className="text-left bg-white/10 rounded-lg p-3 mb-2">
                  <span className="text-yellow-300 font-semibold">✓ {reward}</span>
                </div>
              </AnimatedContainer>
            ))}
          </div>

          <GameButton 
            onClick={onClose} 
            className="w-full text-lg bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            Continue Playing
          </GameButton>
        </div>
      </GradientCard>
    </div>
  );
}