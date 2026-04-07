import { create } from 'zustand';
import { UserProfile, DailyQuest } from '../types';
import { processXPUpdate } from '../utils/progression';

interface UserState {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  updateXP: (amount: number) => void;
  updateQuests: (type: DailyQuest['type'], amount: number) => void;
  unlockLevel: (levelId: string) => void;
  consumeHeart: () => boolean;
  incrementExerciseCount: () => void;
  updatePetXP: (amount: number) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  consumeHeart: () => {
    const { user } = get();
    if (!user) return false;
    if (user.isPremium) return true;
    if (user.hearts <= 0) return false;
    
    set((state) => ({
      user: state.user ? { ...state.user, hearts: state.user.hearts - 1 } : null
    }));
    return true;
  },
  incrementExerciseCount: () => set((state) => {
    if (!state.user) return state;
    return {
      user: { ...state.user, dailyExercisesCount: (state.user.dailyExercisesCount || 0) + 1 }
    };
  }),
  updatePetXP: (amount) => set((state) => {
    if (!state.user) return state;
    const pet = state.user.pet;
    let newXP = pet.xp + amount;
    let newLevel = pet.level;
    const xpToNext = pet.level * 100;
    
    if (newXP >= xpToNext) {
      newXP -= xpToNext;
      newLevel += 1;
    }
    
    return {
      user: {
        ...state.user,
        pet: { ...pet, xp: newXP, level: newLevel }
      }
    };
  }),
  updateXP: (amount) => set((state) => {
    if (!state.user) return state;
    const result = processXPUpdate(state.user, amount);
    
    // Also update XP quest if exists
    const updatedQuests = state.user.dailyQuests.map(q => {
      if (q.type === 'xp' && !q.completed) {
        const newCurrent = q.current + amount;
        return {
          ...q,
          current: newCurrent,
          completed: newCurrent >= q.target
        };
      }
      return q;
    });

    return {
      user: {
        ...state.user,
        xp: result.newXP,
        level: result.newLevel,
        totalXP: result.newTotalXP,
        dailyQuests: updatedQuests
      }
    };
  }),
  updateQuests: (type, amount) => set((state) => {
    if (!state.user) return state;
    const updatedQuests = state.user.dailyQuests.map(q => {
      if (q.type === type && !q.completed) {
        const newCurrent = q.current + amount;
        return {
          ...q,
          current: newCurrent,
          completed: newCurrent >= q.target
        };
      }
      return q;
    });
    return { user: { ...state.user, dailyQuests: updatedQuests } };
  }),
  unlockLevel: (levelId) => set((state) => {
    if (!state.user || state.user.unlockedLevels.includes(levelId)) return state;
    return { user: { ...state.user, unlockedLevels: [...state.user.unlockedLevels, levelId] } };
  }),
}));
