"use client";

import { useState, useEffect, useCallback } from "react";
import { Difficulty } from "@/types/game";
import { audioSystem } from "@/lib/audio";

interface EngineerSimulationProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
}

interface Material {
  id: string;
  name: string;
  strength: number;
  cost: number;
  color: string;
}

interface StructureTask {
  id: string;
  title: string;
  description: string;
  requiredLoad: number;
  maxBudget: number;
  availableMaterials: Material[];
  correctSolution: string[];
  timeLimit: number;
  points: number;
}

const engineerTasks: Record<Difficulty, StructureTask[]> = {
  easy: [
    {
      id: "eng-e1",
      title: "Simple Bridge",
      description: "Build a bridge to support 5000 kg. You have $500 budget.",
      requiredLoad: 5000,
      maxBudget: 500,
      availableMaterials: [
        { id: "wood", name: "Wood Plank", strength: 2000, cost: 50, color: "bg-amber-600" },
        { id: "steel", name: "Steel Beam", strength: 6000, cost: 150, color: "bg-gray-500" },
        { id: "concrete", name: "Concrete Block", strength: 8000, cost: 200, color: "bg-gray-400" },
      ],
      correctSolution: ["steel"],
      timeLimit: 45,
      points: 100,
    },
  ],
  medium: [
    {
      id: "eng-m1",
      title: "Two-Support Bridge",
      description: "Build a bridge with 2 supports to hold 8000 kg. Watch your budget!",
      requiredLoad: 8000,
      maxBudget: 600,
      availableMaterials: [
        { id: "wood", name: "Wood Plank", strength: 2000, cost: 50, color: "bg-amber-600" },
        { id: "steel", name: "Steel Beam", strength: 6000, cost: 120, color: "bg-gray-500" },
        { id: "concrete", name: "Concrete Block", strength: 8000, cost: 180, color: "bg-gray-400" },
        { id: "cable", name: "Steel Cable", strength: 3000, cost: 80, color: "bg-slate-400" },
      ],
      correctSolution: ["steel", "steel"],
      timeLimit: 60,
      points: 150,
    },
  ],
  hard: [
    {
      id: "eng-h1",
      title: "Multi-Support Tower",
      description: "Build a tower to support 15000 kg in high winds. Must use at least 3 materials.",
      requiredLoad: 15000,
      maxBudget: 1000,
      availableMaterials: [
        { id: "wood", name: "Wood Plank", strength: 2000, cost: 50, color: "bg-amber-600" },
        { id: "steel", name: "Steel Beam", strength: 6000, cost: 120, color: "bg-gray-500" },
        { id: "concrete", name: "Concrete Block", strength: 8000, cost: 180, color: "bg-gray-400" },
        { id: "cable", name: "Steel Cable", strength: 3000, cost: 80, color: "bg-slate-400" },
        { id: "titanium", name: "Titanium Frame", strength: 12000, cost: 350, color: "bg-slate-600" },
      ],
      correctSolution: ["titanium", "concrete", "steel"],
      timeLimit: 90,
      points: 200,
    },
  ],
};

