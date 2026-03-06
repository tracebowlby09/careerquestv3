# Career Simulations Plan

## Overview
Interactive job experience simulations for each of the 6 careers in Career Quest. Each simulation should feel unique and teach players what that job is actually like.

---

## 1. NurseSimulation 🏥

### Concept
Patient triage and vital signs management simulation

### Mechanics
- **Triage Board**: See multiple patients with symptoms
- **Drag & Drop**: Prioritize patients by urgency (Critical → Urgent → Stable)
- **Vital Signs Matching**: Match patients to correct vital signs readings
- **Time Pressure**: Assign beds/triage within time limit

### Tasks by Difficulty

| Difficulty | Tasks |
|------------|-------|
| **Easy** | 3 patients, simple symptoms (cold vs broken leg), drag to reorder |
| **Medium** | 5 patients, vital signs interpretation, time bonus for speed |
| **Hard** | 7 patients, conflicting symptoms, triage decisions with consequences |

### UI Elements
- Patient cards with avatars and symptoms
- Triage categories: 🔴 Critical | 🟠 Urgent | 🟢 Stable
- Countdown timer
- Score display

---

## 2. EngineerSimulation 🏗️

### Concept
Structural engineering challenges - build and test structures

### Mechanics
- **Bridge Builder**: Select materials and design to support weight
- **Load Calculator**: Balance forces on structures
- **Blueprint Editor**: Arrange components to meet requirements

### Tasks by Difficulty

| Difficulty | Tasks |
|------------|-------|
| **Easy** | Select correct material for simple bridge, 3 options |
| **Medium** | Balance load across 2 supports, calculate forces |
| **Hard** | Multi-level structure with wind + weight constraints |

### UI Elements
- Visual structure preview
- Material selector (Steel, Wood, Concrete)
- Stress indicators (green → yellow → red)
- Cost budget display

---

## 3. TeacherSimulation 👩‍🏫

### Concept
Classroom management and lesson planning simulation

### Mechanics
- **Scenario Cards**: Present student behavior situations
- **Decision Tree**: Choose appropriate responses
- **Lesson Builder**: Arrange topics in logical order

### Tasks by Difficulty

| Difficulty | Tasks |
|------------|-------|
| **Easy** | Match behavior to appropriate response (3 scenarios) |
| **Medium** | Handle 5 escalating situations, consequences matter |
| **Hard** | Full classroom with multiple issues, prioritize |

### Scenarios Examples
1. Student talking during lesson → Ignore / Redirect / Discipline
2. Two students arguing → Separate / Mediate / Send to office
3. Student struggling → Extra help / Peer tutoring / Modify assignment

### UI Elements
- Classroom visual with students
- Response options as buttons
- Consequence preview
- Class engagement meter

---

## 4. ChefSimulation 👨‍🍳

### Concept
Kitchen timing and menu management

### Mechanics
- **Order Queue**: See incoming orders with ingredients
- **Timing Grid**: Drag ingredients to cooking stations
- **Plating**: Arrange dish elements visually

### Tasks by Difficulty

| Difficulty | Tasks |
|------------|-------|
| **Easy** | Complete 3 simple recipes, order doesn't matter |
| **Medium** | Manage 4 orders, timing matters (don't burn!) |
| **Hard** | 6 orders simultaneously, complex recipes |

### Mechanics Details
- Cooking stations: Grill, Pan, Oven, Prep
- Timer per station
- Burn penalty = points lost

### UI Elements
- Order tickets at top
- Ingredient drag-drop area
- Cooking station timers
- Plate preview

---

## 5. ArchitectSimulation 🏛️

### Concept
Space planning and building design

### Mechanics
- **Room Planner**: Drag rooms to create floor plan
- **Requirements Check**: Ensure building meets codes
- **Material Selector**: Choose materials within budget

### Tasks by Difficulty

| Difficulty | Tasks |
|------------|-------|
| **Easy** | Arrange 3 rooms (bed, bath, kitchen) logically |
| **Medium** | Add plumbing/electrical constraints, stay in budget |
| **Hard** | Multi-story with ADA compliance, budget, aesthetic |

### Requirements to Meet
- Room adjacency (kitchen near dining)
- Window placement for light
- Emergency exit access
- Budget limit

### UI Elements
- Grid-based floor planner
- Room drag-drop
- Requirement checklist
- Budget meter
- 3D preview option

---

## Implementation Priority

| Priority | Career | Why |
|----------|--------|-----|
| 1 | Nurse | Triage is core nursing skill, high engagement |
| 2 | Engineer | Visual/structural is satisfying |
| 3 | Teacher | Important career, decision trees work well |
| 4 | Chef | Timing mechanics are fun |
| 5 | Architect | Complex but rewarding |

---

## Technical Approach

### Reuse Pattern from ProgrammerSimulation
Each simulation follows similar structure:
```
- tasks: Record<Difficulty, Task[]>
- Task: { id, title, description, timeLimit, points }
- Component: Props { difficulty, onComplete }
- State: currentTask, timeLeft, score, feedback
```

### Common UI Components to Create
- `Timer` - Countdown display
- `ScoreBoard` - Points with bonus indicators
- `TaskCard` - Task info display
- `ProgressBar` - Task completion tracking
- `FeedbackToast` - Correct/incorrect notifications

---

## Questions for Implementation

1. Should simulations be locked until Challenge Mode is completed?
2. Should there be a "tutorial" for first-time players?
3. Should difficulty affect which tasks appear, or just complexity?
