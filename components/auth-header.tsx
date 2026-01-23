'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth/client';
import { LogOut, Settings, User, LogIn } from 'lucide-react';

export function AuthHeader() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  if (isPending) {
    return (
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <div className="h-9 w-9 rounded-full bg-white/10 animate-pulse" />
      </header>
    );
  }

  return (
    <header className="fixed top-0 right-0 z-[100] flex justify-end items-center p-6 gap-4 pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-white/10">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-purple-600 text-white font-bold">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card border-white/20">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user.name && <p className="font-bold text-white">{user.name}</p>}
                  {user.email && (
                    <p className="w-[200px] truncate text-xs text-white/50">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="hover:bg-white/10 focus:bg-white/10">
                <Link href="/account/settings" className="cursor-pointer flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" asChild className="rounded-xl text-white font-bold hover:bg-white/10 hover:text-white px-6">
              <Link href="/auth/sign-in" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
            </Button>
            <Button asChild className="rounded-xl bg-white text-black hover:bg-white/90 font-bold px-6 shadow-xl">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

