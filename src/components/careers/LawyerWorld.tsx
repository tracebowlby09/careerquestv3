"use client";

import { useState, useMemo, useEffect } from "react";
import { Difficulty } from "@/types/game";
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

interface LawyerWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

interface Question {
  id: string;
  case: string;
  question: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      case: "A client was injured due to a wet floor in a store with no warning signs.",
      question: "What type of negligence claim is this?",
      options: [
        { id: "a", text: "Premises liability", correct: true, explanation: "Premises liability holds property owners responsible for dangerous conditions." },
        { id: "b", text: "Product liability", correct: false, explanation: "This involves defective products, not property conditions." },
        { id: "c", text: "Employment law", correct: false, explanation: "This deals with workplace relationships, not slip and fall cases." },
      ],
    },
    {
      id: "e2",
      case: "A contract dispute where one party didn't fulfill their obligations.",
      question: "What's the first step in breach of contract?",
      options: [
        { id: "a", text: "Document the breach and send a demand letter", correct: true, explanation: "Written notice gives the breaching party a chance to remedy the situation." },
        { id: "b", text: "Immediately file a lawsuit", correct: false, explanation: "This is premature; settlement attempts should come first." },
        { id: "c", text: "Ignore it and accept the loss", correct: false, explanation: "Clients hire lawyers to pursue their legal remedies." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      case: "Defendant was charged with assault but claims self-defense.",
      question: "What elements must be proven for self-defense?",
      options: [
        { id: "a", text: "Imminent threat, reasonable fear, proportional response", correct: true, explanation: "Self-defense requires an immediate threat and proportional force." },
        { id: "b", text: "Previous threats, any weapon used, calling police", correct: false, explanation: "Self-defense focuses on the immediacy and proportionality of the threat." },
        { id: "c", text: "Witness testimony, police report, medical records", correct: false, explanation: "These are evidence types, not elements of the self-defense claim." },
      ],
    },
    {
      id: "m2",
      case: "Corporate merger requiring regulatory approval.",
      question: "What's a key antitrust consideration?",
      options: [
        { id: "a", text: "Whether the merger creates monopoly power", correct: true, explanation: "Antitrust law prevents mergers that substantially reduce competition." },
        { id: "b", text: "How quickly the deal closes", correct: false, explanation: "Speed of closure doesn't address competitive concerns." },
        { id: "c", text: "Whether both CEOs approve", correct: false, explanation: "Executive approval doesn't determine legality." },
      ],
    },
    {
      id: "m3",
      case: "Employment termination - employee claims discrimination.",
      question: "What establishes a prima facie discrimination case?",
      options: [
        { id: "a", text: "Membership in protected class, qualified performance, adverse action, circumstances suggesting bias", correct: true, explanation: "This is the standard framework for discrimination claims." },
        { id: "b", text: "Being late once, complaining about work, getting fired", correct: false, explanation: "This doesn't establish membership in a protected class or bias." },
        { id: "c", text: "Having a lawyer, filing with EEOC, getting a right-to-sue letter", correct: false, explanation: "These are procedural steps, not substantive elements." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      case: "Complex multi-party lawsuit with jurisdictional disputes.",
      question: "How do you determine personal jurisdiction?",
      options: [
        { id: "a", text: "Minimum contacts with the forum state and fairness considerations", correct: true, explanation: "Due process requires sufficient ties to the forum and fair play." },
        { id: "b", text: "Where the plaintiff lives or where the contract was signed", correct: false, explanation: "Jurisdiction depends on defendant's contacts, not just plaintiff's location." },
        { id: "c", text: "Where the lawyer has a license to practice", correct: false, explanation: "Lawyer licensing doesn't determine jurisdiction." },
      ],
    },
    {
      id: "h2",
      case: "Patent infringement with complex technical claims.",
      question: "What's the doctrine of equivalents?",
      options: [
        { id: "a", text: "A product infringes if it performs substantially the same function in substantially the same way", correct: true, explanation: "This doctrine catches products that avoid literal infringement by minor changes." },
        { id: "b", text: "All modifications of a patented invention are automatically infringing", correct: false, explanation: "Not all modifications; only those achieving the same result." },
        { id: "c", text: "Patents expire after 10 years regardless of filing date", correct: false, explanation: "Patent term is generally 20 years from filing." },
      ],
    },
    {
      id: "h3",
      case: "Bankruptcy with preferential transfer claims.",
      question: "What's the look-back period for preferential transfers?",
      options: [
        { id: "a", text: "90 days for general creditors, 1 year for insiders", correct: true, explanation: "Preference recovery depends on creditor type and timing." },
        { id: "b", text: "6 months for all creditors equally", correct: false, explanation: "The period differs based on creditor relationship." },
        { id: "c", text: "No time limit for preferential transfers", correct: false, explanation: "There's a specific statutory period for preference actions." },
      ],
    },
    {
      id: "h4",
      case: "Multistate class action with complex settlement negotiations.",
      question: "What's required for class certification?",
      options: [
        { id: "a", text: "Numerosity, commonality, typicality, adequacy of representation", correct: true, explanation: "These are the four prerequisites for Federal Rule 23 class certification." },
        { id: "b", text: "Large number of plaintiffs, high damages, media attention", correct: false, explanation: "These are factors but not the legal requirements." },
        { id: "c", text: "Same state residence, same lawyer, same damages sought", correct: false, explanation: "Class members can be from different states and have different damages." },
      ],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    case: "Client arrested for DUI - they want out of jail now.",
    question: "What's the fastest way to get them released?",
    options: [
      { id: "a", text: "File for bail reduction or surety bond", correct: true, explanation: "This gets the client out quickly while awaiting trial." },
      { id: "b", text: "Sue the arresting officer for false arrest", correct: false, explanation: "This takes too long and doesn't address immediate release." },
      { id: "c", text: "Wait for the trial next month", correct: false, explanation: "The client stays in jail unnecessarily." },
    ],
  },
  {
    id: "qr2",
    case: "Business contract with a force majeure clause.",
    question: "What does force majeure mean?",
    options: [
      { id: "a", text: "Unforeseeable events that excuse performance", correct: true, explanation: "It covers 'acts of God' and other unpreventable events." },
      { id: "b", text: "A clause allowing contract termination anytime", correct: false, explanation: "It has specific requirements for triggering." },
      { id: "c", text: "A requirement for additional insurance", correct: false, explanation: "This is about risk allocation, not insurance." },
    ],
  },
  {
    id: "qr3",
    case: "Landlord-tenant eviction for non-payment of rent.",
    question: "What's the proper legal process?",
    options: [
      { id: "a", text: "Notice, court filing, hearing, writ of possession", correct: true, explanation: "This follows due process requirements for eviction." },
      { id: "b", text: "Change locks immediately to get them out", correct: false, explanation: "Self-help evictions are illegal in most jurisdictions." },
      { id: "c", text: "Wait 3 days then call the police", correct: false, explanation: "This ignores court authority over landlord-tenant disputes." },
    ],
  },
  {
    id: "qr4",
    case: "Will contest - family member claims undue influence.",
    question: "What shows undue influence?",
    options: [
      { id: "a", text: "Susceptible victim, influencer with opportunity, unnatural result", correct: true, explanation: "These are the three elements courts examine." },
      { id: "b", text: "Last-minute changes to the will", correct: false, explanation: "Not all last-minute changes indicate undue influence." },
      { id: "c", text: "Family disagreement over inheritance", correct: false, explanation: "Disagreement alone doesn't prove undue influence." },
    ],
  },
  {
    id: "qr5",
    case: "Personal injury accident with insurance company calling.",
    question: "What should your client NOT say?",
    options: [
      { id: "a", text: "Exact recorded statement without lawyer present", correct: true, explanation: "Recorded statements are often used against clients later." },
      { id: "b", text: "Basic facts about what happened", correct: false, explanation: "Basic facts are generally okay to acknowledge." },
      { id: "c", text: "That they're feeling better today", correct: false, explanation: "Health updates aren't inherently harmful." },
    ],
  },
  {
    id: "qr6",
    case: "Startup seeking seed funding investment.",
    question: "What's the key document to review?",
    options: [
      { id: "a", text: "SAFE or convertible note terms and valuation caps", correct: true, explanation: "These determine future equity ownership and dilution." },
      { id: "b", text: "Office lease agreement", correct: false, explanation: "Important but not the key investment document." },
      { id: "c", text: "Company holiday policy", correct: false, explanation: "This is HR policy, not investment-critical." },
    ],
  },
  {
    id: "qr7",
    case: "Copyright infringement online.",
    question: "What's the DMCA takedown process?",
    options: [
      { id: "a", text: "Notify service provider, they remove, uploader can counter-notify", correct: true, explanation: "This is the statutory safe harbor procedure." },
      { id: "b", text: "Sue immediately for maximum damages", correct: false, explanation: "DMCA provides a simpler path first." },
      { id: "c", text: "Post public complaints on social media", correct: false, explanation: "This can increase liability and doesn't stop infringement." },
    ],
  },
  {
    id: "qr8",
    case: "Divorce property division in community property state.",
    question: "How is community property divided?",
    options: [
      { id: "a", text: "Generally 50-50 split of assets acquired during marriage", correct: true, explanation: "Community property states presume equal division." },
      { id: "b", text: "Winner takes all based on who files first", correct: false, explanation: "This isn't how divorce law works anywhere." },
      { id: "c", text: "Whoever earns more gets more", correct: false, explanation: "This reverses the community property principle." },
    ],
  },
  {
    id: "qr9",
    case: "Restaurant customer slips and falls in bathroom.",
    question: "What determines premises liability?",
    options: [
      { id: "a", text: "Landlord's knowledge of dangerous condition and reasonableness of inspection", correct: true, explanation: "Notice and reasonable care are key factors." },
      { id: "b", text: "Whether the customer was wearing appropriate shoes", correct: false, explanation: "Footwear may affect comparative fault but not liability itself." },
      { id: "c", text: "Time of day when the accident occurred", correct: false, explanation: "Time alone doesn't determine liability." },
    ],
  },
  {
    id: "qr10",
    case: "Employment termination during probationary period.",
    question: "What employment rights apply?",
    options: [
      { id: "a", text: "Limited - most protections don't apply during probation", correct: true, explanation: "Probationary employees have fewer protections until they establish employment." },
      { id: "b", text: "Full protection as if they were a regular employee", correct: false, explanation: "Probationary status often allows easier termination." },
      { id: "c", text: "No rights at all - they can be fired for anything", correct: false, explanation: "Some basic protections still apply." },
    ],
  },
  {
    id: "qr11",
    case: "Real estate purchase with property inspection issues.",
    question: "What's the standard home inspection contingency?",
    options: [
      { id: "a", text: "Buyer can negotiate repairs or withdraw based on inspection results", correct: true, explanation: "Inspection contingencies protect buyers from unknown defects." },
      { id: "b", text: "Seller must fix everything the inspector finds", correct: false, explanation: "Buyers can negotiate but sellers aren't obligated to fix all issues." },
      { id: "c", text: "Buyer loses deposit if they complain about inspection results", correct: false, explanation: "This defeats the purpose of the contingency." },
    ],
  },
  {
    id: "qr12",
    case: "Trademark infringement dispute.",
    question: "What factors determine likelihood of confusion?",
    options: [
      { id: "a", text: "Similarity of marks, relatedness of goods, strength of mark", correct: true, explanation: "These are the core factors in trademark analysis." },
      { id: "b", text: "How long the plaintiff has had the mark", correct: false, explanation: "Duration is just one factor among many." },
      { id: "c", text: "Whether the defendant knew about the plaintiff's mark", correct: false, explanation: "Knowing infringement matters but confusion is the test." },
    ],
  },
];

export default function LawyerWorld({ difficulty, onComplete, isQuickRecall, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: LawyerWorldProps) {
  const [stage, setStage] = useState<"intro" | "tutorial" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showHeartLost, setShowHeartLost] = useState(false);
  const [heartLostMessage, setHeartLostMessage] = useState("");
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (!isQuickRecall || stage !== "challenge" || hearts <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleLoseHeart("Time's up!");
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isQuickRecall, stage, currentQuestionIndex, hearts]);

  const handleLoseHeart = (message: string) => {
    const newHearts = hearts - 1;
    setHearts(newHearts);
    setShowHeartLost(true);
    setHeartLostMessage(message);
    
    setTimeout(() => {
      setShowHeartLost(false);
      if (newHearts <= 0) {
        onComplete(false, score, totalQuestions);
      } else if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setTimeLeft(20);
        setQuestionStartTime(Date.now());
      } else {
        onComplete(true, score + 1, totalQuestions);
      }
    }, 1500);
  };

  const currentQuestions = isQuickRecall 
    ? (quickRecallQuestions.length > 0 ? quickRecallQuestions : questions.easy)
    : questions[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  useEffect(() => {
    if (alwaysCorrect && currentQuestion) {
      const correctOpt = currentQuestion.options.find(opt => opt.correct);
      if (correctOpt) setSelectedAnswer(correctOpt.id);
    }
  }, [alwaysCorrect, currentQuestionIndex]);

  const shuffledOptions = useMemo(() => {
    return shuffleArray(currentQuestion.options);
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    const selected = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
    if (!selected) return;

    const isCorrect = selected.correct;
    const timeMs = Date.now() - questionStartTime;
    
    if (onAnswerResult) {
      onAnswerResult(isCorrect, timeMs);
    }
    
    if (isQuickRecall) {
      if (isCorrect) {
        const newScore = score + 1;
        setScore(newScore);
        setAnsweredQuestions([...answeredQuestions, true]);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
        
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setTimeLeft(20);
          setQuestionStartTime(Date.now());
        } else {
          onComplete(true, newScore, totalQuestions);
        }
      } else {
        handleLoseHeart("Wrong answer!");
        setStreak(0);
      }
      return;
    }

    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setAnsweredQuestions([...answeredQuestions, isCorrect]);
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setQuestionStartTime(Date.now());
    } else {
      const passRatio = isCertification ? 0.8 : 0.6;
      const passThreshold = Math.ceil(totalQuestions * passRatio)
      onComplete(newScore >= passThreshold, newScore, totalQuestions);
    }
  };

  if (stage === "intro") {
    return (
      <TutorialScreen
        careerName="Lawyer"
        careerIcon="⚖️"
        steps={[
          {
            title: "Analyze the Case",
            content: "Each question presents a legal scenario. Read it carefully to understand the key issues.",
            icon: "📖",
          },
          {
            title: "Apply Legal Principles",
            content: "Think about relevant laws, precedents, and legal standards that apply to the situation.",
            icon: "⚖️",
          },
          {
            title: "Choose the Best Answer",
            content: "Select the option that correctly applies legal reasoning to the facts presented.",
            icon: "👆",
          },
          {
            title: "Pass the Challenge",
            content: `You need ${Math.ceil(questions[difficulty].length * (isCertification ? 0.8 : 0.6))} out of ${questions[difficulty].length} correct to pass. Good luck!`,
            icon: "🏆",
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
      <div className="max-w-4xl mx-auto">
        {showHeartLost && (
          <div className="fixed inset-0 bg-red-500/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center animate-pulse">
              <div className="text-6xl mb-4">💔</div>
              <p className="text-2xl font-bold text-red-600">{heartLostMessage}</p>
              <p className="text-lg text-gray-600 mt-2">Hearts remaining: {hearts}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              ⚖️ Case {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">❤️</span>
                  <span className={`text-2xl font-bold ${hearts === 1 ? 'text-red-600' : hearts === 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {hearts}
                  </span>
                </div>
              )}
              {isQuickRecall && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-100 animate-pulse' : 'bg-blue-100'}`}>
                  <span className="text-lg">⏱️</span>
                  <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
                    {timeLeft}s
                  </span>
                </div>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-blue-600">{score}/{currentQuestionIndex}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">🔥 Streak</div>
                <div className={`text-2xl font-bold ${streak >= 3 ? 'text-orange-500' : streak >= 2 ? 'text-yellow-500' : 'text-gray-600'}`}>
                  {streak}
                </div>
                {bestStreak > 0 && (
                  <div className="text-xs text-gray-500">Best: {bestStreak}</div>
                )}
              </div>
            </div>
          </div>

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
            <p className="font-semibold text-blue-900 mb-2">Case Details:</p>
            <p className="text-blue-800">{currentQuestion.case}</p>
          </div>

          <p className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </p>

          <div className="space-y-3 mb-6">
            {shuffledOptions.map((option) => (
              <label
                key={option.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAnswer === option.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(e) => {
                          audioSystem.playClickSound();
                          setSelectedAnswer(e.target.value);
                        }}
                  className="mr-3"
                />
                <span className="text-gray-800">{option.text}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestionIndex < totalQuestions - 1 ? "Next Case →" : "Submit Final Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}