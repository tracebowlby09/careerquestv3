"use client";

import { Career, Difficulty } from "@/types/game";
import ScreenWrapper from "./ScreenWrapper";

interface OutcomeScreenProps {
  career: Career;
  difficulty: Difficulty;
  success: boolean;
  score: number;
  total: number;
  onPlayAgain: () => void;
  onNewCareer: () => void;
  onChangeDifficulty: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
}

const careerData = {
  programmer: {
    icon: "💻",
    title: "Software Programmer",
    successSkill: "Debugging & Logical Thinking",
    successMessage: "You demonstrated strong debugging skills! Programmers need logical thinking to trace through code execution and spot where things go wrong.",
    failureSkill: "Root Cause Analysis",
    failureMessage: "Keep practicing! Programmers must identify root causes, not just mask symptoms. Review the questions and try again.",
    keySkills: [
      "Problem-solving and logical reasoning",
      "Attention to detail",
      "Understanding of data structures",
      "Systematic debugging approach",
    ],
  },
  nurse: {
    icon: "🏥",
    title: "Registered Nurse",
    successSkill: "Clinical Prioritization & Triage",
    successMessage: "Excellent triage skills! You correctly prioritized patients based on severity. Nurses must make life-or-death decisions under pressure.",
    failureSkill: "Critical Assessment",
    failureMessage: "Triage is challenging! Remember to prioritize life-threatening conditions first, then urgent cases, then stable patients.",
    keySkills: [
      "Rapid assessment of patient conditions",
      "Prioritization under pressure",
      "Medical knowledge and critical thinking",
      "Empathy combined with decisiveness",
    ],
  },
  engineer: {
    icon: "🏗️",
    title: "Civil Engineer",
    successSkill: "Constraint Optimization",
    successMessage: "Perfect engineering decisions! You balanced cost, strength, and timeline effectively. Engineers must find solutions that meet ALL requirements.",
    failureSkill: "Requirements Analysis",
    failureMessage: "Engineering requires balancing multiple constraints. Review which designs met all requirements and try again.",
    keySkills: [
      "Balancing multiple constraints",
      "Mathematical and analytical thinking",
      "Understanding trade-offs",
      "Safety-first mindset",
    ],
  },
  teacher: {
    icon: "👩‍🏫",
    title: "Teacher",
    successSkill: "Classroom Management & Professional Judgment",
    successMessage: "Excellent teaching decisions! You demonstrated the professional judgment needed to manage classrooms and support student learning effectively.",
    failureSkill: "Educational Decision-Making",
    failureMessage: "Teaching requires balancing student needs, classroom management, and professional ethics. Review the scenarios and try again.",
    keySkills: [
      "Classroom management and leadership",
      "Understanding diverse learning needs",
      "Professional ethics and responsibility",
      "Communication and patience",
    ],
  },
  chef: {
    icon: "👨‍🍳",
    title: "Professional Chef",
    successSkill: "Culinary Expertise & Kitchen Management",
    successMessage: "Outstanding culinary decisions! You showed the expertise needed to manage a professional kitchen, from food safety to quality control.",
    failureSkill: "Kitchen Operations",
    failureMessage: "Professional cooking requires timing, quality control, and food safety knowledge. Review the challenges and try again.",
    keySkills: [
      "Time management and multitasking",
      "Food safety and quality control",
      "Creativity and adaptability",
      "Leadership under pressure",
    ],
  },
  architect: {
    icon: "🏛️",
    title: "Architect",
    successSkill: "Design Integration & Professional Practice",
    successMessage: "Excellent architectural thinking! You balanced aesthetics, function, safety, and codes—the hallmarks of great architecture.",
    failureSkill: "Design Problem-Solving",
    failureMessage: "Architecture requires balancing many factors: client needs, codes, sustainability, and aesthetics. Review the principles and try again.",
    keySkills: [
      "Spatial and creative thinking",
      "Building codes and safety",
      "Sustainable design principles",
      "Client communication and ethics",
    ],
  },
};

const trophyColors = {
  easy: "from-green-400 to-emerald-500",
  medium: "from-yellow-400 to-orange-500",
  hard: "from-red-500 to-pink-600",
};

const trophyIcons = {
  easy: "🥉",
  medium: "🥈",
  hard: "🥇",
};

export default function OutcomeScreen({
  career,
  difficulty,
  success,
  score,
  total,
  onPlayAgain,
  onNewCareer,
  onChangeDifficulty,
  onOpenSettings,
  onExit,
}: OutcomeScreenProps) {
  const data = careerData[career];
  const percentage = Math.round((score / total) * 100);

  return (
    <ScreenWrapper onOpenSettings={onOpenSettings} onExit={onExit} dark>
      <div className={`max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8`}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{data.icon}</div>
          
          {success && (
            <div className="mb-4">
              <div className={`inline-block bg-gradient-to-r ${trophyColors[difficulty]} text-white px-6 py-3 rounded-full text-4xl font-bold shadow-lg`}>
                {trophyIcons[difficulty]} Trophy Earned!
              </div>
            </div>
          )}
          
          <div className={`text-5xl font-bold mb-4 ${
            success ? "text-green-600" : "text-orange-600"
          }`}>
            {success ? "Success! ✓" : "Keep Trying!"}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {data.title}
          </h3>
          
          <div className="text-lg text-gray-700">
            Difficulty: <span className="font-bold capitalize">{difficulty}</span>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {score} / {total}
            </div>
            <div className="text-xl text-gray-700">
              {percentage}% Correct
            </div>
          </div>
          
          <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                percentage >= 60 ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="text-center mt-2 text-sm text-gray-600">
            {percentage >= 60 ? "Passed! (60% required)" : "Need 60% to pass"}
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="font-bold text-blue-900 mb-2">
              Key Skill: {success ? data.successSkill : data.failureSkill}
            </p>
            <p className="text-blue-800">
              {success ? data.successMessage : data.failureMessage}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold text-gray-900 mb-3">
              What {data.title}s Need:
            </h4>
            <ul className="space-y-2">
              {data.keySkills.map((skill, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Same Difficulty Again
          </button>
          
          <button
            onClick={onChangeDifficulty}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Change Difficulty Level
          </button>
          
          <button
            onClick={onNewCareer}
            className="w-full bg-gray-600 text-white font-bold py-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Explore Another Career
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          {success
            ? `Great job! You earned the ${difficulty} trophy for ${data.title}!`
            : "Learning from mistakes is part of every career. Keep practicing!"}
        </div>
        </div>
    </ScreenWrapper>
  );
}
