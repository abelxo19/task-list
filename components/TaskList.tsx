"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { PlusIcon, CheckIcon, TrashIcon, PencilIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Task {
  id: string
  text: string
  completed: boolean
}

type FilterType = "all" | "completed" | "pending"

const taskVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -20 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
}

const filterButtonVariants: Variants = {
  active: { scale: 1.1, transition: { type: "spring", stiffness: 500, damping: 15 } },
  inactive: { scale: 1 },
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    const savedFilter = localStorage.getItem("filter") as FilterType | null
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    if (savedFilter) {
      setFilter(savedFilter)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("filter", filter)
  }, [filter])

  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingTaskId])

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

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setEditText(task.text)
  }

  const saveEdit = () => {
    if (editingTaskId) {
      setTasks(tasks.map((task) => (task.id === editingTaskId ? { ...task, text: editText.trim() } : task)))
      setEditingTaskId(null)
    }
  }

  const cancelEdit = () => {
    setEditingTaskId(null)
    setEditText("")
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit()
    } else if (e.key === "Escape") {
      cancelEdit()
    }
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
          <PlusIcon className="h-5 w-5 mr-2" />
          Add
        </Button>
      </form>

      <motion.div className="flex justify-center space-x-2 mb-4" initial={false}>
        {(["all", "completed", "pending"] as const).map((filterType) => (
          <motion.div
            key={filterType}
            variants={filterButtonVariants}
            animate={filter === filterType ? "active" : "inactive"}
          >
            <Button variant={filter === filterType ? "default" : "outline"} onClick={() => setFilter(filterType)}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            variants={taskVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover="hover"
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-2"
          >
            <div className="flex items-center flex-grow mr-2">
              <motion.div whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 500, damping: 10 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleTask(task.id)}
                  className="mr-2 transition-colors duration-200"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      color: task.completed ? "#10B981" : "#9CA3AF",
                      scale: task.completed ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckIcon className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
              {editingTaskId === task.id ? (
                <Input
                  ref={editInputRef}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={handleEditKeyDown}
                  className="flex-grow"
                />
              ) : (
                <motion.span
                  animate={{
                    opacity: task.completed ? 0.5 : 1,
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-800 dark:text-white flex-grow"
                  onClick={() => startEditing(task)}
                >
                  {task.text}
                </motion.span>
              )}
            </div>
            <div className="flex">
              {editingTaskId === task.id ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={saveEdit}
                    className="text-green-500 hover:text-green-700 transition-colors duration-200"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={cancelEdit}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <XIcon className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing(task)}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTask(task.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {filteredTasks.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center text-gray-500 dark:text-gray-400 mt-4"
        >
          {filter === "all" ? "No tasks yet. Add a task to get started!" : `No ${filter} tasks.`}
        </motion.p>
      )}
    </div>
  )
}

