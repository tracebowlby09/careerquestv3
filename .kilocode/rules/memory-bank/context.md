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
- [x] **NEW**: ProgrammerSimulation - Bug Fix Sprint (multiple choice code fixing)
- [x] **NEW**: NurseSimulation - Emergency Room Shift (triage + treatment actions)
- [x] **NEW**: EngineerSimulation - Bridge Builder (visual bridge building with stress test)
- [x] **NEW**: TeacherSimulation - Classroom Management (engagement meter, student events)
- [x] **NEW**: ChefSimulation - Dinner Rush (order management, cooking, special requests)
- [x] **NEW**: ArchitectSimulation - Dream House Design (client requirements, zoning, budget)
- [x] Removed timers from all simulations for stress-free gameplay
- [x] Added exit buttons to all simulations
- [x] Redesigned all simulations with enhanced gameplay mechanics
- [x] Added unique Simulation Mode selection screen with career-specific themed cards
- [x] Enhanced TitleScreen with animated background particles and improved styling

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main game logic & routing | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/components/ScreenWrapper.tsx` | Screen wrapper with exit warning | ✅ Ready |
| `src/components/careers/*.tsx` | Career world components | ✅ Ready |
| `src/components/simulations/` | Interactive simulations | ✅ Complete |
| `src/lib/audio.ts` | Audio system | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

**Career Simulation Mode Rework**: All 6 career simulations have been reworked with new gameplay mechanics matching real job experiences:

1. **ProgrammerSimulation - "Bug Fix Sprint"**: Multiple choice code fixes, release deadline urgency, bug types (syntax/logic/algorithm/null-check)
2. **NurseSimulation - "Emergency Room Shift"**: Patient triage + treatment actions, vital signs display, call doctor for critical cases
3. **EngineerSimulation - "Bridge Builder"**: Visual bridge building with grid, material selection, stress testing with vehicles
4. **TeacherSimulation - "Classroom Management"**: Engagement meter, classroom events (questions/distractions/disruptions/quiz), decisions affect engagement
5. **ChefSimulation - "Dinner Rush"**: Order generation, cooking stations, ingredient prep, special requests, burning mechanic
6. **ArchitectSimulation - "Dream House Design"**: Client requirements tracking, room placement on grid, budget management, zoning rules

**Polish Enhancements Applied**:
- Fade-in animations on game start
- Hover scale effects on interactive elements
- Pulse animations for urgent situations
- Color-coded progress bars and patience meters
- Bounce animations for completed actions
- Enhanced feedback messages with emojis

## Game Modes

| Mode | Description |
|------|-------------|
| Challenge Mode | Full game with difficulty selection, earn trophies |
| Quick Recall | Fast-paced trivia, no difficulty, immediate play |
| **Simulation** | Interactive job experience |

## Available Simulations

| Career | Simulation | Status |
|--------|------------|--------|
| Programmer | Bug Fix Sprint - Multiple choice code fixing | ✅ Ready |
| Nurse | Emergency Room Shift - Triage + treatments | ✅ Ready |
| Engineer | Bridge Builder - Visual construction + stress test | ✅ Ready |
| Teacher | Classroom Management - Engagement meter + events | ✅ Ready |
| Chef | Dinner Rush - Order management + cooking | ✅ Ready |
| Architect | Dream House Design - Client requirements + budget | ✅ Ready |

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

- [x] All simulations implemented with enhanced gameplay
- [ ] Statistics/analytics screen
- [ ] Timer & streak system
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
| 2026-03-06 | Implemented Career Simulation Mode feature |
| 2026-03-06 | Removed timers from all simulations, added exit buttons to all simulations |
| 2026-03-06 | Redesigned ArchitectSimulation to be easier and more fun |
| 2026-03-06 | Added music transition lock to prevent concurrent music changes |
| 2026-03-07 | **Major Rework**: All 6 career simulations reworked with new gameplay mechanics |
| 2026-03-07 | ProgrammerSimulation now Bug Fix Sprint with multiple choice |
| 2026-03-07 | NurseSimulation now Emergency Room Shift with triage + treatments |
| 2026-03-07 | EngineerSimulation now Bridge Builder with visual construction |
| 2026-03-07 | TeacherSimulation now Classroom Management with engagement meter |
| 2026-03-07 | ChefSimulation now Dinner Rush with order management |
| 2026-03-07 | ArchitectSimulation now Dream House Design with client requirements |
| 2026-03-08 | **Unique Simulation Pick Screen**: Added career-specific themed selection UI |
| 2026-03-08 | **TitleScreen Polish**: Added animated background particles and improved styling |
