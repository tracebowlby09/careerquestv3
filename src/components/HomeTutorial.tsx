"use client";

import { audioSystem } from "@/lib/audio";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">❓</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to Career Quest!
            </h1>
<p className="text-xl text-gray-600">
               Here&apos;s a quick guide to get you started
             </p>
          </div>

          <div className="space-y-4 mb-8">
            {tutorialSteps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500"
              >
                <div className="text-3xl flex-shrink-0">{step.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                audioSystem.playClickSound();
                localStorage.setItem("homeTutorialSkipped", "true");
                onSkip();
              }}
              className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Skip Tutorial
            </button>
            <button
              onClick={() => {
                audioSystem.playClickSound();
                localStorage.setItem("homeTutorialSkipped", "true");
                onSkip();
              }}
              className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}