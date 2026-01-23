'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2, Loader2, Shield, Mail, Calendar, Trash2, AlertTriangle, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountSettingsPage() {
  const { data, isPending: isSessionPending } = authClient.useSession();
  const user = data?.user;

  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Verification dialog state
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'send' | 'verify'>('send');
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Delete account dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const resetVerificationDialog = () => {
    setVerificationStep('send');
    setVerificationMessage(null);
    setOtpCode('');
  };

  const handleOpenVerifyDialog = () => {
    resetVerificationDialog();
    setVerifyDialogOpen(true);
  };

  const handleSendVerificationEmail = async () => {
    if (!user?.email) return;
    setIsSendingVerification(true);
    setVerificationMessage(null);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({ email: user.email, type: 'email-verification' });
      if (error) setVerificationMessage({ type: 'error', text: error.message || 'Failed to send verification email' });
      else { setVerificationMessage({ type: 'success', text: 'Code sent! Check your inbox.' }); setVerificationStep('verify'); }
    } catch { setVerificationMessage({ type: 'error', text: 'An unexpected error occurred' }); } finally { setIsSendingVerification(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || !user?.email) { setVerificationMessage({ type: 'error', text: 'Please enter the verification code' }); return; }
    setIsVerifyingOtp(true);
    setVerificationMessage(null);
    try {
      const { error } = await authClient.emailOtp.verifyEmail({ email: user.email, otp: otpCode.trim() });
      if (error) setVerificationMessage({ type: 'error', text: error.message || 'Invalid verification code' });
      else { setVerificationMessage({ type: 'success', text: 'Email verified successfully!' }); setTimeout(() => { setVerifyDialogOpen(false); window.location.reload(); }, 1500); }
    } catch { setVerificationMessage({ type: 'error', text: 'An unexpected error occurred' }); } finally { setIsVerifyingOtp(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') { setDeleteError('Please type DELETE to confirm'); return; }
    setIsDeleting(true); setDeleteError(null);
    try {
      const { error } = await authClient.deleteUser();
      if (error) setDeleteError(error.message || 'Failed to delete account');
      else window.location.href = '/';
    } catch { setDeleteError('An unexpected error occurred'); } finally { setIsDeleting(false); }
  };

  useEffect(() => { if (user?.name) setName(user.name); }, [user?.name]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setIsUpdating(true); setUpdateMessage(null);
    try {
      const { error } = await authClient.updateUser({ name });
      if (error) setUpdateMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      else setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch { setUpdateMessage({ type: 'error', text: 'An unexpected error occurred' }); } finally { setIsUpdating(false); }
  };

  if (isSessionPending) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-purple-500" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen p-6 pt-24 max-w-5xl mx-auto space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-6xl font-black radical-gradient-text tracking-tighter mb-4">IDENTITY HUB</h1>
        <p className="text-white/60 text-xl font-medium tracking-wide">Configure your existence within the system.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Management */}
        <div className="md:col-span-2 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-10 border-white/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <Shield className="text-purple-400 w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase font-mono">System Profile</h2>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              {updateMessage && (
                <Alert className={updateMessage.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}>
                  <AlertDescription className="font-bold flex items-center gap-2">
                    {updateMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {updateMessage.text}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="uppercase tracking-[0.2em] font-bold text-xs text-white/50 ml-1">Assigned Designation</Label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 rounded-2xl bg-white/[0.03] border-white/10 text-white text-lg px-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase tracking-[0.2em] font-bold text-xs text-white/50 ml-1">Communication Endpoint</Label>
                  <Input 
                    disabled 
                    value={user.email} 
                    className="h-14 rounded-2xl bg-white/[0.01] border-white/5 text-white/30 text-lg px-6"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isUpdating} className="h-16 px-10 rounded-2xl bg-white text-black font-black text-lg hover:bg-purple-500 hover:text-white transition-all duration-300 gap-2">
                {isUpdating ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-6 h-6" /> UPDATE CORE</>}
              </Button>
            </form>
          </div>

          <div className="glass-card rounded-[2.5rem] border-red-500/20 p-10 bg-red-500/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-red-400 uppercase font-mono">Purge Protocol</h2>
              </div>
              <p className="text-red-200/60 text-lg font-medium leading-relaxed">
                Permanently eliminate this identity and all associated data records. This procedure is absolute and irreversible.
              </p>
              <Button 
                variant="destructive" 
                onClick={() => setDeleteDialogOpen(true)}
                className="h-14 px-8 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-black text-lg shadow-xl shadow-red-500/20 group"
              >
                <Trash2 className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                INITIATE PURGE
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 space-y-10 border-white/10 bg-white/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/50 uppercase tracking-widest font-black text-[10px]">
                <Calendar className="w-4 h-4" /> Persistence Epoch
              </div>
              <p className="text-2xl font-bold text-white font-mono uppercase">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${user.emailVerified ? 'bg-green-500/10 border-green-500/40' : 'bg-amber-500/10 border-amber-500/40'}`}>
              <div className="flex items-center gap-3 mb-4 text-xs font-black uppercase tracking-widest text-white/50">
                <Shield className="w-4 h-4" /> Integrity Status
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.emailVerified ? (
                    <><CheckCircle2 className="w-6 h-6 text-green-400" /> <span className="font-black text-green-400">VERIFIED</span></>
                  ) : (
                    <><AlertCircle className="w-6 h-6 text-amber-400" /> <span className="font-black text-amber-400">LIMITING</span></>
                  )}
                </div>
                {!user.emailVerified && (
                  <Button size="sm" onClick={handleOpenVerifyDialog} className="bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl">VERIFY</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs - Minimal logic kept, but adding some radical styles */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent className="glass-card border-white/20 text-white rounded-[2rem] max-w-md p-10">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Mail className="w-8 h-8 text-purple-400" /> INTEGRITY CHECK
            </DialogTitle>
            <DialogDescription className="text-white/60 text-lg font-medium pt-4">
              {verificationStep === 'send' ? `Initiating code transfer to ${user.email}` : `Input the 6-digit integrity code sent to your terminal.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {verificationMessage && (
              <Alert className={verificationMessage.type === 'success' ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'bg-red-500/10 border-red-500/40 text-red-400'}>
                <AlertDescription className="font-bold">{verificationMessage.text}</AlertDescription>
              </Alert>
            )}
            {verificationStep === 'verify' && (
              <Input
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="h-20 text-center text-4xl font-black bg-white/5 border-white/10 rounded-2xl tracking-[0.5em] focus:ring-purple-500"
              />
            )}
            <div className="flex flex-col gap-4">
              <Button onClick={verificationStep === 'send' ? handleSendVerificationEmail : handleVerifyOtp} disabled={isSendingVerification || isVerifyingOtp} className="h-16 rounded-2xl bg-white text-black font-black text-xl hover:bg-purple-500 hover:text-white transition-all">
                {verificationStep === 'send' ? 'SEND CODE' : 'CONFIRM INTEGRITY'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="glass-card border-red-500/20 text-white rounded-[2rem] max-w-md p-10">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black text-red-400 uppercase tracking-tighter flex items-center gap-3">
              <AlertTriangle className="w-8 h-8" /> FINAL PURGE
            </DialogTitle>
            <DialogDescription className="text-red-200/50 text-lg font-medium pt-4">
              This will permanently delete your identity. All flow state and objectives will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="uppercase tracking-widest font-black text-red-500/50 text-xs">Verify Purge: Type DELETE</Label>
              <Input
                placeholder="DELETE"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                className="h-14 font-black text-center bg-red-500/5 border-red-500/20 text-red-400 rounded-2xl"
              />
            </div>
            <div className="flex flex-col gap-4">
               <Button onClick={handleDeleteAccount} disabled={isDeleting || deleteConfirmText !== 'DELETE'} variant="destructive" className="h-16 rounded-2xl bg-red-500 hover:bg-red-600 font-black text-xl">EXECUTE PURGE</Button>
               <Button onClick={() => setDeleteDialogOpen(false)} variant="ghost" className="text-white/40 hover:text-white">ABORT PROCEDURE</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

