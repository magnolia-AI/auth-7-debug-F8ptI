'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TodoForm } from '@/components/todo-form'
import { TodoItem } from '@/components/todo-item'
import { Button } from '@/components/ui/button'
import { Sparkles, LayoutGrid, Target, Zap } from 'lucide-react'
import { type Todo } from '@/lib/schema'

export default function HomeClient({ initialTodos }: { initialTodos: Todo[] }) {
  const [view, setView] = useState<'grid' | 'focus'>('grid')
  const [todos, setTodos] = useState(initialTodos)
  
  // Sort todos for the focus mode (incomplete first)
  const focusTodo = todos.find(t => !t.completed) || todos[0]

  return (
    <div className="relative min-h-screen">
      {/* Radical background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <main className="container relative z-10 max-w-5xl px-4 py-12 mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center md:text-left"
          >
            <h1 className="text-6xl md:text-7xl radical-gradient-text tracking-tighter mb-2">
              RADICAL<span className="text-white">FLOW</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium tracking-wide">
              Master your day, one radical step at a time.
            </p>
          </motion.div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-sm">
            <Button 
              variant={view === 'grid' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setView('grid')}
              className="rounded-xl px-6"
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button 
              variant={view === 'focus' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setView('focus')}
              className="rounded-xl px-6"
            >
              <Target className="w-4 h-4 mr-2" />
              Focus
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
              className="grid gap-12"
            >
              <div className="max-w-xl mx-auto w-full">
                <TodoForm />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todos.length === 0 ? (
                  <div className="col-span-full py-20 glass-card rounded-3xl text-center border-dashed border-2">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-50" />
                    <p className="text-xl font-light text-muted-foreground tracking-widest uppercase">Null Void</p>
                  </div>
                ) : (
                  todos.map((todo, idx) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <TodoItem todo={todo} radical />
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
              className="flex flex-col items-center justify-center py-10"
            >
              {focusTodo ? (
                <div className="w-full max-w-4xl glass-card p-12 md:p-24 rounded-[3rem] focus-glow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Sparkles className="text-purple-400 w-6 h-6" />
                      </div>
                      <span className="uppercase tracking-[0.3em] text-sm font-bold text-purple-400">Current Objective</span>
                    </div>
                    <h2 className={`text-5xl md:text-8xl font-black mb-12 tracking-tight leading-[1.1] ${focusTodo.completed ? 'opacity-50 line-through' : ''}`}>
                      {focusTodo.task}
                    </h2>
                    <div className="flex flex-wrap gap-4 pt-8 border-t border-white/10">
                      <TodoItem todo={focusTodo} radical minimal />
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="glass-card p-20 rounded-[3rem] text-center">
                  <p className="text-2xl font-bold radical-gradient-text">Complete Clarity Reached</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

