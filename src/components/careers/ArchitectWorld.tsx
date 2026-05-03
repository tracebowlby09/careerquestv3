"use client";

import { useState, useMemo, useEffect } from "react";
import { Difficulty } from "@/types/game";
import { audioSystem } from "@/lib/audio";
import TutorialScreen from "@/components/TutorialScreen";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface ArchitectWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
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
      scenario: "A client wants maximum natural light in their home.",
      question: "What's the best design approach?",
      options: [
        { id: "a", text: "Large south-facing windows with overhangs", correct: true, explanation: "South-facing windows get consistent light; overhangs prevent overheating." },
        { id: "b", text: "Windows on all sides equally", correct: false, explanation: "This doesn't optimize for sun path and can cause heat issues." },
        { id: "c", text: "Skylights only", correct: false, explanation: "Skylights alone don't provide views and can cause heat gain." },
      ],
    },
    {
      id: "e2",
      scenario: "You're designing a wheelchair-accessible entrance.",
      question: "What's the maximum ramp slope allowed by ADA?",
      options: [
        { id: "a", text: "1:12 (1 inch rise per 12 inches run)", correct: true, explanation: "ADA requires 1:12 maximum slope for accessibility." },
        { id: "b", text: "1:6 (steeper is fine)", correct: false, explanation: "This is too steep for wheelchair users." },
        { id: "c", text: "1:20 (flatter is required)", correct: false, explanation: "While flatter is better, 1:12 is the standard maximum." },
      ],
    },
    {
      id: "e3",
      scenario: "A residential client wants to reduce energy costs.",
      question: "What's the most effective passive design strategy?",
      options: [
        { id: "a", text: "Proper insulation and air sealing", correct: true, explanation: "Insulation and air sealing provide the biggest energy savings with the lowest cost." },
        { id: "b", text: "Expensive solar panels", correct: false, explanation: "While helpful, this is more costly and less effective than proper insulation first." },
        { id: "c", text: "Large windows everywhere", correct: false, explanation: "Unshaded windows can increase heating and cooling loads." },
      ],
    },
    {
      id: "e4",
      scenario: "You're designing stairs for a commercial building.",
      question: "What's the maximum riser height allowed by code?",
      options: [
        { id: "a", text: "7 inches", correct: true, explanation: "IBC and ADA require maximum 7-inch risers for safety." },
        { id: "b", text: "8 inches", correct: false, explanation: "This exceeds code requirements and creates a trip hazard." },
        { id: "c", text: "10 inches", correct: false, explanation: "This is dangerously high and violates building codes." },
      ],
    },
    {
      id: "e5",
      scenario: "A client asks about minimum ceiling heights for residential spaces.",
      question: "What's the minimum required by code?",
      options: [
        { id: "a", text: "7 feet (with exceptions)", correct: true, explanation: "IRC requires 7-foot minimums for habitable spaces." },
        { id: "b", text: "8 feet", correct: false, explanation: "While recommended, 7 feet is the code minimum." },
        { id: "c", text: "6 feet 8 inches", correct: false, explanation: "This is below code requirements for habitable spaces." },
      ],
    },
    {
      id: "e6",
      scenario: "You need to select a roofing material for a snowy climate.",
      question: "What's the most important consideration?",
      options: [
        { id: "a", text: "Roof pitch and snow load capacity", correct: true, explanation: "Steep pitches shed snow better, and structures must support snow loads." },
        { id: "b", text: "Color to match the house", correct: false, explanation: "Aesthetics are secondary to structural and functional requirements." },
        { id: "c", text: "Cheapest available option", correct: false, explanation: "Cost shouldn't override performance requirements in harsh climates." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "A client wants an open floor plan but the building needs structural support.",
      question: "What's the best solution?",
      options: [
        { id: "a", text: "Use steel beams or columns strategically placed", correct: true, explanation: "Steel allows for longer spans and maintains open space." },
        { id: "b", text: "Remove all walls and hope for the best", correct: false, explanation: "This is structurally unsafe and violates building codes." },
        { id: "c", text: "Keep all load-bearing walls", correct: false, explanation: "This doesn't achieve the open floor plan goal." },
      ],
    },
    {
      id: "m2",
      scenario: "You're designing for a hot, humid climate.",
      question: "What passive cooling strategies should you prioritize?",
      options: [
        { id: "a", text: "Cross-ventilation, shading, and thermal mass", correct: true, explanation: "These strategies reduce cooling needs naturally." },
        { id: "b", text: "Large windows for views", correct: false, explanation: "Unshaded windows increase heat gain in hot climates." },
        { id: "c", text: "Dark exterior colors", correct: false, explanation: "Dark colors absorb heat, worsening the problem." },
      ],
    },
    {
      id: "m3",
      scenario: "Your design exceeds the client's budget by 20%.",
      question: "What's the professional approach?",
      options: [
        { id: "a", text: "Present value engineering options while maintaining design intent", correct: true, explanation: "Offer alternatives that reduce cost without compromising key goals." },
        { id: "b", text: "Tell them to increase their budget", correct: false, explanation: "This doesn't address the problem or show flexibility." },
        { id: "c", text: "Cheap out on materials everywhere", correct: false, explanation: "This compromises quality and may not achieve needed savings." },
      ],
    },
    {
      id: "m4",
      scenario: "You're designing a multi-family residential building.",
      question: "What fire safety requirement is critical between units?",
      options: [
        { id: "a", text: "Fire-rated separation walls and floors (1-2 hour rating)", correct: true, explanation: "Building codes require fire separation to prevent fire spread between units." },
        { id: "b", text: "Sound insulation only", correct: false, explanation: "While important for comfort, fire safety takes precedence." },
        { id: "c", text: "Shared utility chases without separation", correct: false, explanation: "This creates dangerous fire and smoke spread pathways." },
      ],
    },
    {
      id: "m5",
      scenario: "A client wants to demolish a load-bearing wall to combine rooms.",
      question: "What must you do before proceeding?",
      options: [
        { id: "a", text: "Design and install proper structural support (beam/column)", correct: true, explanation: "Load-bearing walls require engineered replacement support." },
        { id: "b", text: "Just remove it and add supports later", correct: false, explanation: "This can cause catastrophic structural failure." },
        { id: "c", text: "Assume it's not load-bearing", correct: false, explanation: "Assumptions about structural elements are dangerous and unprofessional." },
      ],
    },
    {
      id: "m6",
      scenario: "You're designing egress for a basement bedroom.",
      question: "What code-compliant egress option is required?",
      options: [
        { id: "a", text: "Egress window meeting size requirements (5.7 sq ft min)", correct: true, explanation: "Basement bedrooms require proper egress for emergency escape." },
        { id: "b", text: "Regular window", correct: false, explanation: "Regular windows may not meet egress size requirements." },
        { id: "c", text: "Door to exterior", correct: false, explanation: "Basement bedrooms typically don't have doors to grade." },
      ],
    },
    {
      id: "m7",
      scenario: "Designing a commercial kitchen for a restaurant.",
      question: "What's the most critical ventilation requirement?",
      options: [
        { id: "a", text: "Proper grease duct and hood system with fire suppression", correct: true, explanation: "Commercial kitchens require code-compliant exhaust to prevent fires." },
        { id: "b", text: "Ceiling fans for air circulation", correct: false, explanation: "Ceiling fans don't remove heat, smoke, or grease effectively." },
        { id: "c", text: "Open windows for natural ventilation", correct: false, explanation: "Natural ventilation doesn't meet commercial kitchen code requirements." },
      ],
    },
    {
      id: "m8",
      scenario: "You discover asbestos in an old building during renovation.",
      question: "What's the required course of action?",
      options: [
        { id: "a", text: "Stop work and hire licensed asbestos abatement professionals", correct: true, explanation: "Asbestos handling requires specialized training and licensing for safety." },
        { id: "b", text: "Remove it yourself with a mask", correct: false, explanation: "Disturbing asbestos without proper procedures creates serious health hazards." },
        { id: "c", text: "Ignore it and continue work", correct: false, explanation: "This violates regulations and endangers workers and occupants." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "You're designing a building in a seismic zone.",
      question: "What structural system is most earthquake-resistant?",
      options: [
        { id: "a", text: "Base isolation with flexible connections", correct: true, explanation: "Base isolation allows the building to move independently of ground motion." },
        { id: "b", text: "Rigid concrete structure", correct: false, explanation: "Rigid structures can crack and fail during earthquakes." },
        { id: "c", text: "Standard wood frame", correct: false, explanation: "While wood is flexible, it's not optimal for large buildings in high seismic zones." },
      ],
    },
    {
      id: "h2",
      scenario: "A historic building needs renovation while preserving its character.",
      question: "What's the best approach to modernization?",
      options: [
        { id: "a", text: "Preserve exterior and historic elements, modernize interior systems", correct: true, explanation: "This balances preservation with functionality and code compliance." },
        { id: "b", text: "Gut everything and rebuild to look old", correct: false, explanation: "This destroys historic fabric and authenticity." },
        { id: "c", text: "Leave everything original, no updates", correct: false, explanation: "This may not meet modern codes or client needs." },
      ],
    },
    {
      id: "h3",
      scenario: "You discover a design error after construction has started.",
      question: "What's your professional and legal obligation?",
      options: [
        { id: "a", text: "Immediately notify all parties, propose solutions, document everything", correct: true, explanation: "Transparency and quick action minimize damage and liability." },
        { id: "b", text: "Try to hide it and hope no one notices", correct: false, explanation: "This is unethical, illegal, and will make things worse." },
        { id: "c", text: "Blame the contractor", correct: false, explanation: "Design errors are the architect's responsibility." },
      ],
    },
    {
      id: "h4",
      scenario: "A client wants a design that violates building codes.",
      question: "How do you handle this?",
      options: [
        { id: "a", text: "Explain code requirements and offer compliant alternatives", correct: true, explanation: "Architects must ensure code compliance while meeting client goals." },
        { id: "b", text: "Do what they want, it's their building", correct: false, explanation: "Architects can lose their license for code violations." },
        { id: "c", text: "Refuse to work with them", correct: false, explanation: "Education and alternatives are better than walking away immediately." },
      ],
    },
    {
      id: "h5",
      scenario: "Designing a high-rise in hurricane-prone coastal area.",
      question: "What structural considerations are paramount?",
      options: [
        { id: "a", text: "Wind load resistance and impact-resistant glazing", correct: true, explanation: "High-rises need special engineering for extreme wind and debris loads." },
        { id: "b", text: "Standard construction methods", correct: false, explanation: "Coastal high-rises require enhanced structural systems." },
        { id: "c", text: "Aesthetic appeal over structural integrity", correct: false, explanation: "Structural safety must never be compromised for aesthetics." },
      ],
    },
    {
      id: "h6",
      scenario: "You're designing a LEED Platinum certified building.",
      question: "What's essential for achieving this certification?",
      options: [
        { id: "a", text: "Comprehensive sustainable strategy across all categories (energy, water, materials, site)", correct: true, explanation: "LEED Platinum requires excellence in all sustainability categories." },
        { id: "b", text: "Solar panels only", correct: false, explanation: "Single features aren't sufficient for Platinum certification." },
        { id: "c", text: "Expensive materials regardless of sourcing", correct: false, explanation: "Cost doesn't determine sustainability performance." },
      ],
    },
    {
      id: "h7",
      scenario: "A project has significant foundation settlement issues.",
      question: "What's the architect's role in resolution?",
      options: [
        { id: "a", text: "Coordinate with geotechnical and structural engineers for remediation plan", correct: true, explanation: "Foundation issues require specialized engineering expertise." },
        { id: "b", text: "Design cosmetic repairs to hide the problem", correct: false, explanation: "Hiding foundation issues is unethical and dangerous." },
        { id: "c", text: "Blame the contractor entirely", correct: false, explanation: "Foundation issues may involve design, soil, or construction factors." },
      ],
    },
    {
      id: "h8",
      scenario: "Designing a hospital isolation room for infectious diseases.",
      question: "What's critical for infection control?",
      options: [
        { id: "a", text: "Negative air pressure with HEPA filtration and sealed room", correct: true, explanation: "Negative pressure prevents contaminated air from spreading." },
        { id: "b", text: "Positive air pressure to keep area clean", correct: false, explanation: "Positive pressure would push contaminants out." },
        { id: "c", text: "Standard HVAC is sufficient", correct: false, explanation: "Standard systems don't ensure containment of infectious agents." },
      ],
    },
    {
      id: "h9",
      scenario: "You're testifying as an expert witness in a construction defect case.",
      question: "What's your professional obligation?",
      options: [
        { id: "a", text: "Provide objective, honest testimony based on facts and standards", correct: true, explanation: "Expert witnesses must be impartial and truthful." },
        { id: "b", text: "Testify in favor of the party that hired you", correct: false, explanation: "This violates professional ethics and expert witness standards." },
        { id: "c", text: "Decline to answer difficult questions", correct: false, explanation: "Witnesses must provide complete and honest testimony." },
      ],
    },
    {
      id: "h10",
      scenario: "Designing an accessible public building with limited space.",
      question: "What accessibility requirement cannot be compromised?",
      options: [
        { id: "a", text: "Accessible route with maximum 1:12 slope and turning radius", correct: true, explanation: "ADA requirements are mandatory and non-negotiable for public buildings." },
        { id: "b", text: "Aesthetic considerations over accessibility", correct: false, explanation: "Accessibility is legally required and takes precedence." },
        { id: "c", text: "Cost savings over accessibility features", correct: false, explanation: "Accessibility cannot be sacrificed for budget reasons in public buildings." },
      ],
    },
  ],
};

// Quick Recall mode - 30 architectural design challenges
const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "You're designing a home in an earthquake-prone area.",
    question: "What structural feature is most important?",
    options: [
      { id: "a", text: "Seismic-resistant foundations and shear walls", correct: true, explanation: "These features absorb and distribute earthquake forces." },
      { id: "b", text: "Heavy concrete walls throughout", correct: false, explanation: "Heavy walls can amplify seismic forces." },
      { id: "c", text: "Large open spaces without walls", correct: false, explanation: "Open spaces need proper structural design to resist forces." },
    ],
  },
  {
    id: "qr2",
    scenario: "A client wants to maximize natural light in their office.",
    question: "What's the best approach?",
    options: [
      { id: "a", text: "Floor-to-ceiling windows with light-colored interiors", correct: true, explanation: "Maximizes daylight penetration and reflection." },
      { id: "b", text: "Small windows to reduce glare", correct: false, explanation: "This reduces natural light, not enhances it." },
      { id: "c", text: "Interior offices with artificial lighting", correct: false, explanation: "This doesn't utilize natural light at all." },
    ],
  },
  {
    id: "qr3",
    scenario: "You're designing a building in a hot, desert climate.",
    question: "What should be your primary focus?",
    options: [
      { id: "a", text: "Thermal mass and shading elements", correct: true, explanation: "These reduce heat gain and regulate temperature." },
      { id: "b", text: "Maximize glass for views", correct: false, explanation: "Glass increases heat gain in hot climates." },
      { id: "c", text: "Minimize windows to reduce heat", correct: false, explanation: "Windows are needed - proper shading is the solution." },
    ],
  },
  {
    id: "qr4",
    scenario: "A client needs a building that's fully accessible for elderly visitors.",
    question: "What's the most critical feature?",
    options: [
      { id: "a", text: "No-step entrances and handrails on all stairs", correct: true, explanation: "These are essential for elderly mobility and safety." },
      { id: "b", text: "Wide hallways", correct: false, explanation: "Important but not the most critical feature." },
      { id: "c", text: "Elevator to all floors", correct: false, explanation: "Important but ground-floor access is more critical." },
    ],
  },
  {
    id: "qr5",
    scenario: "You're designing a sustainable office building.",
    question: "Which feature has the biggest impact?",
    options: [
      { id: "a", text: "Building orientation and window placement", correct: true, explanation: "Passive design has the greatest energy impact." },
      { id: "b", text: "Recycled carpeting", correct: false, explanation: "Important but minimal energy impact." },
      { id: "c", text: "Solar panels on the roof", correct: false, explanation: "Helpful but passive design matters more." },
    ],
  },
  {
    id: "qr6",
    scenario: "A client wants to create a quiet home office.",
    question: "What's most important for sound isolation?",
    options: [
      { id: "a", text: "Double-layer drywall and acoustic insulation", correct: true, explanation: "These materials block sound transmission." },
      { id: "b", text: "Thick curtains", correct: false, explanation: "Softens sound but doesn't block it." },
      { id: "c", text: "White noise machine", correct: false, explanation: "Masks sound but doesn't provide isolation." },
    ],
  },
  {
    id: "qr7",
    scenario: "You're designing a building on a steep hillside.",
    question: "What foundation type is best?",
    options: [
      { id: "a", text: "Cantilevered foundation or piles", correct: true, explanation: "These handle uneven terrain and slopes." },
      { id: "b", text: "Simple slab on grade", correct: false, explanation: "Not suitable for steep slopes." },
      { id: "c", text: "Basement foundation", correct: false, explanation: "Could work but requires special engineering." },
    ],
  },
  {
    id: "qr8",
    scenario: "A client wants to minimize their building's carbon footprint.",
    question: "What should you prioritize first?",
    options: [
      { id: "a", text: "Energy efficiency in envelope and systems", correct: true, explanation: "Reduces ongoing emissions most significantly." },
      { id: "b", text: "Solar panels", correct: false, explanation: "Helpful but efficiency comes first." },
      { id: "c", text: "Green roof", correct: false, explanation: "Aesthetic and insulation but secondary." },
    ],
  },
  {
    id: "qr9",
    scenario: "You're designing a restaurant kitchen that must stay cool.",
    question: "What's the most important consideration?",
    options: [
      { id: "a", text: "Proper ventilation and exhaust systems", correct: true, explanation: "Heat removal is critical in kitchens." },
      { id: "b", text: "Large air conditioning units", correct: false, explanation: "Ventilation is more important than cooling." },
      { id: "c", text: "Reflective ceiling materials", correct: false, explanation: "Minimal impact compared to ventilation." },
    ],
  },
  {
    id: "qr10",
    scenario: "A building in a flood zone needs to be designed.",
    question: "What elevation strategy is best?",
    options: [
      { id: "a", text: "Elevate living spaces above flood level", correct: true, explanation: "Elevated design is the primary flood mitigation." },
      { id: "b", text: "Build a basement for storage", correct: false, explanation: "Basements can flood in flood zones." },
      { id: "c", text: "Install flood gates at entrances", correct: false, explanation: "Secondary measure, elevation is primary." },
    ],
  },
  {
    id: "qr11",
    scenario: "You're designing a library that needs to preserve books.",
    question: "What's most important for preservation?",
    options: [
      { id: "a", text: "Climate control - consistent temperature and humidity", correct: true, explanation: "Stable climate prevents book degradation." },
      { id: "b", text: "Natural light through skylights", correct: false, explanation: "Light damages books over time." },
      { id: "c", text: "Open floor plan for easy access", correct: false, explanation: "Not related to preservation." },
    ],
  },
  {
    id: "qr12",
    scenario: "A client wants their home to be net-zero energy.",
    question: "What should come first?",
    options: [
      { id: "a", text: "Drastic energy reduction through efficiency", correct: true, explanation: "Reduce demand before adding generation." },
      { id: "b", text: "Install largest possible solar system", correct: false, explanation: "Generation without efficiency wastes resources." },
      { id: "c", text: "Buy renewable energy credits", correct: false, explanation: "This is offsetting, not net-zero on site." },
    ],
  },
  {
    id: "qr13",
    scenario: "You're designing a museum gallery for priceless artworks.",
    question: "What environment is most critical?",
    options: [
      { id: "a", text: "Stable temperature and humidity with UV control", correct: true, explanation: "Climate stability protects art from damage." },
      { id: "b", text: "dramatic accent lighting", correct: false, explanation: "Lighting should be controlled, not dramatic." },
      { id: "c", text: "High ceilings for grandeur", correct: false, explanation: "Not critical for art preservation." },
    ],
  },
  {
    id: "qr14",
    scenario: "A building needs to be fire-resistant for insurance purposes.",
    question: "What's the best material choice?",
    options: [
      { id: "a", text: "Concrete and masonry construction", correct: true, explanation: "Non-combustible materials provide fire resistance." },
      { id: "b", text: "Steel frame with wood cladding", correct: false, explanation: "Steel weakens in fire, wood burns." },
      { id: "c", text: "Timber frame building", correct: false, explanation: "Wood is combustible unless engineered." },
    ],
  },
  {
    id: "qr15",
    scenario: "You're designing a building in a high-wind coastal area.",
    question: "What's most important?",
    options: [
      { id: "a", text: "Impact-resistant windows and reinforced connections", correct: true, explanation: "These prevent wind damage and uplift." },
      { id: "b", text: "Heavy concrete roof", correct: false, explanation: "Heavy roofs can fail in high winds." },
      { id: "c", text: "Open floor plan for wind flow", correct: false, explanation: "This doesn't address wind resistance." },
    ],
  },
  {
    id: "qr16",
    scenario: "A client wants to age in place in their home.",
    question: "What should be prioritized?",
    options: [
      { id: "a", text: "Single-floor living with wide doorways", correct: true, explanation: "Accessibility is key for aging in place." },
      { id: "b", text: "Luxurious second floor master suite", correct: false, explanation: "Requires stairs - opposite of aging in place." },
      { id: "c", text: "High-security features", correct: false, explanation: "Not related to aging in place." },
    ],
  },
  {
    id: "qr17",
    scenario: "You're designing a hotel lobby that impresses guests.",
    question: "What creates the biggest impact?",
    options: [
      { id: "a", text: "Double-height ceiling with natural light", correct: true, explanation: "Creates drama and welcoming atmosphere." },
      { id: "b", text: "Small intimate corners", correct: false, explanation: "Doesn't create the lobby impression." },
      { id: "c", text: "Basement recreation area", correct: false, explanation: "Not visible to arriving guests." },
    ],
  },
  {
    id: "qr18",
    scenario: "A commercial building needs to reduce urban heat island effect.",
    question: "What's most effective?",
    options: [
      { id: "a", text: "Cool roof with high albedo materials", correct: true, explanation: "Reflects sunlight and reduces heat absorption." },
      { id: "b", text: "Green roof", correct: false, explanation: "Helps but cool roof is more effective." },
      { id: "c", text: "Dark brick facade", correct: false, explanation: "Absorbs heat, worsens heat island." },
    ],
  },
  {
    id: "qr19",
    scenario: "You're designing a childcare center.",
    question: "What's the most important safety feature?",
    options: [
      { id: "a", text: "Child-height fixtures and rounded corners everywhere", correct: true, explanation: "Prevents injuries in active children." },
      { id: "b", text: "Large educational wall displays", correct: false, explanation: "Educational but not primary safety." },
      { id: "c", text: "Hardwood floors for easy cleaning", correct: false, explanation: "Hard floors can cause injury from falls." },
    ],
  },
  {
    id: "qr20",
    scenario: "A client wants to maximize views while maintaining privacy.",
    question: "What window treatment works best?",
    options: [
      { id: "a", text: "Frosted glass or angled louvers", correct: true, explanation: "Allows light and views while blocking visibility." },
      { id: "b", text: "Clear glass with no treatment", correct: false, explanation: "No privacy from outside views." },
      { id: "c", text: "Heavy blackout curtains", correct: false, explanation: "Blocks views entirely." },
    ],
  },
  {
    id: "qr21",
    scenario: "You're designing a building in a cold, snowy climate.",
    question: "What's most important for snow load?",
    options: [
      { id: "a", text: "Steep roof pitch and structural snow load capacity", correct: true, explanation: "Prevents snow accumulation and collapse." },
      { id: "b", text: "Flat roof for snow to pile evenly", correct: false, explanation: "Flat roofs collect snow and can collapse." },
      { id: "c", text: "Large overhangs for snow slide", correct: false, explanation: "Can create hazards below." },
    ],
  },
  {
    id: "qr22",
    scenario: "A client wants a low-maintenance exterior.",
    question: "What's the best material choice?",
    options: [
      { id: "a", text: "Fiber cement or vinyl siding", correct: true, explanation: "Durable and requires minimal upkeep." },
      { id: "b", text: "Wood siding requiring regular staining", correct: false, explanation: "High maintenance requirement." },
      { id: "c", text: "Natural stone requiring sealing", correct: false, explanation: "Requires periodic maintenance." },
    ],
  },
  {
    id: "qr23",
    scenario: "You're designing a recording studio.",
    question: "What's most important for acoustics?",
    options: [
      { id: "a", text: "Sound isolation and acoustic panels", correct: true, explanation: "Controls sound for recording quality." },
      { id: "b", text: "Hard reflective surfaces for volume", correct: false, explanation: "Creates echo, not suitable for recording." },
      { id: "c", text: "Open concept for spacious feel", correct: false, explanation: "Open spaces have poor acoustics for recording." },
    ],
  },
  {
    id: "qr24",
    scenario: "A building needs to be easily modified for future needs.",
    question: "What design approach is best?",
    options: [
      { id: "a", text: "Modular design with movable partitions", correct: true, explanation: "Allows reconfiguration without major work." },
      { id: "b", text: "Load-bearing walls for maximum strength", correct: false, explanation: "Limits flexibility for future changes." },
      { id: "c", text: "Minimal fixed elements", correct: false, explanation: "Still needs some structure." },
    ],
  },
  {
    id: "qr25",
    scenario: "You're designing a healthcare facility.",
    question: "What hygiene feature is most critical?",
    options: [
      { id: "a", text: "Easy-to-clean surfaces and hand-washing stations", correct: true, explanation: "Infection control is paramount in healthcare." },
      { id: "b", text: "Comfortable patient waiting areas", correct: false, explanation: "Important but secondary to hygiene." },
      { id: "c", text: "Natural healing garden", correct: false, explanation: "Beneficial but not primary for hygiene." },
    ],
  },
  {
    id: "qr26",
    scenario: "A client wants to reduce their water consumption.",
    question: "What's the biggest impact feature?",
    options: [
      { id: "a", text: "Low-flow fixtures and drought-tolerant landscaping", correct: true, explanation: "These reduce indoor and outdoor water use most." },
      { id: "b", text: "Rainwater harvesting for irrigation", correct: false, explanation: "Helpful but fixtures have bigger impact." },
      { id: "c", text: "Decorative water features", correct: false, explanation: "Increases water use, not reduces." },
    ],
  },
  {
    id: "qr27",
    scenario: "You're designing a building in a noisy urban area.",
    question: "What's most important for the design?",
    options: [
      { id: "a", text: "Soundproof windows and ventilation with silencing", correct: true, explanation: "Blocks urban noise from entering." },
      { id: "b", text: "Open windows for fresh air", correct: false, explanation: "Lets in noise from traffic." },
      { id: "c", text: "Street-level retail activation", correct: false, explanation: "Not related to noise control." },
    ],
  },
  {
    id: "qr28",
    scenario: "A client wants their home to have universal design appeal.",
    question: "What's the key principle?",
    options: [
      { id: "a", text: "Clean lines, neutral colors, and barrier-free access", correct: true, explanation: "Timeless and accessible design." },
      { id: "b", text: "Bold colors and unique architectural features", correct: false, explanation: "May not appeal to everyone." },
      { id: "c", text: "Minimalist tiny home aesthetic", correct: false, explanation: "Not what universal design means." },
    ],
  },
  {
    id: "qr29",
    scenario: "You're designing a building that must meet tight budget constraints.",
    question: "What's the best value strategy?",
    options: [
      { id: "a", text: "Simple box shape with efficient structural system", correct: true, explanation: "Simple forms are most cost-effective." },
      { id: "b", text: "Complex curves and custom details", correct: false, explanation: "Expensive to construct." },
      { id: "c", text: "Premium materials in key visible areas", correct: false, explanation: "Better to use consistent value materials." },
    ],
  },
  {
    id: "qr30",
    scenario: "A client wants a building that feels connected to nature.",
    question: "What design element is most effective?",
    options: [
      { id: "a", text: "Biophilic design with plants and natural materials", correct: true, explanation: "Direct connection to nature improves wellbeing." },
      { id: "b", text: "Large television screens with nature scenes", correct: false, explanation: "Not the same as real nature connection." },
      { id: "c", text: "Animal prints in decor", correct: false, explanation: "Not true biophilic design." },
    ],
  },
];

