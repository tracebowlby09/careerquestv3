"use client";

import ScreenWrapper from "../ScreenWrapper";
import { GameButton, AnimatedIcon, AnimatedContainer, GradientCard } from "./ui/UIComponents";

export type Difficulty = "easy" | "medium" | "hard";

interface DifficultyOption {
  id: Difficulty;
  title: string;
  icon: string;
  description: string;
  questions: number;
  gradient: string;
}

interface DifficultySelectionProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  backgroundImage?: string;
  careerName?: string;
}

const difficulties: DifficultyOption[] = [
  {
    id: "easy",
    title: "Easy",
    icon: "🌱",
    description: "Perfect for beginners. Test your understanding.",
    questions: 2,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "medium",
    title: "Medium",
    icon: "⚡",
    description: "A good challenge. Think carefully.",
    questions: 3,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "hard",
    title: "Hard",
    icon: "🔥",
    description: "Expert level. Prove your mastery.",
    questions: 4,
    gradient: "from-red-500 to-rose-600",
  },
];

export default function DifficultySelection({
  onSelectDifficulty,
  onBack,
  onOpenSettings,
  onExit,
  backgroundImage,
  careerName = "Career",
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
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-lg border-2 border-white/50 text-white hover:bg-white/10 transition-all duration-300"
        >
          ← Back to Career Selection
        </button>

        <div className="text-center mb-12">
          <AnimatedIcon animate="pulse" className="text-6xl mb-4 inline-block">🎯</AnimatedIcon>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Choose Your Difficulty
          </h2>
          <p className="text-xl text-white/90 font-medium">
            {careerName} - Select how challenging you want the experience
          </p>
        </div>

        <div className="space-y-6">
          {difficulties.map((diff, index) => (
            <AnimatedContainer key={diff.id} delay={index * 100}>
              <button
                onClick={() => handleSelect(diff.id)}
                className={`
                  relative group overflow-hidden rounded-2xl p-8 shadow-xl 
                  hover:shadow-2xl hover:scale-105 transition-all duration-300
                  bg-gradient-to-br ${diff.gradient}
                  border-4 border-white/30 text-left
                `}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
                </div>
                
                <div className="relative z-10 flex items-center gap-6">
                  <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                    {diff.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg tracking-wide">
                      {diff.title}
                    </h3>
                    <p className="text-white/90 mb-3 font-medium">
                      {diff.description}
                    </p>
                    <div className="inline-block bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-white">
                      🏆 {diff.questions} Questions
                    </div>
                  </div>
                  
                  <div className="text-4xl text-white transform group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </div>
                </div>
              </button>
            </AnimatedContainer>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/80 text-lg flex items-center justify-center gap-2">
            <AnimatedIcon animate="none">🏆</AnimatedIcon> Complete all questions to earn a trophy!
          </p>
        </div>
      </div>
    </ScreenWrapper>
  );
}