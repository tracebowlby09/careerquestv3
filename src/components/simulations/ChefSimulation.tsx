"use client";

import { useState, useEffect, useCallback } from "react";
import { Difficulty } from "@/types/game";
import { audioSystem } from "@/lib/audio";

interface ChefSimulationProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
}

interface Order {
  id: string;
  dish: string;
  ingredients: string[];
  prepTime: number;
  difficulty: number;
}

interface Station {
  id: string;
  name: string;
  icon: string;
  occupiedBy: string | null;
  progress: number;
}

interface ChefTask {
  id: string;
  title: string;
  description: string;
  orders: Order[];
  timeLimit: number;
  points: number;
}

const chefTasks: Record<Difficulty, ChefTask[]> = {
  easy: [
    {
      id: "chef-e1",
      title: "Simple Orders",
      description: "Complete these 3 orders. Click ingredients in order, then cook!",
      orders: [
        { id: "o1", dish: "Caesar Salad", ingredients: ["lettuce", "croutons", "parmesan"], prepTime: 10, difficulty: 1 },
        { id: "o2", dish: "Grilled Cheese", ingredients: ["bread", "cheese", "butter"], prepTime: 10, difficulty: 1 },
        { id: "o3", dish: "Tomato Soup", ingredients: ["tomatoes", "cream", "basil"], prepTime: 10, difficulty: 1 },
      ],
      timeLimit: 60,
      points: 100,
    },
  ],
  medium: [
    {
      id: "chef-m1",
      title: "Busy Kitchen",
      description: "Handle 4 orders with varying prep times. Don't burn anything!",
      orders: [
        { id: "o1", dish: "Steak Frites", ingredients: ["steak", "fries", "garlic"], prepTime: 15, difficulty: 2 },
        { id: "o2", dish: "Pasta Carbonara", ingredients: ["pasta", "eggs", "bacon", "cheese"], prepTime: 12, difficulty: 2 },
        { id: "o3", dish: "Fish & Chips", ingredients: ["fish", "potatoes", "tartar"], prepTime: 14, difficulty: 2 },
        { id: "o4", dish: "Chicken Wrap", ingredients: ["chicken", "tortilla", "lettuce", "sauce"], prepTime: 10, difficulty: 1 },
      ],
      timeLimit: 90,
      points: 150,
    },
  ],
  hard: [
    {
      id: "chef-h1",
      title: "Rush Hour",
      description: "6 orders coming in! Multi-task efficiently or orders will pile up!",
      orders: [
        { id: "o1", dish: "Beef Wellington", ingredients: ["beef", "puff pastry", "mushrooms", "ham"], prepTime: 20, difficulty: 3 },
        { id: "o2", dish: "Seafood Paella", ingredients: ["rice", "shrimp", "mussels", "saffron"], prepTime: 18, difficulty: 3 },
        { id: "o3", dish: "Duck Confit", ingredients: ["duck", "potatoes", "thyme", "garlic"], prepTime: 16, difficulty: 3 },
        { id: "o4", dish: "Risotto Milanese", ingredients: ["rice", "saffron", "parmesan", "butter"], prepTime: 15, difficulty: 2 },
        { id: "o5", dish: "Lamb Chops", ingredients: ["lamb", "rosemary", "garlic", "mint"], prepTime: 14, difficulty: 2 },
        { id: "o6", dish: "Tiramisu", ingredients: ["mascarpone", "espresso", "eggs", "cocoa"], prepTime: 12, difficulty: 2 },
      ],
      timeLimit: 120,
      points: 200,
    },
  ],
};

