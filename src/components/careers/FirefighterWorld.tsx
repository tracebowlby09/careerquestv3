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

interface FirefighterWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number, incorrectAnswers?: IncorrectAnswer[]) => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

interface Emergency {
  id: string;
  type: string;
  severity: string;
  priority: number;
}

interface Question {
  id: string;
  scenario: string;
  emergencies: Emergency[];
  correctOrder: string[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Three calls come in simultaneously. Prioritize them by response priority.",
      emergencies: [
        { id: "p1", type: "House Fire", severity: "Single-story residential, smoke reported", priority: 1 },
        { id: "p2", type: "Medical Call", severity: "Broken arm, conscious patient", priority: 3 },
        { id: "p3", type: "Car Fire", severity: "Vehicle fully involved in flames", priority: 2 },
      ],
      correctOrder: ["p1", "p3", "p2"],
    },
    {
      id: "e2",
      scenario: "Morning shift - multiple emergency calls.",
      emergencies: [
        { id: "p1", type: "EMS Call", severity: "Difficulty breathing, oxygen needed", priority: 1 },
        { id: "p2", type: "Fire Alarm", severity: "Commercial building, sprinklers activated", priority: 2 },
        { id: "p3", type: "Public Assist", severity: "Person locked out of car", priority: 3 },
      ],
      correctOrder: ["p1", "p2", "p3"],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Busy evening - multiple emergencies across the district.",
      emergencies: [
        { id: "p1", type: "Structure Fire", severity: "Multi-story building, people trapped", priority: 1 },
        { id: "p2", type: "MVAs", severity: "Car vs pole, possible entrapment", priority: 2 },
        { id: "p3", type: "Medical", severity: "Chest pain in a restaurant", priority: 3 },
        { id: "p4", type: "HazMat", severity: "Gas leak at business", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
    {
      id: "m2",
      scenario: "Night shift - serious emergencies reported.",
      emergencies: [
        { id: "p1", type: "House Fire", severity: "Two-story home, children inside", priority: 1 },
        { id: "p2", type: "EMS Call", severity: "Unconscious person on sidewalk", priority: 2 },
        { id: "p3", type: "Car Accident", severity: "Minor fender-bender, no injuries", priority: 3 },
        { id: "p4", type: "Public Service", severity: "Street flooding, no immediate danger", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Mass casualty incident with multiple simultaneous emergencies.",
      emergencies: [
        { id: "p1", type: "Wildland Fire", severity: "Spread to residential area, evacuations", priority: 1 },
        { id: "p2", type: "Multi-Patient MVA", severity: "School bus rollover, multiple injured", priority: 2 },
        { id: "p3", type: "Structure Fire", severity: "Apartment complex, fire on 3rd floor", priority: 3 },
        { id: "p4", type: "Medical Emergency", severity: "Cardiac arrest at grocery store", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Initial alarm: House fire vs medical vs public assist",
    emergencies: [
      { id: "p1", type: "House Fire", severity: "Smoke from windows, possible occupants", priority: 1 },
      { id: "p2", type: "Medical", severity: "Minor injury, walking wounded", priority: 3 },
      { id: "p3", type: "Public Assist", severity: "Cat stuck in tree", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr2",
    scenario: "EMS priority over alarm investigation",
    emergencies: [
      { id: "p1", type: "EMS Call", severity: "Unresponsive elderly person", priority: 1 },
      { id: "p2", type: "Fire Alarm", severity: "Automatic alarm, no signs of fire", priority: 2 },
    ],
    correctOrder: ["p1", "p2"],
  },
];

export default function FirefighterWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: FirefighterWorldProps) {
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

  const shuffledEmergencies = useMemo(() => {
    return shuffleArray(currentQuestion.emergencies);
  }, [currentQuestionIndex]);

  const handleEmergencyClick = (emergencyId: string) => {
    audioSystem.playClickSound();
    if (selectedOrder.includes(emergencyId)) {
      setSelectedOrder(selectedOrder.filter((id) => id !== emergencyId));
    } else {
      setSelectedOrder([...selectedOrder, emergencyId]);
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
        const selectedEmergencyNames = selectedOrder.map(id => {
          const e = currentQuestion.emergencies.find(p => p.id === id);
          return e ? e.type : id;
        });
        const correctEmergencyNames = currentQuestion.correctOrder.map(id => {
          const e = currentQuestion.emergencies.find(p => p.id === id);
          return e ? e.type : id;
        });
        let updatedIncorrect = [...incorrectAnswers, {
          question: currentQuestion.scenario,
          selectedAnswer: selectedEmergencyNames.join(" → "),
          correctAnswer: correctEmergencyNames.join(" → "),
          explanation: "Incorrect emergency prioritization.",
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
        careerName="Firefighter"
        careerIcon="🚒"
        steps={[
          {
            title: "Understand Each Scenario",
            content: "Each question describes emergency situations. Read carefully to understand the severity.",
            icon: "📖",
          },
          {
            title: "Prioritize Emergencies",
            content: "Life-threatening fires and rescue operations come before routine calls.",
            icon: "⚡",
          },
          {
            title: "Choose the Response Order",
            content: "Click emergencies in the order you would respond - most urgent first.",
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
              🚨 Scenario {currentQuestionIndex + 1} of {totalQuestions}
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

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="font-semibold text-red-900">{currentQuestion.scenario}</p>
          </div>

          <p className="text-gray-700 mb-6">
            Click emergencies in order of priority (most urgent first). Click again to deselect.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {shuffledEmergencies.map((emergency) => {
              const orderIndex = selectedOrder.indexOf(emergency.id);
              const isSelected = orderIndex !== -1;

              return (
                <button
                  key={emergency.id}
                  onClick={() => handleEmergencyClick(emergency.id)}
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
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {emergency.type}
                  </h4>
                  <p className="text-gray-700 text-sm">{emergency.severity}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedOrder.length !== currentQuestion.emergencies.length}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {selectedOrder.length === currentQuestion.emergencies.length
              ? currentQuestionIndex < totalQuestions - 1
                ? "Next Scenario →"
                : "Submit Final Answer"
              : `Select All Emergencies (${selectedOrder.length}/${currentQuestion.emergencies.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}