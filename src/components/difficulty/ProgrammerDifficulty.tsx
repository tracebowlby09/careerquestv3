"use client";

import ScreenWrapper from "../ScreenWrapper";
import DifficultySelection from "../DifficultySelection";

interface ProgrammerDifficultyProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  backgroundImage?: string;
}

export default function ProgrammerDifficulty({
  onSelectDifficulty,
  onBack,
  onOpenSettings,
  onExit,
  backgroundImage,
}: ProgrammerDifficultyProps) {
  return (
    <DifficultySelection
      onSelectDifficulty={onSelectDifficulty}
      onBack={onBack}
      onOpenSettings={onOpenSettings}
      onExit={onExit}
      backgroundImage={backgroundImage}
      careerName="Software Programmer"
    />
  );
}