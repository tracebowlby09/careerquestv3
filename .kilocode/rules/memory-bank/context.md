# Active Context: Career Quest Game

## Current State

**Game Status**: 🎮 Career Quest - Career trivia game with 6 professions

A career exploration game where players answer profession-related questions. Now includes interactive Career Simulation Mode for hands-on experience.

## Recently Completed

- [x] Base game structure (6 careers, 3 difficulties, 2 game modes)
- [x] Audio system with background music and sound effects
- [x] Trophy/achievement system with localStorage persistence
- [x] Title screen, career selection, difficulty selection
- [x] Challenge Mode and Quick Recall game modes
- [x] **NEW**: Career Simulation Mode - interactive job experience
- [x] **NEW**: ProgrammerSimulation - code-fixing challenges

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main game controller | ✅ Ready |
| `src/components/TitleScreen.tsx` | Start menu | ✅ Ready |
| `src/components/CareerSelection.tsx` | Career picker | ✅ Ready |
| `src/components/careers/*.tsx` | 6 career question worlds | ✅ Ready |
| `src/components/simulations/` | Interactive simulations | 🔄 Expanding |
| `src/lib/audio.ts` | Audio system | ✅ Ready |
| `src/types/game.ts` | TypeScript types | ✅ Ready |

## Current Focus

**Career Simulation Mode**: New interactive game mode where players experience what jobs are actually like through hands-on challenges.

- Currently: ProgrammerSimulation (code-fixing)
- Future: Add simulations for other careers (Nurse, Engineer, etc.)

## Game Modes

| Mode | Description |
|------|-------------|
| Challenge Mode | Full game with difficulty selection, earn trophies |
| Quick Recall | Fast-paced trivia, no difficulty, immediate play |
| **Simulation** | Interactive job experience (NEW!) |

## Available Simulations

| Career | Simulation | Status |
|--------|------------|--------|
| Programmer | Code-fixing challenges | ✅ Ready |
| Nurse | TBD |
| Engineer | TBD |
| Teacher | TBD |
| Chef | TBD |
| Architect | TBD |

## Pending Improvements

- [ ] Add NurseSimulation - patient triage scenarios
- [ ] Add EngineerSimulation - structural challenges
- [ ] Add TeacherSimulation - classroom scenarios
- [ ] Add ChefSimulation - cooking challenges
- [ ] Add ArchitectSimulation - design puzzles
- [ ] Statistics/analytics screen
- [ ] Timer & streak system

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-06 | Implemented Career Simulation Mode feature |
