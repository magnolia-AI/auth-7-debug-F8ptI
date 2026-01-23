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
  onStateChange?: (todo: Todo) => void
  onDelete?: (id: string) => void
}

export function TodoItem({ 
  todo, 
  radical = false, 
  minimal = false,
  onStateChange,
  onDelete
}: TodoItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async () => {
    // OPTIMISTIC UPDATE: Change local UI instantly
    const updatedTodo = { ...todo, completed: !todo.completed };
    if (onStateChange) onStateChange(updatedTodo);
    
    setIsUpdating(true)
    try {
      await toggleTodo(todo.id, todo.completed)
    } catch (err) {
      // Rollback on error if necessary
      if (onStateChange) onStateChange(todo);
      console.error("Failed to toggle task", err);
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    // OPTIMISTIC REMOVAL
    if (onDelete) onDelete(todo.id);
    
    setIsDeleting(true)
    try {
      await deleteTodo(todo.id)
    } catch (err) {
      // Re-add on error? usually better to just log
      console.error("Failed to delete task", err);
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
      radical ? "p-8 glass-card rounded-[2rem] hover:border-white/30" : "flex items-center justify-between p-4 border rounded-lg bg-card"
    )}>
      <div className={cn("flex items-start gap-5", radical && "mb-4")}>
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
          className={cn(
            "h-7 w-7 rounded-full border-2 border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 transition-all",
            radical && "mt-1"
          )}
        />
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-xl font-bold transition-all duration-300 break-words tracking-tight",
            todo.completed && "text-white/30 line-through",
            radical && !todo.completed && "text-white group-hover:text-purple-200"
          )}>
            {todo.task}
          </p>
          {radical && (
            <div className="flex items-center gap-2 mt-3 overflow-hidden">
               <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-md font-black uppercase tracking-widest whitespace-nowrap">
                SECURED: {new Date(todo.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={cn(
        "flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-4",
        radical && "opacity-40 group-hover:opacity-100 transition-opacity"
      )}>
        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-purple-400" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-10 w-10 text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all rounded-xl"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  )
}

