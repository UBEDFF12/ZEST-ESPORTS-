import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { MatchScoreEntry } from '../../types';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle, Calculator, Sparkles, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminPrizeEngine: React.FC = () => {
  const { tournaments, distributeTournamentPrizes } = useEsports();

  // Pick an active or upcoming tournament to declare results
  const eligibleTournaments = tournaments.filter((t) => t.status !== 'completed' && t.bookedSlotsCount > 0);
  const [selectedTourId, setSelectedTourId] = useState<string>(eligibleTournaments[0]?.id || tournaments[0]?.id || '');

  const activeTour = tournaments.find((t) => t.id === selectedTourId);

  // Score sheet state for each booked slot
  const [scoreRows, setScoreRows] = useState<Record<number, { rank: number; kills: number }>>({
    12: { rank: 1, kills: 7 }, // Pre-fill current user as Champion for easy testing!
    1: { rank: 2, kills: 4 },
    2: { rank: 3, kills: 2 },
    3: { rank: 4, kills: 1 },
    4: { rank: 5, kills: 3 },
  });

  const [distributionSuccess, setDistributionSuccess] = useState<{ total: number; count: number } | null>(null);

  const handleScoreChange = (slotNumber: number, field: 'rank' | 'kills', value: number) => {
    setScoreRows((prev) => ({
      ...prev,
      [slotNumber]: {
        rank: field === 'rank' ? value : prev[slotNumber]?.rank || 10,
        kills: field === 'kills' ? value : prev[slotNumber]?.kills || 0,
      },
    }));
  };

  // Compute calculated prize for a slot
  const calculateSlotWon = (rank: number, kills: number): { killsEarned: number; rankEarned: number; total: number } => {
    if (!activeTour) return { killsEarned: 0, rankEarned: 0, total: 0 };
    const perKillRate = activeTour.perKillPrize || 15;
    const killsEarned = Math.max(0, kills) * perKillRate;
    let rankEarned = 0;
    if (rank === 1) rankEarned = activeTour.rankPrizes.rank1;
    else if (rank === 2) rankEarned = activeTour.rankPrizes.rank2;
    else if (rank === 3) rankEarned = activeTour.rankPrizes.rank3;
    else if (rank >= 4 && rank <= 10) rankEarned = activeTour.rankPrizes.rank4To10 || 0;

    return { killsEarned, rankEarned, total: killsEarned + rankEarned };
  };

  // Total payout sum calculated live
  const bookedSlots = activeTour ? activeTour.slots.filter((s) => s.isBooked) : [];
  const totalCalculatedPayout = bookedSlots.reduce((acc, slot) => {
    const row = scoreRows[slot.slotNumber] || { rank: 10, kills: 0 };
    return acc + calculateSlotWon(row.rank, row.kills).total;
  }, 0);

  const handleExecutePrizeDistribution = () => {
    if (!activeTour) return;

    const payload: MatchScoreEntry[] = bookedSlots.map((slot) => {
      const row = scoreRows[slot.slotNumber] || { rank: 10, kills: 0 };
      const calc = calculateSlotWon(row.rank, row.kills);
      return {
        slotNumber: slot.slotNumber,
        userId: slot.userId || `mock_${slot.slotNumber}`,
        playerIgn: slot.playerIgn || `PLAYER_${slot.slotNumber}`,
        playerUid: slot.playerUid || '000000',
        rank: row.rank,
        kills: row.kills,
        killPrizeEarned: calc.killsEarned,
        rankPrizeEarned: calc.rankEarned,
        totalWon: calc.total,
      };
    });

    const result = distributeTournamentPrizes(activeTour.id, payload);

    if (result.success) {
      setDistributionSuccess({ total: result.totalDistributed, count: payload.length });

      // Fire celebratory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5722', '#00E5FF', '#00E676', '#FFB300'],
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-gaming font-bold text-white text-base">
            RESULT DECLARATION &amp; PRIZE DISTRIBUTION ENGINE
          </h3>
          <p className="text-xs text-slate-400">
            Bulk score input sheet: <code className="text-[#FF5722]">(Kills × PerKill) + RankBonus = Winnings Cash</code> credit.
          </p>
        </div>

        {/* Tournament Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Select Tournament:</span>
          <select
            value={selectedTourId}
            onChange={(e) => {
              setSelectedTourId(e.target.value);
              setDistributionSuccess(null);
            }}
            className="px-3 py-2 rounded-xl bg-[#121824] border border-white/10 text-white text-xs font-gaming focus:outline-none focus:border-[#FF5722]"
          >
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {distributionSuccess && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00E676]/20 via-[#121824] to-[#00E5FF]/20 border border-[#00E676]/40 flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E676]/20 text-[#00E676] flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-gaming font-bold text-white text-sm">
                PRIZES CREDITED SUCCESSFULLY! 🏆
              </h4>
              <p className="text-xs text-slate-300">
                ₹{distributionSuccess.total} was instantly credited into {distributionSuccess.count} players&apos;
                Winnings Cash with immutable audit ledger logs.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#00E676] bg-[#00E676]/20 px-3 py-1 rounded-full border border-[#00E676]/30">
            COMPLETED 100%
          </span>
        </div>
      )}

      {/* Overview & Live Calculation Summary */}
      {activeTour && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#121824] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Prize Pool Budget</div>
            <div className="text-lg font-black font-gaming text-white">₹{activeTour.totalPrizePool}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#121824] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Per Kill Bounty</div>
            <div className="text-lg font-black font-gaming text-[#00E5FF]">₹{activeTour.perKillPrize}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#121824] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Payout Calculated</div>
            <div className="text-lg font-black font-gaming text-[#00E676]">₹{totalCalculatedPayout}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#121824] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Surplus / Margin</div>
            <div className="text-lg font-black font-gaming text-amber-400">
              ₹{activeTour.totalPrizePool - totalCalculatedPayout}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Score Input Sheet Table */}
      <div className="rounded-2xl bg-[#121824] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-3.5 bg-[#171F2F] border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-[#FF5722]" /> Score Sheet Roster ({bookedSlots.length} Booked Participants)
          </span>
          <span className="text-[11px] text-slate-400">
            Tip: Slot #12 is logged in as test user <strong className="text-[#00E5FF]">ZEST_SNIPER_99</strong>
          </span>
        </div>

        <div className="overflow-x-auto max-h-[420px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D16] text-slate-400 font-bold uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-white/5">
              <tr>
                <th className="py-2.5 px-3">Slot</th>
                <th className="py-2.5 px-3">Player IGN</th>
                <th className="py-2.5 px-3">UID</th>
                <th className="py-2.5 px-3">Rank (Placement)</th>
                <th className="py-2.5 px-3">Kills</th>
                <th className="py-2.5 px-3">Rank Bonus</th>
                <th className="py-2.5 px-3">Kill Prize</th>
                <th className="py-2.5 px-3 text-right">Total Winnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
              {bookedSlots.map((slot) => {
                const row = scoreRows[slot.slotNumber] || { rank: 10, kills: 0 };
                const calc = calculateSlotWon(row.rank, row.kills);
                const isCurrentUser = slot.userId === 'usr_zest_99';

                return (
                  <tr
                    key={slot.slotNumber}
                    className={`hover:bg-white/[0.02] ${isCurrentUser ? 'bg-[#FF5722]/10 border-l-2 border-l-[#FF5722]' : ''}`}
                  >
                    <td className="py-2 px-3 font-bold text-[#FF5722]">#{slot.slotNumber}</td>
                    <td className="py-2 px-3 font-gaming font-bold text-white">
                      {slot.playerIgn} {isCurrentUser && <span className="text-[10px] text-[#00E5FF] font-sans font-normal">(YOU)</span>}
                    </td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">{slot.playerUid}</td>

                    <td className="py-2 px-3">
                      <select
                        value={row.rank}
                        onChange={(e) => handleScoreChange(slot.slotNumber, 'rank', Number(e.target.value))}
                        className="px-2 py-1 rounded bg-[#090D16] border border-white/10 text-white font-bold"
                      >
                        <option value="1">#1 (Booyah)</option>
                        <option value="2">#2 (Runner Up)</option>
                        <option value="3">#3 (3rd Place)</option>
                        <option value="4">#4</option>
                        <option value="5">#5</option>
                        <option value="6">#6</option>
                        <option value="10">#10 (Top 10)</option>
                        <option value="20">#20+ (No Rank Prize)</option>
                      </select>
                    </td>

                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={row.kills}
                        onChange={(e) => handleScoreChange(slot.slotNumber, 'kills', Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded bg-[#090D16] border border-white/10 text-white font-bold text-center"
                      />
                    </td>

                    <td className="py-2 px-3 text-amber-400 font-bold">₹{calc.rankEarned}</td>
                    <td className="py-2 px-3 text-[#00E5FF]">₹{calc.killsEarned}</td>
                    <td className="py-2 px-3 text-right font-black font-gaming text-[#00E676] text-sm">
                      ₹{calc.total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Trigger Bar */}
        <div className="p-4 bg-[#171F2F] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            <span>Calculated Payout: </span>
            <strong className="text-white text-sm font-gaming">₹{totalCalculatedPayout}</strong>
            <span className="mx-2">•</span>
            <span>Allocated to: </span>
            <strong className="text-[#00E676]">{bookedSlots.length} Players</strong>
          </div>

          <button
            onClick={handleExecutePrizeDistribution}
            disabled={activeTour?.status === 'completed'}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00E5FF] hover:opacity-90 disabled:opacity-50 text-[#090D16] font-gaming font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#00E676]/30 active:scale-95 transition-all"
          >
            <Trophy className="w-4 h-4 text-[#090D16]" />
            {activeTour?.status === 'completed'
              ? 'PRIZES ALREADY DISTRIBUTED'
              : 'ONE-CLICK: DISTRIBUTE PRIZES & CREDIT WALLETS'}
          </button>
        </div>
      </div>
    </div>
  );
};