export default function ArchitectWorld({ difficulty, onComplete, isQuickRecall, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: ArchitectWorldProps) {
  const [stage, setStage] = useState<"intro" | "tutorial" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  // Quick Recall hearts system
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showHeartLost, setShowHeartLost] = useState(false);

  // Quick Recall timer countdown
  useEffect(() => {
    if (!isQuickRecall || stage !== "challenge" || hearts <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setHearts((h) => h - 1);
          setShowHeartLost(true);
          setTimeout(() => setShowHeartLost(false), 1000);
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuickRecall, stage, hearts]);

  // Reset timer on new question
  useEffect(() => {
    if (isQuickRecall && stage === "challenge") {
      setTimeLeft(20);
    }
  }, [currentQuestionIndex, isQuickRecall, stage]);

  const handleLoseHeart = () => {
    setHearts((h) => h - 1);
    setShowHeartLost(true);
    setTimeout(() => setShowHeartLost(false), 1000);
  };

  // Use quick recall questions if available, otherwise fall back to easy questions
  const currentQuestions = isQuickRecall 
    ? (quickRecallQuestions.length > 0 ? quickRecallQuestions : questions.easy)
    : questions[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  // Auto-select correct answer when alwaysCorrect is enabled
  useEffect(() => {
    if (alwaysCorrect && currentQuestion) {
      const correctOpt = currentQuestion.options.find(opt => opt.correct);
      if (correctOpt) setSelectedAnswer(correctOpt.id);
    }
  }, [alwaysCorrect, currentQuestionIndex]);

  // Shuffle options for current question
  const shuffledOptions = useMemo(() => {
    return shuffleArray(currentQuestion.options);
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    const selected = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
    if (!selected) return;

    const isCorrect = selected.correct;
    
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      setAnsweredQuestions([...answeredQuestions, true]);
      // Update streak
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }

      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        onComplete(true, newScore, totalQuestions);
      }
    } else {
      // Wrong answer in Quick Recall - lose a heart
      if (isQuickRecall) {
        handleLoseHeart();
        setStreak(0); // Reset streak on wrong answer
        
        if (hearts <= 1) {
          // Game over - no hearts left
          onComplete(false, score, totalQuestions);
        } else if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
        } else {
          onComplete(score >= Math.ceil(totalQuestions * 0.6), score, totalQuestions);
        }
      } else {
        // Regular challenge mode
        const newScore = score;
        setAnsweredQuestions([...answeredQuestions, false]);

        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
        } else {
          const passThreshold = Math.ceil(totalQuestions * 0.6);
          onComplete(newScore >= passThreshold, newScore, totalQuestions);
        }
      }
    }
  };

  if (stage === "intro") {
    return (
      <TutorialScreen
        careerName="Architect"
        careerIcon="🏛️"
        steps={[
          {
            title: "Understand the Design Brief",
            content: "Each question describes a building project. Read what the client needs and what constraints exist.",
            icon: "📖",
          },
          {
            title: "Balance Multiple Needs",
            content: "Great architecture balances: aesthetics (looks), function (use), safety (codes), and budget.",
            icon: "⚖️",
          },
          {
            title: "Choose the Best Solution",
            content: "Pick the design that best meets ALL requirements while being practical and safe.",
            icon: "👆",
          },
          {
            title: "Pass the Challenge",
            content: `You need ${Math.ceil(questions[difficulty].length * 0.6)} out of ${questions[difficulty].length} correct to pass. Good luck!`,
            icon: "🏆",
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
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 font-mono tracking-wider">
              📐 Design Challenge {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold text-gray-700">Timer:</div>
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-slate-600"}`}>
                    {timeLeft}s
                  </div>
                </div>
              )}
              {isQuickRecall && (
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < hearts ? "💖" : "🖤"}`} />
                  ))}
                </div>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-slate-600">{score}/{currentQuestionIndex}</div>
              </div>
              {/* Streak Display */}
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

          {/* Heart lost animation */}
          {showHeartLost && (
            <div className="fixed inset-0 bg-red-500/30 flex items-center justify-center z-50 pointer-events-none">
              <div className="text-8xl animate-pulse">💔</div>
            </div>
          )}

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
                      ? "bg-slate-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-500 p-4 mb-6">
            <p className="font-semibold text-slate-900 mb-2">Design Scenario:</p>
            <p className="text-slate-800">{currentQuestion.scenario}</p>
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
                    ? "border-slate-600 bg-slate-50"
                    : "border-gray-300 hover:border-slate-400"
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
            {currentQuestionIndex < totalQuestions - 1 ? "Next Challenge →" : "Submit Final Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
