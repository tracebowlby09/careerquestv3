# Active Context: Career Quest V3

## Current State

**Game Status**: ✅ Fully playable career exploration game with enhanced certification-style questions

Career Quest V3 is a career exploration game with multiple career paths featuring challenge modes and quick recall gameplay.

## Recently Completed

- **Added 58 new challenge questions** across Architect, Chef, and Teacher careers (May 2026)
- **Enhanced question accuracy** to better reflect real certification exams and professional standards
- **Increased question variety** with 6-10 questions per difficulty level in key careers
- **Updated documentation** to reflect expanded content

### Specific Enhancements:
1. **ArchitectWorld.tsx**: Expanded from 9 to 23 challenge questions (6 easy, 8 medium, 10 hard)
   - Added code compliance questions (ADA, building codes, fire safety)
   - Added professional ethics scenarios
   - Added sustainable design considerations
   - Added structural engineering challenges

2. **ChefWorld.tsx**: Expanded from 9 to 23 challenge questions (6 easy, 8 medium, 10 hard)
   - Added food safety certification-style questions (HACCP, allergen management)
   - Added professional kitchen management scenarios
   - Added advanced culinary techniques and troubleshooting
   - Added nutrition and dietary accommodation questions

3. **TeacherWorld.tsx**: Expanded from 9 to 15 challenge questions (4 easy, 5 medium, 6 hard)
   - Added certification area teaching scenarios
   - Added IEP and special education compliance questions
   - Added professional ethics and boundary questions
   - Added parent communication and classroom management scenarios

## Current Structure

| File/Directory | Purpose | Status | Question Count |
|----------------|---------|--------|----------------|
| `src/app/page.tsx` | Main game logic & routing | ✅ Ready | - |
| `src/components/careers/*.tsx` | Career world components | ✅ Enhanced | 329 challenge + 198 QR |
| `src/components/difficulty/*.tsx` | Difficulty selection | ✅ Ready | - |

## Total Question Bank

| Career | Challenge | Quick Recall | Total |
|--------|-----------|--------------|-------|
| Nurse | 136 | 30 | 166 |
| Engineer | 130 | 30 | 160 |
| Architect | 23 | 30 | 53 |
| Chef | 23 | 30 | 53 |
| Teacher | 15 | 30 | 45 |
| Programmer | 9 | 30 | 39 |
| Lawyer | 9 | 12 | 21 |
| Retail | 9 | 3 | 12 |
| Electrician | 9 | 3 | 12 |
| **TOTAL** | **329** | **198** | **527** |

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
