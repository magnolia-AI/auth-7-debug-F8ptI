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
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
      <div className="relative flex gap-3 p-2 bg-black/40 backdrop-blur-xl rounded-[1.8rem] border border-white/10 shadow-2xl">
        <div className="flex-1 flex items-center px-4">
          <Zap className="w-5 h-5 text-purple-400 mr-3 shrink-0" />
          <Input
            type="text"
            placeholder="Initialize new objective..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={isPending}
            className="border-0 bg-transparent text-xl font-medium focus-visible:ring-0 placeholder:text-muted-foreground/30 h-14"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isPending || !task.trim()}
          className="rounded-2xl h-14 px-8 bg-white text-black hover:bg-purple-500 hover:text-white transition-all duration-300 font-bold gap-2 text-lg shadow-lg"
        >
          {isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Plus className="h-6 w-6" />
              <span className="hidden sm:inline">DEPLOY</span>
            </>
          )}
        </Button>
      </div>
    </motion.form>
  )
}

