"use client";

import { useState, useMemo } from "react";
import { Difficulty } from "@/types/game";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface ArchitectWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  isQuickRecall?: boolean;
}

interface Question {
  id: string;
  scenario: string;
  question: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "A client wants maximum natural light in their home.",
      question: "What's the best design approach?",
      options: [
        { id: "a", text: "Large south-facing windows with overhangs", correct: true, explanation: "South-facing windows get consistent light; overhangs prevent overheating." },
        { id: "b", text: "Windows on all sides equally", correct: false, explanation: "This doesn't optimize for sun path and can cause heat issues." },
        { id: "c", text: "Skylights only", correct: false, explanation: "Skylights alone don't provide views and can cause heat gain." },
      ],
    },
    {
      id: "e2",
      scenario: "You're designing a wheelchair-accessible entrance.",
      question: "What's the maximum ramp slope allowed by ADA?",
      options: [
        { id: "a", text: "1:12 (1 inch rise per 12 inches run)", correct: true, explanation: "ADA requires 1:12 maximum slope for accessibility." },
        { id: "b", text: "1:6 (steeper is fine)", correct: false, explanation: "This is too steep for wheelchair users." },
        { id: "c", text: "1:20 (flatter is required)", correct: false, explanation: "While flatter is better, 1:12 is the standard maximum." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "A client wants an open floor plan but the building needs structural support.",
      question: "What's the best solution?",
      options: [
        { id: "a", text: "Use steel beams or columns strategically placed", correct: true, explanation: "Steel allows for longer spans and maintains open space." },
        { id: "b", text: "Remove all walls and hope for the best", correct: false, explanation: "This is structurally unsafe and violates building codes." },
        { id: "c", text: "Keep all load-bearing walls", correct: false, explanation: "This doesn't achieve the open floor plan goal." },
      ],
    },
    {
      id: "m2",
      scenario: "You're designing for a hot, humid climate.",
      question: "What passive cooling strategies should you prioritize?",
      options: [
        { id: "a", text: "Cross-ventilation, shading, and thermal mass", correct: true, explanation: "These strategies reduce cooling needs naturally." },
        { id: "b", text: "Large windows for views", correct: false, explanation: "Unshaded windows increase heat gain in hot climates." },
        { id: "c", text: "Dark exterior colors", correct: false, explanation: "Dark colors absorb heat, worsening the problem." },
      ],
    },
    {
      id: "m3",
      scenario: "Your design exceeds the client's budget by 20%.",
      question: "What's the professional approach?",
      options: [
        { id: "a", text: "Present value engineering options while maintaining design intent", correct: true, explanation: "Offer alternatives that reduce cost without compromising key goals." },
        { id: "b", text: "Tell them to increase their budget", correct: false, explanation: "This doesn't address the problem or show flexibility." },
        { id: "c", text: "Cheap out on materials everywhere", correct: false, explanation: "This compromises quality and may not achieve needed savings." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "You're designing a building in a seismic zone.",
      question: "What structural system is most earthquake-resistant?",
      options: [
        { id: "a", text: "Base isolation with flexible connections", correct: true, explanation: "Base isolation allows the building to move independently of ground motion." },
        { id: "b", text: "Rigid concrete structure", correct: false, explanation: "Rigid structures can crack and fail during earthquakes." },
        { id: "c", text: "Standard wood frame", correct: false, explanation: "While wood is flexible, it's not optimal for large buildings in high seismic zones." },
      ],
    },
    {
      id: "h2",
      scenario: "A historic building needs renovation while preserving its character.",
      question: "What's the best approach to modernization?",
      options: [
        { id: "a", text: "Preserve exterior and historic elements, modernize interior systems", correct: true, explanation: "This balances preservation with functionality and code compliance." },
        { id: "b", text: "Gut everything and rebuild to look old", correct: false, explanation: "This destroys historic fabric and authenticity." },
        { id: "c", text: "Leave everything original, no updates", correct: false, explanation: "This may not meet modern codes or client needs." },
      ],
    },
    {
      id: "h3",
      scenario: "You discover a design error after construction has started.",
      question: "What's your professional and legal obligation?",
      options: [
        { id: "a", text: "Immediately notify all parties, propose solutions, document everything", correct: true, explanation: "Transparency and quick action minimize damage and liability." },
        { id: "b", text: "Try to hide it and hope no one notices", correct: false, explanation: "This is unethical, illegal, and will make things worse." },
        { id: "c", text: "Blame the contractor", correct: false, explanation: "Design errors are the architect's responsibility." },
      ],
    },
    {
      id: "h4",
      scenario: "A client wants a design that violates building codes.",
      question: "How do you handle this?",
      options: [
        { id: "a", text: "Explain code requirements and offer compliant alternatives", correct: true, explanation: "Architects must ensure code compliance while meeting client goals." },
        { id: "b", text: "Do what they want, it's their building", correct: false, explanation: "Architects can lose their license for code violations." },
        { id: "c", text: "Refuse to work with them", correct: false, explanation: "Education and alternatives are better than walking away immediately." },
      ],
    },
  ],
};

// Quick Recall mode - add your own questions here
const quickRecallQuestions: Question[] = [];

export default function ArchitectWorld({ difficulty, onComplete, isQuickRecall }: ArchitectWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  // Use quick recall questions if available, otherwise fall back to easy questions
  const currentQuestions = isQuickRecall 
    ? (quickRecallQuestions.length > 0 ? quickRecallQuestions : questions.easy)
    : questions[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  // Shuffle options for current question
  const shuffledOptions = useMemo(() => {
    return shuffleArray(currentQuestion.options);
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    const selected = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
    if (!selected) return;

    const isCorrect = selected.correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setAnsweredQuestions([...answeredQuestions, isCorrect]);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      const passThreshold = Math.ceil(totalQuestions * 0.6);
      onComplete(newScore >= passThreshold, newScore, totalQuestions);
    }
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-slate-600 to-zinc-700 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Architect - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Scenario:</strong> You&apos;re an architect facing {totalQuestions} different 
              design challenges. Make decisions that balance aesthetics, function, and safety.
            </p>
            
            <div className="bg-slate-50 border-l-4 border-slate-500 p-4">
              <p className="font-semibold text-slate-900">Your Task:</p>
              <p className="text-slate-800">
                Solve {totalQuestions} architectural challenges. You need {Math.ceil(totalQuestions * 0.6)} correct to pass!
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Difficulty: {difficulty.toUpperCase()}</strong> - 
                {difficulty === "easy" && " Basic design principles"}
                {difficulty === "medium" && " Complex design problems"}
                {difficulty === "hard" && " Professional practice and ethics"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setStage("challenge")}
            className="w-full mt-8 bg-slate-600 text-white font-bold py-4 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Start Designing →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-slate-600 to-zinc-700 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              📐 Design Challenge {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="text-right">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold text-slate-600">{score}/{currentQuestionIndex}</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-2">
              {currentQuestions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded-full ${
                    idx < currentQuestionIndex
                      ? answeredQuestions[idx]
                        ? "bg-green-500"
                        : "bg-red-500"
                      : idx === currentQuestionIndex
                      ? "bg-slate-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-500 p-4 mb-6">
            <p className="font-semibold text-slate-900 mb-2">Design Scenario:</p>
            <p className="text-slate-800">{currentQuestion.scenario}</p>
          </div>

          <p className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </p>

          <div className="space-y-3 mb-6">
            {shuffledOptions.map((option) => (
              <label
                key={option.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAnswer === option.id
                    ? "border-slate-600 bg-slate-50"
                    : "border-gray-300 hover:border-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-800">{option.text}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestionIndex < totalQuestions - 1 ? "Next Challenge →" : "Submit Final Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
