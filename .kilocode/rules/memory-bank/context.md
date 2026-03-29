# Active Context: Career Quest V3

## Current State

**Game Status**: ✅ Fully playable career exploration game

Career Quest V3 is a career exploration game with multiple career paths (Programmer, Nurse, Engineer, Teacher, Chef, Architect) featuring challenge modes and quick recall gameplay.

## Recently Completed

- [x] Added hints for all secret trophies in Trophy Case (locked trophies show cryptic hints, unlocked trophies show descriptions)
- [x] Fixed music overlapping bug by ensuring proper music state reset before starting new tracks
- [x] Removed redundant music start call in TitleScreen component
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
- [x] Enhanced TitleScreen with animated background particles and improved styling
- [x] Fixed back button on TutorialScreen instructions to properly exit to title screen
- [x] Made all career worlds full screen without outline (Challenge Mode and Quick Recall)
- [x] Added Pi digit typing secret trophies (Pi Pioneer at 3.14, Pi Explorer at 3.141, Pi Master at 3.1415, Pi Genius at 3.14159, Pi Legend at 3.1415926)
- [x] Changed tutorial "Back" button to go to difficulty selection screen instead of title screen
- [x] Added career-specific background images for simulation screens (programmer, nurse, engineer, teacher, chef, architect)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main game logic & routing | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/components/ScreenWrapper.tsx` | Screen wrapper with exit warning | ✅ Ready |
| `src/components/careers/*.tsx` | Career world components | ✅ Ready |
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

Create a new component in `src/components/careers/` and add it to `page.tsx`.

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
| 2026-03-29 | Added hints for all secret trophies in Trophy Case (locked trophies show cryptic hints, unlocked trophies show descriptions) | - added proper state reset and removed redundant music start call |
