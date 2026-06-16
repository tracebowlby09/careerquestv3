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

interface PoliceWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number, incorrectAnswers?: IncorrectAnswer[]) => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

interface Situation {
  id: string;
  type: string;
  description: string;
  priority: number;
}

interface Question {
  id: string;
  scenario: string;
  situations: Situation[];
  correctOrder: string[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Three calls come in. Prioritize response by threat level.",
      situations: [
        { id: "p1", type: "Burglary in Progress", description: "Alarm company reports break-in, suspects inside", priority: 1 },
        { id: "p2", type: "Traffic Accident", description: "Minor fender-bender, no injuries", priority: 3 },
        { id: "p3", type: "Domestic Dispute", description: "Verbal argument, no weapons reported", priority: 2 },
      ],
      correctOrder: ["p1", "p3", "p2"],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Busy shift - multiple incidents across patrol area.",
      situations: [
        { id: "p1", type: "Robbery in Progress", description: "Armed suspect, multiple victims", priority: 1 },
        { id: "p2", type: "Hit and Run", description: "Vehicle fled scene, victim needs help", priority: 2 },
        { id: "p3", type: "Noise Complaint", description: "Party loud, no immediate threat", priority: 4 },
        { id: "p4", type: "Welfare Check", description: "Elderly person not answering calls", priority: 3 },
      ],
      correctOrder: ["p1", "p2", "p4", "p3"],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Critical incidents requiring immediate coordination.",
      situations: [
        { id: "p1", type: "Active Shooter", description: "Multiple casualties, suspect armed", priority: 1 },
        { id: "p2", type: "Officer Down", description: "Officer needs backup, shots fired", priority: 2 },
        { id: "p3", type: "Hostage Situation", description: "Armed person with hostages", priority: 3 },
        { id: "p4", type: "Bomb Threat", description: "Suspicious package, evacuation needed", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Prioritize: robbery, noise, domestic",
    situations: [
      { id: "p1", type: "Robbery", description: "Armed robbery at store", priority: 1 },
      { id: "p2", type: "Noise", description: "Loud music complaint", priority: 3 },
      { id: "p3", type: "Domestic", description: "Domestic dispute reported", priority: 2 },
    ],
    correctOrder: ["p1", "p3", "p2"],
  },
  {
    id: "qr2",
    scenario: "Prioritize: life-threatening versus property crimes",
    situations: [
      { id: "p1", type: "Shots Fired", description: "Active shooter reported downtown", priority: 1 },
      { id: "p2", type: "Burglary", description: "Residential break-in in progress", priority: 2 },
      { id: "p3", type: "Vandalism", description: "Graffiti reported at park", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr3",
    scenario: "Prioritize: traffic stop escalation risk",
    situations: [
      { id: "p1", type: "Traffic Stop", description: "Suspect reaching under seat, possible weapon", priority: 1 },
      { id: "p2", type: "Backup Request", description: "Officer needs assistance with suspect", priority: 2 },
      { id: "p3", type: "Accident", description: "Minor fender-bender, no injuries", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr4",
    scenario: "Prioritize: Miranda rights timing with questioning",
    situations: [
      { id: "p1", type: "Custodial Interrogation", description: "Ready to question arrestee about crimes", priority: 1 },
      { id: "p2", type: "Evidence Collection", description: "Photograph crime scene for evidence", priority: 2 },
      { id: "p3", type: "Report Writing", description: "Document arrest in incident report", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr5",
    scenario: "Prioritize: use of force continuum application",
    situations: [
      { id: "p1", type: "Threatening Suspect", description: "Armed individual refusing commands", priority: 1 },
      { id: "p2", type: "Verbal Escalation", description: "Deescalate angry but unarmed person", priority: 2 },
      { id: "p3", type: "Passive Resistance", description: "Subject refusing to comply peacefully", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr6",
    scenario: "Prioritize: evidence preservation at scene",
    situations: [
      { id: "p1", type: "Crime Scene", description: "Secure evidence before it's contaminated", priority: 1 },
      { id: "p2", type: "Witness Interview", description: "Get initial statements from witnesses", priority: 2 },
      { id: "p3", type: "Media Inquiry", description: "Handle press questions about incident", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr7",
    scenario: "Prioritize: arrest procedure steps",
    situations: [
      { id: "p1", type: "Handcuffing", description: "Secure suspect for transport safely", priority: 1 },
      { id: "p2", type: "Search Incident", description: "Search for weapons and evidence", priority: 2 },
      { id: "p3", type: "Transport", description: "Move suspect to patrol car", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr8",
    scenario: "Prioritize: search and seizure law compliance",
    situations: [
      { id: "p1", type: "Consent Search", description: "Obtain valid consent for vehicle search", priority: 1 },
      { id: "p2", type: "Plain View", description: "Document contraband in plain sight", priority: 2 },
      { id: "p3", type: "Inventory Search", description: "Complete inventory of impounded vehicle", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr9",
    scenario: "Prioritize: patrol beat coverage strategy",
    situations: [
      { id: "p1", type: "Hot Call", description: "Priority response to ongoing incident", priority: 1 },
      { id: "p2", type: "Reckless Driving", description: "Aggressive driver endangering traffic", priority: 2 },
      { id: "p3", type: "Business Check", description: "Routine security check at business", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr10",
    scenario: "Prioritize: community policing event planning",
    situations: [
      { id: "p1", type: "Neighborhood Meeting", description: "Address crime concerns with residents", priority: 1 },
      { id: "p2", type: "Traffic Enforcement", description: "School zone speeding complaint", priority: 2 },
      { id: "p3", type: "Report Follow-up", description: "Update pending case reports", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr11",
    scenario: "Prioritize: report writing with time constraints",
    situations: [
      { id: "p1", type: "Arrest Report", description: "Complete mandatory arrest documentation", priority: 1 },
      { id: "p2", type: "Use of Force Report", description: "Document force used in suspect arrest", priority: 2 },
      { id: "p3", type: "Incident Summary", description: "Brief summary of routine call", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr12",
    scenario: "Prioritize: field interview card completion",
    situations: [
      { id: "p1", type: "Suspect Interview", description: "Document interview with person of interest", priority: 1 },
      { id: "p2", type: "Witness Statement", description: "Record account from bystander", priority: 2 },
      { id: "p3", type: "Victim Contact", description: "Follow up with crime victim", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr13",
    scenario: "Prioritize: radio call handling efficiency",
    situations: [
      { id: "p1", type: "Emergency Call", description: "Officer needs immediate backup", priority: 1 },
      { id: "p2", type: "Information Request", description: "Dispatch asks for unit status", priority: 2 },
      { id: "p3", type: "Administrative Message", description: "Call about meeting schedule changes", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr14",
    scenario: "Prioritize: warrant verification procedures",
    situations: [
      { id: "p1", type: "Warrant Check", description: "Verify arrest warrant before entry", priority: 1 },
      { id: "p2", type: "Probable Cause", description: "Establish grounds for search", priority: 2 },
      { id: "p3", type: "Supervisory Approval", description: "Get sergeant approval for action", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr15",
    scenario: "Prioritize: DUI investigation steps",
    situations: [
      { id: "p1", type: "Field Sobriety Tests", description: "Conduct standardized sobriety tests", priority: 1 },
      { id: "p2", type: "Breathalyzer Admin", description: "Administer chemical test for BAC", priority: 2 },
      { id: "p3", type: "Transport Booking", description: "Book suspect at jail facility", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr16",
    scenario: "Prioritize: juvenile custody procedures",
    situations: [
      { id: "p1", type: "Parent Notification", description: "Contact parents of minor detainee", priority: 1 },
      { id: "p2", type: "Juvenile Processing", description: "Follow special procedures for minor arrest", priority: 2 },
      { id: "p3", type: "Report Documentation", description: "Document juvenile case details", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr17",
    scenario: "Prioritize: domestic violence response",
    situations: [
      { id: "p1", type: "Safety Assessment", description: "Ensure victim and scene are secure", priority: 1 },
      { id: "p2", type: "Medical Attention", description: "Arrange medical care for injuries", priority: 2 },
      { id: "p3", type: "Report Filing", description: "Complete domestic incident report", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr18",
    scenario: "Prioritize: traffic collision investigation",
    situations: [
      { id: "p1", type: "Injury Assessment", description: "Check for injuries, call EMS if needed", priority: 1 },
      { id: "p2", type: "Evidence Photos", description: "Photograph vehicle positions and damage", priority: 2 },
      { id: "p3", type: "Traffic Control", description: "Direct traffic around accident scene", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr19",
    scenario: "Prioritize: narcotics enforcement priorities",
    situations: [
      { id: "p1", type: "Drug Arrest", description: "Suspect with visible narcotics in car", priority: 1 },
      { id: "p2", type: "Search Warrant", description: "Execute warrant at suspected dealer location", priority: 2 },
      { id: "p3", type: "Asset Forfeiture", description: "Document seized property for evidence", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr20",
    scenario: "Prioritize: cold case follow-up actions",
    situations: [
      { id: "p1", type: "DNA Results", description: "New lab results identify suspect", priority: 1 },
      { id: "p2", type: "Witness Contact", description: "Locate witness for re-interview", priority: 2 },
      { id: "p3", type: "File Organization", description: "Organize case files for review", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
];

export default function PoliceWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: PoliceWorldProps) {
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

  const shuffledSituations = useMemo(() => {
    return shuffleArray(currentQuestion.situations);
  }, [currentQuestionIndex]);

  const handleSituationClick = (situationId: string) => {
    audioSystem.playClickSound();
    if (selectedOrder.includes(situationId)) {
      setSelectedOrder(selectedOrder.filter((id) => id !== situationId));
    } else {
      setSelectedOrder([...selectedOrder, situationId]);
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
          explanation: "Incorrect situation prioritization.",
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
        careerName="Police Officer"
        careerIcon="👮"
        steps={[
          {
            title: "Understand Each Scenario",
            content: "Each question describes situations requiring police response.",
            icon: "📖",
          },
          {
            title: "Prioritize by Threat",
            content: "Life-threatening and violent situations take priority.",
            icon: "⚡",
          },
          {
            title: "Choose Response Order",
            content: "Click situations in the order you would respond.",
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
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-blue-600"}`}>
                    {timeLeft}s
                  </div>
                </>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-blue-600">{score}/{currentQuestionIndex}</div>
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
                        ? "bg-blue-500"
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="font-semibold text-blue-900">{currentQuestion.scenario}</p>
          </div>

          <p className="text-gray-700 mb-6">
            Click situations in order of priority (most urgent first). Click again to deselect.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {shuffledSituations.map((situation) => {
              const orderIndex = selectedOrder.indexOf(situation.id);
              const isSelected = orderIndex !== -1;

              return (
                <button
                  key={situation.id}
                  onClick={() => handleSituationClick(situation.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {isSelected && (
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      #{orderIndex + 1}
                    </div>
                  )}
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {situation.type}
                  </h4>
                  <p className="text-gray-700 text-sm">{situation.description}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedOrder.length !== currentQuestion.situations.length}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {selectedOrder.length === currentQuestion.situations.length
              ? currentQuestionIndex < totalQuestions - 1
                ? "Next Scenario →"
                : "Submit Final Answer"
              : `Select All Situations (${selectedOrder.length}/${currentQuestion.situations.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}