"use client";

import { useState } from "react";

interface ProgrammerWorldProps {
  onComplete: (success: boolean) => void;
}

export default function ProgrammerWorld({ onComplete }: ProgrammerWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [selectedFix, setSelectedFix] = useState<string | null>(null);

  const buggyCode = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

  const fixes = [
    {
      id: "fix1",
      description: "Change <= to < in the loop condition",
      correct: true,
      explanation: "The loop goes one index too far (off-by-one error), causing 'undefined' access.",
    },
    {
      id: "fix2",
      description: "Change let to var in the loop",
      correct: false,
      explanation: "Variable declaration type doesn't fix the array bounds issue.",
    },
    {
      id: "fix3",
      description: "Add items[i] || 0 to handle undefined",
      correct: false,
      explanation: "This masks the symptom but doesn't fix the root cause (wrong loop boundary).",
    },
  ];

  const handleSubmit = () => {
    const selected = fixes.find((f) => f.id === selectedFix);
    if (selected) {
      onComplete(selected.correct);
    }
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💻</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Software Programmer
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Scenario:</strong> You&apos;re a junior developer at a tech startup.
              A critical bug has been reported in the checkout system—customers can&apos;t
              complete purchases!
            </p>
            
            <p>
              Your senior developer has narrowed it down to the <code className="bg-gray-100 px-2 py-1 rounded">calculateTotal</code> function.
              The function crashes when calculating the shopping cart total.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="font-semibold text-blue-900">Your Task:</p>
              <p className="text-blue-800">
                Debug the code and identify the correct fix to get the checkout working again.
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
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🐛 Debug the Code
          </h3>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              <strong>Error:</strong> <code className="text-red-600">Cannot read property &apos;price&apos; of undefined</code>
            </p>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{buggyCode}</pre>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3">
              Select the correct fix:
            </h4>
            
            <div className="space-y-3">
              {fixes.map((fix) => (
                <label
                  key={fix.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedFix === fix.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="fix"
                    value={fix.id}
                    checked={selectedFix === fix.id}
                    onChange={(e) => setSelectedFix(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-800">{fix.description}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedFix}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Submit Fix
          </button>
        </div>
      </div>
    </div>
  );
}
