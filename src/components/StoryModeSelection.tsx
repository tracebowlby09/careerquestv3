"use client";

import { Career, StoryProgress } from "@/types/game";
import { storyJourneyByCareer, storyJourneyOrder, getStoryJourneyProgress, isStoryJourneyComplete } from "@/lib/storyMode";
import ScreenWrapper from "./ScreenWrapper";
import { AnimatedContainer, AnimatedIcon, GameButton } from "./ui/UIComponents";

interface StoryModeSelectionProps {
  progress: StoryProgress;
  onStartJourney: (career: Career) => void;
  onBack: () => void;
}

export default function StoryModeSelection({ progress, onStartJourney, onBack }: StoryModeSelectionProps) {
  const completedJourneys = progress.completedJourneys.length;
  const totalJourneys = storyJourneyOrder.length;

  return (
    <ScreenWrapper onExit={onBack}>
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 px-8 py-3 rounded-full mb-6 shadow-xl">
          <AnimatedIcon animate="none" className="text-3xl">📖</AnimatedIcon>
          <span className="text-white font-bold text-2xl tracking-wide">STORY MODE</span>
          <AnimatedIcon animate="none" className="text-3xl">📖</AnimatedIcon>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Complete a Career Journey
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Meet mentors, solve workplace milestones, and earn your way through real career paths.
        </p>
        <div className="mt-5 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full text-white">
          <span className="text-yellow-300">🏁</span>
          <span className="font-bold">{completedJourneys} / {totalJourneys} journeys completed</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {storyJourneyOrder.map((career, index) => {
          const journey = storyJourneyByCareer[career];
          const completed = getStoryJourneyProgress(progress, career);
          const total = journey.milestones.length;
          const isComplete = isStoryJourneyComplete(progress, career);

          return (
            <AnimatedContainer key={career} delay={index * 40}>
              <div className="h-full rounded-2xl border-2 border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
                <div className="flex items-start gap-4 mb-5">
                  <div className="text-6xl">{journey.icon}</div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-extrabold text-white">{journey.title}</h3>
                    <p className="text-white/70 text-sm mt-1">
                      Mentor: <span className="font-bold text-white">{journey.mentor.name}</span>
                    </p>
                    <p className="text-white/60 text-sm mt-1">{journey.mentor.role}</p>
                  </div>
                </div>

                <p className="text-white/80 mb-5 text-sm">
                  {journey.mentor.quote}
                </p>

                <div className="mb-5">
                  <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                    <span>Journey Progress</span>
                    <span className="font-bold text-white">{completed} / {total}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full transition-all duration-500"
                      style={{ width: `${(completed / total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-5 gap-2 mb-6">
                  {journey.milestones.map((milestone, milestoneIndex) => {
                    const milestoneComplete = progress.completedMilestones.includes(milestone.id);
                    return (
                      <div
                        key={milestone.id}
                        className={`rounded-xl px-3 py-3 text-center border ${
                          milestoneComplete
                            ? "border-green-400/50 bg-green-500/20"
                            : "border-white/15 bg-white/5"
                        }`}
                        title={milestone.title}
                      >
                        <div className="text-xl mb-1">{milestoneComplete ? "✅" : milestone.character.icon}</div>
                        <div className="text-[11px] font-bold text-white/80">
                          {milestoneIndex + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <GameButton
                    onClick={() => onStartJourney(career)}
                    className={`flex-1 ${isComplete ? "bg-gradient-to-r from-emerald-500 to-green-600" : "bg-gradient-to-r from-violet-500 to-fuchsia-600"}`}
                  >
                    {isComplete ? "Replay Journey" : "Start Journey"}
                  </GameButton>
                </div>
              </div>
            </AnimatedContainer>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <GameButton onClick={onBack} variant="ghost" className="px-10">
          ← Back to Title
        </GameButton>
      </div>
    </ScreenWrapper>
  );
}
