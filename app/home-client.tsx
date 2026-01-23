'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TodoForm } from '@/components/todo-form'
import { TodoItem } from '@/components/todo-item'
import { Button } from '@/components/ui/button'
import { Sparkles, LayoutGrid, Target, Zap } from 'lucide-react'
import { type Todo } from '@/lib/schema'
import { useRouter } from 'next/navigation'

export default function HomeClient({ initialTodos }: { initialTodos: Todo[] }) {
  const [view, setView] = useState<'grid' | 'focus'>('grid')
  const [todos, setTodos] = useState(initialTodos)
  const router = useRouter()
  
  // Sync state whenever initialTodos changes (revalidation)
  useEffect(() => {
    setTodos(initialTodos)
  }, [initialTodos])

  // Sort todos for the focus mode (incomplete first)
  const focusTodo = todos.find(t => !t.completed) || todos[0]

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <main className="container relative z-10 max-w-5xl px-4 py-16 mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center md:text-left"
          >
            <h1 className="text-7xl md:text-8xl radical-gradient-text tracking-tighter mb-4">
              RADICAL<span className="text-white">FLOW</span>
            </h1>
            <p className="text-white text-xl font-bold tracking-wide leading-relaxed">
              Master your day, <span className="text-white/50">one radical step at a time.</span>
            </p>
          </motion.div>

          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl">
            <Button 
              variant={view === 'grid' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setView('grid')}
              className={`rounded-xl px-8 h-10 font-black tracking-widest text-xs transition-all ${view === 'grid' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              GRID
            </Button>
            <Button 
              variant={view === 'focus' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setView('focus')}
              className={`rounded-xl px-8 h-10 font-black tracking-widest text-xs transition-all ${view === 'focus' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
            >
              <Target className="w-4 h-4 mr-2" />
              FOCUS
            </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {view === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-16"
            >
              <div className="max-w-2xl mx-auto w-full">
                <TodoForm />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todos.length === 0 ? (
                  <div className="col-span-full py-24 glass-card rounded-[3rem] text-center border-dashed border-2 border-white/10">
                    <Zap className="w-16 h-16 mx-auto mb-6 text-purple-400 opacity-40 animate-pulse" />
                    <p className="text-2xl font-black text-white/20 tracking-[0.4em] uppercase">Null Void State</p>
                  </div>
                ) : (
                  todos.map((todo, idx) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <TodoItem 
                        todo={todo} 
                        radical 
                        onStateChange={(updatedTodo) => {
                          setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t))
                        }}
                        onDelete={(id) => {
                          setTodos(prev => prev.filter(t => t.id !== id))
                        }}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="focus"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-6"
            >
              {focusTodo ? (
                <div className="w-full max-w-4xl glass-card p-16 md:p-28 rounded-[4rem] focus-glow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                  >
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center shadow-inner shadow-purple-500/10">
                        <Sparkles className="text-purple-400 w-7 h-7" />
                      </div>
                      <span className="uppercase tracking-[0.5em] text-xs font-black text-purple-400/80">Active Objective</span>
                    </div>
                    <h2 className={`text-6xl md:text-[7rem] font-black mb-16 tracking-tighter leading-[0.9] text-white drop-shadow-2xl ${focusTodo.completed ? 'opacity-30 line-through' : ''}`}>
                      {focusTodo.task}
                    </h2>
                    <div className="flex flex-wrap gap-6 pt-12 border-t border-white/10">
                      <TodoItem 
                        todo={focusTodo} 
                        radical 
                        minimal 
                        onStateChange={(updatedTodo) => {
                          setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t))
                        }}
                        onDelete={(id) => {
                          setTodos(prev => prev.filter(t => t.id !== id))
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="glass-card p-24 rounded-[4rem] text-center border-white/20">
                  <p className="text-4xl font-black radical-gradient-text tracking-tighter">ZENITH REACHED</p>
                  <p className="text-white/40 mt-4 font-bold tracking-widest uppercase text-sm">All systems clear</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

