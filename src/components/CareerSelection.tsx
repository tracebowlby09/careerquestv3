"use client";

import { Career } from "@/types/game";
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
    title: "Professional Chef",
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

export default function CareerSelection({ onSelectCareer, onOpenSettings, onExit }: CareerSelectionProps) {
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
    </ScreenWrapper>
  );
}
