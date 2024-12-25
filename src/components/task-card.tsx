"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Check,
  Clock,
  Trash2,
  GripVertical,
  TagIcon,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGestureControls } from "@/lib/use-gesture-controls";
import { useEffect, useRef, useState } from "react";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
    dueDate?: string;
    tags?: string[];
    createdAt: number;
    completedAt?: number;
  };
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
  isConnectedToNext?: boolean;
}

export function TaskCard({
  task,
  onComplete,
  onDelete,
  isConnectedToNext,
}: TaskCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { onGesture } = useGestureControls();
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(0, { damping: 20, stiffness: 300 });
  const rotateY = useSpring(0, { damping: 20, stiffness: 300 });
  const scale = useSpring(1);
  const progress = useSpring(task.completed ? 100 : 0);

  // Calculate time-based progress
  const timeProgress = task.completed
    ? 100
    : task.dueDate
    ? Math.min(
        100,
        ((new Date().getTime() - task.createdAt) /
          (new Date(task.dueDate).getTime() - task.createdAt)) *
          100
      )
    : 0;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const cleanup = onGesture(card, {
      onSwipeLeft: () => onDelete(task.id),
      onSwipeRight: () => onComplete(task.id),
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateXValue = (e.clientY - centerY) / 20;
      const rotateYValue = (centerX - e.clientX) / 20;

      rotateX.set(rotateXValue);
      rotateY.set(rotateYValue);
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      scale.set(1.02);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      rotateX.set(0);
      rotateY.set(0);
      scale.set(1);
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cleanup();
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    mouseX,
    mouseY,
    rotateX,
    rotateY,
    scale,
    onGesture,
    task.id,
    onDelete,
    onComplete,
  ]);

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        style={{
          rotateX,
          rotateY,
          scale,
        }}
        layout
        className={cn(
          "group relative h-24 perspective-1000 overflow-hidden rounded-2xl border border-white/10",
          "bg-gradient-to-br from-black/40 via-black/60 to-black/40",
          "transition-all duration-300 hover:border-white/20",
          task.completed && "opacity-50"
        )}
      >
        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-violet-500/50"
          style={{ width: useTransform(progress, (v) => `${v}%`) }}
        />

        {/* Time progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 bg-emerald-500/30"
          style={{ width: `${timeProgress}%` }}
        />

        {/* Animated gradient background */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                350px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.1),
                transparent 80%
              )
            `,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Neural network connection lines */}
        {isConnectedToNext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.5 : 0.2 }}
            className="absolute -bottom-4 left-0 right-0 z-10 flex justify-center"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 16 }}
              className="w-px bg-gradient-to-b from-violet-500/50 to-transparent"
            />
          </motion.div>
        )}

        <div className="relative flex h-full">
          {/* Priority indicator */}
          <div
            className={cn(
              "w-1",
              task.priority === "high" &&
                "bg-gradient-to-b from-rose-500 to-rose-600",
              task.priority === "medium" &&
                "bg-gradient-to-b from-amber-500 to-amber-600",
              task.priority === "low" &&
                "bg-gradient-to-b from-emerald-500 to-emerald-600"
            )}
          />

          <div className="flex flex-1 items-center gap-2 md:gap-4 p-3 md:p-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                onComplete(task.id);
              }}
              className={cn(
                "relative h-5 w-5 md:h-6 md:w-6 shrink-0 rounded-lg border-2 border-white/20",
                "transition-colors duration-300 hover:border-white/40",
                task.completed && "border-white/40 bg-white/20"
              )}
            >
              {task.completed && (
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </motion.button>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-medium text-sm md:text-base text-white transition-opacity duration-300 truncate",
                    task.completed && "line-through"
                  )}
                >
                  {task.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
                {task.dueDate && (
                  <div className="flex items-center gap-1 md:gap-1.5 text-white/40">
                    <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    <span>{task.dueDate}</span>
                  </div>
                )}

                {task.tags && task.tags.length > 0 && (
                  <div className="flex items-center gap-1 md:gap-1.5 text-white/40">
                    <TagIcon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/5 px-1.5 py-0.5 md:px-2 text-xs text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onDelete(task.id);
                }}
                className="rounded-lg p-1.5 md:p-2 text-white/40 transition-colors hover:bg-rose-500/20 hover:text-rose-400"
              >
                <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-grab text-white/20 hover:text-white/40 active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 md:h-5 md:w-5" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Gesture hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-y-0 left-2 flex items-center text-white/20"
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-y-0 right-2 flex items-center text-white/20"
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </>
  );
}
