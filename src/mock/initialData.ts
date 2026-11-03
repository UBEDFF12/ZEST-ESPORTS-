import { UserProfile, Tournament, Transaction, RedeemCodeInventory, ReferralUser, AppNotification } from '../types';

export const INITIAL_CURRENT_USER: UserProfile = {
  id: 'usr_zest_99',
  name: 'Ayan Sharma',
  email: 'ajubaid.ik@gmail.com',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
  freeFireIgn: 'ZEST_SNIPER_99',
  freeFireUid: '7849103942',
  depositBalance: 240, // ₹240 (for match entry)
  winningsBalance: 820, // ₹820 (100% withdrawable)
  matchesPlayed: 48,
  totalKills: 184,
  totalWins: 19,
  winRate: 39.5,
  totalEarnings: 3450,
  referralCode: 'ZEST-SNIPER-99',
  referralEarnings: 350,
  deviceFingerprint: {
    deviceId: 'ASUS_ROG_PHONE_7_AI892',
    ipAddress: '103.24.182.91',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; ASUS_AI2205) AppleWebKit/537.36 Chrome/124.0.0.0 Mobile Safari/537.36',
    isSuspicious: false,
  },
  isBanned: false,
  createdAt: '2026-08-14T10:00:00Z',
};

export const MOCK_ALL_USERS: UserProfile[] = [
  INITIAL_CURRENT_USER,
  {
    id: 'usr_toxic_01',
    name: 'Rohan Verma',
    email: 'rohan.toxic@gmail.com',
    phone: '+91 98111 22334',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    freeFireIgn: 'TOXIC_VIPER_YT',
    freeFireUid: '8912048571',
    depositBalance: 120,
    winningsBalance: 450,
    matchesPlayed: 62,
    totalKills: 230,
    totalWins: 24,
    winRate: 38.7,
    totalEarnings: 4200,
    referralCode: 'ZEST-TOXIC-01',
    referralEarnings: 200,
    deviceFingerprint: {
      deviceId: 'ONEPLUS_12R_OP592',
      ipAddress: '49.36.19.14',
      userAgent: 'Android OnePlus 12R',
      isSuspicious: false,
    },
    isBanned: false,
    createdAt: '2026-07-20T12:00:00Z',
  },
  {
    id: 'usr_queen_02',
    name: 'Pooja Rawat',
    email: 'pooja.esports@gmail.com',
    phone: '+91 97222 33445',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    freeFireIgn: 'ZEST_VALKYRIE',
    freeFireUid: '6741098234',
    depositBalance: 80,
    winningsBalance: 1450,
    matchesPlayed: 74,
    totalKills: 310,
    totalWins: 32,
    winRate: 43.2,
    totalEarnings: 6800,
    referralCode: 'ZEST-QUEEN-02',
    referralEarnings: 550,
    deviceFingerprint: {
      deviceId: 'IQOO_12_PRO_IQ99',
      ipAddress: '157.34.88.19',
      userAgent: 'Android iQOO 12 Pro',
      isSuspicious: false,
    },
    isBanned: false,
    createdAt: '2026-06-11T09:00:00Z',
  },
  {
    id: 'usr_bad_actor',
    name: 'Fake Account Multi',
    email: 'hacker99@tempmail.com',
    phone: '+91 90000 00000',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    freeFireIgn: 'SPEED_HACKER_FF',
    freeFireUid: '1122334455',
    depositBalance: 0,
    winningsBalance: 0,
    matchesPlayed: 3,
    totalKills: 28,
    totalWins: 3,
    winRate: 100,
    totalEarnings: 300,
    referralCode: 'ZEST-CHEAT-00',
    referralEarnings: 0,
    deviceFingerprint: {
      deviceId: 'EMULATOR_BLUESTACKS_ROOT',
      ipAddress: '103.24.182.91', // Duplicate IP flag!
      userAgent: 'BlueStacks Android 9 Rooted',
      isSuspicious: true,
    },
    isBanned: true,
    createdAt: '2026-11-01T14:00:00Z',
  }
];

