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

interface DentistWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number, incorrectAnswers?: IncorrectAnswer[]) => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

interface Patient {
  id: string;
  name: string;
  condition: string;
  priority: number;
}

interface Question {
  id: string;
  scenario: string;
  patients: Patient[];
  correctOrder: string[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Three patients scheduled - prioritize by urgency.",
      patients: [
        { id: "p1", name: "Patient A - Severe Pain", condition: "Toothache with swelling, fever", priority: 1 },
        { id: "p2", name: "Patient B - Cleaning", condition: "Routine 6-month checkup", priority: 3 },
        { id: "p3", name: "Patient C - Loose Filling", condition: "Crown feels loose, no pain", priority: 2 },
      ],
      correctOrder: ["p1", "p3", "p2"],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Busy day - manage patient flow.",
      patients: [
        { id: "p1", name: "Patient A - Emergency", condition: "Tooth knocked out, needs immediate care", priority: 1 },
        { id: "p2", name: "Patient B - Procedure", condition: "Scheduled root canal", priority: 2 },
        { id: "p3", name: "Patient C - Checkup", condition: "Annual exam", priority: 3 },
        { id: "p4", name: "Patient D - Adjustment", condition: "Braces tightening", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Critical cases - triage patients.",
      patients: [
        { id: "p1", name: "Patient A", condition: "Severe facial swelling, difficulty breathing", priority: 1 },
        { id: "p2", name: "Patient B", condition: "Broken tooth, bleeding controlled", priority: 2 },
        { id: "p3", name: "Patient C", condition: "Jaw pain, possible infection", priority: 3 },
        { id: "p4", name: "Patient D", condition: "Whitening consultation", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Prioritize: infection, routine, cosmetic",
    patients: [
      { id: "p1", name: "Patient - Infection", condition: "Severe tooth infection", priority: 1 },
      { id: "p2", name: "Patient - Routine", condition: "Regular checkup", priority: 2 },
      { id: "p3", name: "Patient - Cosmetic", condition: "Veneer consultation", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr2",
    scenario: "Prioritize: emergency dental patients",
    patients: [
      { id: "p1", name: "Patient A - Trauma", condition: "Teeth knocked out in sports injury", priority: 1 },
      { id: "p2", name: "Patient B - Pain", condition: "Severe toothache, swelling present", priority: 2 },
      { id: "p3", name: "Patient C - Cleaning", condition: "Routine prophylaxis cleaning", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr3",
    scenario: "Prioritize: radiograph scheduling and procedures",
    patients: [
      { id: "p1", name: "Patient A - Emergency", condition: "Severe pain, possible root fracture", priority: 1 },
      { id: "p2", name: "Patient B - Crown", condition: "Crown prep and temporary placement", priority: 2 },
      { id: "p3", name: "Patient C - Exam", condition: "Bite wing x-rays for checkup", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr4",
    scenario: "Prioritize: oral surgery triage",
    patients: [
      { id: "p1", name: "Patient A - Surgery", condition: "Impacted wisdom tooth extraction", priority: 1 },
      { id: "p2", name: "Patient B - Filling", condition: "Cavity preparation and restoration", priority: 2 },
      { id: "p3", name: "Patient C - Consult", condition: "Dental implant consultation", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr5",
    scenario: "Prioritize: periodontal care scheduling",
    patients: [
      { id: "p1", name: "Patient A - Deep Cleaning", condition: "Advanced periodontal disease, bleeding", priority: 1 },
      { id: "p2", name: "Patient B - Scaling", condition: "Moderate tartar buildup", priority: 2 },
      { id: "p3", name: "Patient C - Checkup", condition: "Healthy gums, routine exam", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr6",
    scenario: "Prioritize: pediatric dentistry cases",
    patients: [
      { id: "p1", name: "Patient A - Emergency", condition: "Child with dental trauma, tooth fractured", priority: 1 },
      { id: "p2", name: "Patient B - Behavior", condition: "Anxious child, first filling", priority: 2 },
      { id: "p3", name: "Patient C - Cleaning", condition: "Routine cleaning, cooperative teenager", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr7",
    scenario: "Prioritize: endodontic procedures",
    patients: [
      { id: "p1", name: "Patient A - Root Canal", condition: "Acute pulpitis, severe pain", priority: 1 },
      { id: "p2", name: "Patient B - Consult", condition: "Root canal evaluation and discussion", priority: 2 },
      { id: "p3", name: "Patient C - Crown", condition: "Post-root canal crown placement", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr8",
    scenario: "Prioritize: cosmetic dentistry queue",
    patients: [
      { id: "p1", name: "Patient A - Emergency", condition: "Tooth chipped, patient in pain", priority: 1 },
      { id: "p2", name: "Patient B - Whitening", condition: "Professional bleaching treatment", priority: 2 },
      { id: "p3", name: "Patient C - Bonding", condition: "Composite veneer consultation", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr9",
    scenario: "Prioritize: prosthodontic emergencies",
    patients: [
      { id: "p1", name: "Patient A - Denture", condition: "Broken denture, unable to eat", priority: 1 },
      { id: "p2", name: "Patient B - Bridge", condition: "Bridge adjustment for fit", priority: 2 },
      { id: "p3", name: "Patient C - Implant", condition: "Implant maintenance visit", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr10",
    scenario: "Prioritize: preventive care urgency",
    patients: [
      { id: "p1", name: "Patient A - Recall", condition: "Overdue cleaning, early decay signs", priority: 1 },
      { id: "p2", name: "Patient B - Exam", condition: "Routine six-month maintenance", priority: 2 },
      { id: "p3", name: "Patient C - Sealants", condition: "Child sealant application", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr11",
    scenario: "Prioritize: elderly patient care needs",
    patients: [
      { id: "p1", name: "Patient A - Dry Mouth", condition: "Severe xerostomia, rampant decay risk", priority: 1 },
      { id: "p2", name: "Patient B - Denture", condition: "Denture sore spots, check fit", priority: 2 },
      { id: "p3", name: "Patient C - Cleaning", condition: "Routine cleaning, good oral health", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr12",
    scenario: "Prioritize: dental abscess cases",
    patients: [
      { id: "p1", name: "Patient A - Abscess", condition: "Swollen face, fever, dental abscess", priority: 1 },
      { id: "p2", name: "Patient B - Antibiotics", condition: "Prescription for infection control", priority: 2 },
      { id: "p3", name: "Patient C - Follow-up", condition: "Post-extraction healing check", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr13",
    scenario: "Prioritize: orthodontic emergencies",
    patients: [
      { id: "p1", name: "Patient A - Wire", condition: "Broken wire, soft tissue trauma", priority: 1 },
      { id: "p2", name: "Patient B - Adjustment", condition: "Routine brace adjustment", priority: 2 },
      { id: "p3", name: "Patient C - Retention", condition: "Retainer check and cleaning", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr14",
    scenario: "Prioritize: oral pathology concerns",
    patients: [
      { id: "p1", name: "Patient A - Lesion", condition: "Suspicious oral lesion, biopsy needed", priority: 1 },
      { id: "p2", name: "Patient B - Canker", condition: "Recurrent aphthous ulcer evaluation", priority: 2 },
      { id: "p3", name: "Patient C - Exam", condition: "Routine oral cancer screening", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr15",
    scenario: "Prioritize: sedation dentistry cases",
    patients: [
      { id: "p1", name: "Patient A - Special Needs", condition: "Special needs patient, extensive work", priority: 1 },
      { id: "p2", name: "Patient B - Anxiety", condition: "Severe dental phobia, sedation consult", priority: 2 },
      { id: "p3", name: "Patient C - Routine", condition: "Routine cleaning with local anesthetic", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr16",
    scenario: "Prioritize: emergency room referrals",
    patients: [
      { id: "p1", name: "Patient A - ER", condition: "Dental trauma from accident, ER referral", priority: 1 },
      { id: "p2", name: "Patient B - Urgent", condition: "Severe pain after hours callback", priority: 2 },
      { id: "p3", name: "Patient C - Routine", condition: "Scheduled filling appointment", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr17",
    scenario: "Prioritize: weekend emergency calls",
    patients: [
      { id: "p1", name: "Patient A - Pain", condition: "Uncontrolled dental pain, weekend call", priority: 1 },
      { id: "p2", name: "Patient B - Broken", condition: "Crown fell off, temporary needed", priority: 2 },
      { id: "p3", name: "Patient C - Question", condition: "Insurance coverage inquiry", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr18",
    scenario: "Prioritize: new patient screening",
    patients: [
      { id: "p1", name: "Patient A - New Emergency", condition: "New patient with severe dental emergency", priority: 1 },
      { id: "p2", name: "Patient B - New Routine", condition: "New patient comprehensive exam", priority: 2 },
      { id: "p3", name: "Patient C - Records", condition: "Transfer patient records review", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr19",
    scenario: "Prioritize: follow-up and recall patients",
    patients: [
      { id: "p1", name: "Patient A - Post Op", condition: "Post-surgery complication check", priority: 1 },
      { id: "p2", name: "Patient B - Recall", condition: "Overdue recall patient contact", priority: 2 },
      { id: "p3", name: "Patient C - Results", condition: "Lab results follow-up call", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr20",
    scenario: "Prioritize: end of day patient needs",
    patients: [
      { id: "p1", name: "Patient A - Emergency", condition: "Last minute severe pain emergency", priority: 1 },
      { id: "p2", name: "Patient B - Reschedule", condition: "No-show patient rescheduling", priority: 2 },
      { id: "p3", name: "Patient C - Supplies", condition: "Inventory and order dental supplies", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
];

export default function DentistWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: DentistWorldProps) {
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

  const shuffledPatients = useMemo(() => {
    return shuffleArray(currentQuestion.patients);
  }, [currentQuestionIndex]);

  const handlePatientClick = (patientId: string) => {
    audioSystem.playClickSound();
    if (selectedOrder.includes(patientId)) {
      setSelectedOrder(selectedOrder.filter((id) => id !== patientId));
    } else {
      setSelectedOrder([...selectedOrder, patientId]);
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
          explanation: "Incorrect dental patient prioritization.",
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
        careerName="Dentist"
        careerIcon="🦷"
        steps={[
          {
            title: "Understand Each Scenario",
            content: "Each question describes dental patients needing care.",
            icon: "📖",
          },
          {
            title: "Prioritize by Severity",
            content: "Infections and pain come before routine visits.",
            icon: "⚡",
          },
          {
            title: "Choose Patient Order",
            content: "Click patients in the order you would treat them.",
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
              🦷 Scenario {currentQuestionIndex + 1} of {totalQuestions}
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
            Click patients in order of priority. Click again to deselect.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {shuffledPatients.map((patient) => {
              const orderIndex = selectedOrder.indexOf(patient.id);
              const isSelected = orderIndex !== -1;

              return (
                <button
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
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
                    {patient.name}
                  </h4>
                  <p className="text-gray-700 text-sm">{patient.condition}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedOrder.length !== currentQuestion.patients.length}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {selectedOrder.length === currentQuestion.patients.length
              ? currentQuestionIndex < totalQuestions - 1
                ? "Next Scenario →"
                : "Submit Final Answer"
              : `Select All Patients (${selectedOrder.length}/${currentQuestion.patients.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}