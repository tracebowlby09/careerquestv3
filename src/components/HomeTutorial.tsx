"use client";

import { audioSystem } from "@/lib/audio";
import { GradientCard, GameButton, AnimatedIcon, AnimatedContainer } from "./ui/UIComponents";

interface HomeTutorialProps {
  onSkip: () => void;
  onLogin?: () => void;
  onSignup?: () => void;
}

export default function HomeTutorial({ onSkip, onLogin, onSignup }: HomeTutorialProps) {
  const tutorialSteps = [
    {
      icon: "🚀",
      title: "18 Career Paths",
      description: "Explore programmer, nurse, engineer, teacher, chef, architect, lawyer, retail, electrician, firefighter, police, pilot, veterinarian, journalist, social worker, accountant, dentist, and construction careers."
    },
    {
      icon: "🎮",
      title: "Challenge Mode",
      description: "Choose easy, medium, or hard career challenges, earn XP, unlock trophies, and track every attempt in your stats dashboard."
    },
    {
      icon: "⚡",
      title: "Quick Recall",
      description: "Race through rapid-fire questions, chase speed and streak achievements, and build confidence with instant practice."
    },
    {
      icon: "📜",
      title: "Certification Mode",
      description: "Take career-specific certification exams for licenses like AWS, RN, PE, CPA, CPL, OSHA-30, and more."
    },
    {
      icon: "📖",
      title: "Story Mode",
      description: "Follow a career journey with mentors, workplace milestones, and progressive challenges from first day to career mastery."
    },
    {
      icon: "🧑‍💻",
      title: "Custom Quizzes",
      description: "Create, preview, share, and play custom quiz codes. Moderator-approved tests appear directly on the title screen."
    },
    {
      icon: "🏆",
      title: "Trophies & Achievements",
      description: "Collect career mastery trophies, secret achievements, daily streak rewards, and certification badges."
    },
    {
      icon: "📊",
      title: "Stats, Profile & Leveling",
      description: "View analytics, top trophies, XP progress, level rewards, and career performance from one place."
    },
    {
      icon: "👤",
      title: "Accounts & Guest Play",
      description: "Log in or sign up to save progress by username. Guest mode is available with a dismissible warning."
    }
  ];

  const handleSkip = () => {
    audioSystem.playClickSound();
    localStorage.setItem("homeTutorialSkipped", "true");
    onSkip();
  };

  const handleLogin = () => {
    audioSystem.playClickSound();
    onLogin?.();
  };

  const handleSignup = () => {
    audioSystem.playClickSound();
    onSignup?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <GradientCard className="p-8 md:p-12" gradient="from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <div className="text-center mb-8">
            <AnimatedIcon animate="bounce" className="text-7xl mb-4 inline-block">🎯</AnimatedIcon>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
              Welcome to Career Quest V3!
            </h1>
            <p className="text-xl text-white/80">
              Learn real career skills through challenges, quick recall, story journeys, certifications, custom quizzes, trophies, and saved progress.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mb-8">
            {tutorialSteps.map((step, index) => (
              <AnimatedContainer key={index} delay={index * 80}>
                <div className="flex gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-5 border-l-4 border-amber-400 h-full">
                  <div className="text-3xl flex-shrink-0">{step.icon}</div>
                  <div>
                    <h3 className="font-bold text-white mb-1 text-lg">
                      {step.title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </AnimatedContainer>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <GameButton onClick={handleLogin} className="flex-1 text-lg">
              Log In
            </GameButton>
            <GameButton onClick={handleSignup} className="flex-1 text-lg bg-gradient-to-r from-purple-500 to-pink-600">
              Sign Up
            </GameButton>
            <GameButton onClick={handleSkip} className="flex-1 text-lg bg-gradient-to-r from-emerald-500 to-teal-600">
              Got It!
            </GameButton>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}
