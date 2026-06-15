"use client";

import { audioSystem } from "@/lib/audio";
import { GameMode } from "@/types/game";
import { GameButton, AnimatedIcon, GradientCard } from "./ui/UIComponents";

interface TutorialStep {
  title: string;
  content: string;
  icon: string;
}

interface TutorialScreenProps {
  careerName: string;
  careerIcon: string;
  steps: TutorialStep[];
  onStart: () => void;
  onBack?: () => void;
}

export default function TutorialScreen({
  careerName,
  careerIcon,
  steps,
  onStart,
  onBack,
}: TutorialScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-indigo-800 to-purple-900 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <GradientCard className="p-10 md:p-12" gradient="from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <div className="text-center mb-10">
            <AnimatedIcon animate="bounce" className="text-7xl mb-4 inline-block">
              {careerIcon}
            </AnimatedIcon>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
              {careerName}
            </h1>
            <p className="text-xl text-white/80">
              How to Play
            </p>
          </div>

          <div className="space-y-5 mb-10">
            {steps.map((step, index) => (
              <GradientCard
                key={index}
                gradient="from-white/10 to-white/5 backdrop-blur-sm"
                className="p-6 flex gap-4 border-l-4 border-blue-400"
              >
                <div className="text-4xl flex-shrink-0">{step.icon}</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-lg">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-white/80">{step.content}</p>
                </div>
              </GradientCard>
            ))}
          </div>

          <div className="flex gap-4">
            {onBack && (
              <GameButton onClick={() => {
                audioSystem.playClickSound();
                onBack();
              }} variant="ghost" className="flex-1">
                ← Back
              </GameButton>
            )}
            <GameButton 
              onClick={() => {
                audioSystem.playClickSound();
                onStart();
              }} 
              variant="primary"
              className="flex-1 text-lg"
            >
              Start Challenge →
            </GameButton>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}