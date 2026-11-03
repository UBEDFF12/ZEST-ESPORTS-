import React from 'react';
import { useEsports } from '../../context/EsportsContext';
import { ShieldAlert, ShieldCheck, Ban, CheckCircle, Smartphone, AlertTriangle } from 'lucide-react';

export const AdminSecurityFraud: React.FC = () => {
  const { allUsers, toggleUserBan } = useEsports();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-gaming font-bold text-white text-base">SECURITY &amp; ANTI-FRAUD INTELLIGENCE</h3>
        <p className="text-xs text-slate-400">
          Hardware fingerprint inspection, duplicate IP multi-account detection, and one-click user suspension.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Anti-Cheat Rules Card */}
        <div className="p-4 rounded-2xl bg-[#121824] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF5722] uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> Active Anti-Cheat Guards
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-2.5 rounded-xl bg-[#090D16] border border-white/5 flex items-center justify-between">
              <span>Emulator &amp; Root Detection (BlueStacks, LDPlayer)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                ENFORCED
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090D16] border border-white/5 flex items-center justify-between">
              <span>Duplicate Device Fingerprint Cross-Check</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                ENFORCED
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090D16] border border-white/5 flex items-center justify-between">
              <span>Simultaneous Multi-Slot Reservation Blocker</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                ENFORCED
              </span>
            </div>
          </div>
        </div>

        {/* Flagged Suspicious Accounts */}
        <div className="p-4 rounded-2xl bg-[#121824] border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Multi-Account Flagged IPs
            </span>
            <span className="text-[10px] font-mono text-slate-400">IP: 103.24.182.91</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            2 accounts detected on same IP address within 24 hours. The emulator instance was flagged and auto-suspended.
          </p>
        </div>
      </div>

      {/* Gamers Audit Table */}
      <div className="rounded-2xl bg-[#121824] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-3.5 bg-[#171F2F] border-b border-white/5">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            User Security &amp; Device Ledger ({allUsers.length} Users)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D16] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Player &amp; IGN</th>
                <th className="py-3 px-4">UID</th>
                <th className="py-3 px-4">Device Fingerprint</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {allUsers.map((u) => {
                return (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{u.freeFireIgn}</div>
                      <div className="text-[10px] text-slate-400">{u.name} ({u.email})</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#00E5FF]">
                      {u.freeFireUid}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div className="truncate max-w-[180px]">{u.deviceFingerprint.deviceId}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{u.deviceFingerprint.userAgent}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {u.deviceFingerprint.ipAddress}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          u.isBanned
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : u.deviceFingerprint.isSuspicious
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-[#00E676] border border-emerald-500/30'
                        }`}
                      >
                        {u.isBanned ? 'SUSPENDED' : u.deviceFingerprint.isSuspicious ? 'FLAGGED' : 'CLEAN'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleUserBan(u.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 ml-auto ${
                          u.isBanned
                            ? 'bg-[#00E676]/20 hover:bg-[#00E676]/30 text-[#00E676] border border-[#00E676]/40'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {u.isBanned ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                        {u.isBanned ? 'REVOKE BAN' : 'BAN / SUSPEND'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
