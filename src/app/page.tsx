"use client";

import { useState } from "react";
import TitleScreen from "@/components/TitleScreen";
import CareerSelection from "@/components/CareerSelection";
import DifficultySelection from "@/components/DifficultySelection";
import ProgrammerWorld from "@/components/careers/ProgrammerWorld";
import NurseWorld from "@/components/careers/NurseWorld";
import EngineerWorld from "@/components/careers/EngineerWorld";
import TeacherWorld from "@/components/careers/TeacherWorld";
import ChefWorld from "@/components/careers/ChefWorld";
import ArchitectWorld from "@/components/careers/ArchitectWorld";
import OutcomeScreen from "@/components/OutcomeScreen";
import Settings from "@/components/Settings";
import { Career, Difficulty, Trophy } from "@/types/game";
import { audioSystem } from "@/lib/audio";

type GameState = "title" | "career-select" | "difficulty-select" | "playing" | "outcome";

const careerNames: Record<Career, string> = {
  programmer: "Software Programmer",
  nurse: "Registered Nurse",
  engineer: "Civil Engineer",
  teacher: "Teacher",
  chef: "Professional Chef",
  architect: "Architect",
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("title");
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [challengeSuccess, setChallengeSuccess] = useState(false);
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleStart = () => {
    audioSystem.playClickSound();
    audioSystem.playTitleMusic();
    setGameState("career-select");
  };

  const handleCareerSelect = (career: Career) => {
    setSelectedCareer(career);
    setGameState("difficulty-select");
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    
    // Pause title music and play career-specific background music
    audioSystem.pauseMusic();
    
    if (selectedCareer) {
      const musicUrls: Record<Career, string> = {
        programmer: "/audio/Programmer.mp3",
        nurse: "/audio/Nurse.mp3",
        engineer: "/audio/Engineer.mp3",
        teacher: "/audio/Teacher.mp3",
        chef: "/audio/Chef.mp3",
        architect: "/audio/Architect.mp3",
      };
      audioSystem.playMusic(musicUrls[selectedCareer]);
    }
    
    setGameState("playing");
  };

  const handleChallengeComplete = (success: boolean, finalScore: number, total: number) => {
    setChallengeSuccess(success);
    setScore(finalScore);
    setTotalQuestions(total);
    
    // Play success or failure sound
    if (success) {
      audioSystem.playSuccessSound();
    } else {
      audioSystem.playFailureSound();
    }
    
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

  const handleExitToTitle = () => {
    audioSystem.stopBackgroundMusic();
    audioSystem.resumeMusic();
    setGameState("title");
  };

  // Render Settings modal (always available)
  const settingsModal = <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />;

  // Render current game state
  if (gameState === "title") {
    return (
      <>
        <TitleScreen onStart={handleStart} onOpenSettings={() => setSettingsOpen(true)} />
        {settingsModal}
      </>
    );
  }

  if (gameState === "career-select") {
    return (
      <>
        <CareerSelection onSelectCareer={handleCareerSelect} onOpenSettings={() => setSettingsOpen(true)} onExit={handleExitToTitle} />
        {settingsModal}
      </>
    );
  }

  if (gameState === "difficulty-select" && selectedCareer) {
    return (
      <>
        <DifficultySelection
          career={careerNames[selectedCareer]}
          onSelectDifficulty={handleDifficultySelect}
          onBack={handleBackToCareerSelect}
          onOpenSettings={() => setSettingsOpen(true)}
          onExit={handleExitToTitle}
        />
        {settingsModal}
      </>
    );
  }

  if (gameState === "playing" && selectedCareer && selectedDifficulty) {
    return (
      <>
        {selectedCareer === "programmer" && (
          <ProgrammerWorld
            difficulty={selectedDifficulty}
            onComplete={handleChallengeComplete}
          />
        )}
        {selectedCareer === "nurse" && (
          <NurseWorld
            difficulty={selectedDifficulty}
            onComplete={handleChallengeComplete}
          />
        )}
        {selectedCareer === "engineer" && (
          <EngineerWorld
            difficulty={selectedDifficulty}
            onComplete={handleChallengeComplete}
          />
        )}
        {selectedCareer === "teacher" && (
          <TeacherWorld
            difficulty={selectedDifficulty}
            onComplete={handleChallengeComplete}
          />
        )}
        {selectedCareer === "chef" && (
          <ChefWorld
            difficulty={selectedDifficulty}
            onComplete={handleChallengeComplete}
          />
        )}
        {selectedCareer === "architect" && (
          <ArchitectWorld
            difficulty={selectedDifficulty}
            onComplete={handleChallengeComplete}
          />
        )}
        {settingsModal}
      </>
    );
  }

  if (gameState === "outcome" && selectedCareer && selectedDifficulty) {
    return (
      <>
        <OutcomeScreen
          career={selectedCareer}
          difficulty={selectedDifficulty}
          success={challengeSuccess}
          score={score}
          total={totalQuestions}
          onPlayAgain={handlePlayAgain}
          onNewCareer={handleNewCareer}
          onChangeDifficulty={handleChangeDifficulty}
          onOpenSettings={() => setSettingsOpen(true)}
          onExit={handleExitToTitle}
        />
        {settingsModal}
      </>
    );
  }

  return null;
}
