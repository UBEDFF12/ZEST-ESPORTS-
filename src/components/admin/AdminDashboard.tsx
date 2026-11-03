import React, { useState } from 'react';
import { AdminMetricsOverview } from './AdminMetricsOverview';
import { AdminMatchManager } from './AdminMatchManager';
import { AdminPrizeEngine } from './AdminPrizeEngine';
import { AdminPayoutQueue } from './AdminPayoutQueue';
import { AdminDepositsQueue } from './AdminDepositsQueue';
import { AdminSecurityFraud } from './AdminSecurityFraud';
import {
  LayoutDashboard,
  Swords,
  Trophy,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldAlert,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'matches' | 'prizes' | 'payouts' | 'deposits' | 'security'
  >('overview');

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      {/* Admin Sub-Navigation Bar */}
      <div className="bg-[#121824] border-b border-white/10 px-4 sm:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> OVERVIEW &amp; METRICS
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3.5 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'matches'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Swords className="w-3.5 h-3.5" /> MATCHES &amp; ROOMS
          </button>

          <button
            onClick={() => setActiveTab('prizes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'prizes'
                ? 'bg-[#00E676] text-[#090D16] shadow-md shadow-[#00E676]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> RESULT &amp; PRIZE ENGINE
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'payouts'
                ? 'bg-[#00E5FF] text-[#090D16] shadow-md shadow-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> PAYOUT QUEUE (UPI &amp; CODES)
          </button>

          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-3.5 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'deposits'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" /> DEPOSITS (UTR)
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'security'
                ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> ANTI-CHEAT &amp; FRAUD
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        {activeTab === 'overview' && <AdminMetricsOverview />}
        {activeTab === 'matches' && <AdminMatchManager />}
        {activeTab === 'prizes' && <AdminPrizeEngine />}
        {activeTab === 'payouts' && <AdminPayoutQueue />}
        {activeTab === 'deposits' && <AdminDepositsQueue />}
        {activeTab === 'security' && <AdminSecurityFraud />}
      </main>
    </div>
  );
};
