# Active Context: Career Quest V3

## Current State

**Game Status**: ✅ Fully playable career exploration game with certification mode (fixed white screen after certification exams)

Career Quest V3 is a career exploration game with multiple career paths featuring challenge modes, quick recall, and certification exams.

## Recently Completed

- ✅ **Fixed duplicate questions in ArchitectWorld** - Removed duplicate hard difficulty question entries (h1-h4 appeared twice in the questions array)
- ✅ **Fixed text color issues** - Corrected text color in ArchitectDifficulty and ChefDifficulty from black to white for readability on dark backgrounds
- ✅ **Removed debug console.log** - Cleaned up leftover debug statement in page.tsx
- ✅ **Added feedback for incorrect answers** - Outcome screen now shows a review section with questions answered incorrectly, the correct answer, and explanations
- ✅ **Added Home Screen Tutorial** - First-time users see a guided tutorial explaining each button on the home screen with option to skip
- ✅ **Updated flavor text** on home screen to be more engaging ("Master real-world skills across 9 exciting careers...")
- ✅ **Added Stats & Analytics Dashboard** - Players can track overall progress, win rates, and performance trends across careers and difficulties
- ✅ **Added XP & Leveling System** - Players earn XP for completing challenges (more for higher difficulty and better scores), level up with rewards and the LevelUpPopup shows unlockable rewards
- ✅ **Added Daily Challenges & Streaks** - Rotating daily challenges with streak XP bonuses (5 XP per day, max 50), displayed on title screen with "Accept Challenge" button
- ✅ **Added Profile Screen** - Top-right profile icon shows Level, top 3 most prestigious trophies, and total trophy count with XP needed for next level

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main game logic & routing | ✅ Ready |
| `src/app/careers/[career]/page.tsx` | Standalone career information route | ✅ Ready |
| `src/components/CareerInfoPage.tsx` | Reusable career information UI | ✅ Ready |
| `src/components/CareerSelection.tsx` | Career card selection with Learn More entry points | ✅ Enhanced |
| `src/components/StatsScreen.tsx` | Stats & Analytics dashboard with XP tracking | ✅ Ready |
| `src/components/LevelUpPopup.tsx` | Level up celebration with rewards | ✅ Ready |
| `src/components/ProfileScreen.tsx` | Profile popup with top trophies and level info | ✅ Ready |
| `src/lib/careerInfo.ts` | Shared career content, salary, skills, and day-in-life data | ✅ Ready |
| `src/components/careers/*.tsx` | Career world components | ✅ Enhanced |
| `src/components/difficulty/*.tsx` | Difficulty selection | ✅ Ready |

## Total Question Bank

| Career | Easy | Medium | Hard | Challenge | Quick Recall | Certification | Total |
|--------|------|--------|------|-----------|--------------|---------------|-------|
| Programmer | 3 | 3 | 4 | 10 | 30 | 30 | 70 |
| Nurse | 4 | 4 | 5 | 13 | 30 | 30 | 73 |
| Engineer | 4 | 4 | 5 | 13 | 30 | 30 | 73 |
| Architect | 3 | 3 | 4 | 10 | 30 | 30 | 70 |
| Teacher | 3 | 3 | 4 | 10 | 30 | 30 | 70 |
| Chef | 3 | 3 | 4 | 10 | 30 | 30 | 70 |
| Lawyer | 3 | 3 | 4 | 10 | 30 | 30 | 70 |
| Retail | 3 | 3 | 4 | 10 | 30 | 30 | 70 |
| Electrician | 3 | 3 | 4 | 10 | 30 | 30 | 70 |
| **TOTAL** | **29** | **29** | **38** | **90** | **270** | **270** | **638** |

Note: Challenge questions per career = 10 (3 easy + 3 medium + 4 hard). Certification uses Hard questions.

### Passing Thresholds
- Regular Challenge Mode: **60%**
- Certification Mode: **80%**

## To Modify Career Worlds

Edit the component files in `src/components/careers/`. All worlds support:
- `isCertification?: boolean` prop
- Dynamic pass threshold (60% regular, 80% certification)
- Tutorial text that adapts to certification mode