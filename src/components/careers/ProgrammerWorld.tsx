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

interface ProgrammerWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  isQuickRecall?: boolean;
}

interface Question {
  id: string;
  code: string;
  error: string;
  question: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      code: `function greet(name) {
  return "Hello " + name
}`,
      error: "Missing semicolon",
      question: "What's wrong with this code?",
      options: [
        { id: "a", text: "Missing semicolon after return statement", correct: true, explanation: "While JavaScript has automatic semicolon insertion, it's best practice to include them." },
        { id: "b", text: "Wrong function syntax", correct: false, explanation: "The function syntax is correct." },
        { id: "c", text: "String concatenation is wrong", correct: false, explanation: "The + operator correctly concatenates strings." },
      ],
    },
    {
      id: "e2",
      code: `let count = 0;
for (let i = 0; i <= 5; i++) {
  count = count + 1;
}`,
      error: "None - code works correctly",
      question: "What will be the value of count after this loop?",
      options: [
        { id: "a", text: "5", correct: false, explanation: "The loop runs from 0 to 5 inclusive, which is 6 iterations." },
        { id: "b", text: "6", correct: true, explanation: "The loop runs 6 times (i = 0, 1, 2, 3, 4, 5) because of the <= operator." },
        { id: "c", text: "4", correct: false, explanation: "This would be true if the loop used i < 5." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      code: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
      error: "Cannot read property 'price' of undefined",
      question: "What's causing this error?",
      options: [
        { id: "a", text: "Change <= to < in the loop condition", correct: true, explanation: "The loop goes one index too far (off-by-one error), causing 'undefined' access." },
        { id: "b", text: "Change let to var in the loop", correct: false, explanation: "Variable declaration type doesn't fix the array bounds issue." },
        { id: "c", text: "Add items[i] || 0 to handle undefined", correct: false, explanation: "This masks the symptom but doesn't fix the root cause." },
      ],
    },
    {
      id: "m2",
      code: `function findMax(numbers) {
  let max = 0;
  for (let num of numbers) {
    if (num > max) max = num;
  }
  return max;
}`,
      error: "Returns 0 for arrays with only negative numbers",
      question: "What's the bug in this function?",
      options: [
        { id: "a", text: "Initialize max to numbers[0] instead of 0", correct: true, explanation: "Starting at 0 means negative numbers will never be greater than max." },
        { id: "b", text: "Use >= instead of > in comparison", correct: false, explanation: "This doesn't solve the negative number problem." },
        { id: "c", text: "Use a while loop instead of for...of", correct: false, explanation: "The loop type isn't the issue." },
      ],
    },
    {
      id: "m3",
      code: `function reverseString(str) {
  let reversed = "";
  for (let i = str.length; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}`,
      error: "Returns 'undefined' at the start",
      question: "Why does this add 'undefined' to the result?",
      options: [
        { id: "a", text: "Start i at str.length - 1 instead of str.length", correct: true, explanation: "str.length is one past the last valid index, so str[str.length] is undefined." },
        { id: "b", text: "Use i > 0 instead of i >= 0", correct: false, explanation: "This would skip the first character." },
        { id: "c", text: "Use str.charAt(i) instead of str[i]", correct: false, explanation: "This doesn't fix the index issue." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      code: `function debounce(func, delay) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}`,
      error: "Function loses 'this' context and arguments",
      question: "What's wrong with this debounce implementation?",
      options: [
        { id: "a", text: "Use arrow function and apply() to preserve context", correct: true, explanation: "Need to capture 'this' and 'arguments' and pass them to func.apply()." },
        { id: "b", text: "Use setInterval instead of setTimeout", correct: false, explanation: "setInterval would repeatedly call the function, not debounce it." },
        { id: "c", text: "Clear timeout after calling func", correct: false, explanation: "The timeout should be cleared before setting a new one." },
      ],
    },
    {
      id: "h2",
      code: `async function fetchUsers() {
  const users = [];
  for (let id = 1; id <= 3; id++) {
    users.push(fetch(\`/api/user/\${id}\`));
  }
  return users;
}`,
      error: "Returns promises instead of user data",
      question: "How do you fix this async function?",
      options: [
        { id: "a", text: "Use await with fetch and Promise.all for parallel requests", correct: true, explanation: "Need to await the fetch promises. Use Promise.all(users) for parallel execution." },
        { id: "b", text: "Remove async keyword", correct: false, explanation: "We need async to use await." },
        { id: "c", text: "Use .then() instead of push", correct: false, explanation: "This doesn't solve the promise resolution issue." },
      ],
    },
    {
      id: "h3",
      code: `function memoize(fn) {
  const cache = {};
  return function(arg) {
    if (cache[arg]) return cache[arg];
    const result = fn(arg);
    cache[arg] = result;
    return result;
  };
}`,
      error: "Fails for falsy values like 0 or false",
      question: "What's the subtle bug in this memoization?",
      options: [
        { id: "a", text: "Use 'arg in cache' instead of cache[arg]", correct: true, explanation: "cache[arg] is falsy for 0, false, '', etc. Use 'in' operator to check key existence." },
        { id: "b", text: "Use Map instead of object", correct: false, explanation: "While Map is better, the main issue is the falsy value check." },
        { id: "c", text: "Clear cache after each call", correct: false, explanation: "This defeats the purpose of memoization." },
      ],
    },
    {
      id: "h4",
      code: `class Counter {
  count = 0;
  increment() {
    setTimeout(function() {
      this.count++;
    }, 100);
  }
}`,
      error: "Cannot read property 'count' of undefined",
      question: "Why does this class method fail?",
      options: [
        { id: "a", text: "Use arrow function in setTimeout to preserve 'this'", correct: true, explanation: "Regular functions create their own 'this'. Arrow functions inherit 'this' from enclosing scope." },
        { id: "b", text: "Use var instead of let", correct: false, explanation: "Variable declaration doesn't affect 'this' binding." },
        { id: "c", text: "Call increment with .bind(this)", correct: false, explanation: "The issue is inside increment, not when calling it." },
      ],
    },
  ],
};

// Quick Recall mode - add your own questions here
const quickRecallQuestions: Question[] = [];

export default function ProgrammerWorld({ difficulty, onComplete, isQuickRecall }: ProgrammerWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  const currentQuestions = isQuickRecall ? quickRecallQuestions : questions[difficulty];
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
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // All questions completed
      const passThreshold = Math.ceil(totalQuestions * 0.6); // Need 60% to pass
      onComplete(newScore >= passThreshold, newScore, totalQuestions);
    }
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💻</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Software Programmer - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Scenario:</strong> You&apos;re a developer reviewing code and fixing bugs. 
              Your team needs you to identify and solve {totalQuestions} programming challenges.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="font-semibold text-blue-900">Your Task:</p>
              <p className="text-blue-800">
                Answer {totalQuestions} debugging questions correctly. You need {Math.ceil(totalQuestions * 0.6)} correct to pass!
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Difficulty: {difficulty.toUpperCase()}</strong> - 
                {difficulty === "easy" && " Perfect for beginners"}
                {difficulty === "medium" && " Intermediate challenges"}
                {difficulty === "hard" && " Expert-level problems"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setStage("challenge")}
            className="w-full mt-8 bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Debugging →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              🐛 Question {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="text-right">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold text-blue-600">{score}/{currentQuestionIndex}</div>
            </div>
          </div>

          {/* Progress bar */}
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

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              <strong>Error:</strong> <code className="text-red-600">{currentQuestion.error}</code>
            </p>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
              <pre>{currentQuestion.code}</pre>
            </div>

            <p className="text-lg font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </p>
          </div>

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
            {currentQuestionIndex < totalQuestions - 1 ? "Next Question →" : "Submit Final Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
