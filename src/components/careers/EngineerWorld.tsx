"use client";

import { useState, useMemo, useEffect } from "react";
import { Difficulty } from "@/types/game";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface EngineerWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  isQuickRecall?: boolean;
  alwaysCorrect?: boolean;
}

interface DesignOption {
  id: string;
  name: string;
  cost: number;
  strength: number;
  time: number;
  description: string;
}

interface Constraints {
  maxCost: number;
  minStrength: number;
  maxTime: number;
}

interface Question {
  id: string;
  scenario: string;
  projectType: string;
  constraints: Constraints;
  designs: DesignOption[];
  correctDesign: string;
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Design a small pedestrian bridge for a park.",
      projectType: "Pedestrian Bridge",
      constraints: { maxCost: 100000, minStrength: 80, maxTime: 12 },
      designs: [
        { id: "d1", name: "Basic Steel", cost: 75000, strength: 85, time: 10, description: "Simple steel frame design" },
        { id: "d2", name: "Wood Frame", cost: 50000, strength: 70, time: 8, description: "Traditional wooden construction" },
        { id: "d3", name: "Premium Composite", cost: 120000, strength: 95, time: 14, description: "High-end materials" },
      ],
      correctDesign: "d1",
    },
    {
      id: "e2",
      scenario: "Build a retaining wall for a residential property.",
      projectType: "Retaining Wall",
      constraints: { maxCost: 50000, minStrength: 75, maxTime: 8 },
      designs: [
        { id: "d1", name: "Concrete Block", cost: 45000, strength: 80, time: 7, description: "Standard concrete blocks" },
        { id: "d2", name: "Natural Stone", cost: 60000, strength: 85, time: 10, description: "Aesthetic stone wall" },
        { id: "d3", name: "Timber", cost: 30000, strength: 65, time: 5, description: "Treated timber construction" },
      ],
      correctDesign: "d1",
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Design a pedestrian bridge for a city park.",
      projectType: "City Bridge",
      constraints: { maxCost: 100000, minStrength: 85, maxTime: 14 },
      designs: [
        { id: "d1", name: "Budget Steel Frame", cost: 50000, strength: 60, time: 8, description: "Basic steel frame design" },
        { id: "d2", name: "Reinforced Concrete", cost: 85000, strength: 95, time: 12, description: "Strong and durable" },
        { id: "d3", name: "Premium Composite", cost: 150000, strength: 100, time: 16, description: "Cutting-edge materials" },
      ],
      correctDesign: "d2",
    },
    {
      id: "m2",
      scenario: "Design a commercial building foundation.",
      projectType: "Foundation",
      constraints: { maxCost: 200000, minStrength: 90, maxTime: 10 },
      designs: [
        { id: "d1", name: "Standard Concrete", cost: 150000, strength: 85, time: 8, description: "Basic concrete foundation" },
        { id: "d2", name: "Reinforced Deep Pile", cost: 180000, strength: 95, time: 9, description: "Deep pile foundation" },
        { id: "d3", name: "Advanced Composite", cost: 220000, strength: 100, time: 12, description: "High-tech solution" },
      ],
      correctDesign: "d2",
    },
    {
      id: "m3",
      scenario: "Design a highway overpass structure.",
      projectType: "Highway Overpass",
      constraints: { maxCost: 500000, minStrength: 95, maxTime: 18 },
      designs: [
        { id: "d1", name: "Standard Steel", cost: 400000, strength: 90, time: 16, description: "Traditional steel design" },
        { id: "d2", name: "Prestressed Concrete", cost: 480000, strength: 97, time: 17, description: "Modern concrete solution" },
        { id: "d3", name: "Hybrid System", cost: 550000, strength: 100, time: 20, description: "Steel-concrete hybrid" },
      ],
      correctDesign: "d2",
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Design a high-rise building structural system.",
      projectType: "High-Rise Structure",
      constraints: { maxCost: 5000000, minStrength: 98, maxTime: 24 },
      designs: [
        { id: "d1", name: "Steel Frame", cost: 4500000, strength: 95, time: 22, description: "Traditional steel frame" },
        { id: "d2", name: "Reinforced Concrete Core", cost: 4800000, strength: 98, time: 23, description: "Concrete core with steel" },
        { id: "d3", name: "Composite Tube", cost: 5200000, strength: 100, time: 26, description: "Advanced tube system" },
        { id: "d4", name: "Budget Steel", cost: 3800000, strength: 92, time: 20, description: "Cost-effective option" },
      ],
      correctDesign: "d2",
    },
    {
      id: "h2",
      scenario: "Design a suspension bridge for a major river crossing.",
      projectType: "Suspension Bridge",
      constraints: { maxCost: 10000000, minStrength: 99, maxTime: 36 },
      designs: [
        { id: "d1", name: "Traditional Cable", cost: 9500000, strength: 97, time: 34, description: "Standard suspension design" },
        { id: "d2", name: "Advanced Cable-Stayed", cost: 9800000, strength: 99, time: 35, description: "Modern cable-stayed system" },
        { id: "d3", name: "Hybrid Suspension", cost: 10500000, strength: 100, time: 38, description: "Cutting-edge hybrid" },
        { id: "d4", name: "Arch-Suspension", cost: 8900000, strength: 96, time: 32, description: "Combined arch design" },
      ],
      correctDesign: "d2",
    },
    {
      id: "h3",
      scenario: "Design a seismic-resistant hospital in earthquake zone.",
      projectType: "Seismic Hospital",
      constraints: { maxCost: 8000000, minStrength: 97, maxTime: 30 },
      designs: [
        { id: "d1", name: "Base Isolation System", cost: 7800000, strength: 98, time: 29, description: "Seismic base isolators" },
        { id: "d2", name: "Moment Frame", cost: 7200000, strength: 95, time: 27, description: "Flexible moment frames" },
        { id: "d3", name: "Shear Wall System", cost: 6800000, strength: 93, time: 25, description: "Reinforced shear walls" },
        { id: "d4", name: "Advanced Damping", cost: 8500000, strength: 99, time: 32, description: "Active damping system" },
      ],
      correctDesign: "d1",
    },
    {
      id: "h4",
      scenario: "Design a wind-resistant skyscraper in coastal area.",
      projectType: "Coastal Skyscraper",
      constraints: { maxCost: 12000000, minStrength: 98, maxTime: 40 },
      designs: [
        { id: "d1", name: "Bundled Tube", cost: 11500000, strength: 97, time: 38, description: "Bundled tube structure" },
        { id: "d2", name: "Diagrid System", cost: 11800000, strength: 99, time: 39, description: "Diagonal grid exterior" },
        { id: "d3", name: "Outrigger-Braced", cost: 10800000, strength: 96, time: 36, description: "Outrigger bracing" },
        { id: "d4", name: "Mega-Frame", cost: 12500000, strength: 100, time: 42, description: "Mega-frame structure" },
      ],
      correctDesign: "d2",
    },
  ],
};

