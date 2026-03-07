"use client";

import { useState, useEffect, useCallback } from "react";
import { Difficulty } from "@/types/game";
import { audioSystem } from "@/lib/audio";

interface EngineerSimulationProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
}

interface Material {
  id: string;
  name: string;
  strength: number;
  cost: number;
  color: string;
  emoji: string;
}

interface BridgePart {
  id: string;
  type: "deck" | "support" | "cable";
  materialId: string;
  x: number;
  y: number;
}

interface BridgeTask {
  id: string;
  title: string;
  description: string;
  riverWidth: number;
  requiredLoad: number;
  maxBudget: number;
  availableMaterials: Material[];
  testVehicles: { name: string; weight: number }[];
  points: number;
}

const bridgeTasks: Record<Difficulty, BridgeTask[]> = {
  easy: [
    {
      id: "bridge-e1",
      title: "Small Creek Crossing",
      description: "Build a footbridge for pedestrians over a small creek.",
      riverWidth: 3,
      requiredLoad: 1000,
      maxBudget: 500,
      availableMaterials: [
        { id: "wood", name: "Wood Planks", strength: 500, cost: 50, color: "bg-amber-600", emoji: "🪵" },
        { id: "rope", name: "Rope", strength: 200, cost: 20, color: "bg-yellow-700", emoji: "🪢" },
        { id: "steel", name: "Steel Cable", strength: 800, cost: 100, color: "bg-gray-500", emoji: "⛓️" },
      ],
      testVehicles: [
        { name: "Pedestrian", weight: 80 },
        { name: "Runner", weight: 100 },
        { name: "Cyclist", weight: 150 },
      ],
      points: 100,
    },
  ],
  medium: [
    {
      id: "bridge-m1",
      title: "Town River Bridge",
      description: "Build a bridge to connect two parts of town across the river.",
      riverWidth: 5,
      requiredLoad: 8000,
      maxBudget: 1200,
      availableMaterials: [
        { id: "wood", name: "Hardwood", strength: 1500, cost: 100, color: "bg-amber-700", emoji: "🪵" },
        { id: "steel", name: "Steel Beams", strength: 4000, cost: 200, color: "bg-gray-500", emoji: "🔩" },
        { id: "concrete", name: "Concrete", strength: 6000, cost: 300, color: "bg-gray-400", emoji: "🧱" },
        { id: "cable", name: "Steel Cables", strength: 2500, cost: 150, emoji: "⛓️", color: "bg-slate-500" },
      ],
      testVehicles: [
        { name: "Car", weight: 1500 },
        { name: "SUV", weight: 2500 },
        { name: "Delivery Truck", weight: 5000 },
      ],
      points: 150,
    },
  ],
  hard: [
    {
      id: "bridge-h1",
      title: "Highway Overpass",
      description: "Build a major highway bridge to support heavy traffic.",
      riverWidth: 7,
      requiredLoad: 20000,
      maxBudget: 2500,
      availableMaterials: [
        { id: "steel", name: "Steel I-Beams", strength: 6000, cost: 300, color: "bg-gray-600", emoji: "🔩" },
        { id: "concrete", name: "Reinforced Concrete", strength: 10000, cost: 500, color: "bg-gray-400", emoji: "🧱" },
        { id: "prestress", name: "Prestressed Concrete", strength: 15000, cost: 700, color: "bg-slate-600", emoji: "🏗️" },
        { id: "cable", name: "Suspension Cables", strength: 8000, cost: 400, color: "bg-slate-500", emoji: "⛓️" },
        { id: "titanium", name: "Titanium Alloy", strength: 20000, cost: 1000, color: "bg-slate-700", emoji: "⚙️" },
      ],
      testVehicles: [
        { name: "Sedan", weight: 1800 },
        { name: "Semi Truck", weight: 15000 },
        { name: "Heavy Crane", weight: 20000 },
      ],
      points: 200,
    },
  ],
};

