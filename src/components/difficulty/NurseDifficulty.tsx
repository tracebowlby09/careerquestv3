"use client";

import ScreenWrapper from "../ScreenWrapper";
import DifficultySelection from "../DifficultySelection";

interface NurseDifficultyProps {
  onSelectDifficulty: (difficulty: string) => void;
  onBack: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  backgroundImage?: string;
}

export default function NurseDifficulty({
  onSelectDifficulty,
  onBack,
  onOpenSettings,
  onExit,
  backgroundImage,
}: NurseDifficultyProps) {
  return (
    <DifficultySelection
      onSelectDifficulty={onSelectDifficulty}
      onBack={onBack}
      onOpenSettings={onOpenSettings}
      onExit={onExit}
      backgroundImage={backgroundImage}
      careerName="Registered Nurse"
    />
  );
}