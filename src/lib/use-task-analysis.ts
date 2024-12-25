"use client"

import { useState, useEffect } from "react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface Task {
  title: string
  completed: boolean
  priority: "low" | "medium" | "high"
  createdAt: number
  completedAt?: number
  tags?: string[]
}

interface Analysis {
  productivityScore: number
  insights: string[]
  suggestedTags: string[]
  timeManagementScore: number
  prioritizationScore: number
}

const calculateBasicAnalysis = (tasks: Task[]): Analysis => {
  const completed = tasks.filter(t => t.completed)
  const productivityScore = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0
  
  const avgCompletionTime = completed.reduce((acc, task) => {
    return acc + (task.completedAt ? (task.completedAt - task.createdAt) : 0)
  }, 0) / (completed.length || 1)
  
  const timeManagementScore = Math.min(100, Math.round(100 - (avgCompletionTime / (24 * 60 * 60 * 1000)) * 10))
  
  const highPriorityCompleted = completed.filter(t => t.priority === "high").length
  const highPriorityTotal = tasks.filter(t => t.priority === "high").length
  const prioritizationScore = highPriorityTotal ? Math.round((highPriorityCompleted / highPriorityTotal) * 100) : 100

  return {
    productivityScore,
    insights: [
      `You've completed ${completed.length} out of ${tasks.length} tasks`,
      timeManagementScore > 70 ? "Great time management!" : "Try to complete tasks more quickly",
      prioritizationScore > 70 ? "Good priority management!" : "Focus on high-priority tasks",
    ],
    suggestedTags: Array.from(new Set(tasks.flatMap(t => t.tags || []))),
    timeManagementScore,
    prioritizationScore,
  }
}

export function useTaskAnalysis(tasks: Task[]) {
  const [analysis, setAnalysis] = useState<Analysis>(() => calculateBasicAnalysis(tasks))
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const analyzeTaskPatterns = async () => {
      if (tasks.length === 0) {
        setAnalysis(calculateBasicAnalysis([]))
        return
      }

      // First, update with basic analysis
      setAnalysis(calculateBasicAnalysis(tasks))

      try {
        const taskData = tasks.map(t => ({
          ...t,
          completionTime: t.completedAt ? t.completedAt - t.createdAt : null
        }))

        const { text } = await generateText({
          model: openai("gpt-3.5-turbo"),
          system: "You are an AI productivity analyst. Analyze task patterns and provide insights in JSON format.",
          prompt: `Analyze these tasks and provide scores and insights:
            ${JSON.stringify(taskData)}
            
            Return a JSON object with:
            - productivityScore (0-100)
            - insights (array of strings)
            - suggestedTags (array of strings)
            - timeManagementScore (0-100)
            - prioritizationScore (0-100)`
        })

        const aiAnalysis = JSON.parse(text)
        setAnalysis(aiAnalysis)
        
      } catch (error) {
        console.error("Error analyzing tasks:", error)
        setError(error as Error)
        // Keep using the basic analysis on error
        setAnalysis(calculateBasicAnalysis(tasks))
      }
    }

    analyzeTaskPatterns()
  }, [tasks]);

  useEffect(() => {
    if (error) {
      console.log("Task analysis error:", error);
    }
  }, [error]);

  return analysis
}

