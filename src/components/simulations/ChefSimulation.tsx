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

interface Dish {
  id: string;
  name: string;
  emoji: string;
  ingredients: string[];
  prepTime: number;
  cookTime: number;
  difficulty: number;
  specialRequests?: string[];
}

interface Order {
  id: string;
  dish: Dish;
  status: "pending" | "cooking" | "ready" | "burnt" | "served";
  progress: number;
  patience: number;
  specialRequest?: string;
}

interface Station {
  id: string;
  name: string;
  icon: string;
  occupiedBy: Order | null;
  progress: number;
  type: "grill" | "pan" | "oven" | "plate";
}

const menu: Record<Difficulty, Dish[]> = {
  easy: [
    { id: "salad", name: "Caesar Salad", emoji: "🥗", ingredients: ["lettuce", "croutons", "parmesan", "dressing"], prepTime: 2, cookTime: 0, difficulty: 1 },
    { id: "grilled_cheese", name: "Grilled Cheese", emoji: "🧀", ingredients: ["bread", "cheese", "butter"], prepTime: 1, cookTime: 3, difficulty: 1 },
    { id: "soup", name: "Tomato Soup", emoji: "🍅", ingredients: ["tomatoes", "cream", "basil"], prepTime: 2, cookTime: 4, difficulty: 1 },
  ],
  medium: [
    { id: "steak", name: "Steak Frites", emoji: "🥩", ingredients: ["steak", "potatoes", "garlic", "herbs"], prepTime: 2, cookTime: 6, difficulty: 2 },
    { id: "pasta", name: "Pasta Carbonara", emoji: "🍝", ingredients: ["pasta", "eggs", "bacon", "cheese"], prepTime: 2, cookTime: 5, difficulty: 2 },
    { id: "fish", name: "Fish & Chips", emoji: "🐟", ingredients: ["fish", "potatoes", "tartar", "lemon"], prepTime: 2, cookTime: 5, difficulty: 2 },
    { id: "wrap", name: "Chicken Wrap", emoji: "🌯", ingredients: ["chicken", "tortilla", "lettuce", "sauce"], prepTime: 2, cookTime: 3, difficulty: 1 },
  ],
  hard: [
    { id: "wellington", name: "Beef Wellington", emoji: "🥘", ingredients: ["beef", "puff pastry", "mushrooms", "ham"], prepTime: 3, cookTime: 8, difficulty: 3 },
    { id: "paella", name: "Seafood Paella", emoji: "🥘", ingredients: ["rice", "shrimp", "mussels", "saffron"], prepTime: 3, cookTime: 7, difficulty: 3 },
    { id: "duck", name: "Duck Confit", emoji: "🦆", ingredients: ["duck", "potatoes", "thyme", "garlic"], prepTime: 3, cookTime: 6, difficulty: 3 },
    { id: "risotto", name: "Risotto Milanese", emoji: "🍚", ingredients: ["rice", "saffron", "parmesan", "butter"], prepTime: 2, cookTime: 5, difficulty: 2 },
    { id: "lamb", name: "Lamb Chops", emoji: "🍖", ingredients: ["lamb", "rosemary", "garlic", "mint"], prepTime: 2, cookTime: 5, difficulty: 2 },
  ],
};

const specialRequests = [
  "No onions",
  "Extra spicy",
  "Gluten-free",
  "Well done",
  "Rare",
  "Extra cheese",
  "No salt",
  "Extra sauce",
];

