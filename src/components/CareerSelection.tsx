"use client";

import { Career, GameMode } from "@/types/game";
import ScreenWrapper from "./ScreenWrapper";
import { GradientCard, AnimatedIcon, AnimatedContainer, Badge } from "./ui/UIComponents";

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
    description: "Write code, solve problems, and build digital solutions.",
    skills: ["Logic", "Debugging", "Problem Solving"],
  },
  {
    id: "nurse",
    title: "Registered Nurse",
    icon: "🏥",
    description: "Care for patients and make critical healthcare decisions.",
    skills: ["Prioritization", "Critical Thinking", "Empathy"],
  },
  {
    id: "engineer",
    title: "Civil Engineer",
    icon: "🏗️",
    description: "Design structures and balance technical constraints.",
    skills: ["Analysis", "Design", "Constraint Management"],
  },
  {
    id: "teacher",
    title: "Teacher",
    icon: "👩‍🏫",
    description: "Educate students and manage classroom dynamics.",
    skills: ["Communication", "Patience", "Leadership"],
  },
  {
    id: "chef",
    title: "Head Chef",
    icon: "👨‍🍳",
    description: "Create culinary experiences and manage kitchen operations.",
    skills: ["Creativity", "Time Management", "Quality Control"],
  },
  {
    id: "architect",
    title: "Architect",
    icon: "🏛️",
    description: "Design buildings that balance form, function, and safety.",
    skills: ["Spatial Thinking", "Problem Solving", "Sustainability"],
  },
  {
    id: "lawyer",
    title: "Lawyer",
    icon: "⚖️",
    description: "Analyze cases, apply legal reasoning, and advocate for clients.",
    skills: ["Critical Thinking", "Legal Knowledge", "Ethical Reasoning"],
  },
  {
    id: "retail",
    title: "Retail Worker",
    icon: "🛍️",
    description: "Serve customers and manage store operations efficiently.",
    skills: ["Customer Service", "Problem Solving", "Sales"],
  },
  {
    id: "electrician",
    title: "Electrician",
    icon: "⚡",
    description: "Install and maintain electrical systems safely",
    skills: ["Technical Knowledge", "Safety Protocols", "Troubleshooting."],
  },
];

const careerGradients: Record<Career, string> = {
  programmer: "from-blue-500 to-indigo-600",
  nurse: "from-red-500 to-rose-600",
  engineer: "from-cyan-500 to-blue-600",
  teacher: "from-indigo-400 to-blue-500",
  chef: "from-amber-500 to-orange-600",
  architect: "from-violet-500 to-purple-600",
  lawyer: "from-blue-600 to-indigo-700",
  retail: "from-pink-500 to-rose-600",
  electrician: "from-yellow-500 to-amber-600",
};

export default function CareerSelection({ onSelectCareer, onOpenSettings, onExit, gameMode }: CareerSelectionProps) {
  const isQuickRecall = gameMode === "quick-recall";

  const handleSelect = (career: Career) => {
    if (typeof window !== 'undefined') {
      const { audioSystem } = require('@/lib/audio');
      audioSystem.playClickSound();
    }
    onSelectCareer(career);
  };

  return (
    <ScreenWrapper onOpenSettings={onOpenSettings} onExit={onExit}>
      <div className="text-center mb-12">
        {isQuickRecall ? (
          <>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3 rounded-full mb-6 shadow-xl animate-pulse">
              <AnimatedIcon animate="none" className="text-3xl">🚀</AnimatedIcon>
              <span className="text-white font-bold text-2xl tracking-wide">QUICK RECALL</span>
              <AnimatedIcon animate="none" className="text-3xl">🚀</AnimatedIcon>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Test Your Knowledge
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Select a career to answer rapid-fire questions under time pressure
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Choose Your Career Path
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Select a career to explore and complete a real-world challenge
            </p>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {careers.map((career, index) => (
          <AnimatedContainer key={career.id} delay={index * 50}>
            <button
              onClick={() => handleSelect(career.id)}
              className={`
                relative group overflow-hidden rounded-2xl p-8 shadow-xl 
                hover:shadow-2xl hover:scale-105 hover:-translate-y-2 
                transition-all duration-300 text-left
                bg-gradient-to-br ${careerGradients[career.id]}
                border-2 border-white/30
              `}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="text-7xl mb-5 text-center transform group-hover:scale-110 transition-transform duration-300">
                  <AnimatedIcon animate="none">{career.icon}</AnimatedIcon>
                </div>
                
                <h3 className="text-2xl font-extrabold text-white mb-3 text-center drop-shadow-md">
                  {career.title}
                </h3>
                
                <p className="text-white/90 mb-5 text-center text-sm font-medium">
                  {career.description}
                </p>
                
                <div className="space-y-3">
                  <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Skills You'll Master:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {career.skills.map((skill) => (
                      <Badge key={skill} variant="trophy" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-white/30 text-center">
                  <span className="inline-flex items-center gap-2 text-white font-bold">
                    <span>Start</span>
                    <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </button>
          </AnimatedContainer>
        ))}
      </div>

      <div className="mt-12 text-center">
        {isQuickRecall && (
          <p className="text-white/60 text-sm mb-4 flex items-center justify-center gap-2">
            <AnimatedIcon animate="pulse" className="text-lg">⏱️</AnimatedIcon>
            Answer as many questions as possible before time runs out!
          </p>
        )}
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-white/50 text-white hover:bg-white/10 transition-all duration-300"
        >
          ← Back to Title
        </button>
      </div>
    </ScreenWrapper>
  );
}