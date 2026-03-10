"use client";

import { audioSystem } from "@/lib/audio";

interface TutorialStep {
  title: string;
  content: string;
  icon: string;
}

interface TutorialScreenProps {
  careerName: string;
  careerIcon: string;
  gradient: string;
  steps: TutorialStep[];
  onStart: () => void;
  onBack?: () => void;
}

export default function TutorialScreen({
  careerName,
  careerIcon,
  gradient,
  steps,
  onStart,
  onBack,
}: TutorialScreenProps) {
  return (
    <div className={`min-h-screen ${gradient} p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{careerIcon}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {careerName}
            </h1>
            <p className="text-xl text-gray-600">
              How to Play
            </p>
          </div>

          {/* Tutorial Steps */}
          <div className="space-y-6 mb-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500"
              >
                <div className="text-3xl flex-shrink-0">{step.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-gray-700">{step.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {onBack && (
              <button
                onClick={() => {
                  audioSystem.playClickSound();
                  onBack();
                }}
                className="flex-1 bg-gray-200 text-gray-800 font-bold py-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => {
                audioSystem.playClickSound();
                onStart();
              }}
              className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Challenge →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
