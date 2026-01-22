import db from '@/lib/db'
import { todos } from '@/lib/schema'
import { authServer } from '@/lib/auth/server'
import { eq, desc } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { TodoForm } from '@/components/todo-form'
import { TodoItem } from '@/components/todo-item'
import { AuthHeader } from '@/components/auth-header'

export default async function Home() {
  const result = await authServer.getSession() as any;
  
  // Safely check if result exists and contains the required session/user data
  if (!result || result.error || !result.data || !result.data.user) {
    redirect('/auth/sign-in')
  }

  const session = result.data
  const userTodos = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, session.user.id))
    .orderBy(desc(todos.createdAt))

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <main className="container max-w-2xl px-4 py-12 mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">My Tasks</h1>
          <p className="text-muted-foreground">Keep track of what needs to be done.</p>
        </header>

        <TodoForm />

        <div className="space-y-1">
          {userTodos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
              <p className="text-muted-foreground font-medium">No tasks yet. Start by adding one above!</p>
            </div>
          ) : (
            userTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}

