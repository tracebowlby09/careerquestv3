"use client";

import ScreenWrapper from "../ScreenWrapper";
import DifficultySelection from "../DifficultySelection";

interface ArchitectDifficultyProps {
  onSelectDifficulty: (difficulty: string) => void;
  onBack: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  backgroundImage?: string;
}

export default function ArchitectDifficulty({
  onSelectDifficulty,
  onBack,
  onOpenSettings,
  onExit,
  backgroundImage,
}: ArchitectDifficultyProps) {
  return (
    <DifficultySelection
      onSelectDifficulty={onSelectDifficulty}
      onBack={onBack}
      onOpenSettings={onOpenSettings}
      onExit={onExit}
      backgroundImage={backgroundImage}
      careerName="Architect"
    />
  );
}