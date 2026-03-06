"use client";

import { useState, useEffect, useCallback } from "react";
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
  width: number;
  height: number;
  color: string;
  requiredAdjacencies: string[];
}

interface Requirement {
  id: string;
  description: string;
  check: (rooms: PlacedRoom[]) => boolean;
}

interface ArchitectTask {
  id: string;
  title: string;
  description: string;
  availableRooms: Room[];
  gridSize: number;
  maxBudget: number;
  requirements: Requirement[];
  timeLimit: number;
  points: number;
}

const architectTasks: Record<Difficulty, ArchitectTask[]> = {
  easy: [
    {
      id: "arch-e1",
      title: "Simple Apartment",
      description: "Arrange these rooms to create a functional apartment. Kitchen should be near dining!",
      gridSize: 6,
      maxBudget: 500,
      availableRooms: [
        { id: "bedroom", name: "Bedroom", width: 2, height: 2, color: "bg-blue-400", requiredAdjacencies: ["bathroom"] },
        { id: "bathroom", name: "Bathroom", width: 1, height: 1, color: "bg-cyan-400", requiredAdjacencies: ["bedroom"] },
        { id: "kitchen", name: "Kitchen", width: 2, height: 1, color: "bg-yellow-400", requiredAdjacencies: ["dining"] },
        { id: "dining", name: "Dining", width: 1, height: 1, color: "bg-orange-400", requiredAdjacencies: ["kitchen"] },
      ],
      requirements: [
        { id: "r1", description: "Kitchen near Dining room", check: (rooms) => {
          const kitchen = rooms.find(r => r.roomId === "kitchen");
          const dining = rooms.find(r => r.roomId === "dining");
          if (!kitchen || !dining) return false;
          return Math.abs(kitchen.x - dining.x) <= 1 && Math.abs(kitchen.y - dining.y) <= 1;
        }},
      ],
      timeLimit: 60,
      points: 100,
    },
  ],
  medium: [
    {
      id: "arch-m1",
      title: "Office Layout",
      description: "Design an office with meeting room near entrance and quiet workspace away from noise.",
      gridSize: 8,
      maxBudget: 800,
      availableRooms: [
        { id: "reception", name: "Reception", width: 2, height: 1, color: "bg-purple-400", requiredAdjacencies: ["meeting"] },
        { id: "meeting", name: "Meeting Room", width: 2, height: 2, color: "bg-indigo-400", requiredAdjacencies: ["reception"] },
        { id: "workspace1", name: "Workspace A", width: 2, height: 2, color: "bg-green-400", requiredAdjacencies: [] },
        { id: "workspace2", name: "Workspace B", width: 2, height: 2, color: "bg-green-400", requiredAdjacencies: [] },
        { id: "breakroom", name: "Break Room", width: 2, height: 1, color: "bg-pink-400", requiredAdjacencies: [] },
      ],
      requirements: [
        { id: "r1", description: "Meeting room near Reception", check: (rooms) => {
          const reception = rooms.find(r => r.roomId === "reception");
          const meeting = rooms.find(r => r.roomId === "meeting");
          if (!reception || !meeting) return false;
          return Math.abs(reception.x - meeting.x) <= 2 && Math.abs(reception.y - meeting.y) <= 2;
        }},
        { id: "r2", description: "Workspaces away from Reception", check: (rooms) => {
          const reception = rooms.find(r => r.roomId === "reception");
          const ws1 = rooms.find(r => r.roomId === "workspace1");
          const ws2 = rooms.find(r => r.roomId === "workspace2");
          if (!reception || !ws1 || !ws2) return false;
          const dist1 = Math.abs(reception.x - ws1.x) + Math.abs(reception.y - ws1.y);
          const dist2 = Math.abs(reception.x - ws2.x) + Math.abs(reception.y - ws2.y);
          return dist1 > 2 || dist2 > 2;
        }},
      ],
      timeLimit: 90,
      points: 150,
    },
  ],
  hard: [
    {
      id: "arch-h1",
      title: "Mixed-Use Building",
      description: "Design a building with retail on ground floor, offices above, and residential. Complex requirements!",
      gridSize: 10,
      maxBudget: 1500,
      availableRooms: [
        { id: "retail1", name: "Retail Space A", width: 3, height: 2, color: "bg-red-400", requiredAdjacencies: ["entrance"] },
        { id: "retail2", name: "Retail Space B", width: 3, height: 2, color: "bg-red-400", requiredAdjacencies: ["entrance"] },
        { id: "entrance", name: "Main Entrance", width: 2, height: 1, color: "bg-gray-400", requiredAdjacencies: ["reception"] },
        { id: "reception", name: "Reception", width: 2, height: 1, color: "bg-purple-400", requiredAdjacencies: ["entrance", "elevator"] },
        { id: "elevator", name: "Elevator", width: 1, height: 1, color: "bg-zinc-400", requiredAdjacencies: [] },
        { id: "office1", name: "Office Suite 1", width: 3, height: 2, color: "bg-blue-400", requiredAdjacencies: ["elevator"] },
        { id: "office2", name: "Office Suite 2", width: 3, height: 2, color: "bg-blue-400", requiredAdjacencies: ["elevator"] },
        { id: "apartment1", name: "Apartment A", width: 2, height: 2, color: "bg-green-400", requiredAdjacencies: ["elevator"] },
        { id: "apartment2", name: "Apartment B", width: 2, height: 2, color: "bg-green-400", requiredAdjacencies: ["elevator"] },
      ],
      requirements: [
        { id: "r1", description: "Retail near Entrance", check: (rooms) => {
          const entrance = rooms.find(r => r.roomId === "entrance");
          const retail1 = rooms.find(r => r.roomId === "retail1");
          const retail2 = rooms.find(r => r.roomId === "retail2");
          if (!entrance || !retail1 || !retail2) return false;
          const near1 = Math.abs(entrance.x - retail1.x) <= 2 && Math.abs(entrance.y - retail1.y) <= 2;
          const near2 = Math.abs(entrance.x - retail2.x) <= 2 && Math.abs(entrance.y - retail2.y) <= 2;
          return near1 || near2;
        }},
        { id: "r2", description: "All floors accessible via Elevator", check: (rooms) => {
          const elevator = rooms.find(r => r.roomId === "elevator");
          const office1 = rooms.find(r => r.roomId === "office1");
          const apt1 = rooms.find(r => r.roomId === "apartment1");
          if (!elevator || !office1 || !apt1) return false;
          return office1.y < elevator.y && apt1.y < elevator.y;
        }},
        { id: "r3", description: "Retail on ground floor (y=0 or y=1)", check: (rooms) => {
          const retail1 = rooms.find(r => r.roomId === "retail1");
          const retail2 = rooms.find(r => r.roomId === "retail2");
          if (!retail1 || !retail2) return false;
          return retail1.y >= 0 && retail1.y <= 1 && retail2.y >= 0 && retail2.y <= 1;
        }},
      ],
      timeLimit: 120,
      points: 200,
    },
  ],
};

