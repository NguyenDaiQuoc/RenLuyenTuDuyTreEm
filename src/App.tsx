import { useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { useUserStore } from './store/useUserStore';
import { UserProfile } from './types';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SubjectLevels } from './pages/SubjectLevels';
import { Quiz } from './pages/Quiz';
import { CreativeLab } from './pages/CreativeLab';
import { Leaderboard } from './pages/Leaderboard';
import { Battle } from './pages/Battle';
import { AIGenerator } from './pages/AIGenerator';
import { Premium } from './pages/Premium';
import { Analytics } from './pages/Analytics';
import { Navbar } from './components/layout/Navbar';

import { GeminiChatbot } from './components/ai/GeminiChatbot';

import { useThemeStore } from './store/useThemeStore';
import { checkStreak, getStreakReward } from './utils/progression';

export default function App() {
  const { user, setUser, setLoading } = useUserStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          const { newStreak, reset } = checkStreak(userData.lastActive);
          const streakReward = newStreak > 0 ? getStreakReward(userData.streak + 1) : 0;
          
          const now = new Date();
          const lastReset = new Date(userData.lastExerciseReset || 0);
          const isNewDay = now.toDateString() !== lastReset.toDateString();

          const updatedUser: UserProfile = {
            ...userData,
            streak: reset ? 1 : (newStreak > 0 ? userData.streak + 1 : userData.streak),
            xp: userData.xp + streakReward,
            totalXP: userData.totalXP + streakReward,
            lastActive: now.toISOString(),
            dailyQuests: userData.dailyQuests || [],
            unlockedLevels: userData.unlockedLevels || [],
            
            // Daily Resets
            hearts: isNewDay ? (userData.isPremium ? 999 : 5) : (userData.hearts ?? 5),
            dailyExercisesCount: isNewDay ? 0 : (userData.dailyExercisesCount ?? 0),
            lastExerciseReset: isNewDay ? now.toISOString() : (userData.lastExerciseReset || now.toISOString()),
            lastHeartRefill: userData.lastHeartRefill || now.toISOString(),
            isPremium: userData.isPremium ?? false,
            ownedSkins: userData.ownedSkins || [],
            pet: userData.pet || {
              name: 'Buddy',
              type: 'dragon',
              level: 1,
              xp: 0,
              lastFed: now.toISOString()
            }
          };

          if (newStreak > 0 || reset || streakReward > 0 || isNewDay) {
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              streak: updatedUser.streak,
              xp: updatedUser.xp,
              totalXP: updatedUser.totalXP,
              lastActive: updatedUser.lastActive,
              dailyQuests: updatedUser.dailyQuests,
              unlockedLevels: updatedUser.unlockedLevels,
              hearts: updatedUser.hearts,
              dailyExercisesCount: updatedUser.dailyExercisesCount,
              lastExerciseReset: updatedUser.lastExerciseReset,
              isPremium: updatedUser.isPremium,
              pet: updatedUser.pet
            }, { merge: true });
          }

          setUser(updatedUser);
        } else {
          const now = new Date().toISOString();
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            username: firebaseUser.displayName || 'Little Explorer',
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
            xp: 0,
            level: 1,
            totalXP: 0,
            streak: 1,
            lastActive: now,
            dailyQuests: [
              { id: 'q1', title: 'Complete 3 exercises', type: 'lesson', target: 3, current: 0, xpReward: 20, completed: false },
              { id: 'q2', title: 'Win 1 battle', type: 'battle', target: 1, current: 0, xpReward: 30, completed: false },
              { id: 'q3', title: 'Earn 100 XP', type: 'xp', target: 100, current: 0, xpReward: 50, completed: false }
            ],
            unlockedLevels: ['math-1', 'science-1', 'logic-1'],
            badges: [],
            role: 'user',
            createdAt: now,
            isPremium: false,
            hearts: 5,
            lastHeartRefill: now,
            dailyExercisesCount: 0,
            lastExerciseReset: now,
            ownedSkins: [],
            pet: {
              name: 'Buddy',
              type: 'dragon',
              level: 1,
              xp: 0,
              lastFed: now
            }
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...newUser,
            createdAt: serverTimestamp(),
          });
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors">
        {user && <Navbar />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/subject/:subjectId" element={user ? <SubjectLevels /> : <Navigate to="/login" />} />
            <Route path="/quiz/:levelId" element={user ? <Quiz /> : <Navigate to="/login" />} />
            <Route path="/creative-lab" element={user ? <CreativeLab /> : <Navigate to="/login" />} />
            <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
            <Route path="/battle" element={user ? <Battle /> : <Navigate to="/login" />} />
            <Route path="/ai-generator" element={user ? <AIGenerator /> : <Navigate to="/login" />} />
            <Route path="/premium" element={user ? <Premium /> : <Navigate to="/login" />} />
            <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        {user && <GeminiChatbot />}
      </div>
    </Router>
  );
}

