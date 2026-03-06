import { Career } from "@/types/game";

const STORAGE_KEY = "careerQuestBackgrounds";

export interface Backgrounds {
  [career: string]: string | null;
}

export function loadBackgrounds(): Backgrounds {
  if (typeof window === "undefined") return {};
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  }
  return {};
}

export function getCareerBackground(career: Career): string | null {
  const backgrounds = loadBackgrounds();
  return backgrounds[career] || null;
}

export function getBackgroundStyle(career: Career): React.CSSProperties {
  const background = getCareerBackground(career);
  if (background) {
    return {
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return {};
}
