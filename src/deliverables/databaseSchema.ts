export const POSTGRESQL_SCHEMA_SQL = `-- =========================================================================
-- ZEST ESPORTS PLATFORM - PRODUCTION POSTGRESQL DATABASE SCHEMA
-- High-Performance Esports Tournament & Atomic Dual-Balance Financial Engine
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & GAMER PROFILES TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    free_fire_ign VARCHAR(60) NOT NULL,
    free_fire_uid VARCHAR(30) UNIQUE NOT NULL,
    
    -- Dual Balance Architecture (Stored in Indian Rupee integer paise or decimal numeric)
    deposit_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (deposit_balance >= 0.00),
    winnings_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (winnings_balance >= 0.00),
    
    -- Esports Statistics
    matches_played INT NOT NULL DEFAULT 0,
    total_kills INT NOT NULL DEFAULT 0,
    total_wins INT NOT NULL DEFAULT 0,
    total_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    
    -- Referral System
    referral_code VARCHAR(30) UNIQUE NOT NULL,
    referred_by UUID REFERENCES users(id) ON DELETE SET NULL,
    referral_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    
    -- Security & Anti-Fraud
    device_id VARCHAR(100) NOT NULL,
    ip_address INET NOT NULL,
    is_suspicious BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_uid ON users(free_fire_uid);
CREATE INDEX idx_users_referral ON users(referral_code);
CREATE INDEX idx_users_ip_device ON users(ip_address, device_id);

-- 2. TOURNAMENTS TABLE
CREATE TYPE tournament_mode_enum AS ENUM ('Classic BR', 'CS 1v1', 'CS 4v4', 'Lone Wolf');
CREATE TYPE match_status_enum AS ENUM ('upcoming', 'open', 'room_locked', 'room_unlocked', 'live', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    mode tournament_mode_enum NOT NULL DEFAULT 'Classic BR',
    map_name VARCHAR(50) NOT NULL DEFAULT 'Bermuda',
    banner_url TEXT,
    
    entry_fee NUMERIC(10, 2) NOT NULL CHECK (entry_fee >= 0),
    per_kill_prize NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_prize_pool NUMERIC(12, 2) NOT NULL,
    
    max_slots INT NOT NULL DEFAULT 48,
    booked_slots_count INT NOT NULL DEFAULT 0,
    
    schedule_time TIMESTAMP WITH TIME ZONE NOT NULL,
    room_unlock_minutes_before INT NOT NULL DEFAULT 15,
    
    room_id VARCHAR(50),
    room_password VARCHAR(50),
    is_room_revealed BOOLEAN DEFAULT FALSE,
    status match_status_enum NOT NULL DEFAULT 'open',
    
    rank_prizes JSONB NOT NULL DEFAULT '{"rank1": 300, "rank2": 180, "rank3": 100}',
    rules JSONB NOT NULL DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_schedule ON tournaments(schedule_time);

-- 3. TOURNAMENT SLOTS TABLE (Atomic booking isolation)
CREATE TABLE IF NOT EXISTS tournament_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    slot_number INT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    player_ign VARCHAR(60),
    player_uid VARCHAR(30),
    is_booked BOOLEAN NOT NULL DEFAULT FALSE,
    booked_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(tournament_id, slot_number)
);

CREATE INDEX idx_slots_tour_user ON tournament_slots(tournament_id, user_id);

-- 4. FINANCIAL TRANSACTIONS TABLE
CREATE TYPE transaction_type_enum AS ENUM ('deposit', 'withdrawal', 'entry_fee', 'prize_winnings', 'referral_bonus');
CREATE TYPE transaction_status_enum AS ENUM ('pending', 'completed', 'rejected');
CREATE TYPE wallet_source_enum AS ENUM ('deposit', 'winnings', 'both');

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type transaction_type_enum NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    wallet_source wallet_source_enum NOT NULL,
    status transaction_status_enum NOT NULL DEFAULT 'pending',
    
    reference_id VARCHAR(100) UNIQUE NOT NULL, -- UTR / Bank Ref / Redeem Code
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}', -- Store upi_id, target_gmail, utr_number, kills, rank
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_type_status ON transactions(type, status);

-- 5. GOOGLE PLAY REDEEM CODES INVENTORY (Automated FIFO Queue)
CREATE TABLE IF NOT EXISTS google_play_redeem_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    denomination INT NOT NULL CHECK (denomination IN (10, 30, 80, 100, 250)),
    code VARCHAR(25) UNIQUE NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    used_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sent_to_email VARCHAR(255),
    assigned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_redeem_fifo ON google_play_redeem_inventory(denomination, is_used, created_at ASC);
`;

