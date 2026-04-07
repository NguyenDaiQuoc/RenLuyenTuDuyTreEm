import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUserStore } from "../store/useUserStore";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Brain, Activity, TrendingUp, Star, Loader2, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";

const socket = io();

export const Analytics = () => {
  const { user } = useUserStore();
  const [events, setEvents] = useState<any[]>([]);
  const [report, setReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Fetch initial events
    fetch(`/api/analytics/event?userId=${user.uid}`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));

    socket.on("analytics_event", (event) => {
      if (event.userId === user.uid) {
        setEvents(prev => [event, ...prev.slice(0, 49)]);
      }
    });

    return () => {
      socket.off("analytics_event");
    };
  }, [user]);

  const generateReport = async () => {
    if (!user) return;
    setLoadingReport(true);
    try {
      const res = await fetch(`/api/reports/${user.uid}`);
      const data = await res.json();
      setReport(data.report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <header className="space-y-2">
        <h1 className="text-5xl font-black dark:text-white flex items-center gap-4">
          <Activity className="w-12 h-12 text-brand-blue" />
          Real-time Analytics
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400">
          Track your child's cognitive growth in real-time.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Live Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-black dark:text-white flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-green-500" />
            Live Activity Feed
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            <AnimatePresence initial={false}>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4"
                >
                  <div className="p-3 bg-brand-blue/10 rounded-xl">
                    <Star className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">
                      {event.type.replace(/_/g, " ")}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-400">
                    {event.data ? JSON.parse(event.data).subject : ""}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {events.length === 0 && (
              <div className="text-center py-12 text-slate-400 font-bold italic">
                No activity yet. Start learning to see data!
              </div>
            )}
          </div>
        </div>

        {/* AI Parent Report */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black dark:text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-brand-purple" />
            AI Parent Report
          </h2>
          <Card className="p-8 space-y-6 border-2 border-brand-purple/20 bg-white dark:bg-slate-900">
            {!report ? (
              <div className="text-center space-y-6">
                <div className="bg-brand-purple/10 p-6 rounded-3xl inline-block">
                  <Brain className="w-16 h-16 text-brand-purple" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Generate a deep-dive analysis of your child's learning patterns using Gemini AI.
                </p>
                <Button 
                  onClick={generateReport} 
                  disabled={loadingReport}
                  className="w-full py-6 text-xl font-black bg-brand-purple hover:bg-brand-purple/90 text-white rounded-2xl shadow-xl"
                >
                  {loadingReport ? <Loader2 className="w-6 h-6 animate-spin" /> : "Generate Report"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                  <ReactMarkdown>{report}</ReactMarkdown>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setReport(null)}
                  className="w-full py-4 text-slate-500"
                >
                  Generate New Report
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
