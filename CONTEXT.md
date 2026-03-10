# Career Quest - Interactive Career Exploration Game

## Project Purpose

Career Quest is an educational game that allows players to explore different career paths through interactive challenges and quick recall trivia. Players can test their knowledge across 6 different careers.

## Key Features

- **6 Career Paths**: Programmer, Nurse, Engineer, Teacher, Chef, and Architect
- **Two Game Modes**: Challenge Mode (with difficulty selection) and Quick Recall (fast-paced trivia)
- **Trophy System**: Earn trophies for completing challenges across difficulties
- **Achievements**: Special achievements for completing all careers, perfect scores, and secret easter eggs

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks (useState) for game state
- **Package Manager**: Bun

## Game Modes

| Mode | Description |
|------|-------------|
| Challenge Mode | Full game with difficulty selection (Easy/Medium/Hard), earn trophies |
| Quick Recall | Fast-paced trivia, no difficulty, immediate play |

## Careers Available

1. **Software Programmer**: Debug code and solve programming challenges
2. **Registered Nurse**: Answer healthcare and medical questions
3. **Civil Engineer**: Test engineering knowledge
4. **Teacher**: Educational questions and classroom scenarios
5. **Head Chef**: Culinary knowledge and cooking challenges
6. **Architect**: Architecture and design questions

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Main game component
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Tailwind styles
├── components/
│   ├── TitleScreen.tsx       # Game title and start
│   ├── CareerSelection.tsx   # Choose career
│   ├── DifficultySelection.tsx # Choose difficulty
│   ├── OutcomeScreen.tsx     # Success/failure results
│   ├── TrophyScreen.tsx      # View earned trophies
│   ├── careers/
│   │   ├── ProgrammerWorld.tsx
│   │   ├── NurseWorld.tsx
│   │   ├── EngineerWorld.tsx
│   │   ├── TeacherWorld.tsx
│   │   ├── ChefWorld.tsx
│   │   └── ArchitectWorld.tsx
│   └── ...
├── lib/
│   └── audio.ts              # Audio system
└── types/
    └── game.ts               # TypeScript types
```

## Secret Features

- **Konami Code**: Enter ↑↑↓↓←→←→BA on any screen to unlock a secret trophy
- **Admin Panel**: Enter code 5839201746 to access debug features
