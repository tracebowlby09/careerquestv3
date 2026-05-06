"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { CertificationType } from "@/types/game";
import { audioSystem } from "@/lib/audio";
import { certificationQuestionBank, certificationConfig, getRandomQuestions, CertificationQuestion, certificationMetadata } from "@/lib/certificationQuestions";
import TutorialScreen from "./TutorialScreen";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface CertificationWorldProps {
  certificationType: CertificationType;
  onComplete: (success: boolean, score: number, total: number) => void;
  onExit?: () => void;
  onTutorialBack?: () => void;
}

export default function CertificationWorld({
  certificationType,
  onComplete,
  onExit,
  onTutorialBack,
}: CertificationWorldProps) {
  const [stage, setStage] = useState<"intro" | "tutorial" | "playing">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const config = certificationConfig[certificationType];
  const meta = certificationMetadata[certificationType];
  const allQuestions = certificationQuestionBank[certificationType];
  const questionCount = Math.min(config.questionCount, allQuestions.length);

  const questions = useMemo(() => {
    return getRandomQuestions(allQuestions, questionCount);
  }, [allQuestions, questionCount]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleSubmit = useCallback(() => {
    const selected = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
    if (!selected) return;
    const isCorrect = selected.correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setAnsweredQuestions([...answeredQuestions, isCorrect]);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(config.timeLimitSeconds || null);
    } else {
      const passPercentage = (newScore / totalQuestions) * 100;
      const passed = passPercentage >= config.passPercentage;
      onComplete(passed, newScore, totalQuestions);
    }
  }, [currentQuestion, selectedAnswer, score, answeredQuestions, currentQuestionIndex, totalQuestions, config.passPercentage, config.timeLimitSeconds, onComplete]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || currentQuestionIndex >= totalQuestions) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) { handleSubmit(); return 0; }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentQuestionIndex, totalQuestions, handleSubmit]);

  useEffect(() => {
    if (config.timeLimitSeconds) { setTimeLeft(config.timeLimitSeconds); }
  }, [config.timeLimitSeconds]);

  const shuffledOptions = useMemo(() => {
    return shuffleArray(currentQuestion.options);
  }, [currentQuestionIndex, currentQuestion.options]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (stage === "intro") {
    const meta = certificationMetadata[certificationType];
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{meta.icon}</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{meta.title}</h2>
              <p className="text-lg text-gray-600 mb-6">{meta.description}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-purple-900 mb-3">Exam Details</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div><div className="text-2xl font-bold text-purple-600">{questionCount}</div><div className="text-sm text-purple-700">Questions</div></div>
                <div><div className="text-2xl font-bold text-purple-600">{config.passPercentage}%</div><div className="text-sm text-purple-700">Passing Score</div></div>
                <div><div className="text-2xl font-bold text-purple-600">{config.timeLimitSeconds ? `${config.timeLimitSeconds}s` : "No Limit"}</div><div className="text-sm text-purple-700">Time Limit</div></div>
              </div>
            </div>
            <button onClick={() => setStage("tutorial")} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200">
              Start Certification Exam →
            </button>
            <button onClick={() => { audioSystem.playClickSound(); if (onTutorialBack) onTutorialBack(); else if (onExit) onExit(); }}
              className="w-full mt-4 text-gray-600 hover:text-gray-900 font-bold py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors">
              ← Back to Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "tutorial") {
    const meta = certificationMetadata[certificationType];
    return (
      <TutorialScreen careerName={meta.title} careerIcon={meta.icon}
        steps={[
          { title: "Understand the Domain", content: `Each question covers ${meta.description.toLowerCase()}. Read carefully.`, icon: "📖" },
          { title: "Review the Question", content: "Some questions may have multiple correct-looking options. Look for the best answer.", icon: "🔍" },
          { title: "Select Your Answer", content: "Choose the most accurate option. There is only one correct answer per question.", icon: "👆" },
          { title: "Pass the Certification", content: `You need ${Math.ceil(config.passPercentage)}% (${Math.ceil(totalQuestions * config.passPercentage / 100)} out of ${totalQuestions}) to earn this certification. Good luck!`, icon: "🏆" },
        ]} onStart={() => setStage("playing")} onBack={() => setStage("intro")}
      />
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => { audioSystem.playClickSound(); if (onExit) onExit(); }} className="text-gray-500 hover:text-gray-700 transition-colors" title="Home">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <button onClick={() => { audioSystem.playClickSound(); window.dispatchEvent(new Event('openSettings')); }} className="text-gray-500 hover:text-gray-700 transition-colors" title="Settings">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.572-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">📋 Question {currentQuestionIndex + 1} of {totalQuestions}</h3>
            <div className="flex items-center gap-4">
              {timeLeft !== null && (<div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 60 ? "bg-red-100 animate-pulse" : "bg-purple-100"}`}>
                <span className="text-lg">⏱️</span><span className={`text-xl font-bold ${timeLeft <= 60 ? "text-red-600" : "text-purple-600"}`}>{formatTime(timeLeft)}</span></div>)}
              <div className="text-right"><div className="text-sm text-gray-600">Score</div><div className="text-2xl font-bold text-purple-600">{score}/{currentQuestionIndex}</div></div>
            </div>
          </div>
          <div className="mb-6"><div className="flex gap-2">{questions.map((_, idx) => (<div key={idx} className={`h-2 flex-1 rounded-full ${idx < currentQuestionIndex ? (answeredQuestions[idx] ? "bg-green-500" : "bg-red-500") : idx === currentQuestionIndex ? "bg-purple-500" : "bg-gray-300"}`} />))}</div></div>
          <div className="mb-4"><span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">{currentQuestion.domain}</span></div>
          <p className="text-lg font-semibold text-gray-900 mb-4">{currentQuestion.question}</p>
          <div className="space-y-3 mb-6">
            {shuffledOptions.map((option) => (<label key={option.id} className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAnswer === option.id ? "border-purple-600 bg-purple-50" : "border-gray-300 hover:border-purple-400"}`}>
              <input type="radio" name="answer" value={option.id} checked={selectedAnswer === option.id} onChange={(e) => { audioSystem.playClickSound(); setSelectedAnswer(e.target.value); }} className="mr-3" />
              <span className="text-gray-800">{option.text}</span></label>))}
          </div>
          <button onClick={handleSubmit} disabled={!selectedAnswer} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            {currentQuestionIndex < totalQuestions - 1 ? "Next Question →" : "Submit Final Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
