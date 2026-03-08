"use client";

import { useState, useEffect, useCallback } from "react";
import { Difficulty } from "@/types/game";
import { audioSystem } from "@/lib/audio";

interface ProgrammerSimulationProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
}

interface BugChallenge {
  id: string;
  title: string;
  description: string;
  codeSnippet: string;
  bugType: "syntax" | "logic" | "algorithm" | "null-check";
  options: {
    id: string;
    code: string;
    correct: boolean;
    explanation: string;
  }[];
  releaseUrgency: number;
}

const bugChallenges: Record<Difficulty, BugChallenge[]> = {
  easy: [
    {
      id: "bug-e1",
      title: "Missing Semicolon",
      description: "The app won't compile! Find the missing semicolon.",
      codeSnippet: `function greetUser(name) {
  return "Hello, " + name
}`,
      bugType: "syntax",
      releaseUrgency: 3,
      options: [
        { id: "a", code: 'return "Hello, " + name;', correct: true, explanation: "Added missing semicolon" },
        { id: "b", code: 'return "Hello, " + name', correct: false, explanation: "Still missing semicolon" },
        { id: "c", code: 'return "Hello, " + name!!', correct: false, explanation: "Syntax error with !!" },
      ],
    },
    {
      id: "bug-e2",
      title: "Array Index Error",
      description: "This loop is running one too many times. Fix it!",
      codeSnippet: `const fruits = ["apple", "banana", "cherry"];
for (let i = 0; i <= 3; i++) {
  console.log(fruits[i]);
}`,
      bugType: "logic",
      releaseUrgency: 4,
      options: [
        { id: "a", code: "i < 3", correct: true, explanation: "Changed to < 3 to get indices 0,1,2" },
        { id: "b", code: "i <= 2", correct: false, explanation: "Would work but less clean" },
        { id: "c", code: "i < 4", correct: false, explanation: "Would cause index out of bounds" },
      ],
    },
    {
      id: "bug-e3",
      title: "Type Error",
      description: "The user name is showing as 'undefined'. Fix it!",
      codeSnippet: `function getUserName(user) {
  return user.name.toUpperCase();
}`,
      bugType: "null-check",
      releaseUrgency: 5,
      options: [
        { id: "a", code: `if (!user) return "Guest";
return user.name.toUpperCase();`, correct: true, explanation: "Added null check!" },
        { id: "b", code: "return user?.name.toUpperCase();", correct: false, explanation: "Optional chaining is ES2020+" },
        { id: "c", code: "return user.name", correct: false, explanation: "Still crashes on null" },
      ],
    },
    {
      id: "bug-e4",
      title: "Wrong Operator",
      description: "This should count to 5, not 4. Fix the loop!",
      codeSnippet: `for (let i = 1; i < 5; i++) {
  console.log(i);
}`,
      bugType: "logic",
      releaseUrgency: 3,
      options: [
        { id: "a", code: "i <= 5", correct: true, explanation: "Now counts 1,2,3,4,5" },
        { id: "b", code: "i < 6", correct: false, explanation: "Would count to 5 but not optimal" },
        { id: "c", code: "i = 5", correct: false, explanation: "Would cause infinite loop!" },
      ],
    },
  ],
  medium: [
    {
      id: "bug-m1",
      title: "Async Promise Bug",
      description: "The user data isn't loading. Fix the async function!",
      codeSnippet: `async function fetchUser(id) {
  const response = await fetch('/api/user/' + id);
  const data = response.json();
  return data;
}`,
      bugType: "logic",
      releaseUrgency: 6,
      options: [
        { id: "a", code: "const data = await response.json();", correct: true, explanation: "response.json() returns a Promise!" },
        { id: "b", code: "const data = response.json();", correct: false, explanation: "Missing await - returns Promise object" },
        { id: "c", code: "const data = JSON.parse(response);", correct: false, explanation: "Response doesn't have parse method" },
      ],
    },
    {
      id: "bug-m2",
      title: "Memory Leak",
      description: "This button keeps adding listeners. Fix the memory leak!",
      codeSnippet: `function setupButton() {
  const count = 0;
  button.addEventListener('click', () => {
    count++;
    console.log(count);
  });
}`,
      bugType: "logic",
      releaseUrgency: 7,
      options: [
        { id: "a", code: `let count = 0;
function handleClick() { count++; }
button.addEventListener('click', handleClick);
return () => button.removeEventListener('click', handleClick);`, correct: true, explanation: "Named function with cleanup!" },
        { id: "b", code: `let count = 0;
button.onclick = () => { count++; };`, correct: false, explanation: "Still adds new listener each call" },
        { id: "c", code: `let count = 0;
const handler = () => { count++; };
button.addEventListener('click', handler);`, correct: false, explanation: "Still leaks - no cleanup returned" },
      ],
    },
    {
      id: "bug-m3",
      title: "Wrong Comparison",
      description: "The login is broken - it accepts wrong passwords!",
      codeSnippet: `function checkPassword(input, correct) {
  return input == correct;
}`,
      bugType: "logic",
      releaseUrgency: 8,
      options: [
        { id: "a", code: "return input === correct;", correct: true, explanation: "Strict equality prevents type coercion" },
        { id: "b", code: "return input === correct.toString();", correct: false, explanation: "Still uses ==" },
        { id: "c", code: "return input !== correct;", correct: false, explanation: "Inverts the logic!" },
      ],
    },
    {
      id: "bug-m4",
      title: "Array Mutation",
      description: "This is unexpectedly modifying the original array!",
      codeSnippet: `function sortNames(names) {
  return names.sort();
}`,
      bugType: "algorithm",
      releaseUrgency: 6,
      options: [
        { id: "a", code: "return [...names].sort();", correct: true, explanation: "Spread creates a copy first!" },
        { id: "b", code: "return names.slice().sort();", correct: false, explanation: "Also works - slice() creates copy" },
        { id: "c", code: "return Array.from(names).sort();", correct: false, explanation: "Works but longer syntax" },
      ],
    },
  ],
  hard: [
    {
      id: "bug-h1",
      title: "Race Condition",
      description: "Users are getting each other's data! Fix the race condition.",
      codeSnippet: `async function loadUserData(userId) {
  const user = await fetchUser(userId);
  const posts = await fetchPosts(userId);
  const profile = await fetchProfile(userId);
  return { user, posts, profile };
}`,
      bugType: "logic",
      releaseUrgency: 9,
      options: [
        { id: "a", code: `const [user, posts, profile] = await Promise.all([
  fetchUser(userId),
  fetchPosts(userId),
  fetchProfile(userId)
]);`, correct: true, explanation: "Promise.all runs in parallel!" },
        { id: "b", code: `const user = await fetchUser(userId);
const posts = await fetchPosts(userId);
const profile = await fetchProfile(userId);`, correct: false, explanation: "Sequential - too slow, race possible" },
        { id: "c", code: "return Promise.all([fetchUser, fetchPosts, fetchProfile])(userId);", correct: false, explanation: "Invalid syntax" },
      ],
    },
    {
      id: "bug-h2",
      title: "Closure Loop",
      description: "All buttons show the same number! Fix the classic closure bug.",
      codeSnippet: `function createButtons() {
  for (var i = 0; i < 5; i++) {
    button = document.createElement('button');
    button.onclick = function() { alert(i); };
    container.appendChild(button);
  }
}`,
      bugType: "logic",
      releaseUrgency: 8,
      options: [
        { id: "a", code: "for (let i = 0; i < 5; i++) {", correct: true, explanation: "let creates block scope!" },
        { id: "b", code: "for (var i = 0; i < 5; i++) { (function(i) {", correct: true, explanation: "IIFE creates closure scope" },
        { id: "c", code: "button.onclick = alert.bind(null, i);", correct: false, explanation: "bind also captures same var value" },
      ],
    },
    {
      id: "bug-h3",
      title: "Infinite Loop",
      description: "This API endpoint is hanging the server! Fix it.",
      codeSnippet: `async function processItems(items) {
  while (items.length > 0) {
    const item = items.pop();
    await processItem(item);
  }
}`,
      bugType: "logic",
      releaseUrgency: 10,
      options: [
        { id: "a", code: "for (const item of [...items]) { await processItem(item); }", correct: true, explanation: "Iterate over a copy!" },
        { id: "b", code: "for (let i = 0; i < items.length; i++) { await processItem(items[i]); }", correct: true, explanation: "Index-based iteration" },
        { id: "c", code: "items.forEach(async (item) => await processItem(item));", correct: false, explanation: "forEach doesn't await async callbacks!" },
      ],
    },
    {
      id: "bug-h4",
      title: "Security Vulnerability",
      description: "This login is vulnerable to SQL injection!",
      codeSnippet: `function loginUser(username, password) {
  const query = "SELECT * FROM users WHERE user = '" + username + "'";
  return database.query(query);
}`,
      bugType: "logic",
      releaseUrgency: 10,
      options: [
        { id: "a", code: `const query = "SELECT * FROM users WHERE user = ?";
return database.query(query, [username]);`, correct: true, explanation: "Parameterized query prevents injection!" },
        { id: "b", code: "const query = 'SELECT * FROM users WHERE user = ' + username;", correct: false, explanation: "Still vulnerable!" },
        { id: "c", code: "return database.query('SELECT * FROM users', { username });", correct: false, explanation: "Not valid syntax" },
      ],
    },
  ],
};

