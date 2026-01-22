'use server'

import db from '@/lib/db'
import { todos, user } from '@/lib/schema'
import { authServer } from '@/lib/auth/server'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

async function ensureUserExists(sessionUser: { id: string; email: string; name: string }) {
  const existingUsers = await db.select().from(user).where(eq(user.id, sessionUser.id)).limit(1)
  
  if (existingUsers.length === 0) {
    await db.insert(user).values({
      id: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.name || 'User',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoNothing()
  }
}

export async function createTodo(formData: FormData) {
  const result = await authServer.getSession() as any;
  if (!result || result.error || !result.data || !result.data.user) redirect('/auth/sign-in')
  const sessionUser = result.data.user

  await ensureUserExists(sessionUser)

  const task = formData.get('task') as string
  if (!task || task.trim().length === 0) return

  await db.insert(todos).values({
    id: uuidv4(),
    task,
    userId: sessionUser.id,
  })

  revalidatePath('/')
}

export async function toggleTodo(id: string, currentCompleted: boolean) {
  const result = await authServer.getSession() as any;
  if (!result || result.error || !result.data || !result.data.user) redirect('/auth/sign-in')
  const sessionUser = result.data.user

  await db
    .update(todos)
    .set({ completed: !currentCompleted })
    .where(and(eq(todos.id, id), eq(todos.userId, sessionUser.id)))

  revalidatePath('/')
}

export async function deleteTodo(id: string) {
  const result = await authServer.getSession() as any;
  if (!result || result.error || !result.data || !result.data.user) redirect('/auth/sign-in')
  const sessionUser = result.data.user

  await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, sessionUser.id)))

  revalidatePath('/')
}

