"use client";

import { Career, GameMode } from "@/types/game";
import ScreenWrapper from "./ScreenWrapper";

interface CareerOption {
  id: Career;
  title: string;
  icon: string;
  description: string;
  skills: string[];
}

interface CareerSelectionProps {
  onSelectCareer: (career: Career) => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  gameMode?: GameMode;
}

const careers: CareerOption[] = [
  {
    id: "programmer",
    title: "Software Programmer",
    icon: "💻",
    description: "Write code, solve problems, and build digital solutions",
    skills: ["Logic", "Debugging", "Problem Solving"],
  },
  {
    id: "nurse",
    title: "Registered Nurse",
    icon: "🏥",
    description: "Care for patients and make critical healthcare decisions",
    skills: ["Prioritization", "Critical Thinking", "Empathy"],
  },
  {
    id: "engineer",
    title: "Civil Engineer",
    icon: "🏗️",
    description: "Design structures and balance technical constraints",
    skills: ["Analysis", "Design", "Constraint Management"],
  },
  {
    id: "teacher",
    title: "Teacher",
    icon: "👩‍🏫",
    description: "Educate students and manage classroom dynamics",
    skills: ["Communication", "Patience", "Leadership"],
  },
  {
    id: "chef",
    title: "Head Chef",
    icon: "👨‍🍳",
    description: "Create culinary experiences and manage kitchen operations",
    skills: ["Creativity", "Time Management", "Quality Control"],
  },
  {
    id: "architect",
    title: "Architect",
    icon: "🏛️",
    description: "Design buildings that balance form, function, and safety",
    skills: ["Spatial Thinking", "Problem Solving", "Sustainability"],
  },
];

