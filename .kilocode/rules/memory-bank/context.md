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
- **Added Certification Mode** across all 9 careers (May 2026)
- **Standardized question counts**: 10 challenge, 30 quick recall, 30 certification per career
- **Enhanced 227 questions** with certification-accurate content (real code/standard references)
- **80% passing threshold** for certification exams (vs 60% regular)
- **Fixed syntax errors** (malformed arrays in TeacherWorld, duplicate properties in ChefWorld)
- **Removed backup files** from git tracking
- **Unified certification UI**: tutorial shows "Pass the Certification" with 📜 icon for cert mode, "Pass the Challenge" with 🏆 for regular

### Specific Enhancements:

1. **Certification Mode Button** added to TitleScreen
2. **GameMode extended** with "certification" variant
3. **page.tsx updated** with certification routing (direct to playing with hard difficulty)
4. **OutcomeScreen** shows 80% threshold for certification
5. **All 9 career worlds** updated with `isCertification` prop and dynamic pass thresholds
6. **Question counts standardized**:
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