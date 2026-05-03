# Career Quest V3 - Presentation

---

## Slide 1: Title

# Career Quest V3 🎯

### An Interactive Career Exploration Game

*Learn real-world skills through gamified challenges*

---

## Slide 2: What is Career Quest?

**Career Quest** is an interactive educational game where players:

- 🎮 **Explore 6 different careers** through realistic challenges - Each career represents a real-world profession with job-specific scenarios
- 📚 **Answer career-specific questions** across 3 difficulty levels - Questions are designed by considering actual job tasks and skills needed
- 🏆 **Earn trophies and achievements** for completed challenges - Rewards provide sense of accomplishment and motivation to continue
- ⚡ **Compete in Quick Recall** for fast-paced trivia action - Timed mode tests knowledge retention and quick thinking

---

## Slide 3: Game Modes

### Challenge Mode
- Select a career and difficulty (Easy/Medium/Hard) - Allows players to choose their comfort level
- Complete career-specific challenges - Each career has unique question content
- Earn trophies for successful completion - Trophies are saved to localStorage
- Progress through all difficulties for bonuses - Completing all 3 difficulties yields achievement trophies

### Quick Recall
- Fast-paced trivia mode - 15 random questions, 10 seconds each
- No difficulty selection - All careers mixed together
- Immediate gameplay - No navigation needed, starts right away
- Perfect for testing your knowledge - Good for quick practice sessions

---

## Slide 4: Available Careers

| Career | Icon | Key Skills | What You'll Do |
|--------|------|------------|---------------|
| **Software Programmer** | 💻 | Logic, Debugging, Problem Solving | Debug code snippets, find syntax errors, fix logic bugs |
| **Registered Nurse** | 🏥 | Prioritization, Critical Thinking, Empathy | Patient care scenarios, medical prioritization, healthcare decisions |
| **Civil Engineer** | 🏗️ | Analysis, Design, Constraint Management | Structural analysis, safety calculations, design constraints |
| **Teacher** | 👩‍🏫 | Communication, Patience, Leadership | Classroom scenarios, teaching methods, student engagement |
| **Head Chef** | 👨‍🍳 | Creativity, Time Management, Quality Control | Kitchen challenges, recipe creation, timing dishes |
| **Architect** | 🏛️ | Spatial Thinking, Problem Solving, Sustainability | Design projects, spatial planning, sustainable solutions |

---

## Slide 5: Career World Examples

### Programmer World
- Debug code snippets - Identify bugs in provided code
- Find syntax errors - Spot language violations
- Fix logic bugs - Correct algorithmic mistakes
- Questions for each difficulty level - 3-7 questions based on difficulty

### Nurse World
- Patient care scenarios - Realistic healthcare situations
- Medical prioritization - Decide treatment order
- Healthcare decision-making - Choose best patient outcomes

### Engineer World
- Structural analysis - Evaluate building designs
- Safety calculations - Compute load limits
- Design constraints - Work within budgets/specs

---

## Slide 6: Difficulty Levels

| Difficulty | Questions | Passing Score | Description |
|------------|-----------|---------------|-------------|
| **Easy** | 3 | 2/3 (67%) | Basic concepts, friendly guidance - Introductory level, more forgiving |
| **Medium** | 5 | 3/5 (60%) | Intermediate challenges - Requires some domain knowledge |
| **Hard** | 7 | 5/7 (71%) | Expert-level scenarios - Domain expert level questions |

**Why passing scores vary:** Each difficulty has different thresholds to account for question complexity. Easy has fewer questions but higher percentage needed; Hard has more questions but slightly lower percentage threshold.

---

## Slide 7: Trophy System

### Regular Trophies
- Earn a trophy for each career/difficulty combination - 6 careers × 3 difficulties = 18 trophies
- Collect all 18 regular trophies to complete the game - Full completion requires mastery

### Achievement Trophies
- **Career Master** - Complete all 3 difficulties for one career - Earned automatically when done
- **Quick Recall Champion** - Complete Quick Recall mode - One-time achievement
- **Perfect Recall** - Get perfect score in Quick Recall - All 15 correct

---

## Slide 8: Secret Easter Egg Trophies

| Trophy | How to Unlock | Explanation |
|--------|---------------|-------------|
| **Konami Master** | Enter ↑↑↓↓←→←→BA anywhere | Classic Konami code pattern - hidden input |
| **Pi Pioneer/Explorer/Master/Genius/Legend** | Type digits of Pi (3.14...) | Pi digit typing games - progressive difficulty |
| **Lightning Reflex** | 5 correct answers under 10 seconds each | Speed achievement for fast answers |
| **Marathon Runner** | Complete Challenge Mode with no wrong answers | Perfect game completion |
| **Speed Demon** | Perfect Quick Recall under 30 seconds | Speed + accuracy in Quick Recall |
| **Night Owl** | Play after 10 PM | Time-based achievement |
| **Early Bird** | Play before 6 AM | Time-based achievement |
| **Lucky Star** | Pass Hard mode with wrong answer | Screenshot-able unlikely event |
| **Jack of All Trades** | Play at least one question from each career | Completion of all careers |

