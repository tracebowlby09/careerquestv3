"use client";

import { Career } from "./CareerSelection";

interface OutcomeScreenProps {
  career: Career;
  success: boolean;
  onPlayAgain: () => void;
  onNewCareer: () => void;
}

const careerData = {
  programmer: {
    icon: "💻",
    title: "Software Programmer",
    successSkill: "Debugging & Logical Thinking",
    successMessage: "You correctly identified the off-by-one error! This is one of the most common bugs in programming. Programmers need strong logical thinking to trace through code execution and spot where things go wrong.",
    failureSkill: "Root Cause Analysis",
    failureMessage: "The issue was an off-by-one error in the loop condition. The loop used `i <= items.length` which tries to access one index beyond the array. Programmers must identify root causes, not just mask symptoms.",
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
    successMessage: "Excellent triage! You correctly prioritized the chest pain patient (possible heart attack), then the child with respiratory distress, then the sprained ankle. Nurses must make life-or-death decisions under pressure.",
    failureSkill: "Critical Assessment",
    failureMessage: "The correct order was: John (chest pain - possible MI), Emma (pediatric respiratory distress), then Sarah (sprained ankle). Nurses must quickly assess severity and prioritize life-threatening conditions first.",
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
    successMessage: "Perfect choice! The Reinforced Concrete design was the only option that met all constraints: under budget ($85k < $100k), sufficient strength (95 ≥ 85), and within timeline (12 ≤ 14 months). Engineers must balance multiple competing requirements.",
    failureSkill: "Requirements Analysis",
    failureMessage: "Only the Reinforced Concrete design satisfied all constraints. The Budget option lacked strength, and the Premium option exceeded budget and timeline. Engineers must find solutions that meet ALL requirements, not just some.",
    keySkills: [
      "Balancing multiple constraints",
      "Mathematical and analytical thinking",
      "Understanding trade-offs",
      "Safety-first mindset",
    ],
  },
};

export default function OutcomeScreen({
  career,
  success,
  onPlayAgain,
  onNewCareer,
}: OutcomeScreenProps) {
  const data = careerData[career];

  return (
    <div className={`min-h-screen p-4 md:p-8 flex items-center justify-center ${
      success
        ? "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500"
        : "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"
    }`}>
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{data.icon}</div>
          <div className={`text-5xl font-bold mb-4 ${
            success ? "text-green-600" : "text-orange-600"
          }`}>
            {success ? "Success! ✓" : "Not Quite"}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {data.title}
          </h3>
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
            Try This Career Again
          </button>
          
          <button
            onClick={onNewCareer}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Explore Another Career
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          {success
            ? "Great job! You demonstrated the key skills needed for this career."
            : "Learning from mistakes is part of every career. Try again!"}
        </div>
      </div>
    </div>
  );
}
