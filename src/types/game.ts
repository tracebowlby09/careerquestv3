export type Difficulty = "easy" | "medium" | "hard";
export type Career = "programmer" | "nurse" | "engineer" | "teacher" | "chef" | "architect";
export type GameMode = "challenge" | "quick-recall" | "simulation";
export type AchievementType = "career-master" | "quick-recall-champion" | "perfect-recall" | "konami-master" | "all-careers-master" | "all-quick-recalls-master";

export interface Trophy {
  career: Career;
  difficulty: Difficulty;
  earnedAt: Date;
  isSecret?: boolean;
  achievementType?: AchievementType;
}

export interface GameProgress {
  trophies: Trophy[];
  currentScore: number;
}
