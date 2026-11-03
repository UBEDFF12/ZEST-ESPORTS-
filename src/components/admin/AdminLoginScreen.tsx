import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowLeft, KeyRound, AlertCircle, Flame } from 'lucide-react';

interface AdminLoginScreenProps {
  onSuccess: () => void;
  onExit: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onSuccess, onExit }) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePinSubmit = (enteredPin: string) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    // Verify Admin PIN (1234)
    if (enteredPin === '1234') {
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 400);
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        setErrorMsg('Invalid Admin PIN. Access Denied.');
        setPin('');
      }, 400);
    }
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        handlePinSubmit(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      handlePinSubmit(pin);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-[#FF5722]">
      {/* Return to Public Gamer App button */}
      <button
        onClick={onExit}
        className="fixed top-5 left-5 px-3.5 py-2 rounded-xl bg-[#121824] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to App</span>
      </button>

      <div className="w-full max-w-sm bg-[#121824] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#FF5722]/15 blur-3xl pointer-events-none rounded-full"></div>

        {/* Header */}
        <div className="text-center space-y-2 relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FF9100] flex items-center justify-center shadow-lg shadow-[#FF5722]/30 border border-white/20">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF5722] uppercase">
              RESTRICTED OPERATIONAL ROUTE (/ADMIN)
            </span>
            <h2 className="text-xl font-black text-white font-gaming mt-1 tracking-wider">
              ZEST MASTER CONTROL
            </h2>
            <p className="text-xs text-slate-400">
              Enter 4-digit Security PIN to access Tournament Operations &amp; Payout Engine.
            </p>
          </div>
        </div>

        {/* PIN Dots Display */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex justify-center items-center gap-3 py-2">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-11 h-12 rounded-xl border flex items-center justify-center font-mono text-xl font-black transition-all ${
                    isFilled
                      ? 'bg-[#FF5722]/20 border-[#FF5722] text-[#FF5722] scale-105 shadow-md shadow-[#FF5722]/30'
                      : 'bg-[#090D16] border-white/10 text-slate-600'
                  }`}
                >
                  {isFilled ? '●' : ''}
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center justify-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Helper for Admin */}
          <div className="text-center">
            <span className="text-[11px] text-slate-500 font-mono">
              Admin PIN: <strong className="text-[#00E5FF]">1234</strong>
            </span>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                disabled={isSubmitting}
                className="h-12 rounded-xl bg-[#171F2F] hover:bg-[#1E293B] active:scale-95 border border-white/5 font-gaming font-bold text-lg text-white transition-all shadow-sm"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting || pin.length === 0}
              className="h-12 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-400 font-mono text-xs font-bold transition-all"
            >
              CLEAR
            </button>

            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              disabled={isSubmitting}
              className="h-12 rounded-xl bg-[#171F2F] hover:bg-[#1E293B] active:scale-95 border border-white/5 font-gaming font-bold text-lg text-white transition-all shadow-sm"
            >
              0
            </button>

            <button
              type="button"
              onClick={() => handlePinSubmit(pin)}
              disabled={isSubmitting || pin.length !== 4}
              className="h-12 rounded-xl bg-[#FF5722] hover:bg-[#FF5722]/90 disabled:opacity-40 active:scale-95 text-white font-gaming text-xs font-black tracking-wider transition-all shadow-md shadow-[#FF5722]/30 flex items-center justify-center"
            >
              {isSubmitting ? '...' : 'ENTER'}
            </button>
          </div>
        </form>

        <div className="pt-2 text-center border-t border-white/5">
          <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
            Encrypted Session • Node.js/Firebase Auth
          </span>
        </div>
      </div>
    </div>
  );
};
