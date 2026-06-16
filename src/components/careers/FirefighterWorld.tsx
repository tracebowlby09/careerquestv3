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
  {
    id: "qr3",
    scenario: "Multi-story building fire response priority",
    emergencies: [
      { id: "p1", type: "High-rise Fire", severity: "Fire on upper floors, many occupants", priority: 1 },
      { id: "p2", type: "Search and Rescue", severity: "People trapped, immediate danger", priority: 2 },
      { id: "p3", type: "HazMat", severity: "Chemical spill from fire suppression", priority: 3 },
      { id: "p4", type: "Traffic Control", severity: "Crowd gathering at scene", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr4",
    scenario: "Vehicle accident with hazmat spill",
    emergencies: [
      { id: "p1", type: "MVA with Injuries", severity: "Car crash with trapped occupants", priority: 1 },
      { id: "p2", type: "HazMat Response", severity: "Fuel tank ruptured, environmental threat", priority: 2 },
      { id: "p3", type: "Fire Suppression", severity: "Engine compartment fire", priority: 3 },
      { id: "p4", type: "Public Information", severity: "Media on scene requesting info", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr5",
    scenario: "Wildland fire threatening structures",
    emergencies: [
      { id: "p1", type: "Structure Protection", severity: "Homes in wildland fire path", priority: 1 },
      { id: "p2", type: "Fireline Construction", severity: "Build firebreak to stop spread", priority: 2 },
      { id: "p3", type: "Evacuation Assistance", severity: "Residents need help evacuating", priority: 3 },
      { id: "p4", type: "Rehab Station", severity: "Crew hydration and rest needs", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr6",
    scenario: "Medical emergency during fire scene",
    emergencies: [
      { id: "p1", type: "Medical Aid", severity: "Firefighter down with heat exhaustion", priority: 1 },
      { id: "p2", type: "Fire Attack", severity: "Continue interior fire suppression", priority: 2 },
      { id: "p3", type: "Overhaul", severity: "Check for hidden fire spread", priority: 3 },
      { id: "p4", type: "Ventilation", severity: "Roof vent to improve conditions", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr7",
    scenario: "Multiple vehicle fires at collision scene",
    emergencies: [
      { id: "p1", type: "Rescue Operation", severity: "Extricate trapped driver", priority: 1 },
      { id: "p2", type: "Car Fire", severity: "Vehicle fully involved in flames", priority: 2 },
      { id: "p3", type: "Medical Care", severity: "Treat conscious patient injuries", priority: 3 },
      { id: "p4", type: "Fire Investigation", severity: "Determine fire cause after knockdown", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr8",
    scenario: "Commercial kitchen fire response",
    emergencies: [
      { id: "p1", type: "Fire Attack", severity: "Large kitchen grease fire spreading", priority: 1 },
      { id: "p2", type: "Ventilation", severity: "Remove smoke from restaurant", priority: 2 },
      { id: "p3", type: "Salvage", severity: "Protect dining area contents", priority: 3 },
      { id: "p4", type: "Overhaul", severity: "Check for hidden grease fire spread", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr9",
    scenario: "Apartment building medical emergency",
    emergencies: [
      { id: "p1", type: "EMS Call", severity: "Person unconscious in apartment", priority: 1 },
      { id: "p2", type: "Fire Alarm", severity: "Activated during medical response", priority: 2 },
      { id: "p3", type: "Evacuation", severity: "Building evacuation for safety", priority: 3 },
      { id: "p4", type: "Investigation", severity: "Check for cause of alarm", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr10",
    scenario: "School bus accident with injuries",
    emergencies: [
      { id: "p1", type: "Mass Casualty", severity: "Multiple children injured, triage needed", priority: 1 },
      { id: "p2", type: "MVA Response", severity: "Bus stabilization and extrication", priority: 2 },
      { id: "p3", type: "HazMat", severity: "Fuel leak from bus tank", priority: 3 },
      { id: "p4", type: "Parent Notification", severity: "Contact and reunite families", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr11",
    scenario: "Industrial plant hazmat incident",
    emergencies: [
      { id: "p1", type: "HazMat Entry", severity: "Toxic gas release in building", priority: 1 },
      { id: "p2", type: "Medical", severity: "Exposed workers needing treatment", priority: 2 },
      { id: "p3", type: "Evacuation", severity: "Area evacuation for public safety", priority: 3 },
      { id: "p4", type: "Fire Suppression", severity: "Control fire from hazmat reaction", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr12",
    scenario: "Night shift multiple structure fires",
    emergencies: [
      { id: "p1", type: "House Fire", severity: "Confirmed entrapment, life hazards", priority: 1 },
      { id: "p2", type: "Building Fire", severity: "Commercial fire, no known occupants", priority: 2 },
      { id: "p3", type: "Grass Fire", severity: "Small vegetation fire spreading slowly", priority: 3 },
      { id: "p4", type: "Public Assist", severity: "Resident requesting fire safety check", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr13",
    scenario: "Rural farm equipment fire",
    emergencies: [
      { id: "p1", type: "Equipment Fire", severity: "Tractor fire near barn structure", priority: 1 },
      { id: "p2", type: "Exposure Protection", severity: "Protect nearby buildings and animals", priority: 2 },
      { id: "p3", type: "Water Supply", severity: "Establish rural water shuttle ops", priority: 3 },
      { id: "p4", type: "Investigation", severity: "Determine cause after extinguishment", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr14",
    scenario: "Boating accident on local lake",
    emergencies: [
      { id: "p1", type: "Water Rescue", severity: "People in water, possible drowning", priority: 1 },
      { id: "p2", type: "Medical", severity: "Treat conscious but injured boaters", priority: 2 },
      { id: "p3", type: "HazMat", severity: "Fuel spill in waterway", priority: 3 },
      { id: "p4", type: "Fire Boat", severity: "Vessel fire control operations", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr15",
    scenario: "Tunnel fire emergency response",
    emergencies: [
      { id: "p1", type: "Tunnel Rescue", severity: "Vehicle fire with people trapped", priority: 1 },
      { id: "p2", type: "Ventilation", severity: "Remove smoke from enclosed tunnel", priority: 2 },
      { id: "p3", type: "Traffic Control", severity: "Tunnel closure and detour setup", priority: 3 },
      { id: "p4", type: "Medical", severity: "Treat smoke inhalation victims", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr16",
    scenario: "High-rise apartment complex fire",
    emergencies: [
      { id: "p1", type: "High-Rise Fire", severity: "Fire on multiple floors, evacuate upper levels", priority: 1 },
      { id: "p2", type: "Search Operations", severity: "Check apartments for occupants", priority: 2 },
      { id: "p3", type: "Ventilation", severity: "Window and roof vent operations", priority: 3 },
      { id: "p4", type: "Rehab", severity: "Crew rest and hydration rotation", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr17",
    scenario: "Chemical plant hazmat emergency",
    emergencies: [
      { id: "p1", type: "HazMat Response", severity: "Toxic vapor release, immediate evacuation zone", priority: 1 },
      { id: "p2", type: "Medical", severity: "Treat plant workers exposure symptoms", priority: 2 },
      { id: "p3", type: "Fire Suppression", severity: "Control fire from chemical reaction", priority: 3 },
      { id: "p4", type: "Public Info", severity: "Warn community about chemical threat", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr18",
    scenario: "Train derailment with fire risk",
    emergencies: [
      { id: "p1", type: "Train Fire", severity: "Boxcar on fire with unknown cargo", priority: 1 },
      { id: "p2", type: "HazMat", severity: "Potential hazardous material release", priority: 2 },
      { id: "p3", type: "Medical", severity: "Treat injured train passengers", priority: 3 },
      { id: "p4", type: "Extrication", severity: "Free trapped individuals from wreckage", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr19",
    scenario: "Winter weather emergency calls",
    emergencies: [
      { id: "p1", type: "EMS Call", severity: "Hypothermia patient found outside", priority: 1 },
      { id: "p2", type: "Structure Fire", severity: "Heating equipment caused blaze", priority: 2 },
      { id: "p3", type: "Public Assist", severity: "Elderly resident power out, needs help", priority: 3 },
      { id: "p4", type: "Fire Safety", severity: "Install smoke detectors for resident", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr20",
    scenario: "Multi-agency incident coordination",
    emergencies: [
      { id: "p1", type: "Command Setup", severity: "Establish incident command structure", priority: 1 },
      { id: "p2", type: "Resource Allocation", severity: "Assign companies to priorities", priority: 2 },
      { id: "p3", type: "Safety Officer", severity: "Monitor scene for hazards", priority: 3 },
      { id: "p4", type: "Documentation", severity: "Maintain incident progress reports", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
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