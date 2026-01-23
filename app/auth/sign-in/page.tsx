'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signInWithEmail } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-transparent relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-black to-slate-950/20 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card rounded-[2.5rem] p-12 border-white/20 shadow-[0_0_100px_-20px_rgba(168,85,247,0.15)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
          
          <div className="mb-10">
            <h1 className="text-5xl font-black mb-3 tracking-tighter radical-gradient-text uppercase">Welcome Back</h1>
            <p className="text-white/60 text-lg font-medium tracking-wide">Enter the system to continue your flow.</p>
          </div>

          <form action={formAction} className="space-y-8">
            {state?.error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-400 rounded-2xl">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-base font-bold ml-2">{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-bold ml-1 uppercase tracking-widest text-xs">Access Identity</Label>
                <div className="relative group">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@nexus.com"
                    required
                    autoComplete="email"
                    className="h-14 rounded-2xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 px-5 focus:ring-purple-500/50 transition-all text-lg"
                  />
                  <div className="absolute inset-0 rounded-2xl border border-purple-500/0 group-focus-within:border-purple-500/50 pointer-events-none transition-all" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-white font-bold ml-1 uppercase tracking-widest text-xs">Security Key</Label>
                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="h-14 rounded-2xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 px-5 focus:ring-purple-500/50 transition-all text-lg"
                  />
                  <div className="absolute inset-0 rounded-2xl border border-purple-500/0 group-focus-within:border-purple-500/50 pointer-events-none transition-all" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-6">
              <Button 
                type="submit" 
                className="w-full h-16 rounded-[1.2rem] bg-white text-black hover:bg-purple-500 hover:text-white transition-all duration-300 font-black text-xl shadow-xl shadow-white/5 disabled:opacity-50" 
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-6 h-6" /> INITIALIZE
                  </span>
                )}
              </Button>
              
              <p className="text-center text-white/40 font-medium">
                New user?{' '}
                <Link href="/auth/sign-up" className="text-purple-400 hover:text-white font-bold transition-colors underline-offset-4 hover:underline">
                  Create new access
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

