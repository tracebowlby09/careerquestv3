"use client";

import DifficultySelection, { Difficulty } from "../DifficultySelection";

interface RetailDifficultyProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  backgroundImage?: string;
}

export default function RetailDifficulty({
  onSelectDifficulty,
  onBack,
  onOpenSettings,
  onExit,
  backgroundImage,
}: RetailDifficultyProps) {
  return (
    <DifficultySelection
      onSelectDifficulty={onSelectDifficulty}
      onBack={onBack}
      onOpenSettings={onOpenSettings}
      onExit={onExit}
      backgroundImage={backgroundImage}
      careerName="Retail Worker"
    />
  );
}