export default function ChefSimulation({ difficulty, onComplete, onOpenSettings, onExit }: ChefSimulationProps) {
  const tasks = chefTasks[difficulty];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [completedOrders, setCompletedOrders] = useState<string[]>([]);
  const [failedOrders, setFailedOrders] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [prepQueue, setPrepQueue] = useState<string[]>([]);
  const [cookingStations, setCookingStations] = useState<Station[]>([
    { id: "grill", name: "Grill", icon: "🔥", occupiedBy: null, progress: 0 },
    { id: "pan", name: "Pan", icon: "🍳", occupiedBy: null, progress: 0 },
    { id: "oven", name: "Oven", icon: "♨️", occupiedBy: null, progress: 0 },
  ]);

  const currentTask = tasks[currentTaskIndex];

  // Initialize
  useEffect(() => {
    if (currentTask && gameStarted) {
      setActiveOrders(currentTask.orders);
    }
  }, [currentTask, gameStarted]);

  // Cooking progress timer
  useEffect(() => {
    if (!gameStarted) return;
    
    const cookingTimer = setInterval(() => {
      setCookingStations((stations) => 
        stations.map((station) => {
          if (station.occupiedBy && station.progress < 100) {
            const newProgress = station.progress + 10;
            if (newProgress >= 100) {
              // Order complete
              setCompletedOrders((prev) => [...prev, station.occupiedBy!]);
              setTimeout(() => {
                setCookingStations((s) =>
                  s.map((st) =>
                    st.id === station.id
                      ? { ...st, occupiedBy: null, progress: 0 }
                      : st
                  )
                );
              }, 500);
              return { ...station, progress: 100 };
            }
            return { ...station, progress: newProgress };
          }
          return station;
        })
      );
    }, 500);

    return () => clearInterval(cookingTimer);
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    audioSystem.playClickSound();
  };

  const addToPrep = (ingredient: string) => {
    if (!prepQueue.includes(ingredient)) {
      setPrepQueue([...prepQueue, ingredient]);
    }
  };

  const clearPrep = () => {
    setPrepQueue([]);
  };

  const startCooking = (stationId: string) => {
    if (prepQueue.length === 0) return;
    
    const order = activeOrders.find((o) => {
      const ingredientsMatch = o.ingredients.every((i) => prepQueue.includes(i));
      return ingredientsMatch && !completedOrders.includes(o.id) && !failedOrders.includes(o.id);
    });

    if (!order) {
      // Wrong ingredients
      setPrepQueue([]);
      return;
    }

    const station = cookingStations.find((s) => s.id === stationId);
    if (station?.occupiedBy) return;

    setCookingStations((stations) =>
      stations.map((s) =>
        s.id === stationId ? { ...s, occupiedBy: order.id, progress: 0 } : s
      )
    );
    setPrepQueue([]);
  };

  const handleGameEnd = useCallback(() => {
    const passed = completedOrders.length >= currentTask.orders.length * 0.6;
    
    if (passed) {
      audioSystem.playSuccessSound();
      const points = completedOrders.length * 30;
      setTotalScore(points);
      setShowSuccess(true);
    } else {
      audioSystem.playFailureSound();
      setShowSuccess(true);
    }
  }, [completedOrders, currentTask]);

  const handleFinish = () => {
    const success = completedOrders.length >= currentTask.orders.length * 0.6;
    onComplete(success, totalScore, currentTask.orders.length * 30);
  };

  const allIngredients = [...new Set(currentTask.orders.flatMap((o) => o.ingredients))];

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-500 to-yellow-500 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kitchen Closed!</h2>
          <p className="text-gray-600 mb-4">
            You completed {completedOrders.length} of {currentTask.orders.length} orders!
          </p>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 mb-6">
            <div className="text-white text-sm">Total Score</div>
            <div className="text-4xl font-bold text-white">{totalScore}</div>
          </div>
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-500 to-yellow-500 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentTask.title}</h2>
          <p className="text-gray-600 mb-6">{currentTask.description}</p>
          
          <div className="text-left bg-gray-100 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-2">📋 Orders:</h3>
            <ul className="space-y-1">
              {currentTask.orders.map((order) => (
                <li key={order.id} className="text-gray-600">
                  • {order.dish} ({order.ingredients.join(", ")})
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={startGame}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all"
          >
            🔥 Start Cooking!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-500 to-yellow-500 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">👨‍🍳 Chef Simulation</h1>
            <p className="text-orange-200">Orders: {completedOrders.length}/{currentTask.orders.length}</p>
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

        {/* Active Orders */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {currentTask.orders.map((order) => {
            const isComplete = completedOrders.includes(order.id);
            const isFailed = failedOrders.includes(order.id);
            return (
              <div
                key={order.id}
                className={`rounded-lg p-2 text-center ${
                  isComplete ? "bg-green-500" : isFailed ? "bg-red-500" : "bg-white/90"
                }`}
              >
                <div className={`font-bold text-sm ${isComplete || isFailed ? "text-white" : "text-gray-800"}`}>
                  {order.dish}
                </div>
                {isComplete && <span className="text-white">✓ Done!</span>}
                {isFailed && <span className="text-white">✗ Burnt!</span>}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingredients */}
          <div>
            <h3 className="text-white font-bold mb-3">🥗 Ingredients</h3>
            <p className="text-orange-200 text-sm mb-2">Click ingredients to add to prep (must match an order)</p>
            <div className="flex flex-wrap gap-2">
              {allIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => addToPrep(ingredient)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all ${
                    prepQueue.includes(ingredient)
                      ? "bg-orange-500 text-white"
                      : "bg-white hover:bg-orange-100 text-gray-800"
                  }`}
                >
                  {ingredient}
                </button>
              ))}
            </div>

            {/* Prep Queue */}
            <div className="mt-4 bg-white/90 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">Prep Queue:</span>
                <button onClick={clearPrep} className="text-sm text-red-500">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {prepQueue.length === 0 ? (
                  <span className="text-gray-500 text-sm">Click ingredients above</span>
                ) : (
                  prepQueue.map((item) => (
                    <span key={item} className="bg-orange-200 px-2 py-1 rounded text-sm">
                      {item}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Cooking Stations */}
          <div>
            <h3 className="text-white font-bold mb-3">🔥 Cooking Stations</h3>
            <div className="space-y-3">
              {cookingStations.map((station) => (
                <div key={station.id} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-bold">{station.icon} {station.name}</span>
                    <button
                      onClick={() => startCooking(station.id)}
                      disabled={station.occupiedBy !== null || prepQueue.length === 0}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50"
                    >
                      Cook!
                    </button>
                  </div>
                  {station.occupiedBy && (
                    <div>
                      <div className="text-white text-sm mb-1">
                        Cooking: {currentTask.orders.find((o) => o.id === station.occupiedBy)?.dish}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${station.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
