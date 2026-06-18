"use client";

import type { Career } from "@/types/game";
import { storyJourneyByCareer } from "@/lib/storyMode";
import { GameButton, GradientCard, AnimatedIcon, AnimatedContainer } from "./ui/UIComponents";

interface StoryCompleteScreenProps {
  career: Career;
  onPlayAgain: () => void;
  onChooseJourney: () => void;
  onExit: () => void;
}

export default function StoryCompleteScreen({ career, onPlayAgain, onChooseJourney, onExit }: StoryCompleteScreenProps) {
  const journey = storyJourneyByCareer[career];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-fuchsia-900 p-4 md:p-8 flex items-center justify-center">
      <GradientCard className="max-w-3xl w-full p-8 md:p-12 text-center" gradient="from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
        <AnimatedIcon animate="bounce" className="text-8xl mb-5 inline-block">🏆</AnimatedIcon>
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
          Journey Complete!
        </h2>
        <p className="text-xl text-white/80 mb-8">
          You completed every milestone in the {journey.title} career journey.
        </p>

        <div className="rounded-2xl bg-white/10 p-6 border border-white/15 mb-8 text-left">
          <div className="flex items-start gap-4 mb-5">
            <div className="text-6xl">{journey.icon}</div>
            <div>
              <h3 className="text-2xl font-extrabold text-white">{journey.title}</h3>
              <p className="text-white/70 mt-1">Mentor: {journey.mentor.name}</p>
            </div>
          </div>
          <p className="text-white/75">
            {journey.mentor.quote}
          </p>
        </div>

        <div className="grid gap-3 mb-8">
          {journey.milestones.map((milestone, index) => (
            <AnimatedContainer key={milestone.id} delay={index * 60}>
              <div className="rounded-xl bg-white/10 border border-white/15 p-4 flex items-center gap-4 text-left">
                <div className="text-3xl">✅</div>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-bold">{milestone.title}</div>
                  <div className="text-white/60 text-sm">{milestone.character.name} • {milestone.character.role}</div>
                </div>
              </div>
            </AnimatedContainer>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <GameButton onClick={onPlayAgain} className="bg-gradient-to-r from-emerald-500 to-green-600">
            Replay Journey
          </GameButton>
          <GameButton onClick={onChooseJourney} className="bg-gradient-to-r from-violet-500 to-fuchsia-600">
            Choose Another Journey
          </GameButton>
          <GameButton onClick={onExit} variant="ghost">
            Back to Title
          </GameButton>
        </div>
      </GradientCard>
    </div>
  );
}
