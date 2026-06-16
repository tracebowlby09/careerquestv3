"use client";

import { CSSProperties } from "react";
import { CustomTest } from "@/types/game";
import { GradientCard, GameButton, AnimatedIcon } from "./ui/UIComponents";
import ScreenWrapper from "./ScreenWrapper";

interface CustomTestOutcomeProps {
  test: CustomTest;
  success: boolean;
  score: number;
  total: number;
  onPlayAgain: () => void;
  onBackToTitle: () => void;
}

function getCustomBackgroundStyle(test: CustomTest): CSSProperties | undefined {
  if (!test.backgroundImage) return undefined;

  const primary = test.themeColors?.primary ?? "#3b82f6";
  const secondary = test.themeColors?.secondary ?? "#8b5cf6";
  return {
    backgroundImage: `linear-gradient(135deg, ${primary}, ${secondary})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

export default function CustomTestOutcome({ test, success, score, total, onPlayAgain, onBackToTitle }: CustomTestOutcomeProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const skills = test.skillsLearned?.filter(skill => skill.trim()) ?? [];

  return (
    <ScreenWrapper onExit={onBackToTitle} dark fullScreen backgroundImage={test.backgroundImage}>
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <GradientCard className="relative overflow-hidden p-8 md:p-12 max-w-3xl w-full" gradient="from-purple-600 via-blue-600 to-indigo-600" style={getCustomBackgroundStyle(test)}>
          {test.backgroundImage && <div className="absolute inset-0 bg-black/50" />}
          <div className="relative z-10 text-center">
            <AnimatedIcon animate="bounce" className="text-7xl mb-6 inline-block">
              {test.icon || "🎓"}
            </AnimatedIcon>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              {test.name}
            </h2>

            {test.description && (
              <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
                {test.description}
              </p>
            )}

            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <span className="text-3xl font-extrabold text-amber-300">{percentage}%</span>
              <span className="text-white/80 font-bold">
                {score} / {total} questions correct
              </span>
            </div>

            <div className="rounded-xl p-6 mb-8 bg-white/10 backdrop-blur-sm border border-white/20">
              <p className="text-2xl font-extrabold mb-2 text-white">
                {success ? "Custom Test Complete!" : "Keep Practicing!"}
              </p>
              <p className="text-white/80">
                {success
                  ? "You showed mastery of this custom challenge."
                  : "Review the questions and try again to improve your score."}
              </p>
            </div>

            {skills.length > 0 && (
              <div className="rounded-xl p-6 mb-8 bg-white/10 backdrop-blur-sm border border-white/20 text-left">
                <h3 className="text-xl font-bold text-white mb-4">Skills You Practiced</h3>
                <ul className="grid gap-3 md:grid-cols-3">
                  {skills.map((skill, index) => (
                    <li key={index} className="flex items-start gap-2 rounded-lg bg-white/10 p-3">
                      <span className="text-amber-300">✓</span>
                      <span className="text-white/90">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <GameButton onClick={onPlayAgain} className="w-full text-lg">
                Play Again
              </GameButton>
              <GameButton onClick={onBackToTitle} className="w-full text-lg bg-gradient-to-r from-gray-700 to-gray-800">
                Back to Title
              </GameButton>
            </div>
          </div>
        </GradientCard>
      </div>
    </ScreenWrapper>
  );
}
