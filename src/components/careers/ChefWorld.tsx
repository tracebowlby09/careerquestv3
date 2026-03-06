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

interface ChefWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  isQuickRecall?: boolean;
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
      scenario: "You're preparing a dish and realize you're out of salt.",
      question: "What's the best substitute?",
      options: [
        { id: "a", text: "Soy sauce (for savory dishes)", correct: true, explanation: "Soy sauce adds saltiness plus umami flavor." },
        { id: "b", text: "Sugar", correct: false, explanation: "Sugar is sweet, not salty, and won't provide the needed flavor." },
        { id: "c", text: "Nothing, serve it bland", correct: false, explanation: "Proper seasoning is essential to good cooking." },
      ],
    },
    {
      id: "e2",
      scenario: "A customer has a peanut allergy.",
      question: "What's your responsibility?",
      options: [
        { id: "a", text: "Use separate equipment and check all ingredients", correct: true, explanation: "Cross-contamination can be life-threatening for allergy sufferers." },
        { id: "b", text: "Just avoid peanuts in their dish", correct: false, explanation: "Cross-contamination from shared equipment can still cause reactions." },
        { id: "c", text: "Tell them to order something else", correct: false, explanation: "Chefs should accommodate allergies safely when possible." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "You have 5 orders: steak (12 min), pasta (8 min), salad (3 min), soup (5 min), fish (10 min).",
      question: "What order do you start cooking to serve all together?",
      options: [
        { id: "a", text: "Steak → Fish → Pasta → Soup → Salad", correct: true, explanation: "Start longest items first so everything finishes together." },
        { id: "b", text: "Salad → Soup → Pasta → Fish → Steak", correct: false, explanation: "Salad would be wilted by the time steak is done." },
        { id: "c", text: "Cook everything at once", correct: false, explanation: "Limited space and attention make this impractical." },
      ],
    },
    {
      id: "m2",
      scenario: "Your sous chef accidentally added too much salt to a sauce.",
      question: "How do you fix it?",
      options: [
        { id: "a", text: "Add acid (lemon/vinegar) and dilute with unsalted liquid", correct: true, explanation: "Acid balances salt, and dilution reduces concentration." },
        { id: "b", text: "Add sugar to balance it", correct: false, explanation: "Sugar makes it sweet-salty, doesn't reduce saltiness." },
        { id: "c", text: "Throw it out and start over", correct: false, explanation: "Wasteful when the sauce can be saved." },
      ],
    },
    {
      id: "m3",
      scenario: "A dish came back because it's undercooked.",
      question: "What's the professional response?",
      options: [
        { id: "a", text: "Apologize, recook properly, and check quality control", correct: true, explanation: "Take responsibility and ensure it doesn't happen again." },
        { id: "b", text: "Blame the server for not checking", correct: false, explanation: "The kitchen is responsible for food quality." },
        { id: "c", text: "Microwave it quickly and send it back", correct: false, explanation: "This compromises quality and doesn't address the issue." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "During dinner rush, your walk-in cooler breaks down.",
      question: "What's your immediate priority?",
      options: [
        { id: "a", text: "Move perishables to backup cooling, assess what's salvageable", correct: true, explanation: "Food safety is paramount; prevent spoilage and waste." },
        { id: "b", text: "Keep cooking and deal with it after service", correct: false, explanation: "Perishables will spoil, creating health hazards and waste." },
        { id: "c", text: "Close the restaurant immediately", correct: false, explanation: "You can continue service while managing the cooling issue." },
      ],
    },
    {
      id: "h2",
      scenario: "You're creating a tasting menu with 7 courses.",
      question: "What's the proper progression?",
      options: [
        { id: "a", text: "Light → Rich, Cold → Hot, Delicate → Bold flavors", correct: true, explanation: "Proper progression prevents palate fatigue and enhances experience." },
        { id: "b", text: "Serve the best dish first to impress", correct: false, explanation: "Starting too rich overwhelms the palate for later courses." },
        { id: "c", text: "Random order based on cooking times", correct: false, explanation: "Tasting menus require thoughtful flavor progression." },
      ],
    },
    {
      id: "h3",
      scenario: "A food critic is dining anonymously in your restaurant.",
      question: "How should you approach this?",
      options: [
        { id: "a", text: "Maintain consistent high standards for all guests", correct: true, explanation: "Every guest deserves the same quality; consistency is key." },
        { id: "b", text: "Give them special treatment and extra courses", correct: false, explanation: "This isn't representative of normal service and can backfire." },
        { id: "c", text: "Try to identify and avoid serving them", correct: false, explanation: "Critics help you improve; embrace the opportunity." },
      ],
    },
    {
      id: "h4",
      scenario: "Your supplier delivered subpar ingredients for tonight's special.",
      question: "What's the best decision?",
      options: [
        { id: "a", text: "86 the special and offer an alternative with quality ingredients", correct: true, explanation: "Never compromise on ingredient quality; reputation is everything." },
        { id: "b", text: "Use them anyway, customers won't notice", correct: false, explanation: "Quality-conscious diners will notice, damaging your reputation." },
        { id: "c", text: "Charge less for the special", correct: false, explanation: "Lower price doesn't excuse lower quality." },
      ],
    },
  ],
};

// Quick Recall mode - 30 culinary challenges
const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "You need to quickly sear a steak for a busy dinner rush.",
    question: "What's the best approach?",
    options: [
      { id: "a", text: "High heat, dry surface, don't touch for 2 minutes", correct: true, explanation: "High heat sears, dry surface browns, flipping too early prevents crust." },
      { id: "b", text: "Medium heat, oil in pan, flip every 30 seconds", correct: false, explanation: "Medium heat won't sear properly and flipping too much steams the meat." },
      { id: "c", text: "Low heat and slow cook for even results", correct: false, explanation: "Low heat won't create the desired sear or crust." },
    ],
  },
  {
    id: "qr2",
    scenario: "A guest asks for a gluten-free option but your kitchen uses shared equipment.",
    question: "What's your responsibility?",
    options: [
      { id: "a", text: "Use separate, clean equipment for their order", correct: true, explanation: "Cross-contamination is serious for celiac guests." },
      { id: "b", text: "Just remove bread from the dish", correct: false, explanation: "Gluten can still be present in sauces, seasonings, and from cross-contact." },
      { id: "c", text: "Tell them nothing is truly gluten-free in your kitchen", correct: false, explanation: "With proper protocols, you can accommodate safely." },
    ],
  },
  {
    id: "qr3",
    scenario: "Your fish soup has a strong fishy smell.",
    question: "How do you fix it?",
    options: [
      { id: "a", text: "Add a splash of white wine and lemon", correct: true, explanation: "Acidity cuts fishy odors and enhances flavor." },
      { id: "b", text: "Add more fish for stronger taste", correct: false, explanation: "More fish will make the smell stronger." },
      { id: "c", text: "Add ketchup for color", correct: false, explanation: "Ketchup will ruin the soup's delicate flavor." },
    ],
  },
  {
    id: "qr4",
    scenario: "You're making hollandaise sauce and it starts to break.",
    question: "How do you fix it?",
    options: [
      { id: "a", text: "Add a splash of cold water and whisk vigorously", correct: true, explanation: "Cold water helps re-emulsify broken sauce." },
      { id: "b", text: "Add more butter immediately", correct: false, explanation: "Adding more to broken sauce won't help - you need to re-emulsify first." },
      { id: "c", text: "Put it in the freezer to cool down", correct: false, explanation: "Cooling won't fix a broken emulsion and will make it worse." },
    ],
  },
  {
    id: "qr5",
    scenario: "A customer orders their steak very well done.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Cook it thoroughly but still let it rest before serving", correct: true, explanation: "Even well-done meat benefits from resting." },
      { id: "b", text: "Charcoal grill it until it's black", correct: false, explanation: "This creates burnt, carcinogenic meat, not properly cooked." },
      { id: "c", text: "Refuse to cook it that long", correct: false, explanation: "You should accommodate guest preferences within reason." },
    ],
  },
  {
    id: "qr6",
    scenario: "Your chocolate chip cookies came out flat and crispy.",
    question: "What went wrong?",
    options: [
      { id: "a", text: "Too much butter and not enough flour", correct: true, explanation: "Flat crispy cookies indicate too much fat and not enough structure." },
      { id: "b", text: "Oven was too cold", correct: false, explanation: "Cold oven would make them underdone, not crispy." },
      { id: "c", text: "Too much chocolate chips", correct: false, explanation: "Too many chips affect texture but not the primary cause." },
    ],
  },
  {
    id: "qr7",
    scenario: "You need to chop onions quickly without crying.",
    question: "What's the best technique?",
    options: [
      { id: "a", text: "Chill onions before cutting and use a sharp knife", correct: true, explanation: "Cold slows enzyme release and sharp knife damages less cells." },
      { id: "b", text: "Cut them underwater", correct: false, explanation: "This is dangerous and impractical." },
      { id: "c", text: "Wear sunglasses while cutting", correct: false, explanation: "This doesn't actually help - the gas still reaches your eyes." },
    ],
  },
  {
    id: "qr8",
    scenario: "Your gravy is too salty.",
    question: "How do you fix it?",
    options: [
      { id: "a", text: "Add more unsalted stock and a splash of vinegar", correct: true, explanation: "Dilution and acidity balance out saltiness." },
      { id: "b", text: "Add more salt to balance it out", correct: false, explanation: "This will only make it saltier." },
      { id: "c", text: "Add sugar to cover the salt", correct: false, explanation: "Sugar masks but doesn't fix the issue." },
    ],
  },
  {
    id: "qr9",
    scenario: "You're cooking risotto and it's taking forever to cook.",
    question: "What's likely wrong?",
    options: [
      { id: "a", text: "Stock isn't hot enough", correct: true, explanation: "Cold stock stops the cooking process and extends time." },
      { id: "b", text: "Too much stock", correct: false, explanation: "You need to add stock gradually regardless of amount." },
      { id: "c", text: "You should use instant rice instead", correct: false, explanation: "That wouldn't be risotto." },
    ],
  },
  {
    id: "qr10",
    scenario: "A vegetarian guest is coming but your stock is meat-based.",
    question: "What do you use?",
    options: [
      { id: "a", text: "Vegetable stock, clearly marked", correct: true, explanation: "Always use appropriate substitutes and label clearly." },
      { id: "b", text: "Just dilute the meat stock more", correct: false, explanation: "This is not vegetarian and could harm their beliefs/health." },
      { id: "c", text: "Tell them all stocks have some meat", correct: false, explanation: "Many stocks are actually vegetarian - assume nothing." },
    ],
  },
  {
    id: "qr11",
    scenario: "Your pasta is sticking together.",
    question: "What went wrong?",
    options: [
      { id: "a", text: "Not enough water and no oil after draining", correct: true, explanation: "Pasta needs plenty of water and coating after draining." },
      { id: "b", text: "Water was too hot", correct: false, explanation: "Water should be at full boil for proper cooking." },
      { id: "c", text: "You stirred it too much", correct: false, explanation: "Stirring is actually good - you should stir right after adding." },
    ],
  },
  {
    id: "qr12",
    scenario: "You're making beef Wellington and the puff pastry is soggy.",
    question: "How do you prevent this?",
    options: [
      { id: "a", text: "Seal the meat with prosciutto and mustard first", correct: true, explanation: "This creates a barrier against moisture from the meat." },
      { id: "b", text: "Use more pastry dough", correct: false, explanation: "More pastry won't fix the moisture issue." },
      { id: "c", text: "Cook at lower temperature", correct: false, explanation: "Lower temp would make pastry undercooked, not crispier." },
    ],
  },
  {
    id: "qr13",
    scenario: "Your garlic bread is burning on the outside but cold inside.",
    question: "What temperature should you use?",
    options: [
      { id: "a", text: "Medium heat to allow heat to reach center", correct: true, explanation: "High heat burns outside before heat reaches middle." },
      { id: "b", text: "Very high heat for quick cooking", correct: false, explanation: "This guarantees burning." },
      { id: "c", text: "Very low heat for even cooking", correct: false, explanation: "Low heat will make it too dry." },
    ],
  },
  {
    id: "qr14",
    scenario: "A dish needs more brightness but you already added salt.",
    question: "What should you add?",
    options: [
      { id: "a", text: "Lemon juice or vinegar", correct: true, explanation: "Acid adds brightness and balance." },
      { id: "b", text: "More salt", correct: false, explanation: "Salt already added - more won't add brightness." },
      { id: "c", text: "Sugar", correct: false, explanation: "Sugar adds sweetness, not brightness." },
    ],
  },
  {
    id: "qr15",
    scenario: "Your mashed potatoes are gluey.",
    question: "What went wrong?",
    options: [
      { id: "a", text: "Overworked the potatoes with a food processor", correct: true, explanation: "Food processors break down starches and make gluey potatoes." },
      { id: "b", text: "Added too much butter", correct: false, explanation: "Too much butter makes them rich but not gluey." },
      { id: "c", text: "Used russet potatoes instead of Yukon Gold", correct: false, explanation: "Yukon Golds are actually better for mashing." },
    ],
  },
  {
    id: "qr16",
    scenario: "You're preparing for a large party and need to cook chicken ahead.",
    question: "What's the best approach?",
    options: [
      { id: "a", text: "Par-cook and finish just before serving", correct: true, explanation: "Partial cooking saves time, finishing ensures safety." },
      { id: "b", text: "Cook fully and reheat in microwave", correct: false, explanation: "Reheating dries out chicken and affects texture." },
      { id: "c", text: "Cook day before and let sit at room temp", correct: false, explanation: "Dangerous food safety violation." },
    ],
  },
  {
    id: "qr17",
    scenario: "Your stir-fry vegetables are mushy.",
    question: "How do you fix this?",
    options: [
      { id: "a", text: "Cook on higher heat for less time", correct: true, explanation: "High heat sears quickly, maintaining crunch." },
      { id: "b", text: "Add more sauce", correct: false, explanation: "Sauce doesn't affect texture of vegetables." },
      { id: "c", text: "Cut vegetables smaller", correct: false, explanation: "Smaller pieces cook even faster - not the solution." },
    ],
  },
  {
    id: "qr18",
    scenario: "A guest says they're allergic to shellfish but can eat fish.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Use separate utensils and cook seafood in different pan", correct: true, explanation: "Shellfish allergy is separate from fish allergy - cross-contact must be avoided." },
      { id: "b", text: "Fish and shellfish are the same - refuse the order", correct: false, explanation: "They are completely different allergens." },
      { id: "c", text: "Just remove the shrimp from their fish dish", correct: false, explanation: "Cross-contamination from cooking is still a risk." },
    ],
  },
  {
    id: "qr19",
    scenario: "Your tomato sauce tastes bitter.",
    question: "Why?",
    options: [
      { id: "a", text: "Cooked tomatoes too long on high heat", correct: true, explanation: "Bitter notes come from overcooked acidic ingredients." },
      { id: "b", text: "Didn't add enough basil", correct: false, explanation: "Basil adds flavor but doesn't affect bitterness." },
      { id: "c", text: "Used fresh tomatoes instead of canned", correct: false, explanation: "Fresh is often better - not the cause." },
    ],
  },
  {
    id: "qr20",
    scenario: "You need to tenderize tough meat quickly.",
    question: "What's the best method?",
    options: [
      { id: "a", text: "Use a meat mallet and marinate in acidic liquid", correct: true, explanation: "Mechanical tenderizing + acid breaks down fibers." },
      { id: "b", text: "Cook it longer on low heat", correct: false, explanation: "Slow cooking helps but won't quickly tenderize." },
      { id: "c", text: "Add more salt", correct: false, explanation: "Salt draws moisture - doesn't tenderize." },
    ],
  },
  {
    id: "qr21",
    scenario: "Your omelet is always tough.",
    question: "What's wrong with your technique?",
    options: [
      { id: "a", text: "Overmixing and cooking at too high heat", correct: true, explanation: "Beating in air and high heat make eggs rubbery." },
      { id: "b", text: "Using too many eggs", correct: false, explanation: "Egg quantity doesn't affect texture that way." },
      { id: "c", text: "Not adding enough cheese", correct: false, explanation: "Cheese adds richness, not texture issues." },
    ],
  },
  {
    id: "qr22",
    scenario: "A guest asks for their steak black and blue (almost raw).",
    question: "Is this safe?",
    options: [
      { id: "a", text: "Yes, if it's a quality cut and properly handled", correct: true, explanation: "Rare exterior is safe with trusted meat and clean handling." },
      { id: "b", text: "No, it's always unsafe", correct: false, explanation: "Raw steak can be safe when properly sourced." },
      { id: "c", text: "Only if you sear it first", correct: false, explanation: "Black and blue means seared outside, raw inside." },
    ],
  },
  {
    id: "qr23",
    scenario: "Your fried chicken coating falls off.",
    question: "How do you fix this?",
    options: [
      { id: "a", text: "Ensure chicken is dry and use double-breading method", correct: true, explanation: "Moisture is the enemy of breading adhesion." },
      { id: "b", text: "Use more batter", correct: false, explanation: "More batter just makes thicker coating that falls off." },
      { id: "c", text: "Cook at lower temperature", correct: false, explanation: "Lower temp makes coating soggy, not adhere better." },
    ],
  },
  {
    id: "qr24",
    scenario: "Your soup is too thin.",
    question: "How do you thicken it?",
    options: [
      { id: "a", text: "Add a Roux or blend some beans for natural thickness", correct: true, explanation: "Starches and purees thicken without changing flavor." },
      { id: "b", text: "Add cornstarch directly to boiling soup", correct: false, explanation: "Cornstarch needs slurry to prevent lumps." },
      { id: "c", text: "Cook longer to reduce", correct: false, explanation: "Reducing intensifies flavor but may overcook other ingredients." },
    ],
  },
  {
    id: "qr25",
    scenario: "You're making fresh pasta and it's crumbly.",
    question: "What's wrong?",
    options: [
      { id: "a", text: "Not enough hydration in the dough", correct: true, explanation: "Pasta dough needs proper hydration to hold together." },
      { id: "b", text: "Too much olive oil", correct: false, explanation: "Oil actually makes it more pliable." },
      { id: "c", text: "Kneaded too much", correct: false, explanation: "Over-kneading is rarely the problem with pasta." },
    ],
  },
  {
    id: "qr26",
    scenario: "Your caramel is crystallizing instead of being smooth.",
    question: "What caused this?",
    options: [
      { id: "a", text: "Stirred the caramel while cooking", correct: true, explanation: "Stirring creates crystals - let it cook without stirring." },
      { id: "b", text: "Sugar wasn't dissolved before cooking", correct: false, explanation: "It will dissolve as it cooks." },
      { id: "c", text: "Used brown sugar instead of white", correct: false, explanation: "Either works - technique is the issue." },
    ],
  },
  {
    id: "qr27",
    scenario: "You need to quickly cool down hot soup for service.",
    question: "What's the safest method?",
    options: [
      { id: "a", text: "Divide into shallow pans and stir occasionally", correct: true, explanation: "Large surface area and stirring speeds cooling safely." },
      { id: "b", text: "Put it in the walk-in freezer", correct: false, explanation: "Hot food shouldn't go directly into cold storage." },
      { id: "c", text: "Add ice cubes directly", correct: false, explanation: "Dilutes the soup and can affect food safety." },
    ],
  },
  {
    id: "qr28",
    scenario: "Your Caesar salad dressing is too thick.",
    question: "How do you thin it?",
    options: [
      { id: "a", text: "Drizzle in olive oil while whisking", correct: true, explanation: "Slow incorporation of oil emulsifies and thins." },
      { id: "b", text: "Add water directly", correct: false, explanation: "Water won't emulsify and will make it watery." },
      { id: "c", text: "Add more anchovies", correct: false, explanation: "Anchovies add flavor, not texture." },
    ],
  },
  {
    id: "qr29",
    scenario: "A dish needs umami but you have no mushrooms.",
    question: "What can you use?",
    options: [
      { id: "a", text: "Parmesan cheese, soy sauce, or tomatoes", correct: true, explanation: "These all contain naturally occurring umami." },
      { id: "b", text: "More salt", correct: false, explanation: "Salt enhances but doesn't create umami." },
      { id: "c", text: "Monosodium glutamate is the only option", correct: false, explanation: "Many foods have natural umami." },
    ],
  },
  {
    id: "qr30",
    scenario: "Your soufflé keeps collapsing immediately after removing from oven.",
    question: "What's likely the cause?",
    options: [
      { id: "a", text: "Opened oven door too early or underbaked slightly", correct: true, explanation: "Sudden temperature changes and structure cause collapse." },
      { id: "b", text: "Baked at too high temperature", correct: false, explanation: "High temp actually helps it rise." },
      { id: "c", text: "Used too many eggs", correct: false, explanation: "Eggs are essential to structure." },
    ],
  },
];