export default function EngineerSimulation({ difficulty, onComplete }: EngineerSimulationProps) {
  const tasks = engineerTasks[difficulty];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentTask = tasks[currentTaskIndex];

  // Initialize
  useEffect(() => {
    if (currentTask) {
      setSelectedMaterials([]);
      setTimeLeft(currentTask.timeLimit);
      setFeedback(null);
    }
  }, [currentTask]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || feedback === "correct") return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, feedback]);

  const addMaterial = (materialId: string) => {
    const material = currentTask.availableMaterials.find(m => m.id === materialId);
    if (!material) return;
    
    const totalCost = selectedMaterials.reduce((sum, id) => {
      const m = currentTask.availableMaterials.find(am => am.id === id);
      return sum + (m?.cost || 0);
    }, 0);
    
    if (totalCost + material.cost <= currentTask.maxBudget) {
      setSelectedMaterials([...selectedMaterials, materialId]);
    }
  };

  const removeMaterial = (index: number) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index));
  };

  const calculateTotalStrength = () => {
    return selectedMaterials.reduce((sum, id) => {
      const material = currentTask.availableMaterials.find(m => m.id === id);
      return sum + (material?.strength || 0);
    }, 0);
  };

  const calculateTotalCost = () => {
    return selectedMaterials.reduce((sum, id) => {
      const material = currentTask.availableMaterials.find(m => m.id === id);
      return sum + (material?.cost || 0);
    }, 0);
  };

  const handleSubmit = useCallback(() => {
    if (!currentTask) return;

    const totalStrength = calculateTotalStrength();
    const totalCost = calculateTotalCost();
    
    const isCorrect = totalStrength >= currentTask.requiredLoad && 
                      totalCost <= currentTask.maxBudget &&
                      selectedMaterials.length >= 1;

    if (isCorrect) {
      audioSystem.playSuccessSound();
      let pointsEarned = currentTask.points;
      
      // Bonus for under budget
      const budgetSavings = currentTask.maxBudget - totalCost;
      const budgetBonus = Math.floor(budgetSavings / 10);
      pointsEarned += budgetBonus;
      
      // Time bonus
      const timeBonus = Math.floor((timeLeft / currentTask.timeLimit) * 20);
      pointsEarned += timeBonus;
      
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
      setTimeout(() => {
        setTimeLeft((prev) => Math.max(0, prev - 10));
      }, 1500);
    }
  }, [currentTask, selectedMaterials, timeLeft, currentTaskIndex, tasks.length]);

  const handleFinish = () => {
    const success = totalScore > 0;
    onComplete(success, totalScore, tasks.length * 200);
  };

  const totalStrength = calculateTotalStrength();
  const totalCost = calculateTotalCost();

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-700 via-orange-600 to-yellow-500 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Engineering Complete!</h2>
          <p className="text-gray-600 mb-4">
            You designed safe, cost-effective structures!
          </p>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 mb-6">
            <div className="text-white text-sm">Total Score</div>
            <div className="text-4xl font-bold text-white">{totalScore}</div>
          </div>
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-700 via-orange-600 to-yellow-500 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🏗️ Engineer Simulation</h1>
            <p className="text-amber-200">Task {currentTaskIndex + 1} of {tasks.length}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{totalScore} pts</div>
            <div className={`text-lg ${timeLeft <= 15 ? "text-red-300 animate-pulse" : "text-green-300"}`}>
              ⏱️ {timeLeft}s
            </div>
          </div>
        </div>

        {/* Task Info */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
          <h2 className="text-xl font-bold text-white mb-2">{currentTask.title}</h2>
          <p className="text-amber-100">{currentTask.description}</p>
          <div className="mt-3 flex gap-6 text-sm">
            <div className="text-white">
              <span className="font-bold">Required Load:</span> {currentTask.requiredLoad} kg
            </div>
            <div className="text-white">
              <span className="font-bold">Budget:</span> ${currentTask.maxBudget}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Materials Selection */}
          <div>
            <h3 className="text-white font-bold mb-3">🔧 Available Materials</h3>
            <div className="space-y-2">
              {currentTask.availableMaterials.map((material) => (
                <button
                  key={material.id}
                  onClick={() => addMaterial(material.id)}
                  className={`w-full ${material.color} hover:opacity-80 rounded-lg p-3 text-left transition-all flex justify-between items-center`}
                >
                  <div>
                    <div className="font-bold text-white">{material.name}</div>
                    <div className="text-white/80 text-sm">Strength: {material.strength} kg</div>
                  </div>
                  <div className="text-white font-bold">${material.cost}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Your Design */}
          <div>
            <h3 className="text-white font-bold mb-3">📐 Your Design</h3>
            <div className="bg-gray-900/50 rounded-lg p-4 min-h-[200px]">
              {selectedMaterials.length === 0 ? (
                <div className="text-white/50 text-center py-8">
                  Click materials to add them to your design
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedMaterials.map((materialId, index) => {
                    const material = currentTask.availableMaterials.find(m => m.id === materialId);
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white/10 rounded-lg p-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded ${material?.color}`}></span>
                          <span className="text-white">{material?.name}</span>
                        </div>
                        <button
                          onClick={() => removeMaterial(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-white/70 text-sm">Total Strength</div>
            <div className={`text-2xl font-bold ${totalStrength >= currentTask.requiredLoad ? "text-green-400" : "text-red-400"}`}>
              {totalStrength} kg {totalStrength >= currentTask.requiredLoad ? "✓" : "✗"}
            </div>
            <div className="text-white/50 text-xs">Need: {currentTask.requiredLoad} kg</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-white/70 text-sm">Total Cost</div>
            <div className={`text-2xl font-bold ${totalCost <= currentTask.maxBudget ? "text-green-400" : "text-red-400"}`}>
              ${totalCost} {totalCost <= currentTask.maxBudget ? "✓" : "✗"}
            </div>
            <div className="text-white/50 text-xs">Budget: ${currentTask.maxBudget}</div>
          </div>
        </div>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 mt-4 text-center">
            <span className="text-green-300 font-bold text-lg">✓ Excellent design!</span>
          </div>
        )}
        {feedback === "incorrect" && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mt-4 text-center">
            <span className="text-red-300 font-bold text-lg">✗ Design doesn't meet requirements. Try again!</span>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={feedback !== null || selectedMaterials.length === 0}
          className="w-full py-3 mt-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✓ Submit Design
        </button>

        {/* Progress */}
        <div className="mt-6 flex gap-2">
          {tasks.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all ${
                idx < currentTaskIndex ? "bg-green-500" :
                idx === currentTaskIndex ? "bg-white" :
                "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
