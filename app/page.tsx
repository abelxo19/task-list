'use client'

import { TaskList } from "../components/TaskList"

export default function Home() {
  return (
   <main className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Task List</h1>
        </div>
        <TaskList />
      </div>
    </main>
  );
}
