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

interface RetailWorldProps {
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
  scenario: string;
  question: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Customer brings back a shirt with tag still on, no receipt, within return period.",
      question: "What's the best policy?",
      options: [
        { id: "a", text: "Offer store credit at lowest recent sale price", correct: true, explanation: "This follows standard return policy for no-receipt returns." },
        { id: "b", text: "Refuse the return since there's no receipt", correct: false, explanation: "This loses customer goodwill unnecessarily." },
        { id: "c", text: "Give cash back at full price", correct: false, explanation: "This exceeds policy and invites fraud." },
      ],
    },
    {
      id: "e2",
      scenario: "Customer is looking for a specific size that's out of stock.",
      question: "How do you help?",
      options: [
        { id: "a", text: "Check other locations and offer to order it", correct: true, explanation: "This provides excellent customer service." },
        { id: "b", text: "Tell them to check back next week", correct: false, explanation: "This misses an opportunity to help the customer." },
        { id: "c", text: "Suggest a completely different product", correct: false, explanation: "This ignores what they actually want." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Customer is upset about a long checkout line.",
      question: "What's the best approach?",
      options: [
        { id: "a", text: "Acknowledge their frustration and open another register", correct: true, explanation: "Empathy plus action solves the problem." },
        { id: "b", text: "Explain it's not your fault and they should wait", correct: false, explanation: "This escalates the situation." },
        { id: "c", text: "Ignore them and hope they calm down", correct: false, explanation: "This loses customer trust." },
      ],
    },
    {
      id: "m2",
      scenario: "Customer tries to use expired coupon for a sale item.",
      question: "What do you do?",
      options: [
        { id: "a", text: "Honor the expired coupon as a customer service gesture", correct: true, explanation: "Building goodwill is worth the small discount." },
        { id: "b", text: "Refuse because the coupon is expired", correct: false, explanation: "This creates unnecessary conflict." },
        { id: "c", text: "Make them pay full price plus the coupon value", correct: false, explanation: "This is dishonest and illegal." },
      ],
    },
    {
      id: "m3",
      scenario: "You notice a coworker pocketing merchandise.",
      question: "What should you do?",
      options: [
        { id: "a", text: "Report to management discreetly", correct: true, explanation: "This protects the store and is the right thing to do." },
        { id: "b", text: "Confront the coworker directly", correct: false, explanation: "This could create workplace tension or safety issues." },
        { id: "c", text: "Don't say anything to avoid drama", correct: false, explanation: "This enables theft and could implicate you." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Black Friday crowd surge at the door, customers pushing.",
      question: "What's the safety priority?",
      options: [
        { id: "a", text: "Ensure customer and staff safety first, control the flow", correct: true, explanation: "Safety trumps sales in dangerous situations." },
        { id: "b", text: "Let them in quickly to maximize sales", correct: false, explanation: "This creates liability and safety hazards." },
        { id: "c", text: "Lock the doors and close early", correct: false, explanation: "This abandons customers and loses legitimate sales." },
      ],
    },
    {
      id: "h2",
      scenario: "Customer has a service dog but no visible disability.",
      question: "What's the legal requirement?",
      options: [
        { id: "a", text: "Allow the dog - ADA doesn't require visible disability", correct: true, explanation: "Service animals are protected regardless of visibility of disability." },
        { id: "b", text: "Ask for documentation proving the disability", correct: false, explanation: "This violates ADA regulations." },
        { id: "c", text: "Offer to hold the dog at customer service", correct: false, explanation: "This treats the service animal as a pet." },
      ],
    },
    {
      id: "h3",
      scenario: "Customer receives counterfeit bill as change.",
      question: "What's the correct response?",
      options: [
        { id: "a", text: "Accept responsibility, replace the bill, and review cash handling procedures", correct: true, explanation: "Integrity and customer satisfaction come first." },
        { id: "b", text: "Blame the customer for not checking", correct: false, explanation: "This deflects responsibility inappropriately." },
        { id: "c", text: "Refuse to replace it claiming it's their fault", correct: false, explanation: "This violates consumer protection laws." },
      ],
    },
    {
      id: "h4",
      scenario: "System outage during busy shopping period.",
      question: "How do you handle transactions?",
      options: [
        { id: "a", text: "Process manually with manager approval and follow up", correct: true, explanation: "This maintains service while ensuring accuracy." },
        { id: "b", text: "Close the store until systems are restored", correct: false, explanation: "This unnecessarily loses sales and inconveniences customers." },
        { id: "c", text: "Guess prices based on memory", correct: false, explanation: "This creates pricing errors and potential legal issues." },
      ],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Customer asks for a price check on an item with no tag.",
    question: "What's the fastest way to help?",
    options: [
      { id: "a", text: "Scan similar items to find the price point", correct: true, explanation: "This uses available system data efficiently." },
      { id: "b", text: "Guess a reasonable price", correct: false, explanation: "This can lead to pricing errors." },
      { id: "c", text: "Tell them to come back later", correct: false, explanation: "This loses the sale." },
    ],
  },
  {
    id: "qr2",
    scenario: "Customer wants to use two coupons on one item.",
    question: "What's the policy?",
    options: [
      { id: "a", text: "One coupon per item unless stated otherwise", correct: true, explanation: "This follows standard retail coupon policy." },
      { id: "b", text: "Let them use as many as they have", correct: false, explanation: "This violates coupon terms and profits." },
      { id: "c", text: "Refuse both coupons", correct: false, explanation: "This loses the sale unnecessarily." },
    ],
  },
  {
    id: "qr3",
    scenario: "Customer's card is declined at checkout.",
    question: "What's the professional response?",
    options: [
      { id: "a", text: "Quietly suggest they check with their bank and offer other payment options", correct: true, explanation: "This preserves dignity while solving the problem." },
      { id: "b", text: "Announce loudly that their card was declined", correct: false, explanation: "This embarrasses the customer." },
      { id: "c", text: "Refuse to let them try another card", correct: false, explanation: "This ends the transaction unnecessarily." },
    ],
  },
];

export default function RetailWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: RetailWorldProps) {
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
        careerName="Retail Worker"
        careerIcon="🛍️"
        steps={[
          {
            title: "Understand the Customer",
            content: "Each question presents a retail scenario. Read carefully to understand what's needed.",
            icon: "📖",
          },
          {
            title: "Apply Store Policy",
            content: "Think about return policies, customer service standards, and legal requirements.",
            icon: "📋",
          },
          {
            title: "Choose the Best Solution",
            content: "Select the option that provides great customer service while following policy.",
            icon: "👆",
          },
          {
            title: isCertification ? "Pass the Certification" : "Pass the Challenge",
            content: `You need ${Math.ceil(questions[difficulty].length * (isCertification ? 0.8 : 0.6))} out of ${questions[difficulty].length} correct to pass. Good luck!`,
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
              🛍️ Scenario {currentQuestionIndex + 1} of {totalQuestions}
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
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-100 animate-pulse' : 'bg-pink-100'}`}>
                  <span className="text-lg">⏱️</span>
                  <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-pink-600'}`}>
                    {timeLeft}s
                  </span>
                </div>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-pink-600">{score}/{currentQuestionIndex}</div>
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
                      ? "bg-pink-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-pink-50 border-l-4 border-pink-500 p-4 mb-6">
            <p className="font-semibold text-pink-900 mb-2">Scenario:</p>
            <p className="text-pink-800">{currentQuestion.scenario}</p>
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
                    ? "border-pink-600 bg-pink-50"
                    : "border-gray-300 hover:border-pink-400"
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
            {currentQuestionIndex < totalQuestions - 1 ? "Next Scenario →" : "Submit Final Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}