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

interface SimulationTask {
  id: string;
  title: string;
  description: string;
  buggyCode: string;
  correctCode: string;
  hint: string;
  timeLimit: number; // seconds
  points: number;
}

// Simulation tasks for each difficulty
const simulationTasks: Record<Difficulty, SimulationTask[]> = {
  easy: [
    {
      id: "sim-e1",
      title: "Fix the Syntax Error",
      description: "The function is missing a semicolon. Add it to make the code work!",
      buggyCode: `function greet(name) {
  return "Hello, " + name
}`,
      correctCode: `function greet(name) {
  return "Hello, " + name;
}`,
      hint: "Look at the return statement - it's missing something at the end",
      timeLimit: 30,
      points: 100,
    },
    {
      id: "sim-e2",
      title: "Complete the Array",
      description: "The array is missing the last element. Add 'drum' to complete it!",
      buggyCode: `const instruments = ["guitar", "piano", "violin"];`,
      correctCode: `const instruments = ["guitar", "piano", "violin", "drum"];`,
      hint: "The array should have 4 elements",
      timeLimit: 30,
      points: 100,
    },
  ],
  medium: [
    {
      id: "sim-m1",
      title: "Fix the Loop",
      description: "This loop has an off-by-one error. Fix the condition to only loop 3 times!",
      buggyCode: `for (let i = 0; i <= 3; i++) {
  console.log(i);
}`,
      correctCode: `for (let i = 0; i < 3; i++) {
  console.log(i);
}`,
      hint: "The loop should print 0, 1, 2 (not 0, 1, 2, 3)",
      timeLimit: 45,
      points: 150,
    },
    {
      id: "sim-m2",
      title: "Fix the Null Check",
      description: "The function crashes when user is null. Add a proper null check!",
      buggyCode: `function getName(user) {
  return user.name.toUpperCase();
}`,
      correctCode: `function getName(user) {
  if (!user) return "Guest";
  return user.name.toUpperCase();
}`,
      hint: "Check if user exists before accessing its properties",
      timeLimit: 45,
      points: 150,
    },
  ],
  hard: [
    {
      id: "sim-h1",
      title: "Fix the Async Function",
      description: "This async function has a Promise issue. Fix it to properly return the user data!",
      buggyCode: `async function fetchUser(id) {
  const response = await fetch('/api/user/' + id);
  const data = response.json();
  return data;
}`,
      correctCode: `async function fetchUser(id) {
  const response = await fetch('/api/user/' + id);
  const data = await response.json();
  return data;
}`,
      hint: "response.json() returns a Promise - you need to await it",
      timeLimit: 60,
      points: 200,
    },
    {
      id: "sim-h2",
      title: "Fix the Memory Leak",
      description: "This code has a closure issue causing memory leak. Fix the event listener handling!",
      buggyCode: `function setupButton() {
  let count = 0;
  button.addEventListener('click', () => {
    count++;
    console.log(count);
  });
}`,
      correctCode: `function setupButton() {
  let count = 0;
  function handleClick() {
    count++;
    console.log(count);
  }
  button.addEventListener('click', handleClick);
  return () => button.removeEventListener('click', handleClick);
}`,
      hint: "You need a way to clean up the event listener, and avoid creating new functions on each call",
      timeLimit: 60,
      points: 200,
    },
  ],
};

export default function ProgrammerSimulation({ difficulty, onComplete, onOpenSettings, onExit }: ProgrammerSimulationProps) {
  const tasks = simulationTasks[difficulty];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentTask = tasks[currentTaskIndex];

  // Initialize with first task
  useEffect(() => {
    if (currentTask) {
      setUserCode(currentTask.buggyCode);
      setHintUsed(false);
      setFeedback(null);
    }
  }, [currentTask]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserCode(e.target.value);
  };

  const handleSubmit = useCallback((manualSubmit = true) => {
    if (!currentTask) return;

    const isCorrect = userCode.trim() === currentTask.correctCode.trim();
    
    if (isCorrect) {
      audioSystem.playSuccessSound();
      let pointsEarned = currentTask.points;
      if (hintUsed) {
        pointsEarned = Math.floor(pointsEarned * 0.5); // 50% penalty for using hint
      }
      
      setTotalScore((prev) => prev + pointsEarned);
      setFeedback("correct");
      
      setTimeout(() => {
        if (currentTaskIndex < tasks.length - 1) {
          setCurrentTaskIndex((prev) => prev + 1);
          setCompletedTasks((prev) => prev + 1);
        } else {
          setShowSuccess(true);
        }
      }, 1500);
    } else {
      audioSystem.playFailureSound();
      setFeedback("incorrect");
      // Allow retry
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  }, [userCode, currentTask, currentTaskIndex, tasks.length, hintUsed]);

  const handleUseHint = () => {
    setHintUsed(true);
  };

  const handleFinish = () => {
    const success = totalScore > 0;
    onComplete(success, totalScore, tasks.length * 200);
  };

  // Keyboard shortcut to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit]);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simulation Complete!</h2>
          <p className="text-gray-600 mb-4">
            You completed all {tasks.length} programming challenges!
          </p>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 mb-6">
            <div className="text-white text-sm">Total Score</div>
            <div className="text-4xl font-bold text-white">{totalScore}</div>
          </div>
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
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
            <h1 className="text-2xl font-bold text-white">💻 Programmer Simulation</h1>
            <p className="text-purple-300">Task {currentTaskIndex + 1} of {tasks.length}</p>
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

        {/* Task Info */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
          <h2 className="text-xl font-bold text-white mb-2">{currentTask.title}</h2>
          <p className="text-purple-200">{currentTask.description}</p>
        </div>

        {/* Code Editor */}
        <div className="bg-gray-900 rounded-xl overflow-hidden mb-4 border border-purple-500/30">
          <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
            <span className="text-gray-400 text-sm">code.js</span>
            <span className="text-gray-500 text-xs">Ctrl+Enter to submit</span>
          </div>
          <textarea
            value={userCode}
            onChange={handleCodeChange}
            className={`w-full h-64 bg-gray-900 text-green-400 font-mono p-4 text-sm resize-none focus:outline-none ${
              feedback === "correct" ? "border-2 border-green-500" :
              feedback === "incorrect" ? "border-2 border-red-500" : ""
            }`}
            spellCheck={false}
          />
        </div>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 mb-4 text-center">
            <span className="text-green-400 font-bold text-lg">✓ Correct! +{currentTask.points} points</span>
          </div>
        )}
        {feedback === "incorrect" && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-4 text-center">
            <span className="text-red-400 font-bold text-lg">✗ Not quite right. Try again! (-5s penalty)</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleUseHint}
            disabled={hintUsed || feedback !== null}
            className={`px-4 py-3 rounded-xl font-bold transition-all ${
              hintUsed 
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-yellow-600 hover:bg-yellow-700 text-white"
            }`}
          >
            💡 Hint (-5s)
          </button>
          
          {hintUsed && !feedback && (
            <div className="flex-1 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-3">
              <span className="text-yellow-300 text-sm">{currentTask.hint}</span>
            </div>
          )}
          
          <button
            onClick={() => handleSubmit(true)}
            disabled={feedback !== null}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✓ Submit Solution
          </button>
        </div>

        {/* Progress */}
        <div className="mt-6 flex gap-2">
          {tasks.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all ${
                idx < currentTaskIndex ? "bg-green-500" :
                idx === currentTaskIndex ? "bg-purple-500" :
                "bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
