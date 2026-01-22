'use client'

import { createTodo } from '@/app/todos/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRef } from 'react'
import { Plus } from 'lucide-react'

export function TodoForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        formRef.current?.reset()
        await createTodo(formData)
      }}
      className="flex gap-2 mb-8"
    >
      <Input
        name="task"
        placeholder="Add a new task..."
        className="flex-1"
        required
      />
      <Button type="submit">
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </form>
  )
}

