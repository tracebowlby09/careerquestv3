"use client";

export type Difficulty = "easy" | "medium" | "hard";

import ScreenWrapper from "./ScreenWrapper";

interface DifficultyOption {
  id: Difficulty;
  title: string;
  icon: string;
  description: string;
  questions: number;
  color: string;
}

interface DifficultySelectionProps {
  career: string;
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
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "medium",
    title: "Medium",
    icon: "⚡",
    description: "A good challenge. 3 questions to master.",
    questions: 3,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "hard",
    title: "Hard",
    icon: "🔥",
    description: "Expert level. 4 questions to conquer.",
    questions: 4,
    color: "from-red-500 to-pink-500",
  },
];

export default function DifficultySelection({
  career,
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
        className="mb-6 text-white hover:text-white/80 transition-colors flex items-center gap-2"
      >
        ← Back to Career Selection
      </button>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Choose Your Difficulty
        </h2>
        <p className="text-xl text-white/90">
          {career} - Select how challenging you want the experience
        </p>
      </div>

        <div className="grid md:grid-cols-3 gap-6">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => handleSelect(diff.id)}
              className={`bg-gradient-to-br ${diff.color} rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200`}
            >
              <div className="text-6xl mb-4 text-center">{diff.icon}</div>
              
              <h3 className="text-2xl font-bold text-white mb-3 text-center drop-shadow-md">
                {diff.title}
              </h3>
              
              <p className="text-white/90 mb-4 text-center drop-shadow-sm">
                {diff.description}
              </p>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center font-semibold text-white">
                {diff.questions} Questions
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-white font-semibold">
                  Start Challenge →
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-white/80 text-sm">
          Complete all questions to earn a trophy! 🏆
        </div>
    </ScreenWrapper>
  );
}
