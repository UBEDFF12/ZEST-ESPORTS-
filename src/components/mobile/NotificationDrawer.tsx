import React from 'react';
import { useEsports } from '../../context/EsportsContext';
import { X, Bell, CheckCheck, Trash2, Key, Trophy, Gift, ArrowUpRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToWallet: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToWallet,
}) => {
  const { notifications, markNotificationRead, clearAllNotifications } = useEsports();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-full bg-[#121824] border-l border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-[#171F2F] border-b border-white/5">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF5722]" />
            <h3 className="font-gaming font-bold text-white text-sm tracking-wide">
              NOTIFICATIONS &amp; PUSH ALERTS
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearAllNotifications}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
              <Bell className="w-8 h-8 text-slate-600 mb-2" />
              <span>No notifications at the moment.</span>
            </div>
          ) : (
            notifications.map((notif) => {
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.type === 'prize_credit' || notif.type === 'payout_completed') {
                      onNavigateToWallet();
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    notif.isRead
                      ? 'bg-[#090D16]/50 border-white/5 text-slate-400'
                      : 'bg-[#171F2F] border-[#FF5722]/30 text-slate-200 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        notif.type === 'room_unlock'
                          ? 'bg-[#00E5FF]/20 text-[#00E5FF]'
                          : notif.type === 'prize_credit'
                          ? 'bg-[#00E676]/20 text-[#00E676]'
                          : notif.type === 'payout_completed'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-[#FF5722]/20 text-[#FF5722]'
                      }`}
                    >
                      {notif.type === 'room_unlock' && <Key className="w-3.5 h-3.5" />}
                      {notif.type === 'prize_credit' && <Trophy className="w-3.5 h-3.5" />}
                      {notif.type === 'payout_completed' && <Gift className="w-3.5 h-3.5" />}
                      {notif.type === 'match_reminder' && <Bell className="w-3.5 h-3.5" />}
                      {notif.type === 'system' && <ArrowUpRight className="w-3.5 h-3.5" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-white text-xs">{notif.title}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#FF5722] shrink-0"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                      <span className="text-[9px] text-slate-500 font-mono mt-1 block">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
