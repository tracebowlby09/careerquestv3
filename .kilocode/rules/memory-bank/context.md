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
- ✅ **Added guest warning dismiss**: Users can dismiss the guest warning in ProfileScreen

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
| Firefighter | 2 | 2 | 1 | 5 | 20 | 5 | 24 |
| Police | 1 | 1 | 1 | 3 | 20 | 5 | 21 |
| Pilot | 1 | 1 | 1 | 3 | 20 | 5 | 21 |
| Veterinarian | 2 | 2 | 1 | 5 | 20 | 5 | 24 |
| Journalist | 1 | 1 | 1 | 3 | 20 | 5 | 21 |
| Social Worker | 1 | 1 | 1 | 3 | 20 | 5 | 21 |
| Accountant | 1 | 1 | 1 | 3 | 20 | 5 | 21 |
| Dentist | 1 | 1 | 1 | 3 | 20 | 5 | 21 |
| Construction | 1 | 1 | 1 | 3 | 20 | 5 | 21 |
| ... (other careers) | ... | ... | ... | ... | ... | ... | ... |
| **TOTAL** | **~31** | **~31** | **~44** | **~114** | **~520** | **~299** | **~937+** |

Note: Challenge questions per career = 3-5 (varies by career). Certification uses Hard questions.

### Passing Thresholds
- Regular Challenge Mode: **60%**
- Certification Mode: **80%**

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