interface PlacedRoom {
  roomId: string;
  x: number;
  y: number;
}

export default function ArchitectSimulation({ difficulty, onComplete, onOpenSettings, onExit }: ArchitectSimulationProps) {
  const tasks = architectTasks[difficulty];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [placedRooms, setPlacedRooms] = useState<PlacedRoom[]>([]);
  const [draggedRoom, setDraggedRoom] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentTask = tasks[currentTaskIndex];

  // Initialize
  useEffect(() => {
    if (currentTask) {
      setPlacedRooms([]);
      setFeedback(null);
    }
  }, [currentTask]);

  const handleDragStart = (roomId: string) => {
    setDraggedRoom(roomId);
  };

  const handleDrop = (x: number, y: number) => {
    if (!draggedRoom) return;
    
    const room = currentTask.availableRooms.find(r => r.id === draggedRoom);
    if (!room) return;

    // Check if placement is valid (within bounds)
    if (x < 0 || y < 0 || x + room.width > currentTask.gridSize || y + room.height > currentTask.gridSize) {
      return;
    }

    // Check for overlap with existing rooms
    const hasOverlap = placedRooms.some((placed) => {
      const placedRoom = currentTask.availableRooms.find(r => r.id === placed.roomId);
      if (!placedRoom) return false;
      
      return !(x + room.width <= placed.x || x >= placed.x + placedRoom.width ||
               y + room.height <= placed.y || y >= placed.y + placedRoom.height);
    });

    if (hasOverlap) return;

    // Check if room already placed
    if (placedRooms.some(r => r.roomId === draggedRoom)) {
      // Move existing room
      setPlacedRooms(placedRooms.map(r => 
        r.roomId === draggedRoom ? { ...r, x, y } : r
      ));
    } else {
      // Place new room
      setPlacedRooms([...placedRooms, { roomId: draggedRoom, x, y }]);
    }
    
    setDraggedRoom(null);
  };

  const handleSubmit = useCallback(() => {
    if (!currentTask) return;

    // Check all requirements
    const requirementsMet = currentTask.requirements.every(req => req.check(placedRooms));
    const allRoomsPlaced = placedRooms.length === currentTask.availableRooms.length;

    if (requirementsMet && allRoomsPlaced) {
      audioSystem.playSuccessSound();
      let pointsEarned = currentTask.points;
      
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
        setFeedback(null);
      }, 1500);
    }
  }, [currentTask, placedRooms, currentTaskIndex, tasks.length]);

  const handleFinish = () => {
    const success = totalScore > 0;
    onComplete(success, totalScore, tasks.length * 200);
  };

  // Generate grid cells
  const gridCells = [];
  for (let y = 0; y < currentTask.gridSize; y++) {
    for (let x = 0; x < currentTask.gridSize; x++) {
      gridCells.push({ x, y });
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-600 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Design Complete!</h2>
          <p className="text-gray-600 mb-4">
            You created functional, well-designed spaces!
          </p>
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl p-4 mb-6">
            <div className="text-white text-sm">Total Score</div>
            <div className="text-4xl font-bold text-white">{totalScore}</div>
          </div>
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all"
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
          <h2 className="text-xl font-bold text-white mb-2">{currentTask.title}</h2>
          <p className="text-cyan-100">{currentTask.description}</p>
          
          {/* Requirements */}
          <div className="mt-3 space-y-1">
            <span className="text-white font-bold text-sm">Requirements:</span>
            {currentTask.requirements.map((req) => {
              const met = req.check(placedRooms);
              return (
                <div key={req.id} className={`text-sm ${met ? "text-green-300" : "text-white/70"}`}>
                  {met ? "✓" : "○"} {req.description}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room Palette */}
          <div>
            <h3 className="text-white font-bold mb-3">📦 Rooms</h3>
            <p className="text-cyan-200 text-sm mb-2">Drag rooms to the grid</p>
            <div className="space-y-2">
              {currentTask.availableRooms.map((room) => {
                const isPlaced = placedRooms.some(r => r.roomId === room.id);
                return (
                  <div
                    key={room.id}
                    draggable={!isPlaced}
                    onDragStart={() => handleDragStart(room.id)}
                    className={`${room.color} ${isPlaced ? "opacity-50" : ""} rounded-lg p-2 cursor-move hover:scale-105 transition-transform`}
                  >
                    <div className="font-bold text-white">{room.name}</div>
                    <div className="text-white/80 text-xs">{room.width}x{room.height}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-3">📐 Floor Plan ({currentTask.gridSize}x{currentTask.gridSize})</h3>
            <div 
              className="grid gap-1 bg-gray-800 p-2 rounded-lg"
              style={{ 
                gridTemplateColumns: `repeat(${currentTask.gridSize}, 1fr)`,
                aspectRatio: '1'
              }}
            >
              {gridCells.map((cell) => {
                const room = currentTask.availableRooms.find(r => 
                  placedRooms.some(placed => 
                    placed.roomId === r.id &&
                    cell.x >= placed.x &&
                    cell.x < placed.x + r.width &&
                    cell.y >= placed.y &&
                    cell.y < placed.y + r.height
                  )
                );
                
                const isOrigin = placedRooms.some(r => 
                  r.roomId === room?.id &&
                  r.x === cell.x &&
                  r.y === cell.y
                );

                return (
                  <div
                    key={`${cell.x}-${cell.y}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(cell.x, cell.y)}
                    className={`${
                      room 
                        ? room.color + (isOrigin ? " ring-2 ring-white" : "")
                        : "bg-gray-700 hover:bg-gray-600"
                    } rounded transition-colors`}
                  >
                    {isOrigin && room && (
                      <div className="text-white text-[8px] font-bold text-center">
                        {room.name.split(" ")[0]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Placed Rooms List */}
            <div className="mt-4 flex flex-wrap gap-2">
              {placedRooms.map((placed) => {
                const room = currentTask.availableRooms.find(r => r.id === placed.roomId);
                return (
                  <div key={placed.roomId} className="bg-white/20 rounded px-2 py-1 text-white text-sm">
                    {room?.name} @ ({placed.x}, {placed.y})
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 mt-4 text-center">
            <span className="text-green-300 font-bold text-lg">✓ Perfect design!</span>
          </div>
        )}
        {feedback === "incorrect" && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mt-4 text-center">
            <span className="text-red-300 font-bold text-lg">✗ Requirements not met. Try again!</span>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={feedback !== null || placedRooms.length < currentTask.availableRooms.length}
          className="w-full py-3 mt-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
