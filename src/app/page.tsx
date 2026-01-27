"use client";

import { useState } from "react";
import TitleScreen from "@/components/TitleScreen";
import CareerSelection from "@/components/CareerSelection";
import DifficultySelection from "@/components/DifficultySelection";
import ProgrammerWorld from "@/components/careers/ProgrammerWorld";
import NurseWorld from "@/components/careers/NurseWorld";
import EngineerWorld from "@/components/careers/EngineerWorld";
import OutcomeScreen from "@/components/OutcomeScreen";
import { Career, Difficulty, Trophy } from "@/types/game";

type GameState = "title" | "career-select" | "difficulty-select" | "playing" | "outcome";

const careerNames = {
  programmer: "Software Programmer",
  nurse: "Registered Nurse",
  engineer: "Civil Engineer",
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("title");
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [challengeSuccess, setChallengeSuccess] = useState(false);
  const [trophies, setTrophies] = useState<Trophy[]>([]);

  const handleStart = () => {
    setGameState("career-select");
  };

  const handleCareerSelect = (career: Career) => {
    setSelectedCareer(career);
    setGameState("difficulty-select");
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setGameState("playing");
  };

  const handleChallengeComplete = (success: boolean, finalScore: number, total: number) => {
    setChallengeSuccess(success);
    setScore(finalScore);
    setTotalQuestions(total);
    
    // Award trophy if successful
    if (success && selectedCareer && selectedDifficulty) {
      const newTrophy: Trophy = {
        career: selectedCareer,
        difficulty: selectedDifficulty,
        earnedAt: new Date(),
      };
      setTrophies([...trophies, newTrophy]);
    }
    
    setGameState("outcome");
  };

  const handlePlayAgain = () => {
    setGameState("playing");
  };

  const handleChangeDifficulty = () => {
    setSelectedDifficulty(null);
    setGameState("difficulty-select");
  };

  const handleNewCareer = () => {
    setSelectedCareer(null);
    setSelectedDifficulty(null);
    setGameState("career-select");
  };

  const handleBackToCareerSelect = () => {
    setSelectedCareer(null);
    setGameState("career-select");
  };

  // Render current game state
  if (gameState === "title") {
    return <TitleScreen onStart={handleStart} />;
  }

  if (gameState === "career-select") {
    return <CareerSelection onSelectCareer={handleCareerSelect} />;
  }

  if (gameState === "difficulty-select" && selectedCareer) {
    return (
      <DifficultySelection
        career={careerNames[selectedCareer]}
        onSelectDifficulty={handleDifficultySelect}
        onBack={handleBackToCareerSelect}
      />
    );
  }

  if (gameState === "playing" && selectedCareer && selectedDifficulty) {
    switch (selectedCareer) {
      case "programmer":
        return (
          <ProgrammerWorld
            difficulty={selectedDifficulty}
            onComplete={handleChallengeComplete}
          />
        );
      case "nurse":
        return (
          <NurseWorld
            difficulty={selectedDifficulty}
            onComplete={handleChallengeComplete}
          />
        );
      case "engineer":
        return (
          <EngineerWorld
            difficulty={selectedDifficulty}
            onComplete={handleChallengeComplete}
          />
        );
      default:
        return null;
    }
  }

  if (gameState === "outcome" && selectedCareer && selectedDifficulty) {
    return (
      <OutcomeScreen
        career={selectedCareer}
        difficulty={selectedDifficulty}
        success={challengeSuccess}
        score={score}
        total={totalQuestions}
        onPlayAgain={handlePlayAgain}
        onNewCareer={handleNewCareer}
        onChangeDifficulty={handleChangeDifficulty}
      />
    );
  }

  return null;
}