// Helper to generate slots
const generateSlots = (max: number, bookedCount: number, currentUserId?: string): any[] => {
  const slots = [];
  const sampleIgns = [
    'DEADSHOT_47', 'KRONOS_FF', 'THUNDER_BOT', 'NINJA_GOD', 'VIPER_X', 
    'SKULL_CRUSHER', 'ASSASSIN_99', 'BLAZE_KID', 'OMEGA_WARRIOR', 'GHOST_RIDER',
    'TITAN_SLAYER', 'SHADOW_HUNTER', 'VALKYRIE_07', 'CYBER_PUNK', 'NEON_SAMURAI',
    'ALPHA_WOLF', 'SAVAGE_BEAST', 'BULLET_STORM', 'PHOENIX_FIRE', 'DRAGON_BREATH',
    'FROST_BITE', 'ECLIPSE_SOLO', 'VENOM_FANG', 'IRON_FIST', 'STORM_BRINGER',
    'HYDRA_LEADER', 'CHAOS_KNIGHT', 'WAR_MACHINE', 'APEX_PREDATOR', 'SOLO_KING'
  ];

  for (let i = 1; i <= max; i++) {
    const isBooked = i <= bookedCount;
    const isCurrentUserSlot = i === 12; // Let current user own slot 12 in the upcoming match!
    
    slots.push({
      slotNumber: i,
      userId: isCurrentUserSlot ? currentUserId : (isBooked ? `usr_mock_${i}` : undefined),
      playerIgn: isCurrentUserSlot ? 'ZEST_SNIPER_99' : (isBooked ? (sampleIgns[i % sampleIgns.length] || `PLAYER_${i}`) : undefined),
      playerUid: isCurrentUserSlot ? '7849103942' : (isBooked ? `7890${1000 + i}` : undefined),
      bookedAt: isBooked ? new Date(Date.now() - (max - i) * 120000).toISOString() : undefined,
      isBooked: isBooked,
    });
  }
  return slots;
};