export default function CareerSelection({ onSelectCareer, onOpenSettings, onExit, gameMode }: CareerSelectionProps) {
  const isQuickRecall = gameMode === "quick-recall";
  const isSimulation = gameMode === "simulation";

  const handleSelect = (career: Career) => {
    if (typeof window !== 'undefined') {
      const { audioSystem } = require('@/lib/audio');
      audioSystem.playClickSound();
    }
    onSelectCareer(career);
  };

  // Challenge Mode - Original Card Design
  if (!isQuickRecall && !isSimulation) {
    return (
      <ScreenWrapper onOpenSettings={onOpenSettings} onExit={onExit}>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Career Path
          </h2>
          <p className="text-xl text-white/90">
            Select a career to explore and complete a real-world challenge
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {careers.map((career) => (
            <button
              key={career.id}
              onClick={() => handleSelect(career.id)}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 text-left"
            >
              <div className="text-6xl mb-4 text-center">{career.icon}</div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                {career.title}
              </h3>
              
              <p className="text-gray-600 mb-4 text-center">
                {career.description}
              </p>
              
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Skills You&apos;ll Learn:
                </p>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-purple-600 font-semibold">
                  Start Challenge →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Challenge Mode Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white/80 rounded-xl transition-colors border border-white/20"
          >
            ← Back to Title
          </button>
        </div>
      </ScreenWrapper>
    );
  }

  // Simulation Mode - Unique Interactive Career Experiences
  if (isSimulation) {
    return (
      <ScreenWrapper onOpenSettings={onOpenSettings} onExit={onExit}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2 rounded-full mb-4 shadow-lg animate-pulse">
            <span className="text-2xl">🎮</span>
            <span className="text-white font-bold text-lg">SIMULATION MODE</span>
            <span className="text-2xl">🎮</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experience Real Careers
          </h2>
          <p className="text-xl text-white/80">
            Choose a simulation to dive into an interactive job experience
          </p>
        </div>

        {/* Simulation Cards - Each with unique career-specific design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Programmer - Bug Fix Sprint */}
          <button
            onClick={() => handleSelect("programmer")}
            className="group relative overflow-hidden rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(145deg, #1e1e2e 0%, #2d2d44 100%)',
              border: '2px solid #6366f1',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-5xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300">💻</div>
              <h3 className="text-2xl font-bold text-white mb-2 text-center font-mono">Bug Fix Sprint</h3>
              <p className="text-indigo-300 text-center mb-4 text-sm font-mono">
                Fix code bugs under deadline pressure. Multiple choice challenges!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="bg-indigo-600/50 text-indigo-200 text-xs px-3 py-1 rounded-full font-mono">🐛 Debug</span>
                <span className="bg-indigo-600/50 text-indigo-200 text-xs px-3 py-1 rounded-full font-mono">⏱️ Speed</span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold group-hover:bg-indigo-500 transition-colors font-mono">
                  Start Simulation →
                </span>
              </div>
            </div>
            {/* Code pattern decoration */}
            <div className="absolute bottom-0 right-0 text-8xl opacity-5 group-hover:opacity-10 transition-opacity font-mono">
              {'</>'}
            </div>
          </button>

          {/* Nurse - Emergency Room Shift */}
          <button
            onClick={() => handleSelect("nurse")}
            className="group relative overflow-hidden rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '2px solid #ef4444',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-5xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300">🏥</div>
              <h3 className="text-2xl font-bold text-white mb-2 text-center font-serif">Emergency Room Shift</h3>
              <p className="text-red-300 text-center mb-4 text-sm font-serif">
                Triage patients and provide life-saving treatments!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="bg-red-600/50 text-red-200 text-xs px-3 py-1 rounded-full font-serif">🚑 Triage</span>
                <span className="bg-red-600/50 text-red-200 text-xs px-3 py-1 rounded-full font-serif">💊 Treatment</span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-semibold group-hover:bg-red-500 transition-colors font-serif">
                  Start Simulation →
                </span>
              </div>
            </div>
            {/* Heartbeat decoration */}
            <div className="absolute bottom-0 right-0 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">
              ❤️
            </div>
          </button>

          {/* Engineer - Bridge Builder */}
          <button
            onClick={() => handleSelect("engineer")}
            className="group relative overflow-hidden rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
              border: '2px solid #06b6d4',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-5xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300">🏗️</div>
              <h3 className="text-2xl font-bold text-white mb-2 text-center font-sans">Bridge Builder</h3>
              <p className="text-cyan-300 text-center mb-4 text-sm font-sans">
                Design and stress-test bridges. Build structures that last!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="bg-cyan-600/50 text-cyan-200 text-xs px-3 py-1 rounded-full font-sans">📐 Design</span>
                <span className="bg-cyan-600/50 text-cyan-200 text-xs px-3 py-1 rounded-full font-sans">🧪 Stress Test</span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-full font-semibold group-hover:bg-cyan-500 transition-colors font-sans">
                  Start Simulation →
                </span>
              </div>
            </div>
            {/* Bridge decoration */}
            <div className="absolute bottom-0 right-0 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">
              🌉
            </div>
          </button>

          {/* Teacher - Classroom Management */}
          <button
            onClick={() => handleSelect("teacher")}
            className="group relative overflow-hidden rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(145deg, #14532d 0%, #166534 100%)',
              border: '2px solid #22c55e',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-5xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300">👩‍🏫</div>
              <h3 className="text-2xl font-bold text-white mb-2 text-center font-serif">Classroom Management</h3>
              <p className="text-green-300 text-center mb-4 text-sm font-serif">
                Keep students engaged and handle classroom events!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="bg-green-600/50 text-green-200 text-xs px-3 py-1 rounded-full font-serif">📚 Teach</span>
                <span className="bg-green-600/50 text-green-200 text-xs px-3 py-1 rounded-full font-serif">🎯 Engage</span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full font-semibold group-hover:bg-green-500 transition-colors font-serif">
                  Start Simulation →
                </span>
              </div>
            </div>
            {/* Books decoration */}
            <div className="absolute bottom-0 right-0 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">
              📚
            </div>
          </button>

          {/* Chef - Dinner Rush */}
          <button
            onClick={() => handleSelect("chef")}
            className="group relative overflow-hidden rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(145deg, #451a03 0%, #78350f 100%)',
              border: '2px solid #f59e0b',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-5xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300">👨‍🍳</div>
              <h3 className="text-2xl font-bold text-white mb-2 text-center font-serif italic">Dinner Rush</h3>
              <p className="text-amber-300 text-center mb-4 text-sm font-serif italic">
                Manage orders, cook dishes, and handle special requests!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="bg-amber-600/50 text-amber-200 text-xs px-3 py-1 rounded-full font-serif italic">🍳 Cook</span>
                <span className="bg-amber-600/50 text-amber-200 text-xs px-3 py-1 rounded-full font-serif italic">🛎️ Orders</span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-full font-semibold group-hover:bg-amber-500 transition-colors font-serif italic">
                  Start Simulation →
                </span>
              </div>
            </div>
            {/* Fire decoration */}
            <div className="absolute bottom-0 right-0 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">
              🔥
            </div>
          </button>

          {/* Architect - Dream House Design */}
          <button
            onClick={() => handleSelect("architect")}
            className="group relative overflow-hidden rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
              background: 'linear-gradient(145deg, #2e1065 0%, #4c1d95 100%)',
              border: '2px solid #a855f7',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-5xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300">🏛️</div>
              <h3 className="text-2xl font-bold text-white mb-2 text-center font-mono tracking-wider">Dream House Design</h3>
              <p className="text-purple-300 text-center mb-4 text-sm font-mono">
                Create client dream homes within budget and zoning rules!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="bg-purple-600/50 text-purple-200 text-xs px-3 py-1 rounded-full font-mono">🏠 Design</span>
                <span className="bg-purple-600/50 text-purple-200 text-xs px-3 py-1 rounded-full font-mono">💰 Budget</span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full font-semibold group-hover:bg-purple-500 transition-colors font-mono">
                  Start Simulation →
                </span>
              </div>
            </div>
            {/* Blueprint decoration */}
            <div className="absolute bottom-0 right-0 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">
              📐
            </div>
          </button>
        </div>

        {/* Simulation Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm mb-4">
            🎯 No timers - take your time to experience each role!
          </p>
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white/80 rounded-xl transition-colors border border-white/20"
          >
            ← Back to Title
          </button>
        </div>
      </ScreenWrapper>
    );
  }

  // Quick Recall Mode - Unique Visual Design
  return (
    <ScreenWrapper onOpenSettings={onOpenSettings} onExit={onExit}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 rounded-full mb-4 shadow-lg">
          <span className="text-2xl">⚡</span>
          <span className="text-white font-bold text-lg">QUICK RECALL</span>
          <span className="text-2xl">⚡</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Test Your Knowledge
        </h2>
        <p className="text-xl text-white/80">
          Select a career to answer rapid-fire questions
        </p>
      </div>

      {/* Quick Recall Grid - More compact and energetic */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {careers.map((career, index) => (
          <button
            key={career.id}
            onClick={() => handleSelect(career.id)}
            className="relative group overflow-hidden rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            style={{
              background: `linear-gradient(135deg, ${getCareerGradient(index).start} 0%, ${getCareerGradient(index).end} 100%)`,
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] animate-pulse" />
            </div>
            
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {career.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
                {career.title}
              </h3>
              
              <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">Start →</span>
              </div>
            </div>
            
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
              <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rotate-45 transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Quick Recall Footer */}
      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm mb-4">
          ⏱️ Answer as many questions as you can before time runs out!
        </p>
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white/80 rounded-xl transition-colors border border-white/20"
        >
          ← Back to Title
        </button>
      </div>
    </ScreenWrapper>
  );
}

// Helper function to get career-specific gradients for Quick Recall
function getCareerGradient(index: number): { start: string; end: string } {
  const gradients = [
    { start: '#667eea', end: '#764ba2' }, // Purple - Programmer
    { start: '#f97316', end: '#ef4444' }, // Orange-Red - Nurse
    { start: '#06b6d4', end: '#3b82f6' }, // Cyan-Blue - Engineer
    { start: '#10b981', end: '#059669' }, // Emerald - Teacher
    { start: '#f59e0b', end: '#d97706' }, // Amber - Chef
    { start: '#8b5cf6', end: '#6366f1' }, // Violet-Indigo - Architect
  ];
  return gradients[index % gradients.length];
}
