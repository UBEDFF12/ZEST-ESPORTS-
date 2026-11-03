import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { MobileHeader } from './MobileHeader';
import { TournamentArena } from './TournamentArena';
import { MobileWalletScreen } from './MobileWalletScreen';
import { MobileProfileScreen } from './MobileProfileScreen';
import { MobileReferralScreen } from './MobileReferralScreen';
import { MobileAuthScreen } from './MobileAuthScreen';
import { NotificationDrawer } from './NotificationDrawer';
import { Swords, Wallet, Gift, User } from 'lucide-react';

export const MobileAppFrame: React.FC = () => {
  const { isAuthenticated } = useEsports();
  const [currentTab, setCurrentTab] = useState<'arena' | 'wallet' | 'referrals' | 'profile'>('arena');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#060911] flex justify-center text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Clean full-width mobile container (centered on wider desktop displays) */}
      <div className="w-full max-w-md min-h-screen bg-[#090D16] flex flex-col relative sm:border-x sm:border-white/10 sm:shadow-2xl">
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col overflow-y-auto">
            <MobileAuthScreen />
          </div>
        ) : (
          <>
            {/* Native Mobile App Header */}
            <MobileHeader
              onOpenNotifications={() => setIsNotifOpen(true)}
              onOpenDeposit={() => setCurrentTab('wallet')}
            />

            {/* Scrollable Tab Views */}
            <main className="flex-1 overflow-y-auto">
              {currentTab === 'arena' && <TournamentArena />}
              {currentTab === 'wallet' && <MobileWalletScreen />}
              {currentTab === 'referrals' && <MobileReferralScreen />}
              {currentTab === 'profile' && <MobileProfileScreen />}
            </main>

            {/* Esports Neon Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#090D16]/95 backdrop-blur-md border-t border-white/10 py-1.5 px-4 z-40">
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

              {/* Home indicator bar */}
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
