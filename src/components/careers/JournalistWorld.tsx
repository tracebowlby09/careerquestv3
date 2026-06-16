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

interface JournalistWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number, incorrectAnswers?: IncorrectAnswer[]) => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

interface NewsSource {
  id: string;
  source: string;
  reliability: string;
  priority: number;
}

interface Question {
  id: string;
  scenario: string;
  sources: NewsSource[];
  correctOrder: string[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Three breaking news tips come in. Verify in priority order.",
      sources: [
        { id: "p1", source: "Eyewitness at Accident", reliability: "Direct observation, credible witness", priority: 1 },
        { id: "p2", source: "Social Media Post", reliability: "Unverified, needs confirmation", priority: 3 },
        { id: "p3", source: "Official Press Release", reliability: "Official source, factual", priority: 2 },
      ],
      correctOrder: ["p1", "p3", "p2"],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Multiple stories developing - assign reporters.",
      sources: [
        { id: "p1", source: "Breaking News", reliability: "Shots fired, ongoing police activity", priority: 1 },
        { id: "p2", source: "Press Conference", reliability: "Scheduled 2pm mayor announcement", priority: 2 },
        { id: "p3", source: "Anonymous Tip", reliability: "Unverified claim, needs investigation", priority: 3 },
        { id: "p4", source: "Feature Story", reliability: "Human interest piece, flexible deadline", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Deadline pressure - prioritize newsroom workflow.",
      sources: [
        { id: "p1", source: "Developing Story", reliability: "Ongoing crisis, continuously updating", priority: 1 },
        { id: "p2", source: "Exclusive Interview", reliability: "High-profile interview scheduled soon", priority: 2 },
        { id: "p3", source: "Fact Check Request", reliability: "Verify claims for evening broadcast", priority: 3 },
        { id: "p4", source: "Archive Research", reliability: "Background for future investigation", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Prioritize: breaking news, press release, social tip",
    sources: [
      { id: "p1", source: "Breaking News", reliability: "Major incident ongoing", priority: 1 },
      { id: "p2", source: "Press Release", reliability: "Official statement", priority: 2 },
      { id: "p3", source: "Social Media", reliability: "Unverified tip", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr2",
    scenario: "Prioritize: eyewitness at accident, official press release, social media post",
    sources: [
      { id: "p1", source: "Eyewitness at Accident", reliability: "Direct observation, credible witness", priority: 1 },
      { id: "p2", source: "Official Press Release", reliability: "Official source, factual", priority: 2 },
      { id: "p3", source: "Social Media Post", reliability: "Unverified, needs confirmation", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr3",
    scenario: "Prioritize: developing story, press conference, anonymous tip, feature story",
    sources: [
      { id: "p1", source: "Developing Story", reliability: "Ongoing crisis, continuously updating", priority: 1 },
      { id: "p2", source: "Press Conference", reliability: "Scheduled 2pm mayor announcement", priority: 2 },
      { id: "p3", source: "Anonymous Tip", reliability: "Unverified claim, needs investigation", priority: 3 },
      { id: "p4", source: "Feature Story", reliability: "Human interest piece, flexible deadline", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr4",
    scenario: "Prioritize: shots fired, press conference, anonymous tip, feature story",
    sources: [
      { id: "p1", source: "Breaking News", reliability: "Shots fired, ongoing police activity", priority: 1 },
      { id: "p2", source: "Press Conference", reliability: "Scheduled mayor announcement", priority: 2 },
      { id: "p3", source: "Anonymous Tip", reliability: "Unverified claim, needs investigation", priority: 3 },
      { id: "p4", source: "Feature Story", reliability: "Human interest piece, flexible deadline", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr5",
    scenario: "Prioritize: fact check request, exclusive interview, archive research, social tip",
    sources: [
      { id: "p1", source: "Fact Check Request", reliability: "Verify claims for evening broadcast", priority: 1 },
      { id: "p2", source: "Exclusive Interview", reliability: "High-profile interview scheduled soon", priority: 2 },
      { id: "p3", source: "Archive Research", reliability: "Background for future investigation", priority: 3 },
      { id: "p4", source: "Social Media", reliability: "Unverified tip, needs confirmation", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr6",
    scenario: "Prioritize: verified source, anonymous tip, social media rumor, official statement",
    sources: [
      { id: "p1", source: "Verified Source", reliability: "Confirmed insider with documentation", priority: 1 },
      { id: "p2", source: "Anonymous Tip", reliability: "Unverified claim, needs corroboration", priority: 2 },
      { id: "p3", source: "Social Media Rumor", reliability: "Uncorroborated online claim", priority: 3 },
      { id: "p4", source: "Official Statement", reliability: "Government spokesperson response", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr7",
    scenario: "Prioritize: live broadcast, recorded interview, press release, tweet tip",
    sources: [
      { id: "p1", source: "Live Broadcast", reliability: "Breaking news happening now", priority: 1 },
      { id: "p2", source: "Recorded Interview", reliability: "Completed interview with key witness", priority: 2 },
      { id: "p3", source: "Press Release", reliability: "Official statement from organization", priority: 3 },
      { id: "p4", source: "Tweet Tip", reliability: "Unsourced social media suggestion", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr8",
    scenario: "Prioritize: court documents, witness interview, photo evidence, social video",
    sources: [
      { id: "p1", source: "Court Documents", reliability: "Legal filing with official record", priority: 1 },
      { id: "p2", source: "Witness Interview", reliability: "Eyewitness account to verify", priority: 2 },
      { id: "p3", source: "Photo Evidence", reliability: "Contemporary visual documentation", priority: 3 },
      { id: "p4", source: "Social Video", reliability: "User-generated content, needs verification", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr9",
    scenario: "Prioritize: press credentials, public information, press briefing, media advisory",
    sources: [
      { id: "p1", source: "Press Credentials", reliability: "Access to exclusive press area", priority: 1 },
      { id: "p2", source: "Public Information", reliability: "Open source available to all", priority: 2 },
      { id: "p3", source: "Press Briefing", reliability: "Scheduled official Q&A session", priority: 3 },
      { id: "p4", source: "Media Advisory", reliability: "Notice of upcoming event", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr10",
    scenario: "Prioritize: whistleblower contact, public records, press pool, wire service",
    sources: [
      { id: "p1", source: "Whistleblower Contact", reliability: "Protected source with key info", priority: 1 },
      { id: "p2", source: "Public Records", reliability: "Government documents via FOIA", priority: 2 },
      { id: "p3", source: "Press Pool", reliability: "Shared reporting with other journalists", priority: 3 },
      { id: "p4", source: "Wire Service", reliability: "AP/Reuters syndicated report", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr11",
    scenario: "Prioritize: deadline approaching, breaking news, scheduled event, research",
    sources: [
      { id: "p1", source: "Breaking Update", reliability: "Major development in ongoing story", priority: 1 },
      { id: "p2", source: "Scheduled Event", reliability: "Planned press conference today", priority: 2 },
      { id: "p3", source: "Research Interview", reliability: "Background for future investigation", priority: 3 },
      { id: "p4", source: "Fact Check", reliability: "Verify quotes before publication", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr12",
    scenario: "Prioritize: ethics review, source protection, accuracy check, deadline pressure",
    sources: [
      { id: "p1", source: "Source Protection", reliability: "Need to maintain confidentiality", priority: 1 },
      { id: "p2", source: "Ethics Review", reliability: "Potential conflict of interest concern", priority: 2 },
      { id: "p3", source: "Accuracy Check", reliability: "Verify all facts before print time", priority: 3 },
      { id: "p4", source: "Deadline Push", reliability: "Make final edits for publication", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr13",
    scenario: "Prioritize: editor revision, source follow-up, fact check, headline writing",
    sources: [
      { id: "p1", source: "Editor Revision", reliability: "Editor requests changes to story", priority: 1 },
      { id: "p2", source: "Source Follow-up", reliability: "Need additional confirmation from source", priority: 2 },
      { id: "p3", source: "Fact Check", reliability: "Verify statistics before going live", priority: 3 },
      { id: "p4", source: "Headline Writing", reliability: "Craft compelling headline for web", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr14",
    scenario: "Prioritize: investigative lead, press conference, social media, archive search",
    sources: [
      { id: "p1", source: "Investigative Lead", reliability: "Hot tip requiring immediate verification", priority: 1 },
      { id: "p2", source: "Press Conference", reliability: "Scheduled official announcement", priority: 2 },
      { id: "p3", source: "Social Media", reliability: "Monitor trending related topic", priority: 3 },
      { id: "p4", source: "Archive Search", reliability: "Research background for context", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr15",
    scenario: "Prioritize: libel concern, quote verification, deadline alert, photo selection",
    sources: [
      { id: "p1", source: "Libel Concern", reliability: "Potential defamation issue to review", priority: 1 },
      { id: "p2", source: "Quote Verification", reliability: "Confirm accuracy of attributed statement", priority: 2 },
      { id: "p3", source: "Deadline Alert", reliability: "Story must publish within hour", priority: 3 },
      { id: "p4", source: "Photo Selection", reliability: "Choose image to accompany story", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr16",
    scenario: "Prioritize: embargoed info, public leak, source confirmation, competitor scoop",
    sources: [
      { id: "p1", source: "Embargoed Information", reliability: "Time-sensitive official release", priority: 1 },
      { id: "p2", source: "Public Leak", reliability: "Unofficial info already circulating", priority: 2 },
      { id: "p3", source: "Source Confirmation", reliability: "Your contact verifies the details", priority: 3 },
      { id: "p4", source: "Competitor Scoop", reliability: "Rival outlet published similar story", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr17",
    scenario: "Prioritize: press freedom issue, access denial, source intimidation, story impact",
    sources: [
      { id: "p1", source: "Press Freedom Concern", reliability: "Authority blocking reporting access", priority: 1 },
      { id: "p2", source: "Source Intimidation", reliability: "Informant fears retaliation", priority: 2 },
      { id: "p3", source: "Story Impact Assessment", reliability: "Evaluate public interest factor", priority: 3 },
      { id: "p4", source: "Publication Decision", reliability: "Senior editor reviewing timing", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr18",
    scenario: "Prioritize: legal threat, story correction, breaking news, audience engagement",
    sources: [
      { id: "p1", source: "Legal Threat Received", reliability: "Lawyer demands story retraction", priority: 1 },
      { id: "p2", source: "Correction Needed", reliability: "Factual error requires immediate fix", priority: 2 },
      { id: "p3", source: "Breaking News Alert", reliability: "Major story developing rapidly", priority: 3 },
      { id: "p4", source: "Audience Engagement", reliability: "Social media promoting published story", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr19",
    scenario: "Prioritize: privacy concern, publish decision, source safety, headline accuracy",
    sources: [
      { id: "p1", source: "Privacy Concern", reliability: "Identifying details may endanger source", priority: 1 },
      { id: "p2", source: "Publish Decision", reliability: "Final approval from editor needed", priority: 2 },
      { id: "p3", source: "Source Safety", reliability: "Protect informant identity in publication", priority: 3 },
      { id: "p4", source: "Headline Accuracy", reliability: "Ensure headline matches story facts", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "qr20",
    scenario: "Prioritize: multiple source confirmation, single source risk, editor review, final check",
    sources: [
      { id: "p1", source: "Multiple Source Confirmation", reliability: "Two more sources verify key claim", priority: 1 },
      { id: "p2", source: "Single Source Risk", reliability: "Only one source for sensitive allegation", priority: 2 },
      { id: "p3", source: "Editor Review", reliability: "Senior editor examining story approach", priority: 3 },
      { id: "p4", source: "Final Legal Check", reliability: "Review for any remaining issues", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3", "p4"],
  },
];

export default function JournalistWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: JournalistWorldProps) {
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

  const shuffledSources = useMemo(() => {
    return shuffleArray(currentQuestion.sources);
  }, [currentQuestionIndex]);

  const handleSourceClick = (sourceId: string) => {
    audioSystem.playClickSound();
    if (selectedOrder.includes(sourceId)) {
      setSelectedOrder(selectedOrder.filter((id) => id !== sourceId));
    } else {
      setSelectedOrder([...selectedOrder, sourceId]);
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
          explanation: "Incorrect news prioritization.",
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
        careerName="Journalist"
        careerIcon="📰"
        steps={[
          {
            title: "Understand Each Scenario",
            content: "Each question describes news sources and stories.",
            icon: "📖",
          },
          {
            title: "Prioritize by Newsworthiness",
            content: "Breaking news and verified facts come first.",
            icon: "⚡",
          },
          {
            title: "Choose Story Order",
            content: "Click sources in the order you would investigate/publish.",
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
              📰 Scenario {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <>
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-2xl ${i < hearts ? "💖" : "🖤"}`} />
                    ))}
                  </div>
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-slate-600"}`}>
                    {timeLeft}s
                  </div>
                </>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-slate-600">{score}/{currentQuestionIndex}</div>
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
                        ? "bg-slate-500"
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-500 p-4 mb-6">
            <p className="font-semibold text-slate-900">{currentQuestion.scenario}</p>
          </div>

          <p className="text-gray-700 mb-6">
            Click sources in order of priority. Click again to deselect.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {shuffledSources.map((source) => {
              const orderIndex = selectedOrder.indexOf(source.id);
              const isSelected = orderIndex !== -1;

              return (
                <button
                  key={source.id}
                  onClick={() => handleSourceClick(source.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? "border-slate-600 bg-slate-50"
                      : "border-gray-300 hover:border-slate-400"
                  }`}
                >
                  {isSelected && (
                    <div className="text-2xl font-bold text-slate-600 mb-2">
                      #{orderIndex + 1}
                    </div>
                  )}
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {source.source}
                  </h4>
                  <p className="text-gray-700 text-sm">{source.reliability}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedOrder.length !== currentQuestion.sources.length}
            className="w-full bg-slate-600 text-white font-bold py-4 rounded-lg hover:bg-slate-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {selectedOrder.length === currentQuestion.sources.length
              ? currentQuestionIndex < totalQuestions - 1
                ? "Next Scenario →"
                : "Submit Final Answer"
              : `Select All Sources (${selectedOrder.length}/${currentQuestion.sources.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}