"use client"

import { useState, useEffect } from "react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface Task {
  title: string
  tags?: string[]
  priority: "low" | "medium" | "high"
}

const fallbackSuggestions: Task[] = [
  {
    title: "Review project timeline",
    priority: "high",
    tags: ["planning", "review"]
  },
  {
    title: "Update team documentation",
    priority: "medium",
    tags: ["documentation"]
  },
  {
    title: "Schedule weekly sync",
    priority: "low",
    tags: ["meeting"]
  }
]

export function useAiSuggestions(tasks: Task[]) {
  const [suggestions, setSuggestions] = useState<Task[]>(fallbackSuggestions)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const generateSuggestions = async () => {
      if (tasks.length === 0) {
        setSuggestions(fallbackSuggestions)
        return
      }

      setIsLoading(true)
      try {
        const taskContext = tasks
          .map(t => `${t.title} (${t.priority}${t.tags ? ` - ${t.tags.join(", ")}` : ""})`)
          .join("\n")

        const { text } = await generateText({
          model: openai("gpt-3.5-turbo-instruct"),
          system: "You are an AI task assistant. Based on the user's existing tasks, suggest 3 relevant follow-up tasks in a structured format: title|||priority|||tags (comma-separated). Each task on a new line.",
          prompt: `Based on these tasks:\n${taskContext}\n\nSuggest 3 relevant follow-up tasks that would help complete the project or achieve the goals implied by the existing tasks.`,
        })

        const newSuggestions = text.split("\n").map(suggestion => {
          const [title, priority, tagString] = suggestion.split("|||")
          return {
            title,
            priority: priority as "low" | "medium" | "high",
            tags: tagString ? tagString.split(",").map(t => t.trim()) : undefined
          }
        })

        setSuggestions(newSuggestions)
      } catch (error) {
        console.error("Error generating suggestions:", error)
        setError(error as Error)
        // Fall back to basic suggestions on error
        setSuggestions(fallbackSuggestions)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setInterval(generateSuggestions, 30000) // Refresh every 30 seconds
    generateSuggestions() // Initial generation

    return () => clearInterval(timer)
  }, [tasks])

  return { suggestions, isLoading, error }
}
