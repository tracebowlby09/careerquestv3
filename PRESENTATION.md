# Career Quest V3 - Presentation

---

## Slide 1: Title

# Career Quest V3 🎯

### An Interactive Career Exploration Game

*Learn real-world skills through gamified challenges*

---

## Slide 2: What is Career Quest?

**Career Quest** is an interactive educational game where players:

- 🎮 **Explore 6 different careers** through realistic challenges
- 📚 **Answer career-specific questions** across 3 difficulty levels
- 🏆 **Earn trophies and achievements** for completed challenges
- ⚡ **Compete in Quick Recall** for fast-paced trivia action

---

## Slide 3: Game Modes

### Challenge Mode
- Select a career and difficulty (Easy/Medium/Hard)
- Complete career-specific challenges
- Earn trophies for successful completion
- Progress through all difficulties for bonuses

### Quick Recall
- Fast-paced trivia mode
- No difficulty selection
- Immediate gameplay
- Perfect for testing your knowledge

---

## Slide 4: Available Careers

| Career | Icon | Key Skills |
|--------|------|------------|
| **Software Programmer** | 💻 | Logic, Debugging, Problem Solving |
| **Registered Nurse** | 🏥 | Prioritization, Critical Thinking, Empathy |
| **Civil Engineer** | 🏗️ | Analysis, Design, Constraint Management |
| **Teacher** | 👩‍🏫 | Communication, Patience, Leadership |
| **Head Chef** | 👨‍🍳 | Creativity, Time Management, Quality Control |
| **Architect** | 🏛️ | Spatial Thinking, Problem Solving, Sustainability |

---

## Slide 5: Career World Examples

### Programmer World
- Debug code snippets
- Find syntax errors
- Fix logic bugs
- Questions for each difficulty level

### Nurse World
- Patient care scenarios
- Medical prioritization
- Healthcare decision-making

### Engineer World
- Structural analysis
- Safety calculations
- Design constraints

---

## Slide 6: Difficulty Levels

| Difficulty | Questions | Passing Score | Description |
|------------|-----------|---------------|-------------|
| **Easy** | 3 | 2/3 (67%) | Basic concepts, friendly guidance |
| **Medium** | 5 | 3/5 (60%) | Intermediate challenges |
| **Hard** | 7 | 5/7 (71%) | Expert-level scenarios |

---

## Slide 7: Trophy System

### Regular Trophies
- Earn a trophy for each career/difficulty combination
- Collect all 18 regular trophies to complete the game

### Achievement Trophies
- **Career Master** - Complete all 3 difficulties for one career
- **Quick Recall Champion** - Complete Quick Recall mode
- **Perfect Recall** - Get perfect score in Quick Recall

---

## Slide 8: Secret Easter Egg Trophies

| Trophy | How to Unlock |
|--------|---------------|
| **Konami Master** | Enter ↑↑↓↓←→←→BA anywhere |
| **Pi Pioneer/Explorer/Master/Genius/Legend** | Type digits of Pi (3.14...) |
| **Lightning Reflex** | 5 correct answers under 10 seconds each |
| **Marathon Runner** | Complete Challenge Mode with no wrong answers |
| **Speed Demon** | Perfect Quick Recall under 30 seconds |
| **Night Owl** | Play after 10 PM |
| **Early Bird** | Play before 6 AM |
| **Lucky Star** | Pass Hard mode with wrong answer |
| **Jack of All Trades** | Play at least one question from each career |

---

## Slide 9: Technical Architecture

```
src/
├── app/
│   ├── page.tsx          # Main game state machine (1059 lines)
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Tailwind CSS 4
├── components/
│   ├── TitleScreen.tsx   # Start screen
│   ├── CareerSelection.tsx  # Career picker
│   ├── ScreenWrapper.tsx # Full-screen with exit warnings
│   ├── TutorialScreen.tsx # Tutorial
│   ├── OutcomeScreen.tsx # Results
│   ├── TrophyScreen.tsx  # Trophy case
│   ├── difficulty/       # 6 difficulty screens
│   └── careers/          # 6 career worlds
└── lib/
    └── audio.ts          # Web Audio API system
```

