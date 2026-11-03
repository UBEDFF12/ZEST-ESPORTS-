import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { MobileHeader } from './MobileHeader';
import { TournamentArena } from './TournamentArena';
import { MobileWalletScreen } from './MobileWalletScreen';
import { MobileProfileScreen } from './MobileProfileScreen';
import { MobileReferralScreen } from './MobileReferralScreen';
import { MobileAuthScreen } from './MobileAuthScreen';
import { NotificationDrawer } from './NotificationDrawer';
import { Swords, Wallet, Gift, User, Wifi, Battery, Signal, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface MobileAppFrameProps {
  embeddedInDualView?: boolean;
}

export const MobileAppFrame: React.FC<MobileAppFrameProps> = ({ embeddedInDualView = false }) => {
  const { isAuthenticated } = useEsports();
  const [currentTab, setCurrentTab] = useState<'arena' | 'wallet' | 'referrals' | 'profile'>('arena');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(!embeddedInDualView);

  // Current real-time clock for phone status bar
  const [timeStr, setTimeStr] = useState('09:41');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center ${embeddedInDualView ? 'h-full w-full' : 'py-4 min-h-screen'}`}>
      {/* Frame mode toggle bar (when not in dual-view) */}
      {!embeddedInDualView && (
        <div className="mb-3 flex items-center gap-2 bg-[#121824] px-3 py-1.5 rounded-full border border-white/10 text-xs">
          <Smartphone className="w-3.5 h-3.5 text-[#FF5722]" />
          <span className="text-slate-300 font-semibold">Gamer Mobile Preview</span>
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="ml-2 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] flex items-center gap-1"
          >
            {deviceFrameMode ? <Maximize2 className="w-2.5 h-2.5" /> : <Minimize2 className="w-2.5 h-2.5" />}
            {deviceFrameMode ? 'Expand Full' : 'Android Frame'}
          </button>
        </div>
      )}

      {/* Main Container / Phone Mockup */}
      <div
        className={`w-full bg-[#090D16] flex flex-col relative transition-all overflow-hidden ${
          deviceFrameMode
            ? 'max-w-[420px] h-[860px] rounded-[42px] border-[10px] border-[#1E293B] shadow-[0_0_60px_-15px_rgba(255,87,34,0.3)] ring-1 ring-white/10'
            : 'max-w-2xl min-h-[750px] rounded-2xl border border-white/10 shadow-2xl'
        }`}
      >
        {/* Android Punch Hole & Status Bar */}
        <div className="px-6 pt-3 pb-1 flex items-center justify-between text-xs text-slate-300 font-mono select-none bg-[#090D16] z-40">
          <span className="font-bold tracking-tight text-[11px]">{timeStr}</span>

          {/* Camera Notch Punch hole */}
          <div className="w-4 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A2333]"></span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-[#00E676]" />
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 overflow-y-auto">
            <MobileAuthScreen />
          </div>
        ) : (
          <>
            {/* Mobile Header */}
            <MobileHeader
              onOpenNotifications={() => setIsNotifOpen(true)}
              onOpenDeposit={() => setCurrentTab('wallet')}
            />

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto">
              {currentTab === 'arena' && <TournamentArena />}
              {currentTab === 'wallet' && <MobileWalletScreen />}
              {currentTab === 'referrals' && <MobileReferralScreen />}
              {currentTab === 'profile' && <MobileProfileScreen />}
            </div>

            {/* Android Bottom Navigation Bar */}
            <nav className="absolute bottom-0 left-0 right-0 bg-[#090D16]/95 backdrop-blur-md border-t border-white/10 py-1.5 px-4 z-30">
              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() => setCurrentTab('arena')}
                  className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                    currentTab === 'arena'
                      ? 'text-[#FF5722]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Swords className={`w-5 h-5 ${currentTab === 'arena' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] font-gaming font-bold tracking-wider mt-0.5">ARENA</span>
                </button>

                <button
                  onClick={() => setCurrentTab('wallet')}
                  className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                    currentTab === 'wallet'
                      ? 'text-[#00E5FF]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wallet className={`w-5 h-5 ${currentTab === 'wallet' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] font-gaming font-bold tracking-wider mt-0.5">WALLET</span>
                </button>

                <button
                  onClick={() => setCurrentTab('referrals')}
                  className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                    currentTab === 'referrals'
                      ? 'text-amber-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Gift className={`w-5 h-5 ${currentTab === 'referrals' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] font-gaming font-bold tracking-wider mt-0.5">BOUNTY</span>
                </button>

                <button
                  onClick={() => setCurrentTab('profile')}
                  className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                    currentTab === 'profile'
                      ? 'text-[#00E676]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] font-gaming font-bold tracking-wider mt-0.5">PROFILE</span>
                </button>
              </div>

              {/* Android Gesture Bar */}
              <div className="w-28 h-1 bg-white/20 rounded-full mx-auto mt-1.5"></div>
            </nav>
          </>
        )}

        {/* Notifications Drawer */}
        <NotificationDrawer
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          onNavigateToWallet={() => setCurrentTab('wallet')}
        />
      </div>
    </div>
  );
};
