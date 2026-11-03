import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { Gift, Send, CheckCircle2, Clock, Mail, ShieldCheck, Plus, RefreshCw, AlertCircle } from 'lucide-react';

export const AdminPayoutQueue: React.FC = () => {
  const {
    transactions,
    redeemInventory,
    executeUpiPayout,
    fulfillGooglePlayCodePayout,
    smtpStatus,
  } = useEsports();

  const [activeSubTab, setActiveSubTab] = useState<'redeem' | 'upi' | 'inventory'>('redeem');
  const [manualCodeInput, setManualCodeInput] = useState<Record<string, string>>({});
  const [upiRefInput, setUpiRefInput] = useState<Record<string, string>>({});
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isFulfilling, setIsFulfilling] = useState<string | null>(null);

  // Filter pending payouts
  const pendingUpi = transactions.filter(
    (t) => t.type === 'withdrawal' && t.status === 'pending' && t.metadata?.upiId
  );

  const pendingGooglePlay = transactions.filter(
    (t) => t.type === 'withdrawal' && t.status === 'pending' && t.metadata?.targetGmail
  );

  // Available unused codes count
  const unusedCodesCount = redeemInventory.filter((r) => !r.isUsed).length;

  const handleExecuteUpi = (txId: string) => {
    const ref = upiRefInput[txId] || `UTR${Date.now().toString().slice(-9)}`;
    executeUpiPayout(txId, ref);
    setActionNotice(`UPI Payout marked as completed with Bank Ref: ${ref}`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleFulfillCode = async (txId: string) => {
    const customCode = manualCodeInput[txId];
    setIsFulfilling(txId);
    try {
      const res = await fulfillGooglePlayCodePayout(txId, customCode);
      setActionNotice(res.message);
    } catch (err: any) {
      setActionNotice(err?.message || 'Failed to dispatch redeem code');
    } finally {
      setIsFulfilling(null);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-gaming font-bold text-white text-base">
            WITHDRAWAL PAYOUTS &amp; DISPATCH QUEUE
          </h3>
          <p className="text-xs text-slate-400">
            Process Direct UPI Bank payouts and Automated Nodemailer Google Play Redeem Code delivery.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex rounded-xl bg-[#121824] p-1 border border-white/5 text-xs">
          <button
            onClick={() => setActiveSubTab('redeem')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'redeem'
                ? 'bg-[#00E5FF] text-[#090D16] shadow-md shadow-[#00E5FF]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Redeem Codes ({pendingGooglePlay.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('upi')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'upi'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>UPI Payouts ({pendingUpi.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'inventory'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Code Inventory ({unusedCodesCount})</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-xl bg-[#00E676]/20 border border-[#00E676]/40 text-[#00E676] text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* SUB-TAB 1: GOOGLE PLAY REDEEM CODE QUEUE */}
      {activeSubTab === 'redeem' && (
        <div className="space-y-3">
          {/* Real Gmail SMTP Status Bar */}
          <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <Mail className="w-4 h-4 text-[#00E5FF]" />
              <span className="font-gaming font-bold text-slate-300">Deliverable 3 Nodemailer Engine:</span>
              {smtpStatus.isConfigured ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE GMAIL SMTP CONNECTED ({smtpStatus.systemGmail})
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono text-[11px] border border-amber-500/30 flex items-center gap-1">
                  <span>PREVIEW MODE ACTIVE</span>
                  <span className="text-slate-400">(Set SYSTEM_GMAIL &amp; SYSTEM_APP_PASSWORD in .env for live inbox delivery)</span>
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">service: gmail</span>
          </div>

          <div className="rounded-2xl bg-[#121824] border border-white/10 overflow-hidden shadow-xl">
            <div className="p-3.5 bg-[#171F2F] border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#00E5FF]" /> Google Play Code Queue (Automated Nodemailer Dispatch)
              </span>
              <span className="text-[11px] text-[#00E5FF] font-mono">
                FIFO Inventory Available: {unusedCodesCount} codes
              </span>
            </div>

            <div className="overflow-x-auto">
              {pendingGooglePlay.length === 0 ? (
                <div className="p-10 text-center text-slate-500 text-xs">
                  No pending Google Play redeem code requests in the queue.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#090D16] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/5">
                    <tr>
                      <th className="py-3 px-4">Player &amp; Email</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Requested Time</th>
                      <th className="py-3 px-4">Manual Code Override (Optional)</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {pendingGooglePlay.map((tx) => {
                      const targetEmail = tx.metadata?.targetGmail || '';
                      const nextFifoCode = redeemInventory.find(
                        (r) => !r.isUsed && r.denomination === tx.amount
                      )?.code;
                      const isProcessingThis = isFulfilling === tx.id;

                      return (
                        <tr key={tx.id} className="hover:bg-white/[0.02]">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">{tx.userName}</div>
                            <div className="text-[11px] font-mono text-[#00E5FF]">{targetEmail}</div>
                            <div className="text-[10px] text-slate-500 font-mono">TxRef: {tx.referenceId}</div>
                          </td>

                          <td className="py-3.5 px-4 font-black font-gaming text-base text-[#00E676]">
                            ₹{tx.amount}
                          </td>

                          <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">
                            {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>

                          <td className="py-3.5 px-4">
                            <input
                              type="text"
                              placeholder={nextFifoCode ? `FIFO: ${nextFifoCode}` : 'Exhausted! Enter 16-char code'}
                              value={manualCodeInput[tx.id] || ''}
                              onChange={(e) =>
                                setManualCodeInput({ ...manualCodeInput, [tx.id]: e.target.value })
                              }
                              className="w-56 px-3 py-1.5 rounded-lg bg-[#090D16] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00E5FF]"
                            />
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleFulfillCode(tx.id)}
                              disabled={isProcessingThis}
                              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00E676] hover:opacity-90 disabled:opacity-50 text-[#090D16] font-gaming font-black text-xs tracking-wider flex items-center gap-1.5 shadow-md shadow-[#00E5FF]/20 active:scale-95 transition-all ml-auto"
                            >
                              <Send className={`w-3.5 h-3.5 ${isProcessingThis ? 'animate-bounce' : ''}`} />
                              {isProcessingThis ? 'DISPATCHING EMAIL...' : 'APPROVE & EMAIL CODE'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DIRECT UPI PAYOUT QUEUE */}
      {activeSubTab === 'upi' && (
        <div className="rounded-2xl bg-[#121824] border border-white/10 overflow-hidden shadow-xl">
          <div className="p-3.5 bg-[#171F2F] border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF5722]" /> Direct UPI Bank Transfer Queue
            </span>
          </div>

          <div className="overflow-x-auto">
            {pendingUpi.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-xs">
                No pending UPI withdrawal requests right now.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090D16] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">Player</th>
                    <th className="py-3 px-4">UPI VPA</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Bank Payout Ref / UTR</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {pendingUpi.map((tx) => {
                    return (
                      <tr key={tx.id} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{tx.userName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {tx.userId}</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-[#FF5722]">
                          {tx.metadata?.upiId}
                        </td>

                        <td className="py-3.5 px-4 font-black font-gaming text-base text-[#00E676]">
                          ₹{tx.amount}
                        </td>

                        <td className="py-3.5 px-4">
                          <input
                            type="text"
                            placeholder="e.g. UTR982149812401"
                            value={upiRefInput[tx.id] || ''}
                            onChange={(e) =>
                              setUpiRefInput({ ...upiRefInput, [tx.id]: e.target.value })
                            }
                            className="w-48 px-3 py-1.5 rounded-lg bg-[#090D16] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#FF5722]"
                          />
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleExecuteUpi(tx.id)}
                            className="px-3.5 py-2 rounded-xl bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-gaming font-black text-xs tracking-wider flex items-center gap-1.5 shadow-md shadow-[#FF5722]/20 active:scale-95 transition-all ml-auto"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> MARK PAID VIA UPI
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PRE-LOADED REDEEM CODE INVENTORY */}
      {activeSubTab === 'inventory' && (
        <div className="rounded-2xl bg-[#121824] border border-white/10 overflow-hidden shadow-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-gaming font-bold text-white text-sm">
                PRE-LOADED GOOGLE PLAY REDEEM CODE INVENTORY (FIFO)
              </h4>
              <p className="text-xs text-slate-400">
                Automated inventory queue. Codes are automatically assigned and marked used when a withdrawal is dispatched.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {redeemInventory.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border font-mono text-xs flex items-center justify-between ${
                  item.isUsed
                    ? 'bg-[#090D16] border-white/5 text-slate-600 line-through'
                    : 'bg-[#171F2F] border-[#00E5FF]/30 text-white'
                }`}
              >
                <div>
                  <div className="font-bold text-[#00E5FF]">₹{item.denomination} VOUCHER</div>
                  <div className="text-[11px] tracking-wider text-slate-300 mt-0.5">{item.code}</div>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    item.isUsed
                      ? 'bg-slate-800 text-slate-500'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {item.isUsed ? 'ASSIGNED' : 'IN STOCK'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
