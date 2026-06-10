"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Difficulty } from "@/types/game";
import { audioSystem } from "@/lib/audio";

interface Material {
  id: string;
  name: string;
  cost: number;
  weight: number;
  compressionStrength: number;
  tensionStrength: number;
  flexStrength: number;
  earthquakeResistance: number;
  color: string;
}

interface BuildingPiece {
  id: string;
  type: "foundation" | "beam" | "column" | "wall" | "floor" | "roof" | "brace";
  material: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  stress: number;
  health: number;
}

interface ClientRequirements {
  budget: number;
  minHeight: number;
  maxHeight: number;
  minRooms: number;
  maxRooms: number;
  style: string;
  minSafety: number;
}

interface EarthquakeEvent {
  magnitude: number;
  duration: number;
  intensity: number;
  timeElapsed: number;
}

const MATERIALS: Material[] = [
  { id: "wood", name: "Wood", cost: 50, weight: 0.3, compressionStrength: 30, tensionStrength: 40, flexStrength: 70, earthquakeResistance: 60, color: "#8B4513" },
  { id: "concrete", name: "Concrete", cost: 100, weight: 2.5, compressionStrength: 80, tensionStrength: 10, flexStrength: 20, earthquakeResistance: 40, color: "#808080" },
  { id: "steel", name: "Steel", cost: 200, weight: 1.2, compressionStrength: 100, tensionStrength: 90, flexStrength: 85, earthquakeResistance: 80, color: "#4682B4" },
  { id: "composite", name: "Composite", cost: 350, weight: 0.8, compressionStrength: 90, tensionStrength: 95, flexStrength: 90, earthquakeResistance: 95, color: "#20B2AA" },
];

const BUILDING_TYPES = {
  foundation: { cost: 0, width: 4, height: 1, canRotate: false },
  beam: { cost: 0, width: 3, height: 0.3, canRotate: true },
  column: { cost: 0, width: 0.3, height: 3, canRotate: false },
  wall: { cost: 0, width: 4, height: 0.2, canRotate: false },
  floor: { cost: 0, width: 4, height: 0.2, canRotate: false },
  roof: { cost: 0, width: 4, height: 0.2, canRotate: true },
  brace: { cost: 0, width: 2, height: 0.2, canRotate: true },
};

const INITIAL_BUDGET = 10000;
const GRID_SIZE = 32;