---

## Slide 10: Key Code Components

### Game State Management (page.tsx)
```typescript
type GameState = "title" | "career-select" | "difficulty-select" | "playing" | "outcome" | "trophy";

const [gameState, setGameState] = useState<GameState>("title");
const [gameMode, setGameMode] = useState<GameMode>("challenge");
const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
const [trophies, setTrophies] = useState<Trophy[]>(() => loadTrophies());
```

---

## Slide 11: Data Types (src/types/game.ts)

```typescript
export type Difficulty = "easy" | "medium" | "hard";
export type Career = "programmer" | "nurse" | "engineer" | "teacher" | "chef" | "architect";
export type GameMode = "challenge" | "quick-recall";

export interface Trophy {
  career: Career;
  difficulty: Difficulty;
  earnedAt: Date;
  isSecret?: boolean;
  achievementType?: AchievementType;
}
```

---

## Slide 12: Audio System (lib/audio.ts)

```typescript
class AudioSystem {
  // Web Audio API with gain nodes for master/music/SFX
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  playClickSound()
  playSuccessSound()
  playFailureSound()
  playMusic(trackUrl)
  stopBackgroundMusic()
  playTitleMusic()
}
```

---

## Slide 13: Career World Example (ProgrammerWorld.tsx)

```typescript
interface Question {
  id: string;
  code: string;          // Code snippet to analyze
  error: string;         // The bug/issue description
  question: string;
  options: {
    id: string;
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

// Example question
{
  code: `function calculateTotal(items) {
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
}`,
  error: "Cannot read property 'price' of undefined",
  question: "What's causing this error?",
  options: [
    { id: "a", text: "Change <= to < in loop condition", correct: true },
    // ...
  ]
}
```

---

## Slide 14: Features & Screens

### Title Screen
- Animated background particles
- Two game mode buttons (Challenge Mode, Quick Recall)
- Settings gear button
- Trophy case access

### Career Selection Screen
- Grid of career cards with icons
- Career descriptions and required skills
- Unique gradient backgrounds per career

### Difficulty Selection
- Three difficulty buttons
- Career-specific background image
- Back button support

---

## Slide 15: Additional Features

### Settings
- Music volume slider
- SFX volume slider
- Persistent via localStorage

### Exit Warning System
- ScreenWrapper component shows warning when leaving mid-game
- Prevents accidental progress loss

### Background Images
- Career-specific backgrounds for immersion
- Stored in `/public/images/`
- Naming: `career-bg.jpg` (programmer-bg.jpg, nurse-bg.jpg, etc.)

---

## Slide 16: Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | Framework with App Router |
| **TypeScript** | Type safety (strict mode) |
| **Tailwind CSS 4** | Styling |
| **Web Audio API** | Audio playback |
| **localStorage** | Trophy persistence |

---

## Slide 17: Future Enhancements

From FEATURE_IDEAS.md:
- 📊 Statistics & Analytics Dashboard
- ⭐ XP & Leveling System
- 📅 Daily Challenges & Streaks
- 🏅 Expanded Achievement System
- 📚 Career Information Pages
- 📝 Question Review & Learning Mode

---

## Slide 18: How to Play

1. **Start** → Choose Challenge Mode or Quick Recall
2. **Select Career** → Pick from 6 careers
3. **Choose Difficulty** → Easy/Medium/Hard
4. **Answer Questions** → Complete the challenge
5. **Earn Trophies** → Collect achievements
6. **View Progress** → Check Trophy Case

---

## Slide 19: Admin Features

Secret admin panel accessible by typing `5839201746`:
- Toggle "Always Correct" mode
- Clear all trophies
- Draggable window

---

## Slide 20: Summary

✅ **6 Careers** with unique challenges  
✅ **3 Difficulty levels** per career  
✅ **2 Game modes** (Challenge + Quick Recall)  
✅ **18+ Trophies** including secret easter eggs  
✅ **Full audio system** with background music  
✅ **Responsive design** with career backgrounds  
✅ **localStorage** persistence  

---

## Thank You! 🎉

### Questions?

*Explore. Learn. Achieve.*
