import db from '@/lib/db'
import { todos, user } from '@/lib/schema'
import { authServer } from '@/lib/auth/server'
import { eq, desc } from 'drizzle-orm'
import HomeClient from './home-client'

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
  
  if (!result || result.error || !result.data || !result.data.user) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center overflow-hidden">
        {/* Radical Landing Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full" />
        
        <div className="relative z-10">
          <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter mb-8 radical-gradient-text leading-none">
            FOCUS<br /><span className="text-white">PURE.</span>
          </h1>
          <p className="text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Strip away the noise. The most radical way to manage your tasks is to focus on what matters.
          </p>
          <div className="flex justify-center gap-6">
            <a 
              href="/auth/sign-in" 
              className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">ENTER SYSTEM</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  const sessionUser = result.data.user
  await ensureUserExists(sessionUser)

  const userTodos = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, sessionUser.id))
    .orderBy(desc(todos.createdAt))

  return <HomeClient initialTodos={userTodos} />
}

