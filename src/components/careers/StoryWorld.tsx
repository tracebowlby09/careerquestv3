"use client";

import { useEffect, useMemo, useState } from "react";
import type { Career } from "@/types/game";
import type { StoryMilestone } from "@/lib/storyMode";
import type { CertificationQuestion } from "@/lib/certificationQuestions";
import { certificationQuestionBank } from "@/lib/certificationQuestions";
import { audioSystem } from "@/lib/audio";
import { GameButton, AnimatedIcon, GradientCard } from "@/components/ui/UIComponents";

interface StoryWorldProps {
  career: Career;
  milestone: StoryMilestone;
  milestoneIndex: number;
  totalMilestones: number;
  onComplete: (success: boolean, score: number, total: number, incorrectAnswers?: { question: string; selectedAnswer: string; correctAnswer: string; explanation: string }[]) => void;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

const certificationTypeByCareer: Record<Career, keyof typeof certificationQuestionBank> = {
  programmer: "aws-developer",
  nurse: "rn-license",
  engineer: "pe-license",
  teacher: "teaching-license",
  chef: "servsafe",
  architect: "are-exam",
  lawyer: "bar-exam",
  retail: "customer-service",
  electrician: "journeyman",
  firefighter: "firefighter-cert",
  police: "police-academy",
  pilot: "cpl-license",
  veterinarian: "vet-tech",
  journalist: "journalism-award",
  "social-worker": "lcsw",
  accountant: "cpa",
  dentist: "dental-board",
  construction: "osha-30",
};

function shuffleOptions<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function StoryWorld({
  career,
  milestone,
  milestoneIndex,
  totalMilestones,
  onComplete,
  alwaysCorrect,
  onExit,
  onTutorialBack,
  onAnswerResult,
}: StoryWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);

  const certificationType = certificationTypeByCareer[career];
  const question = (certificationQuestionBank[certificationType][milestoneIndex] ?? certificationQuestionBank[certificationType][0]) as CertificationQuestion;
  const shuffledOptions = useMemo(() => shuffleOptions(question.options), [question.options]);
  const correctOption = question.options.find((option) => option.correct);
  const selectedOption = question.options.find((option) => option.id === selectedAnswer);

  useEffect(() => {
    if (alwaysCorrect && question && !hasAnswered) {
      const correctOpt = question.options.find((option) => option.correct);
      if (correctOpt) setSelectedAnswer(correctOpt.id);
    }
  }, [alwaysCorrect, question, hasAnswered]);

  useEffect(() => {
    if (stage === "challenge") {
      setQuestionStartTime(Date.now());
    }
  }, [stage, milestoneIndex]);

  const handleStart = () => {
    audioSystem.playClickSound();
    setStage("challenge");
    setHasAnswered(false);
    setSelectedAnswer(null);
  };

  const handleSubmit = () => {
    if (!selectedOption || !correctOption || hasAnswered) return;

    const isCorrect = selectedOption.correct;
    const answerTimeMs = questionStartTime !== null ? Date.now() - questionStartTime : 0;
    onAnswerResult?.(isCorrect, answerTimeMs);
    setHasAnswered(true);

    if (isCorrect) {
      onComplete(true, 1, 1);
      return;
    }

    onComplete(false, 0, 1, [
      {
        question: question.question,
        selectedAnswer: selectedOption.text,
        correctAnswer: correctOption.text,
        explanation: correctOption.explanation,
      },
    ]);
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-fuchsia-900 p-4 md:p-8 flex items-center justify-center">
        <GradientCard className="max-w-3xl w-full p-8 md:p-12 text-center" gradient="from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <div className="text-7xl mb-5">{milestone.character.icon}</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            {milestone.title}
          </h2>
          <p className="text-xl text-white/80 mb-6">
            Milestone {milestoneIndex + 1} of {totalMilestones}
          </p>

          <div className="rounded-2xl bg-white/10 p-6 border border-white/15 mb-8 text-left">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl">{milestone.character.icon}</div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">{milestone.character.name}</h3>
                <p className="text-white/70">{milestone.character.role}</p>
              </div>
            </div>
            <p className="text-white/75 text-lg">{milestone.briefing}</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 border border-white/15 mb-8 text-left">
            <h3 className="text-xl font-extrabold text-white mb-3">Mission Objective</h3>
            <p className="text-white/80">{milestone.objective}</p>
          </div>

          <div className="flex gap-4">
            <GameButton onClick={onTutorialBack || onExit} variant="ghost" className="flex-1">
              ← Back
            </GameButton>
            <GameButton onClick={handleStart} className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-600">
              Start Milestone →
            </GameButton>
          </div>
        </GradientCard>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <AnimatedIcon animate="none" className="text-4xl">{milestone.character.icon}</AnimatedIcon>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{milestone.title}</h3>
                  <p className="text-slate-600">
                    {milestone.character.name} • {milestone.character.role}
                  </p>
                </div>
              </div>
              <p className="text-slate-600">
                Milestone {milestoneIndex + 1} of {totalMilestones}
              </p>
            </div>
            <div className="h-3 md:w-64 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-full"
                style={{ width: `${((milestoneIndex + 1) / totalMilestones) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 mb-6">
            <p className="font-semibold text-violet-900 mb-2">Workplace Situation</p>
            <p className="text-violet-800">{milestone.briefing}</p>
          </div>

          <h4 className="text-xl font-bold text-slate-900 mb-4">{question.question}</h4>

          <div className="space-y-3 mb-6">
            {shuffledOptions.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.correct;
              const showResult = hasAnswered;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    if (hasAnswered) return;
                    audioSystem.playClickSound();
                    setSelectedAnswer(option.id);
                  }}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showResult && isCorrect
                      ? "border-green-500 bg-green-50"
                      : showResult && isSelected && !isCorrect
                        ? "border-red-500 bg-red-50"
                        : isSelected
                          ? "border-violet-500 bg-violet-50"
                          : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                  } disabled:cursor-not-allowed`}
                >
                  <span className="font-bold mr-2">{option.id.toUpperCase()}.</span>
                  {option.text}
                </button>
              );
            })}
          </div>

          {hasAnswered && selectedOption && correctOption && (
            <div className={`rounded-2xl p-5 mb-6 border-2 ${
              selectedOption.correct ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
            }`}>
              <h5 className={`text-lg font-extrabold mb-2 ${selectedOption.correct ? "text-green-700" : "text-red-700"}`}>
                {selectedOption.correct ? "Correct decision" : "Not quite"}
              </h5>
              <p className="text-slate-700 mb-2">
                {selectedOption.correct ? selectedOption.explanation : correctOption.explanation}
              </p>
              {!selectedOption.correct && (
                <p className="text-slate-600">
                  Correct answer: <span className="font-bold">{correctOption.text}</span>
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {!hasAnswered ? (
              <GameButton
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-600 disabled:from-slate-400 disabled:to-slate-500"
              >
                Submit Decision
              </GameButton>
            ) : (
              <GameButton onClick={() => onComplete(!!selectedOption?.correct, selectedOption?.correct ? 1 : 0, 1)} className="flex-1">
                Continue
              </GameButton>
            )}
            <GameButton onClick={onExit} variant="secondary" className="flex-1">
              Exit Story
            </GameButton>
          </div>
        </div>
      </div>
    </div>
  );
}
