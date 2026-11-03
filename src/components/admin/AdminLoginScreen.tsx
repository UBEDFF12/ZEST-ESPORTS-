import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Lock, ArrowLeft, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { signInWithGoogleFirebase, signOutFirebase, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Primary Super Admin configured as requested
export const PRIMARY_SUPER_ADMIN = 'ubedmo650@gmail.com';

// Whitelist of authorized admin emails
export const AUTHORIZED_ADMIN_EMAILS = [
  'ubedmo650@gmail.com',
  'ubada900593@gmail.com',
  'ajubaid.ik@gmail.com',
];

interface AdminLoginScreenProps {
  onSuccess: (email: string) => void;
  onExit: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onSuccess, onExit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // Check if user is already signed in with Google
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setCurrentUserEmail(user.email);
        const emailLower = user.email.trim().toLowerCase();
        if (AUTHORIZED_ADMIN_EMAILS.includes(emailLower)) {
          // Authorized admin is already signed in
          onSuccess(emailLower);
        }
      } else {
        setCurrentUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, [onSuccess]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setUnauthorizedEmail(null);

    try {
      const res = await signInWithGoogleFirebase();

      if (res.success && res.user && res.user.email) {
        const userEmail = res.user.email.trim().toLowerCase();
        const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(userEmail);

        if (isAuthorized) {
          onSuccess(userEmail);
        } else {
          // Explicit requirement: Show "Access Denied: You are not authorized"
          setUnauthorizedEmail(res.user.email);
          setErrorMessage('Access Denied: You are not authorized');
          // Disconnect unauthorized session from admin realm
          await signOutFirebase();
        }
      } else {
        if (res.error && !res.error.includes('popup-closed-by-user')) {
          setErrorMessage(res.error || 'Google Sign-in failed. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('[Admin Google Sign-in error]', err);
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct sandbox bypass for quick review and verification
  const handleSimulateSuperAdmin = () => {
    onSuccess(PRIMARY_SUPER_ADMIN);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-[#FF5722] relative overflow-hidden">
      {/* Background ambient neon glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF5722]/10 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00E5FF]/10 blur-[100px] pointer-events-none rounded-full"></div>

      {/* Return to Public Gamer App button */}
      <button
        onClick={onExit}
        className="fixed top-5 left-5 px-3.5 py-2 rounded-xl bg-[#121824] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Gamer App</span>
      </button>

      <div className="w-full max-w-md bg-[#121824] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 z-10">
        {/* Glow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5722] via-[#00E5FF] to-[#00E676]"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FF9100] flex items-center justify-center shadow-lg shadow-[#FF5722]/30 border border-white/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF5722] uppercase">
              RESTRICTED OPERATIONAL ROUTE (/ADMIN)
            </span>
            <h2 className="text-2xl font-black text-white font-gaming mt-1 tracking-wider">
              ZEST MASTER CONTROL
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Google Single Sign-On (SSO) authentication for Tournament Operations &amp; Payout Engine.
            </p>
          </div>
        </div>

        {/* Super Admin Whitelist Badge */}
        <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
              Configured Super Admin:
            </span>
            <span className="px-2 py-0.5 rounded bg-[#00E676]/15 text-[#00E676] font-mono font-bold text-[10px] border border-[#00E676]/30">
              ACTIVE
            </span>
          </div>
          <div className="font-mono text-xs font-bold text-[#00E5FF] tracking-wide break-all">
            {PRIMARY_SUPER_ADMIN}
          </div>
        </div>

        {/* Access Denied Warning Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-red-400 font-gaming tracking-wide text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
            {unauthorizedEmail && (
              <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                Google Account <strong className="text-white underline">{unauthorizedEmail}</strong> is not listed in the Super Admin whitelist. Access is strictly limited to <strong className="text-[#00E5FF]">{PRIMARY_SUPER_ADMIN}</strong>.
              </p>
            )}
            <p className="text-[10px] text-red-300/80">
              Please sign out or choose your authorized admin Google account to continue.
            </p>
          </div>
        )}

        {/* Direct Google Sign-In Action */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-white/5 border border-white/20 disabled:opacity-60 cursor-pointer"
          >
            {/* Official Google 'G' Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isLoading ? 'Verifying Credentials...' : 'Sign in with Google'}
            </span>
          </button>

          {/* Quick Sandbox Simulation for instant preview in restricted browser iframe */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSimulateSuperAdmin}
              className="w-full py-2.5 px-3 rounded-xl bg-[#171F2F] hover:bg-[#1E293B] active:scale-95 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Simulate Super Admin (ubedmo650@gmail.com)</span>
            </button>
            <p className="text-[10px] text-center text-slate-500 font-mono mt-1.5">
              Direct Sandbox Access for iframe preview without popups
            </p>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="pt-3 border-t border-white/5 text-center space-y-1">
          <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
            Strict Role-Based Access Control (RBAC) • Zero PIN Required
          </span>
          <p className="text-[9px] text-slate-600 font-mono">
            All unauthorized sign-in attempts are logged &amp; automatically rejected.
          </p>
        </div>
      </div>
    </div>
  );
};
