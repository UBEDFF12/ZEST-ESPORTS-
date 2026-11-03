import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import {
  Flame,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Hash,
  Gift,
  KeyRound,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const MobileAuthScreen: React.FC = () => {
  const {
    allUsers,
    sendPhoneOtp,
    loginWithPhoneOtp,
    loginWithGoogle,
    signInWithFirebaseGoogle,
    registerPlayer,
    switchUser,
  } = useEsports();

  const [authMode, setAuthMode] = useState<'otp' | 'register' | 'demo'>('otp');

  // Phone OTP States
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otpStep, setOtpStep] = useState<'enter_phone' | 'enter_otp'>('enter_phone');
  const [otpValue, setOtpValue] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpLoading, setOtpLoading] = useState(false);

  // Registration States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regIgn, setRegIgn] = useState('');
  const [regUid, setRegUid] = useState('');
  const [regReferral, setRegReferral] = useState('');

  // Status Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Timer countdown for resending OTP
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpStep === 'enter_otp' && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, otpTimer]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpLoading(true);

    try {
      const res = await sendPhoneOtp(phoneNumber);
      setOtpLoading(false);

      if (res.success) {
        setOtpStep('enter_otp');
        setOtpTimer(45);
        setSuccessMsg(res.message);
        setOtpValue('');
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setOtpLoading(false);
      setErrorMsg(err?.message || 'Error triggering SMS OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setOtpLoading(true);

    try {
      const res = await loginWithPhoneOtp(phoneNumber, otpValue);
      setOtpLoading(false);

      if (!res.success) {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setOtpLoading(false);
      setErrorMsg(err?.message || 'OTP verification failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    const res = await signInWithFirebaseGoogle();
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = registerPlayer({
      name: regName,
      phone: regPhone,
      email: regEmail,
      freeFireIgn: regIgn,
      freeFireUid: regUid,
      referralCode: regReferral,
    });

    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-4 sm:p-6 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Brand Header */}
      <div className="text-center pt-2 space-y-2">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#E64A19] to-[#FF9100] flex items-center justify-center shadow-xl shadow-[#FF5722]/30 border border-white/20">
          <Flame className="w-9 h-9 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl font-black font-gaming text-white tracking-widest mt-1">
            ZEST <span className="text-[#FF5722]">ESPORTS</span>
          </h1>
          <p className="text-xs text-slate-400">Official Free Fire MAX Competitive Arena</p>
        </div>

        {/* Welcome Bonus Callout */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676] text-xs font-bold">
          <Gift className="w-3.5 h-3.5" /> Instant ₹50 Welcome Cash on Login
        </div>
      </div>

      {/* Notifications / Alerts */}
      <div className="my-3">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Main Auth Form Container */}
      <div className="flex-1 flex flex-col justify-center my-2">
        {/* Auth Mode Tabs */}
        <div className="flex rounded-xl bg-[#121824] p-1 border border-white/5 mb-4 text-xs">
          <button
            onClick={() => {
              setAuthMode('otp');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              authMode === 'otp'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Phone OTP
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              authMode === 'register'
                ? 'bg-[#00E5FF] text-[#090D16] shadow-md shadow-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            New Sign Up
          </button>
          <button
            onClick={() => {
              setAuthMode('demo');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              authMode === 'demo'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Click Demo
          </button>
        </div>

        {/* 1. PHONE OTP AUTHENTICATION */}
        {authMode === 'otp' && (
          <div className="p-4 rounded-2xl bg-[#121824] border border-white/10 space-y-4">
            {otpStep === 'enter_phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Enter Mobile Number (Firebase Phone Auth)
                  </label>
                  <div className="flex rounded-xl bg-[#090D16] border border-white/10 overflow-hidden focus-within:border-[#FF5722]">
                    <span className="px-3 py-2.5 bg-white/5 border-r border-white/10 text-xs font-mono font-bold text-slate-300 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full px-3 py-2.5 text-white font-mono text-sm tracking-wider bg-transparent focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Dispatches a real SMS OTP via Firebase Authentication &amp; cellular carrier.
                  </span>
                </div>

                {/* Firebase reCAPTCHA Verifier Container for Web */}
                <div id="recaptcha-container" className="my-2 flex justify-center"></div>

                <button
                  type="submit"
                  disabled={otpLoading || phoneNumber.length < 10}
                  className="w-full py-3 rounded-xl bg-[#FF5722] hover:bg-[#FF5722]/90 disabled:opacity-40 text-white font-gaming font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF5722]/30 active:scale-98 transition-all"
                >
                  <KeyRound className="w-4 h-4" />
                  {otpLoading ? 'TRIGGERING FIREBASE SMS...' : 'SEND REAL SMS OTP (FIREBASE)'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-mono text-[11px]">SMS Dispatched: +91 {phoneNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpStep('enter_phone')}
                    className="text-[#FF5722] hover:underline font-bold text-[11px]"
                  >
                    Change Number
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Enter 6-Digit SMS Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter SMS OTP"
                    className="w-full px-3.5 py-3 rounded-xl bg-[#090D16] border border-[#FF5722] text-white font-mono text-xl text-center tracking-[0.5em] focus:outline-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setOtpValue('123456')}
                      className="text-slate-400 hover:text-[#00E5FF] text-[10px] underline"
                      title="Quick fill test code"
                    >
                      Bypass / Demo OTP: 123456
                    </button>
                    {otpTimer > 0 ? (
                      <span className="font-mono text-slate-500">{otpTimer}s remaining</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-[#00E676] font-bold hover:underline"
                      >
                        Resend SMS
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={otpLoading || otpValue.length < 6}
                  className="w-full py-3 rounded-xl bg-[#00E676] hover:bg-[#00E676]/90 disabled:opacity-40 text-[#090D16] font-gaming font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#00E676]/30 active:scale-98 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {otpLoading ? 'CONFIRMING WITH FIREBASE...' : 'VERIFY OTP & ENTER TOURNAMENTS'}
                </button>
              </form>
            )}

            {/* Google Alternative Divider */}
            <div className="pt-2 border-t border-white/5 space-y-3">
              <div className="relative flex items-center justify-center">
                <span className="bg-[#121824] px-3 text-[10px] text-slate-500 uppercase tracking-wider">
                  OR CONTINUE WITH
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 rounded-xl bg-[#171F2F] hover:bg-[#1E293B] border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                Google One-Tap Sign In
              </button>
            </div>
          </div>
        )}

        {/* 2. NEW GAMER REGISTRATION */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="p-4 rounded-2xl bg-[#121824] border border-white/10 space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#090D16] border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="9876543210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl bg-[#090D16] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Gmail Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090D16] border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Free Fire In-Game Name (IGN) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIPER_GOD"
                  value={regIgn}
                  onChange={(e) => setRegIgn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090D16] border border-white/10 text-white font-gaming focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Free Fire UID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7849103942"
                  value={regUid}
                  onChange={(e) => setRegUid(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090D16] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Referral Code (Optional — Get +₹25 Extra Bonus)
              </label>
              <input
                type="text"
                placeholder="e.g. ZEST-SNIPER-99"
                value={regReferral}
                onChange={(e) => setRegReferral(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#090D16] border border-white/10 text-[#00E676] font-mono uppercase focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#090D16] font-gaming font-black text-xs tracking-wider shadow-lg shadow-[#00E5FF]/30 active:scale-98 transition-all"
            >
              CREATE ACCOUNT (CLAIM ₹50 BONUS)
            </button>
          </form>
        )}

        {/* 3. QUICK 1-CLICK DEMO TEST LOGINS */}
        {authMode === 'demo' && (
          <div className="p-4 rounded-2xl bg-[#121824] border border-white/10 space-y-3 text-xs">
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block">
              1-Click Roster Profiles (Instant Test Access)
            </span>

            <div className="space-y-2">
              {allUsers.slice(0, 3).map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    // auto login
                    loginWithGoogle(u.email, u.name);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#171F2F] hover:bg-[#1E293B] border border-white/10 text-left flex items-center justify-between transition-all active:scale-98"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-white font-gaming">{u.freeFireIgn}</div>
                      <div className="text-[10px] text-slate-400">{u.name} ({u.phone})</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#00E676]">₹{u.winningsBalance}</span>
                    <span className="text-[9px] text-slate-500 block">Win Cash</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-slate-500 space-y-1 pb-2">
        <p className="flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
          <span>Fair Play Guaranteed • Anti-Cheat Engine Active</span>
        </p>
        <p>By signing in, you agree to Zest Esports Tournament Rules.</p>
      </div>
    </div>
  );
};
