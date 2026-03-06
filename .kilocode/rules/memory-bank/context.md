# Active Context: Career Quest V3

## Current State

**Game Status**: ✅ Fully playable career simulation game

Career Quest V3 is a career simulation game with multiple career paths (Programmer, Nurse, Engineer, Teacher, Chef, Architect) featuring challenge modes and quick recall gameplay. Now includes interactive Career Simulation Mode for hands-on job experience!

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Career worlds with ScreenWrapper and exit warning popup
- [x] Added progress loss warning when exiting career worlds during tests
- [x] Added multiple patients to nurse quick recall questions
- [x] Fixed pass/fail screen alignment (centered)
- [x] Fixed career worlds to be full screen
- [x] Added secret Konami code trophy easter egg
- [x] Added unique Quick Recall career selection screen with gradient cards
- [x] Added Ultimate Career Master trophy (complete all difficulties for ALL careers)
- [x] Added Quick Recall Legend trophy (complete Quick Recall for ALL careers)
- [x] Fixed background music overlapping issue when switching between different music packs
- [x] Added music transition lock to prevent concurrent music changes
- [x] **NEW**: Career Simulation Mode - interactive job experience
- [x] **NEW**: ProgrammerSimulation - code-fixing challenges
- [x] **NEW**: All 6 career simulations (Programmer, Nurse, Engineer, Teacher, Chef, Architect)
- [x] Removed timers from all simulations for stress-free gameplay
- [x] Added exit buttons to all simulations

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main game logic & routing | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/components/ScreenWrapper.tsx` | Screen wrapper with exit warning | ✅ Ready |
| `src/components/careers/*.tsx` | Career world components | ✅ Ready |
| `src/components/simulations/` | Interactive simulations | 🔄 Expanding |
| `src/lib/audio.ts` | Audio system | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

**Career Simulation Mode**: New interactive game mode where players experience what jobs are actually like through hands-on challenges.

- Currently: All 6 career simulations complete (Programmer, Nurse, Engineer, Teacher, Chef, Architect)
- All simulations now have exit buttons and no timers for stress-free gameplay

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
| Nurse | Patient triage challenges | ✅ Ready |
| Engineer | Structural challenges | ✅ Ready |
| Teacher | Classroom scenarios | ✅ Ready |
| Chef | Cooking challenges | ✅ Ready |
| Architect | Design puzzles | ✅ Ready |

### To add a new career:

Create a new component in `src/components/careers/` and add it to `page.tsx`.

### To modify career worlds:

Edit the component files in `src/components/careers/`.

### Exit Warning System:

The ScreenWrapper component now includes an optional exit warning when `showExitWarning={true}` is passed.

### Secret Konami Code Trophy:

Enter the Konami code (↑↑↓↓←→←→BA) anywhere in the game to unlock a secret trophy. A popup will appear at the top of the screen when unlocked. The trophy only appears in the Trophy Case after unlocking.

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

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
| 2026-03-06 | Added career worlds with ScreenWrapper and exit warning popup |
| 2026-03-06 | Added multiple patients to nurse quick recall questions |
| 2026-03-06 | Fixed pass/fail screen alignment and career worlds full screen |
| 2026-03-06 | Added secret Konami code trophy with popup notification |
| 2026-03-06 | Added Ultimate Career Master and Quick Recall Legend trophies |
| 2026-03-06 | Fixed background music overlapping issue when switching between different music packs |
| 2026-03-06 | Implemented Career Simulation Mode feature |
| 2026-03-06 | Removed timers from all simulations, added exit buttons to all simulations |
| 2026-03-06 | Added music transition lock to prevent concurrent music changes |
| 2026-03-06 | Implemented Career Simulation Mode feature |
