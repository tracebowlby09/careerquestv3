"use client";

export type Difficulty = "easy" | "medium" | "hard";

interface DifficultyOption {
  id: Difficulty;
  title: string;
  icon: string;
  description: string;
  questions: number;
  color: string;
}

interface DifficultySelectionProps {
  career: string;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
}

const difficulties: DifficultyOption[] = [
  {
    id: "easy",
    title: "Easy",
    icon: "🌱",
    description: "Perfect for beginners. 2 questions to complete.",
    questions: 2,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "medium",
    title: "Medium",
    icon: "⚡",
    description: "A good challenge. 3 questions to master.",
    questions: 3,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "hard",
    title: "Hard",
    icon: "🔥",
    description: "Expert level. 4 questions to conquer.",
    questions: 4,
    color: "from-red-500 to-pink-500",
  },
];

export default function DifficultySelection({
  career,
  onSelectDifficulty,
  onBack,
}: DifficultySelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-white hover:text-white/80 transition-colors flex items-center gap-2"
        >
          ← Back to Career Selection
        </button>

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Difficulty
          </h2>
          <p className="text-xl text-white/90">
            {career} - Select how challenging you want the experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => onSelectDifficulty(diff.id)}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              <div className="text-6xl mb-4 text-center">{diff.icon}</div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                {diff.title}
              </h3>
              
              <p className="text-gray-600 mb-4 text-center">
                {diff.description}
              </p>
              
              <div className={`bg-gradient-to-r ${diff.color} text-white rounded-lg p-3 text-center font-semibold`}>
                {diff.questions} Questions
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-purple-600 font-semibold">
                  Start Challenge →
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-white/80 text-sm">
          Complete all questions to earn a trophy! 🏆
        </div>
      </div>
    </div>
  );
}
