"use client";

import { useState, useMemo } from "react";
import { Difficulty } from "@/types/game";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface ChefWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
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
      scenario: "You're preparing a dish and realize you're out of salt.",
      question: "What's the best substitute?",
      options: [
        { id: "a", text: "Soy sauce (for savory dishes)", correct: true, explanation: "Soy sauce adds saltiness plus umami flavor." },
        { id: "b", text: "Sugar", correct: false, explanation: "Sugar is sweet, not salty, and won't provide the needed flavor." },
        { id: "c", text: "Nothing, serve it bland", correct: false, explanation: "Proper seasoning is essential to good cooking." },
      ],
    },
    {
      id: "e2",
      scenario: "A customer has a peanut allergy.",
      question: "What's your responsibility?",
      options: [
        { id: "a", text: "Use separate equipment and check all ingredients", correct: true, explanation: "Cross-contamination can be life-threatening for allergy sufferers." },
        { id: "b", text: "Just avoid peanuts in their dish", correct: false, explanation: "Cross-contamination from shared equipment can still cause reactions." },
        { id: "c", text: "Tell them to order something else", correct: false, explanation: "Chefs should accommodate allergies safely when possible." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "You have 5 orders: steak (12 min), pasta (8 min), salad (3 min), soup (5 min), fish (10 min).",
      question: "What order do you start cooking to serve all together?",
      options: [
        { id: "a", text: "Steak → Fish → Pasta → Soup → Salad", correct: true, explanation: "Start longest items first so everything finishes together." },
        { id: "b", text: "Salad → Soup → Pasta → Fish → Steak", correct: false, explanation: "Salad would be wilted by the time steak is done." },
        { id: "c", text: "Cook everything at once", correct: false, explanation: "Limited space and attention make this impractical." },
      ],
    },
    {
      id: "m2",
      scenario: "Your sous chef accidentally added too much salt to a sauce.",
      question: "How do you fix it?",
      options: [
        { id: "a", text: "Add acid (lemon/vinegar) and dilute with unsalted liquid", correct: true, explanation: "Acid balances salt, and dilution reduces concentration." },
        { id: "b", text: "Add sugar to balance it", correct: false, explanation: "Sugar makes it sweet-salty, doesn't reduce saltiness." },
        { id: "c", text: "Throw it out and start over", correct: false, explanation: "Wasteful when the sauce can be saved." },
      ],
    },
    {
      id: "m3",
      scenario: "A dish came back because it's undercooked.",
      question: "What's the professional response?",
      options: [
        { id: "a", text: "Apologize, recook properly, and check quality control", correct: true, explanation: "Take responsibility and ensure it doesn't happen again." },
        { id: "b", text: "Blame the server for not checking", correct: false, explanation: "The kitchen is responsible for food quality." },
        { id: "c", text: "Microwave it quickly and send it back", correct: false, explanation: "This compromises quality and doesn't address the issue." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "During dinner rush, your walk-in cooler breaks down.",
      question: "What's your immediate priority?",
      options: [
        { id: "a", text: "Move perishables to backup cooling, assess what's salvageable", correct: true, explanation: "Food safety is paramount; prevent spoilage and waste." },
        { id: "b", text: "Keep cooking and deal with it after service", correct: false, explanation: "Perishables will spoil, creating health hazards and waste." },
        { id: "c", text: "Close the restaurant immediately", correct: false, explanation: "You can continue service while managing the cooling issue." },
      ],
    },
    {
      id: "h2",
      scenario: "You're creating a tasting menu with 7 courses.",
      question: "What's the proper progression?",
      options: [
        { id: "a", text: "Light → Rich, Cold → Hot, Delicate → Bold flavors", correct: true, explanation: "Proper progression prevents palate fatigue and enhances experience." },
        { id: "b", text: "Serve the best dish first to impress", correct: false, explanation: "Starting too rich overwhelms the palate for later courses." },
        { id: "c", text: "Random order based on cooking times", correct: false, explanation: "Tasting menus require thoughtful flavor progression." },
      ],
    },
    {
      id: "h3",
      scenario: "A food critic is dining anonymously in your restaurant.",
      question: "How should you approach this?",
      options: [
        { id: "a", text: "Maintain consistent high standards for all guests", correct: true, explanation: "Every guest deserves the same quality; consistency is key." },
        { id: "b", text: "Give them special treatment and extra courses", correct: false, explanation: "This isn't representative of normal service and can backfire." },
        { id: "c", text: "Try to identify and avoid serving them", correct: false, explanation: "Critics help you improve; embrace the opportunity." },
      ],
    },
    {
      id: "h4",
      scenario: "Your supplier delivered subpar ingredients for tonight's special.",
      question: "What's the best decision?",
      options: [
        { id: "a", text: "86 the special and offer an alternative with quality ingredients", correct: true, explanation: "Never compromise on ingredient quality; reputation is everything." },
        { id: "b", text: "Use them anyway, customers won't notice", correct: false, explanation: "Quality-conscious diners will notice, damaging your reputation." },
        { id: "c", text: "Charge less for the special", correct: false, explanation: "Lower price doesn't excuse lower quality." },
      ],
    },
  ],
};

export default function ChefWorld({ difficulty, onComplete }: ChefWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  const currentQuestions = questions[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  // Shuffle options for current question
  const shuffledOptions = useMemo(() => {
    return shuffleArray(currentQuestion.options);
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    const selected = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
    if (!selected) return;

    const isCorrect = selected.correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setAnsweredQuestions([...answeredQuestions, isCorrect]);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      const passThreshold = Math.ceil(totalQuestions * 0.6);
      onComplete(newScore >= passThreshold, newScore, totalQuestions);
    }
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👨‍🍳</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Chef - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Scenario:</strong> You&apos;re a professional chef managing {totalQuestions} different 
              kitchen situations. Make the right culinary decisions under pressure.
            </p>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
              <p className="font-semibold text-amber-900">Your Task:</p>
              <p className="text-amber-800">
                Handle {totalQuestions} kitchen challenges. You need {Math.ceil(totalQuestions * 0.6)} correct to pass!
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Difficulty: {difficulty.toUpperCase()}</strong> - 
                {difficulty === "easy" && " Basic cooking decisions"}
                {difficulty === "medium" && " Kitchen management and timing"}
                {difficulty === "hard" && " High-pressure professional scenarios"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setStage("challenge")}
            className="w-full mt-8 bg-amber-600 text-white font-bold py-4 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Enter Kitchen →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              🍳 Challenge {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="text-right">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold text-amber-600">{score}/{currentQuestionIndex}</div>
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
                      ? "bg-amber-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <p className="font-semibold text-amber-900 mb-2">Kitchen Situation:</p>
            <p className="text-amber-800">{currentQuestion.scenario}</p>
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
                    ? "border-amber-600 bg-amber-50"
                    : "border-gray-300 hover:border-amber-400"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
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
            {currentQuestionIndex < totalQuestions - 1 ? "Next Challenge →" : "Submit Final Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
