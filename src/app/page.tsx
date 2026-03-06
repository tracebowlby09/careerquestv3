"use client";

import { useState, useEffect, useCallback } from "react";
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
import SecretTrophyPopup from "@/components/SecretTrophyPopup";
import { Career, Difficulty, GameMode, Trophy, AchievementType } from "@/types/game";
import { audioSystem } from "@/lib/audio";
import ScreenWrapper from "@/components/ScreenWrapper";

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

// Check for achievements
const checkAchievements = (
  allTrophies: Trophy[],
  isQuickRecallMode: boolean,
  score: number,
  total: number
): AchievementType[] => {
  const achievements: AchievementType[] = [];
  const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect"];
  const allDifficulties: Difficulty[] = ["easy", "medium", "hard"];
  
  // Check for Career Master - all 3 difficulties for any career
  for (const career of allCareers) {
    const careerTrophies = allTrophies.filter(
      (t) => t.career === career && !t.achievementType
    );
    const earnedDifficulties = new Set(careerTrophies.map((t) => t.difficulty));
    const hasAllDifficulties = allDifficulties.every((d) => earnedDifficulties.has(d));
    
    if (hasAllDifficulties) {
      // Check if we already have this achievement
      const alreadyHasCareerMaster = allTrophies.some(
        (t) => t.achievementType === "career-master" && t.career === career
      );
      if (!alreadyHasCareerMaster) {
        achievements.push("career-master");
      }
    }
  }
  
  // Check for Quick Recall Champion - complete any quick recall
  if (isQuickRecallMode) {
    const alreadyHasChampion = allTrophies.some(
      (t) => t.achievementType === "quick-recall-champion"
    );
    if (!alreadyHasChampion) {
      achievements.push("quick-recall-champion");
    }
    
    // Check for Perfect Recall - all questions right, no misses
    if (score === total && total > 0) {
      const alreadyHasPerfect = allTrophies.some(
        (t) => t.achievementType === "perfect-recall"
      );
      if (!alreadyHasPerfect) {
        achievements.push("perfect-recall");
      }
    }
  }
  
  return achievements;
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
  const [showSecretTrophyPopup, setShowSecretTrophyPopup] = useState(false);

  // Konami code detection
  const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  const [konamiIndex, setKonamiIndex] = useState(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    const key = event.key;
    
    if (key === konamiCode[konamiIndex]) {
      const newIndex = konamiIndex + 1;
      if (newIndex === konamiCode.length) {
        // Konami code entered! Award secret trophy
        const secretTrophy: Trophy = {
          career: "programmer", // Placeholder career
          difficulty: "hard", // Placeholder difficulty
          earnedAt: new Date(),
          isSecret: true,
        };
        
        // Check if already unlocked
        const alreadyUnlocked = trophies.some((t) => t.isSecret);
        if (!alreadyUnlocked) {
          setTrophies([...trophies, secretTrophy]);
          saveTrophies([...trophies, secretTrophy]);
          setShowSecretTrophyPopup(true);
        }
        
        // Reset index
        setKonamiIndex(0);
      } else {
        setKonamiIndex(newIndex);
      }
    } else {
      // Reset if wrong key
      setKonamiIndex(0);
    }
  }, [konamiIndex, konamiCode, trophies]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
        
        // Check for achievements after awarding the new trophy
        const allTrophies = [...trophies, newTrophy];
        const newAchievements = checkAchievements(allTrophies, isQuickRecallMode, finalScore, total);
        
        if (newAchievements.length > 0) {
          // Add achievement trophies
          const achievementTrophies = newAchievements.map((achievement) => ({
            career: selectedCareer,
            difficulty: "hard" as Difficulty,
            earnedAt: new Date(),
            isSecret: true,
            achievementType: achievement,
          }));
          
          setTrophies([...allTrophies, ...achievementTrophies]);
          saveTrophies([...allTrophies, ...achievementTrophies]);
          
          // Show popup for achievements
          setShowSecretTrophyPopup(true);
        } else {
          setTrophies(allTrophies);
          saveTrophies(allTrophies);
        }
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

  const handleBackToSelection = () => {
    // For Quick Recall mode, go back to career selection
    setSelectedCareer(null);
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
        <SecretTrophyPopup 
          show={showSecretTrophyPopup} 
          onClose={() => setShowSecretTrophyPopup(false)} 
        />
      </>
    );
  }

  if (gameState === "career-select") {
    return (
      <>
        <CareerSelection 
          onSelectCareer={handleCareerSelect} 
          onOpenSettings={() => setSettingsOpen(true)} 
          onExit={handleExitToTitle}
          gameMode={gameMode}
        />
        {settingsModal}
        <SecretTrophyPopup 
          show={showSecretTrophyPopup} 
          onClose={() => setShowSecretTrophyPopup(false)} 
        />
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
        <SecretTrophyPopup 
          show={showSecretTrophyPopup} 
          onClose={() => setShowSecretTrophyPopup(false)} 
        />
      </>
    );
  }

  if (gameState === "playing" && selectedCareer) {
    const isQuickRecall = gameMode === "quick-recall";
    
    return (
      <ScreenWrapper
        onOpenSettings={() => setSettingsOpen(true)}
        onExit={handleExitToTitle}
        showExitWarning={true}
        dark={true}
      >
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
        <SecretTrophyPopup 
          show={showSecretTrophyPopup} 
          onClose={() => setShowSecretTrophyPopup(false)} 
        />
      </ScreenWrapper>
    );
  }

  if (gameState === "trophy") {
    return (
      <>
        <TrophyScreen 
          trophies={trophies} 
          onBack={() => setGameState("title")} 
        />
        <SecretTrophyPopup 
          show={showSecretTrophyPopup} 
          onClose={() => setShowSecretTrophyPopup(false)} 
        />
      </>
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
          onBackToSelection={handleBackToSelection}
        />
        {settingsModal}
        <SecretTrophyPopup 
          show={showSecretTrophyPopup} 
          onClose={() => setShowSecretTrophyPopup(false)} 
        />
      </>
    );
  }

  return null;
}
