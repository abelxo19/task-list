'use client'

import { TaskList } from "../components/TaskList"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }
  return (
   <main className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white blur-in-animation">Task List</h1>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <TaskList />
      </div>
    </main>
  );
}
