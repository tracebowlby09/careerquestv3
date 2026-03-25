"use client";

export type Difficulty = "easy" | "medium" | "hard";

import ScreenWrapper from "../ScreenWrapper";

interface DifficultyOption {
  id: Difficulty;
  title: string;
  icon: string;
  description: string;
  questions: number;
  color: string;
}

interface DifficultySelectionProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  backgroundImage?: string;
}

const difficulties: DifficultyOption[] = [
  {
    id: "easy",
    title: "Easy",
    icon: "🌱",
    description: "Perfect for beginners. 2 questions to complete.",
    questions: 2,
    color: "from-green-600 to-emerald-600",
  },
  {
    id: "medium",
    title: "Medium",
    icon: "⚡",
    description: "A good challenge. 3 questions to master.",
    questions: 3,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "hard",
    title: "Hard",
    icon: "🔥",
    description: "Expert level. 4 questions to conquer.",
    questions: 4,
    color: "from-red-600 to-rose-600",
  },
];

export default function ChefDifficultySelection({
  onSelectDifficulty,
  onBack,
  onOpenSettings,
  onExit,
  backgroundImage,
}: DifficultySelectionProps) {
  const handleSelect = (difficulty: Difficulty) => {
    if (typeof window !== 'undefined') {
      const { audioSystem } = require('@/lib/audio');
      audioSystem.playClickSound();
    }
    onSelectDifficulty(difficulty);
  };

  return (
    <ScreenWrapper onOpenSettings={onOpenSettings} onExit={onExit} backgroundImage={backgroundImage}>
      <button
        onClick={onBack}
        className="mb-6 hover:opacity-80 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg border-2"
        style={{ color: 'white', borderColor: 'black' }}
      >
        ← Back to Career Selection
      </button>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Choose Your Difficulty
        </h2>
        <p className="text-xl text-black/80 font-medium">
          Head Chef - Select how challenging you want the experience
        </p>
      </div>

        <div className="grid md:grid-cols-3 gap-6">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => handleSelect(diff.id)}
              className={`bg-gradient-to-br ${diff.color} rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 border-4 border-white/30`}
            >
              <div className="text-6xl mb-4 text-center">{diff.icon}</div>
              
              <h3 className="text-3xl font-extrabold text-white mb-3 text-center drop-shadow-lg tracking-wide">
                {diff.title}
              </h3>
              
              <p className="text-white/80 mb-4 text-center drop-shadow-md font-medium">
                {diff.description}
              </p>
              
              <div className="bg-white/40 rounded-lg p-3 text-center font-bold text-white text-lg">
                {diff.questions} Questions
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-white font-bold text-lg">
                  Start Challenge →
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-black/60 text-sm">
          Complete all questions to earn a trophy! 🏆
        </div>
    </ScreenWrapper>
  );
}