const bugTypeColors: Record<string, string> = {
  syntax: "bg-blue-500",
  logic: "bg-purple-500",
  algorithm: "bg-green-500",
  "null-check": "bg-red-500",
};

export default function ProgrammerSimulation({ difficulty, onComplete, onOpenSettings, onExit }: ProgrammerSimulationProps) {
  const challenges = bugChallenges[difficulty];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [releaseProgress, setReleaseProgress] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  const currentChallenge = challenges[currentIndex];

  // Fade in animation
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Simulate release deadline progress
  useEffect(() => {
    const interval = setInterval(() => {
      setReleaseProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1.5;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleSelectOption = (optionId: string) => {
    if (showExplanation) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = useCallback(() => {
    if (!selectedOption || !currentChallenge) return;

    const selected = currentChallenge.options.find((o) => o.id === selectedOption);
    if (!selected) return;

    if (selected.correct) {
      audioSystem.playSuccessSound();
      const basePoints = difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 200;
      const urgencyBonus = Math.floor(currentChallenge.releaseUrgency * 5);
      setTotalScore((prev) => prev + basePoints + urgencyBonus);
      setCorrectCount((prev) => prev + 1);
      setFeedback("correct");
    } else {
      audioSystem.playFailureSound();
      setFeedback("incorrect");
    }

    setShowExplanation(true);

    setTimeout(() => {
      if (currentIndex < challenges.length - 1) {
        setFadeIn(false);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setShowExplanation(false);
          setFeedback(null);
          setFadeIn(true);
        }, 300);
      } else {
        setShowSuccess(true);
      }
    }, 2000);
  }, [selectedOption, currentChallenge, currentIndex, challenges.length, difficulty]);

  const handleFinish = () => {
    const success = correctCount >= challenges.length * 0.5;
    const maxScore = challenges.length * 250;
    onComplete(success, totalScore, maxScore);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform scale-100 animate-bounce">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Release Ready!</h2>
          <p className="text-gray-600 mb-4">
            You fixed {correctCount} of {challenges.length} bugs before launch!
          </p>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 mb-6">
            <div className="text-white text-sm">Total Score</div>
            <div className="text-4xl font-bold text-white">{totalScore}</div>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            {correctCount >= challenges.length * 0.75 ? "🌟 Excellent work! Ship it!" :
             correctCount >= challenges.length * 0.5 ? "👍 Good enough for launch!" :
             "⚠️ Hotfix needed after release..."}
          </div>
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white font-mono">💻 Bug Fix Sprint</h1>
            <p className="text-purple-300 font-mono">Fix {currentIndex + 1} of {challenges.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-white">{totalScore} pts</div>
            <button
              onClick={onExit}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-colors border border-red-500/30"
            >
              🚪 Exit
            </button>
          </div>
        </div>

        {/* Release Progress Bar */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">🚀 Release Deadline</span>
            <span className={`text-sm font-bold animate-pulse ${
              releaseProgress > 80 ? "text-red-400" : releaseProgress > 50 ? "text-yellow-400" : "text-green-400"
            }`}>
              {releaseProgress < 30 ? "💤 Calm" : releaseProgress < 60 ? "⚡ Getting Busy" : releaseProgress < 80 ? "🔥 Almost Time!" : "😱 SHIP NOW!"}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                releaseProgress > 80 ? "bg-red-500" : releaseProgress > 50 ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${releaseProgress}%` }}
            />
          </div>
        </div>

        {/* Challenge Card */}
        <div className={`transition-all duration-300 transform ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl animate-bounce">
                {currentChallenge.bugType === "syntax" ? "📝" :
                 currentChallenge.bugType === "logic" ? "🧠" :
                 currentChallenge.bugType === "algorithm" ? "📊" : "🔒"}
              </span>
              <div>
                <h2 className="text-xl font-bold text-white">{currentChallenge.title}</h2>
                <p className="text-purple-200">{currentChallenge.description}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <span className={`px-3 py-1 ${bugTypeColors[currentChallenge.bugType]} text-white text-xs rounded-full font-bold`}>
                {currentChallenge.bugType === "syntax" ? "Syntax" :
                 currentChallenge.bugType === "logic" ? "Logic" :
                 currentChallenge.bugType === "algorithm" ? "Algorithm" : "Null Check"}
              </span>
              <span className="px-3 py-1 bg-gray-600 text-white text-xs rounded-full">
                Urgency: {currentChallenge.releaseUrgency}/10
              </span>
            </div>
          </div>

          {/* Code Display */}
          <div className="bg-gray-900 rounded-xl overflow-hidden mb-4 border border-purple-500/30 shadow-lg">
            <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
              <span className="text-gray-400 text-sm">📄 code.js</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <pre className="p-4 text-green-400 font-mono text-sm overflow-x-auto">
              {currentChallenge.codeSnippet}
            </pre>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-4">
            {currentChallenge.options.map((option, idx) => {
              const isSelected = selectedOption === option.id;
              let borderColor = "border-gray-600 bg-gray-800/50";
              
              if (showExplanation) {
                if (option.correct) {
                  borderColor = "border-green-500 bg-green-900/30 shadow-lg shadow-green-500/20";
                } else if (isSelected) {
                  borderColor = "border-red-500 bg-red-900/30";
                }
              } else if (isSelected) {
                borderColor = "border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 ${borderColor} hover:opacity-80 transition-all duration-200 transform hover:scale-[1.01]`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-lg font-bold w-8 h-8 flex items-center justify-center rounded-lg ${
                      isSelected ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"
                    }`}>
                      {option.id.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{option.code}</pre>
                      {showExplanation && (
                        <div className={`mt-3 text-sm ${option.correct ? "text-green-400" : "text-red-400"}`}>
                          <span className="font-bold">{option.correct ? "✓ Correct!" : "✗ Not quite"}</span>
                          <span className="ml-2">- {option.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedOption || showExplanation}
            className={`w-full py-4 text-white font-bold rounded-xl transition-all duration-300 transform ${
              !selectedOption || showExplanation
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] shadow-lg shadow-purple-500/25"
            }`}
          >
            {showExplanation ? (
              feedback === "correct" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-bounce">✓</span> Fixed! +{difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 200} pts
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>✗</span> Not Quite...
                </span>
              )
            ) : (
              "✓ Submit Fix"
            )}
          </button>

          {/* Progress */}
          <div className="mt-6 flex gap-2">
            {challenges.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  idx < currentIndex ? "bg-green-500" :
                  idx === currentIndex ? "bg-purple-500 shadow-lg shadow-purple-500/50" :
                  "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
