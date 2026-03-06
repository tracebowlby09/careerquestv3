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
}

interface ArchitectTask {
  id: string;
  title: string;
  description: string;
  hint: string;
  rooms: Room[];
  gridSize: number;
  requiredPlacements: { roomId: string; area: string }[];
  points: number;
}

const architectTasks: Record<Difficulty, ArchitectTask[]> = {
  easy: [
    {
      id: "arch-e1",
      title: "Cozy Studio Apartment",
      description: "Design a simple studio apartment!",
      hint: "Place the bed in a quiet corner 🛏️",
      gridSize: 4,
      rooms: [
        { id: "bed", name: "Bed", emoji: "🛏️", width: 2, height: 2 },
        { id: "kitchen", name: "Kitchen", emoji: "🍳", width: 1, height: 1 },
        { id: "bath", name: "Bathroom", emoji: "🚿", width: 1, height: 1 },
      ],
      requiredPlacements: [
        { roomId: "bed", area: "corner" },
      ],
      points: 100,
    },
    {
      id: "arch-e2",
      title: "Tiny House",
      description: "Build a tiny house with all essentials!",
      hint: "Put the kitchen near the living area 🍳",
      gridSize: 4,
      rooms: [
        { id: "bed", name: "Bed", emoji: "🛏️", width: 2, height: 1 },
        { id: "kitchen", name: "Kitchen", emoji: "🍳", width: 1, height: 1 },
        { id: "bath", name: "Bathroom", emoji: "🚿", width: 1, height: 1 },
        { id: "living", name: "Living", emoji: "🛋️", width: 1, height: 1 },
      ],
      requiredPlacements: [
        { roomId: "kitchen", area: "top" },
      ],
      points: 100,
    },
    {
      id: "arch-e3",
      title: "Dream Bedroom",
      description: "Design your perfect bedroom!",
      hint: "Bed goes in the center or corner",
      gridSize: 4,
      rooms: [
        { id: "bed", name: "Bed", emoji: "🛏️", width: 2, height: 2 },
        { id: "desk", name: "Desk", emoji: "🖥️", width: 1, height: 1 },
        { id: "closet", name: "Closet", emoji: "👕", width: 1, height: 1 },
      ],
      requiredPlacements: [
        { roomId: "desk", area: "edge" },
      ],
      points: 100,
    },
  ],
  medium: [
    {
      id: "arch-m1",
      title: "Family Home",
      description: "Design a 3-room family apartment!",
      hint: "Bedrooms on one side, living areas on the other",
      gridSize: 5,
      rooms: [
        { id: "master", name: "Master Bed", emoji: "🛏️", width: 2, height: 2 },
        { id: "kid", name: "Kids Room", emoji: "🧸", width: 2, height: 2 },
        { id: "living", name: "Living Room", emoji: "🛋️", width: 2, height: 2 },
        { id: "kitchen", name: "Kitchen", emoji: "🍳", width: 1, height: 2 },
        { id: "bath", name: "Bathroom", emoji: "🚿", width: 1, height: 1 },
      ],
      requiredPlacements: [
        { roomId: "master", area: "corner" },
        { roomId: "living", area: "bottom" },
      ],
      points: 150,
    },
    {
      id: "arch-m2",
      title: "Pet Shop",
      description: "Create a friendly pet shop layout!",
      hint: "Reception at the front, cages in the back",
      gridSize: 5,
      rooms: [
        { id: "reception", name: "Reception", emoji: "🏪", width: 2, height: 1 },
        { id: "dogs", name: "Dog Area", emoji: "🐕", width: 2, height: 2 },
        { id: "cats", name: "Cat Area", emoji: "🐱", width: 1, height: 2 },
        { id: "food", name: "Food Storage", emoji: "🦴", width: 1, height: 1 },
      ],
      requiredPlacements: [
        { roomId: "reception", area: "top" },
      ],
      points: 150,
    },
  ],
  hard: [
    {
      id: "arch-h1",
      title: "Luxury Penthouse",
      description: "Design an amazing penthouse suite!",
      hint: "Master suite in corner, views everywhere!",
      gridSize: 6,
      rooms: [
        { id: "master", name: "Master Suite", emoji: "🛏️", width: 2, height: 2 },
        { id: "living", name: "Living Room", emoji: "🛋️", width: 2, height: 2 },
        { id: "kitchen", name: "Gourmet Kitchen", emoji: "🍳", width: 2, height: 1 },
        { id: "dining", name: "Dining Room", emoji: "🍽️", width: 1, height: 2 },
        { id: "bath1", name: "Master Bath", emoji: "🛁", width: 1, height: 1 },
        { id: "balcony", name: "Balcony", emoji: "🌅", width: 2, height: 1 },
      ],
      requiredPlacements: [
        { roomId: "master", area: "corner" },
        { roomId: "balcony", area: "edge" },
        { roomId: "living", area: "corner" },
      ],
      points: 200,
    },
    {
      id: "arch-h2",
      title: "Vet Clinic",
      description: "Build a functional veterinary clinic!",
      hint: "Waiting room front, exam rooms in back",
      gridSize: 6,
      rooms: [
        { id: "waiting", name: "Waiting Room", emoji: "🪑", width: 2, height: 2 },
        { id: "reception", name: "Reception", emoji: "🏥", width: 1, height: 1 },
        { id: "exam1", name: "Exam Room 1", emoji: "🩺", width: 1, height: 1 },
        { id: "exam2", name: "Exam Room 2", emoji: "🩺", width: 1, height: 1 },
        { id: "surgery", name: "Surgery", emoji: "💉", width: 1, height: 2 },
        { id: "storage", name: "Storage", emoji: "📦", width: 1, height: 1 },
      ],
      requiredPlacements: [
        { roomId: "reception", area: "top" },
        { roomId: "surgery", area: "bottom" },
      ],
      points: 200,
    },
  ],
};

