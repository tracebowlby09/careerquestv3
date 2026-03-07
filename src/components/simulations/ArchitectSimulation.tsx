"use client";

import { useState, useEffect } from "react";
import { Difficulty } from "@/types/game";
import { audioSystem } from "@/lib/audio";

interface ArchitectSimulationProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
}

interface Room {
  id: string;
  name: string;
  emoji: string;
  width: number;
  height: number;
  cost: number;
}

interface ClientRequirement {
  id: string;
  type: "room" | "feature" | "style";
  description: string;
  met: boolean;
}

interface HouseDesign {
  id: string;
  name: string;
  client: string;
  clientAvatar: string;
  description: string;
  requirements: ClientRequirement[];
  availableRooms: Room[];
  gridSize: number;
  maxBudget: number;
  zoningRules: string[];
  points: number;
}

const houseDesigns: Record<Difficulty, HouseDesign[]> = {
  easy: [
    {
      id: "house-e1",
      name: "Cozy Cottage",
      client: "Sarah & Tom",
      clientAvatar: "👫",
      description: "A young couple wants a simple starter home.",
      gridSize: 4,
      maxBudget: 500,
      zoningRules: ["Must have outdoor space"],
      requirements: [
        { id: "r1", type: "room", description: "2 bedrooms", met: false },
        { id: "r2", type: "feature", description: "Kitchen", met: false },
        { id: "r3", type: "feature", description: "Bathroom", met: false },
      ],
      availableRooms: [
        { id: "bed1", name: "Bedroom", emoji: "🛏️", width: 2, height: 2, cost: 100 },
        { id: "bed2", name: "Bedroom 2", emoji: "🛏️", width: 2, height: 2, cost: 100 },
        { id: "living", name: "Living Room", emoji: "🛋️", width: 2, height: 2, cost: 80 },
        { id: "kitchen", name: "Kitchen", emoji: "🍳", width: 1, height: 2, cost: 60 },
        { id: "bath", name: "Bathroom", emoji: "🚿", width: 1, height: 1, cost: 40 },
        { id: "garden", name: "Garden", emoji: "🌻", width: 2, height: 1, cost: 30 },
      ],
      points: 100,
    },
  ],
  medium: [
    {
      id: "house-m1",
      name: "Family Home",
      client: "The Johnson Family",
      clientAvatar: "👨‍👩‍👧‍👦",
      description: "A family of 4 needs more space.",
      gridSize: 5,
      maxBudget: 800,
      zoningRules: ["Must have backyard", "Garage required"],
      requirements: [
        { id: "r1", type: "room", description: "3 bedrooms", met: false },
        { id: "r2", type: "room", description: "2 bathrooms", met: false },
        { id: "r3", type: "feature", description: "Large kitchen", met: false },
        { id: "r4", type: "feature", description: "Living room", met: false },
        { id: "r5", type: "feature", description: "Garage", met: false },
      ],
      availableRooms: [
        { id: "master", name: "Master Bedroom", emoji: "🛏️", width: 2, height: 2, cost: 120 },
        { id: "bed1", name: "Kids Room", emoji: "🧸", width: 2, height: 2, cost: 90 },
        { id: "bed2", name: "Guest Room", emoji: "🛏️", width: 2, height: 2, cost: 80 },
        { id: "living", name: "Living Room", emoji: "🛋️", width: 2, height: 2, cost: 80 },
        { id: "kitchen", name: "Kitchen", emoji: "🍳", width: 2, height: 1, cost: 70 },
        { id: "bath1", name: "Bathroom", emoji: "🚿", width: 1, height: 1, cost: 40 },
        { id: "bath2", name: "Bathroom 2", emoji: "🚿", width: 1, height: 1, cost: 40 },
        { id: "garage", name: "Garage", emoji: "🚗", width: 2, height: 2, cost: 100 },
        { id: "yard", name: "Backyard", emoji: "🌳", width: 2, height: 1, cost: 30 },
      ],
      points: 150,
    },
  ],
  hard: [
    {
      id: "house-h1",
      name: "Luxury Estate",
      client: "Mansion Client",
      clientAvatar: "💼",
      description: "A wealthy client wants their dream home with eco-friendly features.",
      gridSize: 6,
      maxBudget: 1500,
      zoningRules: ["Must have solar panels", "Energy efficient", "Minimum 4 bedrooms"],
      requirements: [
        { id: "r1", type: "room", description: "4 bedrooms", met: false },
        { id: "r2", type: "room", description: "3 bathrooms", met: false },
        { id: "r3", type: "feature", description: "Gourmet kitchen", met: false },
        { id: "r4", type: "feature", description: "Home office", met: false },
        { id: "r5", type: "feature", description: "Solar panels", met: false },
        { id: "r6", type: "style", description: "Eco-friendly materials", met: false },
        { id: "r7", type: "feature", description: "Pool", met: false },
      ],
      availableRooms: [
        { id: "master", name: "Master Suite", emoji: "🛏️", width: 2, height: 2, cost: 150 },
        { id: "bed1", name: "Bedroom 2", emoji: "🛏️", width: 2, height: 2, cost: 100 },
        { id: "bed2", name: "Bedroom 3", emoji: "🛏️", width: 2, height: 2, cost: 100 },
        { id: "bed3", name: "Bedroom 4", emoji: "🛏️", width: 2, height: 2, cost: 100 },
        { id: "living", name: "Living Room", emoji: "🛋️", width: 2, height: 2, cost: 100 },
        { id: "dining", name: "Dining Room", emoji: "🍽️", width: 2, height: 2, cost: 80 },
        { id: "kitchen", name: "Gourmet Kitchen", emoji: "🍳", width: 2, height: 2, cost: 150 },
        { id: "office", name: "Home Office", emoji: "💼", width: 1, height: 1, cost: 60 },
        { id: "bath1", name: "Master Bath", emoji: "🛁", width: 1, height: 1, cost: 60 },
        { id: "bath2", name: "Bathroom 2", emoji: "🚿", width: 1, height: 1, cost: 40 },
        { id: "bath3", name: "Bathroom 3", emoji: "🚿", width: 1, height: 1, cost: 40 },
        { id: "solar", name: "Solar Panels", emoji: "☀️", width: 2, height: 1, cost: 100 },
        { id: "pool", name: "Pool", emoji: "🏊", width: 2, height: 2, cost: 150 },
        { id: "eco", name: "Eco Materials", emoji: "🌿", width: 1, height: 1, cost: 50 },
      ],
      points: 200,
    },
  ],
};

