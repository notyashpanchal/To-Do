"use client";

import { motion } from "framer-motion";
import { LineChart, Activity, TrendingUp, Clock } from "lucide-react";

interface Task {
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

interface ProductivityInsightsProps {
  tasks: Task[];
}

export function ProductivityInsights({ tasks }: ProductivityInsightsProps) {
  const today = new Date().setHours(0, 0, 0, 0);
  const todayTasks = tasks.filter(
    (task) => new Date(task.createdAt).setHours(0, 0, 0, 0) === today
  );

  const completionRate = tasks.length
    ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
    : 0;

  const averageCompletionTime =
    tasks
      .filter((t) => t.completed && t.completedAt)
      .reduce((acc, task) => acc + (task.completedAt! - task.createdAt), 0) /
    tasks.filter((t) => t.completed).length;

  const productivityScore = Math.min(
    100,
    Math.round(
      (completionRate +
        todayTasks.filter((t) => t.completed).length * 20 +
        (averageCompletionTime < 86400000 ? 20 : 0)) /
        1.4
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative">
          <Activity className="mb-2 h-5 w-5 text-violet-400" />
          <div className="text-2xl font-bold">{productivityScore}%</div>
          <div className="text-sm text-white/60">Productivity</div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative">
          <TrendingUp className="mb-2 h-5 w-5 text-emerald-400" />
          <div className="text-2xl font-bold">{completionRate}%</div>
          <div className="text-sm text-white/60">Completion Rate</div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative">
          <LineChart className="mb-2 h-5 w-5 text-amber-400" />
          <div className="text-2xl font-bold">{todayTasks.length}</div>
          <div className="text-sm text-white/60">Tasks Today</div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative">
          <Clock className="mb-2 h-5 w-5 text-rose-400" />
          <div className="text-2xl font-bold">
            {averageCompletionTime
              ? Math.round(averageCompletionTime / 3600000)
              : 0}
            h
          </div>
          <div className="text-sm text-white/60">Avg. Completion</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
