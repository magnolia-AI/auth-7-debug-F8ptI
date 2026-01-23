import db from '@/lib/db'
import { todos, user } from '@/lib/schema'
import { authServer } from '@/lib/auth/server'
import { eq, desc } from 'drizzle-orm'
import { TodoForm } from '@/components/todo-form'
import { TodoItem } from '@/components/todo-item'

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

export default async function Home() {
  const result = await authServer.getSession() as any;
  
  // If no user is logged in, show a landing state
  if (!result || result.error || !result.data || !result.data.user) {
    retrn (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-primary">Simple Todo App</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md">
          Organize your life with our simple, secure todo application. Sign in to start managing your tasks.
        </p>
        <div className="flex gap-4">
          <a 
            href="/auth/sign-in" 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </a>
        </div>
      </div>
    )
  }

  const sessionUser = result.data.user
  
  // Sync user record to local DB
  await ensureUserExists(sessionUser)

  const userTodos = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, sessionUser.id))
    .orderBy(desc(todos.createdAt))

  return (
    <div className="min-h-screen bg-background">
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

