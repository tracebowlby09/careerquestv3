"use client";

import { useState } from "react";
import TitleScreen from "@/components/TitleScreen";
import CareerSelection, { Career } from "@/components/CareerSelection";
import ProgrammerWorld from "@/components/careers/ProgrammerWorld";
import NurseWorld from "@/components/careers/NurseWorld";
import EngineerWorld from "@/components/careers/EngineerWorld";
import OutcomeScreen from "@/components/OutcomeScreen";

type GameState = "title" | "career-select" | "playing" | "outcome";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("title");
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [challengeSuccess, setChallengeSuccess] = useState<boolean>(false);

  const handleStart = () => {
    setGameState("career-select");
  };

  const handleCareerSelect = (career: Career) => {
    setSelectedCareer(career);
    setGameState("playing");
  };

  const handleChallengeComplete = (success: boolean) => {
    setChallengeSuccess(success);
    setGameState("outcome");
  };

  const handlePlayAgain = () => {
    setGameState("playing");
  };

  const handleNewCareer = () => {
    setSelectedCareer(null);
    setGameState("career-select");
  };

  const handleBackToTitle = () => {
    setSelectedCareer(null);
    setGameState("title");
  };

  // Render current game state
  if (gameState === "title") {
    return <TitleScreen onStart={handleStart} />;
  }

  if (gameState === "career-select") {
    return <CareerSelection onSelectCareer={handleCareerSelect} />;
  }

  if (gameState === "playing" && selectedCareer) {
    switch (selectedCareer) {
      case "programmer":
        return <ProgrammerWorld onComplete={handleChallengeComplete} />;
      case "nurse":
        return <NurseWorld onComplete={handleChallengeComplete} />;
      case "engineer":
        return <EngineerWorld onComplete={handleChallengeComplete} />;
      default:
        return null;
    }
  }

  if (gameState === "outcome" && selectedCareer) {
    return (
      <OutcomeScreen
        career={selectedCareer}
        success={challengeSuccess}
        onPlayAgain={handlePlayAgain}
        onNewCareer={handleNewCareer}
      />
    );
  }

  return null;
}
