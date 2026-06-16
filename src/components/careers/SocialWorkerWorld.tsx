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
    scenario: "Prioritize: emergency placement, court testimony, housing, medication",
    clients: [
      { id: "p1", name: "Client - Emergency", situation: "Immediate foster placement needed", priority: 1 },
      { id: "p2", name: "Client - Court", situation: "Testimony in custody hearing", priority: 2 },
      { id: "p3", name: "Client - Housing", situation: "Emergency shelter referral", priority: 3 },
      { id: "p4", name: "Client - Medication", situation: "Arrange psychiatric meds refill", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr3",
    scenario: "Prioritize: domestic violence shelter, substance abuse, employment, benefits",
    clients: [
      { id: "p1", name: "Client - DV Shelter", situation: "Domestic violence safe housing needed", priority: 1 },
      { id: "p2", name: "Client - Substance", situation: "Substance abuse intervention urgent", priority: 2 },
      { id: "p3", name: "Client - Employment", situation: "Job placement assistance needed", priority: 3 },
      { id: "p4", name: "Client - Benefits", situation: "Emergency benefits recertification", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr4",
    scenario: "Prioritize: child welfare check, crisis intervention, resource coordination",
    clients: [
      { id: "p1", name: "Client - Welfare Check", situation: "Reported child neglect concern", priority: 1 },
      { id: "p2", name: "Client - Crisis", situation: "Suicidal ideation call back", priority: 2 },
      { id: "p3", name: "Client - Resources", situation: "Connect to food bank services", priority: 3 },
      { id: "p4", name: "Client - Follow-up", situation: "Document recent case progress", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr5",
    scenario: "Prioritize: mental health referral, child custody, family therapy, documentation",
    clients: [
      { id: "p1", name: "Client - Mental Health", situation: "Psychiatric emergency referral", priority: 1 },
      { id: "p2", name: "Client - Custody", situation: "Child custody mediation today", priority: 2 },
      { id: "p3", name: "Client - Therapy", situation: "Family session rescheduling", priority: 3 },
      { id: "p4", name: "Client - Notes", situation: "Complete session notes documentation", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr6",
    scenario: "Prioritize: cultural competency considerations, language barrier, interpreter, respect",
    clients: [
      { id: "p1", name: "Client - Cultural Barrier", situation: "Need interpreter for session", priority: 1 },
      { id: "p2", name: "Client - Traditions", situation: "Respect cultural practices in plan", priority: 2 },
      { id: "p3", name: "Client - Community", situation: "Connect to cultural community resources", priority: 3 },
      { id: "p4", name: "Client - Documentation", situation: "Note cultural considerations in chart", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr7",
    scenario: "Prioritize: ethics violation report, boundary issue, supervisor consultation, client safety",
    clients: [
      { id: "p1", name: "Client - Ethics Issue", situation: "Potential boundary violation reported", priority: 1 },
      { id: "p2", name: "Client - Supervision", situation: "Consult supervisor about case", priority: 2 },
      { id: "p3", name: "Client - Safety", situation: "Ensure client safety in home placement", priority: 3 },
      { id: "p4", name: "Client - Documentation", situation: "Complete required ethics paperwork", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr8",
    scenario: "Prioritize: case management triage",
    clients: [
      { id: "p1", name: "Client - Crisis", situation: "Homeless shelter emergency intake", priority: 1 },
      { id: "p2", name: "Client - Stable", situation: "Monthly case status check-in", priority: 2 },
      { id: "p3", name: "Client - Waiting", situation: "Awaiting benefit approval call", priority: 3 },
      { id: "p4", name: "Client - Refill", situation: "Schedule quarterly review meeting", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr9",
    scenario: "Prioritize: aging out of foster care, transition planning, college prep, housing",
    clients: [
      { id: "p1", name: "Client - Aging Out", situation: "18-year-old aging out of system", priority: 1 },
      { id: "p2", name: "Client - Transition", situation: "Independent living skills training", priority: 2 },
      { id: "p3", name: "Client - Education", situation: "College application assistance", priority: 3 },
      { id: "p4", name: "Client - Housing", situation: "Transitional living program", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr10",
    scenario: "Prioritize: substance abuse program enrollment, detox referral, counseling, support",
    clients: [
      { id: "p1", name: "Client - Detox", situation: "Immediate detox program referral needed", priority: 1 },
      { id: "p2", name: "Client - Counseling", situation: "Substance abuse counseling intake", priority: 2 },
      { id: "p3", name: "Client - Support", situation: "Connect to AA/NA meetings", priority: 3 },
      { id: "p4", name: "Client - Follow-up", situation: "Schedule weekly check-in sessions", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr11",
    scenario: "Prioritize: school social work referrals, bullying incident, family meeting, IEP",
    clients: [
      { id: "p1", name: "Client - Crisis", situation: "Student expressing self-harm ideation", priority: 1 },
      { id: "p2", name: "Client - Bullying", situation: "Investigate bullying incident report", priority: 2 },
      { id: "p3", name: "Client - Meeting", situation: "Parent-teacher conference scheduled", priority: 3 },
      { id: "p4", name: "Client - IEP", situation: "Review IEP for special services", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr12",
    scenario: "Prioritize: medical social work coordination, discharge planning, insurance, home care",
    clients: [
      { id: "p1", name: "Client - Discharge", situation: "Urgent discharge planning needed", priority: 1 },
      { id: "p2", name: "Client - Insurance", situation: "Medicaid coverage for home care", priority: 2 },
      { id: "p3", name: "Client - Equipment", situation: "Arrange medical equipment delivery", priority: 3 },
      { id: "p4", name: "Client - Follow-up", situation: "Schedule home health visits", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr13",
    scenario: "Prioritize: geriatric case management, elder abuse, medication, respite care",
    clients: [
      { id: "p1", name: "Client - Abuse", situation: "Elder abuse suspected in home", priority: 1 },
      { id: "p2", name: "Client - Medication", situation: "Review polypharmacy concerns", priority: 2 },
      { id: "p3", name: "Client - Respite", situation: "Respite care for caregiver relief", priority: 3 },
      { id: "p4", name: "Client - Services", situation: "Connect to senior center programs", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr14",
    scenario: "Prioritize: veteran social services, PTSD referral, housing, benefits",
    clients: [
      { id: "p1", name: "Client - PTSD", situation: "Veteran with acute PTSD symptoms", priority: 1 },
      { id: "p2", name: "Client - Housing", situation: "VA supportive housing application", priority: 2 },
      { id: "p3", name: "Client - Benefits", situation: "Disability benefits advocacy needed", priority: 3 },
      { id: "p4", name: "Client - Family", situation: "Veteran family counseling referral", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr15",
    scenario: "Prioritize: disability services, ADA compliance, accommodation, advocacy",
    clients: [
      { id: "p1", name: "Client - Accommodation", situation: "Workplace ADA accommodation urgent", priority: 1 },
      { id: "p2", name: "Client - Services", situation: "Apply for disability support services", priority: 2 },
      { id: "p3", name: "Client - Advocacy", situation: "School IEP meeting advocacy", priority: 3 },
      { id: "p4", name: "Client - Documentation", situation: "Complete functional assessment report", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr16",
    scenario: "Prioritize: immigrant/refugee services, cultural orientation, legal aid, ESL",
    clients: [
      { id: "p1", name: "Client - Legal", situation: "Immigration legal services needed", priority: 1 },
      { id: "p2", name: "Client - Orientation", situation: "Cultural orientation program enrollment", priority: 2 },
      { id: "p3", name: "Client - ESL", situation: "English language class placement", priority: 3 },
      { id: "p4", name: "Client - Employment", situation: "Job placement assistance services", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr17",
    scenario: "Prioritize: emergency shelter access, domestic violence, safety plan, advocacy",
    clients: [
      { id: "p1", name: "Client - Emergency", situation: "Immediate shelter placement required", priority: 1 },
      { id: "p2", name: "Client - Safety Plan", situation: "Develop domestic violence safety plan", priority: 2 },
      { id: "p3", name: "Client - Advocacy", situation: "Advocate for protection order", priority: 3 },
      { id: "p4", name: "Client - Children", situation: "Arrange childcare during shelter stay", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr18",
    scenario: "Prioritize: group therapy facilitation, individual crisis, family session, documentation",
    clients: [
      { id: "p1", name: "Client - Individual Crisis", situation: "Member in crisis during group session", priority: 1 },
      { id: "p2", name: "Client - Group Prep", situation: "Prepare materials for therapy group", priority: 2 },
      { id: "p3", name: "Client - Family Session", situation: "Family therapy session follow-up", priority: 3 },
      { id: "p4", name: "Client - Notes", situation: "Document group session progress notes", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr19",
    scenario: "Prioritize: community resource coordination, food bank, utility assistance, employment",
    clients: [
      { id: "p1", name: "Client - Utility Crisis", situation: "Utility shutoff imminent tomorrow", priority: 1 },
      { id: "p2", name: "Client - Food Bank", situation: "Emergency food assistance needed", priority: 2 },
      { id: "p3", name: "Client - Employment", situation: "Job search assistance services", priority: 3 },
      { id: "p4", name: "Client - Clothing", situation: "Connect to clothing assistance program", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr20",
    scenario: "Prioritize: case closure procedures, final documentation, referral follow-up, discharge",
    clients: [
      { id: "p1", name: "Client - Final Visit", situation: "Last session before case closure", priority: 1 },
      { id: "p2", name: "Client - Documentation", situation: "Complete final case summary report", priority: 2 },
      { id: "p3", name: "Client - Referrals", situation: "Follow up on referral connections made", priority: 3 },
      { id: "p4", name: "Client - Discharge", situation: "Schedule formal discharge meeting", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
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