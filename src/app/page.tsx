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
import TrophyScreen from "@/components/TrophyScreen";
import { Career, Difficulty, GameMode, Trophy } from "@/types/game";
import { audioSystem } from "@/lib/audio";

type GameState = "title" | "career-select" | "difficulty-select" | "playing" | "outcome" | "trophy";

const careerNames: Record<Career, string> = {
  programmer: "Software Programmer",
  nurse: "Registered Nurse",
  engineer: "Civil Engineer",
  teacher: "Teacher",
  chef: "Head Chef",
  architect: "Architect",
};

// Load trophies from localStorage
const loadTrophies = (): Trophy[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("careerQuestTrophies");
  if (saved) {
    try {
      const trophies = JSON.parse(saved);
      // Convert date strings back to Date objects
      return trophies.map((t: any) => ({
        ...t,
        earnedAt: new Date(t.earnedAt),
      }));
    } catch {
      return [];
    }
  }
  return [];
};

// Save trophies to localStorage
const saveTrophies = (trophies: Trophy[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("careerQuestTrophies", JSON.stringify(trophies));
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("title");
  const [gameMode, setGameMode] = useState<GameMode>("challenge");
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [challengeSuccess, setChallengeSuccess] = useState(false);
  const [trophies, setTrophies] = useState<Trophy[]>(() => loadTrophies());
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleStart = (mode: GameMode) => {
    audioSystem.playClickSound();
    audioSystem.playTitleMusic();
    setGameMode(mode);
    setGameState("career-select");
  };

  const handleCareerSelect = (career: Career) => {
    setSelectedCareer(career);
    
    // Quick Recall mode skips difficulty selection
    if (gameMode === "quick-recall") {
      // Play career-specific background music
      const musicUrls: Record<Career, string> = {
        programmer: "/audio/Programmer.mp3",
        nurse: "/audio/Nurse.mp3",
        engineer: "/audio/Engineer.mp3",
        teacher: "/audio/Teacher.mp3",
        chef: "/audio/Chef.mp3",
        architect: "/audio/Architect.mp3",
      };
      audioSystem.playMusic(musicUrls[career]);
      setGameState("playing");
    } else {
      setGameState("difficulty-select");
    }
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    
    // Play career-specific background music
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
    
    // Play success or failure sound (only for challenge mode)
    const isQuickRecallMode = gameMode === "quick-recall";
    
    if (!isQuickRecallMode) {
      if (success) {
        audioSystem.playSuccessSound();
      } else {
        audioSystem.playFailureSound();
      }
    }
    
    // Award trophy if successful
    if (success && selectedCareer) {
      // For challenge mode, use selected difficulty
      // For quick recall, use "hard" as the difficulty (mastery level)
      const difficulty = isQuickRecallMode ? "hard" : selectedDifficulty;
      
      if (difficulty) {
        const newTrophy: Trophy = {
          career: selectedCareer,
          difficulty: difficulty,
          earnedAt: new Date(),
        };
        setTrophies([...trophies, newTrophy]);
        saveTrophies([...trophies, newTrophy]);
      }
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
    // Stop career music and restart title music
    audioSystem.stopBackgroundMusic();
    audioSystem.playTitleMusic();
    setGameState("title");
  };

  // Render Settings modal (always available)
  const settingsModal = <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />;

  // Render current game state
  if (gameState === "title") {
    return (
      <>
        <TitleScreen 
          onStart={handleStart} 
          onOpenSettings={() => setSettingsOpen(true)} 
          onViewTrophies={() => setGameState("trophy")}
        />
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

  if (gameState === "playing" && selectedCareer) {
    const isQuickRecall = gameMode === "quick-recall";
    
    return (
      <>
        {selectedCareer === "programmer" && (
          <ProgrammerWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
          />
        )}
        {selectedCareer === "nurse" && (
          <NurseWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
          />
        )}
        {selectedCareer === "engineer" && (
          <EngineerWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
          />
        )}
        {selectedCareer === "teacher" && (
          <TeacherWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
          />
        )}
        {selectedCareer === "chef" && (
          <ChefWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
          />
        )}
        {selectedCareer === "architect" && (
          <ArchitectWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
          />
        )}
        {settingsModal}
      </>
    );
  }

  if (gameState === "trophy") {
    return (
      <TrophyScreen 
        trophies={trophies} 
        onBack={() => setGameState("title")} 
      />
    );
  }

  if (gameState === "outcome" && selectedCareer) {
    return (
      <>
        <OutcomeScreen
          career={selectedCareer}
          difficulty={selectedDifficulty ?? "easy"}
          success={challengeSuccess}
          score={score}
          total={totalQuestions}
          onPlayAgain={handlePlayAgain}
          onNewCareer={handleNewCareer}
          onChangeDifficulty={handleChangeDifficulty}
          onOpenSettings={() => setSettingsOpen(true)}
          onExit={handleExitToTitle}
          isQuickRecall={gameMode === "quick-recall"}
        />
        {settingsModal}
      </>
    );
  }

  return null;
}
