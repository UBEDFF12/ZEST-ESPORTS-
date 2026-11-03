import React, { useState } from 'react';
import { Tournament, TournamentMode } from '../../types';
import { useEsports } from '../../context/EsportsContext';
import { Trophy, Users, Swords, Clock, Key, ShieldCheck, Flame, ChevronRight } from 'lucide-react';
import { MatchBookingModal } from './MatchBookingModal';
import { RoomCredentialsModal } from './RoomCredentialsModal';

export const TournamentArena: React.FC = () => {
  const { tournaments, currentUser } = useEsports();
  const [selectedMode, setSelectedMode] = useState<TournamentMode | 'ALL'>('Classic BR');
  const [activeBookingTournament, setActiveBookingTournament] = useState<Tournament | null>(null);
  const [activeRoomTournament, setActiveRoomTournament] = useState<Tournament | null>(null);

  const modes: (TournamentMode | 'ALL')[] = ['Classic BR', 'CS 1v1', 'CS 4v4', 'Lone Wolf', 'ALL'];

  const filteredTournaments = tournaments.filter((t) => {
    if (selectedMode === 'ALL') return true;
    return t.mode === selectedMode;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Game Modes Filter Tabs */}
      <div className="px-4 pt-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {modes.map((mode) => {
            const isSelected = selectedMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-3.5 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30'
                    : 'bg-[#121824] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {mode === 'Classic BR' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                {mode === 'CS 4v4' && <Users className="w-3.5 h-3.5 text-[#00E5FF]" />}
                {mode === 'CS 1v1' && <Swords className="w-3.5 h-3.5 text-red-400" />}
                {mode === 'Lone Wolf' && <Trophy className="w-3.5 h-3.5 text-[#00E676]" />}
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Banner / Announcement */}
      <div className="px-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF5722]/20 via-[#121824] to-[#00E5FF]/20 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#FF5722] uppercase">
                FREE FIRE MAX ESPORTS ARENA
              </span>
              <h2 className="text-lg font-black text-white font-gaming mt-0.5">
                BOOYAH &amp; CASH OUT ⚡
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Room credentials unlock dynamically 15m prior. Instant UPI &amp; Google Play code payouts!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tournaments List */}
      <div className="px-4 space-y-4">
        {filteredTournaments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No matches found in this category right now.
          </div>
        ) : (
          filteredTournaments.map((tour) => {
            const userSlot = tour.slots.find((s) => s.userId === currentUser.id);
            const isFull = tour.bookedSlotsCount >= tour.maxSlots;
            const progressPercent = Math.min(100, Math.round((tour.bookedSlotsCount / tour.maxSlots) * 100));
            const matchDate = new Date(tour.scheduleTime);
            const timeString = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={tour.id}
                className="rounded-2xl bg-[#121824] border border-white/10 hover:border-[#FF5722]/50 transition-all overflow-hidden shadow-xl"
              >
                {/* Banner & Map Badges */}
                <div className="relative h-28 w-full overflow-hidden">
                  <img
                    src={tour.bannerUrl}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121824] via-[#121824]/60 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold font-mono text-[#00E5FF] border border-[#00E5FF]/30">
                      MAP: {tour.map.toUpperCase()}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg backdrop-blur-md text-[10px] font-bold font-mono ${
                      tour.status === 'room_unlocked'
                        ? 'bg-[#00E676]/30 text-[#00E676] border border-[#00E676]/40'
                        : tour.status === 'completed'
                        ? 'bg-slate-800 text-slate-400 border border-slate-700'
                        : 'bg-black/70 text-amber-400 border border-amber-400/30'
                    }`}>
                      {tour.status === 'room_unlocked' ? 'ROOM LIVE' : tour.status === 'completed' ? 'CONCLUDED' : `STARTS ${timeString}`}
                    </span>
                  </div>

                  {/* Match Title */}
                  <div className="absolute bottom-2 left-3 right-3">
                    <h3 className="text-sm sm:text-base font-black text-white font-gaming tracking-wide truncate">
                      {tour.title}
                    </h3>
                  </div>
                </div>

                {/* Content & Metrics Grid */}
                <div className="p-3.5 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-[#090D16] border border-white/5">
                      <div className="text-[9px] uppercase font-bold text-slate-400">Prize Pool</div>
                      <div className="text-sm font-black font-gaming text-[#00E676]">
                        ₹{tour.totalPrizePool}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#090D16] border border-white/5">
                      <div className="text-[9px] uppercase font-bold text-slate-400">Per Kill</div>
                      <div className="text-sm font-black font-gaming text-[#00E5FF]">
                        ₹{tour.perKillPrize}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#090D16] border border-white/5">
                      <div className="text-[9px] uppercase font-bold text-slate-400">Entry Fee</div>
                      <div className="text-sm font-black font-gaming text-[#FF5722]">
                        ₹{tour.entryFee}
                      </div>
                    </div>
                  </div>

                  {/* Slot Capacity Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 flex items-center gap-1 font-semibold">
                        <Users className="w-3.5 h-3.5 text-slate-500" /> Slots Filled
                      </span>
                      <span className="font-mono font-bold text-white">
                        {tour.bookedSlotsCount}/{tour.maxSlots}{' '}
                        <span className="text-slate-500 text-[10px]">({progressPercent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#090D16] overflow-hidden p-0.5 border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progressPercent >= 90
                            ? 'bg-red-500'
                            : progressPercent >= 60
                            ? 'bg-amber-400'
                            : 'bg-[#00E5FF]'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1 flex gap-2">
                    {userSlot ? (
                      <button
                        onClick={() => setActiveRoomTournament(tour)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF]/20 to-[#00E676]/20 hover:from-[#00E5FF]/30 hover:to-[#00E676]/30 text-[#00E5FF] border border-[#00E5FF]/50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#00E5FF]/10"
                      >
                        <Key className="w-3.5 h-3.5" />
                        VIEW ROOM CREDENTIALS (SLOT #{userSlot.slotNumber})
                      </button>
                    ) : (
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => setActiveRoomTournament(tour)}
                          className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center border border-white/5"
                          title="View Room Status"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveBookingTournament(tour)}
                          disabled={isFull || tour.status === 'completed'}
                          className="flex-1 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#FF5722]/90 disabled:opacity-50 text-white font-gaming font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#FF5722]/30 active:scale-98 transition-transform"
                        >
                          {tour.status === 'completed'
                            ? 'MATCH FINISHED'
                            : isFull
                            ? 'LOBBY FULL'
                            : `JOIN MATCH • ₹${tour.entryFee}`}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Booking Modal */}
      {activeBookingTournament && (
        <MatchBookingModal
          tournament={activeBookingTournament}
          onClose={() => setActiveBookingTournament(null)}
          onSuccess={() => setActiveBookingTournament(null)}
        />
      )}

      {/* Room Credentials Modal */}
      {activeRoomTournament && (
        <RoomCredentialsModal
          tournament={activeRoomTournament}
          onClose={() => setActiveRoomTournament(null)}
        />
      )}
    </div>
  );
};
