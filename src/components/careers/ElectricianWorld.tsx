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

interface ElectricianWorldProps {
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
      scenario: "Installing a new 15-amp circuit for bedroom outlets.",
      question: "What wire gauge is required?",
      options: [
        { id: "a", text: "14 AWG copper", correct: true, explanation: "14 AWG is rated for 15-amp circuits per NEC." },
        { id: "b", text: "12 AWG copper", correct: false, explanation: "This is for 20-amp circuits." },
        { id: "c", text: "10 AWG copper", correct: false, explanation: "This is for 30-amp circuits." },
      ],
    },
    {
      id: "e2",
      scenario: "Replacing an old light switch in a metal box.",
      question: "What's the first safety step?",
      options: [
        { id: "a", text: "Turn off power at the breaker and verify with a tester", correct: true, explanation: "Always verify power is off before working." },
        { id: "b", text: "Turn off the light switch and start working", correct: false, explanation: "The breaker must be off for safety." },
        { id: "c", text: "Wear rubber gloves and work quickly", correct: false, explanation: "PPE doesn't replace proper lockout/tagout." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Installing a 240V dryer outlet in a laundry room.",
      question: "What's the minimum wire size?",
      options: [
        { id: "a", text: "10 AWG copper (30 amp) or 8 AWG aluminum (30 amp)", correct: true, explanation: "Dryers typically require 30-amp circuits with appropriate wire." },
        { id: "b", text: "12 AWG copper", correct: false, explanation: "This is only rated for 20 amps." },
        { id: "c", text: "14 AWG copper", correct: false, explanation: "This is only rated for 15 amps." },
      ],
    },
    {
      id: "m2",
      scenario: "Customer reports GFCI outlet won't reset.",
      question: "What's the troubleshooting order?",
      options: [
        { id: "a", text: "Check for ground fault, verify line/load connections, test with no load", correct: true, explanation: "Systematic troubleshooting isolates the problem." },
        { id: "b", text: "Replace it immediately with a new GFCI", correct: false, explanation: "This wastes time and money if the problem is elsewhere." },
        { id: "c", text: "Tell them to plug in something and see if it works", correct: false, explanation: "This doesn't address the reset failure." },
      ],
    },
    {
      id: "m3",
      scenario: "Running conduit from panel to new workshop.",
      question: "What's the best conduit choice?",
      options: [
        { id: "a", text: "PVC for underground, EMT for indoor sections", correct: true, explanation: "PVC resists moisture, EMT is easy to work with indoors." },
        { id: "b", text: "Flexible extension cord", correct: false, explanation: "This isn't code-compliant for permanent wiring." },
        { id: "c", text: "Romex cable exposed on walls", correct: false, explanation: "NM cable requires protection in exposed areas." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Adding a subpanel 150 feet from main panel.",
      question: "What voltage drop consideration applies?",
      options: [
        { id: "a", text: "Use 8 AWG for 50-amp to keep drop under 3%", correct: true, explanation: "Distance requires upsizing wire to maintain efficiency." },
        { id: "b", text: "Use 10 AWG for 50-amp, same as short runs", correct: false, explanation: "This would have excessive voltage drop over distance." },
        { id: "c", text: "Keep the subpanel at 30 amps to reduce wire cost", correct: false, explanation: "This may not meet load requirements." },
      ],
    },
    {
      id: "h2",
      scenario: "Troubleshooting three-way switch circuit that doesn't work.",
      question: "What's the most likely cause?",
      options: [
        { id: "a", text: "Miswired travelers on one of the switches", correct: true, explanation: "Three-way switches require correct traveler connections." },
        { id: "b", text: "Both switches are bad and need replacement", correct: false, explanation: "This is unlikely; miswiring is more common." },
        { id: "c", text: "The light bulb needs to be replaced", correct: false, explanation: "This doesn't explain the switching problem." },
      ],
    },
    {
      id: "h3",
      scenario: "Service entrance cable replacement on a residential building.",
      question: "What's the grounding electrode requirement?",
      options: [
        { id: "a", text: "Ground rod within 6 feet of panel and connected with proper gauge wire", correct: true, explanation: "This provides the required grounding path." },
        { id: "b", text: "Just connect to the metal water pipe", correct: false, explanation: "This alone isn't sufficient per current NEC." },
        { id: "c", text: "No grounding needed if using plastic conduit", correct: false, explanation: "Grounding is always required for safety." },
      ],
    },
    {
      id: "h4",
      scenario: "Installing a whole-house surge protector.",
      question: "Where should it be installed?",
      options: [
        { id: "a", text: "At the main panel on the circuit breaker side", correct: true, explanation: "This protects all circuits in the house." },
        { id: "b", text: "At the meter can for easy access", correct: false, explanation: "The meter is utility property, not accessible for customer work." },
        { id: "c", text: "At the first outlet in each room", correct: false, explanation: "This would require multiple units and miss protection." },
      ],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Adding an outlet to an existing circuit.",
    question: "How many outlets per 20-amp circuit?",
    options: [
      { id: "a", text: "Typically 10-13 outlets maximum", correct: true, explanation: "NEC recommends 1.5-2 amps per receptacle." },
      { id: "b", text: "As many as you want", correct: false, explanation: "This violates load calculation rules." },
      { id: "c", text: "Maximum 4 outlets per code", correct: false, explanation: "This is unnecessarily restrictive." },
    ],
  },
  {
    id: "qr2",
    scenario: "Installing a ceiling fan in place of a light fixture.",
    question: "What's required for the electrical box?",
    options: [
      { id: "a", text: "Fan-rated box securely attached to structure", correct: true, explanation: "Regular boxes can't handle fan vibration and weight." },
      { id: "b", text: "Any old electrical box will work", correct: false, explanation: "This could cause the fan to fall." },
      { id: "c", text: "Plastic box taped to the ceiling", correct: false, explanation: "This isn't secure at all." },
    ],
  },
  {
    id: "qr3",
    scenario: "Customer wants to add outlets to a kitchen counter.",
    question: "What's the GFCI requirement?",
    options: [
      { id: "a", text: "All kitchen counter outlets must be GFCI protected", correct: true, explanation: "NEC requires GFCI for kitchen small appliance circuits." },
      { id: "b", text: "Only outlets near the sink need GFCI", correct: false, explanation: "All kitchen counter outlets need protection." },
      { id: "c", text: "GFCI is optional in kitchens", correct: false, explanation: "This is required by code for safety." },
    ],
  },
];

export default function ElectricianWorld({ difficulty, onComplete, isQuickRecall, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: ElectricianWorldProps) {
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
      const passThreshold = Math.ceil(totalQuestions * 0.6);
      onComplete(newScore >= passThreshold, newScore, totalQuestions);
    }
  };

  if (stage === "intro") {
    return (
      <TutorialScreen
        careerName="Electrician"
        careerIcon="⚡"
        steps={[
          {
            title: "Study the Scenario",
            content: "Each question presents an electrical situation. Read carefully to understand the requirements.",
            icon: "📖",
          },
          {
            title: "Apply Electrical Code",
            content: "Think about NEC codes, safety requirements, and best practices for the situation.",
            icon: "⚡",
          },
          {
            title: "Choose the Correct Answer",
            content: "Select the option that follows electrical code and ensures safety.",
            icon: "👆",
          },
          {
            title: "Pass the Challenge",
            content: `You need ${Math.ceil(questions[difficulty].length * 0.6)} out of ${questions[difficulty].length} correct to pass. Good luck!`,
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
              ⚡ Scenario {currentQuestionIndex + 1} of {totalQuestions}
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
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-100 animate-pulse' : 'bg-yellow-100'}`}>
                  <span className="text-lg">⏱️</span>
                  <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {timeLeft}s
                  </span>
                </div>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-yellow-600">{score}/{currentQuestionIndex}</div>
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
                      ? "bg-yellow-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="font-semibold text-yellow-900 mb-2">Electrical Scenario:</p>
            <p className="text-yellow-800">{currentQuestion.scenario}</p>
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
                    ? "border-yellow-600 bg-yellow-50"
                    : "border-gray-300 hover:border-yellow-400"
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