export default function ChefSimulation({ difficulty, onComplete, onOpenSettings, onExit }: ChefSimulationProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stations, setStations] = useState<Station[]>([
    { id: "grill", name: "Grill", icon: "🔥", occupiedBy: null, progress: 0, type: "grill" },
    { id: "pan1", name: "Pan 1", icon: "🍳", occupiedBy: null, progress: 0, type: "pan" },
    { id: "pan2", name: "Pan 2", icon: "🍳", occupiedBy: null, progress: 0, type: "pan" },
    { id: "oven", name: "Oven", icon: "♨️", occupiedBy: null, progress: 0, type: "oven" },
  ]);
  const [prepQueue, setPrepQueue] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [burntOrders, setBurntOrders] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [targetOrders, setTargetOrders] = useState(5);
  const [fadeIn, setFadeIn] = useState(false);

  const currentMenu = menu[difficulty];

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

    const generateOrder = () => {
      if (orders.length >= 6) return;
      
      const randomDish = currentMenu[Math.floor(Math.random() * currentMenu.length)];
      const randomRequest = Math.random() > 0.7 ? specialRequests[Math.floor(Math.random() * specialRequests.length)] : undefined;
      
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        dish: randomDish,
        status: "pending",
        progress: 0,
        patience: 100,
        specialRequest: randomRequest,
      };
      
      setOrders((prev) => [...prev, newOrder]);
      audioSystem.playClickSound();
    };

    generateOrder();
    const interval = setInterval(generateOrder, 8000);
    return () => clearInterval(interval);
  }, [gameStarted, currentMenu, orders.length]);

  useEffect(() => {
    if (!gameStarted) return;

    const tick = setInterval(() => {
      setOrders((prev) => prev.map((order) => ({
        ...order,
        patience: Math.max(0, order.patience - 2),
      })));

      setStations((prev) => prev.map((station) => {
        if (!station.occupiedBy) return station;

        const newProgress = station.progress + 8;
        const cookTime = station.occupiedBy.dish.cookTime * 10;

        if (newProgress >= cookTime) {
          setOrders((prev) => prev.map((o) => 
            o.id === station.occupiedBy!.id 
              ? { ...o, status: "ready", progress: cookTime }
              : o
          ));
          return { ...station, occupiedBy: null, progress: 0 };
        }

        if (newProgress >= cookTime + 20) {
          setOrders((prev) => prev.map((o) => 
            o.id === station.occupiedBy!.id 
              ? { ...o, status: "burnt", progress: cookTime + 20 }
              : o
          ));
          audioSystem.playFailureSound();
          setBurntOrders((prev) => prev + 1);
          setFeedback("🔥 Order burnt! Customer is angry!");
          return { ...station, occupiedBy: null, progress: 0 };
        }

        setOrders((prev) => prev.map((o) => 
          o.id === station.occupiedBy!.id 
            ? { ...o, progress: newProgress }
            : o
        ));

        return { ...station, progress: newProgress };
      }));

      setOrders((prev) => {
        const removed = prev.filter((o) => o.patience <= 0 && o.status === "pending");
        if (removed.length > 0) {
          audioSystem.playFailureSound();
          setFeedback("😠 Customer left! Too slow!");
        }
        return prev.filter((o) => o.patience > 0 || o.status !== "pending");
      });
    }, 500);

    return () => clearInterval(tick);
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setTargetOrders(difficulty === "easy" ? 5 : difficulty === "medium" ? 8 : 10);
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
    const station = stations.find((s) => s.id === stationId);
    if (station?.occupiedBy) return;

    const matchingOrder = orders.find((order) => {
      if (order.status !== "pending") return false;
      const hasAllIngredients = order.dish.ingredients.every((i) => prepQueue.includes(i));
      return hasAllIngredients;
    });

    if (!matchingOrder) {
      setFeedback("❌ Wrong ingredients! Check the order requirements.");
      return;
    }

    setOrders((prev) => prev.map((o) => 
      o.id === matchingOrder.id 
        ? { ...o, status: "cooking", progress: 0 }
        : o
    ));

    setStations((prev) => prev.map((s) => 
      s.id === stationId 
        ? { ...s, occupiedBy: matchingOrder, progress: 0 }
        : s
    ));

    setPrepQueue([]);
    setFeedback("");
    audioSystem.playClickSound();
  };

  const serveOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== "ready") return;

    let bonus = 0;
    if (order.specialRequest) {
      bonus = 20;
    }

    const basePoints = order.dish.difficulty * 30;
    const patienceBonus = Math.floor(order.patience / 10);
    const points = basePoints + patienceBonus + bonus;

    setScore((prev) => prev + points);
    setCompletedOrders((prev) => prev + 1);
    audioSystem.playSuccessSound();
    setFeedback(`✅ Served ${order.dish.name}! +${points} points`);

    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    if (completedOrders + 1 >= targetOrders) {
      setTimeout(() => setShowSuccess(true), 1000);
    }
  };

  const trashOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    setFeedback("🗑️ Order trashed");
  };

  const handleFinish = () => {
    const success = completedOrders >= targetOrders * 0.6;
    onComplete(success, score, targetOrders * 100);
  };

  const allIngredients = [...new Set(currentMenu.flatMap((d) => d.ingredients))];

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-500 to-yellow-500 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform scale-100 animate-bounce">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kitchen Closed!</h2>
          <p className="text-gray-600 mb-4">
            You served {completedOrders} of {targetOrders} orders!
          </p>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 mb-6">
            <div className="text-white text-sm">Total Score</div>
            <div className="text-4xl font-bold text-white">{score}</div>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            {burntOrders > 0 && <span>🔥 {burntOrders} orders burnt</span>}
          </div>
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105"
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
          <div className="text-6xl mb-4 animate-bounce">👨‍🍳</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Dinner Rush</h2>
          <p className="text-gray-600 mb-6">
            Serve {targetOrders} orders before customers leave!
          </p>
          
          <div className="text-left bg-gray-100 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-2">📋 Menu:</h3>
            <div className="space-y-1">
              {currentMenu.map((dish) => (
                <div key={dish.id} className="text-gray-600 flex items-center gap-2">
                  <span>{dish.emoji}</span>
                  <span>{dish.name}</span>
                  <span className="text-xs text-gray-400">({dish.ingredients.join(", ")})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-left bg-gray-100 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-2">🎮 How to Play:</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Orders appear automatically</li>
              <li>• Click ingredients to prepare</li>
              <li>• Put on a station to cook</li>
              <li>• Serve before it burns!</li>
              <li>• Watch out for special requests!</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105"
          >
            🔥 Start Service!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-600 via-red-500 to-yellow-500 p-4 md:p-8 transition-all duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">👨‍🍳 Dinner Rush</h1>
            <p className="text-orange-200">Served: {completedOrders}/{targetOrders}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-white">{score} pts</div>
            <button
              onClick={onExit}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-colors border border-red-500/30"
            >
              🚪 Exit
            </button>
          </div>
        </div>

        {feedback && (
          <div className="bg-white/20 backdrop-blur rounded-lg p-2 mb-4 text-center text-white font-bold animate-pulse">
            {feedback}
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-white font-bold mb-2">📋 Orders ({orders.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {orders.map((order) => {
              const statusColor = 
                order.status === "burnt" ? "bg-red-600 animate-pulse" :
                order.status === "ready" ? "bg-green-500 animate-bounce" :
                order.status === "cooking" ? "bg-yellow-500" :
                order.patience < 30 ? "bg-red-400" : "bg-white";
              
              return (
                <div
                  key={order.id}
                  className={`${statusColor} rounded-lg p-2 text-center relative shadow-lg transform transition-all hover:scale-105`}
                >
                  <div className="text-3xl">{order.dish.emoji}</div>
                  <div className="font-bold text-sm text-gray-800">{order.dish.name}</div>
                  {order.specialRequest && (
                    <div className="text-xs bg-purple-500 text-white px-1 rounded mt-1 font-medium">
                      💫 {order.specialRequest}
                    </div>
                  )}
                  
                  {order.status === "pending" && (
                    <div className="w-full bg-gray-300 rounded-full h-1 mt-2">
                      <div 
                        className={`h-1 rounded-full ${order.patience < 30 ? "bg-red-500 animate-pulse" : "bg-green-500"}`}
                        style={{ width: `${order.patience}%` }}
                      />
                    </div>
                  )}
                  
                  {order.status === "cooking" && (
                    <div className="w-full bg-gray-300 rounded-full h-1 mt-2">
                      <div 
                        className="bg-yellow-700 h-1 rounded-full transition-all duration-200"
                        style={{ width: `${(order.progress / (order.dish.cookTime * 10)) * 100}%` }}
                      />
                    </div>
                  )}
                  
                  {order.status === "ready" && (
                    <button
                      onClick={() => serveOrder(order.id)}
                      className="mt-2 w-full py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-bold transition-all transform hover:scale-105"
                    >
                      ✓ Serve!
                    </button>
                  )}
                  {(order.status === "burnt" || order.patience <= 0) && (
                    <button
                      onClick={() => trashOrder(order.id)}
                      className="mt-2 w-full py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-bold"
                    >
                      🗑️ Trash
                    </button>
                  )}
                </div>
              );
            })}
            {orders.length === 0 && (
              <div className="col-span-3 text-center text-white/50 py-4">
                Waiting for orders...
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h3 className="text-white font-bold mb-2">🥗 Ingredients</h3>
            <p className="text-orange-200 text-xs mb-2">Click to add to prep (must match an order)</p>
            <div className="flex flex-wrap gap-2">
              {allIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => addToPrep(ingredient)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                    prepQueue.includes(ingredient)
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-white hover:bg-orange-100 text-gray-800"
                  }`}
                >
                  {ingredient}
                </button>
              ))}
            </div>

            <div className="mt-4 bg-white/90 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">Prep Queue:</span>
                <button onClick={clearPrep} className="text-sm text-red-500 hover:text-red-700">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {prepQueue.length === 0 ? (
                  <span className="text-gray-500 text-sm">Click ingredients above</span>
                ) : (
                  prepQueue.map((item) => (
                    <span key={item} className="bg-orange-200 px-2 py-1 rounded text-sm font-medium">
                      {item}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-2">🔥 Cooking Stations</h3>
            <div className="space-y-2">
              {stations.map((station) => (
                <div key={station.id} className="bg-gray-900 rounded-lg p-3 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">{station.icon} {station.name}</span>
                    {station.occupiedBy ? (
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">{station.occupiedBy.dish.emoji} {station.occupiedBy.dish.name}</span>
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-200 ${
                              station.progress > station.occupiedBy.dish.cookTime * 10 ? "bg-red-500 animate-pulse" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(100, (station.progress / (station.occupiedBy.dish.cookTime * 10)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startCooking(station.id)}
                        disabled={prepQueue.length === 0}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm disabled:opacity-50 transition-all transform hover:scale-105"
                      >
                        Cook
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
