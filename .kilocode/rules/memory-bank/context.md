# Active Context: Career Quest V3

## Current State

**Game Status**: ✅ Fully playable career simulation game

Career Quest V3 is a career simulation game with multiple career paths (Programmer, Nurse, Engineer, Teacher, Chef, Architect) featuring challenge modes and quick recall gameplay.

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

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main game logic & routing | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/components/ScreenWrapper.tsx` | Screen wrapper with exit warning | ✅ Ready |
| `src/components/careers/*.tsx` | Career world components | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

Game is fully functional with multiple career paths. Exit warning system now in place for career worlds.

## Quick Start Guide

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

- [ ] Add more career paths
- [ ] Add more questions to existing careers
- [ ] Add more recipes (auth, email, etc.)
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-06 | Added career worlds with ScreenWrapper and exit warning popup |
| 2026-03-06 | Added multiple patients to nurse quick recall questions |
| 2026-03-06 | Fixed pass/fail screen alignment and career worlds full screen |
| 2026-03-06 | Added secret Konami code trophy with popup notification |
| 2026-03-06 | Added Ultimate Career Master and Quick Recall Legend trophies |
