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

interface ProgrammerWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  isQuickRecall?: boolean;
  alwaysCorrect?: boolean;
}

interface Question {
  id: string;
  code: string;
  error: string;
  question: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      code: `function greet(name) {
  return "Hello " + name
}`,
      error: "Missing semicolon",
      question: "What's wrong with this code?",
      options: [
        { id: "a", text: "Missing semicolon after return statement", correct: true, explanation: "While JavaScript has automatic semicolon insertion, it's best practice to include them." },
        { id: "b", text: "Wrong function syntax", correct: false, explanation: "The function syntax is correct." },
        { id: "c", text: "String concatenation is wrong", correct: false, explanation: "The + operator correctly concatenates strings." },
      ],
    },
    {
      id: "e2",
      code: `let count = 0;
for (let i = 0; i <= 5; i++) {
  count = count + 1;
}`,
      error: "None - code works correctly",
      question: "What will be the value of count after this loop?",
      options: [
        { id: "a", text: "5", correct: false, explanation: "The loop runs from 0 to 5 inclusive, which is 6 iterations." },
        { id: "b", text: "6", correct: true, explanation: "The loop runs 6 times (i = 0, 1, 2, 3, 4, 5) because of the <= operator." },
        { id: "c", text: "4", correct: false, explanation: "This would be true if the loop used i < 5." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      code: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
      error: "Cannot read property 'price' of undefined",
      question: "What's causing this error?",
      options: [
        { id: "a", text: "Change <= to < in the loop condition", correct: true, explanation: "The loop goes one index too far (off-by-one error), causing 'undefined' access." },
        { id: "b", text: "Change let to var in the loop", correct: false, explanation: "Variable declaration type doesn't fix the array bounds issue." },
        { id: "c", text: "Add items[i] || 0 to handle undefined", correct: false, explanation: "This masks the symptom but doesn't fix the root cause." },
      ],
    },
    {
      id: "m2",
      code: `function findMax(numbers) {
  let max = 0;
  for (let num of numbers) {
    if (num > max) max = num;
  }
  return max;
}`,
      error: "Returns 0 for arrays with only negative numbers",
      question: "What's the bug in this function?",
      options: [
        { id: "a", text: "Initialize max to numbers[0] instead of 0", correct: true, explanation: "Starting at 0 means negative numbers will never be greater than max." },
        { id: "b", text: "Use >= instead of > in comparison", correct: false, explanation: "This doesn't solve the negative number problem." },
        { id: "c", text: "Use a while loop instead of for...of", correct: false, explanation: "The loop type isn't the issue." },
      ],
    },
    {
      id: "m3",
      code: `function reverseString(str) {
  let reversed = "";
  for (let i = str.length; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}`,
      error: "Returns 'undefined' at the start",
      question: "Why does this add 'undefined' to the result?",
      options: [
        { id: "a", text: "Start i at str.length - 1 instead of str.length", correct: true, explanation: "str.length is one past the last valid index, so str[str.length] is undefined." },
        { id: "b", text: "Use i > 0 instead of i >= 0", correct: false, explanation: "This would skip the first character." },
        { id: "c", text: "Use str.charAt(i) instead of str[i]", correct: false, explanation: "This doesn't fix the index issue." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      code: `function debounce(func, delay) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}`,
      error: "Function loses 'this' context and arguments",
      question: "What's wrong with this debounce implementation?",
      options: [
        { id: "a", text: "Use arrow function and apply() to preserve context", correct: true, explanation: "Need to capture 'this' and 'arguments' and pass them to func.apply()." },
        { id: "b", text: "Use setInterval instead of setTimeout", correct: false, explanation: "setInterval would repeatedly call the function, not debounce it." },
        { id: "c", text: "Clear timeout after calling func", correct: false, explanation: "The timeout should be cleared before setting a new one." },
      ],
    },
    {
      id: "h2",
      code: `async function fetchUsers() {
  const users = [];
  for (let id = 1; id <= 3; id++) {
    users.push(fetch(\`/api/user/\${id}\`));
  }
  return users;
}`,
      error: "Returns promises instead of user data",
      question: "How do you fix this async function?",
      options: [
        { id: "a", text: "Use await with fetch and Promise.all for parallel requests", correct: true, explanation: "Need to await the fetch promises. Use Promise.all(users) for parallel execution." },
        { id: "b", text: "Remove async keyword", correct: false, explanation: "We need async to use await." },
        { id: "c", text: "Use .then() instead of push", correct: false, explanation: "This doesn't solve the promise resolution issue." },
      ],
    },
    {
      id: "h3",
      code: `function memoize(fn) {
  const cache = {};
  return function(arg) {
    if (cache[arg]) return cache[arg];
    const result = fn(arg);
    cache[arg] = result;
    return result;
  };
}`,
      error: "Fails for falsy values like 0 or false",
      question: "What's the subtle bug in this memoization?",
      options: [
        { id: "a", text: "Use 'arg in cache' instead of cache[arg]", correct: true, explanation: "cache[arg] is falsy for 0, false, '', etc. Use 'in' operator to check key existence." },
        { id: "b", text: "Use Map instead of object", correct: false, explanation: "While Map is better, the main issue is the falsy value check." },
        { id: "c", text: "Clear cache after each call", correct: false, explanation: "This defeats the purpose of memoization." },
      ],
    },
    {
      id: "h4",
      code: `class Counter {
  count = 0;
  increment() {
    setTimeout(function() {
      this.count++;
    }, 100);
  }
}`,
      error: "Cannot read property 'count' of undefined",
      question: "Why does this class method fail?",
      options: [
        { id: "a", text: "Use arrow function in setTimeout to preserve 'this'", correct: true, explanation: "Regular functions create their own 'this'. Arrow functions inherit 'this' from enclosing scope." },
        { id: "b", text: "Use var instead of let", correct: false, explanation: "Variable declaration doesn't affect 'this' binding." },
        { id: "c", text: "Call increment with .bind(this)", correct: false, explanation: "The issue is inside increment, not when calling it." },
      ],
    },
  ],
};

// Quick Recall mode - 30 programming questions for practice
const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    code: `const x = [1, 2, 3];\nconsole.log(x[5]);`,
    error: "undefined",
    question: "What will this code output?",
    options: [
      { id: "a", text: "undefined", correct: true, explanation: "Array index 5 doesn't exist, so it returns undefined." },
      { id: "b", text: "null", correct: false, explanation: "It's undefined, not null." },
      { id: "c", text: "Error", correct: false, explanation: "No error, just returns undefined." },
    ],
  },
  {
    id: "qr2",
    code: `console.log(typeof null);`,
    error: "N/A",
    question: "What does this output?",
    options: [
      { id: "a", text: "object", correct: true, explanation: "This is a famous JavaScript quirk - typeof null returns 'object'." },
      { id: "b", text: "null", correct: false, explanation: "This is a known JavaScript bug/w quirk." },
      { id: "c", text: "undefined", correct: false, explanation: "It's actually 'object'." },
    ],
  },
  {
    id: "qr3",
    code: `let x = 5;\nlet y = '5';\nconsole.log(x == y);`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "true", correct: true, explanation: "== does type coercion, so 5 == '5' is true." },
      { id: "b", text: "false", correct: false, explanation: "Use === for strict comparison." },
      { id: "c", text: "Error", correct: false, explanation: "No error, returns boolean." },
    ],
  },
  {
    id: "qr4",
    code: `console.log(1 + '2' + 3);`,
    error: "N/A",
    question: "What does this output?",
    options: [
      { id: "a", text: "123", correct: true, explanation: "String concatenation: 1 + '2' = '12', then '12' + 3 = '123'." },
      { id: "b", text: "6", correct: false, explanation: "That's if all were numbers, but string wins." },
      { id: "c", text: "15", correct: false, explanation: "No, string concatenation applies." },
    ],
  },
  {
    id: "qr5",
    code: `for (var i = 0; i < 3; i++) {}\nconsole.log(i);`,
    error: "N/A",
    question: "What does this output?",
    options: [
      { id: "a", text: "3", correct: true, explanation: "var is function-scoped, loop ends at i=3." },
      { id: "b", text: "2", correct: false, explanation: "After i++ from 2, i becomes 3, then loop exits." },
      { id: "c", text: "undefined", correct: false, explanation: "var is accessible outside the loop." },
    ],
  },
  {
    id: "qr6",
    code: `[1, 2, 3].forEach(x => console.log(x));`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "1 2 3 (each on new line)", correct: true, explanation: "forEach iterates and logs each element." },
      { id: "b", text: "123", correct: false, explanation: "Each value is logged separately." },
      { id: "c", text: "undefined", correct: false, explanation: "forEach returns undefined." },
    ],
  },
  {
    id: "qr7",
    code: `console.log([...[1,2,3]]);`,
    error: "N/A",
    question: "What does this output?",
    options: [
      { id: "a", text: "[1, 2, 3]", correct: true, explanation: "Spread operator unpacks and repacks the array." },
      { id: "b", text: "1,2,3", correct: false, explanation: "It creates a new array." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid syntax." },
    ],
  },
  {
    id: "qr8",
    code: `const obj = { a: 1 };\nobj.b = 2;\nconsole.log(obj);`,
    error: "N/A",
    question: "What happens?",
    options: [
      { id: "a", text: "Outputs {a: 1, b: 2}", correct: true, explanation: "const prevents reassignment but not property modification." },
      { id: "b", text: "Error", correct: false, explanation: "const objects can have properties modified." },
      { id: "c", text: "Outputs {a: 1}", correct: false, explanation: "Properties can be added." },
    ],
  },
  {
    id: "qr9",
    code: `console.log('hello'.replace('l', 'x'));`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "hexxo", correct: true, explanation: "replace() only replaces the first occurrence." },
      { id: "b", text: "hexxxo", correct: false, explanation: "Only first 'l' is replaced." },
      { id: "c", text: "hello", correct: false, explanation: "It does replace." },
    ],
  },
  {
    id: "qr10",
    code: `console.log(0.1 + 0.2 === 0.3);`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "false", correct: true, explanation: "Floating point precision issue: 0.1 + 0.2 = 0.30000000000000004." },
      { id: "b", text: "true", correct: false, explanation: "JavaScript has floating point precision issues." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid JavaScript." },
    ],
  },
  {
    id: "qr11",
    code: `function test() { return; 1; }\nconsole.log(test());`,
    error: "N/A",
    question: "What does this return?",
    options: [
      { id: "a", text: "undefined", correct: true, explanation: "return; with no value returns undefined." },
      { id: "b", text: "1", correct: false, explanation: "Code after return is unreachable." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid syntax." },
    ],
  },
  {
    id: "qr12",
    code: `console.log([1,2,3].map(x => x * 2));`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "[2, 4, 6]", correct: true, explanation: "map creates a new array with transformed values." },
      { id: "b", text: "[1, 2, 3]", correct: false, explanation: "map transforms each element." },
      { id: "c", text: "6", correct: false, explanation: "map returns an array." },
    ],
  },
  {
    id: "qr13",
    code: `console.log('5' - 3);`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "2", correct: true, explanation: "Minus operator coerces to number: '5' - 3 = 2." },
      { id: "b", text: "'53'", correct: false, explanation: "Only plus does string concatenation." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid." },
    ],
  },
  {
    id: "qr14",
    code: `const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "4", correct: true, explanation: "push adds an element, length becomes 4." },
      { id: "b", text: "3", correct: false, explanation: "arr was modified." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid." },
    ],
  },
  {
    id: "qr15",
    code: `console.log(Boolean(''));`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "false", correct: true, explanation: "Empty string is falsy." },
      { id: "b", text: "true", correct: false, explanation: "Empty strings are falsy." },
      { id: "c", text: "undefined", correct: false, explanation: "Boolean() returns boolean." },
    ],
  },
  {
    id: "qr16",
    code: `let x = [1, 2, 3];\nlet y = x;\ny.push(4);\nconsole.log(x);`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "[1, 2, 3, 4]", correct: true, explanation: "Arrays are passed by reference in JS." },
      { id: "b", text: "[1, 2, 3]", correct: false, explanation: "x and y reference the same array." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid." },
    ],
  },
  {
    id: "qr17",
    code: `console.log([1,2,3].filter(x => x > 1));`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "[2, 3]", correct: true, explanation: "filter returns elements that pass the test." },
      { id: "b", text: "[1, 2, 3]", correct: false, explanation: "filter removes elements that don't pass." },
      { id: "c", text: "true", correct: false, explanation: "filter returns an array." },
    ],
  },
  {
    id: "qr18",
    code: `console.log(Math.max());`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "-Infinity", correct: true, explanation: "With no arguments, max returns -Infinity." },
      { id: "b", text: "0", correct: false, explanation: "It returns -Infinity." },
      { id: "c", text: "undefined", correct: false, explanation: "It's -Infinity." },
    ],
  },
  {
    id: "qr19",
    code: `console.log('abc'.charAt(10));`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "empty string", correct: true, explanation: "charAt returns empty string for out of bounds." },
      { id: "b", text: "undefined", correct: false, explanation: "It returns empty string, not undefined." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid." },
    ],
  },
  {
    id: "qr20",
    code: `console.log(2 ** 3);`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "8", correct: true, explanation: "** is the exponentiation operator (2^3 = 8)." },
      { id: "b", text: "6", correct: false, explanation: "That's 2 * 3." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid ES2016+ syntax." },
    ],
  },
  {
    id: "qr21",
    code: `console.log([1, 2, 3].reduce((a, b) => a + b));`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "6", correct: true, explanation: "reduce sums all elements: 1+2+3 = 6." },
      { id: "b", text: "[1, 2, 3]", correct: false, explanation: "reduce returns a single value." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid." },
    ],
  },
  {
    id: "qr22",
    code: `console.log(NaN === NaN);`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "false", correct: true, explanation: "NaN is not equal to itself - use isNaN() or Number.isNaN()." },
      { id: "b", text: "true", correct: false, explanation: "NaN === NaN is false." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid but returns false." },
    ],
  },
  {
    id: "qr23",
    code: `let x = { foo: 1 };\nlet y = { foo: 1 };\nconsole.log(x === y);`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "false", correct: true, explanation: "Objects are compared by reference, not value." },
      { id: "b", text: "true", correct: false, explanation: "Different object references." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid." },
    ],
  },
  {
    id: "qr24",
    code: `console.log('hello'.toUpperCase());`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "HELLO", correct: true, explanation: "toUpperCase converts string to uppercase." },
      { id: "b", text: "Hello", correct: false, explanation: "That's not proper case conversion." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid." },
    ],
  },
  {
    id: "qr25",
    code: `console.log(!!'hello');`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "true", correct: true, explanation: "!! converts to boolean (truthy becomes true)." },
      { id: "b", text: "false", correct: false, explanation: "Non-empty string is truthy." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid." },
    ],
  },
  {
    id: "qr26",
    code: `const greeting = 'Hello';\ngreeting = 'Hi';`,
    error: "TypeError",
    question: "What error occurs?",
    options: [
      { id: "a", text: "TypeError: Assignment to constant", correct: true, explanation: "Cannot reassign a const variable." },
      { id: "b", text: "SyntaxError", correct: false, explanation: "This is a TypeError." },
      { id: "c", text: "ReferenceError", correct: false, explanation: "Not a reference error." },
    ],
  },
  {
    id: "qr27",
    code: `console.log([1,2,3].includes(2));`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "true", correct: true, explanation: "includes checks if element exists in array." },
      { id: "b", text: "false", correct: false, explanation: "2 is in the array." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid ES2016 syntax." },
    ],
  },
  {
    id: "qr28",
    code: `let x = 5;\nlet y = x++;\nconsole.log(y);`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "5", correct: true, explanation: "x++ returns value THEN increments, so y gets 5." },
      { id: "b", text: "6", correct: false, explanation: "++ returns old value first." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid." },
    ],
  },
  {
    id: "qr29",
    code: `console.log('a' < 'b');`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "true", correct: true, explanation: "String comparison uses Unicode values." },
      { id: "b", text: "false", correct: false, explanation: "'a' comes before 'b'." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid." },
    ],
  },
  {
    id: "qr30",
    code: `console.log(Array(3).fill(0));`,
    error: "N/A",
    question: "What is the output?",
    options: [
      { id: "a", text: "[0, 0, 0]", correct: true, explanation: "fill populates all elements with the value." },
      { id: "b", text: "[undefined, undefined, undefined]", correct: false, explanation: "fill changes this." },
      { id: "c", text: "Error", correct: false, explanation: "This is valid." },
    ],
  },
];

export default function ProgrammerWorld({ difficulty, onComplete, isQuickRecall, alwaysCorrect }: ProgrammerWorldProps) {
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
  const [heartLostMessage, setHeartLostMessage] = useState("");

  // Timer for Quick Recall mode
  useEffect(() => {
    if (!isQuickRecall || stage !== "challenge" || hearts <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleLoseHeart("Time's up!");
          return 20;
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
    
    setTimeout(() => {
      setShowHeartLost(false);
      if (newHearts <= 0) {
        onComplete(false, score, totalQuestions);
      } else if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setTimeLeft(20);
      } else {
        onComplete(true, score + 1, totalQuestions);
      }
    }, 1500);
  };

  // Use quick recall questions if available, otherwise fall back to difficulty questions
  const currentQuestions = isQuickRecall 
    ? (quickRecallQuestions.length > 0 ? quickRecallQuestions : questions.easy)
    : questions[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  // Auto-select correct answer when alwaysCorrect is enabled
  useEffect(() => {
    if (alwaysCorrect && currentQuestion) {
      const correctOption = currentQuestion.options.find(opt => opt.correct);
      if (correctOption) {
        setSelectedAnswer(correctOption.id);
        // Auto-submit after a brief delay
        setTimeout(() => {
          const submitBtn = document.getElementById('submit-btn');
          if (submitBtn) submitBtn.click();
        }, 300);
      }
    }
  }, [alwaysCorrect, currentQuestionIndex, currentQuestion]);

  // Shuffle options for current question
  const shuffledOptions = useMemo(() => {
    return shuffleArray(currentQuestion.options);
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    const selected = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
    if (!selected) return;

    const isCorrect = selected.correct;
    
    // Quick Recall mode: hearts system
    if (isQuickRecall) {
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
          setTimeLeft(20);
        } else {
          onComplete(true, newScore, totalQuestions);
        }
      } else {
        handleLoseHeart("Wrong answer!");
        setStreak(0); // Reset streak on wrong answer
      }
      return;
    }

    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setAnsweredQuestions([...answeredQuestions, isCorrect]);
    // Update streak for challenge mode too
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
    } else {
      setStreak(0);
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // All questions completed
      const passThreshold = Math.ceil(totalQuestions * 0.6); // Need 60% to pass
      onComplete(newScore >= passThreshold, newScore, totalQuestions);
    }
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💻</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Software Programmer - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Scenario:</strong> You&apos;re a developer reviewing code and fixing bugs. 
              Your team needs you to identify and solve {totalQuestions} programming challenges.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="font-semibold text-blue-900">Your Task:</p>
              <p className="text-blue-800">
                Answer {totalQuestions} debugging questions correctly. You need {Math.ceil(totalQuestions * 0.6)} correct to pass!
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Difficulty: {difficulty.toUpperCase()}</strong> - 
                {difficulty === "easy" && " Perfect for beginners"}
                {difficulty === "medium" && " Intermediate challenges"}
                {difficulty === "hard" && " Expert-level problems"}
              </p>
            </div>

            {/* Quick Recall Mode Info */}
            {isQuickRecall && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="font-semibold text-red-900 mb-2">⚡ Quick Recall Mode:</p>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>❤️ You have 3 hearts</li>
                  <li>❌ Lose 1 heart for each wrong answer</li>
                  <li>⏱️ Lose 1 heart if time runs out (20 seconds per question)</li>
                  <li>🏆 Complete all questions to win!</li>
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => setStage("challenge")}
            className="w-full mt-8 bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Debugging →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Heart Lost Overlay */}
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
            <h3 className="text-2xl font-bold text-gray-900 font-mono">
              🐛 Question {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {/* Quick Recall: Hearts Display */}
              {isQuickRecall && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">❤️</span>
                  <span className={`text-2xl font-bold ${hearts === 1 ? 'text-red-600' : hearts === 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {hearts}
                  </span>
                </div>
              )}
              {/* Quick Recall: Timer Display */}
              {isQuickRecall && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-100 animate-pulse' : 'bg-blue-100'}`}>
                  <span className="text-lg">⏱️</span>
                  <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
                    {timeLeft}s
                  </span>
                </div>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-blue-600">{score}/{currentQuestionIndex}</div>
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

          {/* Progress bar */}
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
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              <strong>Error:</strong> <code className="text-red-600">{currentQuestion.error}</code>
            </p>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
              <pre>{currentQuestion.code}</pre>
            </div>

            <p className="text-lg font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {shuffledOptions.map((option) => (
              <label
                key={option.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAnswer === option.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
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
            {currentQuestionIndex < totalQuestions - 1 ? "Next Question →" : "Submit Final Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