export default function ArchitectSimulation({ difficulty, onComplete, onOpenSettings, onExit }: ArchitectSimulationProps) {
  const tasks = architectTasks[difficulty];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [placedRooms, setPlacedRooms] = useState<{ roomId: string; x: number; y: number }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentTask = tasks[currentTaskIndex];

  // Initialize
  useEffect(() => {
    if (currentTask) {
      setPlacedRooms([]);
      setSelectedRoom(null);
      setFeedback(null);
      setShowHint(false);
    }
  }, [currentTask]);

  // Check if a placement is valid
  const isValidPlacement = (roomId: string, x: number, y: number): boolean => {
    if (!currentTask) return false;
    const room = currentTask.rooms.find(r => r.id === roomId);
    if (!room) return false;
    
    // Check bounds
    if (x + room.width > currentTask.gridSize || y + room.height > currentTask.gridSize) {
      return false;
    }
    
    // Check overlap with existing rooms
    for (const placed of placedRooms) {
      const existing = currentTask.rooms.find(r => r.id === placed.roomId);
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

  // Check if all requirements are met
  const checkRequirements = (): boolean => {
    if (!currentTask) return false;
    
    for (const req of currentTask.requiredPlacements) {
      const placed = placedRooms.find(p => p.roomId === req.roomId);
      if (!placed) return false;
      
      const room = currentTask.rooms.find(r => r.id === req.roomId);
      if (!room) return false;
      
      if (req.area === "corner") {
        const isCorner = 
          (placed.x === 0 || placed.x + room.width === currentTask.gridSize) &&
          (placed.y === 0 || placed.y + room.height === currentTask.gridSize);
        if (!isCorner) return false;
      } else if (req.area === "edge") {
        const isEdge = 
          placed.x === 0 || 
          placed.x + room.width === currentTask.gridSize ||
          placed.y === 0 || 
          placed.y + room.height === currentTask.gridSize;
        if (!isEdge) return false;
      } else if (req.area === "top") {
        if (placed.y !== 0) return false;
      } else if (req.area === "bottom") {
        if (placed.y + room.height !== currentTask.gridSize) return false;
      }
    }
    
    return true;
  };

  const handleCellClick = (x: number, y: number) => {
    if (!selectedRoom || !currentTask) return;
    
    if (placedRooms.some(p => p.roomId === selectedRoom)) {
      // Room already placed, don't allow repositioning in this simple version
      return;
    }
    
    if (isValidPlacement(selectedRoom, x, y)) {
      setPlacedRooms([...placedRooms, { roomId: selectedRoom, x, y }]);
      setSelectedRoom(null);
      audioSystem.playClickSound();
    } else {
      // Invalid placement feedback
      audioSystem.playFailureSound();
    }
  };

  const handleSubmit = () => {
    if (!currentTask) return;
    
    // Check if all rooms are placed
    if (placedRooms.length < currentTask.rooms.length) {
      audioSystem.playFailureSound();
      return;
    }
    
    const success = checkRequirements();
    
    if (success) {
      audioSystem.playSuccessSound();
      setTotalScore((prev) => prev + currentTask.points);
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
        setFeedback(null);
      }, 1500);
    }
  };

  const handleFinish = () => {
    const success = totalScore > 0;
    onComplete(success, totalScore, tasks.reduce((sum, t) => sum + t.points, 0));
  };

  // Get preview room at hover position
  const getPreviewRoom = () => {
    if (!selectedRoom || !hoverPos || !currentTask) return null;
    const room = currentTask.rooms.find(r => r.id === selectedRoom);
    if (!room) return null;
    
    const isValid = isValidPlacement(selectedRoom, hoverPos.x, hoverPos.y);
    return { room, isValid };
  };

  const preview = getPreviewRoom();

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-600 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Architect Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: {totalScore}</p>
          <p className="text-gray-500 mb-6">You designed {completedTasks + 1} amazing buildings!</p>
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-600 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">🏛️ Architect Simulation</h1>
            <p className="text-cyan-200">Task {currentTaskIndex + 1} of {tasks.length}</p>
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
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{currentTask.title}</h2>
              <p className="text-cyan-100">{currentTask.description}</p>
            </div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 rounded-lg text-sm"
            >
              💡 Hint
            </button>
          </div>
          {showHint && (
            <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg">
              <p className="text-yellow-200">{currentTask.hint}</p>
            </div>
          )}
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Room Selection */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">🧱 Rooms</h3>
            <div className="space-y-2">
              {currentTask.rooms.map((room) => {
                const isPlaced = placedRooms.some(p => p.roomId === room.id);
                const isSelected = selectedRoom === room.id;
                
                return (
                  <button
                    key={room.id}
                    onClick={() => !isPlaced && setSelectedRoom(isSelected ? null : room.id)}
                    disabled={isPlaced}
                    className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                      isPlaced 
                        ? "bg-green-500/30 text-green-200 cursor-not-allowed"
                        : isSelected
                          ? "bg-cyan-500 text-white ring-2 ring-cyan-300"
                          : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <span className="text-2xl">{room.emoji}</span>
                    <div className="text-left">
                      <div className="font-bold">{room.name}</div>
                      <div className="text-xs opacity-70">{room.width}x{room.height}</div>
                    </div>
                    {isPlaced && <span className="ml-auto">✅</span>}
                  </button>
                );
              })}
            </div>
            
            {selectedRoom && (
              <div className="mt-4 p-3 bg-cyan-500/20 rounded-lg">
                <p className="text-cyan-200 text-sm">Click on the grid to place {currentTask.rooms.find(r => r.id === selectedRoom)?.name}!</p>
              </div>
            )}
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={placedRooms.length < currentTask.rooms.length}
              className={`w-full mt-4 py-3 rounded-lg font-bold transition-all ${
                placedRooms.length < currentTask.rooms.length
                  ? "bg-gray-500/50 text-gray-300 cursor-not-allowed"
                  : feedback === "correct"
                    ? "bg-green-500 text-white"
                    : feedback === "incorrect"
                      ? "bg-red-500 text-white"
                      : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600"
              }`}
            >
              {feedback === "correct" ? "✅ Perfect!" : feedback === "incorrect" ? "❌ Try Again!" : "🏁 Submit Design"}
            </button>
          </div>

          {/* Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-3">📐 Your Building ({currentTask.gridSize}x{currentTask.gridSize})</h3>
            <div 
              className="grid gap-1 bg-gray-800 p-2 rounded-lg"
              style={{ 
                gridTemplateColumns: `repeat(${currentTask.gridSize}, 1fr)`,
                aspectRatio: '1'
              }}
            >
              {Array.from({ length: currentTask.gridSize * currentTask.gridSize }).map((_, i) => {
                const x = i % currentTask.gridSize;
                const y = Math.floor(i / currentTask.gridSize);
                
                // Find if a room is here
                const placedRoom = placedRooms.find(p => {
                  const room = currentTask.rooms.find(r => r.id === p.roomId);
                  return room && x >= p.x && x < p.x + room.width && y >= p.y && y < p.y + room.height;
                });
                
                const room = placedRoom ? currentTask.rooms.find(r => r.id === placedRoom.roomId) : null;
                
                // Preview at hover position
                const isPreview = preview && hoverPos && x >= hoverPos.x && x < hoverPos.x + preview.room.width && y >= hoverPos.y && y < hoverPos.y + preview.room.height;
                
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoverPos({ x, y })}
                    onMouseLeave={() => setHoverPos(null)}
                    onClick={() => handleCellClick(x, y)}
                    className={`rounded transition-all cursor-pointer ${
                      room 
                        ? "bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-2xl"
                        : isPreview
                          ? preview.isValid 
                            ? "bg-green-500/50 border-2 border-green-400 dashed"
                            : "bg-red-500/50 border-2 border-red-400 dashed"
                        : selectedRoom
                          ? "bg-white/10 hover:bg-white/20"
                          : "bg-gray-700"
                    }`}
                  >
                    {room && (
                      <span className="drop-shadow-lg">{room.emoji}</span>
                    )}
                    {isPreview && !room && (
                      <span className="text-2xl opacity-50">{preview.room.emoji}</span>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Progress */}
            <div className="mt-4 flex justify-between text-white">
              <span>Rooms placed: {placedRooms.length}/{currentTask.rooms.length}</span>
              <span>Score: {totalScore}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