// Current time reference
const now = Date.now();

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tour_br_01',
    title: 'BERMUDA SUPREMACY #482 [SOLO BR]',
    mode: 'Classic BR',
    map: 'Bermuda',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    entryFee: 30,
    perKillPrize: 15,
    totalPrizePool: 1200,
    maxSlots: 48,
    bookedSlotsCount: 42,
    slots: generateSlots(48, 42, 'usr_zest_99'),
    scheduleTime: new Date(now + 18 * 60 * 1000).toISOString(), // 18 mins from now -> locked now, but will unlock at 15 mins!
    roomUnlockMinutesBefore: 15,
    roomId: '8910482',
    roomPassword: 'ZEST@99',
    isRoomRevealed: false,
    status: 'open',
    rankPrizes: {
      rank1: 300,
      rank2: 180,
      rank3: 100,
      rank4To10: 20,
    },
    rules: [
      'Emulators strictly banned. Mobile-only tournament.',
      'Teaming up or hacking will lead to permanent hardware device ban.',
      'Screenshots of match end results are required for any disputes within 10 minutes.',
      'Room ID & Password unlock exactly 15 minutes before match start.'
    ]
  },
  {
    id: 'tour_cs_01',
    title: 'CS 4V4 GRAND SHOWDOWN [SQUAD CLASH]',
    mode: 'CS 4v4',
    map: 'Kalahari',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    entryFee: 100,
    perKillPrize: 25,
    totalPrizePool: 1800,
    maxSlots: 8, // 8 Squads (32 players)
    bookedSlotsCount: 7,
    slots: generateSlots(8, 7),
    scheduleTime: new Date(now + 9 * 60 * 1000).toISOString(), // 9 mins from now -> ALREADY UNLOCKED (< 15 mins)!
    roomUnlockMinutesBefore: 15,
    roomId: '7729104',
    roomPassword: 'CLASH#44',
    isRoomRevealed: true,
    status: 'room_unlocked',
    rankPrizes: {
      rank1: 1000,
      rank2: 500,
      rank3: 300,
    },
    rules: [
      'Standard Clash Squad Rules. Limited ammo ON.',
      'Gun attributes NO. Character skills YES.',
      'Room ID and Password are now live below. Join within 7 minutes!'
    ]
  },
  {
    id: 'tour_1v1_01',
    title: 'LONE WOLF 1V1 GLORY DUEL [ONE TAP ONLY]',
    mode: 'Lone Wolf',
    map: 'Iron Cage',
    bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    entryFee: 50,
    perKillPrize: 30,
    totalPrizePool: 300,
    maxSlots: 2,
    bookedSlotsCount: 1,
    slots: generateSlots(2, 1),
    scheduleTime: new Date(now + 45 * 60 * 1000).toISOString(),
    roomUnlockMinutesBefore: 15,
    roomId: '5519820',
    roomPassword: 'WOLF#01',
    isRoomRevealed: false,
    status: 'open',
    rankPrizes: {
      rank1: 220,
      rank2: 80,
      rank3: 0,
    },
    rules: [
      'Desert Eagle / Woodpecker / M1887 headshot only.',
      'First to win 5 rounds claims champion bounty.',
      'Screen recorder must be kept running from start to finish.'
    ]
  },
  {
    id: 'tour_cs1v1_02',
    title: 'PURGATORY CS 1V1 SNIPER ROYALE',
    mode: 'CS 1v1',
    map: 'Purgatory',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    entryFee: 40,
    perKillPrize: 20,
    totalPrizePool: 250,
    maxSlots: 2,
    bookedSlotsCount: 2,
    slots: generateSlots(2, 2),
    scheduleTime: new Date(now + 60 * 60 * 1000).toISOString(),
    roomUnlockMinutesBefore: 15,
    roomId: '4481923',
    roomPassword: 'SNIPER#99',
    isRoomRevealed: false,
    status: 'open',
    rankPrizes: {
      rank1: 180,
      rank2: 70,
      rank3: 0,
    },
    rules: [
      'AWM / Kar98k sniper rifles only.',
      'Armor lvl 3 and helmet lvl 3 provided.',
      'No grenades or smoke.'
    ]
  },
  {
    id: 'tour_br_completed_01',
    title: 'NEXTERRA MEGA BR #481 [FINISHED]',
    mode: 'Classic BR',
    map: 'Nexterra',
    bannerUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    entryFee: 30,
    perKillPrize: 15,
    totalPrizePool: 1200,
    maxSlots: 48,
    bookedSlotsCount: 48,
    slots: generateSlots(48, 48),
    scheduleTime: new Date(now - 120 * 60 * 1000).toISOString(),
    roomUnlockMinutesBefore: 15,
    roomId: '9002134',
    roomPassword: 'DONE@481',
    isRoomRevealed: true,
    status: 'completed',
    rankPrizes: {
      rank1: 300,
      rank2: 180,
      rank3: 100,
      rank4To10: 20,
    },
    rules: ['Match concluded. Prizes credited to winning wallets.']
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_payout_01',
    userId: 'usr_zest_99',
    userName: 'Ayan Sharma',
    type: 'withdrawal',
    amount: 100,
    walletSource: 'winnings',
    status: 'completed',
    timestamp: new Date(now - 4 * 3600 * 1000).toISOString(),
    referenceId: 'GP-DELIV-984210',
    description: 'Google Play Redeem Code ₹100',
    metadata: {
      targetGmail: 'ajubaid.ik@gmail.com',
      redeemCode: 'GP-3X9K-8R2L-Q7VM',
    }
  },
  {
    id: 'tx_prize_01',
    userId: 'usr_zest_99',
    userName: 'Ayan Sharma',
    type: 'prize_winnings',
    amount: 275,
    walletSource: 'winnings',
    status: 'completed',
    timestamp: new Date(now - 14 * 3600 * 1000).toISOString(),
    referenceId: 'PRIZE-NEXTERRA-481',
    description: 'Prize Winnings: Nexterra Mega BR #481 (Rank #2 + 5 Kills)',
    metadata: {
      tournamentId: 'tour_br_completed_01',
      tournamentTitle: 'NEXTERRA MEGA BR #481',
      rank: 2,
      kills: 5,
    }
  },
  {
    id: 'tx_entry_01',
    userId: 'usr_zest_99',
    userName: 'Ayan Sharma',
    type: 'entry_fee',
    amount: 30,
    walletSource: 'deposit',
    status: 'completed',
    timestamp: new Date(now - 18 * 3600 * 1000).toISOString(),
    referenceId: 'SLOT-BOOK-BR482',
    description: 'Slot #12 Reservation: Bermuda Supremacy #482',
    metadata: {
      tournamentId: 'tour_br_01',
    }
  },
  {
    id: 'tx_dep_01',
    userId: 'usr_zest_99',
    userName: 'Ayan Sharma',
    type: 'deposit',
    amount: 200,
    walletSource: 'deposit',
    status: 'completed',
    timestamp: new Date(now - 28 * 3600 * 1000).toISOString(),
    referenceId: 'UTR419208472910',
    description: 'UPI QR Deposit via PhonePe (UTR: 419208472910)',
    metadata: {
      utrNumber: '419208472910',
    }
  },
  // Pending queue items for Admin testing!
  {
    id: 'tx_pending_with_upi_01',
    userId: 'usr_toxic_01',
    userName: 'Rohan Verma',
    type: 'withdrawal',
    amount: 350,
    walletSource: 'winnings',
    status: 'pending',
    timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
    referenceId: 'REQ-UPI-99218',
    description: 'Direct UPI Payout to rohan@okhdfcbank',
    metadata: {
      upiId: 'rohan.verma@okhdfcbank',
    }
  },
  {
    id: 'tx_pending_with_gp_01',
    userId: 'usr_queen_02',
    userName: 'Pooja Rawat',
    type: 'withdrawal',
    amount: 250,
    walletSource: 'winnings',
    status: 'pending',
    timestamp: new Date(now - 12 * 60 * 1000).toISOString(),
    referenceId: 'REQ-GP-48192',
    description: 'Google Play Redeem Code Request ₹250',
    metadata: {
      targetGmail: 'pooja.esports@gmail.com',
    }
  },
  {
    id: 'tx_pending_deposit_01',
    userId: 'usr_toxic_01',
    userName: 'Rohan Verma',
    type: 'deposit',
    amount: 150,
    walletSource: 'deposit',
    status: 'pending',
    timestamp: new Date(now - 35 * 60 * 1000).toISOString(),
    referenceId: 'UTR982174019284',
    description: 'UPI QR Topup Verification (UTR: 982174019284)',
    metadata: {
      utrNumber: '982174019284',
      screenshotUrl: 'https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=600&auto=format&fit=crop&q=80',
    }
  }
];

