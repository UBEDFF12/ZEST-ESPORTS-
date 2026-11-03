import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { Share2, Copy, Check, Trophy, Users, Gift, Medal, Sparkles } from 'lucide-react';

export const MobileReferralScreen: React.FC = () => {
  const { currentUser, referralLeaderboard } = useEsports();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://zestesports.gg/join?ref=${currentUser.referralCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-2">
      {/* Hero Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FF5722]/20 via-[#121824] to-[#00E5FF]/20 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-[#FF5722] text-xs font-bold uppercase tracking-wider">
          <Gift className="w-4 h-4 text-[#FF5722]" /> Referral &amp; Bounty Program
        </div>
        <h2 className="text-xl font-black text-white font-gaming mt-1">
          INVITE SQUAD, EARN ₹25 CASH
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Get ₹25 Deposit Cash credited directly into your wallet for every friend who signs up and joins their first match.
        </p>

        {/* Unique Referral Code Box */}
        <div className="mt-4 p-3 rounded-xl bg-[#090D16] border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Your Unique Code</div>
            <div className="font-mono text-lg font-black text-[#00E5FF] tracking-wider">
              {currentUser.referralCode}
            </div>
          </div>
          <button
            onClick={copyCode}
            className="px-3.5 py-1.5 rounded-lg bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold flex items-center gap-1.5 border border-[#00E5FF]/30 transition-transform active:scale-95"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCode ? 'COPIED' : 'COPY'}
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={copyLink}
          className="mt-3 w-full py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-gaming font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF5722]/30 active:scale-98 transition-all"
        >
          <Share2 className="w-4 h-4" />
          {copiedLink ? 'INVITE LINK COPIED!' : 'SHARE INVITATION LINK'}
        </button>
      </div>

      {/* User's Referral Performance */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-[#121824] border border-white/5 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Referrals</div>
          <div className="text-xl font-black font-gaming text-white mt-0.5">
            14 <span className="text-xs font-sans text-slate-500 font-normal">Gamers</span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121824] border border-white/5 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Referral Earnings</div>
          <div className="text-xl font-black font-gaming text-[#00E676] mt-0.5">
            ₹{currentUser.referralEarnings}
          </div>
        </div>
      </div>

      {/* Dynamic Leaderboard */}
      <div className="p-4 rounded-2xl bg-[#121824] border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" /> Top Referrers Leaderboard
          </span>
          <span className="text-[10px] text-slate-500 font-mono">SEASON 8</span>
        </div>

        <div className="space-y-2">
          {referralLeaderboard.map((user) => {
            return (
              <div
                key={user.rank}
                className="p-2.5 rounded-xl bg-[#090D16] border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-lg font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                      user.rank === 1
                        ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                        : user.rank === 2
                        ? 'bg-slate-300 text-black'
                        : user.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    #{user.rank}
                  </div>

                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />

                  <div>
                    <div className="font-bold text-white font-gaming tracking-wide">{user.ign}</div>
                    <div className="text-[10px] text-slate-500">{user.referralCount} Joined</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black font-gaming text-sm text-[#00E676]">₹{user.totalEarned}</div>
                  <div className="text-[9px] text-slate-500">Won</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
