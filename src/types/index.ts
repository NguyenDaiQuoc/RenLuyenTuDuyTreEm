export type SubjectId = "math" | "science" | "logic";
export type Difficulty = "easy" | "medium" | "hard" | "expert";

export type MathExerciseType = 
  | "counting" 
  | "pattern" 
  | "arithmetic" 
  | "comparison" 
  | "sequence" 
  | "puzzle" 
  | "word-problem" 
  | "shape";

export type ScienceExerciseType = 
  | "identification" 
  | "habitat" 
  | "cause-effect" 
  | "experiment" 
  | "body-parts" 
  | "weather" 
  | "food-chain";

export type LogicExerciseType = 
  | "pattern-puzzle" 
  | "odd-one-out" 
  | "memory" 
  | "visual-reasoning" 
  | "maze" 
  | "classification" 
  | "problem-solving";

export type ExerciseType = MathExerciseType | ScienceExerciseType | LogicExerciseType;

export type InteractionType = "multiple-choice" | "drag-drop" | "match" | "puzzle";

export interface Stage {
  id: string;
  nodeId: string;
  subject: SubjectId;
  level: number; // Stage index within the node (1-10)
  difficulty: Difficulty;
  type: ExerciseType;
  interactionType: InteractionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  xpReward: number;
  imageUrl?: string;
  gameData?: any;
}

export interface SkillNode {
  id: string;
  subject: SubjectId;
  title: string;
  titleKey: string;
  icon: string;
  position: { x: number; y: number };
  prerequisites: string[];
  difficulty: Difficulty;
  totalStages: number;
  completedStages: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  titleKey?: string;
  type: 'xp' | 'lesson' | 'streak' | 'battle';
  target: number;
  current: number;
  completed: boolean;
  xpReward: number;
}

export interface UserLevelProgress {
  levelId: string;
  subjectId: string;
  completed: boolean;
  stars: number; // 0-3
  bestScore: number;
  unlocked: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  totalXP: number;
  streak: number;
  lastActive: string;
  badges: string[];
  role: 'user' | 'admin';
  createdAt: string;
  dailyQuests: DailyQuest[];
  unlockedLevels: string[]; // List of level IDs
  
  // Monetization & Retention
  isPremium: boolean;
  hearts: number;
  lastHeartRefill: string;
  dailyExercisesCount: number;
  lastExerciseReset: string;
  
  // Gamification
  activeSkin?: string;
  ownedSkins: string[];
  pet: {
    name: string;
    type: 'dragon' | 'unicorn' | 'robot';
    level: number;
    xp: number;
    lastFed: string;
  };
}

export type LegacyExerciseType = 'logic' | 'visual' | 'memory' | 'problem-solving' | 'creative';

export interface Exercise {
  id: string;
  type: LegacyExerciseType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: string;
  options?: string[];
  answer?: string;
  explanation: string;
  xpReward: number;
  imageUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface Level {
  id: string;
  subjectId: string;
  order: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Question {
  id: string;
  levelId: string;
  type: 'multiple-choice' | 'matching' | 'sorting';
  prompt: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Attempt {
  id: string;
  userId: string;
  levelId: string;
  score: number;
  xpEarned: number;
  completedAt: string;
}
