import React from 'react';
import { useEsports } from '../../context/EsportsContext';
import {
  Trophy,
  Swords,
  Crosshair,
  Percent,
  Shield,
  Smartphone,
  Copy,
  Check,
  UserCheck,
  Ban,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export const MobileProfileScreen: React.FC = () => {
  const { currentUser, allUsers, switchUser, logout } = useEsports();
  const [copiedUid, setCopiedUid] = React.useState(false);

  const copyUid = () => {
    navigator.clipboard.writeText(currentUser.freeFireUid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-2">
      {/* Profile Card */}
      <div className="p-4 rounded-2xl bg-[#121824] border border-white/10 shadow-2xl relative overflow-hidden">
        {currentUser.isBanned && (
          <div className="mb-3 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <Ban className="w-4 h-4 shrink-0 text-red-400" />
            <span>ACCOUNT SUSPENDED: Hardware / Fair-play violation flagged by anti-cheat.</span>
          </div>
        )}

        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FF5722] shadow-lg shadow-[#FF5722]/30"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00E676] rounded-full border-2 border-[#121824]"></span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg font-gaming text-white tracking-wide truncate">
                {currentUser.freeFireIgn}
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00E676]/15 text-[#00E676] font-mono font-bold border border-[#00E676]/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">{currentUser.name}</p>

            <button
              onClick={copyUid}
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#00E5FF] hover:underline font-mono"
            >
              <span>UID: {currentUser.freeFireUid}</span>
              {copiedUid ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/5 text-center">
          <div className="p-2 rounded-xl bg-[#090D16] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Matches</div>
            <div className="text-base font-black font-gaming text-white">{currentUser.matchesPlayed}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#090D16] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Kills</div>
            <div className="text-base font-black font-gaming text-[#FF5722]">{currentUser.totalKills}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#090D16] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Win Rate</div>
            <div className="text-base font-black font-gaming text-[#00E5FF]">{currentUser.winRate}%</div>
          </div>
          <div className="p-2 rounded-xl bg-[#090D16] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Earnings</div>
            <div className="text-base font-black font-gaming text-[#00E676]">₹{currentUser.totalEarnings}</div>
          </div>
        </div>
      </div>

      {/* Device & Anti-Cheat Fingerprint */}
      <div className="p-4 rounded-2xl bg-[#121824] border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#00E5FF]" /> Security &amp; Hardware Fingerprint
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">VERIFIED MOBILE</span>
        </div>

        <div className="p-3 rounded-xl bg-[#090D16] border border-white/5 space-y-2 text-xs font-mono text-slate-400">
          <div className="flex items-center justify-between">
            <span>Device Model:</span>
            <span className="text-slate-200">{currentUser.deviceFingerprint.deviceId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Client IP:</span>
            <span className="text-slate-200">{currentUser.deviceFingerprint.ipAddress}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Anti-Cheat Status:</span>
            <span className={currentUser.deviceFingerprint.isSuspicious ? 'text-red-400' : 'text-[#00E676]'}>
              {currentUser.deviceFingerprint.isSuspicious ? 'SUSPICIOUS / EMULATOR' : 'PASSED (0 ANOMALIES)'}
            </span>
          </div>
        </div>
      </div>

      {/* TEST / ARCHITECT ACCOUNT SWITCHER */}
      <div className="p-4 rounded-2xl bg-[#121824] border border-amber-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Switch Test Player Profile
          </span>
          <span className="text-[10px] text-slate-400">For Review &amp; Testing</span>
        </div>

        <div className="space-y-1.5">
          {allUsers.map((u) => {
            const isCurrent = u.id === currentUser.id;
            return (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-[#FF5722]/15 border-[#FF5722] text-white'
                    : 'bg-[#090D16] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-lg object-cover" />
                  <div>
                    <div className="font-bold text-xs text-white">{u.freeFireIgn}</div>
                    <div className="text-[10px] text-slate-400">{u.name} {u.isBanned ? '(BANNED)' : ''}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#00E676]">₹{u.winningsBalance}</div>
                  <div className="text-[9px] text-slate-400 font-mono">Win Bal</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Log Out Button */}
      <button
        onClick={logout}
        className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-gaming font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors active:scale-98"
      >
        <LogOut className="w-4 h-4" /> LOG OUT OF GAMER SESSION
      </button>
    </div>
  );
};
