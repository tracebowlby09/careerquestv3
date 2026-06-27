"use client";

import { useState, useMemo, useEffect } from "react";
import { Difficulty, IncorrectAnswer } from "@/types/game";
import { audioSystem } from "@/lib/audio";
import TutorialScreen from "@/components/TutorialScreen";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface ElectricianWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number, incorrectAnswers?: IncorrectAnswer[]) => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

interface Question {
  id: string;
  scenario: string;
  question: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Installing a new 15-amp circuit for bedroom outlets.",
      question: "What wire gauge is required?",
      options: [
        { id: "a", text: "14 AWG copper", correct: true, explanation: "14 AWG is rated for 15-amp circuits per NEC." },
        { id: "b", text: "12 AWG copper", correct: false, explanation: "This is for 20-amp circuits." },
        { id: "c", text: "10 AWG copper", correct: false, explanation: "This is for 30-amp circuits." },
      ],
    },
    {
      id: "e2",
      scenario: "Replacing an old light switch in a metal box.",
      question: "What's the first safety step?",
      options: [
        { id: "a", text: "Turn off power at the breaker and verify with a tester", correct: true, explanation: "Always verify power is off before working." },
        { id: "b", text: "Turn off the light switch and start working", correct: false, explanation: "The breaker must be off for safety." },
        { id: "c", text: "Wear rubber gloves and work quickly", correct: false, explanation: "PPE doesn't replace proper lockout/tagout." },
      ],
    },
    {
      id: "e3",
      scenario: "A circuit breaker trips repeatedly when a hair dryer is used.",
      question: "What's the most likely cause?",
      options: [
        { id: "a", text: "Overloaded circuit or faulty breaker", correct: true, explanation: "Repeated tripping indicates overload or a defective breaker; hair dryers draw 12-15 amps." },
        { id: "b", text: "Loose neutral connection", correct: false, explanation: "Loose neutrals don't typically cause breakers to trip." },
        { id: "c", text: "Ground fault in the bathroom", correct: false, explanation: "Ground faults trip GFCIs, not standard breakers." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Installing a 240V dryer outlet in a laundry room.",
      question: "What's the minimum wire size?",
      options: [
        { id: "a", text: "10 AWG copper (30 amp) or 8 AWG aluminum (30 amp)", correct: true, explanation: "Dryers typically require 30-amp circuits with appropriate wire." },
        { id: "b", text: "12 AWG copper", correct: false, explanation: "This is only rated for 20 amps." },
        { id: "c", text: "14 AWG copper", correct: false, explanation: "This is only rated for 15 amps." },
      ],
    },
    {
      id: "m2",
      scenario: "Customer reports GFCI outlet won't reset.",
      question: "What's the troubleshooting order?",
      options: [
        { id: "a", text: "Check for ground fault, verify line/load connections, test with no load", correct: true, explanation: "Systematic troubleshooting isolates the problem." },
        { id: "b", text: "Replace it immediately with a new GFCI", correct: false, explanation: "This wastes time and money if the problem is elsewhere." },
        { id: "c", text: "Tell them to plug in something and see if it works", correct: false, explanation: "This doesn't address the reset failure." },
      ],
    },
    {
      id: "m3",
      scenario: "Running conduit from panel to new workshop.",
      question: "What's the best conduit choice?",
      options: [
        { id: "a", text: "PVC for underground, EMT for indoor sections", correct: true, explanation: "PVC resists moisture, EMT is easy to work with indoors." },
        { id: "b", text: "Flexible extension cord", correct: false, explanation: "This isn't code-compliant for permanent wiring." },
        { id: "c", text: "Romex cable exposed on walls", correct: false, explanation: "NM cable requires protection in exposed areas." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Adding a subpanel 150 feet from main panel.",
      question: "What voltage drop consideration applies?",
      options: [
        { id: "a", text: "Use 8 AWG for 50-amp to keep drop under 3%", correct: true, explanation: "Distance requires upsizing wire to maintain efficiency." },
        { id: "b", text: "Use 10 AWG for 50-amp, same as short runs", correct: false, explanation: "This would have excessive voltage drop over distance." },
        { id: "c", text: "Keep the subpanel at 30 amps to reduce wire cost", correct: false, explanation: "This may not meet load requirements." },
      ],
    },
    {
      id: "h2",
      scenario: "Troubleshooting three-way switch circuit that doesn't work.",
      question: "What's the most likely cause?",
      options: [
        { id: "a", text: "Miswired travelers on one of the switches", correct: true, explanation: "Three-way switches require correct traveler connections." },
        { id: "b", text: "Both switches are bad and need replacement", correct: false, explanation: "This is unlikely; miswiring is more common." },
        { id: "c", text: "The light bulb needs to be replaced", correct: false, explanation: "This doesn't explain the switching problem." },
      ],
    },
    {
      id: "h3",
      scenario: "Service entrance cable replacement on a residential building.",
      question: "What's the grounding electrode requirement?",
      options: [
        { id: "a", text: "Ground rod within 6 feet of panel and connected with proper gauge wire", correct: true, explanation: "This provides the required grounding path." },
        { id: "b", text: "Just connect to the metal water pipe", correct: false, explanation: "This alone isn't sufficient per current NEC." },
        { id: "c", text: "No grounding needed if using plastic conduit", correct: false, explanation: "Grounding is always required for safety." },
      ],
    },
    {
      id: "h4",
      scenario: "Installing a whole-house surge protector.",
      question: "Where should it be installed?",
      options: [
        { id: "a", text: "At the main panel on the circuit breaker side", correct: true, explanation: "This protects all circuits in the house." },
        { id: "b", text: "At the meter can for easy access", correct: false, explanation: "The meter is utility property, not accessible for customer work." },
        { id: "c", text: "At the first outlet in each room", correct: false, explanation: "This would require multiple units and miss protection." },
      ],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Adding an outlet to an existing circuit.",
    question: "How many outlets per 20-amp circuit?",
    options: [
      { id: "a", text: "Typically 10-13 outlets maximum", correct: true, explanation: "NEC recommends 1.5-2 amps per receptacle." },
      { id: "b", text: "As many as you want", correct: false, explanation: "This violates load calculation rules." },
      { id: "c", text: "Maximum 4 outlets per code", correct: false, explanation: "This is unnecessarily restrictive." },
    ],
  },
  {
    id: "qr2",
    scenario: "Installing a ceiling fan in place of a light fixture.",
    question: "What's required for the electrical box?",
    options: [
      { id: "a", text: "Fan-rated box securely attached to structure", correct: true, explanation: "Regular boxes can't handle fan vibration and weight." },
      { id: "b", text: "Any old electrical box will work", correct: false, explanation: "This could cause the fan to fall." },
      { id: "c", text: "Plastic box taped to the ceiling", correct: false, explanation: "This isn't secure at all." },
    ],
  },
{
     id: "qr3",
     scenario: "Customer wants to add outlets to a kitchen counter.",
     question: "What's the GFCI requirement?",
     options: [
       { id: "a", text: "All kitchen counter outlets must be GFCI protected", correct: true, explanation: "NEC requires GFCI for kitchen small appliance circuits." },
       { id: "b", text: "Only outlets near the sink need GFCI", correct: false, explanation: "All kitchen counter outlets need protection." },
       { id: "c", text: "GFCI is optional in kitchens", correct: false, explanation: "This is required by code for safety." },
     ],
   },
   {
     id: "qr4",
     scenario: "You need to run wiring through a damp basement.",
     question: "What type of cable should you use?",
     options: [
       { id: "a", text: "NM-B (Romex) cable", correct: false, explanation: "NM cable is not suitable for damp locations." },
       { id: "b", text: "UF-B (Underground Feeder) cable", correct: true, explanation: "UF-B cable is rated for damp and wet locations." },
       { id: "c", text: "THHN wire in PVC conduit", correct: false, explanation: "While THHN is moisture-resistant, UF-B is specifically rated for direct burial and damp locations." },
     ],
   },
   {
     id: "qr5",
     scenario: "A homeowner reports flickering lights in one room.",
     question: "What's the most likely cause?",
     options: [
       { id: "a", text: "Loose connection at the switch or fixture", correct: true, explanation: "Loose connections cause intermittent contact and flickering." },
       { id: "b", text: "The utility company has voltage fluctuations", correct: false, explanation: "If it were utility-related, it would affect the whole house." },
       { id: "c", text: "The light bulb is the wrong wattage", correct: false, explanation: "Wrong wattage typically causes overheating, not flickering." },
     ],
   },
   {
     id: "qr6",
     scenario: "Installing a 50-amp EV charging station in a garage.",
     question: "What wire gauge and circuit breaker are required?",
     options: [
       { id: "a", text: "6 AWG copper wire with a 50-amp breaker", correct: true, explanation: "6 AWG copper is rated for 50 amps per NEC Table 310.16." },
       { id: "b", text: "10 AWG copper wire with a 30-amp breaker", correct: false, explanation: "This would be undersized for a 50-amp circuit." },
       { id: "c", text: "12 AWG aluminum wire with a 50-amp breaker", correct: false, explanation: "12 AWG aluminum is only rated for 20 amps." },
     ],
   },
   {
     id: "qr7",
     scenario: "You smell something burning near an electrical panel.",
     question: "What's your first action?",
     options: [
       { id: "a", text: "Turn off the main breaker and call an electrician", correct: true, explanation: "A burning smell from a panel indicates a serious hazard; shut off power immediately." },
       { id: "b", text: "Open the panel to inspect the breakers", correct: false, explanation: "Opening an energized panel with a burning smell is extremely dangerous." },
       { id: "c", text: "Spray the panel with water to cool it down", correct: false, explanation: "Water on electrical equipment creates shock and short circuit risk." },
     ],
   },
   {
     id: "qr8",
     scenario: "A bathroom outlet isn't working but the breaker hasn't tripped.",
     question: "What's the most likely cause?",
     options: [
       { id: "a", text: "A GFCI outlet upstream has tripped", correct: true, explanation: "GFCI outlets in bathrooms often protect other outlets on the same circuit." },
       { id: "b", text: "The outlet is wired in series and one connection is broken", correct: false, explanation: "Outlets are typically wired in parallel, not series." },
       { id: "c", text: "The neutral wire has corroded through", correct: false, explanation: "While possible, a tripped GFCI is far more common." },
     ],
   },
   {
     id: "qr9",
     scenario: "Customer wants to install a 240V electric vehicle charger.",
     question: "What's the minimum circuit requirement?",
     options: [
       { id: "a", text: "Dedicated 240V 40-amp circuit with 8 AWG wire minimum", correct: true, explanation: "Most Level 2 EV chargers require a dedicated 240V 30-40 amp circuit." },
       { id: "b", text: "Shared 120V 15-amp circuit", correct: false, explanation: "EV chargers need a dedicated 240V circuit." },
       { id: "c", text: "Any 240V circuit will work regardless of amperage", correct: false, explanation: "The circuit must match the charger's amperage requirements." },
     ],
   },
   {
     id: "qr10",
     scenario: "You discover aluminum wiring in a 1970s home during a renovation.",
     question: "What's the proper course of action?",
     options: [
       { id: "a", text: "Inspect all connections and use approved AL/CU rated devices", correct: true, explanation: "Aluminum wiring requires special connectors and CO/ALR-rated devices for safety." },
       { id: "b", text: "Replace all aluminum wire with copper immediately", correct: false, explanation: "Complete replacement is costly; proper connectors are an accepted alternative." },
       { id: "c", text: "Leave it alone, aluminum wiring is perfectly safe", correct: false, explanation: "Aluminum wiring needs special handling to prevent fire hazards." },
     ],
   },
   {
     id: "qr11",
     scenario: "A light fixture has no ground wire but the box is metal.",
     question: "What should you do?",
     options: [
       { id: "a", text: "Connect the ground pigtail to the metal box if it's grounded", correct: true, explanation: "A metal box can serve as an equipment grounding conductor if properly grounded." },
       { id: "b", text: "Leave the fixture without a ground connection", correct: false, explanation: "Improper grounding creates shock hazard." },
       { id: "c", text: "Just connect the ground wire to the neutral", correct: false, explanation: "Bonding ground to neutral at the fixture is dangerous and violates code." },
     ],
   },
   {
     id: "qr12",
     scenario: "Circuit breaker keeps tripping when a space heater is plugged in.",
     question: "What's the likely problem?",
     options: [
       { id: "a", text: "The circuit is overloaded - the heater exceeds the circuit's capacity", correct: true, explanation: "Space heaters draw 1500+ watts, often exceeding a 15-amp circuit's capacity." },
       { id: "b", text: "The breaker is defective and needs replacement", correct: false, explanation: "While possible, overloading is the far more common cause." },
       { id: "c", text: "The heater needs a 240V outlet instead of 120V", correct: false, explanation: "Most space heaters operate on standard 120V outlets." },
     ],
   },
   {
     id: "qr13",
     scenario: "Installing outdoor lighting around a pool.",
     question: "What special code requirements apply?",
     options: [
       { id: "a", text: "All fixtures must be low-voltage (12V) and GFCI protected", correct: true, explanation: "NEC requires GFCI protection and low-voltage lighting near swimming pools." },
       { id: "b", text: "Standard 120V fixtures are fine if weatherproof", correct: false, explanation: "120V fixtures near pools must be GFCI protected per NEC 680." },
       { id: "c", text: "No special requirements for outdoor lighting", correct: false, explanation: "Pool areas have strict electrical code requirements." },
     ],
   },
   {
     id: "qr14",
     scenario: "You need to determine if a wall is load-bearing before cutting an opening.",
     question: "What's the best approach?",
     options: [
       { id: "a", text: "Check the basement/crawlspace for support beams and consult a structural engineer", correct: true, explanation: "Visual inspection from below and professional assessment are safest." },
       { id: "b", text: "Just cut a small hole to look inside", correct: false, explanation: "This can compromise structural integrity without proper knowledge." },
       { id: "c", text: "Assume all interior walls are load-bearing", correct: false, explanation: "Not all interior walls are load-bearing; each must be assessed individually." },
     ],
   },
   {
     id: "qr15",
     scenario: "A junction box is overcrowded with wires.",
     question: "What code violation does this present?",
     options: [
       { id: "a", text: "It violates the NEC box fill capacity requirements", correct: true, explanation: "NEC Article 314.16 specifies maximum wire fill for each box size." },
       { id: "b", text: "It's fine as long as the cover plate fits", correct: false, explanation: "Cover plate fit doesn't indicate safe box fill." },
       { id: "c", text: "It only violates code if the wires are different gauges", correct: false, explanation: "Box fill limits apply regardless of wire gauge combinations." },
     ],
   },
   {
     id: "qr16",
     scenario: "Customer's new microwave keeps tripping the breaker.",
     question: "What's the recommended solution?",
     options: [
       { id: "a", text: "Install a dedicated 20-amp circuit for the microwave", correct: true, explanation: "Microwaves typically require a dedicated circuit per NEC." },
       { id: "b", text: "Use a higher amp breaker", correct: false, explanation: "Upgrading the breaker without proper wiring creates a fire hazard." },
       { id: "c", text: "Plug it into a different outlet on the same circuit", correct: false, explanation: "Sharing the circuit with other appliances won't solve the overloading issue." },
     ],
   },
   {
     id: "qr17",
     scenario: "You're troubleshooting a 3-way switch that doesn't control the light from both locations.",
     question: "What's most likely wrong?",
     options: [
       { id: "a", text: "The traveler wires are connected to the wrong terminals", correct: true, explanation: "3-way switches require travelers on the common terminals; wrong wiring breaks the circuit path." },
       { id: "b", text: "The light fixture is burned out", correct: false, explanation: "A burned fixture wouldn't affect switch operation from both locations." },
       { id: "c", text: "Both switches need to be replaced", correct: false, explanation: "Replacement isn't necessary if wiring connections are correct." },
     ],
   },
   {
     id: "qr18",
     scenario: "An old building has knob-and-tube wiring.",
     question: "What are the safety concerns?",
     options: [
       { id: "a", text: "No ground wire, insulation degrades over time, and it can overheat", correct: true, explanation: "Knob-and-tube lacks grounding and modern insulation, posing fire and shock risks." },
       { id: "b", text: "It's perfectly safe if the fuses are working", correct: false, explanation: "Fuses don't address the lack of grounding and insulation degradation." },
       { id: "c", text: "The only concern is it looks old", correct: false, explanation: "There are serious electrical safety concerns beyond aesthetics." },
     ],
   },
   {
     id: "qr19",
     scenario: "You need to backfeed a portable generator during a power outage.",
     question: "What's the critical safety requirement?",
     options: [
       { id: "a", text: "Use a transfer switch to prevent backfeeding the utility grid", correct: true, explanation: "Backfeeding the grid can electrocute utility workers and damage equipment." },
       { id: "b", text: "Just plug it into a wall outlet with a heavy-duty cord", correct: false, explanation: "Directly plugging into an outlet backfeeds the grid and is extremely dangerous." },
       { id: "c", text: "Run all your appliances directly from the generator", correct: false, explanation: "Appliances must be connected through proper transfer equipment." },
     ],
   },
   {
     id: "qr20",
     scenario: "A commercial building needs new electrical service.",
     question: "What determines the service amperage needed?",
     options: [
       { id: "a", text: "Total calculated electrical load per NEC Article 220", correct: true, explanation: "NEC Article 220 provides the calculation method for required service amperage." },
       { id: "b", text: "The size of the building in square feet", correct: false, explanation: "Square footage is one factor but not the primary determinant." },
       { id: "c", text: "Whatever the utility company provides by default", correct: false, explanation: "Service size must be calculated based on the building's actual load." },
     ],
   },
   {
     id: "qr21",
     scenario: "You notice warm outlet covers in a bedroom.",
     question: "What does this indicate?",
     options: [
       { id: "a", text: "Possible overloaded circuit or loose connection that needs immediate attention", correct: true, explanation: "Warm outlets indicate excessive current flow or poor connections, both fire hazards." },
       { id: "b", text: "Normal operation if a space heater is plugged in", correct: false, explanation: "Even with a heater, the outlet shouldn't be noticeably warm to touch." },
       { id: "c", text: "The outlet paint is reacting to humidity", correct: false, explanation: "Warmth is a sign of electrical issues, not environmental factors." },
     ],
   },
   {
     id: "qr22",
     scenario: "Installing a new subpanel in a detached garage.",
     question: "What grounding method is required?",
     options: [
       { id: "a", text: "A grounding electrode system per NEC 250.50, such as ground rods", correct: true, explanation: "Detached buildings need their own grounding electrode system." },
       { id: "b", text: "Bond to the water pipe only", correct: false, explanation: "Water pipe alone is insufficient for a detached building." },
       { id: "c", text: "No grounding needed since it's a subpanel", correct: false, explanation: "All subpanels require proper grounding." },
     ],
   },
   {
     id: "qr23",
     scenario: "A GFCI outlet in the garage won't reset.",
     question: "What's the likely cause?",
     options: [
       { id: "a", text: "A ground fault in a device plugged into the circuit or wiring damage", correct: true, explanation: "GFCI trips when it detects current leakage to ground." },
       { id: "b", text: "The GFCI outlet is just old and worn out", correct: false, explanation: "While age can be a factor, a ground fault is the usual culprit." },
       { id: "c", text: "The breaker feeding it is too small", correct: false, explanation: "Breaker size doesn't affect GFCI functionality." },
     ],
   },
   {
     id: "qr24",
     scenario: "You're pulling wire through a long conduit run.",
     question: "What's the maximum number of conductors allowed in a 1-inch EMT conduit?",
     options: [
       { id: "a", text: "Up to 35 conductors depending on wire gauge per NEC Chapter 9", correct: true, explanation: "NEC Chapter 9, Table 1 specifies fill limits based on conduit size and wire gauge." },
       { id: "b", text: "No more than 3 conductors", correct: false, explanation: "3-conductor limit applies to much smaller conduit." },
       { id: "c", text: "As many as will physically fit", correct: false, explanation: "NEC has strict fill requirements to prevent overheating." },
     ],
   },
   {
     id: "qr25",
     scenario: "A solar panel system needs to be connected to the grid.",
     question: "What's required for a grid-tied solar installation?",
     options: [
       { id: "a", text: "A bidirectional meter, inverter, and proper disconnect per NEC 705", correct: true, explanation: "Grid-tied systems require specific equipment and code compliance per NEC 705." },
       { id: "b", text: "Just plug the panels into a regular outlet", correct: false, explanation: "Direct connection without an inverter is dangerous and violates code." },
       { id: "c", text: "Only battery storage is needed", correct: false, explanation: "Grid-tied systems can work without batteries but require proper inverter and metering." },
     ],
   },
   {
     id: "qr26",
     scenario: "You find cloth-wrapped wiring in an old home.",
     question: "What should you do?",
     options: [
       { id: "a", text: "Have the wiring evaluated and likely replaced by a licensed electrician", correct: true, explanation: "Cloth-wrapped wiring is a fire hazard and typically needs replacement." },
       { id: "b", text: "Tape over any frayed areas with electrical tape", correct: false, explanation: "Electrical tape is a temporary fix and doesn't address the underlying hazard." },
       { id: "c", text: "It's safe as long as there are no exposed copper wires", correct: false, explanation: "Cloth insulation degrades and becomes a fire hazard regardless of visible copper." },
     ],
   },
   {
     id: "qr27",
     scenario: "An arc fault breaker keeps tripping in a bedroom.",
     question: "What's the most common cause?",
     options: [
       { id: "a", text: "Damaged or deteriorating wire insulation causing arcing", correct: true, explanation: "AFCIs detect dangerous arcing from damaged wiring, which is the most common cause of trips." },
       { id: "b", text: "Too many devices plugged in", correct: false, explanation: "Overloading trips standard breakers, not AFCIs specifically." },
       { id: "c", text: "The AFCI breaker is defective", correct: false, explanation: "While possible, nuisance tripping from actual arcing is far more common." },
     ],
   },
   {
     id: "qr28",
     scenario: "You need to install a dedicated circuit for a home workshop.",
     question: "What's the minimum requirement for heavy power tools?",
     options: [
       { id: "a", text: "A 20-amp 120V circuit with 12 AWG wire", correct: true, explanation: "Heavy power tools typically require a dedicated 20-amp circuit per NEC." },
       { id: "b", text: "A 15-amp circuit is always sufficient", correct: false, explanation: "Many power tools exceed 15 amps and require 20-amp circuits." },
       { id: "c", text: "Just use an extension cord from another room", correct: false, explanation: "Extension cords are not a substitute for dedicated circuits for heavy tools." },
     ],
   },
   {
     id: "qr29",
     scenario: "A customer reports that their lights dim when the air conditioner turns on.",
     question: "What's the likely issue?",
     options: [
       { id: "a", text: "Loose neutral connection at the panel or service entrance", correct: true, explanation: "A loose neutral causes voltage drop and dimming when large loads start." },
       { id: "b", text: "The air conditioner is drawing too much power for the circuit", correct: false, explanation: "AC units on their own circuit shouldn't cause dimming elsewhere." },
       { id: "c", text: "The light bulbs need to be replaced with higher wattage ones", correct: false, explanation: "Bulb wattage doesn't fix a voltage drop issue caused by loose connections." },
     ],
   },
   {
     id: "qr30",
     scenario: "You're installing a new 200-amp main service panel.",
     question: "What is the minimum wire size for the service entrance conductors?",
     options: [
       { id: "a", text: "2/0 AWG copper or 4/0 AWG aluminum per NEC Table 310.16", correct: true, explanation: "NEC Table 310.16 specifies conductor sizing for 200-amp service." },
       { id: "b", text: "6 AWG copper will work for any panel", correct: false, explanation: "6 AWG is far too small for a 200-amp service." },
       { id: "c", text: "Any wire rated for 100 amps will work since the panel is new", correct: false, explanation: "Wire must be rated for the full service amperage, not the panel rating alone." },
     ],
   },
 ];

export default function ElectricianWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: ElectricianWorldProps) {
  const [stage, setStage] = useState<"intro" | "tutorial" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showHeartLost, setShowHeartLost] = useState(false);
  const [heartLostMessage, setHeartLostMessage] = useState("");
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (!isQuickRecall || stage !== "challenge" || hearts <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleLoseHeart("Time's up!");
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isQuickRecall, stage, currentQuestionIndex, hearts]);

   const handleLoseHeart = (message: string) => {
     const newHearts = hearts - 1;
     setHearts(newHearts);
     setShowHeartLost(true);
     setHeartLostMessage(message);
     
     // Track incorrect answer when losing heart
     const selected = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
     const correctOption = currentQuestion.options.find((opt) => opt.correct);
     let updatedIncorrect = [...incorrectAnswers];
     if (selected && correctOption) {
       updatedIncorrect = [...updatedIncorrect, {
         question: currentQuestion.question,
         selectedAnswer: selected.text,
         correctAnswer: correctOption.text,
         explanation: correctOption.explanation,
       }];
       setIncorrectAnswers(updatedIncorrect);
     }
     
     setTimeout(() => {
       setShowHeartLost(false);
       if (newHearts <= 0) {
         onComplete(false, score, totalQuestions, updatedIncorrect);
       } else if (currentQuestionIndex < totalQuestions - 1) {
         setCurrentQuestionIndex(currentQuestionIndex + 1);
         setSelectedAnswer(null);
         setTimeLeft(15);
         setQuestionStartTime(Date.now());
       } else {
         onComplete(true, score + 1, totalQuestions, updatedIncorrect);
       }
     }, 1500);
   };

  const currentQuestions = isQuickRecall 
    ? (quickRecallQuestions.length > 0 ? quickRecallQuestions : questions.easy)
    : questions[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  useEffect(() => {
    if (alwaysCorrect && currentQuestion) {
      const correctOpt = currentQuestion.options.find(opt => opt.correct);
      if (correctOpt) setSelectedAnswer(correctOpt.id);
    }
  }, [alwaysCorrect, currentQuestionIndex]);

  const shuffledOptions = useMemo(() => {
    return shuffleArray(currentQuestion.options);
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    const selected = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
    if (!selected) return;

    const isCorrect = selected.correct;
    const timeMs = Date.now() - questionStartTime;
    
    if (onAnswerResult) {
      onAnswerResult(isCorrect, timeMs);
    }
    
    if (isQuickRecall) {
      if (isCorrect) {
        const newScore = score + 1;
        setScore(newScore);
        setAnsweredQuestions([...answeredQuestions, true]);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
        
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setTimeLeft(15);
          setQuestionStartTime(Date.now());
        } else {
          onComplete(true, newScore, totalQuestions);
        }
      } else {
        handleLoseHeart("Wrong answer!");
        setStreak(0);
      }
      return;
    }

     const newScore = isCorrect ? score + 1 : score;
     setScore(newScore);
     setAnsweredQuestions([...answeredQuestions, isCorrect]);
     if (isCorrect) {
       const newStreak = streak + 1;
       setStreak(newStreak);
       if (newStreak > bestStreak) setBestStreak(newStreak);
     } else {
       setStreak(0);
     }

     // Track incorrect answers
     let updatedIncorrect = [...incorrectAnswers];
     if (!isCorrect) {
       const correctOption = currentQuestion.options.find((opt) => opt.correct);
       if (correctOption) {
         updatedIncorrect = [...updatedIncorrect, {
           question: currentQuestion.question,
           selectedAnswer: selected.text,
           correctAnswer: correctOption.text,
           explanation: correctOption.explanation,
         }];
         setIncorrectAnswers(updatedIncorrect);
       }
     }

     if (currentQuestionIndex < totalQuestions - 1) {
       setCurrentQuestionIndex(currentQuestionIndex + 1);
       setSelectedAnswer(null);
       setQuestionStartTime(Date.now());
     } else {
       const passRatio = isCertification ? 0.8 : 0.6;
       const passThreshold = Math.ceil(totalQuestions * passRatio)
       onComplete(newScore >= passThreshold, newScore, totalQuestions, updatedIncorrect);
     }
  };

  // Handle Enter key to submit answer
   useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key === 'Enter' && selectedAnswer && stage === "challenge") {
         e.preventDefault();
         handleSubmit();
       }
     };

     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
   }, [selectedAnswer, stage, handleSubmit]);

   if (stage === "intro") {
    return (
      <TutorialScreen
        careerName="Electrician"
        careerIcon="⚡"
        steps={[
          {
            title: "Study the Scenario",
            content: "Each question presents an electrical situation. Read carefully to understand the requirements.",
            icon: "📖",
          },
          {
            title: "Apply Electrical Code",
            content: "Think about NEC codes, safety requirements, and best practices for the situation.",
            icon: "⚡",
          },
          {
            title: "Choose the Correct Answer",
            content: "Select the option that follows electrical code and ensures safety.",
            icon: "👆",
          },
          {
            title: isCertification ? "Pass the Certification" : "Pass the Challenge",
            content: `You need ${Math.ceil(questions[difficulty].length * (isCertification ? 0.8 : 0.6))} out of ${questions[difficulty].length} correct to pass. Good luck!`,
            icon: isCertification ? "📜" : "🏆",
          },
        ]}
        onStart={() => setStage("challenge")}
        onBack={() => {
          if (onTutorialBack) {
            audioSystem.playClickSound();
            onTutorialBack();
          } else if (onExit) {
            audioSystem.playClickSound();
            onExit();
          }
        }}
      />
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {showHeartLost && (
          <div className="fixed inset-0 bg-red-500/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center animate-pulse">
              <div className="text-6xl mb-4">💔</div>
              <p className="text-2xl font-bold text-red-600">{heartLostMessage}</p>
              <p className="text-lg text-gray-600 mt-2">Hearts remaining: {hearts}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              ⚡ Scenario {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">❤️</span>
                  <span className={`text-2xl font-bold ${hearts === 1 ? 'text-red-600' : hearts === 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {hearts}
                  </span>
                </div>
              )}
              {isQuickRecall && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-100 animate-pulse' : 'bg-yellow-100'}`}>
                  <span className="text-lg">⏱️</span>
                  <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {timeLeft}s
                  </span>
                </div>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-yellow-600">{score}/{currentQuestionIndex}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">🔥 Streak</div>
                <div className={`text-2xl font-bold ${streak >= 3 ? 'text-orange-500' : streak >= 2 ? 'text-yellow-500' : 'text-gray-600'}`}>
                  {streak}
                </div>
                {bestStreak > 0 && (
                  <div className="text-xs text-gray-500">Best: {bestStreak}</div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-2">
              {currentQuestions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded-full ${
                    idx < currentQuestionIndex
                      ? answeredQuestions[idx]
                        ? "bg-green-500"
                        : "bg-red-500"
                      : idx === currentQuestionIndex
                      ? "bg-yellow-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="font-semibold text-yellow-900 mb-2">Electrical Scenario:</p>
            <p className="text-yellow-800">{currentQuestion.scenario}</p>
          </div>

          <p className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </p>

          <div className="space-y-3 mb-6">
            {shuffledOptions.map((option) => (
              <label
                key={option.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAnswer === option.id
                    ? "border-yellow-600 bg-yellow-50"
                    : "border-gray-300 hover:border-yellow-400"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(e) => {
                          audioSystem.playClickSound();
                          setSelectedAnswer(e.target.value);
                        }}
                  className="mr-3"
                />
                <span className="text-gray-800">{option.text}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestionIndex < totalQuestions - 1 ? "Next Scenario →" : "Submit Final Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}