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

interface AccountantWorldProps {
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
  task: string;
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
      scenario: "Three accounting tasks - prioritize for today.",
      tasks: [
        { id: "p1", task: "Prepare tax return due tomorrow", priority: 1 },
        { id: "p2", task: "Organize receipts for audit", priority: 3 },
        { id: "p3", task: "Monthly financial statements", priority: 2 },
      ],
      correctOrder: ["p1", "p3", "p2"],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Multiple deadlines - prioritize workflow.",
      tasks: [
        { id: "p1", task: "Quarterly tax filing due today", priority: 1 },
        { id: "p2", task: "Client meeting prep", priority: 2 },
        { id: "p3", task: "Bank reconciliations", priority: 3 },
        { id: "p4", task: "File organization", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Year-end closing - critical tasks first.",
      tasks: [
        { id: "p1", task: "Audit preparation - missing documents", priority: 1 },
        { id: "p2", task: "Payroll processing errors", priority: 2 },
        { id: "p3", task: "Financial statement adjustments", priority: 3 },
        { id: "p4", task: "Office supply inventory", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Prioritize: tax deadline, payroll, filing",
    tasks: [
      { id: "p1", task: "Tax filing due now", priority: 1 },
      { id: "p2", task: "Payroll discrepancy", priority: 2 },
      { id: "p3", task: "File receipts", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr2",
    scenario: "Prioritize: month-end closing tasks",
    tasks: [
      { id: "p1", task: "Prepare balance sheet", priority: 1 },
      { id: "p2", task: "Reconcile bank statements", priority: 2 },
      { id: "p3", task: "Send invoices to clients", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr3",
    scenario: "Prioritize: quarterly tasks for audit prep",
    tasks: [
      { id: "p1", task: "Review accounts receivable aging", priority: 1 },
      { id: "p2", task: "Calculate depreciation expenses", priority: 2 },
      { id: "p3", task: "Organize general ledger", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr4",
    scenario: "Prioritize: budgeting season tasks",
    tasks: [
      { id: "p1", task: "Complete annual budget forecast", priority: 1 },
      { id: "p2", task: "Analyze variance report", priority: 2 },
      { id: "p3", task: "Update client contact list", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr5",
    scenario: "Prioritize: tax bracket analysis tasks",
    tasks: [
      { id: "p1", task: "Calculate client tax liability", priority: 1 },
      { id: "p2", task: "Apply standard deductions", priority: 2 },
      { id: "p3", task: "Research tax law changes", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr6",
    scenario: "Prioritize: GAAP compliance checklist",
    tasks: [
      { id: "p1", task: "Verify revenue recognition timing", priority: 1 },
      { id: "p2", task: "Review expense matching rules", priority: 2 },
      { id: "p3", task: "Update chart of accounts", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr7",
    scenario: "Prioritize: cash flow management tasks",
    tasks: [
      { id: "p1", task: "Prepare weekly cash flow forecast", priority: 1 },
      { id: "p2", task: "Follow up on overdue payments", priority: 2 },
      { id: "p3", task: "Schedule vendor payments", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr8",
    scenario: "Prioritize: payroll processing day",
    tasks: [
      { id: "p1", task: "Process salary payments", priority: 1 },
      { id: "p2", task: "File payroll tax reports", priority: 2 },
      { id: "p3", task: "Update employee benefits", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr9",
    scenario: "Prioritize: audit preparation items",
    tasks: [
      { id: "p1", task: "Gather supporting documentation", priority: 1 },
      { id: "p2", task: "Review internal controls", priority: 2 },
      { id: "p3", task: "Schedule auditor meetings", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr10",
    scenario: "Prioritize: financial statement review",
    tasks: [
      { id: "p1", task: "Consolidate subsidiary ledgers", priority: 1 },
      { id: "p2", task: "Verify account balances", priority: 2 },
      { id: "p3", task: "Format presentation slides", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr11",
    scenario: "Prioritize: client tax consultation tasks",
    tasks: [
      { id: "p1", task: "Analyze prior year returns", priority: 1 },
      { id: "p2", task: "Estimate current year tax", priority: 2 },
      { id: "p3", task: "Recommend deductions strategy", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr12",
    scenario: "Prioritize: accounts payable workflow",
    tasks: [
      { id: "p1", task: "Match invoices to purchase orders", priority: 1 },
      { id: "p2", task: "Process payment approvals", priority: 2 },
      { id: "p3", task: "File paper invoices", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr13",
    scenario: "Prioritize: month-end close procedures",
    tasks: [
      { id: "p1", task: "Post adjusting journal entries", priority: 1 },
      { id: "p2", task: "Run financial statements", priority: 2 },
      { id: "p3", task: "Send statements to management", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr14",
    scenario: "Prioritize: bookkeeping cleanup tasks",
    tasks: [
      { id: "p1", task: "Reclassify misposted entries", priority: 1 },
      { id: "p2", task: "Balance checkbook register", priority: 2 },
      { id: "p3", task: "Archive old receipts", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr15",
    scenario: "Prioritize: tax season rush items",
    tasks: [
      { id: "p1", task: "Complete extension filings", priority: 1 },
      { id: "p2", task: "Client signature collection", priority: 2 },
      { id: "p3", task: "Update tax software", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr16",
    scenario: "Prioritize: quarterly reporting deadline",
    tasks: [
      { id: "p1", task: "Prepare 10-Q filing", priority: 1 },
      { id: "p2", task: "Review auditor comments", priority: 2 },
      { id: "p3", task: "Clean email inbox", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr17",
    scenario: "Prioritize: client financial review",
    tasks: [
      { id: "p1", task: "Analyze profit and loss statement", priority: 1 },
      { id: "p2", task: "Calculate key ratios", priority: 2 },
      { id: "p3", task: "Draft cover memo", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr18",
    scenario: "Prioritize: regulatory compliance check",
    tasks: [
      { id: "p1", task: "Update compliance documentation", priority: 1 },
      { id: "p2", task: "Conduct internal review", priority: 2 },
      { id: "p3", task: "Order office supplies", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr19",
    scenario: "Prioritize: year-end closing items",
    tasks: [
      { id: "p1", task: "Accrue year-end expenses", priority: 1 },
      { id: "p2", task: "Physical inventory count", priority: 2 },
      { id: "p3", task: "Holiday party planning", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr20",
    scenario: "Prioritize: client inquiry response",
    tasks: [
      { id: "p1", task: "Address urgent billing question", priority: 1 },
      { id: "p2", task: "Provide financial summary", priority: 2 },
      { id: "p3", task: "Schedule follow-up call", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
];

export default function AccountantWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: AccountantWorldProps) {
  const [stage, setStage] = useState<"intro" | "tutorial" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showHeartLost, setShowHeartLost] = useState(false);

  useEffect(() => {
    if (!isQuickRecall || stage !== "challenge" || hearts <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setHearts((h) => h - 1);
          setShowHeartLost(true);
          setTimeout(() => setShowHeartLost(false), 1000);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuickRecall, stage, hearts]);

  useEffect(() => {
    if (isQuickRecall && stage === "challenge") {
      setTimeLeft(15);
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
          explanation: "Incorrect accounting task prioritization.",
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
        careerName="Accountant"
        careerIcon="📊"
        steps={[
          {
            title: "Understand Each Scenario",
            content: "Each question describes accounting tasks and deadlines.",
            icon: "📖",
          },
          {
            title: "Prioritize by Deadline",
            content: "Tax deadlines and urgent filings come first.",
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
              📊 Scenario {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <>
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-2xl ${i < hearts ? "💖" : "🖤"}`} />
                    ))}
                  </div>
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-emerald-600"}`}>
                    {timeLeft}s
                  </div>
                </>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-emerald-600">{score}/{currentQuestionIndex}</div>
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
                        ? "bg-emerald-500"
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6">
            <p className="font-semibold text-emerald-900">{currentQuestion.scenario}</p>
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
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-300 hover:border-emerald-400"
                  }`}
                >
                  {isSelected && (
                    <div className="text-2xl font-bold text-emerald-600 mb-2">
                      #{orderIndex + 1}
                    </div>
                  )}
                  <p className="text-gray-900">{task.task}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedOrder.length !== currentQuestion.tasks.length}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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