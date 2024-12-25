"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
interface AddTaskProps {
  onAdd: (task: {
    title: string;
    priority: "low" | "medium" | "high";
    dueDate?: string;
    tags?: string[];
  }) => void;
}

export function AddTask({ onAdd }: AddTaskProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState<Date>();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`api/createTodo`, {
        title,
        priority,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
        tags,
      });
      if (response.status !== 201) {
        throw new Error("Failed to create todo");
      }
      onAdd({
        title,
        priority,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
        tags,
      });
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <motion.div layout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative flex">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="w-full rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-12"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add task</span>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <Select
                  value={priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setPriority(value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[140px] rounded-2xl bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dueDate ? dueDate.toLocaleDateString() : "Due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <div className="flex-1">
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      type="text"
                      placeholder="Add tags... (press Enter)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={addTag}
                      className="pl-10 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-sm text-white/60"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-white/40 hover:text-white/60"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {tag} tag</span>
                        </button>
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
