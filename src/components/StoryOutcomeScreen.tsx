"use client";

import type { Difficulty, IncorrectAnswer } from "@/types/game";
import type { StoryMilestone } from "@/lib/storyMode";
import { GameButton, GradientCard, AnimatedIcon, AnimatedContainer } from "./ui/UIComponents";
import { careerInfoByCareer, CareerInfo } from "@/lib/careerInfo";
import type { Career } from "@/types/game";

interface StoryOutcomeScreenProps {
  careerTitle: string;
  careerIcon: string;
  milestone: StoryMilestone;
  milestoneIndex: number;
  totalMilestones: number;
  success: boolean;
  score: number;
  total: number;
  completedMilestones: number;
  incorrectAnswers?: IncorrectAnswer[];
  onNext: () => void;
  onReplay: () => void;
  onBackToJourney: () => void;
  onExit: () => void;
  onSelectPivotCareer?: (career: Career) => void;
}

const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect", "lawyer", "retail", "electrician", "firefighter", "police", "pilot", "veterinarian", "journalist", "social-worker", "accountant", "dentist", "construction"];

const getPivotCareers = (): CareerInfo[] => {
  const shuffled = [...allCareers].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map(career => careerInfoByCareer[career]);
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Bronze",
  medium: "Silver",
  hard: "Gold",
};

export default function StoryOutcomeScreen({
  careerTitle,
  careerIcon,
  milestone,
  milestoneIndex,
  totalMilestones,
  success,
  score,
  total,
  completedMilestones,
  incorrectAnswers = [],
  onNext,
  onReplay,
  onBackToJourney,
  onExit,
  onSelectPivotCareer,
}: StoryOutcomeScreenProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const isFinalMilestone = milestoneIndex + 1 === totalMilestones;
  const isFinalComplete = success && completedMilestones === totalMilestones;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-fuchsia-900 p-4 md:p-8 flex items-center justify-center">
      <GradientCard className="max-w-3xl w-full p-8 md:p-12 text-center" gradient="from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
        <div className="text-7xl mb-5">{careerIcon}</div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
          {careerTitle}
        </h2>
        <p className="text-white/70 text-lg mb-8">
          Milestone {milestoneIndex + 1} of {totalMilestones}: {milestone.title}
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <div className="rounded-2xl bg-white/10 p-5 border border-white/15">
            <div className="text-4xl mb-2">{milestone.character.icon}</div>
            <div className="text-white font-bold">{milestone.character.name}</div>
            <div className="text-white/60 text-sm">{milestone.character.role}</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-5 border border-white/15 flex-1">
            <div className="text-4xl mb-2">{success ? "🌟" : "🧩"}</div>
            <div className="text-white font-bold">{success ? "Milestone Cleared" : "Keep Practicing"}</div>
            <div className="text-white/60 text-sm">{percentage}% score</div>
          </div>
        </div>

        <div className="text-left rounded-2xl bg-white/10 p-6 border border-white/15 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{success ? "✅" : "🔁"}</div>
            <div>
              <h3 className="text-xl font-extrabold text-white mb-2">
                {success ? milestone.successLine : milestone.retryLine}
              </h3>
              <p className="text-white/75">
                {milestone.briefing}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/15 text-white text-sm font-bold">
                  Objective: {milestone.objective}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 text-white text-sm font-bold">
                  Difficulty: {difficultyLabels[milestone.difficulty]}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 text-white text-sm font-bold">
                  Score: {score}/{total}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!success && onSelectPivotCareer && (
          <div className="rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-6 border border-purple-500/30 mb-8 text-left">
            <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
              <span>🧭</span> Career Pivot Suggestions
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Not the right fit? Here are other careers you might excel in:
            </p>
            <div className="space-y-3">
              {getPivotCareers().map((careerInfo, idx) => (
                <AnimatedContainer key={careerInfo.id} delay={idx * 50}>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/15">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{careerInfo.icon}</span>
                      <span className="text-white font-medium">{careerInfo.title}</span>
                    </div>
                    <GameButton 
                      onClick={() => onSelectPivotCareer(careerInfo.id)}
                      className="text-xs py-1 px-3 bg-gradient-to-r from-purple-500 to-indigo-600"
                    >
                      Try This
                    </GameButton>
                  </div>
                </AnimatedContainer>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {isFinalComplete ? (
            <GameButton onClick={onNext} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-950">
              View Journey Complete →
            </GameButton>
          ) : success ? (
            <GameButton onClick={onNext} className="bg-gradient-to-r from-violet-500 to-fuchsia-600">
              Next Milestone →
            </GameButton>
          ) : (
            <GameButton onClick={onReplay} className="bg-gradient-to-r from-amber-500 to-orange-600">
              Retry Milestone
            </GameButton>
          )}

          <GameButton onClick={onBackToJourney} variant="ghost">
            Choose Career Journey
          </GameButton>
        </div>

        <button
          onClick={onExit}
          className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition"
        >
          ← Exit to Title
        </button>
      </GradientCard>
    </div>
  );
}