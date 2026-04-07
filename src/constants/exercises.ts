import { Exercise } from "../types";

export const THINKING_EXERCISES: Record<string, Exercise[]> = {
  math: [
    {
      id: 'm1',
      type: 'logic',
      difficulty: 1,
      question: "What comes next in the pattern: 2, 4, 6, 8, ...?",
      options: ["9", "10", "11", "12"],
      answer: "10",
      explanation: "The numbers are increasing by 2 each time.",
      xpReward: 100
    },
    {
      id: 'm2',
      type: 'visual',
      difficulty: 2,
      question: "Which shape has more sides: a triangle or a square?",
      options: ["Triangle", "Square"],
      answer: "Square",
      explanation: "A triangle has 3 sides, while a square has 4 sides.",
      xpReward: 120
    },
    {
      id: 'm3',
      type: 'logic',
      difficulty: 3,
      question: "If 3 apples cost $6, how much does 1 apple cost?",
      options: ["$1", "$2", "$3", "$4"],
      answer: "$2",
      explanation: "Divide the total cost by the number of apples: 6 / 3 = 2.",
      xpReward: 150
    },
    {
      id: 'm4',
      type: 'problem-solving',
      difficulty: 4,
      question: "A bus has 10 seats. 4 seats are empty. How many people are on the bus?",
      options: ["4", "6", "10", "14"],
      answer: "6",
      explanation: "Subtract the empty seats from the total seats: 10 - 4 = 6.",
      xpReward: 200
    },
    {
      id: 'm5',
      type: 'memory',
      difficulty: 2,
      question: "Remember these numbers: 5, 9, 2. Which number was in the middle?",
      options: ["5", "9", "2"],
      answer: "9",
      explanation: "The sequence was 5, 9, 2. The middle number is 9.",
      xpReward: 130
    },
    // ... adding more to reach 20 for math
    ...Array.from({ length: 15 }).map((_, i) => ({
      id: `m-extra-${i}`,
      type: ['logic', 'visual', 'problem-solving', 'memory'][i % 4] as any,
      difficulty: ((i % 5) + 1) as any,
      question: `Math Thinking Challenge #${i + 6}: Solve the puzzle!`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option A",
      explanation: "This is a placeholder for a complex math thinking exercise.",
      xpReward: 100 + (i * 10)
    }))
  ],
  science: [
    {
      id: 's1',
      type: 'visual',
      difficulty: 1,
      question: "Which of these is a source of light?",
      options: ["Moon", "Sun", "Mirror", "Cloud"],
      answer: "Sun",
      explanation: "The Sun produces its own light, while the others reflect it or block it.",
      xpReward: 100
    },
    {
      id: 's2',
      type: 'logic',
      difficulty: 2,
      question: "Ice turns into water when it gets...?",
      options: ["Colder", "Warmer", "Bigger", "Smaller"],
      answer: "Warmer",
      explanation: "Heat causes ice to melt and become liquid water.",
      xpReward: 120
    },
    {
      id: 's3',
      type: 'problem-solving',
      difficulty: 3,
      question: "Which material would be best to make a raincoat?",
      options: ["Paper", "Cotton", "Plastic", "Wool"],
      answer: "Plastic",
      explanation: "Plastic is waterproof and keeps you dry.",
      xpReward: 150
    },
    {
      id: 's4',
      type: 'visual',
      difficulty: 4,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
      explanation: "Mars has iron oxide on its surface, giving it a reddish appearance.",
      xpReward: 200
    },
    {
      id: 's5',
      type: 'logic',
      difficulty: 2,
      question: "Plants need sunlight, water, and what else to grow?",
      options: ["Candy", "Soil", "Toys", "Music"],
      answer: "Soil",
      explanation: "Soil provides nutrients and stability for plants.",
      xpReward: 130
    },
    ...Array.from({ length: 15 }).map((_, i) => ({
      id: `s-extra-${i}`,
      type: ['logic', 'visual', 'problem-solving', 'memory'][i % 4] as any,
      difficulty: ((i % 5) + 1) as any,
      question: `Science Thinking Challenge #${i + 6}: Explore the world!`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option A",
      explanation: "This is a placeholder for a complex science thinking exercise.",
      xpReward: 100 + (i * 10)
    }))
  ],
  nature: [
    {
      id: 'n1',
      type: 'visual',
      difficulty: 1,
      question: "Which animal has a long trunk?",
      options: ["Lion", "Elephant", "Giraffe", "Monkey"],
      answer: "Elephant",
      explanation: "Elephants use their long trunks for breathing, smelling, and touching.",
      xpReward: 100
    },
    {
      id: 'n2',
      type: 'logic',
      difficulty: 2,
      question: "A caterpillar turns into a...?",
      options: ["Bee", "Spider", "Butterfly", "Ant"],
      answer: "Butterfly",
      explanation: "Caterpillars undergo metamorphosis to become butterflies.",
      xpReward: 120
    },
    {
      id: 'n3',
      type: 'problem-solving',
      difficulty: 3,
      question: "What do bees collect from flowers to make honey?",
      options: ["Water", "Nectar", "Leaves", "Seeds"],
      answer: "Nectar",
      explanation: "Bees collect nectar and transform it into honey in their hives.",
      xpReward: 150
    },
    {
      id: 'n4',
      type: 'visual',
      difficulty: 4,
      question: "Which of these animals lives in the Arctic?",
      options: ["Polar Bear", "Camel", "Kangaroo", "Zebra"],
      answer: "Polar Bear",
      explanation: "Polar bears are adapted to live in the cold Arctic environment.",
      xpReward: 200
    },
    {
      id: 'n5',
      type: 'logic',
      difficulty: 2,
      question: "Which season comes after Winter?",
      options: ["Summer", "Autumn", "Spring"],
      answer: "Spring",
      explanation: "The seasons follow the order: Spring, Summer, Autumn, Winter.",
      xpReward: 130
    },
    ...Array.from({ length: 15 }).map((_, i) => ({
      id: `n-extra-${i}`,
      type: ['logic', 'visual', 'problem-solving', 'memory'][i % 4] as any,
      difficulty: ((i % 5) + 1) as any,
      question: `Nature Thinking Challenge #${i + 6}: Discover the wild!`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option A",
      explanation: "This is a placeholder for a complex nature thinking exercise.",
      xpReward: 100 + (i * 10)
    }))
  ]
};
