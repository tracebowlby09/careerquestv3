# Active Context: Career Quest V3

## Current State

**Game Status**: ✅ Fully playable career exploration game with 9 new careers added (firefighter, police, pilot, veterinarian, journalist, social-worker, accountant, dentist, construction)

**Auth Status**: ✅ LocalStorage-based auth system implemented - signup/login flows, per-user progress storage, guest mode warning with dismiss option

Career Quest V3 is a career exploration game with multiple career paths featuring challenge modes, quick recall, and certification exams.

## Recently Completed

- ✅ **Added 9 new careers**: firefighter, police, pilot, veterinarian, journalist, social-worker, accountant, dentist, construction
- ✅ **Updated types/game.ts**: Added 9 new Career types and 9 new CertificationType values
- ✅ **Updated lib/careerInfo.ts**: Added career info for all 9 new careers with full details
- ✅ **Updated lib/certificationQuestions.ts**: Added 5 certification questions per new career (45 total) + quick recall questions
- ✅ **Updated components/CertificationSelection.tsx**: Added new certifications to the order list
- ✅ **Updated page.tsx**: Added imports, careerNames mappings, switch cases for difficulty and world components, and certToCareerMap
- ✅ **Updated components/OutcomeScreen.tsx**: Added career data for all 9 new careers
- ✅ **Updated components/StatsScreen.tsx**: Added mappings for all 9 new careers
- ✅ **Updated components/ProfileScreen.tsx**: Added mappings for all 9 new careers
- ✅ **Created World components**: FirefighterWorld, PoliceWorld, PilotWorld, VeterinarianWorld, JournalistWorld, SocialWorkerWorld, AccountantWorld, DentistWorld, ConstructionWorld
- ✅ **Created Difficulty components**: All corresponding difficulty wrappers
- ✅ **Fixed dayInLife typo**: Changed dayInTheLife to dayInLife in electrician entry
- ✅ **Added quick recall questions**: Expanded all 9 new career World components to 20 quick recall questions each (178 total new questions added: Accountant +19, Construction +19, Dentist +19, Firefighter +18, Journalist +19, Pilot +19, Police +19, SocialWorker +19, Veterinarian +19)
- ✅ **Added auth system**: Created AuthScreen component, user account types, localStorage-based authentication with per-user progress storage
- ✅ **Added guest mode warning**: ProfileScreen shows warning banner when no user is logged in
- ✅ **Wired auth handlers**: handleLogin, handleSignup, handleLogout connected in page.tsx with user-aware save/load functions
- ✅ **Added guest warning dismiss**: Users can dismiss the guest warning in ProfileScreen to continue playing
- ✅ **Preserved game mode flow**: Pending game mode is saved when redirecting to auth, restored after successful login/signup/guest play
- ✅ **Enhanced custom tests**: Added descriptions, emoji icons, three required learned skills, visible custom backgrounds, code preview with test name/questions, custom test end screens, and approved custom test listings on the title screen
- ✅ **Expanded admin tools**: Added admin panel progress stats, custom test launcher, session reset, level reset, full progress reset, guest warning toggle, trophy commands, developer dashboard access, scrollable layout, and corner resizing
- ✅ **Updated tutorial screen**: Added Career Quest V3 feature overview covering 18 career paths, challenge mode, quick recall, certification exams, custom quizzes, trophies, stats/profile/leveling, and accounts/guest play, plus login and sign up entry buttons.
- ✅ **Updated title copy**: Changed career path count from 9 to 18 to match the expanded career roster.
- ✅ **Enhanced custom tests**: Added creator editing for approved front-page quizzes and pending quizzes with same-code reapproval flow, plus per-question photo uploads shown in creator, moderator, preview, and play screens.
- ✅ **Added custom quiz edit entry point**: Added an "Edit My Test" button inside the custom quiz creation screen so creators can choose pending or approved quizzes to edit from the same tab.
- ✅ **Added Story Mode**: Added a title-screen Story Mode entry point with career journey selection, mentor characters, five milestone challenges per career, retry/next milestone flow, journey completion screen, and per-user or guest localStorage progress.
- ✅ **Added accessibility settings and How to Play walkthrough**: Added persistent accessibility preferences for high contrast, larger text, readable layout, and reduced motion, plus an interactive title-screen How to Play walkthrough.
- ✅ **Updated How to Play content**: Expanded walkthrough steps to include Story Mode, Certification Mode, XP/achievements, and the Career Aptitude Dashboard.
- ✅ **Added Career Aptitude Dashboard**: Created CareerAptitudeDashboard component showing skill strength analysis across all careers, top matches highlighting, and career exploration entry points.
- ✅ **Added Career Pivot Suggestions**: StoryOutcomeScreen now shows 3 alternative career suggestions for failed milestones with "Try This" buttons to immediately start a new journey.
- ✅ **Changed Quick Recall timer**: Reduced from 20 to 15 seconds in all 18 World components (Accountant, Architect, Chef, Construction, Dentist, Electrician, Engineer, Firefighter, Journalist, Lawyer, Nurse, Pilot, Police, Programmer, Retail, Social Worker, Teacher, Veterinarian)
- ✅ **Expanded certification tests**: Added 20 questions to each of 18 certification question banks (PE, Teaching, ServSafe, ARE, Bar, Customer Service, Journeyman, Firefighter, Police, CPL, Vet Tech, Journalism, LCSW, CPA, Dental Board, OSHA, RN, AWS) - all now have 25 questions each

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
| `src/components/CustomTestCreate.tsx` | Custom quiz/test builder | ✅ Enhanced |
| `src/components/CustomTestOutcome.tsx` | Custom test completion screen | ✅ Added |
| `src/components/ModeratorDashboard.tsx` | Custom test moderation dashboard | ✅ Enhanced |
| `src/components/careers/CustomTestWorld.tsx` | Custom quiz/test player | ✅ Enhanced |
| `src/components/difficulty/*.tsx` | Difficulty selection | ✅ Ready |
| `src/components/StoryModeSelection.tsx` | Story Mode career journey selector | ✅ Added |
| `src/components/StoryOutcomeScreen.tsx` | Story Mode milestone result screen | ✅ Added |
| `src/components/StoryCompleteScreen.tsx` | Story Mode journey completion screen | ✅ Added |
| `src/lib/storyMode.ts` | Story Mode journey data and progress helpers | ✅ Added |

