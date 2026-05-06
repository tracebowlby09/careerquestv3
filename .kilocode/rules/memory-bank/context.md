# Active Context: Career Quest V3

## Current State

**Game Status**: ✅ Fully playable career exploration game with certification mode and trophy case

Career Quest V3 is a career exploration game with multiple career paths featuring challenge modes, quick recall, certification exams, and a comprehensive trophy system with unlock hints and secret achievements.

## Recently Completed
- **Completed trophy case implementation** with emoji-based trophies, scrollable shelves, unlock hints, and secret achievements (May 2026)
- **Added Morse code "KILL ME" starfield background** to certification selection screen (epilepsy-safe 2s minimum intervals)
- **Added admin unlock all trophies button** (access with code 5839201746)
- **Fixed certification selection persistence bug** (no longer persists into challenge mode)
- **Fixed TypeScript compilation errors** (missing closing brace in handleStart function)
- **Added Certification Mode** across all 9 careers (May 2026)
- **Standardized question counts**: 10 challenge, 30 quick recall, 30 certification per career
- **Enhanced 227 questions** with certification-accurate content (real code/standard references)
- **80% passing threshold** for certification exams (vs 60% regular)
- **Fixed syntax errors** (malformed arrays in TeacherWorld, duplicate properties in ChefWorld)
- **Removed backup files** from git tracking
- **Unified certification UI**: tutorial shows "Pass the Certification" with 📜 icon for cert mode, "Pass the Challenge" with 🏆 for regular

### Specific Enhancements:

1. **Trophy System**: Scrollable trophy case with emoji-based trophies, unlock hints, day/night toggle, and secret achievements
2. **Morse Code Background**: "KILL ME" flashing starfield on certification selection screen (epilepsy-safe timing)
3. **Admin Unlock All**: Button to unlock all 27 regular + 30 secret trophies (access code 5839201746)
4. **Certification Mode Button** added to TitleScreen
5. **GameMode extended** with "certification" variant
6. **page.tsx updated** with certification routing (direct to playing with hard difficulty)
7. **OutcomeScreen** shows 80% threshold for certification
8. **All 9 career worlds** updated with `isCertification` prop and dynamic pass thresholds
9. **Question counts standardized**:
   - Architect: trimmed to 10 challenge (was 23)
   - Chef: trimmed to 10 challenge (was 23)
   - Teacher: trimmed to 10 challenge (was 15)
   - Electrician: added 7 challenge questions (was 2)
   - Lawyer: added 1 challenge question (was 8)
   - Programmer: added 1 challenge question (was 8)
   - Retail: added 7 challenge questions (was 2)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main game logic & routing | ✅ Ready |
| `src/components/careers/*.tsx` | Career world components | ✅ Enhanced |
| `src/components/difficulty/*.tsx` | Difficulty selection | ✅ Ready |
| `src/components/TrophyCase.tsx` | Scrollable trophy room | ✅ Complete |
| `src/components/TrophyShelf.tsx` | Career trophy shelves | ✅ Complete |
| `src/components/TrophyDetailModal.tsx` | Trophy details & hints | ✅ Complete |
| `src/components/MorseStarfield.tsx` | Background Morse flasher | ✅ Complete |

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