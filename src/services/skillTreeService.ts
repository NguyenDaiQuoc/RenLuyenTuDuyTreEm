import { SubjectId, SkillNode, Difficulty } from "../types";

const SUBJECT_THEMES: Record<SubjectId, string[]> = {
  math: [
    "Numbers 1-5", "Shapes", "Big & Small", "Numbers 1-10", "Patterns", 
    "Addition Basics", "Subtraction Basics", "Measurement", "Time", "Money",
    "Numbers 1-20", "Geometry", "Logic Math", "Word Problems", "Data",
    "Multiplication Intro", "Division Intro", "Fractions", "Estimation", "Advanced Shapes",
    "Mental Math", "Equations", "Symmetry", "Probability", "Graphing",
    "Large Numbers", "Decimals", "Percentages", "Ratio", "Algebra Intro"
  ],
  science: [
    "Animals", "Plants", "Seasons", "Weather", "Body Parts",
    "Habitats", "Space", "Planets", "Water Cycle", "Insects",
    "Dinosaurs", "Electricity", "Magnets", "Light", "Sound",
    "Forces", "Simple Machines", "Environment", "Recycling", "Human Body",
    "Chemistry Basics", "Microbiology", "Geology", "Ocean Life", "Birds",
    "Mammals", "Reptiles", "Amphibians", "Fish", "Ecosystems"
  ],
  logic: [
    "Odd One Out", "Matching", "Memory", "Sorting", "Sequences",
    "Mazes", "Visual Puzzles", "Classification", "Cause & Effect", "Hidden Objects",
    "Pattern Completion", "Spatial Awareness", "Logic Grids", "Deduction", "Inference",
    "Problem Solving", "Critical Thinking", "Strategy", "Abstraction", "Analysis",
    "Synthesis", "Evaluation", "Creativity", "Lateral Thinking", "Decision Making",
    "Ethics", "Social Logic", "Emotional Intelligence", "Systems Thinking", "Meta-Cognitive"
  ]
};

const ICONS: string[] = ["Star", "Zap", "Target", "Brain", "Lightbulb", "Atom", "Calculator", "Compass", "Globe", "Microscope"];

export const getSkillTree = (subject: SubjectId): SkillNode[] => {
  const themes = SUBJECT_THEMES[subject];
  const nodes: SkillNode[] = [];

  themes.forEach((theme, index) => {
    const difficulty: Difficulty = 
      index < 7 ? "easy" : 
      index < 15 ? "medium" : 
      index < 23 ? "hard" : "expert";

    nodes.push({
      id: `${subject}-node-${index + 1}`,
      subject,
      title: theme,
      titleKey: `subjects.${subject}.nodes.${index + 1}`,
      icon: ICONS[index % ICONS.length],
      position: {
        x: 50 + Math.sin(index * 0.8) * 30, // Winding path
        y: index * 150 + 100
      },
      prerequisites: index === 0 ? [] : [`${subject}-node-${index}`],
      difficulty,
      totalStages: 10,
      completedStages: 0,
      isUnlocked: index === 0,
      isCompleted: false
    });
  });

  return nodes;
};

export const getStageInfo = (subject: SubjectId, level: number) => {
  // level is 1-300
  const nodeIndex = Math.floor((level - 1) / 10);
  const stageIndex = ((level - 1) % 10) + 1;
  const themes = SUBJECT_THEMES[subject];
  const theme = themes[nodeIndex] || themes[themes.length - 1];
  
  return {
    nodeId: `${subject}-node-${nodeIndex + 1}`,
    theme,
    stageIndex,
    difficulty: nodeIndex < 7 ? "easy" : nodeIndex < 15 ? "medium" : nodeIndex < 23 ? "hard" : "expert"
  };
};
