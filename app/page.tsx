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
      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Radical Landing Background */}
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-indigo-950 via-black to-slate-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 blur-[180px] rounded-full animate-pulse" />
        
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-8xl md:text-[13rem] font-black tracking-tighter mb-12 radical-gradient-text leading-[0.85] select-none">
            FOCUS<br /><span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">PURE.</span>
          </h1>
          <p className="text-2xl md:text-3xl text-white font-medium mb-16 max-w-3xl mx-auto leading-relaxed [text-wrap:balance]">
            The radical way to manage your tasks. 
            <span className="text-white/60"> No noise. Just output.</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <a 
              href="/auth/sign-in" 
              className="group relative px-12 py-6 bg-white text-black rounded-[2rem] font-black text-2xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-white/10"
            >
              <span className="relative z-10">ACCESS SYSTEM</span>
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

  return (
    <div className="pt-20">
      <HomeClient initialTodos={userTodos} />
    </div>
  )
}

