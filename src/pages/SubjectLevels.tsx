import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/game/ProgressBar";
import { LevelPath } from "../components/game/LevelPath";
import { ArrowLeft, Trophy, Star, Lock, CheckCircle2, Play, Sparkles } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { useTranslation } from "react-i18next";
import { getSkillTree } from "../services/skillTreeService";
import { SkillNode, SubjectId, UserLevelProgress } from "../types";
import * as Icons from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

export const SubjectLevels = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { user } = useUserStore();
  const { t } = useTranslation();
  const [progress, setProgress] = useState<Record<string, UserLevelProgress>>({});
  const [loading, setLoading] = useState(true);

  const NODES = useMemo(() => {
    if (!subjectId) return [];
    return getSkillTree(subjectId as SubjectId);
  }, [subjectId]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || !subjectId) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, `users/${user.uid}/progress`),
          where("subjectId", "==", subjectId)
        );
        const snapshot = await getDocs(q);
        const progressData: Record<string, UserLevelProgress> = {};
        snapshot.docs.forEach(doc => {
          progressData[doc.id] = doc.data() as UserLevelProgress;
        });
        setProgress(progressData);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/progress`);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, subjectId]);

  const isCompleted = (levelId: string) => progress[levelId]?.completed;

  const subjectName = t(`subjects.${subjectId}.name`, { defaultValue: subjectId });
  
  const nodesWithProgress = useMemo(() => {
    return NODES.map((node, index) => {
      let completedInNode = 0;
      for (let i = 1; i <= 10; i++) {
        if (isCompleted(`${subjectId}-${(index * 10) + i}`)) {
          completedInNode++;
        }
      }
      
      // A node is unlocked if it's the first node OR the previous node has at least one level completed
      const isUnlocked = index === 0 || (index > 0 && Array.from({length: 10}, (_, i) => isCompleted(`${subjectId}-${((index - 1) * 10) + i + 1}`)).some(c => c));

      return {
        ...node,
        completedStages: completedInNode,
        isUnlocked,
        isCompleted: completedInNode === 10
      };
    });
  }, [NODES, progress, subjectId]);

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const overallProgress = (completedCount / 300) * 100;

  const scrollToCurrent = () => {
    const nextNodeIndex = nodesWithProgress.findIndex(n => !n.isCompleted);
    const targetNode = nextNodeIndex !== -1 ? nodesWithProgress[nextNodeIndex] : nodesWithProgress[nodesWithProgress.length - 1];
    window.scrollTo({
      top: targetNode.position.y - window.innerHeight / 2,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-24 transition-colors">
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-6 py-4 flex items-center justify-between mx-4 mt-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="rounded-full w-12 h-12 p-0 dark:hover:bg-slate-800">
              <ArrowLeft className="w-6 h-6 dark:text-white" />
            </Button>
          </Link>
          <h1 className="text-2xl font-black dark:text-white">{subjectName} Tree</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={scrollToCurrent}
            className="hidden md:flex rounded-full border-2 border-brand-blue text-brand-blue font-bold hover:bg-brand-blue hover:text-white transition-all"
          >
            <Trophy className="w-4 h-4 mr-2" />
            {t('common.current_level', { defaultValue: 'Current Level' })}
          </Button>
          <div className="w-32 md:w-48">
            <ProgressBar progress={overallProgress} color="bg-brand-blue" />
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto mt-12 px-6">
        <LevelPath 
          levels={nodesWithProgress.map(node => ({
            position: node.position
          }))} 
        />
        
        <div className="relative h-[5000px]">
          {nodesWithProgress.map((node, index) => {
            const IconComponent = (Icons as any)[node.icon] || Icons.Star;
            const currentLevelInNode = node.completedStages + 1;
            const targetLevelId = node.isCompleted 
              ? `${subjectId}-${(index * 10) + 1}` // Replay from start of node
              : `${subjectId}-${(index * 10) + Math.min(currentLevelInNode, 10)}`;

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}px`,
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <Link 
                    to={node.isUnlocked ? `/quiz/${targetLevelId}` : '#'}
                    className={cn(
                      "group relative flex items-center justify-center w-28 h-28 rounded-[2.5rem] border-4 transition-all duration-300 shadow-2xl",
                      node.isCompleted ? "bg-yellow-400 border-yellow-500 scale-110" :
                      node.isUnlocked ? "bg-brand-blue border-brand-blue scale-110 hover:scale-125" :
                      "bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-not-allowed grayscale"
                    )}
                  >
                    <IconComponent className={cn(
                      "w-12 h-12",
                      node.isCompleted || node.isUnlocked ? "text-white" : "text-slate-400"
                    )} />
                    
                    {node.isUnlocked && !node.isCompleted && (
                      <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full animate-bounce shadow-lg border-2 border-white">
                        {node.completedStages}/10
                      </div>
                    )}

                    {!node.isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-[2.5rem]">
                        <Lock className="w-8 h-8 text-slate-400" />
                      </div>
                    )}

                    {node.isCompleted && (
                      <div className="absolute -bottom-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-xl border-2 border-white">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    )}
                  </Link>
                  
                  <div className="text-center max-w-[150px]">
                    <h3 className={cn(
                      "font-black text-sm uppercase tracking-widest leading-tight",
                      node.isUnlocked ? "text-slate-800 dark:text-white" : "text-slate-400"
                    )}>
                      {node.title}
                    </h3>
                    <div className="flex justify-center gap-1 mt-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(node.completedStages / 3.3) ? "fill-yellow-400 text-yellow-400" : "text-slate-200 dark:text-slate-800"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Floating Action Button for PvP */}
      <div className="fixed bottom-8 left-8 z-50">
        <Link to="/battle">
          <Button variant="secondary" size="lg" className="rounded-full shadow-2xl px-8 bg-brand-purple text-white hover:bg-brand-purple/90 border-b-4 border-purple-800">
            <Sparkles className="w-6 h-6" />
            {t('nav.battle')}
          </Button>
        </Link>
      </div>
    </div>
  );
};
