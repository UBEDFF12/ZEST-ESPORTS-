export type TournamentMode = 'Classic BR' | 'CS 1v1' | 'CS 4v4' | 'Lone Wolf';
export type MatchStatus = 'upcoming' | 'open' | 'room_locked' | 'room_unlocked' | 'live' | 'completed' | 'cancelled';
export type TransactionType = 'deposit' | 'withdrawal' | 'entry_fee' | 'prize_winnings' | 'referral_bonus';
export type TransactionStatus = 'pending' | 'completed' | 'rejected';
export type WithdrawalMethod = 'upi' | 'google_play_code';
export type UserRole = 'player' | 'admin' | 'moderator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  freeFireIgn: string; // In-Game Name
  freeFireUid: string; // In-Game UID
  depositBalance: number; // Deposit Cash (unwithdrawable, for match entry)
  winningsBalance: number; // Winnings Cash (100% withdrawable)
  matchesPlayed: number;
  totalKills: number;
  totalWins: number;
  winRate: number; // percentage
  totalEarnings: number;
  referralCode: string;
  referredBy?: string;
  referralEarnings: number;
  deviceFingerprint: {
    deviceId: string;
    ipAddress: string;
    userAgent: string;
    isSuspicious: boolean;
  };
  isBanned: boolean;
  createdAt: string;
}

export interface TournamentSlot {
  slotNumber: number;
  userId?: string;
  playerIgn?: string;
  playerUid?: string;
  bookedAt?: string;
  isBooked: boolean;
}

export interface Tournament {
  id: string;
  title: string;
  mode: TournamentMode;
  map: 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Nexterra' | 'Iron Cage';
  bannerUrl: string;
  entryFee: number;
  perKillPrize: number;
  totalPrizePool: number;
  maxSlots: number;
  bookedSlotsCount: number;
  slots: TournamentSlot[];
  scheduleTime: string; // ISO string
  roomUnlockMinutesBefore: number; // e.g. 15
  roomId?: string;
  roomPassword?: string;
  isRoomRevealed: boolean;
  status: MatchStatus;
  rankPrizes: {
    rank1: number;
    rank2: number;
    rank3: number;
    rank4To10?: number;
  };
  rules: string[];
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number;
  walletSource: 'deposit' | 'winnings' | 'both';
  status: TransactionStatus;
  timestamp: string;
  referenceId: string; // UTR or Payout Ref
  description: string;
  metadata?: {
    upiId?: string;
    targetGmail?: string;
    redeemCode?: string;
    utrNumber?: string;
    screenshotUrl?: string;
    tournamentId?: string;
    tournamentTitle?: string;
    kills?: number;
    rank?: number;
    rejectionReason?: string;
  };
}

export interface RedeemCodeInventory {
  id: string;
  denomination: number; // 10, 30, 80, 100, 250
  code: string;
  isUsed: boolean;
  usedByUserId?: string;
  assignedAt?: string;
  sentToEmail?: string;
}

export interface MatchScoreEntry {
  slotNumber: number;
  userId: string;
  playerIgn: string;
  playerUid: string;
  rank: number;
  kills: number;
  killPrizeEarned: number;
  rankPrizeEarned: number;
  totalWon: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'room_unlock' | 'prize_credit' | 'payout_completed' | 'match_reminder' | 'system';
  timestamp: string;
  isRead: boolean;
  actionData?: Record<string, any>;
}

export interface ReferralUser {
  rank: number;
  name: string;
  ign: string;
  referralCount: number;
  totalEarned: number;
  avatar: string;
}
