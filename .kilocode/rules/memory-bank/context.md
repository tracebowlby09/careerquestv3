# Active Context: Career Quest V3

## Current State

**Game Status**: ✅ Fully playable career exploration game

Career Quest V3 is a career exploration game with multiple career paths (Programmer, Nurse, Engineer, Teacher, Chef, Architect, Lawyer, Retail Worker, Electrician) featuring challenge modes and quick recall gameplay.

## Recently Completed

- [x] Added 3 new careers: Lawyer, Retail Worker, and Electrician (May 2026)
- [x] Updated types/game.ts with new career types
- [x] Created LawyerWorld.tsx with legal reasoning questions
- [x] Created RetailWorld.tsx with customer service scenarios
- [x] Created ElectricianWorld.tsx with electrical code questions
- [x] Created corresponding difficulty components for all 3 careers
- [x] Updated CareerSelection.tsx with new career cards
- [x] Updated OutcomeScreen.tsx with career data for new careers
- [x] Updated TrophyScreen.tsx to display new careers
- [x] Added background images for Lawyer, Retail, and Electrician careers

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main game logic & routing | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/components/ScreenWrapper.tsx` | Screen wrapper with exit warning | ✅ Ready |
| `src/components/careers/*.tsx` | Career world components | ✅ Ready (6 original + 3 new) |
| `src/components/difficulty/*.tsx` | Difficulty selection components | ✅ Ready (6 original + 3 new) |
| `src/lib/audio.ts` | Audio system | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The game now supports two game modes:
1. **Challenge Mode**: Full game with difficulty selection (Easy/Medium/Hard), earn trophies
2. **Quick Recall**: Fast-paced trivia, no difficulty, immediate play

## Game Modes

| Mode | Description |
|------|-------------|
| Challenge Mode | Full game with difficulty selection, earn trophies |
| Quick Recall | Fast-paced trivia, no difficulty, immediate play |

### To add a new career:

Create a new component in `src/components/careers/`, add it to `page.tsx`, create a corresponding difficulty component, and update the types and supporting components.

### To modify career worlds:

Edit the component files in `src/components/careers/`.

### Exit Warning System:

The ScreenWrapper component now includes an optional exit warning when `showExitWarning={true}` is passed.

### Background Images:

The ScreenWrapper component supports career-specific background images via the `backgroundImage` prop. When provided, it displays a full-cover background image instead of the gradient. The images should be placed in the `public/images/` directory with the naming convention `career-bg.jpg` (e.g., `programmer-bg.jpg`, `nurse-bg.jpg`, etc.).

### Secret Konami Code Trophy:

Enter the Konami code (↑↑↓↓←→←→BA) anywhere in the game to unlock a secret trophy. A popup will appear at the top of the screen when unlocked. The trophy only appears in the Trophy Case after unlocking.

### Easter Egg Trophies:

The game includes several secret easter egg trophies that can be unlocked through specific actions:

| Trophy | How to Unlock | Icon |
|--------|--------------|------|
| Lightning Reflex | Answer 5 questions correctly in a row, each under 10 seconds | ⚡ |
| Marathon Runner | Complete a Challenge Mode career with no wrong answers | 🏃 |
| Speed Demon | Complete Quick Recall with a perfect score in under 30 seconds | 🔥 |
| Jack of All Trades | Play at least one question from each career | 🎭 |
| Lucky Star | Get a question wrong but still pass on Hard mode | 🍀 |
| Night Owl | Play the game after 10 PM | 🦉 |
| Early Bird | Play the game before 6 AM | 🐦 |
| Pi Pioneer | Type the first 3 digits of Pi (3.14) | 🥧 |
| Pi Explorer | Type 4 digits of Pi (3.141) | 🔢 |
| Pi Master | Type 5 digits of Pi (3.1415) | 🧮 |
| Pi Genius | Type 6 digits of Pi (3.14159) | 💡 |
| Pi Legend | Type 9 digits of Pi (3.1415926) | 🏆 |

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Statistics/analytics screen
- [ ] Additional difficulty levels

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
| 2026-03-06 | Added music transition lock to prevent concurrent music changes |
| 2026-03-08 | Enhanced TitleScreen with animated background particles and improved styling |
| 2026-03-10 | Removed Career Simulation Mode - deleted all simulation components and references |
| 2026-03-10 | Fixed back button on TutorialScreen instructions to properly exit to title screen |
| 2026-03-11 | Made all career worlds full screen without outline (Challenge Mode and Quick Recall) |
| 2026-03-12 | Added 7 new easter egg trophies (Lightning Reflex, Marathon Runner, Speed Demon, Jack of All Trades, Lucky Star, Night Owl, Early Bird) |
| 2026-03-25 | Added career-specific background images for simulation screens |
| 2026-03-27 | Fixed music overlapping bug - added proper music state reset and removed redundant music start call |
| 2026-03-29 | Added hints for all secret trophies in Trophy Case (locked trophies show cryptic hints, unlocked trophies show descriptions) |
| 2026-05 | Added 3 new careers: Lawyer, Retail Worker, Electrician with full question sets and difficulty components |
