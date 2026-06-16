"use client";

import { useState, useMemo, useEffect } from "react";
import { Difficulty, IncorrectAnswer } from "@/types/game";
import { audioSystem } from "@/lib/audio";
import TutorialScreen from "@/components/TutorialScreen";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface ConstructionWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number, incorrectAnswers?: IncorrectAnswer[]) => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

interface Task {
  id: string;
  name: string;
  priority: number;
}

interface Question {
  id: string;
  scenario: string;
  tasks: Task[];
  correctOrder: string[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Three tasks for today's job site - prioritize for safety and efficiency.",
      tasks: [
        { id: "p1", name: "Safety inspection before work starts", priority: 1 },
        { id: "p2", name: "Order materials delivery", priority: 3 },
        { id: "p3", name: "Coordinate crane schedule", priority: 2 },
      ],
      correctOrder: ["p1", "p3", "p2"],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Multiple project priorities - manage the day.",
      tasks: [
        { id: "p1", name: "Address safety hazard - exposed wires", priority: 1 },
        { id: "p2", name: "Inspect concrete pour", priority: 2 },
        { id: "p3", name: "Schedule inspections", priority: 3 },
        { id: "p4", name: "Update project schedule", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Complex project day - safety and regulatory priorities.",
      tasks: [
        { id: "p1", name: "Address structural issue found during inspection", priority: 1 },
        { id: "p2", name: "OSHA safety audit preparation", priority: 2 },
        { id: "p3", name: "Critical concrete pour timing", priority: 3 },
        { id: "p4", name: "Subcontractor coordination", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Prioritize: safety, foundation, framing, finish work",
    tasks: [
      { id: "p1", name: "Safety hazard assessment", priority: 1 },
      { id: "p2", name: "Foundation work", priority: 2 },
      { id: "p3", name: "Framing inspection", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr2",
    scenario: "Prioritize: permit inspection, material delivery, crew scheduling",
    tasks: [
      { id: "p1", name: "Building permit inspection", priority: 1 },
      { id: "p2", name: "Concrete delivery coordination", priority: 2 },
      { id: "p3", name: "Electrical crew scheduling", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr3",
    scenario: "Prioritize: weather delays, safety check, deadline pressure",
    tasks: [
      { id: "p1", name: "Secure loose materials for wind", priority: 1 },
      { id: "p2", name: "Morning safety briefing", priority: 2 },
      { id: "p3", name: "Update project timeline", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr4",
    scenario: "Prioritize: OSHA compliance, daily tasks, paperwork",
    tasks: [
      { id: "p1", name: "Conduct OSHA required safety training", priority: 1 },
      { id: "p2", name: "Inspect scaffolding setup", priority: 2 },
      { id: "p3", name: "File daily progress report", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr5",
    scenario: "Prioritize: blueprint corrections, material shortage, inspection",
    tasks: [
      { id: "p1", name: "Review revised blueprints for errors", priority: 1 },
      { id: "p2", name: "Order additional lumber", priority: 2 },
      { id: "p3", name: "Document change order request", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr6",
    scenario: "Prioritize: concrete pour, weather window, crew coordination",
    tasks: [
      { id: "p1", name: "Prepare for concrete pour", priority: 1 },
      { id: "p2", name: "Confirm concrete truck arrival", priority: 2 },
      { id: "p3", name: "Set up vibration equipment", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr7",
    scenario: "Prioritize: structural inspection, scheduling, ordering",
    tasks: [
      { id: "p1", name: "Inspect foundation footings", priority: 1 },
      { id: "p2", name: "Reschedule plumbing rough-in", priority: 2 },
      { id: "p3", name: "Order insulation materials", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr8",
    scenario: "Prioritize: hazard control, daily prep, documentation",
    tasks: [
      { id: "p1", name: "Address trench safety violation", priority: 1 },
      { id: "p2", name: "Post today's work assignments", priority: 2 },
      { id: "p3", name: "Upload safety photos to portal", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr9",
    scenario: "Prioritize: quality check, deadline, resource allocation",
    tasks: [
      { id: "p1", name: "Verify beam measurements", priority: 1 },
      { id: "p2", name: "Coordinate crane availability", priority: 2 },
      { id: "p3", name: "Email client project update", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr10",
    scenario: "Prioritize: environmental compliance, work progress, meetings",
    tasks: [
      { id: "p1", name: "Submit stormwater runoff report", priority: 1 },
      { id: "p2", name: "Complete backfill inspection", priority: 2 },
      { id: "p3", name: "Prep for weekly progress meeting", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr11",
    scenario: "Prioritize: electrical work, inspection, scheduling",
    tasks: [
      { id: "p1", name: "Test electrical connections", priority: 1 },
      { id: "p2", name: "Schedule electrical inspection", priority: 2 },
      { id: "p3", name: "Update project estimate", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr12",
    scenario: "Prioritize: plumbing inspection, material delay, timeline",
    tasks: [
      { id: "p1", name: "Inspect plumbing rough-in work", priority: 1 },
      { id: "p2", name: "Follow up on pipe delivery delay", priority: 2 },
      { id: "p3", name: "Notify subcontractors of changes", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr13",
    scenario: "Prioritize: HVAC installation, quality, coordination",
    tasks: [
      { id: "p1", name: "Verify HVAC load calculations", priority: 1 },
      { id: "p2", name: "Inspect ductwork installation", priority: 2 },
      { id: "p3", name: "Coordinate with electrical team", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr14",
    scenario: "Prioritize: roofing, weather, safety",
    tasks: [
      { id: "p1", name: "Secure roofing materials for overnight", priority: 1 },
      { id: "p2", name: "Check wind forecast for scaffolding", priority: 2 },
      { id: "p3", name: "Verify harness inspections current", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr15",
    scenario: "Prioritize: drywall, scheduling, cleanup",
    tasks: [
      { id: "p1", name: "Inspect drywall finish quality", priority: 1 },
      { id: "p2", name: "Schedule drywall taping crew", priority: 2 },
      { id: "p3", name: "Coordinate site cleanup today", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr16",
    scenario: "Prioritize: painting, weather prep, inspection",
    tasks: [
      { id: "p1", name: "Verify paint adhesion test results", priority: 1 },
      { id: "p2", name: "Protect finished flooring from paint", priority: 2 },
      { id: "p3", name: "Schedule final walkthrough prep", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr17",
    scenario: "Prioritize: flooring, moisture, scheduling",
    tasks: [
      { id: "p1", name: "Test concrete moisture levels", priority: 1 },
      { id: "p2", name: "Coordinate tile delivery timing", priority: 2 },
      { id: "p3", name: "Update flooring warranty documents", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr18",
    scenario: "Prioritize: safety violation, work stoppage, reporting",
    tasks: [
      { id: "p1", name: "Stop work for unsafe scaffold", priority: 1 },
      { id: "p2", name: "Correct scaffold issues immediately", priority: 2 },
      { id: "p3", name: "Document OSHA report", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr19",
    scenario: "Prioritize: final inspection, punch list, handover",
    tasks: [
      { id: "p1", name: "Complete final building inspection", priority: 1 },
      { id: "p2", name: "Resolve all punch list items", priority: 2 },
      { id: "p3", name: "Prepare owner handover package", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr20",
    scenario: "Prioritize: warranty work, new project, documentation",
    tasks: [
      { id: "p1", name: "Address warranty callback issues", priority: 1 },
      { id: "p2", name: "Start new project mobilization", priority: 2 },
      { id: "p3", name: "Close out old project files", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
];

export default function ConstructionWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: ConstructionWorldProps) {
  const [stage, setStage] = useState<"intro" | "tutorial" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showHeartLost, setShowHeartLost] = useState(false);

  useEffect(() => {
    if (!isQuickRecall || stage !== "challenge" || hearts <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setHearts((h) => h - 1);
          setShowHeartLost(true);
          setTimeout(() => setShowHeartLost(false), 1000);
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuickRecall, stage, hearts]);

  useEffect(() => {
    if (isQuickRecall && stage === "challenge") {
      setTimeLeft(20);
    }
  }, [currentQuestionIndex, isQuickRecall, stage]);

  const currentQuestions = isQuickRecall
    ? (quickRecallQuestions.length > 0 ? quickRecallQuestions : questions.easy)
    : questions[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  useEffect(() => {
    if (alwaysCorrect && currentQuestion) {
      setSelectedOrder(currentQuestion.correctOrder);
    }
  }, [alwaysCorrect, currentQuestionIndex]);

  const shuffledTasks = useMemo(() => {
    return shuffleArray(currentQuestion.tasks);
  }, [currentQuestionIndex]);

  const handleTaskClick = (taskId: string) => {
    audioSystem.playClickSound();
    if (selectedOrder.includes(taskId)) {
      setSelectedOrder(selectedOrder.filter((id) => id !== taskId));
    } else {
      setSelectedOrder([...selectedOrder, taskId]);
    }
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(currentQuestion.correctOrder);

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      setAnsweredQuestions([...answeredQuestions, true]);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOrder([]);
      } else {
        onComplete(true, newScore, totalQuestions);
      }
    } else {
      if (isQuickRecall) {
        setHearts((h) => h - 1);
        setShowHeartLost(true);
        setTimeout(() => setShowHeartLost(false), 1000);
        setStreak(0);
        if (hearts <= 1) {
          onComplete(false, score, totalQuestions, incorrectAnswers);
        } else if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOrder([]);
        } else {
          onComplete(score >= Math.ceil(totalQuestions * 0.6), score, totalQuestions, incorrectAnswers);
        }
      } else {
        setAnsweredQuestions([...answeredQuestions, false]);
        let updatedIncorrect = [...incorrectAnswers, {
          question: currentQuestion.scenario,
          selectedAnswer: selectedOrder.join(" → "),
          correctAnswer: currentQuestion.correctOrder.join(" → "),
          explanation: "Incorrect construction task prioritization.",
        }];
        setIncorrectAnswers(updatedIncorrect);
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOrder([]);
        } else {
          const passThreshold = Math.ceil(totalQuestions * 0.6);
          onComplete(score >= passThreshold, score, totalQuestions, updatedIncorrect);
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedOrder.length > 0 && stage === "challenge") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOrder, stage, handleSubmit]);

  if (stage === "intro") {
    return (
      <TutorialScreen
        careerName="Construction Manager"
        careerIcon="🏗️"
        steps={[
          {
            title: "Understand Each Scenario",
            content: "Each question describes construction tasks on a job site.",
            icon: "📖",
          },
          {
            title: "Prioritize for Safety",
            content: "Safety and structural issues always come before schedule.",
            icon: "⚡",
          },
          {
            title: "Choose Task Order",
            content: "Click tasks in the order you would complete them.",
            icon: "👆",
          },
          {
            title: isCertification ? "Pass the Certification" : "Pass the Challenge",
            content: `You need ${Math.ceil(questions[difficulty].length * (isCertification ? 0.8 : 0.6))} out of ${questions[difficulty].length} correct to pass.`,
            icon: isCertification ? "📜" : "🏆",
          },
        ]}
        onStart={() => setStage("challenge")}
        onBack={() => {
          if (onTutorialBack) {
            audioSystem.playClickSound();
            onTutorialBack();
          } else if (onExit) {
            audioSystem.playClickSound();
            onExit();
          }
        }}
      />
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 font-serif">
              🏗️ Scenario {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <>
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-2xl ${i < hearts ? "💖" : "🖤"}`} />
                    ))}
                  </div>
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-orange-600"}`}>
                    {timeLeft}s
                  </div>
                </>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-orange-600">{score}/{currentQuestionIndex}</div>
              </div>
            </div>
          </div>

          {showHeartLost && (
            <div className="fixed inset-0 bg-red-500/30 flex items-center justify-center z-50 pointer-events-none">
              <div className="text-8xl animate-pulse">💔</div>
            </div>
          )}

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
                        ? "bg-orange-500"
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
            <p className="font-semibold text-orange-900">{currentQuestion.scenario}</p>
          </div>

          <p className="text-gray-700 mb-6">
            Click tasks in order of priority. Click again to deselect.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {shuffledTasks.map((task) => {
              const orderIndex = selectedOrder.indexOf(task.id);
              const isSelected = orderIndex !== -1;

              return (
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  {isSelected && (
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      #{orderIndex + 1}
                    </div>
                  )}
                  <p className="text-gray-900 font-medium">{task.name}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedOrder.length !== currentQuestion.tasks.length}
            className="w-full bg-orange-600 text-white font-bold py-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {selectedOrder.length === currentQuestion.tasks.length
              ? currentQuestionIndex < totalQuestions - 1
                ? "Next Scenario →"
                : "Submit Final Answer"
              : `Select All Tasks (${selectedOrder.length}/${currentQuestion.tasks.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}