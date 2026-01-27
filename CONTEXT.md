# Career Quest - Interactive Career Exploration Game

## Project Purpose

Career Quest is an educational game designed for TSA's Computer Game & Simulation Programming event. It allows players to explore different career paths through interactive, skill-based challenges that simulate real job tasks.

## Key Features

- **3 Career Paths**: Programmer, Nurse, and Engineer
- **Skill-Based Challenges**: Each career has a meaningful task that teaches real skills
- **Multiple Outcomes**: Success and failure paths with educational feedback
- **Progressive Flow**: Title Screen → Career Selection → Career World → Challenge → Outcome

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks (useState) for game state
- **Package Manager**: Bun

## Architecture Decisions

### Game State Management
- Client-side state using React hooks
- Game flow: TITLE → CAREER_SELECT → CAREER_INTRO → CHALLENGE → OUTCOME
- Each career is a self-contained module with intro, challenge, and outcome logic

### Career Structure
Each career includes:
1. **Intro Scene**: Explains the job and what you'll do
2. **Challenge**: Interactive skill-based task (not trivia)
3. **Outcome**: Success/failure feedback with skill explanation

### Careers Implemented

1. **Programmer**: Debug a broken code logic flow
2. **Nurse**: Prioritize patient cases in triage
3. **Engineer**: Balance constraints to design a bridge

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
│   ├── careers/
│   │   ├── ProgrammerWorld.tsx
│   │   ├── NurseWorld.tsx
│   │   └── EngineerWorld.tsx
│   └── OutcomeScreen.tsx     # Success/failure results
```

## Major Changes

- **Initial Setup**: Created MVP game structure with 3 careers
- **Game Flow**: Implemented state machine for game progression
- **Challenges**: Built interactive, skill-based tasks for each career
- **UX**: Clean, readable interface with clear navigation

## MVP Scope

This is a proof-of-concept demonstrating:
- Career exploration through simulation
- Skill-based learning (not just trivia)
- Multiple outcomes based on player choices
- Clear, playable game loop

Future enhancements could include: more careers, scoring system, progression tracking, audio/visual polish.
