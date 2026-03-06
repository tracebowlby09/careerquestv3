export type Difficulty = "easy" | "medium" | "hard";
export type Career = "programmer" | "nurse" | "engineer" | "teacher" | "chef" | "architect";
export type GameMode = "challenge" | "quick-recall";

export interface Trophy {
  career: Career;
  difficulty: Difficulty;
  earnedAt: Date;
}

export interface GameProgress {
  trophies: Trophy[];
  currentScore: number;
}
