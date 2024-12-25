"use client";

import { motion } from "framer-motion";
import { Brain, Lightbulb, Sparkles, Zap } from "lucide-react";
import { useTaskAnalysis } from "@/lib/use-task-analysis";

interface Task {
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: number;
  completedAt?: number;
  tags?: string[];
}

interface AIInsightsProps {
  tasks: Task[];
  onSuggestedTagClickAction: (tag: string) => void;
}

export function AIInsights({
  tasks,
  onSuggestedTagClickAction,
}: AIInsightsProps) {
  const analysis = useTaskAnalysis(tasks);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-black/20 p-4 md:p-6 backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center gap-2">
        <Brain className="h-5 w-5 text-violet-400" />
        <h2 className="text-lg font-semibold text-white">AI Insights</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scores */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Productivity Score</span>
              <span className="font-medium text-white">
                {analysis.productivityScore}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${analysis.productivityScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Time Management</span>
              <span className="font-medium text-white">
                {analysis.timeManagementScore}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${analysis.timeManagementScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Task Prioritization</span>
              <span className="font-medium text-white">
                {analysis.prioritizationScore}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${analysis.prioritizationScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Insights and Suggestions */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Lightbulb className="h-4 w-4" />
              <span>Key Insights</span>
            </div>
            <ul className="space-y-2 text-sm">
              {analysis.insights.map((insight, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-white/80"
                >
                  <Zap className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>{insight}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {analysis.suggestedTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Sparkles className="h-4 w-4" />
                <span>Suggested Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.suggestedTags.map((tag, index) => (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onSuggestedTagClickAction(tag)}
                    className="rounded-full bg-white/5 px-3 py-1 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
