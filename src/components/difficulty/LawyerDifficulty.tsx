"use client";

import DifficultySelection, { Difficulty } from "../DifficultySelection";

interface LawyerDifficultyProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  backgroundImage?: string;
}

export default function LawyerDifficulty({
  onSelectDifficulty,
  onBack,
  onOpenSettings,
  onExit,
  backgroundImage,
}: LawyerDifficultyProps) {
  return (
    <DifficultySelection
      onSelectDifficulty={onSelectDifficulty}
      onBack={onBack}
      onOpenSettings={onOpenSettings}
      onExit={onExit}
      backgroundImage={backgroundImage}
      careerName="Lawyer"
    />
  );
}