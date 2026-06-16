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

interface SocialWorkerWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number, incorrectAnswers?: IncorrectAnswer[]) => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

interface Client {
  id: string;
  name: string;
  situation: string;
  priority: number;
}

interface Question {
  id: string;
  scenario: string;
  clients: Client[];
  correctOrder: string[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Three clients need attention today. Prioritize caseload.",
      clients: [
        { id: "p1", name: "Client A", situation: "Recent suicide attempt, crisis intervention needed", priority: 1 },
        { id: "p2", name: "Client B", situation: "Routine paperwork follow-up", priority: 3 },
        { id: "p3", name: "Client C", situation: "Child welfare check scheduled", priority: 2 },
      ],
      correctOrder: ["p1", "p3", "p2"],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Multiple cases - allocate time effectively.",
      clients: [
        { id: "p1", name: "Client A", situation: "Emergency foster placement needed", priority: 1 },
        { id: "p2", name: "Client B", situation: "Court testimony preparation", priority: 2 },
        { id: "p3", name: "Client C", situation: "Housing application assist", priority: 3 },
        { id: "p4", name: "Client D", situation: "Medication refill coordination", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "High caseload - prioritize critical situations.",
      clients: [
        { id: "p1", name: "Client A", situation: "Domestic violence shelter referral", priority: 1 },
        { id: "p2", name: "Client B", situation: "Substance abuse intervention", priority: 2 },
        { id: "p3", name: "Client C", situation: "Employment services intake", priority: 3 },
        { id: "p4", name: "Client D", situation: "Benefits recertification", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Prioritize: crisis, routine, follow-up",
    clients: [
      { id: "p1", name: "Client - Crisis", situation: "Mental health emergency", priority: 1 },
      { id: "p2", name: "Client - Routine", situation: "Regular check-in", priority: 3 },
      { id: "p3", name: "Client - Follow-up", situation: "Case update needed", priority: 2 },
    ],
    correctOrder: ["p1", "p3", "p2"],
  },
  {
    id: "qr2",
    scenario: "Child welfare hotline call - assess urgency",
    clients: [
      { id: "p1", name: "Client A", situation: "Child reported home alone with visible injuries", priority: 1 },
      { id: "p2", name: "Client B", situation: "Parent concerned about neighbors child", priority: 2 },
      { id: "p3", name: "Client C", situation: "General inquiry about foster care process", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr3",
    scenario: "Multiple clients need same day attention",
    clients: [
      { id: "p1", name: "Client A", situation: "Suicidal ideation, actively planning", priority: 1 },
      { id: "p2", name: "Client B", situation: "Homeless veteran needs shelter placement tonight", priority: 2 },
      { id: "p3", name: "Client C", situation: "Parent needs help with school enrollment forms", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr4",
    scenario: "Substance abuse crisis and family conflict",
    clients: [
      { id: "p1", name: "Client A", situation: "Overdose victim, unresponsive, EMS called", priority: 1 },
      { id: "p2", name: "Client B", situation: "Parent requesting rehab placement for teen", priority: 2 },
      { id: "p3", name: "Client C", situation: "Couple wanting marriage counseling referral", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr5",
    scenario: "Elder abuse report and resource allocation",
    clients: [
      { id: "p1", name: "Client A", situation: "Elderly patient with unexplained bruises, possible caregiver abuse", priority: 1 },
      { id: "p2", name: "Client B", situation: "Senior needs meal delivery service connection", priority: 2 },
      { id: "p3", name: "Client C", situation: "Family seeking guardianship paperwork help", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr6",
    scenario: "Domestic violence shelter and safety planning",
    clients: [
      { id: "p1", name: "Client A", situation: "Victim fleeing abuser, needs emergency shelter tonight", priority: 1 },
      { id: "p2", name: "Client B", situation: "Victim requesting safety plan and legal resources", priority: 2 },
      { id: "p3", name: "Client C", situation: "Former client needs follow-up support group referral", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr7",
    scenario: "School social worker caseload priorities",
    clients: [
      { id: "p1", name: "Client A", situation: "Student threatening self-harm on social media", priority: 1 },
      { id: "p2", name: "Client B", situation: "Student being bullied, needs immediate safety plan", priority: 2 },
      { id: "p3", name: "Client C", situation: "Parent requesting 504 plan evaluation scheduling", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr8",
    scenario: "Housing instability and eviction crisis",
    clients: [
      { id: "p1", name: "Client A", situation: "Family evicted today, children sleeping in car", priority: 1 },
      { id: "p2", name: "Client B", situation: "Tenant facing eviction in 30 days, needs legal aid", priority: 2 },
      { id: "p3", name: "Client C", situation: "Individual seeking Section 8 application assistance", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr9",
    scenario: "Mental health crisis in hospital discharge",
    clients: [
      { id: "p1", name: "Client A", situation: "Patient refusing discharge, expressing suicidal thoughts", priority: 1 },
      { id: "p2", name: "Client B", situation: "Patient needs community mental health referral before leaving", priority: 2 },
      { id: "p3", name: "Client C", situation: "Family requesting information about support services", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr10",
    scenario: "Immigration and refugee resettlement services",
    clients: [
      { id: "p1", name: "Client A", situation: "Asylum seeker with credible fear, deportation risk imminent", priority: 1 },
      { id: "p2", name: "Client B", situation: "Refugee family needs housing and school enrollment help", priority: 2 },
      { id: "p3", name: "Client C", situation: "Individual seeking citizenship class information", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr11",
    scenario: "Substance exposed newborn and family services",
    clients: [
      { id: "p1", name: "Client A", situation: "Newborn testing positive for substances, CPS involvement required", priority: 1 },
      { id: "p2", name: "Client B", situation: "Mother needs drug treatment referral and parenting support", priority: 2 },
      { id: "p3", name: "Client C", situation: "Sibling needs temporary foster placement while case assessed", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr12",
    scenario: "Grief and bereavement support prioritization",
    clients: [
      { id: "p1", name: "Client A", situation: "Teen who lost parent, expressing suicidal ideation", priority: 1 },
      { id: "p2", name: "Client B", situation: "Widower needs grief counseling referral and support group", priority: 2 },
      { id: "p3", name: "Client C", situation: "Family seeking resources for memorial service assistance", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr13",
    scenario: "Disaster response and community trauma",
    clients: [
      { id: "p1", name: "Client A", situation: "Family missing member after tornado, need immediate location help", priority: 1 },
      { id: "p2", name: "Client B", situation: "Family lost home, needs temporary shelter and supplies", priority: 2 },
      { id: "p3", name: "Client C", situation: "Community member wanting to volunteer for relief efforts", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr14",
    scenario: "Veteran services and PTSD crisis intervention",
    clients: [
      { id: "p1", name: "Client A", situation: "Veteran with PTSD, threatening self-harm, crisis team needed", priority: 1 },
      { id: "p2", name: "Client B", situation: "Veteran needs VA benefits application assistance", priority: 2 },
      { id: "p3", name: "Client C", situation: "Veteran seeking peer support group connection", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr15",
    scenario: "Teen pregnancy and family dynamics",
    clients: [
      { id: "p1", name: "Client A", situation: "Pregnant teen reporting abuse at home, needs emergency placement", priority: 1 },
      { id: "p2", name: "Client B", situation: "Pregnant teen needs prenatal care referral and parenting classes", priority: 2 },
      { id: "p3", name: "Client C", situation: "Parents seeking family mediation services", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr16",
    scenario: "School refusal and truancy intervention",
    clients: [
      { id: "p1", name: "Client A", situation: "12-year-old refusing to leave home, parent fears violence", priority: 1 },
      { id: "p2", name: "Client B", situation: "Teen truant for 3 weeks, family needs attendance support plan", priority: 2 },
      { id: "p3", name: "Client C", situation: "Parent wants information about alternative schooling options", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr17",
    scenario: "ADHD diagnosis follow-up and family support",
    clients: [
      { id: "p1", name: "Client A", situation: "Child with new ADHD diagnosis, parent needs immediate behavior strategies", priority: 1 },
      { id: "p2", name: "Client B", situation: "Teen with ADHD needs academic advocacy and IEP support", priority: 2 },
      { id: "p3", name: "Client C", situation: "Parent seeking parent training group for ADHD management", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr18",
    scenario: "Autism diagnosis follow-up and family support",
    clients: [
      { id: "p1", name: "Client A", situation: "Toddler with new autism diagnosis, parent needs immediate intervention services", priority: 1 },
      { id: "p2", name: "Client B", situation: "School-age child needs ABA therapy coordination", priority: 2 },
      { id: "p3", name: "Client C", situation: "Parent seeking respite care resources and support group", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr19",
    scenario: "Behavioral issues and classroom management referral",
    clients: [
      { id: "p1", name: "Client A", situation: "Student threatening violence, immediate safety assessment needed", priority: 1 },
      { id: "p2", name: "Client B", situation: "Student suspended multiple times, needs behavior intervention plan", priority: 2 },
      { id: "p3", name: "Client C", situation: "Teacher requesting classroom management strategy consultation", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr20",
    scenario: "Transition planning for high school student",
    clients: [
      { id: "p1", name: "Client A", situation: "Senior with IEP, graduation at risk without transition services", priority: 1 },
      { id: "p2", name: "Client B", situation: "Student needs vocational assessment and job training placement", priority: 2 },
      { id: "p3", name: "Client C", situation: "Parent seeking information about post-secondary support services", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
];

export default function SocialWorkerWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: SocialWorkerWorldProps) {
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

  const shuffledClients = useMemo(() => {
    return shuffleArray(currentQuestion.clients);
  }, [currentQuestionIndex]);

  const handleClientClick = (clientId: string) => {
    audioSystem.playClickSound();
    if (selectedOrder.includes(clientId)) {
      setSelectedOrder(selectedOrder.filter((id) => id !== clientId));
    } else {
      setSelectedOrder([...selectedOrder, clientId]);
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
          explanation: "Incorrect client prioritization.",
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
        careerName="Social Worker"
        careerIcon="🤝"
        steps={[
          {
            title: "Understand Each Scenario",
            content: "Each question describes client situations needing services.",
            icon: "📖",
          },
          {
            title: "Prioritize by Urgency",
            content: "Crisis situations and safety concerns come first.",
            icon: "⚡",
          },
          {
            title: "Choose Client Order",
            content: "Click clients in the order you would serve them.",
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
              🤝 Scenario {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <>
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-2xl ${i < hearts ? "💖" : "🖤"}`} />
                    ))}
                  </div>
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-teal-600"}`}>
                    {timeLeft}s
                  </div>
                </>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-teal-600">{score}/{currentQuestionIndex}</div>
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
                        ? "bg-teal-500"
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="font-semibold text-teal-900">{currentQuestion.scenario}</p>
          </div>

          <p className="text-gray-700 mb-6">
            Click clients in order of priority. Click again to deselect.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {shuffledClients.map((client) => {
              const orderIndex = selectedOrder.indexOf(client.id);
              const isSelected = orderIndex !== -1;

              return (
                <button
                  key={client.id}
                  onClick={() => handleClientClick(client.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-300 hover:border-teal-400"
                  }`}
                >
                  {isSelected && (
                    <div className="text-2xl font-bold text-teal-600 mb-2">
                      #{orderIndex + 1}
                    </div>
                  )}
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {client.name}
                  </h4>
                  <p className="text-gray-700 text-sm">{client.situation}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedOrder.length !== currentQuestion.clients.length}
            className="w-full bg-teal-600 text-white font-bold py-4 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {selectedOrder.length === currentQuestion.clients.length
              ? currentQuestionIndex < totalQuestions - 1
                ? "Next Scenario →"
                : "Submit Final Answer"
              : `Select All Clients (${selectedOrder.length}/${currentQuestion.clients.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}