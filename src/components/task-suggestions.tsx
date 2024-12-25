"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { useAiSuggestions } from "@/lib/use-ai-suggestions";
import React, { useState } from "react";

interface Task {
  title: string;
  tags?: string[];
  priority: "low" | "medium" | "high";
}

interface TaskSuggestionsProps {
  tasks: Task[];
  onAddSuggestion: (task: Task) => void;
}

export function TaskSuggestions({
  tasks,
  onAddSuggestion,
}: TaskSuggestionsProps) {
  const { suggestions: aiSuggestions, isLoading } = useAiSuggestions(tasks);
  const [suggestions, setSuggestions] = useState(aiSuggestions);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center py-4"
        >
          <Loader2 className="h-5 w-5 animate-spin text-white/40" />
        </motion.div>
      ) : (
        suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-2"
          >
            <h3 className="text-sm font-medium text-white/60">
              AI-Suggested Tasks
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.title}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => {
                      setSuggestions((prev) =>
                        prev.filter((s) => s.title !== suggestion.title)
                      );
                      onAddSuggestion(suggestion);
                    }}
                    className="group relative flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-colors hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-white">
                        {suggestion.title}
                      </p>
                      {suggestion.tags && (
                        <div className="flex flex-wrap gap-1">
                          {suggestion.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 rounded-lg border border-white/20 p-1 text-white/40 transition-colors group-hover:border-white/40 group-hover:text-white/60">
                      <Plus className="h-4 w-4" />
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
}