## Total Question Bank

| Career | Easy | Medium | Hard | Challenge | Quick Recall | Certification | Total |
|--------|------|--------|------|-----------|--------------|---------------|-------|
| Firefighter | 2 | 2 | 1 | 5 | 20 | 25 | 55 |
| Police | 1 | 1 | 1 | 3 | 20 | 25 | 50 |
| Pilot | 1 | 1 | 1 | 3 | 20 | 25 | 50 |
| Veterinarian | 2 | 2 | 1 | 5 | 20 | 25 | 55 |
| Journalist | 1 | 1 | 1 | 3 | 20 | 25 | 50 |
| Social Worker | 1 | 1 | 1 | 3 | 20 | 25 | 50 |
| Accountant | 1 | 1 | 1 | 3 | 20 | 25 | 50 |
| Dentist | 1 | 1 | 1 | 3 | 20 | 25 | 50 |
| Construction | 1 | 1 | 1 | 3 | 20 | 25 | 50 |
| ... (other careers) | ... | ... | ... | ... | ... | ... | ... |
| **TOTAL** | **~31** | **~31** | **~44** | **~114** | **~520** | **~450** | **~1197+** |

Note: Challenge questions per career = 3-5 (varies by career). Certification uses Hard questions.

### Passing Thresholds
- Regular Challenge Mode: **60%**
- Certification Mode: **80%**

## Session History

| Date | Changes |
|------|---------|
| 2026-06-15 | Initial auth system implementation - AuthScreen, ProfileScreen guest warning, user-aware save/load |
| 2026-06-16 | Fixed duplicate handleStart, added pending mode flow, fixed useCallback for load/save functions |
| 2026-06-16 | Added UserAccount import, restored missing user management functions |
| 2026-06-16 | Fixed null handling in handleLogin and useEffect for user data loading |
| 2026-06-16 | Added explicit Trophy type annotations for strict TypeScript mode |
| 2026-06-16 | Added custom test creation feature - quiz builder, code-based sharing, localStorage storage |
| 2026-06-16 | Enhanced custom tests - descriptions, emoji icons, three learned skills, background display, code preview, custom end screen, and title-screen approved test listings |
| 2026-06-16 | Expanded admin tools - progress stats, custom test launcher, reset controls, guest warning toggle, and moderator dashboard enhancements |
| 2026-06-16 | Added trophy admin commands and opened developer dashboard access to admin panel users |
| 2026-06-16 | Made the admin panel scrollable and resizable from all four corners |
| 2026-06-16 | Updated tutorial screen with full V3 feature overview and login/sign up entry buttons; updated title copy to 18 career paths |
| 2026-06-16 | Removed admin/moderator tools from the tutorial screen |
| 2026-06-17 | Enhanced custom tests with same-code reapproval editing for creator-owned approved and pending quizzes and per-question photo uploads |
| 2026-06-17 | Added an “Edit My Test” entry point inside the custom quiz creation screen |
| 2026-06-18 | Added Story Mode with career journeys, milestone progress, and story result screens |
| 2026-06-18 | Reviewed committed Story Mode changes and fixed unused props, unused imports, and JSX spacing issues |
| 2026-06-18 | Added accessibility preferences and an interactive title-screen How to Play walkthrough |

## New Certification Types Added
- firefighter-cert (Firefighter I & II Certification)
- police-academy (Police Academy Certification)
- cpl-license (Commercial Pilot License)
- vet-tech (Veterinary Technician Certification)
- journalism-award (Journalism Excellence Award)
- lcsw (Licensed Clinical Social Worker)
- cpa (Certified Public Accountant)
- dental-board (Dental Board Certification)
- osha-30 (OSHA 30-Hour Construction)

### 2026-06-18
- Added Career Aptitude Dashboard and Career Pivot Suggestions for deeper game design

### 2026-06-26
- Equalized certification tile sizes in CertificationSelection to match CareerSelection styling

### 2026-06-27
- Changed Quick Recall timer from 20 to 15 seconds across all 18 career World components
- Expanded all 18 certification question banks from 5 to 25 questions each (RN, PE, Teaching, ServSafe, ARE, Bar, Customer Service, Journeyman, Firefighter, Police, CPL, Vet Tech, Journalism, LCSW, CPA, Dental Board, OSHA, AWS)
