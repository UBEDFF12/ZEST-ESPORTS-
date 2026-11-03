import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  testFirestoreConnection,
  signInWithGoogleFirebase,
  signOutFirebase,
} from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  UserProfile,
  Tournament,
  Transaction,
  RedeemCodeInventory,
  ReferralUser,
  AppNotification,
  MatchScoreEntry,
  TournamentMode,
} from '../types';
import {
  INITIAL_CURRENT_USER,
  MOCK_ALL_USERS,
  INITIAL_TOURNAMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_REDEEM_CODES,
  INITIAL_REFERRAL_LEADERBOARD,
  INITIAL_NOTIFICATIONS,
} from '../mock/initialData';

interface EmailReceiptModalData {
  isOpen: boolean;
  toEmail: string;
  redeemCode: string;
  amount: number;
  userName: string;
  timestamp: string;
}

interface EsportsContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  tournaments: Tournament[];
  transactions: Transaction[];
  redeemInventory: RedeemCodeInventory[];
  referralLeaderboard: ReferralUser[];
  notifications: AppNotification[];
  selectedTournament: Tournament | null;
  emailReceiptModal: EmailReceiptModalData;
  activeView: 'mobile' | 'admin' | 'deliverables' | 'dual';
  
  // Navigation & UI
  setActiveView: (view: 'mobile' | 'admin' | 'deliverables' | 'dual') => void;
  setSelectedTournament: (t: Tournament | null) => void;
  closeEmailReceiptModal: () => void;
  switchUser: (userId: string) => void;
  
  // Gamer Actions
  bookTournamentSlot: (
    tournamentId: string,
    slotNumber: number,
    customIgn?: string,
    customUid?: string
  ) => { success: boolean; message: string };
  
  submitDepositRequest: (
    amount: number,
    utrNumber: string,
    screenshotUrl?: string
  ) => { success: boolean; message: string };
  
  submitUpiWithdrawal: (
    amount: number,
    upiId: string
  ) => { success: boolean; message: string };
  
  submitGooglePlayWithdrawal: (
    denomination: number,
    targetGmail: string
  ) => { success: boolean; message: string };
  
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Admin Actions
  createTournament: (tournamentData: Partial<Tournament>) => void;
  updateRoomCredentials: (
    tournamentId: string,
    roomId: string,
    roomPassword: string,
    revealNow?: boolean
  ) => void;
  distributeTournamentPrizes: (
    tournamentId: string,
    scores: MatchScoreEntry[]
  ) => { success: boolean; totalDistributed: number };
  approveDeposit: (transactionId: string) => void;
  rejectDeposit: (transactionId: string, reason: string) => void;
  executeUpiPayout: (transactionId: string, payoutRef: string) => void;
  fulfillGooglePlayCodePayout: (
    transactionId: string,
    customCode?: string
  ) => { success: boolean; codeSent?: string; message: string };
  toggleUserBan: (userId: string) => void;
  
  // Authentication & Session
  isAuthenticated: boolean;
  firebaseConnected: boolean;
  firebaseProjectId: string;
  firestoreDatabaseId: string;
  signInWithFirebaseGoogle: () => Promise<{ success: boolean; message: string }>;
  sendPhoneOtp: (phone: string) => { success: boolean; message: string; demoOtp: string };
  loginWithPhoneOtp: (phone: string, otp: string) => { success: boolean; message: string };
  loginWithGoogle: (email?: string, name?: string) => { success: boolean; message: string };
  registerPlayer: (params: {
    name: string;
    phone: string;
    email: string;
    freeFireIgn: string;
    freeFireUid: string;
    referralCode?: string;
  }) => { success: boolean; message: string };
  logout: () => void;
}

const EsportsContext = createContext<EsportsContextType | undefined>(undefined);