export default function ChefWorld({ difficulty, onComplete, isQuickRecall }: ChefWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
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
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👨‍🍳</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Chef - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Scenario:</strong> You&apos;re a professional chef managing {totalQuestions} different 
              kitchen situations. Make the right culinary decisions under pressure.
            </p>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
              <p className="font-semibold text-amber-900">Your Task:</p>
              <p className="text-amber-800">
                Handle {totalQuestions} kitchen challenges. You need {Math.ceil(totalQuestions * 0.6)} correct to pass!
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Difficulty: {difficulty.toUpperCase()}</strong> - 
                {difficulty === "easy" && " Basic cooking decisions"}
                {difficulty === "medium" && " Kitchen management and timing"}
                {difficulty === "hard" && " High-pressure professional scenarios"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setStage("challenge")}
            className="w-full mt-8 bg-amber-600 text-white font-bold py-4 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Enter Kitchen →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              🍳 Challenge {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold text-gray-700">Timer:</div>
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-amber-600"}`}>
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
                <div className="text-2xl font-bold text-amber-600">{score}/{currentQuestionIndex}</div>
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
                      ? "bg-amber-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <p className="font-semibold text-amber-900 mb-2">Kitchen Situation:</p>
            <p className="text-amber-800">{currentQuestion.scenario}</p>
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
                    ? "border-amber-600 bg-amber-50"
                    : "border-gray-300 hover:border-amber-400"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
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
