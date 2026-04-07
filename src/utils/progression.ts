import { UserProfile, DailyQuest } from "../types";

/**
 * Formula: xpToNextLevel(level) = 100 * level^1.5
 */
export const getXPForNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

export interface XPResult {
  newXP: number;
  newLevel: number;
  newTotalXP: number;
  leveledUp: boolean;
  xpGained: number;
}

export interface XPBonus {
  perfectScore?: boolean; // +50%
  speedBonus?: boolean;   // +20%
  streakBonus?: number;    // +10% per day (days)
  firstWinOfDay?: boolean; // x2
}

export const calculateXP = (baseXP: number, bonuses: XPBonus): number => {
  let multiplier = 1.0;

  if (bonuses.perfectScore) multiplier += 0.5;
  if (bonuses.speedBonus) multiplier += 0.2;
  if (bonuses.streakBonus) multiplier += bonuses.streakBonus * 0.1;
  
  let totalXP = baseXP * multiplier;
  
  if (bonuses.firstWinOfDay) totalXP *= 2;

  return Math.floor(totalXP);
};

export const getStreakReward = (streak: number): number => {
  if (streak % 30 === 0) return 1000; // Monthly reward
  if (streak % 7 === 0) return 250;   // Weekly reward
  if (streak % 3 === 0) return 100;   // 3-day reward
  return 0;
};

export const calculateStars = (score: number, totalQuestions: number): number => {
  const percentage = (score / totalQuestions) * 100;
  if (percentage >= 100) return 3;
  if (percentage >= 70) return 2;
  if (percentage >= 40) return 1;
  return 0;
};

export const generateDailyQuests = (): DailyQuest[] => {
  return [
    {
      id: 'quest-1',
      title: 'Earn 200 XP',
      titleKey: 'quests.xp_title',
      type: 'xp',
      target: 200,
      current: 0,
      completed: false,
      xpReward: 50
    },
    {
      id: 'quest-2',
      title: 'Complete 2 Lessons',
      titleKey: 'quests.lesson_title',
      type: 'lesson',
      target: 2,
      current: 0,
      completed: false,
      xpReward: 100
    },
    {
      id: 'quest-3',
      title: 'Maintain 3-day Streak',
      titleKey: 'quests.streak_title',
      type: 'streak',
      target: 3,
      current: 0,
      completed: false,
      xpReward: 150
    }
  ];
};

export const processXPUpdate = (user: UserProfile, xpGained: number): XPResult => {
  let currentXP = user.xp + xpGained;
  let currentLevel = user.level;
  let leveledUp = false;

  while (currentXP >= getXPForNextLevel(currentLevel)) {
    currentXP -= getXPForNextLevel(currentLevel);
    currentLevel++;
    leveledUp = true;
  }

  return {
    newXP: currentXP,
    newLevel: currentLevel,
    newTotalXP: user.totalXP + xpGained,
    leveledUp,
    xpGained
  };
};

export const checkStreak = (lastActive: string): { newStreak: number; reset: boolean } => {
  if (!lastActive) return { newStreak: 1, reset: false };

  const last = new Date(lastActive);
  const now = new Date();
  
  // Reset time to midnight for comparison
  last.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { newStreak: 0, reset: false }; // Already active today
  } else if (diffDays === 1) {
    return { newStreak: 1, reset: false }; // Increment streak
  } else {
    return { newStreak: 1, reset: true }; // Reset streak
  }
};
