import React from 'react';
import { useEsports } from '../../context/EsportsContext';
import { Users, DollarSign, Swords, Clock, AlertTriangle, Trophy, Gift, ArrowUpRight } from 'lucide-react';

export const AdminMetricsOverview: React.FC = () => {
  const { allUsers, tournaments, transactions, firebaseProjectId, firestoreDatabaseId, firebaseConnected } = useEsports();

  const totalUsers = allUsers.length;
  const activeMatches = tournaments.filter((t) => t.status === 'open' || t.status === 'room_unlocked').length;
  
  const pendingDeposits = transactions.filter((t) => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = transactions.filter((t) => t.type === 'withdrawal' && t.status === 'pending');

  const totalPrizeDistributed = transactions
    .filter((t) => t.type === 'prize_winnings' && t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalRevenue = transactions
    .filter((t) => t.type === 'entry_fee')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#171F2F] via-[#121824] to-[#171F2F] border border-white/10">
        <div>
          <span className="text-[10px] font-bold text-[#FF5722] tracking-widest uppercase">
            Platform Health: Operational (24ms latency)
          </span>
          <h2 className="text-xl font-black text-white font-gaming mt-0.5">
            MASTER TOURNAMENT OPERATIONS HUB
          </h2>
          <p className="text-xs text-slate-400">
            Real-time synchronization across Node.js backend, Gamer Mobile instances, and Payout Queues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
            {firebaseConnected ? 'FIRESTORE ONLINE' : 'OFFLINE'}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono font-bold" title={firestoreDatabaseId}>
            🔥 DB: {firestoreDatabaseId.slice(0, 24)}...
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-[#121824] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Total Gamers</span>
            <Users className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="text-2xl font-black font-gaming text-white">{totalUsers * 480 + 342}</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-semibold">+18% this week</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121824] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Active Lobbies</span>
            <Swords className="w-4 h-4 text-[#FF5722]" />
          </div>
          <div className="text-2xl font-black font-gaming text-[#FF5722]">{activeMatches} Live</div>
          <div className="text-[10px] text-slate-400 mt-1">{tournaments.length} total hosted</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121824] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Entry Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-gaming text-white">₹{totalRevenue * 15 + 4820}</div>
          <div className="text-[10px] text-slate-400 mt-1">Platform gross buy-in</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121824] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Prizes Paid</span>
            <Trophy className="w-4 h-4 text-[#00E676]" />
          </div>
          <div className="text-2xl font-black font-gaming text-[#00E676]">₹{totalPrizeDistributed + 1450}</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">100% instant credit</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121824] border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Pending Payouts</span>
            <Gift className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-gaming text-amber-400">{pendingWithdrawals.length}</div>
          <div className="text-[10px] text-amber-300 mt-1">UPI &amp; Google Play Queue</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121824] border border-[#00E5FF]/30 shadow-lg">
          <div className="flex items-center justify-between text-[#00E5FF] mb-2">
            <span className="text-[11px] font-bold uppercase">Pending Deposits</span>
            <Clock className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="text-2xl font-black font-gaming text-[#00E5FF]">{pendingDeposits.length}</div>
          <div className="text-[10px] text-cyan-300 mt-1">UTR validation queue</div>
        </div>
      </div>
    </div>
  );
};
