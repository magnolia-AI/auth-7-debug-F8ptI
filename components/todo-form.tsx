'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, Zap } from 'lucide-react'
import { createTodo } from '@/app/todos/actions'
import { motion } from 'framer-motion'

export function TodoForm() {
  const [task, setTask] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task.trim()) return

    const formData = new FormData()
    formData.append('task', task)

    startTransition(async () => {
      await createTodo(formData)
      setTask('')
    })
  }

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="relative group p-1"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2rem] blur opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />
      <div className="relative flex gap-3 p-2 bg-black/60 backdrop-blur-2xl rounded-[1.8rem] border border-white/20 shadow-2xl">
        <div className="flex-1 flex items-center px-4">
          <Zap className="w-6 h-6 text-purple-400 mr-4 shrink-0" />
          <Input
            type="text"
            placeholder="Initialize new objective..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={isPending}
            className="border-0 bg-transparent text-2xl font-black text-white focus-visible:ring-0 placeholder:text-white/40 h-16 caret-purple-500"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isPending || !task.trim()}
          className="rounded-2xl h-16 px-10 bg-white text-black hover:bg-purple-500 hover:text-white transition-all duration-300 font-black gap-2 text-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          {isPending ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <>
              <Plus className="h-7 w-7" />
              <span className="hidden sm:inline">DEPLOY</span>
            </>
          )}
        </Button>
      </div>
    </motion.form>
  )
}

