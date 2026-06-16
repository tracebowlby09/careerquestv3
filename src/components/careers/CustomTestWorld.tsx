"use client";

import { useState, useEffect, useMemo } from "react";
import { CustomTest, CustomQuestion } from "@/types/game";
import { GradientCard, GameButton } from "./ui/UIComponents";

interface CustomTestWorldProps {
  test: CustomTest;
  onComplete: (success: boolean, score: number, total: number) => void;
  isQuickRecall?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function CustomTestWorld({ test, onComplete, isQuickRecall, alwaysCorrect, onExit, onAnswerResult }: CustomTestWorldProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const shuffledQuestions = useMemo(() => shuffleArray(test.questions), [test.questions]);
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleAnswer = (index: number) => {
    const correct = index === currentQuestion.correctIndex || !!alwaysCorrect;
    setSelectedAnswer(index);
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    }

    const timeMs = startTime ? Date.now() - startTime : 0;
    onAnswerResult?.(correct, timeMs);

    // For quick recall, auto-advance after 1 second
    if (isQuickRecall) {
      setTimeout(() => {
        handleNext(correct);
      }, 1000);
    }
  };

  const handleNext = (wasCorrectForQuickRecall?: boolean) => {
    setSelectedAnswer(null);
    setStartTime(Date.now());

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz complete
      const finalScore = wasCorrectForQuickRecall !== undefined ? (wasCorrectForQuickRecall ? score + 1 : score) : score;
      onComplete(finalScore === shuffledQuestions.length, finalScore, shuffledQuestions.length);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  const shuffledOptions = useMemo(() => {
    const options = [...currentQuestion.options];
    const correct = options[currentQuestion.correctIndex];
    const otherOptions = options.filter((_, idx) => idx !== currentQuestion.correctIndex);
    return shuffleArray([correct, ...otherOptions]);
  }, [currentQuestion]);

  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <GradientCard className="p-6 max-w-2xl mx-auto" gradient={test.themeColors ? `${test.themeColors.primary?.replace('#', 'from-[') || 'from-blue-500'} to-${test.themeColors?.secondary?.replace('#', '[') || 'indigo-600'}]` || "from-blue-500 to-indigo-600"}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{test.name}</h2>
        <span className="text-white/70">Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</span>
      </div>

      <div className="w-full bg-white/20 rounded-full h-2 mb-4">
        <div className="bg-white/50 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mb-6">
        <p className="text-white text-lg mb-4">{currentQuestion.question}</p>
        
        <div className="grid grid-cols-1 gap-2">
          {shuffledOptions.map((option, idx) => {
            let buttonClass = "w-full py-3 px-4 rounded-lg text-left transition-all";
            
            if (selectedAnswer !== null) {
              const originalCorrectIndex = currentQuestion.options.indexOf(option);
              const isThisCorrect = originalCorrectIndex === currentQuestion.correctIndex;
              const isSelected = selectedAnswer === idx;
              
              if (isThisCorrect) {
                buttonClass += " bg-green-500/30 border-2 border-green-400";
              } else if (isSelected) {
                buttonClass += " bg-red-500/30 border-2 border-red-400";
              } else {
                buttonClass += " bg-white/10 opacity-50";
              }
            } else {
              buttonClass += " bg-white/10 hover:bg-white/20 text-white";
            }

            return (
              <button
                key={idx}
                onClick={() => selectedAnswer === null && handleAnswer(idx)}
                disabled={selectedAnswer !== null}
                className={buttonClass}
              >
                <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {selectedAnswer !== null && !isQuickRecall && (
        <div className="mb-4">
          <p className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? '✓ Correct!' : '✗ Wrong!'}
          </p>
          {currentQuestion.explanation && (
            <p className="text-white/70 mt-2">{currentQuestion.explanation}</p>
          )}
        </div>
      )}

      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          {currentQuestionIndex > 0 && (
            <GameButton onClick={handlePrevious} variant="ghost" className="text-sm">
              ← Previous
            </GameButton>
          )}
        </div>
        <div className="flex gap-2">
          {onExit && (
            <GameButton onClick={onExit} variant="ghost" className="text-sm">
              Exit
            </GameButton>
          )}
          {selectedAnswer !== null && !isQuickRecall && (
            <GameButton onClick={() => handleNext()} className="text-sm">
              {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next →' : 'Finish'}
            </GameButton>
          )}
        </div>
      </div>
    </GradientCard>
  );
}