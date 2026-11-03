import React, { useState, useEffect } from 'react';
import { Tournament } from '../../types';
import { useEsports } from '../../context/EsportsContext';
import { X, Lock, Unlock, Copy, Check, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

interface RoomCredentialsModalProps {
  tournament: Tournament;
  onClose: () => void;
}

export const RoomCredentialsModal: React.FC<RoomCredentialsModalProps> = ({
  tournament,
  onClose,
}) => {
  const { updateRoomCredentials } = useEsports();
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  // Calculate minutes remaining until match
  const matchTime = new Date(tournament.scheduleTime).getTime();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diffMs = matchTime - now;
  const minutesLeft = Math.floor(diffMs / 60000);
  const secondsLeft = Math.floor((diffMs % 60000) / 1000);

  // Dynamic Unlock Condition: either room marked revealed or time <= 15 minutes
  const isUnlocked = tournament.isRoomRevealed || minutesLeft <= tournament.roomUnlockMinutesBefore;

  const copyRoomId = () => {
    if (!tournament.roomId) return;
    navigator.clipboard.writeText(tournament.roomId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyPassword = () => {
    if (!tournament.roomPassword) return;
    navigator.clipboard.writeText(tournament.roomPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const triggerDynamicUnlock = () => {
    updateRoomCredentials(
      tournament.id,
      tournament.roomId || '8910482',
      tournament.roomPassword || 'ZEST@99',
      true
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121824] border-t sm:border border-white/10 sm:rounded-2xl shadow-2xl rounded-t-3xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#171F2F]">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isUnlocked ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-amber-500/20 text-amber-400'}`}>
              {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-gaming font-bold text-white text-sm tracking-wide">
                MATCH ROOM CREDENTIALS
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[240px]">{tournament.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Status Badge */}
          {isUnlocked ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#00E676]/10 to-[#00E5FF]/10 border border-[#00E676]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#00E676]">
                  <Sparkles className="w-4 h-4 animate-spin text-[#00E676]" /> ROOM DETAILS UNLOCKED
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E676]/20 text-[#00E676] font-bold">
                  LIVE LOBBY
                </span>
              </div>

              {/* Room ID Box */}
              <div className="p-3 bg-[#090D16] rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Custom Room ID
                  </div>
                  <div className="font-mono text-2xl font-black text-[#00E5FF] tracking-wider">
                    {tournament.roomId || '8910482'}
                  </div>
                </div>
                <button
                  onClick={copyRoomId}
                  className="px-3.5 py-2 rounded-lg bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] font-bold text-xs flex items-center gap-1.5 border border-[#00E5FF]/40 active:scale-95 transition-transform"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId ? 'COPIED' : 'COPY'}
                </button>
              </div>

              {/* Password Box */}
              <div className="p-3 bg-[#090D16] rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Room Password
                  </div>
                  <div className="font-mono text-2xl font-black text-[#FF5722] tracking-wider">
                    {tournament.roomPassword || 'ZEST@99'}
                  </div>
                </div>
                <button
                  onClick={copyPassword}
                  className="px-3.5 py-2 rounded-lg bg-[#FF5722]/20 hover:bg-[#FF5722]/30 text-[#FF5722] font-bold text-xs flex items-center gap-1.5 border border-[#FF5722]/40 active:scale-95 transition-transform"
                >
                  {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedPass ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-[#090D16] border border-amber-500/20 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base font-gaming">CREDENTIALS LOCKED 🔒</h4>
                <p className="text-xs text-slate-400 mt-1">
                  To prevent unauthorized guest access, Room ID and Password unlock dynamically{' '}
                  <strong className="text-amber-400">15 minutes prior</strong> to match schedule.
                </p>
              </div>

              {/* Countdown */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171F2F] border border-white/10 font-mono text-lg font-bold text-[#00E5FF]">
                <span>{Math.max(0, minutesLeft)}m</span>
                <span className="text-slate-500">:</span>
                <span>{Math.max(0, secondsLeft).toString().padStart(2, '0')}s</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1 font-sans">
                  Remaining
                </span>
              </div>

              {/* Demo Simulator button */}
              <div className="pt-2">
                <button
                  onClick={triggerDynamicUnlock}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Unlock className="w-4 h-4" /> Simulate 15-Minute Dynamic Unlock Now
                </button>
              </div>
            </div>
          )}

          {/* Quick Joining Guide */}
          <div className="p-4 rounded-xl bg-[#090D16]/60 border border-white/5 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <AlertCircle className="w-4 h-4 text-[#00E5FF]" /> HOW TO JOIN THE CUSTOM LOBBY:
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-300">
              <li>Launch <strong className="text-white">Free Fire</strong> on your mobile phone.</li>
              <li>Select mode menu &rarr; Tap <strong className="text-white">Custom</strong> tab.</li>
              <li>Enter Room ID & Password copied above.</li>
              <li>Join your reserved slot number and wait for host start!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#171F2F] border-t border-white/5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-wide"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
