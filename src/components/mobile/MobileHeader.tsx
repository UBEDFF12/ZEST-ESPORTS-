import React from 'react';
import { useEsports } from '../../context/EsportsContext';
import { Trophy, Bell, Plus, ShieldCheck, Copy, Check, LogOut } from 'lucide-react';

interface MobileHeaderProps {
  onOpenNotifications: () => void;
  onOpenDeposit: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenNotifications,
  onOpenDeposit,
}) => {
  const { currentUser, notifications, logout } = useEsports();
  const [copiedUid, setCopiedUid] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const copyUid = () => {
    navigator.clipboard.writeText(currentUser.freeFireUid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  return (
    <header className="px-4 pt-3 pb-2.5 bg-[#090D16]/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-2">
        {/* User Mini Profile */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover border-2 border-[#FF5722]/50 shadow-md shadow-[#FF5722]/20"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00E676] rounded-full border-2 border-[#090D16]"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-gaming font-bold text-sm text-white tracking-wide truncate max-w-[130px]">
                {currentUser.freeFireIgn}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                PRO
              </span>
            </div>
            <button
              onClick={copyUid}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              title="Click to copy UID"
            >
              <span>UID: {currentUser.freeFireUid}</span>
              {copiedUid ? (
                <Check className="w-3 h-3 text-[#00E676]" />
              ) : (
                <Copy className="w-2.5 h-2.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Dual Balance Pill & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Dual Balance Capsule */}
          <div className="flex items-center bg-[#121824] border border-white/10 rounded-xl p-1 gap-1.5 shadow-inner">
            {/* Winnings (Green) */}
            <div
              className="px-2 py-0.5 rounded-lg bg-[#00E676]/10 border border-[#00E676]/20 flex items-center gap-1 cursor-pointer"
              title="Winnings Cash (100% Withdrawable)"
              onClick={onOpenDeposit}
            >
              <Trophy className="w-3 h-3 text-[#00E676]" />
              <div className="flex flex-col leading-none">
                <span className="text-[8px] font-bold text-[#00E676]/80 uppercase">Win</span>
                <span className="text-xs font-black font-gaming text-[#00E676]">
                  ₹{currentUser.winningsBalance}
                </span>
              </div>
            </div>

            {/* Deposit (Cyan) */}
            <div
              className="px-2 py-0.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center gap-1 cursor-pointer"
              title="Deposit Cash (For Match Entry)"
              onClick={onOpenDeposit}
            >
              <span className="text-[9px] font-bold text-[#00E5FF]">₹</span>
              <div className="flex flex-col leading-none">
                <span className="text-[8px] font-bold text-[#00E5FF]/80 uppercase">Dep</span>
                <span className="text-xs font-black font-gaming text-[#00E5FF]">
                  ₹{currentUser.depositBalance}
                </span>
              </div>
            </div>

            {/* Plus Topup Button */}
            <button
              onClick={onOpenDeposit}
              className="w-6 h-6 rounded-lg bg-[#FF5722] hover:bg-[#FF5722]/90 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm shadow-[#FF5722]/40"
              title="Add Deposit Cash"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-[#121824] hover:bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5722] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Quick Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-[#121824] hover:bg-red-500/10 border border-white/10 text-slate-400 hover:text-red-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
