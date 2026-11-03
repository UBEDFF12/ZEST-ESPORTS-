import React, { useState } from 'react';
import { Tournament, TournamentMode } from '../../types';
import { useEsports } from '../../context/EsportsContext';
import { Swords, Plus, Key, Users, CheckCircle, Send, X, Shield, Clock } from 'lucide-react';

export const AdminMatchManager: React.FC = () => {
  const { tournaments, createTournament, updateRoomCredentials } = useEsports();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeRosterTournament, setActiveRosterTournament] = useState<Tournament | null>(null);
  const [activePushModalTournament, setActivePushModalTournament] = useState<Tournament | null>(null);

  // Push Room Credentials State
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomPasswordInput, setRoomPasswordInput] = useState('');
  const [pushSuccessMsg, setPushSuccessMsg] = useState<string | null>(null);

  // New Tournament Form State
  const [newTitle, setNewTitle] = useState('');
  const [newMode, setNewMode] = useState<TournamentMode>('Classic BR');
  const [newMap, setNewMap] = useState<'Bermuda' | 'Purgatory' | 'Kalahari' | 'Nexterra' | 'Iron Cage'>('Bermuda');
  const [newEntryFee, setNewEntryFee] = useState(30);
  const [newPerKill, setNewPerKill] = useState(15);
  const [newPrizePool, setNewPrizePool] = useState(1200);
  const [newMaxSlots, setNewMaxSlots] = useState(48);

  const handleOpenPushModal = (tour: Tournament) => {
    setActivePushModalTournament(tour);
    setRoomIdInput(tour.roomId || '8910482');
    setRoomPasswordInput(tour.roomPassword || 'ZEST@99');
    setPushSuccessMsg(null);
  };

  const handleExecutePush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePushModalTournament) return;

    updateRoomCredentials(
      activePushModalTournament.id,
      roomIdInput.trim(),
      roomPasswordInput.trim(),
      true // Reveal immediately
    );

    setPushSuccessMsg(`Room ID: ${roomIdInput} & Password pushed to ${activePushModalTournament.bookedSlotsCount} players in real-time!`);
    setTimeout(() => {
      setActivePushModalTournament(null);
    }, 2500);
  };

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    createTournament({
      title: newTitle || `ZEST ${newMode.toUpperCase()} CHAMPIONSHIP`,
      mode: newMode,
      map: newMap,
      entryFee: Number(newEntryFee),
      perKillPrize: Number(newPerKill),
      totalPrizePool: Number(newPrizePool),
      maxSlots: Number(newMaxSlots),
      scheduleTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-gaming font-bold text-white text-base">TOURNAMENTS &amp; ROOM CONTROL</h3>
          <p className="text-xs text-slate-400">
            Create match brackets, inspect participant slots, and broadcast Room ID &amp; Password.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-gaming font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#FF5722]/30 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> HOST NEW TOURNAMENT
        </button>
      </div>

      {/* Tournaments Table / Cards */}
      <div className="rounded-2xl bg-[#121824] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171F2F] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Tournament Title &amp; Mode</th>
                <th className="py-3 px-4">Map</th>
                <th className="py-3 px-4">Slots Joined</th>
                <th className="py-3 px-4">Entry / Kill / Pool</th>
                <th className="py-3 px-4">Room Credentials</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {tournaments.map((tour) => {
                return (
                  <tr key={tour.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-gaming font-bold text-white text-sm">{tour.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-orange-500/10 text-orange-400 font-mono text-[10px] font-bold">
                          {tour.mode}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {tour.id}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#00E5FF]">
                      {tour.map}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white">
                        {tour.bookedSlotsCount} / {tour.maxSlots}
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-[#090D16] mt-1 overflow-hidden">
                        <div
                          className="h-full bg-[#00E676] rounded-full"
                          style={{ width: `${(tour.bookedSlotsCount / tour.maxSlots) * 100}%` }}
                        ></div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div><span className="text-slate-500">Entry:</span> ₹{tour.entryFee}</div>
                      <div><span className="text-slate-500">Per Kill:</span> ₹{tour.perKillPrize}</div>
                      <div className="text-[#00E676] font-bold">Pool: ₹{tour.totalPrizePool}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs">
                      {tour.roomId ? (
                        <div>
                          <div className="text-[#00E5FF] font-bold">ID: {tour.roomId}</div>
                          <div className="text-[#FF5722] font-bold">Pass: {tour.roomPassword}</div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${tour.isRoomRevealed ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-amber-500/20 text-amber-400'}`}>
                            {tour.isRoomRevealed ? 'REVEALED' : 'LOCKED (AUTO 15M)'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Not generated</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveRosterTournament(tour)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center gap-1 border border-white/5"
                          title="Inspect Roster"
                        >
                          <Users className="w-3.5 h-3.5" /> Roster
                        </button>
                        <button
                          onClick={() => handleOpenPushModal(tour)}
                          className="px-3 py-1.5 rounded-lg bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-gaming font-bold text-xs flex items-center gap-1 shadow-md shadow-[#FF5722]/20"
                        >
                          <Key className="w-3.5 h-3.5" /> Push Room
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roster Modal */}
      {activeRosterTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#121824] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-[#171F2F] border-b border-white/5">
              <div>
                <h3 className="font-gaming font-bold text-white text-base">
                  PARTICIPANT ROSTER ({activeRosterTournament.bookedSlotsCount}/{activeRosterTournament.maxSlots})
                </h3>
                <p className="text-xs text-slate-400">{activeRosterTournament.title}</p>
              </div>
              <button
                onClick={() => setActiveRosterTournament(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeRosterTournament.slots.map((s) => (
                  <div
                    key={s.slotNumber}
                    className={`p-2.5 rounded-xl border flex items-center justify-between font-mono ${
                      s.isBooked
                        ? 'bg-[#171F2F] border-[#00E5FF]/30 text-white'
                        : 'bg-[#090D16] border-white/5 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#FF5722]">#{s.slotNumber}</span>
                      <span className="font-gaming font-semibold text-slate-200">
                        {s.playerIgn || 'VACANT SLOT'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {s.playerUid ? `UID: ${s.playerUid}` : 'Available'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Push Room Credentials Modal */}
      {activePushModalTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#121824] border border-[#FF5722]/50 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-[#171F2F] border-b border-white/5">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#FF5722]" />
                <h3 className="font-gaming font-bold text-white text-base">BROADCAST ROOM DETAILS</h3>
              </div>
              <button
                onClick={() => setActivePushModalTournament(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecutePush} className="p-5 space-y-4">
              {pushSuccessMsg && (
                <div className="p-3 rounded-xl bg-[#00E676]/20 border border-[#00E676]/40 text-[#00E676] text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{pushSuccessMsg}</span>
                </div>
              )}

              <p className="text-xs text-slate-400">
                Pushes Room ID &amp; Password in real-time. Immediately notifies all{' '}
                <strong className="text-white">{activePushModalTournament.bookedSlotsCount} joined players</strong> via
                in-app push notification.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Custom Room ID *
                </label>
                <input
                  type="text"
                  required
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  placeholder="e.g. 8910482"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white text-sm font-mono tracking-wider focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Room Password *
                </label>
                <input
                  type="text"
                  required
                  value={roomPasswordInput}
                  onChange={(e) => setRoomPasswordInput(e.target.value)}
                  placeholder="e.g. ZEST@99"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white text-sm font-mono tracking-wider focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-gaming font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF5722]/30 transition-all"
              >
                <Send className="w-4 h-4" /> BROADCAST ROOM &amp; UNLOCK NOW
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Host New Tournament Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#121824] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-4 bg-[#171F2F] border-b border-white/5">
              <h3 className="font-gaming font-bold text-white text-base">HOST NEW ESPORTS TOURNAMENT</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTournament} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Tournament Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BERMUDA SUPREMACY #483 [SOLO]"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white font-gaming focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Game Mode
                  </label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as TournamentMode)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white font-gaming focus:outline-none"
                  >
                    <option value="Classic BR">Classic BR</option>
                    <option value="CS 4v4">CS 4v4</option>
                    <option value="CS 1v1">CS 1v1</option>
                    <option value="Lone Wolf">Lone Wolf</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Map
                  </label>
                  <select
                    value={newMap}
                    onChange={(e) => setNewMap(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white font-gaming focus:outline-none"
                  >
                    <option value="Bermuda">Bermuda</option>
                    <option value="Purgatory">Purgatory</option>
                    <option value="Kalahari">Kalahari</option>
                    <option value="Nexterra">Nexterra</option>
                    <option value="Iron Cage">Iron Cage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Entry Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newEntryFee}
                    onChange={(e) => setNewEntryFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D16] border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Per Kill (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPerKill}
                    onChange={(e) => setNewPerKill(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D16] border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Prize Pool (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPrizePool}
                    onChange={(e) => setNewPrizePool(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D16] border border-white/10 text-[#00E676] font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Max Slots / Capacity
                </label>
                <input
                  type="number"
                  min="2"
                  max="100"
                  value={newMaxSlots}
                  onChange={(e) => setNewMaxSlots(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3 rounded-xl bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-gaming font-black text-xs tracking-wider shadow-lg shadow-[#FF5722]/30"
                >
                  CREATE &amp; OPEN REGISTRATION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
