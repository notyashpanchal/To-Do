"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { AddTask } from "@/components/add-tasks";
import { TaskCard } from "@/components/task-card";
import { NeuralBackground } from "@/components/neural-background";
import { ProductivityInsights } from "@/components/productivity-insight";
import { AIInsights } from "@/components/ai-insight";
import { TaskSuggestions } from "@/components/task-suggestions";
import { Brain, Command, Sparkles } from "lucide-react";
import { useKeyboardShortcuts } from "@/lib/use-keyboard-shortcuts";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
  createdAt: number;
  completedAt?: number;
}

const suggestions = [
  "Complete project presentation",
  "Review team updates",
  "Schedule weekly meeting",
  "Update documentation",
  "Send progress report",
];

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState("");
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const mouseY = useMotionValue(0);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    "Ctrl+K": () => setShowKeyboardShortcuts(true),
    "Ctrl+N": () =>
      document.querySelector<HTMLInputElement>('input[type="text"]')?.focus(),
    "Ctrl+/": () => setShowKeyboardShortcuts(true),
    Escape: () => setShowKeyboardShortcuts(false),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newSuggestion =
        suggestions[Math.floor(Math.random() * suggestions.length)];
      setSuggestion(newSuggestion);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(`/api/todos`);
      const responseData = await response.text();
      if (!response.ok) {
        throw new Error(responseData || "Failed to fetch tasks");
      }
      const data = responseData ? JSON.parse(responseData) : {};
      setTasks(Array.isArray(data.todos) ? data.todos : []);
    };

    fetchTasks();
  }, []);

  const addTask = (
    taskData: Omit<Task, "id" | "completed" | "createdAt" | "completedAt">
  ) => {
    // Add validation to prevent empty todos
    if (!taskData.title || taskData.title.trim() === " ") {
      console.error("Cannot add an empty todo.");
      return; // Exit the function if the title is empty
    }

    setTasks([
      {
        id: Math.random().toString(36).slice(2),
        completed: false,
        createdAt: Date.now(),
        ...taskData,
      },
      ...tasks,
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? Date.now() : undefined,
            }
          : task
      )
    );
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}/deleteTodo`, {
        method: "DELETE",
      });

      // Log the response for debugging
      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to delete todo");
      }

      console.log(`Todo with ID ${id} deleted.`);

      // Update the tasks state immediately
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      // Optionally show an error message to the user
    }
  };

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        const matchesStatus =
          filter === "all"
            ? true
            : filter === "active"
            ? !task.completed
            : task.completed;

        const matchesTags =
          selectedTags.length === 0
            ? true
            : task.tags?.some((tag) => selectedTags.includes(tag));

        return matchesStatus && matchesTags;
      })
    : [];

  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags || [])));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F] text-white">
      <NeuralBackground />

      <div className="mx-auto max-w-6xl p-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 md:gap-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 10 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Brain className="h-8 w-8 text-violet-400" />
                </motion.div>
                <h1 className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-3xl font-bold text-transparent">
                  ToDo
                </h1>
                <Sparkles className="h-5 w-5 text-violet-400" />
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span>Press</span>
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-medium text-white/70">
                  Ctrl
                </kbd>
                <span>+</span>
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-medium text-white/70">
                  /
                </kbd>
                <span>for keyboard shortcuts</span>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-hidden overflow-y-hidden pb-2 md:pb-0">
              {(["all", "active", "completed"] as const).map((f) => (
                <motion.button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                  }}
                  className={`group relative overflow-hidden rounded-xl px-3 py-1 text-sm transition-colors ${
                    filter === f
                      ? "text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter === f && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-white/10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative">
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <ProductivityInsights tasks={tasks} />
              <AddTask onAdd={addTask} />
              <TaskSuggestions
                tasks={tasks}
                onAddSuggestion={(suggestion) => {
                  addTask(suggestion);
                }}
              />
            </div>

            <div className="space-y-6">
              <AIInsights
                tasks={tasks}
                onSuggestedTagClick={(tag) => {
                  if (!selectedTags.includes(tag)) {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
              />
            </div>
          </div>

          {allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {allTags.map((tag) => (
                <motion.button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(
                      selectedTags.includes(tag)
                        ? selectedTags.filter((t) => t !== tag)
                        : [...selectedTags, tag]
                    );
                  }}
                  className={`relative overflow-hidden rounded-full px-3 py-1 text-sm transition-all ${
                    selectedTags.includes(tag)
                      ? "text-violet-300"
                      : "text-white/60 hover:text-white/80"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedTags.includes(tag) && (
                    <motion.div
                      layoutId="activeTag"
                      className="absolute inset-0 bg-violet-500/20"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative">{tag}</span>
                </motion.button>
              ))}
              {selectedTags.length > 0 && (
                <motion.button
                  onClick={() => {
                    setSelectedTags([]);
                  }}
                  className="rounded-full px-3 py-1 text-sm text-white/40 hover:text-white/60"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear filters
                </motion.button>
              )}
            </motion.div>
          )}

          <motion.div
            layout
            className="mt-8 space-y-4"
            onMouseMove={(e) => mouseY.set(e.clientY)}
          >
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onComplete={toggleTask}
                  onDelete={deleteTask}
                  isConnectedToNext={index < filteredTasks.length - 1}
                />
              ))}
            </AnimatePresence>

            {filteredTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-12"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-indigo-600/10" />
                <p className="relative text-center text-white/30">
                  {tasks.length === 0
                    ? "No tasks yet. Add one above."
                    : "No tasks match the current filters."}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Keyboard shortcuts modal */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Command className="h-5 w-5 text-violet-400" />
                  <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={() => setShowKeyboardShortcuts(false)}
                  className="rounded p-1 text-white/40 hover:text-white/60"
                >
                  <span className="sr-only">Close</span>✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">New task</span>
                    <div className="flex gap-1">
                      <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-medium text-white/70">
                        Ctrl
                      </kbd>
                      <span className="text-white/40">+</span>
                      <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-medium text-white/70">
                        N
                      </kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Show shortcuts</span>
                    <div className="flex gap-1">
                      <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-medium text-white/70">
                        Ctrl
                      </kbd>
                      <span className="text-white/40">+</span>
                      <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-medium text-white/70">
                        /
                      </kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Close dialogs</span>
                    <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-medium text-white/70">
                      Esc
                    </kbd>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
