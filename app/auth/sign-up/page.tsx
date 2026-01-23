'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signUpWithEmail } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

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
            <h1 className="text-5xl font-black mb-3 tracking-tighter radical-gradient-text uppercase">Create Identity</h1>
            <p className="text-white/60 text-lg font-medium tracking-wide">Enter the system for total focus.</p>
          </div>

          <form action={formAction} className="space-y-6">
            {state?.error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-400 rounded-2xl">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-base font-bold ml-2">{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-bold ml-1 uppercase tracking-widest text-xs">Public Alias</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="h-14 rounded-2xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 px-5 focus:ring-purple-500/50 transition-all text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-bold ml-1 uppercase tracking-widest text-xs">Email Identity</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@nexus.com"
                  required
                  className="h-14 rounded-2xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 px-5 focus:ring-purple-500/50 transition-all text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-bold ml-1 uppercase tracking-widest text-xs">Security Key</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="h-14 rounded-2xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 px-5 focus:ring-purple-500/50 transition-all text-lg"
                />
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] ml-1">Must exceed 8 chars</p>
              </div>
            </div>

            <div className="pt-6 flex flex-col gap-6">
              <Button 
                type="submit" 
                className="w-full h-16 rounded-[1.2rem] bg-white text-black hover:bg-white/90 transition-all duration-300 font-black text-xl shadow-xl shadow-white/5 disabled:opacity-50" 
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-6 h-6" /> DEPLOY ACCOUNT
                  </span>
                )}
              </Button>
              
              <p className="text-center text-white/40 font-medium tracking-wide">
                Already registered?{' '}
                <Link href="/auth/sign-in" className="text-purple-400 hover:text-white font-bold transition-colors underline-offset-4 hover:underline">
                  Initiate session
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

