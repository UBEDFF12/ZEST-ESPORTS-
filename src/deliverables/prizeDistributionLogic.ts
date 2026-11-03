export const PRIZE_DISTRIBUTION_LOGIC_CODE = `// =========================================================================
// ZEST ESPORTS PLATFORM - ADMIN RESULT CALCULATION & PRIZE ENGINE
// Module: prizeDistributionEngine.ts
// Logic: (Kills × PerKillRate) + RankBonus = WinningsCash Credit
// =========================================================================

export interface PlayerScoreInput {
  slotNumber: number;
  userId: string;
  playerIgn: string;
  playerUid: string;
  rank: number; // 1 = Champion / Booyah, 2 = Runner up, etc.
  kills: number;
}

export interface PrizeBreakdown {
  rankPrizes: Record<number, number>; // e.g. { 1: 300, 2: 180, 3: 100, 4: 20, 5: 20 ... }
  perKillPrize: number;               // e.g. ₹15 per kill
  totalPrizePool: number;             // e.g. ₹1200 max pool
}

export interface CalculatedPlayerPayout {
  slotNumber: number;
  userId: string;
  playerIgn: string;
  playerUid: string;
  rank: number;
  kills: number;
  killPrizeEarned: number;
  rankPrizeEarned: number;
  totalPrizeWon: number;
  isBooyah: boolean;
}

export interface DistributionResult {
  tournamentId: string;
  totalCalculatedPayout: number;
  budgetSurplusOrDeficit: number;
  payouts: CalculatedPlayerPayout[];
  disqualifiedPlayers: string[];
}

/**
 * 1. PURE CALCULATION ENGINE
 * Evaluates individual player score sheets against tournament prize brackets
 */
export function calculateTournamentPayouts(
  tournamentId: string,
  scores: PlayerScoreInput[],
  bracket: PrizeBreakdown
): DistributionResult {
  const payouts: CalculatedPlayerPayout[] = [];
  let totalCalculatedPayout = 0;
  const disqualifiedPlayers: string[] = [];

  for (const player of scores) {
    // Edge case: Unranked or disqualified player (Rank 0 or negative)
    if (player.rank <= 0) {
      disqualifiedPlayers.push(player.userId);
      continue;
    }

    // 1. Calculate Kill Earnings: Kills × Per Kill Rate
    const safeKills = Math.max(0, Math.floor(player.kills));
    const killPrizeEarned = safeKills * bracket.perKillPrize;

    // 2. Calculate Rank Placement Bonus
    const rankPrizeEarned = bracket.rankPrizes[player.rank] || 0;

    // 3. Combined Total Prize
    const totalPrizeWon = killPrizeEarned + rankPrizeEarned;
    totalCalculatedPayout += totalPrizeWon;

    payouts.push({
      slotNumber: player.slotNumber,
      userId: player.userId,
      playerIgn: player.playerIgn,
      playerUid: player.playerUid,
      rank: player.rank,
      kills: safeKills,
      killPrizeEarned,
      rankPrizeEarned,
      totalPrizeWon,
      isBooyah: player.rank === 1,
    });
  }

  // Sort by Rank ascending (1, 2, 3...)
  payouts.sort((a, b) => a.rank - b.rank);

  return {
    tournamentId,
    totalCalculatedPayout,
    budgetSurplusOrDeficit: bracket.totalPrizePool - totalCalculatedPayout,
    payouts,
    disqualifiedPlayers,
  };
}

/**
 * 2. ATOMIC DATABASE COMMIT & WALLET DISPATCH
 * Executes database transaction to credit Winnings Cash and generate audit records
 */
export async function executeAtomicPrizeDistribution(
  dbClient: any, // PostgreSQL PoolClient or Firebase Firestore Transaction
  distribution: DistributionResult,
  tournamentTitle: string
): Promise<{ success: boolean; totalCredited: number }> {
  try {
    // BEGIN TRANSACTION
    await dbClient.query('BEGIN');

    for (const payout of distribution.payouts) {
      if (payout.totalPrizeWon <= 0 || !payout.userId) continue;

      // 1. Atomically Credit Player Winnings Cash (100% withdrawable)
      await dbClient.query(
        \`UPDATE users 
         SET winnings_balance = winnings_balance + $1,
             total_earnings = total_earnings + $1,
             total_kills = total_kills + $2,
             total_wins = total_wins + $3,
             updated_at = NOW()
         WHERE id = $4\`,
        [
          payout.totalPrizeWon,
          payout.kills,
          payout.isBooyah ? 1 : 0,
          payout.userId,
        ]
      );

      // 2. Insert Immutable Financial Transaction Ledger
      const refId = \`PRIZE-\${distribution.tournamentId.toUpperCase()}-R\${payout.rank}-S\${payout.slotNumber}\`;
      await dbClient.query(
        \`INSERT INTO transactions (
           id, user_id, type, amount, wallet_source, status, reference_id, description, metadata
         ) VALUES (
           gen_random_uuid(), $1, 'prize_winnings', $2, 'winnings', 'completed', $3, $4, $5
         )\`,
        [
          payout.userId,
          payout.totalPrizeWon,
          refId,
          \`Prize Winnings: \${tournamentTitle} (Rank #\${payout.rank}, \${payout.kills} Kills)\`,
          JSON.stringify({
            tournamentId: distribution.tournamentId,
            rank: payout.rank,
            kills: payout.kills,
            killPrize: payout.killPrizeEarned,
            rankPrize: payout.rankPrizeEarned,
          }),
        ]
      );
    }

    // 3. Mark Tournament as COMPLETED
    await dbClient.query(
      \`UPDATE tournaments 
       SET status = 'completed', updated_at = NOW() 
       WHERE id = $1\`,
      [distribution.tournamentId]
    );

    await dbClient.query('COMMIT');
    return { success: true, totalCredited: distribution.totalCalculatedPayout };
  } catch (error) {
    await dbClient.query('ROLLBACK');
    throw error;
  }
}
`;
