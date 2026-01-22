'use server'

import db from '@/lib/db'
import { todos } from '@/lib/schema'
import { authServer } from '@/lib/auth/server'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export async function createTodo(formData: FormData) {
  const result = await authServer.getSession() as any;
  if (!result || result.error) redirect('/auth/sign-in')
  const session = result.data

  const task = formData.get('task') as string
  if (!task || task.trim().length === 0) return

  await db.insert(todos).values({
    id: uuidv4(),
    task,
    userId: session.user.id,
  })

  revalidatePath('/')
}

export async function toggleTodo(id: string, currentCompleted: boolean) {
  const result = await authServer.getSession() as any;
  if (!result || result.error) redirect('/auth/sign-in')
  const session = result.data

  await db
    .update(todos)
    .set({ completed: !currentCompleted })
    .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))

  revalidatePath('/')
}

export async function deleteTodo(id: string) {
  const result = await authServer.getSession() as any;
  if (!result || result.error) redirect('/auth/sign-in')
  const session = result.data

  await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))

  revalidatePath('/')
}