// Quick Recall mode - 30 civil engineering design challenges
const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Design a pedestrian bridge for a busy city park.",
    projectType: "City Park Bridge",
    constraints: { maxCost: 150000, minStrength: 85, maxTime: 12 },
    designs: [
      { id: "d1", name: "Steel Arch", cost: 130000, strength: 90, time: 10, description: "Classic arch design" },
      { id: "d2", name: "Simple Beam", cost: 80000, strength: 60, time: 8, description: "Basic beam bridge" },
      { id: "d3", name: "Suspension", cost: 200000, strength: 95, time: 18, description: "Premium suspension" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr2",
    scenario: "Build a retaining wall for a hillside driveway.",
    projectType: "Driveway Wall",
    constraints: { maxCost: 40000, minStrength: 70, maxTime: 6 },
    designs: [
      { id: "d1", name: "Concrete Block", cost: 35000, strength: 75, time: 5, description: "Interlocking blocks" },
      { id: "d2", name: "Natural Stone", cost: 55000, strength: 80, time: 10, description: "Aesthetic stone" },
      { id: "d3", name: "Timber", cost: 20000, strength: 50, time: 3, description: "Budget timber" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr3",
    scenario: "Design a small water treatment tank for a community.",
    projectType: "Water Tank",
    constraints: { maxCost: 80000, minStrength: 80, maxTime: 8 },
    designs: [
      { id: "d1", name: "Concrete Cylinder", cost: 70000, strength: 85, time: 7, description: "Reinforced concrete" },
      { id: "d2", name: "Steel Tank", cost: 95000, strength: 90, time: 5, description: "Corrosion resistant" },
      { id: "d3", name: "Plastic Dome", cost: 30000, strength: 40, time: 3, description: "Budget option" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr4",
    scenario: "Build a foundation for a two-story office building.",
    projectType: "Office Foundation",
    constraints: { maxCost: 120000, minStrength: 90, maxTime: 10 },
    designs: [
      { id: "d1", name: "Raft Foundation", cost: 100000, strength: 92, time: 8, description: "Single slab" },
      { id: "d2", name: "Strip Footings", cost: 70000, strength: 75, time: 6, description: "Traditional" },
      { id: "d3", name: "Deep Piles", cost: 180000, strength: 98, time: 14, description: "For weak soil" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr5",
    scenario: "Design a parking lot for a shopping center.",
    projectType: "Parking Lot",
    constraints: { maxCost: 200000, minStrength: 70, maxTime: 14 },
    designs: [
      { id: "d1", name: "Asphalt Surface", cost: 150000, strength: 75, time: 10, description: "Standard paving" },
      { id: "d2", name: "Concrete Slab", cost: 220000, strength: 90, time: 14, description: "Premium durability" },
      { id: "d3", name: "Gravel Lot", cost: 50000, strength: 40, time: 5, description: "Budget option" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr6",
    scenario: "Build a small footbridge over a creek in a park.",
    projectType: "Creek Bridge",
    constraints: { maxCost: 50000, minStrength: 75, maxTime: 6 },
    designs: [
      { id: "d1", name: "Wooden Deck", cost: 45000, strength: 78, time: 5, description: "Natural look" },
      { id: "d2", name: "Steel Girder", cost: 65000, strength: 85, time: 8, description: "Longer span" },
      { id: "d3", name: "Concrete Arch", cost: 80000, strength: 90, time: 12, description: "Permanent" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr7",
    scenario: "Design a drainage system for a residential subdivision.",
    projectType: "Drainage System",
    constraints: { maxCost: 180000, minStrength: 80, maxTime: 16 },
    designs: [
      { id: "d1", name: "Storm Sewers", cost: 160000, strength: 85, time: 14, description: "Piped system" },
      { id: "d2", name: "Open Channels", cost: 80000, strength: 70, time: 10, description: "Natural swales" },
      { id: "d3", name: "Retention Pond", cost: 250000, strength: 90, time: 20, description: "Full system" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr8",
    scenario: "Build a small bridge for pedestrian access across a highway.",
    projectType: "Highway Bridge",
    constraints: { maxCost: 300000, minStrength: 95, maxTime: 18 },
    designs: [
      { id: "d1", name: "Steel Box Girder", cost: 280000, strength: 96, time: 16, description: "Standard highway" },
      { id: "d2", name: "Concrete Tee", cost: 350000, strength: 98, time: 20, description: "Heavy duty" },
      { id: "d3", name: "Suspension", cost: 500000, strength: 99, time: 30, description: "Premium" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr9",
    scenario: "Design a septic system drain field for a rural home.",
    projectType: "Drain Field",
    constraints: { maxCost: 15000, minStrength: 60, maxTime: 3 },
    designs: [
      { id: "d1", name: "Gravel Trench", cost: 12000, strength: 65, time: 2, description: "Standard" },
      { id: "d2", name: "Chamber System", cost: 18000, strength: 75, time: 3, description: "Advanced" },
      { id: "d3", name: "Elevated Sand", cost: 25000, strength: 80, time: 5, description: "Premium" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr10",
    scenario: "Build a small boat dock for a lakeside property.",
    projectType: "Boat Dock",
    constraints: { maxCost: 25000, minStrength: 65, maxTime: 4 },
    designs: [
      { id: "d1", name: "Floating Dock", cost: 22000, strength: 70, time: 3, description: "Adjustable" },
      { id: "d2", name: "Pile Supported", cost: 30000, strength: 80, time: 6, description: "Permanent" },
      { id: "d3", name: "Pier Foundation", cost: 40000, strength: 85, time: 8, description: "Heavy duty" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr11",
    scenario: "Design a rain water collection system for a school.",
    projectType: "Rainwater Harvesting",
    constraints: { maxCost: 35000, minStrength: 70, maxTime: 6 },
    designs: [
      { id: "d1", name: "Underground Tanks", cost: 30000, strength: 75, time: 5, description: "Hidden storage" },
      { id: "d2", name: "Above Ground", cost: 20000, strength: 65, time: 3, description: "Budget tanks" },
      { id: "d3", name: "Green Roof", cost: 60000, strength: 80, time: 10, description: "Dual purpose" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr12",
    scenario: "Build a concrete ramp for wheelchair access at a library.",
    projectType: "Wheelchair Ramp",
    constraints: { maxCost: 18000, minStrength: 80, maxTime: 4 },
    designs: [
      { id: "d1", name: "Concrete Slope", cost: 15000, strength: 85, time: 3, description: "Permanent" },
      { id: "d2", name: "Steel Framework", cost: 22000, strength: 80, time: 4, description: "Modular" },
      { id: "d3", name: "Wood Platform", cost: 10000, strength: 60, time: 2, description: "Budget" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr13",
    scenario: "Design a small earth dam for a farm pond.",
    projectType: "Farm Dam",
    constraints: { maxCost: 45000, minStrength: 75, maxTime: 8 },
    designs: [
      { id: "d1", name: "Earth Fill", cost: 40000, strength: 78, time: 7, description: "Standard dam" },
      { id: "d2", name: "Clay Core", cost: 55000, strength: 85, time: 10, description: "Seepage control" },
      { id: "d3", name: "Concrete Wall", cost: 80000, strength: 95, time: 6, description: "Premium" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr14",
    scenario: "Build a small footbridge for a nature trail.",
    projectType: "Trail Bridge",
    constraints: { maxCost: 35000, minStrength: 70, maxTime: 5 },
    designs: [
      { id: "d1", name: "Wooden Beam", cost: 30000, strength: 72, time: 4, description: "Natural look" },
      { id: "d2", name: "Steel Span", cost: 45000, strength: 85, time: 6, description: "Longer span" },
      { id: "d3", name: "Concrete Deck", cost: 50000, strength: 90, time: 8, description: "Heavy duty" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr15",
    scenario: "Design a private well system for a country home.",
    projectType: "Water Well",
    constraints: { maxCost: 12000, minStrength: 65, maxTime: 3 },
    designs: [
      { id: "d1", name: "Drilled Well", cost: 10000, strength: 70, time: 2, description: "Standard" },
      { id: "d2", name: "Dug Well", cost: 8000, strength: 60, time: 3, description: "Budget" },
      { id: "d3", name: "Powered Pump", cost: 15000, strength: 75, time: 4, description: "Premium" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr16",
    scenario: "Build a small concrete patio at a restaurant.",
    projectType: "Restaurant Patio",
    constraints: { maxCost: 22000, minStrength: 75, maxTime: 4 },
    designs: [
      { id: "d1", name: "Poured Concrete", cost: 18000, strength: 78, time: 3, description: "Standard" },
      { id: "d2", name: "Paver Stones", cost: 25000, strength: 80, time: 5, description: "Decorative" },
      { id: "d3", name: "Stamped Concrete", cost: 30000, strength: 75, time: 4, description: "Aesthetic" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr17",
    scenario: "Design a small covered walkway between school buildings.",
    projectType: "School Walkway",
    constraints: { maxCost: 45000, minStrength: 75, maxTime: 6 },
    designs: [
      { id: "d1", name: "Metal Roof", cost: 40000, strength: 78, time: 5, description: "Standard" },
      { id: "d2", name: "Glass Canopy", cost: 65000, strength: 75, time: 8, description: "Modern" },
      { id: "d3", name: "Wood Structure", cost: 35000, strength: 70, time: 6, description: "Natural" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr18",
    scenario: "Build a small retaining wall for a garden terraced slope.",
    projectType: "Garden Wall",
    constraints: { maxCost: 8000, minStrength: 60, maxTime: 2 },
    designs: [
      { id: "d1", name: "Timber Blocks", cost: 6000, strength: 62, time: 1, description: "Budget" },
      { id: "d2", name: "Segmental Pavers", cost: 9000, strength: 70, time: 2, description: "Standard" },
      { id: "d3", name: "Natural Stone", cost: 15000, strength: 75, time: 4, description: "Premium" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr19",
    scenario: "Design a small airport hangar floor slab.",
    projectType: "Hangar Floor",
    constraints: { maxCost: 180000, minStrength: 90, maxTime: 12 },
    designs: [
      { id: "d1", name: "Reinforced Slab", cost: 160000, strength: 92, time: 10, description: "Standard" },
      { id: "d2", name: "Post-Tensioned", cost: 220000, strength: 98, time: 14, description: "Premium" },
      { id: "d3", name: "Simple Concrete", cost: 100000, strength: 75, time: 8, description: "Budget" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr20",
    scenario: "Build a small footbridge over a drainage ditch.",
    projectType: "Ditch Crossing",
    constraints: { maxCost: 15000, minStrength: 65, maxTime: 3 },
    designs: [
      { id: "d1", name: "Culvert Pipe", cost: 12000, strength: 70, time: 2, description: "Buried pipe" },
      { id: "d2", name: "Small Bridge", cost: 18000, strength: 75, time: 4, description: "Simple span" },
      { id: "d3", name: "Ford Crossing", cost: 5000, strength: 50, time: 1, description: "Budget" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr21",
    scenario: "Design a small playground foundation for a community park.",
    projectType: "Playground",
    constraints: { maxCost: 25000, minStrength: 75, maxTime: 5 },
    designs: [
      { id: "d1", name: "Rubberized Surface", cost: 22000, strength: 78, time: 4, description: "Safe surface" },
      { id: "d2", name: "Poured Concrete", cost: 18000, strength: 80, time: 4, description: "Standard" },
      { id: "d3", name: "Wood Chips", cost: 8000, strength: 50, time: 2, description: "Budget" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr22",
    scenario: "Build a small underground parking structure foundation.",
    projectType: "Underground Parking",
    constraints: { maxCost: 400000, minStrength: 95, maxTime: 20 },
    designs: [
      { id: "d1", name: "Diaphragm Walls", cost: 380000, strength: 96, time: 18, description: "Standard underground" },
      { id: "d2", name: "Secant Piles", cost: 320000, strength: 92, time: 16, description: "Cost effective" },
      { id: "d3", name: "Top-Down", cost: 500000, strength: 98, time: 24, description: "Premium" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr23",
    scenario: "Design a small water slide foundation at a water park.",
    projectType: "Water Slide",
    constraints: { maxCost: 55000, minStrength: 80, maxTime: 8 },
    designs: [
      { id: "d1", name: "Concrete Base", cost: 48000, strength: 82, time: 7, description: "Standard" },
      { id: "d2", name: "Steel Framework", cost: 65000, strength: 85, time: 6, description: "Flexible" },
      { id: "d3", name: "Wood Platform", cost: 30000, strength: 65, time: 4, description: "Budget" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr24",
    scenario: "Build a small tennis court foundation at a club.",
    projectType: "Tennis Court",
    constraints: { maxCost: 35000, minStrength: 75, maxTime: 6 },
    designs: [
      { id: "d1", name: "Asphalt Base", cost: 30000, strength: 78, time: 5, description: "Standard" },
      { id: "d2", name: "Concrete Slab", cost: 45000, strength: 85, time: 7, description: "Premium" },
      { id: "d3", name: "Clay Surface", cost: 20000, strength: 60, time: 4, description: "Budget" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr25",
    scenario: "Design a small bridge for light rail transit.",
    projectType: "Rail Bridge",
    constraints: { maxCost: 800000, minStrength: 98, maxTime: 24 },
    designs: [
      { id: "d1", name: "Concrete Box", cost: 750000, strength: 99, time: 22, description: "Standard rail" },
      { id: "d2", name: "Steel Truss", cost: 950000, strength: 99, time: 20, description: "Longer spans" },
      { id: "d3", name: "Ballasted Deck", cost: 600000, strength: 95, time: 18, description: "Budget" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr26",
    scenario: "Build a small spillway for a small dam.",
    projectType: "Spillway",
    constraints: { maxCost: 65000, minStrength: 85, maxTime: 10 },
    designs: [
      { id: "d1", name: "Concrete Chute", cost: 58000, strength: 88, time: 9, description: "Standard" },
      { id: "d2", name: "Stepped Weir", cost: 45000, strength: 80, time: 8, description: "Natural" },
      { id: "d3", name: "Labyrinth Weir", cost: 85000, strength: 90, time: 12, description: "Premium" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr27",
    scenario: "Design a small underground storm water cistern.",
    projectType: "Storm Cistern",
    constraints: { maxCost: 80000, minStrength: 80, maxTime: 8 },
    designs: [
      { id: "d1", name: "Precast Concrete", cost: 70000, strength: 85, time: 6, description: "Standard" },
      { id: "d2", name: "Steel Tank", cost: 95000, strength: 82, time: 5, description: "Quick install" },
      { id: "d3", name: "Fiberglass", cost: 60000, strength: 75, time: 4, description: "Budget" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr28",
    scenario: "Build a small outdoor stage foundation for concerts.",
    projectType: "Concert Stage",
    constraints: { maxCost: 55000, minStrength: 80, maxTime: 8 },
    designs: [
      { id: "d1", name: "Concrete Platform", cost: 48000, strength: 82, time: 7, description: "Permanent" },
      { id: "d2", name: "Steel Frame", cost: 65000, strength: 85, time: 5, description: "Portable" },
      { id: "d3", name: "Wood Deck", cost: 30000, strength: 65, time: 4, description: "Budget" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr29",
    scenario: "Design a small swimming pool at a hotel.",
    projectType: "Hotel Pool",
    constraints: { maxCost: 120000, minStrength: 85, maxTime: 12 },
    designs: [
      { id: "d1", name: "Gunite Shell", cost: 100000, strength: 88, time: 10, description: "Standard" },
      { id: "d2", name: "Vinyl Liner", cost: 75000, strength: 75, time: 8, description: "Budget" },
      { id: "d3", name: "Fiberglass", cost: 95000, strength: 80, time: 6, description: "Quick" },
    ],
    correctDesign: "d1",
  },
  {
    id: "qr30",
    scenario: "Build a small bridge for equestrian trails.",
    projectType: "Equestrian Bridge",
    constraints: { maxCost: 65000, minStrength: 80, maxTime: 8 },
    designs: [
      { id: "d1", name: "Timber Deck", cost: 55000, strength: 82, time: 7, description: "Natural look" },
      { id: "d2", name: "Steel Girder", cost: 80000, strength: 90, time: 8, description: "Heavy duty" },
      { id: "d3", name: "Concrete Slab", cost: 70000, strength: 88, time: 10, description: "Permanent" },
    ],
    correctDesign: "d1",
  },
];

export default function EngineerWorld({ difficulty, onComplete, isQuickRecall, alwaysCorrect }: EngineerWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
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
      setSelectedDesign(currentQuestion.correctDesign);
    }
  }, [alwaysCorrect, currentQuestionIndex]);

  // Shuffle designs for current question
  const shuffledDesigns = useMemo(() => {
    return shuffleArray(currentQuestion.designs);
  }, [currentQuestionIndex]);

  const meetsConstraints = (design: DesignOption) => {
    return (
      design.cost <= currentQuestion.constraints.maxCost &&
      design.strength >= currentQuestion.constraints.minStrength &&
      design.time <= currentQuestion.constraints.maxTime
    );
  };

  const handleSubmit = () => {
    const isCorrect = selectedDesign === currentQuestion.correctDesign;
    
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
        setSelectedDesign(null);
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
          setSelectedDesign(null);
        } else {
          onComplete(score >= Math.ceil(totalQuestions * 0.6), score, totalQuestions);
        }
      } else {
        // Regular challenge mode
        const newScore = score;
        setAnsweredQuestions([...answeredQuestions, false]);

        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedDesign(null);
        } else {
          const passThreshold = Math.ceil(totalQuestions * 0.6);
          onComplete(newScore >= passThreshold, newScore, totalQuestions);
        }
      }
    }
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Civil Engineer - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Scenario:</strong> You&apos;re a civil engineer working on {totalQuestions} different 
              projects. Each requires balancing cost, strength, and timeline constraints.
            </p>
            
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
              <p className="font-semibold text-orange-900">Your Task:</p>
              <p className="text-orange-800">
                Complete {totalQuestions} design challenges. You need {Math.ceil(totalQuestions * 0.6)} correct to pass!
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Difficulty: {difficulty.toUpperCase()}</strong> - 
                {difficulty === "easy" && " Simple projects with clear constraints"}
                {difficulty === "medium" && " Complex multi-constraint optimization"}
                {difficulty === "hard" && " Advanced structural engineering"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setStage("challenge")}
            className="w-full mt-8 bg-orange-600 text-white font-bold py-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Review Designs →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              🌉 Project {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold text-gray-700">Timer:</div>
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-orange-600"}`}>
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
                <div className="text-2xl font-bold text-orange-600">{score}/{currentQuestionIndex}</div>
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
                      ? "bg-orange-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
            <h4 className="font-bold text-orange-900 mb-1">{currentQuestion.projectType}</h4>
            <p className="text-orange-800">{currentQuestion.scenario}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-blue-900 mb-2">Project Constraints:</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">Budget:</span>
                <p className="text-blue-800">≤ ${currentQuestion.constraints.maxCost.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-semibold">Strength Rating:</span>
                <p className="text-blue-800">≥ {currentQuestion.constraints.minStrength}/100</p>
              </div>
              <div>
                <span className="font-semibold">Timeline:</span>
                <p className="text-blue-800">≤ {currentQuestion.constraints.maxTime} months</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {shuffledDesigns.map((design) => {
              const isSelected = selectedDesign === design.id;
              const meetsAll = meetsConstraints(design);
              
              return (
                <button
                  key={design.id}
                  onClick={() => setSelectedDesign(design.id)}
                  className={`w-full p-6 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-gray-900">
                      {design.name}
                    </h4>
                    {isSelected && (
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{design.description}</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Cost:</span>
                      <p className="font-bold text-gray-900">
                        ${design.cost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Strength:</span>
                      <p className="font-bold text-gray-900">
                        {design.strength}/100
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Timeline:</span>
                      <p className="font-bold text-gray-900">
                        {design.time} months
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedDesign}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestionIndex < totalQuestions - 1 ? "Next Project →" : "Submit Final Design"}
          </button>
        </div>
      </div>
    </div>
  );
}
