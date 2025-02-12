"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlusIcon, CheckIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Task {
  id: string
  text: string
  completed: boolean
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }])
      setNewTask("")
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    return true
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <form onSubmit={addTask} className="flex mb-4">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="flex-grow mr-2"
        />
        <Button type="submit">
          <PlusIcon className="h-5 w-5" />
          Add
        </Button>
      </form>

      <div className="flex justify-center space-x-2 mb-4">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "completed" ? "default" : "outline"} onClick={() => setFilter("completed")}>
          Completed
        </Button>
        <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
          Pending
        </Button>
      </div>

      <AnimatePresence>
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-2"
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTask(task.id)}
                className={`mr-2 ${task.completed ? "text-green-500" : "text-gray-400"}`}
              >
                <CheckIcon className="h-5 w-5" />
              </Button>
              <span className={`${task.completed ? "line-through text-gray-500" : "text-gray-800 dark:text-white"}`}>
                {task.text}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