export const INITIAL_REDEEM_CODES: RedeemCodeInventory[] = [
  { id: 'rc_10_1', denomination: 10, code: 'GP-9X4K-7V1L-MN8Q', isUsed: false },
  { id: 'rc_10_2', denomination: 10, code: 'GP-2P5W-8T9Z-KL3Y', isUsed: false },
  { id: 'rc_30_1', denomination: 30, code: 'GP-6A7B-9C1D-EF2G', isUsed: false },
  { id: 'rc_30_2', denomination: 30, code: 'GP-4H5J-8K9L-MN1P', isUsed: false },
  { id: 'rc_80_1', denomination: 80, code: 'GP-8Q9R-1S2T-UV3W', isUsed: false },
  { id: 'rc_100_1', denomination: 100, code: 'GP-3X9K-8R2L-Q7VM', isUsed: true, usedByUserId: 'usr_zest_99', assignedAt: new Date(now - 4 * 3600 * 1000).toISOString(), sentToEmail: 'ajubaid.ik@gmail.com' },
  { id: 'rc_100_2', denomination: 100, code: 'GP-5Y6Z-7A8B-CD9E', isUsed: false },
  { id: 'rc_100_3', denomination: 100, code: 'GP-1F2G-3H4J-KL5M', isUsed: false },
  { id: 'rc_250_1', denomination: 250, code: 'GP-7N8P-9Q1R-ST2U', isUsed: false },
  { id: 'rc_250_2', denomination: 250, code: 'GP-4V5W-6X7Y-ZA8B', isUsed: false },
];

export const INITIAL_REFERRAL_LEADERBOARD: ReferralUser[] = [
  {
    rank: 1,
    name: 'Kabir Singhania',
    ign: 'ZEST_GODFATHER',
    referralCount: 428,
    totalEarned: 10700,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    rank: 2,
    name: 'Pooja Rawat',
    ign: 'ZEST_VALKYRIE',
    referralCount: 290,
    totalEarned: 7250,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  },
  {
    rank: 3,
    name: 'Sahil Sheikh',
    ign: 'RAVAN_ESPORTS',
    referralCount: 215,
    totalEarned: 5375,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    rank: 4,
    name: 'Ayan Sharma',
    ign: 'ZEST_SNIPER_99',
    referralCount: 14,
    totalEarned: 350,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
  },
  {
    rank: 5,
    name: 'Devraj Chauhan',
    ign: 'IMMORTAL_DEV',
    referralCount: 9,
    totalEarned: 225,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'usr_zest_99',
    title: 'Room ID & Password Unlocked! 🎮',
    message: 'Room details for CS 4V4 GRAND SHOWDOWN are now live. Enter the lobby now!',
    type: 'room_unlock',
    timestamp: new Date(now - 8 * 60 * 1000).toISOString(),
    isRead: false,
    actionData: { tournamentId: 'tour_cs_01' }
  },
  {
    id: 'notif_2',
    userId: 'usr_zest_99',
    title: 'Prize Winnings Credited! 💰',
    message: '₹275 credited to your Winnings Cash from Nexterra Mega BR #481.',
    type: 'prize_credit',
    timestamp: new Date(now - 14 * 3600 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: 'notif_3',
    userId: 'usr_zest_99',
    title: 'Google Play Code Dispatched 🎁',
    message: 'Your ₹100 Google Play Redeem Code was emailed to ajubaid.ik@gmail.com.',
    type: 'payout_completed',
    timestamp: new Date(now - 4 * 3600 * 1000).toISOString(),
    isRead: true,
  }
];
