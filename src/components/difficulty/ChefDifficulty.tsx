"use client";

import ScreenWrapper from "../ScreenWrapper";
import DifficultySelection, { Difficulty } from "../DifficultySelection";

interface ChefDifficultyProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  backgroundImage?: string;
}

export default function ChefDifficulty({
  onSelectDifficulty,
  onBack,
  onOpenSettings,
  onExit,
  backgroundImage,
}: ChefDifficultyProps) {
  return (
    <DifficultySelection
      onSelectDifficulty={onSelectDifficulty}
      onBack={onBack}
      onOpenSettings={onOpenSettings}
      onExit={onExit}
      backgroundImage={backgroundImage}
      careerName="Head Chef"
    />
  );
}