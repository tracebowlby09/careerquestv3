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

interface PilotWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number, incorrectAnswers?: IncorrectAnswer[]) => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

interface FlightIssue {
  id: string;
  issue: string;
  priority: number;
}

interface Question {
  id: string;
  scenario: string;
  issues: FlightIssue[];
  correctOrder: string[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Pre-flight checklist items - prioritize critical checks.",
      issues: [
        { id: "p1", issue: "Fuel levels adequate for trip", priority: 3 },
        { id: "p2", issue: "Flight controls check failed", priority: 1 },
        { id: "p3", issue: "Landing gear indicator normal", priority: 4 },
      ],
      correctOrder: ["p2", "p1", "p3"],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "In-flight emergencies - manage priorities in air.",
      issues: [
        { id: "p1", issue: "Engine failure on takeoff", priority: 1 },
        { id: "p2", issue: "Turbulence warning ahead", priority: 2 },
        { id: "p3", issue: "Passenger medical concern", priority: 3 },
        { id: "p4", issue: "Minor radio static", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Emergency situation - multiple critical failures.",
      issues: [
        { id: "p1", issue: "Dual engine flameout", priority: 1 },
        { id: "p2", issue: "Electrical failure, instruments offline", priority: 2 },
        { id: "p3", issue: "Cabin depressurization", priority: 3 },
        { id: "p4", issue: "Hydraulic system failure", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Prioritize: engine problem, weather, passenger request",
    issues: [
      { id: "p1", issue: "Engine trouble on climbout", priority: 1 },
      { id: "p2", issue: "Turbulence ahead", priority: 2 },
      { id: "p3", issue: "Passenger needs water", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr2",
    scenario: "Prioritize: pre-flight checklist items urgently",
    issues: [
      { id: "p1", issue: "Verify flight control functionality", priority: 1 },
      { id: "p2", issue: "Complete weather briefing review", priority: 2 },
      { id: "p3", issue: "Load catering supplies on aircraft", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr3",
    scenario: "Prioritize: navigation problems during flight",
    issues: [
      { id: "p1", issue: "Recover from GPS signal failure", priority: 1 },
      { id: "p2", issue: "Cross-check with paper charts", priority: 2 },
      { id: "p3", issue: "Inform passengers of minor delay", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr4",
    scenario: "Prioritize: air traffic control instructions urgency",
    issues: [
      { id: "p1", issue: "Immediate altitude change requested", priority: 1 },
      { id: "p2", issue: "Vector for traffic avoidance", priority: 2 },
      { id: "p3", issue: "Frequency change to approach", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr5",
    scenario: "Prioritize: weather phenomenon response actions",
    issues: [
      { id: "p1", issue: "Divert around severe thunderstorm", priority: 1 },
      { id: "p2", issue: "Adjust altitude for smooth air", priority: 2 },
      { id: "p3", issue: "Update weather log in flight bag", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr6",
    scenario: "Prioritize: instrument failure in clouds",
    issues: [
      { id: "p1", issue: "Declare emergency for priority handling", priority: 1 },
      { id: "p2", issue: "Switch to backup instruments", priority: 2 },
      { id: "p3", issue: "Notify passengers of instrument issue", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr7",
    scenario: "Prioritize: cabin pressure concerns",
    issues: [
      { id: "p1", issue: "Don oxygen masks and descend", priority: 1 },
      { id: "p2", issue: "Check passenger oxygen deployment", priority: 2 },
      { id: "p3", issue:: "Log altitude and time of depressurization", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr8",
    scenario: "Prioritize: fuel management decisions",
    issues: [
      { id: "p1", issue: "Declare fuel emergency to ATC", priority: 1 },
      { id: "p2", issue: "Calculate remaining fuel endurance", priority: 2 },
      { id: "p3", issue: "Brief passengers on fuel situation", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr9",
    scenario: "Prioritize: electrical system failures",
    issues: [
      { id: "p1", issue: "Reset tripped circuit breakers", priority: 1 },
      { id: "p2", issue: "Verify essential avionics powered", priority: 2 },
      { id: "p3", issue: "Switch to backup electrical bus", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr10",
    scenario: "Prioritize: hydraulic system malfunction",
    issues: [
      { id: "p1", issue: "Confirm landing gear down and locked", priority: 1 },
      { id: "p2", issue: "Review emergency landing procedures", priority: 2 },
      { id: "p3", issue: "Prepare cabin for emergency landing", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr11",
    scenario: "Prioritize: ice accumulation on approach",
    issues: [
      { id: "p1", issue: "Activate wing anti-ice systems", priority: 1 },
      { id: "p2", issue: "Request deicing at airport", priority: 2 },
      { id: "p3", issue: "Calculate landing distance adjustments", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr12",
    scenario: "Prioritize: passenger medical emergency",
    issues: [
      { id: "p1", issue: "Descend to lower altitude for medical", priority: 1 },
      { id: "p2", issue: "Divert to nearest suitable airport", priority: 2 },
      { id: "p3", issue:: "Contact medical personnel on ground", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr13",
    scenario: "Prioritize: crosswind landing challenges",
    issues: [
      { id: "p1", issue: "Calculate maximum crosswind component", priority: 1 },
      { id: "p2", issue: "Brief crew on landing technique", priority: 2 },
      { id: "p3", issue: "Monitor runway surface conditions", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr14",
    scenario: "Prioritize: turbulence penetration procedures",
    issues: [
      { id: "p1", issue: "Reduce to turbulence penetration speed", priority: 1 },
      { id: "p2", issue: "Secure cabin and galley items", priority: 2 },
      { id: "p3", issue: "Advise passengers to fasten seatbelts", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr15",
    scenario: "Prioritize: ATC communication failure",
    issues: [
      { id: "p1", issue: "Squawk 7600 and exit controlled airspace", priority: 1 },
      { id: "p2", issue: "Continue flight under VFR rules", priority: 2 },
      { id: "p3", issue:: "Monitor emergency frequency for calls", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr16",
    scenario: "Prioritize: windshear on approach",
    issues: [
      { id: "p1", issue: "Execute windshear escape maneuver", priority: 1 },
      { id: "p2", issue: "Call for go-around clearance", priority: 2 },
      { id: "p3", issue: "Brief passengers on missed approach", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr17",
    scenario: "Prioritize: engine flameout recovery",
    issues: [
      { id: "p1", issue: "Restart engine using emergency procedure", priority: 1 },
      { id: "p2", issue: "Declare emergency to ATC", priority: 2 },
      { id: "p3", issue: "Configure for single-engine flight", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr18",
    scenario: "Prioritize: night flight visual references",
    issues: [
      { id: "p1", issue: "Transition to instrument references", priority: 1 },
      { id: "p2", issue: "Verify runway lighting activation", priority: 2 },
      { id: "p3", issue:: "Increase approach speed for night landing", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr19",
    scenario: "Prioritize: FAA regulation compliance items",
    issues: [
      { id: "p1", issue: "Verify currency for instrument rating", priority: 1 },
      { id: "p2", issue: "Complete required proficiency check", priority: 2 },
      { id: "p3", issue: "Update logbook with recent flights", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr20",
    scenario: "Prioritize: pre-landing checklist completion",
    issues: [
      { id: "p1", issue: "Complete before landing checklist", priority: 1 },
      { id: "p2", issue: "Brief passengers on arrival", priority: 2 },
      { id: "p3", issue: "Secure flight deck items", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
];

export default function PilotWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: PilotWorldProps) {
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

  const shuffledIssues = useMemo(() => {
    return shuffleArray(currentQuestion.issues);
  }, [currentQuestionIndex]);

  const handleIssueClick = (issueId: string) => {
    audioSystem.playClickSound();
    if (selectedOrder.includes(issueId)) {
      setSelectedOrder(selectedOrder.filter((id) => id !== issueId));
    } else {
      setSelectedOrder([...selectedOrder, issueId]);
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
          explanation: "Incorrect aviation priority.",
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
        careerName="Commercial Pilot"
        careerIcon="✈️"
        steps={[
          {
            title: "Understand Each Scenario",
            content: "Each question describes flight situations requiring pilot attention.",
            icon: "📖",
          },
          {
            title: "Prioritize Aviation Issues",
            content: "Safety of flight always comes before comfort or minor issues.",
            icon: "⚡",
          },
          {
            title: "Choose Response Order",
            content: "Click issues in the order you would address them.",
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
              ✈️ Scenario {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <>
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-2xl ${i < hearts ? "💖" : "🖤"}`} />
                    ))}
                  </div>
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-sky-600"}`}>
                    {timeLeft}s
                  </div>
                </>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-sky-600">{score}/{currentQuestionIndex}</div>
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
                        ? "bg-sky-500"
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-sky-50 border-l-4 border-sky-500 p-4 mb-6">
            <p className="font-semibold text-sky-900">{currentQuestion.scenario}</p>
          </div>

          <p className="text-gray-700 mb-6">
            Click issues in order of priority (most urgent first). Click again to deselect.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {shuffledIssues.map((issue) => {
              const orderIndex = selectedOrder.indexOf(issue.id);
              const isSelected = orderIndex !== -1;

              return (
                <button
                  key={issue.id}
                  onClick={() => handleIssueClick(issue.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? "border-sky-600 bg-sky-50"
                      : "border-gray-300 hover:border-sky-400"
                  }`}
                >
                  {isSelected && (
                    <div className="text-2xl font-bold text-sky-600 mb-2">
                      #{orderIndex + 1}
                    </div>
                  )}
                  <p className="text-gray-900">{issue.issue}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedOrder.length !== currentQuestion.issues.length}
            className="w-full bg-sky-600 text-white font-bold py-4 rounded-lg hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {selectedOrder.length === currentQuestion.issues.length
              ? currentQuestionIndex < totalQuestions - 1
                ? "Next Scenario →"
                : "Submit Final Answer"
              : `Select All Issues (${selectedOrder.length}/${currentQuestion.issues.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}