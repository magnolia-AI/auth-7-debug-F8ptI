'use client'

import { toggleTodo, deleteTodo } from '@/app/todos/actions'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { type Todo } from '@/lib/schema'
import { cn } from '@/lib/utils'

export function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div className="flex items-center justify-between p-4 mb-2 transition-all border rounded-lg bg-card hover:shadow-sm">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
        />
        <span
          className={cn(
            "text-sm font-medium transition-all",
            todo.completed && "text-muted-foreground line-through"
          )}
        >
          {todo.task}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteTodo(todo.id)}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}

