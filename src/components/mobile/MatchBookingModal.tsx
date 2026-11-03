import React, { useState } from 'react';
import { Tournament } from '../../types';
import { useEsports } from '../../context/EsportsContext';
import { X, CheckCircle, AlertTriangle, ShieldCheck, User, Hash } from 'lucide-react';

interface MatchBookingModalProps {
  tournament: Tournament;
  onClose: () => void;
  onSuccess: () => void;
}

export const MatchBookingModal: React.FC<MatchBookingModalProps> = ({
  tournament,
  onClose,
  onSuccess,
}) => {
  const { currentUser, bookTournamentSlot } = useEsports();

  // Find first available slot
  const firstAvailable = tournament.slots.find((s) => !s.isBooked)?.slotNumber || 1;
  const [selectedSlot, setSelectedSlot] = useState<number>(firstAvailable);
  const [ign, setIgn] = useState(currentUser.freeFireIgn);
  const [uid, setUid] = useState(currentUser.freeFireUid);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Total balance
  const totalBalance = currentUser.depositBalance + currentUser.winningsBalance;
  const hasEnoughBalance = totalBalance >= tournament.entryFee;

  // Check if current user is already booked in this tournament
  const userExistingSlot = tournament.slots.find((s) => s.userId === currentUser.id);

  const handleBooking = () => {
    setErrorMsg(null);
    if (!ign.trim()) {
      setErrorMsg('Free Fire In-Game Name (IGN) is required.');
      return;
    }
    if (!uid.trim() || uid.trim().length < 6) {
      setErrorMsg('Valid Free Fire UID is required (6-12 digits).');
      return;
    }

    setIsSubmitting(true);
    const result = bookTournamentSlot(tournament.id, selectedSlot, ign, uid);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#121824] border-t sm:border border-white/10 sm:rounded-2xl shadow-2xl rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#171F2F]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
              Atomic Slot Booking
            </span>
            <h3 className="font-gaming font-bold text-white text-base tracking-wide truncate max-w-[280px]">
              {tournament.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {userExistingSlot && (
            <div className="p-3 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-xs text-[#00E5FF] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>You already booked Slot #{userExistingSlot.slotNumber} in this match!</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Slot Grid Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#FF5722]" /> Choose Slot Number ({tournament.bookedSlotsCount}/{tournament.maxSlots})
              </label>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600"></span> Booked</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span> Selected</span>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 p-3 rounded-xl bg-[#090D16] border border-white/5 max-h-40 overflow-y-auto">
              {tournament.slots.map((slot) => {
                const isSelected = selectedSlot === slot.slotNumber;
                const isBooked = slot.isBooked;
                const isUserSlot = slot.userId === currentUser.id;

                return (
                  <button
                    key={slot.slotNumber}
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot.slotNumber)}
                    className={`h-9 rounded-lg font-mono text-xs font-bold transition-all relative flex items-center justify-center ${
                      isUserSlot
                        ? 'bg-[#00E676]/30 text-[#00E676] border border-[#00E676]'
                        : isSelected
                        ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/50 scale-105 z-10'
                        : isBooked
                        ? 'bg-white/5 text-slate-600 cursor-not-allowed line-through'
                        : 'bg-[#171F2F] text-slate-300 hover:bg-[#1E293B] hover:text-white border border-white/5'
                    }`}
                  >
                    #{slot.slotNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player In-Game Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Free Fire In-Game Name (IGN)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ign}
                  onChange={(e) => setIgn(e.target.value)}
                  placeholder="e.g. RAISTAR_ZEST"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white text-xs font-gaming focus:outline-none focus:border-[#FF5722]"
                />
                <User className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Free Fire In-Game UID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="e.g. 7849103942"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#FF5722]"
                />
                <Hash className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="p-4 rounded-xl bg-[#090D16] border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Match Entry Fee</span>
              <span className="font-bold text-white font-gaming">₹{tournament.entryFee}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Your Deposit Cash</span>
              <span className="text-[#00E5FF] font-semibold">₹{currentUser.depositBalance}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Your Winnings Cash</span>
              <span className="text-[#00E676] font-semibold">₹{currentUser.winningsBalance}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="font-bold text-slate-200">Total Deducted:</span>
              <span className="text-base font-black text-[#FF5722] font-gaming">
                ₹{tournament.entryFee}
              </span>
            </div>
          </div>

          {!hasEnoughBalance && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
              ⚠️ You need ₹{tournament.entryFee - totalBalance} more to book this slot. Please top up your Deposit Cash first.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#171F2F] border-t border-white/5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
          >
            CANCEL
          </button>
          <button
            onClick={handleBooking}
            disabled={!hasEnoughBalance || isSubmitting}
            className="flex-[2] py-3 rounded-xl bg-[#FF5722] hover:bg-[#FF5722]/90 disabled:opacity-50 text-white font-black text-xs tracking-wider transition-all shadow-lg shadow-[#FF5722]/30"
          >
            {isSubmitting ? 'RESERVING...' : `CONFIRM SLOT #${selectedSlot} (PAY ₹${tournament.entryFee})`}
          </button>
        </div>
      </div>
    </div>
  );
};
