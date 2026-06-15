"use client";

import { audioSystem } from "@/lib/audio";
import { GradientCard, GameButton, AnimatedIcon, AnimatedContainer } from "./ui/UIComponents";

interface HomeTutorialProps {
  onSkip: () => void;
}

export default function HomeTutorial({ onSkip }: HomeTutorialProps) {
  const tutorialSteps = [
    {
      icon: "🎮",
      title: "Challenge Mode",
      description: "Play through career-specific challenges with 5-10 questions. Choose your difficulty and test your skills to earn trophies!"
    },
    {
      icon: "⚡",
      title: "Quick Recall",
      description: "Fast-paced rapid fire questions - answer as many as you can before time runs out. Perfect for quick skill practice."
    },
    {
      icon: "📜",
      title: "Certification Mode",
      description: "Focus on professional certifications for each career, like AWS for developers or RN License for nurses."
    },
    {
      icon: "🏆",
      title: "View Trophies",
      description: "See all your earned trophies and achievements. Track your progress across all careers and difficulties."
    },
    {
      icon: "⚙️",
      title: "Settings",
      description: "Adjust sound settings and discover hidden achievements. Your progress is saved automatically."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <GradientCard className="p-8 md:p-12" gradient="from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <div className="text-center mb-8">
            <AnimatedIcon animate="bounce" className="text-7xl mb-4 inline-block">❓</AnimatedIcon>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
              Welcome to Career Quest!
            </h1>
            <p className="text-xl text-white/80">
              Here's a quick guide to get you started
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {tutorialSteps.map((step, index) => (
              <AnimatedContainer key={index} delay={index * 100}>
                <div className="flex gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-5 border-l-4 border-amber-400">
                  <div className="text-3xl flex-shrink-0">{step.icon}</div>
                  <div>
                    <h3 className="font-bold text-white mb-1 text-lg">
                      {step.title}
                    </h3>
                    <p className="text-white/80 text-sm">{step.description}</p>
                  </div>
                </div>
              </AnimatedContainer>
            ))}
          </div>

          <GameButton onClick={() => {
            audioSystem.playClickSound();
            localStorage.setItem("homeTutorialSkipped", "true");
            onSkip();
          }} className="w-full text-lg">
            Got It!
          </GameButton>
        </GradientCard>
      </div>
    </div>
  );
}