---

## Slide 9: Technical Architecture

```
src/
├── app/
│   ├── page.tsx          # Main game state machine (1059 lines) - Handles all game logic
│   ├── layout.tsx        # Root layout - HTML structure, fonts
│   └── globals.css       # Tailwind CSS 4 - Global styles
├── components/
│   ├── TitleScreen.tsx   # Start screen - Entry point
│   ├── CareerSelection.tsx  # Career picker - Career grid
│   ├── ScreenWrapper.tsx # Full-screen with exit warnings - Navigation safety
│   ├── TutorialScreen.tsx # Tutorial - First-time instructions
│   ├── OutcomeScreen.tsx # Results - Post-question display
│   ├── TrophyScreen.tsx  # Trophy case - Collection display
│   ├── difficulty/       # 6 difficulty screens - Career-specific questions
│   └── careers/          # 6 career worlds - Question content
└── lib/
    └── audio.ts          # Web Audio API system - Sound management
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

**State flow:** User progresses through states: title → career-select → difficulty-select → playing → outcome → trophy (repeat)

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

**Type safety:** TypeScript ensures valid values are used throughout the app, preventing runtime errors

---

## Slide 12: Audio System (lib/audio.ts)

```typescript
class AudioSystem {
  // Web Audio API with gain nodes for master/music/SFX
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  playClickSound()    // Button interactions
  playSuccessSound() // Correct answers
  playFailureSound() // Wrong answers
  playMusic(trackUrl) // Background music
  stopBackgroundMusic() // Stop playback
  playTitleMusic() // Title screen theme
}
```

**Audio architecture:** Uses Web Audio API with gain nodes for independent volume control of music vs sound effects

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
    explanation: string;  // Why answer is right/wrong
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
    // ... other options
  ]
}
```

**Question format:**
---

## Slide 14: Features & Screens

### Title Screen
- Animated background particles - Visual engagement
- Two game mode buttons (Challenge Mode, Quick Recall) - Primary navigation
- Settings gear button - Audio configuration
- Trophy case access - View collected trophies

### Career Selection Screen
- Grid of career cards with icons - Visual career overview
- Career descriptions and required skills - Information display
- Unique gradient backgrounds per career - Visual distinction

### Difficulty Selection
- Three difficulty buttons - Level selection
- Career-specific background image - Immersion
- Back button support - Navigation

---

## Slide 15: Additional Features

### Settings
- Music volume slider - Control background music
- SFX volume slider - Control sound effects
- Persistent via localStorage - Settings saved between sessions

### Exit Warning System
- ScreenWrapper component shows warning when leaving mid-game - Prevents accidental progress loss
- Triggers on browser back button or page leave - Navigation safety

### Background Images
- Career-specific backgrounds for immersion - Visual theming
- Stored in `/public/images/` - Static asset storage
- Naming: `career-bg.jpg` (programmer-bg.jpg, nurse-bg.jpg, etc.) - Consistent naming

---

## Slide 16: Tech Stack

| Technology | Purpose | Why Used |
|------------|---------|----------|
| **Next.js 16** | Framework with App Router | React framework with server components, optimized builds |
| **TypeScript** | Type safety (strict mode) | Catches errors at compile time |
| **Tailwind CSS 4** | Styling | Utility-first, maintainable styles |
| **Web Audio API** | Audio playback | Low-latency, game-ready audio |
| **localStorage** | Trophy persistence | Client-side data storage without backend |

---

## Slide 17: Future Enhancements

From FEATURE_IDEAS.md:
- 📊 Statistics & Analytics Dashboard - Track player performance over time
- ⭐ XP & Leveling System - Progression beyond trophies
- 📅 Daily Challenges & Streaks - Daily engagement
- 🏅 Expanded Achievement System - More goals to achieve
- 📚 Career Information Pages - Educational content about each career
- 📝 Question Review & Learning Mode - Review wrong answers

---

## Slide 18: How to Play

1. **Start** → Choose Challenge Mode or Quick Recall
2. **Select Career** → Pick from 6 careers
3. **Choose Difficulty** → Easy/Medium/Hard
4. **Answer Questions** → Complete the challenge
5. **Earn Trophies** → Collect achievements
6. **View Progress** → Check Trophy Case

**Game loop:** Players repeat steps 2-5 to collect all trophies and achievements

---

## Slide 19: Admin Features

Secret admin panel accessible by typing `5839201746`:
- Toggle "Always Correct" mode - Debug/testing tool
- Clear all trophies - Reset functionality
- Draggable window - UI positioning

**Purpose:** Developer testing and player debugging tools

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