export default function ArchitectSimulation({ difficulty, onComplete, onOpenSettings, onExit }: ArchitectSimulationProps) {
  const designs = houseDesigns[difficulty];
  const [currentDesignIndex, setCurrentDesignIndex] = useState(0);
  const [placedRooms, setPlacedRooms] = useState<{ roomId: string; x: number; y: number }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clientSatisfaction, setClientSatisfaction] = useState(0);
  const [feedback, setFeedback] = useState("");

  const currentDesign = designs[currentDesignIndex];

  // Calculate budget
  const calculateTotalCost = () => {
    return placedRooms.reduce((sum, placement) => {
      const room = currentDesign.availableRooms.find(r => r.id === placement.roomId);
      return sum + (room?.cost || 0);
    }, 0);
  };

  // Check requirements
  const checkRequirements = () => {
    const newRequirements = currentDesign.requirements.map((req) => {
      let met = false;
      
      if (req.type === "room") {
        // Count specific room types
        const bedroomCount = placedRooms.filter(p => {
          const room = currentDesign.availableRooms.find(r => r.id === p.roomId);
          return room?.name.includes("Bedroom");
        }).length;
        
        if (req.description.includes("2 bedrooms") && bedroomCount >= 2) met = true;
        if (req.description.includes("3 bedrooms") && bedroomCount >= 3) met = true;
        if (req.description.includes("4 bedrooms") && bedroomCount >= 4) met = true;
      }
      
      if (req.type === "feature") {
        // Check for specific features
        met = placedRooms.some(p => {
          const room = currentDesign.availableRooms.find(r => r.id === p.roomId);
          if (req.description === "Kitchen") return room?.name.includes("Kitchen");
          if (req.description === "Bathroom") return room?.name.includes("Bath");
          if (req.description === "Large kitchen") return room?.name.includes("Gourmet");
          if (req.description === "Living room") return room?.name.includes("Living");
          if (req.description === "Garage") return room?.name.includes("Garage");
          if (req.description === "Solar panels") return room?.name.includes("Solar");
          if (req.description === "Pool") return room?.name.includes("Pool");
          if (req.description === "Home office") return room?.name.includes("Office");
          return false;
        });
      }
      
      if (req.type === "style") {
        met = placedRooms.some(p => {
          const room = currentDesign.availableRooms.find(r => r.id === p.roomId);
          return room?.name.includes("Eco");
        });
      }
      
      return { ...req, met };
    });

    return newRequirements;
  };

  const updatedRequirements = checkRequirements();
  const totalCost = calculateTotalCost();
  const satisfiedRequirements = updatedRequirements.filter(r => r.met).length;
  const satisfactionPercent = Math.round((satisfiedRequirements / currentDesign.requirements.length) * 100);

  const isValidPlacement = (roomId: string, x: number, y: number): boolean => {
    const room = currentDesign.availableRooms.find(r => r.id === roomId);
    if (!room) return false;
    
    // Check bounds
    if (x + room.width > currentDesign.gridSize || y + room.height > currentDesign.gridSize) {
      return false;
    }
    
    // Check overlap
    for (const placed of placedRooms) {
      const existing = currentDesign.availableRooms.find(r => r.id === placed.roomId);
      if (!existing) continue;
      
      const overlaps = !(
        x >= placed.x + existing.width ||
        x + room.width <= placed.x ||
        y >= placed.y + existing.height ||
        y + room.height <= placed.y
      );
      
      if (overlaps) return false;
    }
    
    return true;
  };

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId === selectedRoom ? null : roomId);
  };

  const handleGridClick = (x: number, y: number) => {
    if (!selectedRoom) {
      // Remove room if clicking on it
      const roomIndex = placedRooms.findIndex(p => 
        p.x === x && placedRooms.filter(p2 => p2.roomId === placedRooms.find(p3 => p3.x === x && p3.y === y)?.roomId).some(p2 => {
          const room = currentDesign.availableRooms.find(r => r.id === p2.roomId);
          return room && x >= p2.x && x < p2.x + room.width && y >= p2.y && y < p2.y + room.height;
        })
      );
      if (roomIndex >= 0) {
        setPlacedRooms(placedRooms.filter((_, i) => i !== roomIndex));
      }
      return;
    }

    if (isValidPlacement(selectedRoom, x, y)) {
      // Check budget
      const room = currentDesign.availableRooms.find(r => r.id === selectedRoom);
      if (room && totalCost + room.cost > currentDesign.maxBudget) {
        setFeedback("Over budget!");
        return;
      }
      
      setPlacedRooms([...placedRooms, { roomId: selectedRoom, x, y }]);
      setFeedback("");
    } else {
      setFeedback("Can't place room here - no space!");
    }
  };

  const clearDesign = () => {
    setPlacedRooms([]);
    setFeedback("");
  };

  const submitDesign = () => {
    if (satisfiedRequirements < currentDesign.requirements.length) {
      setFeedback("Client requirements not met!");
      return;
    }
    if (totalCost > currentDesign.maxBudget) {
      setFeedback("Over budget!");
      return;
    }

    // Calculate score
    const budgetEfficiency = Math.round(((currentDesign.maxBudget - totalCost) / currentDesign.maxBudget) * 100);
    const requirementBonus = satisfiedRequirements * 30;
    const points = currentDesign.points + requirementBonus + budgetEfficiency;
    
    setTotalScore(points);
    setClientSatisfaction(satisfactionPercent);
    audioSystem.playSuccessSound();
    setShowSuccess(true);
  };

  const handleFinish = () => {
    const success = satisfactionPercent >= 80;
    onComplete(success, totalScore, currentDesign.points + 300);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-600 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Design Complete!</h2>
          <p className="text-gray-600 mb-4">
            Client satisfaction: {clientSatisfaction}%
          </p>
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-4 mb-6">
            <div className="text-white text-sm">Total Score</div>
            <div className="text-4xl font-bold text-white">{totalScore}</div>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            {clientSatisfaction >= 100 ? "🌟 Perfect design! Client loves it!" :
             clientSatisfaction >= 80 ? "👍 Great design! Client is happy." :
             "⚠️ Client wants some changes."}
          </div>
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-600 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🏛️ Dream House Design</h1>
            <p className="text-cyan-200">{currentDesign.name}</p>
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

        {/* Client Info */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{currentDesign.clientAvatar}</span>
            <div>
              <div className="text-white font-bold">{currentDesign.client}</div>
              <div className="text-cyan-200 text-sm">{currentDesign.description}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentDesign.requirements.map((req) => (
              <span 
                key={req.id}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  updatedRequirements.find(r => r.id === req.id)?.met 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-600 text-white"
                }`}
              >
                {req.met ? "✓" : "○"} {req.description}
              </span>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-2 mb-4 text-center">
            <span className="text-red-300 font-bold">{feedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Room Selection */}
          <div>
            <h3 className="text-white font-bold mb-3">🏗️ Available Rooms</h3>
            <div className="space-y-2">
              {currentDesign.availableRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleRoomClick(room.id)}
                  className={`w-full rounded-lg p-3 text-left transition-all ${
                    selectedRoom === room.id 
                      ? "ring-2 ring-white bg-teal-600" 
                      : "bg-white/90 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{room.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 text-sm">{room.name}</div>
                      <div className="text-xs text-gray-500">{room.width}x{room.height}</div>
                    </div>
                    <div className="text-sm font-bold text-gray-600">${room.cost}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Design Grid */}
          <div>
            <h3 className="text-white font-bold mb-3">📐 Design Grid</h3>
            <div 
              className="bg-green-300 rounded-lg p-2 relative"
              style={{ 
                display: "grid",
                gridTemplateColumns: `repeat(${currentDesign.gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${currentDesign.gridSize}, 1fr)`,
                aspectRatio: "1/1"
              }}
              onMouseLeave={() => setHoverPos(null)}
            >
              {Array.from({ length: currentDesign.gridSize * currentDesign.gridSize }).map((_, i) => {
                const x = i % currentDesign.gridSize;
                const y = Math.floor(i / currentDesign.gridSize);
                
                // Find room at this position
                const roomAtPos = placedRooms.find(p => {
                  const room = currentDesign.availableRooms.find(r => r.id === p.roomId);
                  return room && x >= p.x && x < p.x + room.width && y >= p.y && y < p.y + room.height;
                });
                
                const room = roomAtPos ? currentDesign.availableRooms.find(r => r.id === roomAtPos.roomId) : null;
                const isHovered = hoverPos?.x === x && hoverPos?.y === y && selectedRoom;
                const canPlace = selectedRoom && isValidPlacement(selectedRoom, x, y);

                return (
                  <div
                    key={i}
                    className={`border border-green-400 rounded m-0.5 flex items-center justify-center cursor-pointer transition-all ${
                      room 
                        ? "bg-teal-500" 
                        : isHovered && canPlace 
                          ? "bg-teal-300" 
                          : isHovered && !canPlace 
                            ? "bg-red-300" 
                            : "bg-green-200"
                    }`}
                    onClick={() => handleGridClick(x, y)}
                    onMouseEnter={() => setHoverPos({ x, y })}
                  >
                    {room && <span className="text-lg">{room.emoji}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats & Actions */}
          <div>
            <h3 className="text-white font-bold mb-3">📊 Design Stats</h3>
            
            <div className="space-y-3 mb-4">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-white/70 text-sm">Budget</div>
                <div className={`text-2xl font-bold ${totalCost <= currentDesign.maxBudget ? "text-green-400" : "text-red-400"}`}>
                  ${totalCost} / ${currentDesign.maxBudget}
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-white/70 text-sm">Requirements Met</div>
                <div className={`text-2xl font-bold ${satisfactionPercent >= 80 ? "text-green-400" : satisfactionPercent >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                  {satisfiedRequirements} / {currentDesign.requirements.length}
                </div>
                <div className="text-white/50 text-xs">Client satisfaction: {satisfactionPercent}%</div>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-white/70 text-sm mb-2">Zoning Rules:</div>
                {currentDesign.zoningRules.map((rule, i) => (
                  <div key={i} className="text-white text-xs">• {rule}</div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={submitDesign}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all"
              >
                ✓ Submit Design
              </button>
              <button
                onClick={clearDesign}
                className="w-full py-2 bg-red-600/50 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
