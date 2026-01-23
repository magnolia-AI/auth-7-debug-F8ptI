'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2, CheckCircle2, Circle } from 'lucide-react'
import { toggleTodo, deleteTodo } from '@/app/todos/actions'
import { type Todo } from '@/lib/schema'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TodoItemProps {
  todo: Todo
  radical?: boolean
  minimal?: boolean
}

export function TodoItem({ todo, radical = false, minimal = false }: TodoItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async () => {
    setIsUpdating(true)
    try {
      await toggleTodo(todo.id, todo.completed)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTodo(todo.id)
    } finally {
      setIsDeleting(false)
    }
  }

  if (minimal) {
    return (
      <div className="flex items-center gap-4">
        <Button
          onClick={handleToggle}
          disabled={isUpdating}
          variant="outline"
          size="lg"
          className={cn(
            "rounded-full h-16 px-8 text-lg font-bold transition-all duration-500",
            todo.completed 
              ? "bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30" 
              : "bg-purple-600 text-white border-transparent hover:scale-105 hover:bg-purple-500 shadow-xl shadow-purple-500/20"
          )}
        >
          {isUpdating ? <Loader2 className="w-6 h-6 animate-spin" /> : todo.completed ? 'MARK INCOMPLETE' : 'COMPLETE TASK'}
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="ghost"
          size="icon"
          className="h-16 w-16 rounded-full text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <Trash2 className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn(
      "group transition-all duration-300",
      radical ? "p-6 glass-card rounded-3xl" : "flex items-center justify-between p-4 border rounded-lg bg-card"
    )}>
      <div className={cn("flex items-start gap-4", radical && "mb-6")}>
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
          className={cn(
            "h-6 w-6 rounded-full border-2 transition-transform active:scale-90",
            radical && "mt-1"
          )}
        />
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-lg font-medium transition-all duration-300 break-words",
            todo.completed && "text-muted-foreground line-through opacity-50",
            radical && !todo.completed && "text-white group-hover:text-purple-300"
          )}>
            {todo.task}
          </p>
          {radical && (
            <p className="text-xs text-muted-foreground/50 mt-2 uppercase tracking-widest">
              Created {new Date(todo.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className={cn(
        "flex items-center justify-end gap-2",
        radical && "opacity-0 group-hover:opacity-100 transition-opacity"
      )}>
        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-9 w-9 text-muted-foreground hover:text-destructive transition-colors shrink-0"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

