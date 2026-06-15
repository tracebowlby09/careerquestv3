"use client";

import { Career, GameMode } from "@/types/game";
import { careerInfoByCareer, careerInfoList } from "@/lib/careerInfo";
import ScreenWrapper from "./ScreenWrapper";
import { AnimatedIcon, AnimatedContainer, Badge } from "./ui/UIComponents";

interface CareerSelectionProps {
  onSelectCareer: (career: Career) => void;
  onLearnMore?: (career: Career) => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  gameMode?: GameMode;
}

const careers = careerInfoList.map((career) => ({
  id: career.id,
  title: career.title,
  icon: career.icon,
  description: career.description,
  skills: career.skills,
}));

export default function CareerSelection({ onSelectCareer, onLearnMore, onOpenSettings, onExit, gameMode }: CareerSelectionProps) {
  const isQuickRecall = gameMode === "quick-recall";

  const handleSelect = (career: Career) => {
    if (typeof window !== 'undefined') {
      const { audioSystem } = require('@/lib/audio');
      audioSystem.playClickSound();
    }
    onSelectCareer(career);
  };

  const handleLearnMore = (career: Career) => {
    if (typeof window !== 'undefined') {
      const { audioSystem } = require('@/lib/audio');
      audioSystem.playClickSound();
    }
    onLearnMore?.(career);
  };

  return (
    <ScreenWrapper onOpenSettings={onOpenSettings} onExit={onExit}>
      <div className="text-center mb-12">
        {isQuickRecall ? (
          <>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3 rounded-full mb-6 shadow-xl">
              <AnimatedIcon animate="none" className="text-3xl">🚀</AnimatedIcon>
              <span className="text-white font-bold text-2xl tracking-wide">QUICK RECALL</span>
              <AnimatedIcon animate="none" className="text-3xl">🚀</AnimatedIcon>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Test Your Knowledge
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Select a career to answer rapid-fire questions under time pressure
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Choose Your Career Path
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Select a career to explore and complete a real-world challenge
            </p>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {careers.map((career, index) => {
          const gradient = careerInfoByCareer[career.id].gradient;

          return (
            <AnimatedContainer key={career.id} delay={index * 50}>
              <div
                className={`
                  relative group overflow-hidden rounded-2xl p-8 shadow-xl
                  hover:shadow-2xl hover:scale-105 hover:-translate-y-2
                  transition-all duration-300 text-left
                  bg-gradient-to-br ${gradient}
                  border-2 border-white/30
                `}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/30 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                </div>

                <div className="relative z-10 flex h-full flex-col">
                  <div className="text-7xl mb-5 text-center transform group-hover:scale-110 transition-transform duration-300">
                    <AnimatedIcon animate="none">{career.icon}</AnimatedIcon>
                  </div>

                  <h3 className="text-2xl font-extrabold text-white mb-3 text-center drop-shadow-md">
                    {career.title}
                  </h3>

                  <p className="text-white/90 mb-5 text-center text-sm font-medium">
                    {career.description}
                  </p>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Skills You&apos;ll Master:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {career.skills.map((skill) => (
                        <Badge key={skill} variant="trophy" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
                    <button
                      onClick={() => handleSelect(career.id)}
                      className="rounded-full bg-white px-5 py-3 text-sm font-extrabold text-slate-900 transition-all hover:scale-105"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => handleLearnMore(career.id)}
                      className="rounded-full border border-white/40 px-5 py-3 text-sm font-extrabold text-white transition-all hover:bg-white/15 hover:scale-105"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        {isQuickRecall && (
          <p className="text-white/60 text-sm mb-4 flex items-center justify-center gap-2">
            <AnimatedIcon animate="pulse" className="text-lg">⏱️</AnimatedIcon>
            Answer as many questions as possible before time runs out!
          </p>
        )}
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-white/50 text-white hover:bg-white/10 transition-all duration-300"
        >
          ← Back to Title
        </button>
      </div>
    </ScreenWrapper>
  );
}