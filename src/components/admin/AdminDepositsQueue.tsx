import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import { CheckCircle, XCircle, ExternalLink, Image, AlertCircle, Clock } from 'lucide-react';

export const AdminDepositsQueue: React.FC = () => {
  const { transactions, approveDeposit, rejectDeposit } = useEsports();
  const [rejectModalTxId, setRejectModalTxId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Invalid 12-digit UTR not found on bank statement');

  const pendingDeposits = transactions.filter((t) => t.type === 'deposit' && t.status === 'pending');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-gaming font-bold text-white text-base">PENDING DEPOSIT VERIFICATION</h3>
        <p className="text-xs text-slate-400">
          Verify 12-digit UTR transaction references against bank statement and approve instant Deposit Cash credit.
        </p>
      </div>

      <div className="rounded-2xl bg-[#121824] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-3.5 bg-[#171F2F] border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00E5FF]" /> Bank UTR Verification Queue ({pendingDeposits.length} Pending)
          </span>
        </div>

        <div className="overflow-x-auto">
          {pendingDeposits.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs">
              No pending deposit requests. All deposits verified and credited!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090D16] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Gamer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Submitted 12-Digit UTR</th>
                  <th className="py-3 px-4">Screenshot</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {pendingDeposits.map((tx) => {
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{tx.userName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {tx.userId}</div>
                      </td>

                      <td className="py-3.5 px-4 font-black font-gaming text-base text-[#00E5FF]">
                        ₹{tx.amount}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        <span className="bg-[#090D16] px-2 py-1 rounded border border-white/10 text-amber-300">
                          {tx.metadata?.utrNumber || tx.referenceId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {tx.metadata?.screenshotUrl ? (
                          <a
                            href={tx.metadata.screenshotUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#00E5FF] hover:underline"
                          >
                            <Image className="w-3.5 h-3.5" /> View Receipt
                          </a>
                        ) : (
                          <span className="text-slate-500 italic">None attached</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setRejectModalTxId(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center gap-1 border border-red-500/20 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => approveDeposit(tx.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#00E676] hover:bg-[#00E676]/90 text-[#090D16] font-gaming font-black text-xs tracking-wider flex items-center gap-1 shadow-md shadow-[#00E676]/20 transition-transform active:scale-95"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> APPROVE &amp; CREDIT
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalTxId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#121824] border border-red-500/30 rounded-2xl shadow-2xl p-5 space-y-4">
            <h4 className="font-gaming font-bold text-white text-base">REJECT DEPOSIT REQUEST</h4>
            <p className="text-xs text-slate-400">
              Provide a rejection reason which will be shown to the gamer in their transaction ledger.
            </p>
            <input
              type="text"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRejectModalTxId(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  rejectDeposit(rejectModalTxId, rejectionReason);
                  setRejectModalTxId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs"
              >
                CONFIRM REJECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
