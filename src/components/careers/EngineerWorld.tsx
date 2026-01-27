"use client";

import { useState } from "react";

interface EngineerWorldProps {
  onComplete: (success: boolean) => void;
}

interface DesignOption {
  id: string;
  name: string;
  cost: number;
  strength: number;
  time: number;
  description: string;
}

export default function EngineerWorld({ onComplete }: EngineerWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);

  const designs: DesignOption[] = [
    {
      id: "design1",
      name: "Budget Steel Frame",
      cost: 50000,
      strength: 60,
      time: 8,
      description: "Basic steel frame design. Meets minimum requirements but limited safety margin.",
    },
    {
      id: "design2",
      name: "Reinforced Concrete",
      cost: 85000,
      strength: 95,
      time: 12,
      description: "Strong and durable. Balances cost, strength, and timeline effectively.",
    },
    {
      id: "design3",
      name: "Premium Composite",
      cost: 150000,
      strength: 100,
      time: 16,
      description: "Cutting-edge materials with maximum strength, but exceeds budget and timeline.",
    },
  ];

  const constraints = {
    maxCost: 100000,
    minStrength: 85,
    maxTime: 14,
  };

  const correctDesign = "design2"; // Only design2 meets all constraints

  const handleSubmit = () => {
    onComplete(selectedDesign === correctDesign);
  };

  const meetsConstraints = (design: DesignOption) => {
    return (
      design.cost <= constraints.maxCost &&
      design.strength >= constraints.minStrength &&
      design.time <= constraints.maxTime
    );
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Civil Engineer
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Scenario:</strong> You&apos;re a civil engineer tasked with designing
              a pedestrian bridge for a new city park. The city council has given you
              specific requirements.
            </p>
            
            <p>
              Engineering is all about balancing constraints—cost, strength, time, 
              and safety. You need to find the optimal solution that meets all requirements.
            </p>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
              <p className="font-semibold text-orange-900">Your Task:</p>
              <p className="text-orange-800">
                Choose a bridge design that satisfies all project constraints while 
                ensuring public safety.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStage("challenge")}
            className="w-full mt-8 bg-orange-600 text-white font-bold py-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Review Designs →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🌉 Bridge Design Selection
          </h3>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-blue-900 mb-2">Project Constraints:</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">Budget:</span>
                <p className="text-blue-800">≤ ${constraints.maxCost.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-semibold">Strength Rating:</span>
                <p className="text-blue-800">≥ {constraints.minStrength}/100</p>
              </div>
              <div>
                <span className="font-semibold">Timeline:</span>
                <p className="text-blue-800">≤ {constraints.maxTime} months</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {designs.map((design) => {
              const isSelected = selectedDesign === design.id;
              const meetsAll = meetsConstraints(design);
              
              return (
                <button
                  key={design.id}
                  onClick={() => setSelectedDesign(design.id)}
                  className={`w-full p-6 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-gray-900">
                      {design.name}
                    </h4>
                    {isSelected && (
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{design.description}</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Cost:</span>
                      <p className={`font-bold ${
                        design.cost <= constraints.maxCost ? "text-green-600" : "text-red-600"
                      }`}>
                        ${design.cost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Strength:</span>
                      <p className={`font-bold ${
                        design.strength >= constraints.minStrength ? "text-green-600" : "text-red-600"
                      }`}>
                        {design.strength}/100
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Timeline:</span>
                      <p className={`font-bold ${
                        design.time <= constraints.maxTime ? "text-green-600" : "text-red-600"
                      }`}>
                        {design.time} months
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedDesign}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Submit Design Choice
          </button>
        </div>
      </div>
    </div>
  );
}