export const FIRESTORE_SCHEMA_JSON = `{
  "firestore": {
    "collections": {
      "users": {
        "description": "User profiles, credentials, stats, and dual balances",
        "fields": {
          "id": "string (Auth UID)",
          "name": "string",
          "email": "string",
          "phone": "string",
          "freeFireIgn": "string",
          "freeFireUid": "string",
          "depositBalance": "number (Non-withdrawable cash for tournament buy-in)",
          "winningsBalance": "number (100% withdrawable cash earned from matches)",
          "matchesPlayed": "number",
          "totalKills": "number",
          "totalWins": "number",
          "totalEarnings": "number",
          "referralCode": "string",
          "deviceFingerprint": {
            "deviceId": "string",
            "ipAddress": "string",
            "isSuspicious": "boolean"
          },
          "isBanned": "boolean",
          "createdAt": "timestamp"
        }
      },
      "tournaments": {
        "description": "Esports tournament instances and game lobbies",
        "fields": {
          "id": "string",
          "title": "string",
          "mode": "string (Classic BR | CS 1v1 | CS 4v4 | Lone Wolf)",
          "map": "string (Bermuda | Purgatory | Kalahari | Nexterra)",
          "entryFee": "number",
          "perKillPrize": "number",
          "totalPrizePool": "number",
          "maxSlots": "number",
          "bookedSlotsCount": "number",
          "scheduleTime": "timestamp",
          "roomUnlockMinutesBefore": "number (default: 15)",
          "roomId": "string (Locked until 15m prior)",
          "roomPassword": "string (Locked until 15m prior)",
          "isRoomRevealed": "boolean",
          "status": "string (open | room_locked | room_unlocked | completed)",
          "rankPrizes": "map",
          "rules": "array<string>"
        },
        "subcollections": {
          "slots": {
            "description": "Atomic participant slots from 1 to maxSlots",
            "fields": {
              "slotNumber": "number",
              "userId": "string | null",
              "playerIgn": "string | null",
              "playerUid": "string | null",
              "isBooked": "boolean",
              "bookedAt": "timestamp"
            }
          }
        }
      },
      "transactions": {
        "description": "Immutable ledger of all financial events with atomic audit trail",
        "fields": {
          "id": "string",
          "userId": "string",
          "type": "string (deposit | withdrawal | entry_fee | prize_winnings)",
          "amount": "number",
          "walletSource": "string (deposit | winnings | both)",
          "status": "string (pending | completed | rejected)",
          "referenceId": "string (UTR or Payout Ref)",
          "description": "string",
          "metadata": "map (upiId, targetGmail, redeemCode, utrNumber)",
          "timestamp": "timestamp"
        }
      },
      "redeem_codes": {
        "description": "Pre-loaded Google Play redeem codes for automated FIFO queue",
        "fields": {
          "id": "string",
          "denomination": "number (10 | 30 | 80 | 100 | 250)",
          "code": "string",
          "isUsed": "boolean",
          "usedByUserId": "string | null",
          "sentToEmail": "string | null",
          "assignedAt": "timestamp"
        }
      }
    }
  }
}`;

export const FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // User Profile Rules
    match /users/{userId} {
      allow read: if isAuthenticated();
      // Financial balance fields can ONLY be written by Cloud Functions / Admin SDK
      allow update: if isOwner(userId) 
        && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['depositBalance', 'winningsBalance', 'isBanned']);
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow write: if isAdmin();
    }

    // Tournament & Slot Rules
    match /tournaments/{tournamentId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
      
      match /slots/{slotId} {
        allow read: if isAuthenticated();
        // Slots booking is executed via Cloud Function / Express backend for atomic balance check
        allow write: if isAdmin();
      }
    }

    // Immutable Financial Ledger
    match /transactions/{transactionId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
      allow write: if isAdmin(); // Only backend server can generate ledger logs
    }

    // Google Play Code Inventory
    match /redeem_codes/{codeId} {
      allow read, write: if isAdmin();
    }
  }
}`;