export default function EngineerSimulation({ difficulty, onComplete, onOpenSettings, onExit }: EngineerSimulationProps) {
  const tasks = bridgeTasks[difficulty];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [bridgeParts, setBridgeParts] = useState<BridgePart[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [testPhase, setTestPhase] = useState<"building" | "testing" | "complete">("building");
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [vehicleProgress, setVehicleProgress] = useState(0);
  const [testResult, setTestResult] = useState<"pass" | "fail" | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  const currentTask = tasks[currentTaskIndex];

  const calculateTotalStrength = () => {
    return bridgeParts.reduce((sum, part) => {
      const material = currentTask.availableMaterials.find(m => m.id === part.materialId);
      return sum + (material?.strength || 0);
    }, 0);
  };

  const calculateTotalCost = () => {
    return bridgeParts.reduce((sum, part) => {
      const material = currentTask.availableMaterials.find(m => m.id === part.materialId);
      return sum + (material?.cost || 0);
    }, 0);
  };

  const addDeck = (x: number) => {
    if (!selectedMaterial) {
      setFeedback("Select a material first!");
      return;
    }
    const cost = calculateTotalCost() + (currentTask.availableMaterials.find(m => m.id === selectedMaterial)?.cost || 0);
    if (cost > currentTask.maxBudget) {
      setFeedback("Over budget!");
      return;
    }
    
    const newPart: BridgePart = {
      id: `deck-${Date.now()}`,
      type: "deck",
      materialId: selectedMaterial,
      x,
      y: 0,
    };
    setBridgeParts([...bridgeParts, newPart]);
    setFeedback("");
  };

  const addSupport = (x: number) => {
    if (!selectedMaterial) {
      setFeedback("Select a material first!");
      return;
    }
    const cost = calculateTotalCost() + (currentTask.availableMaterials.find(m => m.id === selectedMaterial)?.cost || 0);
    if (cost > currentTask.maxBudget) {
      setFeedback("Over budget!");
      return;
    }
    
    const newPart: BridgePart = {
      id: `support-${Date.now()}`,
      type: "support",
      materialId: selectedMaterial,
      x,
      y: 0,
    };
    setBridgeParts([...bridgeParts, newPart]);
    setFeedback("");
  };

  const clearBridge = () => {
    setBridgeParts([]);
    setFeedback("");
  };

  const startTest = () => {
    if (bridgeParts.length < currentTask.riverWidth) {
      setFeedback(`Build at least ${currentTask.riverWidth} deck sections!`);
      return;
    }
    const strength = calculateTotalStrength();
    if (strength < currentTask.requiredLoad) {
      setFeedback(`Bridge too weak! Need ${currentTask.requiredLoad}kg strength.`);
      return;
    }
    setTestPhase("testing");
    setCurrentVehicleIndex(0);
    setVehicleProgress(0);
    setTestResult(null);
  };

  // Vehicle crossing simulation
  useEffect(() => {
    if (testPhase !== "testing") return;

    const vehicle = currentTask.testVehicles[currentVehicleIndex];
    if (!vehicle) return;

    const strength = calculateTotalStrength();
    const bridgeEfficiency = strength / currentTask.requiredLoad;
    const vehicleStress = vehicle.weight / strength;

    const timer = setInterval(() => {
      setVehicleProgress((prev) => {
        if (prev >= 100) {
          // Vehicle reached other side
          if (vehicleStress > 1 || bridgeEfficiency < 1.2) {
            // Bridge fails
            setTestResult("fail");
            audioSystem.playFailureSound();
            setTimeout(() => {
              if (currentVehicleIndex < currentTask.testVehicles.length - 1) {
                setCurrentVehicleIndex((prev) => prev + 1);
                setVehicleProgress(0);
                setTestResult(null);
              } else {
                setTestPhase("complete");
              }
            }, 1500);
          } else {
            // Vehicle passes
            if (currentVehicleIndex === currentTask.testVehicles.length - 1) {
              // All vehicles passed
              setTestResult("pass");
              audioSystem.playSuccessSound();
              
              // Calculate score
              const budgetUsed = calculateTotalCost();
              const budgetBonus = Math.floor((currentTask.maxBudget - budgetUsed) / 10);
              const vehicleBonus = currentTask.testVehicles.length * 20;
              const score = currentTask.points + budgetBonus + vehicleBonus;
              setTotalScore(score);
              
              setTimeout(() => {
                setShowSuccess(true);
              }, 1500);
            } else {
              setCurrentVehicleIndex((prev) => prev + 1);
              setVehicleProgress(0);
            }
          }
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [testPhase, currentVehicleIndex, currentTask, bridgeParts]);

  const handleFinish = () => {
    const success = testResult === "pass";
    onComplete(success, totalScore, currentTask.points + 300);
  };

  const totalCost = calculateTotalCost();
  const totalStrength = calculateTotalStrength();
  const currentVehicle = currentTask.testVehicles[currentVehicleIndex];

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-700 via-orange-600 to-yellow-500 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🌉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Bridge Complete!</h2>
          <p className="text-gray-600 mb-4">
            Your bridge passed all stress tests!
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

  if (testPhase === "testing" || testPhase === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-700 via-orange-600 to-yellow-500 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">🌉 Bridge Stress Test</h1>
              <p className="text-amber-200">Testing your bridge design...</p>
            </div>
            <div className="text-2xl font-bold text-white">{totalScore} pts</div>
          </div>

          {/* Test Info */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-bold">Test Progress</span>
              <span className="text-white">{currentVehicleIndex + 1} / {currentTask.testVehicles.length}</span>
            </div>
            <div className="flex gap-2 mb-4">
              {currentTask.testVehicles.map((v, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i < currentVehicleIndex ? "bg-green-500" :
                    i === currentVehicleIndex ? "bg-yellow-500" :
                    "bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <div className="text-center text-white mb-2">
              {currentVehicle && `Testing: ${currentVehicle.name} (${currentVehicle.weight}kg)`}
            </div>
          </div>

          {/* Bridge Visualization */}
          <div className="bg-sky-300 rounded-xl p-8 mb-6 relative overflow-hidden" style={{ minHeight: "300px" }}>
            {/* Water */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-blue-400">
              <div className="wave"></div>
            </div>
            
            {/* River banks */}
            <div className="absolute bottom-0 left-0 w-8 h-32 bg-green-600 rounded-t-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-32 bg-green-600 rounded-t-lg"></div>

            {/* Bridge */}
            <div className="absolute bottom-32 left-8 right-8 flex items-end justify-center">
              {/* Supports */}
              {bridgeParts.filter(p => p.type === "support").map((part) => {
                const material = currentTask.availableMaterials.find(m => m.id === part.materialId);
                return (
                  <div
                    key={part.id}
                    className={`w-8 ${material?.color} rounded-t`}
                    style={{ height: "80px", margin: "0 8px" }}
                  />
                );
              })}
              {/* Deck */}
              <div className="flex items-end">
                {bridgeParts.filter(p => p.type === "deck").map((part) => {
                  const material = currentTask.availableMaterials.find(m => m.id === part.materialId);
                  return (
                    <div
                      key={part.id}
                      className={`w-12 h-4 ${material?.color} rounded`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Vehicle */}
            {currentVehicle && (
              <div
                className="absolute bottom-32 transition-all"
                style={{ 
                  left: `calc(8px + ${vehicleProgress}% * (100% - 16px) / 100)`,
                  transform: "translateX(-50%)"
                }}
              >
                <div className="text-4xl">🚗</div>
                <div className="text-xs text-center font-bold text-gray-800">{currentVehicle.weight}kg</div>
              </div>
            )}

            {/* Test Result */}
            {testResult && (
              <div className={`absolute inset-0 flex items-center justify-center bg-black/50`}>
                <div className={`text-6xl font-bold ${testResult === "pass" ? "text-green-400" : "text-red-400"}`}>
                  {testResult === "pass" ? "✓ PASS" : "✗ FAIL"}
                </div>
              </div>
            )}
          </div>

          {/* Bridge Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-white/70 text-sm">Total Strength</div>
              <div className={`text-2xl font-bold ${totalStrength >= currentTask.requiredLoad ? "text-green-400" : "text-red-400"}`}>
                {totalStrength} kg
              </div>
              <div className="text-white/50 text-xs">Required: {currentTask.requiredLoad} kg</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-white/70 text-sm">Budget Used</div>
              <div className={`text-2xl font-bold ${totalCost <= currentTask.maxBudget ? "text-green-400" : "text-red-400"}`}>
                ${totalCost}
              </div>
              <div className="text-white/50 text-xs">Budget: ${currentTask.maxBudget}</div>
            </div>
          </div>

          {testPhase === "complete" && !showSuccess && (
            <div className="text-center">
              <p className="text-white mb-4">Bridge needs improvements!</p>
              <button
                onClick={() => {
                  setTestPhase("building");
                  setTestResult(null);
                }}
                className="px-6 py-3 bg-amber-600 text-white font-bold rounded-xl"
              >
                Try Again
              </button>
            </div>
          )}
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
            <h1 className="text-2xl font-bold text-white">🌉 Bridge Builder</h1>
            <p className="text-amber-200">{currentTask.title}</p>
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

        {/* Task Description */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
          <p className="text-amber-100">{currentTask.description}</p>
          <div className="flex gap-6 mt-3 text-sm">
            <div className="text-white">
              <span className="font-bold">River Width:</span> {currentTask.riverWidth} sections
            </div>
            <div className="text-white">
              <span className="font-bold">Required Load:</span> {currentTask.requiredLoad} kg
            </div>
            <div className="text-white">
              <span className="font-bold">Budget:</span> ${currentTask.maxBudget}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 mb-4 text-center">
            <span className="text-red-300 font-bold">{feedback}</span>
          </div>
        )}

        {/* Bridge Preview */}
        <div className="bg-sky-300 rounded-xl p-6 mb-4 relative" style={{ minHeight: "200px" }}>
          {/* Water */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-blue-400 rounded-b-xl"></div>
          
          {/* River banks */}
          <div className="absolute bottom-0 left-0 w-6 h-20 bg-green-600 rounded-t-lg"></div>
          <div className="absolute bottom-0 right-0 w-6 h-20 bg-green-600 rounded-t-lg"></div>

          {/* Bridge building area */}
          <div className="absolute bottom-20 left-6 right-6">
            <div className="flex items-end justify-center gap-1">
              {Array.from({ length: currentTask.riverWidth }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => addDeck(i)}
                  className="w-10 h-10 bg-gray-300 hover:bg-gray-400 border-2 border-dashed border-gray-500 rounded flex items-center justify-center text-2xl transition-all"
                >
                  +
                </button>
              ))}
            </div>
            {/* Support buttons */}
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={() => {
                  const midIndex = Math.floor(currentTask.riverWidth / 2);
                  addSupport(midIndex);
                }}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded"
              >
                + Support
              </button>
            </div>
          </div>

          {/* Current bridge parts */}
          <div className="absolute bottom-20 left-6 right-6">
            <div className="flex items-end justify-center gap-1">
              {Array.from({ length: currentTask.riverWidth }).map((_, i) => {
                const deckPart = bridgeParts.find(p => p.type === "deck" && p.x === i);
                const material = deckPart ? currentTask.availableMaterials.find(m => m.id === deckPart.materialId) : null;
                return (
                  <div
                    key={i}
                    className={`w-10 h-4 ${material?.color || "bg-transparent"} rounded`}
                  />
                );
              })}
            </div>
            {/* Supports */}
            {bridgeParts.filter(p => p.type === "support").length > 0 && (
              <div className="flex justify-center gap-1 mt-1">
                {bridgeParts.filter(p => p.type === "support").map((part) => {
                  const material = currentTask.availableMaterials.find(m => m.id === part.materialId);
                  return (
                    <div
                      key={part.id}
                      className={`w-4 h-8 ${material?.color} rounded-t`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Materials Selection */}
          <div>
            <h3 className="text-white font-bold mb-3">🔧 Materials</h3>
            <div className="space-y-2">
              {currentTask.availableMaterials.map((material) => (
                <button
                  key={material.id}
                  onClick={() => setSelectedMaterial(material.id)}
                  className={`w-full ${material.color} hover:opacity-80 rounded-lg p-3 text-left transition-all ${
                    selectedMaterial === material.id ? "ring-2 ring-white" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{material.emoji}</span>
                    <div>
                      <div className="font-bold text-white">{material.name}</div>
                      <div className="text-white/80 text-xs">Strength: {material.strength}kg | ${material.cost}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-white font-bold mb-3">📊 Bridge Stats</h3>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-white/70 text-sm">Total Strength</div>
                <div className={`text-2xl font-bold ${totalStrength >= currentTask.requiredLoad ? "text-green-400" : "text-red-400"}`}>
                  {totalStrength} kg {totalStrength >= currentTask.requiredLoad ? "✓" : "✗"}
                </div>
                <div className="text-white/50 text-xs">Need: {currentTask.requiredLoad} kg</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-white/70 text-sm">Total Cost</div>
                <div className={`text-2xl font-bold ${totalCost <= currentTask.maxBudget ? "text-green-400" : "text-red-400"}`}>
                  ${totalCost} {totalCost <= currentTask.maxBudget ? "✓" : "✗"}
                </div>
                <div className="text-white/50 text-xs">Budget: ${currentTask.maxBudget}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-white font-bold mb-3">⚙️ Actions</h3>
            <div className="space-y-2">
              <button
                onClick={startTest}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                🧪 Test Bridge
              </button>
              <button
                onClick={clearBridge}
                className="w-full py-2 bg-red-600/50 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
              >
                🗑️ Clear All
              </button>
            </div>

            {/* Test Vehicles Preview */}
            <div className="mt-4 bg-white/10 rounded-lg p-3">
              <div className="text-white/70 text-sm mb-2">Test Vehicles:</div>
              <div className="flex flex-wrap gap-1">
                {currentTask.testVehicles.map((v, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-700 text-white text-xs rounded">
                    {v.name} ({v.weight}kg)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