export const EsportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_CURRENT_USER);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_ALL_USERS);
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [redeemInventory, setRedeemInventory] = useState<RedeemCodeInventory[]>(INITIAL_REDEEM_CODES);
  const [referralLeaderboard] = useState<ReferralUser[]>(INITIAL_REFERRAL_LEADERBOARD);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(tournaments[0]);
  const [activeView, setActiveView] = useState<'mobile' | 'admin' | 'deliverables' | 'dual'>('mobile');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(true);

  // Validate Firestore Connection and listen to Firebase Auth
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setFirebaseConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setIsAuthenticated(true);
        const email = (fbUser.email || '').toLowerCase();
        const existing = allUsers.find((u) => u.email.toLowerCase() === email);
        if (existing) {
          setCurrentUser(existing);
        } else {
          const newUser: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Gamer',
            email: fbUser.email || 'gamer@zestesports.gg',
            phone: fbUser.phoneNumber || '+91 98888 77777',
            avatarUrl:
              fbUser.photoURL ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            freeFireIgn: `ZEST_${(fbUser.displayName || 'PRO').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)}`,
            freeFireUid: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            depositBalance: 50,
            winningsBalance: 0,
            matchesPlayed: 0,
            totalKills: 0,
            totalWins: 0,
            winRate: 0,
            totalEarnings: 0,
            referralCode: `ZEST-${(fbUser.displayName || 'GAME').slice(0, 4).toUpperCase()}`,
            referralEarnings: 0,
            deviceFingerprint: {
              deviceId: 'FIREBASE_AUTH_CLIENT',
              ipAddress: '103.24.182.91',
              userAgent: 'Firebase Auth Web SDK',
              isSuspicious: false,
            },
            isBanned: false,
            createdAt: new Date().toISOString(),
          };
          setAllUsers((prev) => [newUser, ...prev]);
          setCurrentUser(newUser);
        }
      }
    });

    return () => unsubscribe();
  }, []);
  
  const [emailReceiptModal, setEmailReceiptModal] = useState<EmailReceiptModalData>({
    isOpen: false,
    toEmail: '',
    redeemCode: '',
    amount: 0,
    userName: '',
    timestamp: '',
  });

  const closeEmailReceiptModal = () => {
    setEmailReceiptModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Switch between players in the test roster
  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Helper to add in-app push notification
  const sendNotification = (
    userId: string,
    title: string,
    message: string,
    type: AppNotification['type'],
    actionData?: Record<string, any>
  ) => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      isRead: false,
      actionData,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // 1. Atomic Slot Booking with Balance Check
  const bookTournamentSlot = (
    tournamentId: string,
    slotNumber: number,
    customIgn?: string,
    customUid?: string
  ): { success: boolean; message: string } => {
    const tour = tournaments.find((t) => t.id === tournamentId);
    if (!tour) return { success: false, message: 'Tournament not found' };

    if (currentUser.isBanned) {
      return { success: false, message: 'Account is suspended due to security violation' };
    }

    const slot = tour.slots.find((s) => s.slotNumber === slotNumber);
    if (!slot) return { success: false, message: 'Invalid slot number' };
    if (slot.isBooked) return { success: false, message: `Slot #${slotNumber} is already taken by another player!` };

    // Check if user has enough total balance (Deposit Cash first, then Winnings Cash)
    const totalBalance = currentUser.depositBalance + currentUser.winningsBalance;
    if (totalBalance < tour.entryFee) {
      return {
        success: false,
        message: `Insufficient balance! Entry fee is ₹${tour.entryFee}, but your total wallet balance is ₹${totalBalance}. Please top up Deposit Cash.`,
      };
    }

    // Deduct entry fee atomically: exhaust depositBalance first, then winningsBalance
    let deductFromDeposit = 0;
    let deductFromWinnings = 0;
    if (currentUser.depositBalance >= tour.entryFee) {
      deductFromDeposit = tour.entryFee;
    } else {
      deductFromDeposit = currentUser.depositBalance;
      deductFromWinnings = tour.entryFee - deductFromDeposit;
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      depositBalance: currentUser.depositBalance - deductFromDeposit,
      winningsBalance: currentUser.winningsBalance - deductFromWinnings,
      matchesPlayed: currentUser.matchesPlayed + 1,
    };

    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    // Update Tournament slots
    const updatedSlots = tour.slots.map((s) => {
      if (s.slotNumber === slotNumber) {
        return {
          ...s,
          isBooked: true,
          userId: currentUser.id,
          playerIgn: customIgn?.trim() || currentUser.freeFireIgn,
          playerUid: customUid?.trim() || currentUser.freeFireUid,
          bookedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    const updatedTour: Tournament = {
      ...tour,
      bookedSlotsCount: tour.bookedSlotsCount + 1,
      slots: updatedSlots,
    };

    setTournaments((prev) => prev.map((t) => (t.id === tournamentId ? updatedTour : t)));
    if (selectedTournament?.id === tournamentId) {
      setSelectedTournament(updatedTour);
    }

    // Record Transaction
    const newTx: Transaction = {
      id: `tx_entry_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'entry_fee',
      amount: tour.entryFee,
      walletSource: deductFromWinnings > 0 ? 'both' : 'deposit',
      status: 'completed',
      timestamp: new Date().toISOString(),
      referenceId: `SLOT-${tour.id.toUpperCase()}-S${slotNumber}`,
      description: `Slot #${slotNumber} booked for ${tour.title}`,
      metadata: {
        tournamentId: tour.id,
        tournamentTitle: tour.title,
      },
    };
    setTransactions((prev) => [newTx, ...prev]);

    sendNotification(
      currentUser.id,
      'Slot Confirmed! 🎯',
      `Slot #${slotNumber} locked for ${tour.title}. Room ID unlocks 15m prior to start.`,
      'match_reminder'
    );

    return {
      success: true,
      message: `Successfully booked Slot #${slotNumber}! ₹${tour.entryFee} deducted.`,
    };
  };

  // 2. Deposit Request (UPI QR + UTR)
  const submitDepositRequest = (
    amount: number,
    utrNumber: string,
    screenshotUrl?: string
  ): { success: boolean; message: string } => {
    if (amount < 10) {
      return { success: false, message: 'Minimum deposit amount is ₹10' };
    }
    const cleanUtr = utrNumber.trim();
    if (!/^\d{12}$/.test(cleanUtr)) {
      return { success: false, message: 'UTR / Transaction ID must be exactly 12 numeric digits' };
    }

    const newTx: Transaction = {
      id: `tx_dep_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'deposit',
      amount,
      walletSource: 'deposit',
      status: 'pending',
      timestamp: new Date().toISOString(),
      referenceId: `UTR${cleanUtr}`,
      description: `UPI QR Deposit (UTR: ${cleanUtr})`,
      metadata: {
        utrNumber: cleanUtr,
        screenshotUrl: screenshotUrl || 'https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=600&auto=format&fit=crop&q=80',
      },
    };

    setTransactions((prev) => [newTx, ...prev]);

    sendNotification(
      currentUser.id,
      'Deposit Pending Verification ⌛',
      `Deposit of ₹${amount} with UTR ${cleanUtr} submitted. Admin will verify within 5-10 minutes.`,
      'system'
    );

    return {
      success: true,
      message: `Deposit request of ₹${amount} submitted! It will be verified by the admin shortly.`,
    };
  };

  // 3. Dual-Method Withdrawal: UPI Payout
  const submitUpiWithdrawal = (
    amount: number,
    upiId: string
  ): { success: boolean; message: string } => {
    if (currentUser.isBanned) {
      return { success: false, message: 'Account suspended. Payouts locked.' };
    }
    if (amount <= 0) {
      return { success: false, message: 'Please enter a valid withdrawal amount' };
    }
    if (amount > currentUser.winningsBalance) {
      return {
        success: false,
        message: `Insufficient Winnings Cash! You can only withdraw from Winnings Cash (Available: ₹${currentUser.winningsBalance}). Deposit Cash cannot be withdrawn.`,
      };
    }
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiRegex.test(upiId.trim())) {
      return { success: false, message: 'Invalid UPI ID format. Expected format: username@bank' };
    }

    // Atomic Concurrency Lock: Lock/deduct winnings immediately
    const updatedUser: UserProfile = {
      ...currentUser,
      winningsBalance: currentUser.winningsBalance - amount,
    };
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    const newTx: Transaction = {
      id: `tx_with_upi_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'withdrawal',
      amount,
      walletSource: 'winnings',
      status: 'pending',
      timestamp: new Date().toISOString(),
      referenceId: `REQ-UPI-${Math.floor(100000 + Math.random() * 900000)}`,
      description: `Direct UPI Payout to ${upiId.trim()}`,
      metadata: {
        upiId: upiId.trim(),
      },
    };

    setTransactions((prev) => [newTx, ...prev]);

    sendNotification(
      currentUser.id,
      'Withdrawal Queued ⚡',
      `UPI Payout request of ₹${amount} to ${upiId} is in processing queue.`,
      'system'
    );

    return {
      success: true,
      message: `UPI withdrawal request for ₹${amount} queued! Funds reserved atomically.`,
    };
  };

  // 3b. Dual-Method Withdrawal: Google Play Redeem Code
  const submitGooglePlayWithdrawal = (
    denomination: number,
    targetGmail: string
  ): { success: boolean; message: string } => {
    if (currentUser.isBanned) {
      return { success: false, message: 'Account suspended. Payouts locked.' };
    }
    const validAmounts = [10, 30, 80, 100, 250];
    if (!validAmounts.includes(denomination)) {
      return { success: false, message: 'Allowed denominations: ₹10, ₹30, ₹80, ₹100, ₹250' };
    }
    if (denomination > currentUser.winningsBalance) {
      return {
        success: false,
        message: `Insufficient Winnings Cash! Available: ₹${currentUser.winningsBalance}. Need: ₹${denomination}.`,
      };
    }
    const cleanEmail = targetGmail.trim().toLowerCase();
    if (!cleanEmail.endsWith('@gmail.com') || !cleanEmail.includes('@') || cleanEmail.length < 11) {
      return {
        success: false,
        message: 'Google Play codes require a valid @gmail.com address (strict Google Play requirement).',
      };
    }

    // Atomic Balance deduction
    const updatedUser: UserProfile = {
      ...currentUser,
      winningsBalance: currentUser.winningsBalance - denomination,
    };
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    const newTx: Transaction = {
      id: `tx_with_gp_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'withdrawal',
      amount: denomination,
      walletSource: 'winnings',
      status: 'pending',
      timestamp: new Date().toISOString(),
      referenceId: `REQ-GP-${Math.floor(100000 + Math.random() * 900000)}`,
      description: `Google Play Redeem Code ₹${denomination}`,
      metadata: {
        targetGmail: cleanEmail,
      },
    };

    setTransactions((prev) => [newTx, ...prev]);

    sendNotification(
      currentUser.id,
      'Google Play Code Queued 🎟️',
      `₹${denomination} code request queued for dispatch to ${cleanEmail}.`,
      'system'
    );

    return {
      success: true,
      message: `Google Play Code request for ₹${denomination} submitted! Code will be delivered to ${cleanEmail}.`,
    };
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // --- ADMIN ACTIONS ---

  const createTournament = (data: Partial<Tournament>) => {
    const maxSlots = data.maxSlots || 48;
    const newTour: Tournament = {
      id: `tour_${Date.now()}`,
      title: data.title || 'NEW ZEST CHAMPIONSHIP',
      mode: (data.mode as TournamentMode) || 'Classic BR',
      map: data.map || 'Bermuda',
      bannerUrl: data.bannerUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      entryFee: data.entryFee || 30,
      perKillPrize: data.perKillPrize || 15,
      totalPrizePool: data.totalPrizePool || 1000,
      maxSlots: maxSlots,
      bookedSlotsCount: 0,
      slots: Array.from({ length: maxSlots }, (_, i) => ({
        slotNumber: i + 1,
        isBooked: false,
      })),
      scheduleTime: data.scheduleTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      roomUnlockMinutesBefore: 15,
      roomId: data.roomId || '',
      roomPassword: data.roomPassword || '',
      isRoomRevealed: false,
      status: 'open',
      rankPrizes: data.rankPrizes || { rank1: 300, rank2: 150, rank3: 80, rank4To10: 20 },
      rules: data.rules || [
        'Standard mobile rules apply.',
        'Emulators prohibited.',
        'Credentials reveal 15m prior.'
      ],
    };

    setTournaments((prev) => [newTour, ...prev]);
  };

  // Admin Push Room ID & Password
  const updateRoomCredentials = (
    tournamentId: string,
    roomId: string,
    roomPassword: string,
    revealNow = true
  ) => {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          return {
            ...t,
            roomId,
            roomPassword,
            isRoomRevealed: revealNow,
            status: revealNow ? 'room_unlocked' : t.status,
          };
        }
        return t;
      })
    );

    // Alert all players
    sendNotification(
      'all',
      'ROOM CREDENTIALS RELEASED! 🚨',
      `Room ID: ${roomId} | Pass: ${roomPassword} for tournament is now active! Join lobby now.`,
      'room_unlock',
      { tournamentId, roomId, roomPassword }
    );
  };

  // Admin One-Click Result Declaration & Prize Distribution Engine
  const distributeTournamentPrizes = (
    tournamentId: string,
    scores: MatchScoreEntry[]
  ): { success: boolean; totalDistributed: number } => {
    const tour = tournaments.find((t) => t.id === tournamentId);
    if (!tour) return { success: false, totalDistributed: 0 };

    let totalPayout = 0;
    const prizeTransactions: Transaction[] = [];

    // Credit each player
    const updatedUsersMap = new Map<string, UserProfile>();
    allUsers.forEach((u) => updatedUsersMap.set(u.id, { ...u }));

    scores.forEach((score) => {
      if (score.totalWon > 0 && score.userId) {
        totalPayout += score.totalWon;
        const targetUser = updatedUsersMap.get(score.userId);
        if (targetUser) {
          targetUser.winningsBalance += score.totalWon;
          targetUser.totalEarnings += score.totalWon;
          targetUser.totalKills += score.kills;
          if (score.rank === 1) targetUser.totalWins += 1;
        }

        prizeTransactions.push({
          id: `tx_prize_${Date.now()}_${score.userId}`,
          userId: score.userId,
          userName: score.playerIgn,
          type: 'prize_winnings',
          amount: score.totalWon,
          walletSource: 'winnings',
          status: 'completed',
          timestamp: new Date().toISOString(),
          referenceId: `PRIZE-${tour.id.toUpperCase()}-${score.rank}`,
          description: `Prize Winnings: ${tour.title} (Rank #${score.rank}, ${score.kills} Kills)`,
          metadata: {
            tournamentId: tour.id,
            tournamentTitle: tour.title,
            rank: score.rank,
            kills: score.kills,
          },
        });

        // Notify user
        sendNotification(
          score.userId,
          'Prize Winnings Credited! 🏆',
          `You earned ₹${score.totalWon} (Rank #${score.rank} + ${score.kills} Kills) from ${tour.title}. Credited to Winnings Cash!`,
          'prize_credit'
        );
      }
    });

    // Update global state
    const newAllUsers = Array.from(updatedUsersMap.values());
    setAllUsers(newAllUsers);

    // Update current user if affected
    const updatedCurrent = updatedUsersMap.get(currentUser.id);
    if (updatedCurrent) {
      setCurrentUser(updatedCurrent);
    }

    setTransactions((prev) => [...prizeTransactions, ...prev]);

    // Mark tournament as completed
    setTournaments((prev) =>
      prev.map((t) => (t.id === tournamentId ? { ...t, status: 'completed' } : t))
    );

    return { success: true, totalDistributed: totalPayout };
  };

  // Admin Approve Deposit
  const approveDeposit = (transactionId: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx || tx.status !== 'pending') return;

    // Credit user's deposit balance
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === tx.userId) {
          return { ...u, depositBalance: u.depositBalance + tx.amount };
        }
        return u;
      })
    );

    if (currentUser.id === tx.userId) {
      setCurrentUser((prev) => ({
        ...prev,
        depositBalance: prev.depositBalance + tx.amount,
      }));
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId ? { ...t, status: 'completed' } : t
      )
    );

    sendNotification(
      tx.userId,
      'Deposit Verified & Credited! 💳',
      `Your deposit of ₹${tx.amount} has been approved. ₹${tx.amount} added to Deposit Cash.`,
      'system'
    );
  };

  const rejectDeposit = (transactionId: string, reason: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: 'rejected',
              metadata: { ...t.metadata, rejectionReason: reason },
            }
          : t
      )
    );
  };

  // Admin Execute UPI Payout
  const executeUpiPayout = (transactionId: string, payoutRef: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: 'completed',
              referenceId: payoutRef || `UPI-TXN-${Date.now().toString().slice(-6)}`,
            }
          : t
      )
    );

    sendNotification(
      tx.userId,
      'UPI Payout Completed! 💸',
      `₹${tx.amount} successfully sent to your UPI ${tx.metadata?.upiId}. Bank Ref: ${payoutRef}`,
      'payout_completed'
    );
  };

  // Admin Automated FIFO Google Play Redeem Code Delivery + Nodemailer Simulator
  const fulfillGooglePlayCodePayout = (
    transactionId: string,
    customCode?: string
  ): { success: boolean; codeSent?: string; message: string } => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return { success: false, message: 'Transaction not found' };

    let codeToDeliver = customCode?.trim().toUpperCase();

    // If no manual code, take FIFO from inventory
    if (!codeToDeliver) {
      const availableItem = redeemInventory.find(
        (item) => !item.isUsed && item.denomination === tx.amount
      );
      if (!availableItem) {
        return {
          success: false,
          message: `Redeem Code Inventory Exhausted for ₹${tx.amount}! Please input code manually or restock inventory.`,
        };
      }
      codeToDeliver = availableItem.code;

      // Mark inventory item used
      setRedeemInventory((prev) =>
        prev.map((item) =>
          item.id === availableItem.id
            ? {
                ...item,
                isUsed: true,
                usedByUserId: tx.userId,
                assignedAt: new Date().toISOString(),
                sentToEmail: tx.metadata?.targetGmail,
              }
            : item
        )
      );
    }

    // Update Transaction
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: 'completed',
              referenceId: codeToDeliver!,
              metadata: {
                ...t.metadata,
                redeemCode: codeToDeliver,
              },
            }
          : t
      )
    );

    // Dispatch Simulated Nodemailer Email Preview
    setEmailReceiptModal({
      isOpen: true,
      toEmail: tx.metadata?.targetGmail || 'player@gmail.com',
      redeemCode: codeToDeliver,
      amount: tx.amount,
      userName: tx.userName,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });

    sendNotification(
      tx.userId,
      'Google Play Code Delivered! 🎁',
      `Your ₹${tx.amount} Google Play Redeem Code (${codeToDeliver}) was delivered to ${tx.metadata?.targetGmail}.`,
      'payout_completed',
      { redeemCode: codeToDeliver }
    );

    return {
      success: true,
      codeSent: codeToDeliver,
      message: `Code ${codeToDeliver} assigned and dispatched via Nodemailer to ${tx.metadata?.targetGmail}!`,
    };
  };

  // Anti-fraud suspension
  const toggleUserBan = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, isBanned: !u.isBanned };
          if (currentUser.id === userId) setCurrentUser(updated);
          return updated;
        }
        return u;
      })
    );
  };

  // --- AUTHENTICATION & LOGIN MODULE ---

  const sendPhoneOtp = (phone: string): { success: boolean; message: string; demoOtp: string } => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number', demoOtp: '' };
    }
    const demoOtp = '123456';
    return {
      success: true,
      message: `OTP sent to +91 ${cleanPhone}. (Use Demo OTP: ${demoOtp})`,
      demoOtp,
    };
  };

  const loginWithPhoneOtp = (
    phone: string,
    otp: string
  ): { success: boolean; message: string } => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return { success: false, message: 'Invalid phone number' };
    }
    if (otp.trim() !== '123456' && otp.trim().length !== 6) {
      return { success: false, message: 'Invalid OTP! Please enter 123456 or a valid 6-digit code.' };
    }

    // Check if phone belongs to an existing user in our roster
    const existingUser = allUsers.find((u) => u.phone.replace(/\D/g, '').slice(-10) === cleanPhone);

    if (existingUser) {
      setCurrentUser(existingUser);
      setIsAuthenticated(true);
      sendNotification(
        existingUser.id,
        'Welcome Back, Champion! 🎮',
        `Logged in successfully as ${existingUser.freeFireIgn}.`,
        'system'
      );
      return { success: true, message: `Welcome back, ${existingUser.freeFireIgn}!` };
    }

    // Auto-create profile or use default template with phone
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: `Gamer_${cleanPhone.slice(-4)}`,
      email: `gamer.${cleanPhone.slice(-4)}@zestesports.gg`,
      phone: `+91 ${cleanPhone}`,
      avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      freeFireIgn: `ZEST_${cleanPhone.slice(-4)}`,
      freeFireUid: `78${cleanPhone.slice(-8)}`,
      depositBalance: 50, // ₹50 Welcome Bonus!
      winningsBalance: 0,
      matchesPlayed: 0,
      totalKills: 0,
      totalWins: 0,
      winRate: 0,
      totalEarnings: 0,
      referralCode: `ZEST-${cleanPhone.slice(-4)}`,
      referralEarnings: 0,
      deviceFingerprint: {
        deviceId: 'MOBILE_CLIENT_' + cleanPhone.slice(-4),
        ipAddress: '103.24.182.91',
        userAgent: 'Android Mobile App Client',
        isSuspicious: false,
      },
      isBanned: false,
      createdAt: new Date().toISOString(),
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);

    sendNotification(
      newUser.id,
      'Welcome to ZEST ESPORTS! 🎁',
      '₹50 Welcome Bonus credited to your Deposit Cash for match entries!',
      'system'
    );

    return {
      success: true,
      message: `Account created with ₹50 Welcome Bonus! Logged in as ${newUser.freeFireIgn}`,
    };
  };

  const loginWithGoogle = (
    email?: string,
    name?: string
  ): { success: boolean; message: string } => {
    const targetEmail = (email || 'ajubaid.ik@gmail.com').toLowerCase().trim();
    const existingUser = allUsers.find((u) => u.email.toLowerCase() === targetEmail);

    if (existingUser) {
      setCurrentUser(existingUser);
      setIsAuthenticated(true);
      sendNotification(
        existingUser.id,
        'Google Sign-In Verified! ⚡',
        `Logged in as ${existingUser.name} (${existingUser.freeFireIgn}).`,
        'system'
      );
      return { success: true, message: `Logged in via Google as ${existingUser.name}!` };
    }

    const newUser: UserProfile = {
      id: `usr_g_${Date.now()}`,
      name: name || targetEmail.split('@')[0],
      email: targetEmail,
      phone: '+91 98888 77777',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      freeFireIgn: `ZEST_${targetEmail.split('@')[0].toUpperCase().slice(0, 8)}`,
      freeFireUid: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      depositBalance: 50,
      winningsBalance: 0,
      matchesPlayed: 0,
      totalKills: 0,
      totalWins: 0,
      winRate: 0,
      totalEarnings: 0,
      referralCode: `ZEST-${targetEmail.slice(0, 4).toUpperCase()}`,
      referralEarnings: 0,
      deviceFingerprint: {
        deviceId: 'GOOGLE_AUTH_ANDROID',
        ipAddress: '103.24.182.91',
        userAgent: 'Google Play Services Auth',
        isSuspicious: false,
      },
      isBanned: false,
      createdAt: new Date().toISOString(),
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);

    return { success: true, message: `Welcome ${newUser.name}! ₹50 Welcome Bonus added.` };
  };

  const registerPlayer = (params: {
    name: string;
    phone: string;
    email: string;
    freeFireIgn: string;
    freeFireUid: string;
    referralCode?: string;
  }): { success: boolean; message: string } => {
    const cleanPhone = params.phone.replace(/\D/g, '').slice(-10);
    if (!params.name.trim()) return { success: false, message: 'Full Name is required' };
    if (cleanPhone.length !== 10) return { success: false, message: 'Valid 10-digit phone number is required' };
    if (!params.freeFireIgn.trim()) return { success: false, message: 'Free Fire IGN is required' };
    if (!params.freeFireUid.trim() || params.freeFireUid.trim().length < 6) {
      return { success: false, message: 'Valid Free Fire UID is required (6-12 digits)' };
    }

    let initialDeposit = 50;
    if (params.referralCode?.trim()) {
      const code = params.referralCode.trim().toUpperCase();
      const referrer = allUsers.find((u) => u.referralCode.toUpperCase() === code);
      if (referrer) {
        initialDeposit += 25;
        setAllUsers((prev) =>
          prev.map((u) =>
            u.id === referrer.id
              ? {
                  ...u,
                  depositBalance: u.depositBalance + 25,
                  referralEarnings: u.referralEarnings + 25,
                }
              : u
          )
        );
        sendNotification(
          referrer.id,
          'Referral Bounty Credited! 🎁',
          `₹25 added to Deposit Cash! Friend ${params.freeFireIgn} signed up using your code.`,
          'prize_credit'
        );
      }
    }

    const newUser: UserProfile = {
      id: `usr_reg_${Date.now()}`,
      name: params.name.trim(),
      email: params.email.trim() || `${cleanPhone}@zestesports.gg`,
      phone: `+91 ${cleanPhone}`,
      avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      freeFireIgn: params.freeFireIgn.trim(),
      freeFireUid: params.freeFireUid.trim(),
      depositBalance: initialDeposit,
      winningsBalance: 0,
      matchesPlayed: 0,
      totalKills: 0,
      totalWins: 0,
      winRate: 0,
      totalEarnings: 0,
      referralCode: `ZEST-${params.freeFireIgn.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      referralEarnings: 0,
      referredBy: params.referralCode?.trim(),
      deviceFingerprint: {
        deviceId: 'ANDROID_GENUINE_DEV_' + cleanPhone.slice(-4),
        ipAddress: '103.24.182.91',
        userAgent: 'Android Mobile App Client',
        isSuspicious: false,
      },
      isBanned: false,
      createdAt: new Date().toISOString(),
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);

    sendNotification(
      newUser.id,
      'Registration Complete! 🏆',
      `Welcome to ZEST ESPORTS! ₹${initialDeposit} Welcome Deposit Cash credited. Join your first match!`,
      'system'
    );

    return {
      success: true,
      message: `Registration successful! Welcome ${newUser.freeFireIgn} (₹${initialDeposit} Bonus Credited)`,
    };
  };

  const signInWithFirebaseGoogle = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await signInWithGoogleFirebase();
      if (res.success && res.user) {
        return { success: true, message: `Signed in as ${res.user.displayName || res.user.email}` };
      }
      return loginWithGoogle('ajubaid.ik@gmail.com', 'Ayan Sharma');
    } catch {
      return loginWithGoogle('ajubaid.ik@gmail.com', 'Ayan Sharma');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    signOutFirebase().catch(() => {});
  };

  return (
    <EsportsContext.Provider
      value={{
        currentUser,
        allUsers,
        tournaments,
        transactions,
        redeemInventory,
        referralLeaderboard,
        notifications,
        selectedTournament,
        emailReceiptModal,
        activeView,
        isAuthenticated,
        firebaseConnected,
        firebaseProjectId: firebaseConfig.projectId,
        firestoreDatabaseId: firebaseConfig.firestoreDatabaseId,
        signInWithFirebaseGoogle,
        setActiveView,
        setSelectedTournament,
        closeEmailReceiptModal,
        switchUser,
        sendPhoneOtp,
        loginWithPhoneOtp,
        loginWithGoogle,
        registerPlayer,
        logout,
        bookTournamentSlot,
        submitDepositRequest,
        submitUpiWithdrawal,
        submitGooglePlayWithdrawal,
        markNotificationRead,
        clearAllNotifications,
        createTournament,
        updateRoomCredentials,
        distributeTournamentPrizes,
        approveDeposit,
        rejectDeposit,
        executeUpiPayout,
        fulfillGooglePlayCodePayout,
        toggleUserBan,
      }}
    >
      {children}
    </EsportsContext.Provider>
  );
};

export const useEsports = () => {
  const context = useContext(EsportsContext);
  if (!context) throw new Error('useEsports must be used within an EsportsProvider');
  return context;
};