export default function ArchitectSimulator({ 
  difficulty, 
  onComplete,
  onExit 
}: { 
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number) => void;
  onExit?: () => void;
}) {
  const [stage, setStage] = useState<"planning" | "building" | "testing" | "results">("planning");
  const [budget, setBudget] = useState(INITIAL_BUDGET);
  const [spent, setSpent] = useState(0);
  const [pieces, setPieces] = useState<BuildingPiece[]>([]);
  const [selectedTool, setSelectedTool] = useState<keyof typeof BUILDING_TYPES>("foundation");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("wood");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [earthquake, setEarthquake] = useState<EarthquakeEvent | null>(null);
  const [simulationTime, setSimulationTime] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const animationRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const requirements: ClientRequirements = {
    budget: INITIAL_BUDGET,
    minHeight: 3,
    maxHeight: difficulty === "easy" ? 8 : difficulty === "medium" ? 15 : 25,
    minRooms: difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 4,
    maxRooms: difficulty === "easy" ? 3 : difficulty === "medium" ? 6 : 12,
    style: "modern",
    minSafety: difficulty === "easy" ? 50 : difficulty === "medium" ? 65 : 80,
  };

  const getMaterial = useCallback((id: string) => MATERIALS.find(m => m.id === id) || MATERIALS[0], []);
  const { stressMap, buildingHealth } = useMemo(() => {
    const newStressMap = new Map<string, number>();
    let totalHealth = 100;
    
    pieces.forEach(piece => {
      const material = getMaterial(piece.material);
      let stress = 0;
      
      if (piece.type === "foundation") {
        const columnLoad = pieces.filter(p => p.type === "column").length * material.weight;
        stress = Math.min(100, columnLoad * 2);
      } else if (piece.type === "column") {
        const floorLoad = pieces.filter(p => p.type === "floor" && p.y < piece.y).length * material.weight;
        stress = Math.min(100, floorLoad * 1.5);
      }
      
      newStressMap.set(piece.id, stress);
      if (stress > 80) totalHealth -= 5;
      else if (stress > 60) totalHealth -= 2;
    });
    
    return { stressMap: newStressMap, buildingHealth: Math.max(0, totalHealth) };
  }, [pieces, getMaterial]);


  const calculatePieceCost = useCallback((type: keyof typeof BUILDING_TYPES, materialId: string): number => {
    const material = getMaterial(materialId);
    const base = BUILDING_TYPES[type];
    return Math.round(material.cost * base.width * base.height * (type === "foundation" ? 2 : 1));
  }, [getMaterial]);

  const addPiece = useCallback((x: number, y: number, rotation: number = 0) => {
    const cost = calculatePieceCost(selectedTool, selectedMaterial);
    if (spent + cost > budget) return;

    const material = getMaterial(selectedMaterial);
    const dims = BUILDING_TYPES[selectedTool];
    
    const piece: BuildingPiece = {
      id: `piece-${Date.now()}-${Math.random()}`,
      type: selectedTool,
      material: selectedMaterial,
      x: Math.floor(x / GRID_SIZE) * GRID_SIZE,
      y: Math.floor(y / GRID_SIZE) * GRID_SIZE,
      width: dims.width * GRID_SIZE,
      height: dims.height * GRID_SIZE,
      rotation,
      stress: 0,
      health: 100,
    };
    
    setPieces(prev => [...prev, piece]);
    setSpent(prev => prev + cost);
    audioSystem.playClickSound();
  }, [selectedTool, selectedMaterial, budget, spent, calculatePieceCost, getMaterial]);



  const calculateScore = useCallback(() => {
    let totalScore = 0;
    const height = Math.max(...pieces.map(p => p.y + p.height), 0) / GRID_SIZE;
    const rooms = Math.floor(pieces.filter(p => p.type === "floor").length / 2);
    const efficiency = (INITIAL_BUDGET - spent) / INITIAL_BUDGET;
    
    totalScore += height * 10;
    totalScore += rooms * 20;
    totalScore += efficiency * 50;
    totalScore += buildingHealth;
    
    const expectedMagnitude = difficulty === "easy" ? 5 : difficulty === "medium" ? 7 : 9;
    if (buildingHealth > 50 && height >= requirements.minHeight) {
      totalScore += 100;
    }
    
    return Math.round(totalScore);
  }, [pieces, spent, buildingHealth, difficulty, requirements.minHeight]);

  const startEarthquake = useCallback(() => {
    const magnitude = difficulty === "easy" ? 5 : difficulty === "medium" ? 7 : 9;
    setEarthquake({
      magnitude,
      duration: magnitude * 3,
      intensity: magnitude * 10,
      timeElapsed: 0,
    });
    setStage("testing");
    setSimulationTime(0);
  }, [difficulty]);

  useEffect(() => {
    if (!earthquake) return;
    
    const timer = setInterval(() => {
      setSimulationTime(t => {
        const newTime = t + 0.1;
        if (newTime >= earthquake.duration) {
          setEarthquake(null);
          const finalScore = calculateScore();
          setScore(finalScore);
          setLevel(l => l + 1);
          setStage("results");
          return 0;
        }
        return newTime;
      });
      
      setPieces(prev => prev.map(piece => {
        const material = getMaterial(piece.material);
        const quakeStress = earthquake.intensity * 0.5;
        const resistance = material.earthquakeResistance;
        const damage = Math.max(0, (quakeStress - resistance) * 0.1);
        
        return {
          ...piece,
          health: Math.max(0, piece.health - damage),
          stress: Math.min(100, piece.stress + quakeStress * 0.2),
        };
      }));
    }, 100);
    
    return () => clearInterval(timer);
  }, [earthquake, getMaterial, calculateScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#E6F3FF";
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
      
      ctx.strokeStyle = "#B0C4DE";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height - 40);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height - 40; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      pieces.forEach(piece => {
        const material = getMaterial(piece.material);
        ctx.save();
        ctx.translate(piece.x + piece.width / 2, piece.y + piece.height / 2);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        
        const stress = stressMap.get(piece.id) || 0;
        let color = material.color;
        if (stage === "testing") {
          const healthRatio = piece.health / 100;
          if (healthRatio < 0.5) color = "#FF4444";
          else if (healthRatio < 0.8) color = "#FFAA44";
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        
        ctx.strokeStyle = stress > 60 ? "#FF0000" : "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        
        ctx.restore();
      });
      
      if (earthquake && stage === "testing") {
        const shake = Math.sin(simulationTime * 50) * 5;
        ctx.save();
        ctx.translate(shake, 0);
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [pieces, stressMap, stage, earthquake, simulationTime, getMaterial]);

  const handleTestComplete = useCallback(() => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setLevel(l => l + 1);
  }, [calculateScore]);



  const unlockedMaterials = level >= 3 ? MATERIALS.slice(0, 4) : level >= 2 ? MATERIALS.slice(0, 3) : MATERIALS.slice(0, 2);

  if (stage === "planning") {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Brief</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">Requirements</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• Budget: ${INITIAL_BUDGET.toLocaleString()}</li>
                  <li>• Height: {requirements.minHeight}-{requirements.maxHeight} stories</li>
                  <li>• Rooms: {requirements.minRooms}-{requirements.maxRooms}</li>
                  <li>• Style: {requirements.style}</li>
                  <li>• Safety Rating: {requirements.minSafety}+</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-900 mb-2">Materials Available</h3>
                <div className="space-y-2">
                  {unlockedMaterials.map(m => (
                    <div key={m.id} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: m.color }} />
                      <span className="text-sm">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStage("building")}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
              >
                Start Building
              </button>
              {onExit && (
                <button
                  onClick={onExit}
                  className="px-6 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400"
                >
                  Exit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "results") {
    const passed = buildingHealth > 30;
    
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <h2 className="text-4xl font-bold mb-4">
              {passed ? "Structure Survived!" : "Structural Failure"}
            </h2>
            
            <div className="text-6xl mb-4">{passed ? "🏗️" : "💥"}</div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-gray-600">Score</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold">{buildingHealth}%</div>
                <div className="text-gray-600">Integrity</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold">${(INITIAL_BUDGET - spent).toLocaleString()}</div>
                <div className="text-gray-600">Remaining</div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setPieces([]);
                  setSpent(0);
                  setStage("planning");
                }}
                className="px-6 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
              >
                New Project
              </button>
              <button
                onClick={() => onComplete(passed, score)}
                className="px-6 bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "testing" && earthquake) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-600">🌋 Earthquake Simulation</h2>
              <div className="text-xl">Magnitude {earthquake.magnitude}</div>
            </div>
            
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="border border-gray-300 rounded-lg w-full"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded">
                Time: {simulationTime.toFixed(1)}s / {earthquake.duration}s
              </div>
            </div>
            
            <div className="mt-4 text-center text-gray-600">
              Watch your building withstand the seismic forces...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-2">
              {Object.entries(BUILDING_TYPES).map(([type, cfg]) => (
                <button
                  key={type}
                  onClick={() => setSelectedTool(type as keyof typeof BUILDING_TYPES)}
                  className={`px-3 py-2 rounded font-medium transition-all ${
                    selectedTool === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              {unlockedMaterials.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMaterial(m.id)}
                  className={`px-3 py-2 rounded flex items-center gap-2 transition-all ${
                    selectedMaterial === m.id
                      ? "ring-2 ring-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: m.color }} />
                  <span className="text-sm">{m.name}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Budget:</span>
                <span className="font-bold ml-1">${(budget - spent).toLocaleString()}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Stress:</span>
                <span className={`font-bold ml-1 ${buildingHealth > 70 ? "text-green-600" : buildingHealth > 30 ? "text-yellow-600" : "text-red-600"}`}>
                  {buildingHealth}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="border border-gray-300 rounded-lg w-full cursor-crosshair"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              addPiece(e.clientX - rect.left, e.clientY - rect.top);
            }}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setPieces([])}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear All
          </button>
          
          <button
            onClick={startEarthquake}
            disabled={pieces.length === 0}
            className="px-6 py-2 bg-orange-600 text-white font-bold rounded hover:bg-orange-700 disabled:bg-gray-400"
          >
            🌋 Test Earthquake
          </button>
        </div>
      </div>
    </div>
  );
}