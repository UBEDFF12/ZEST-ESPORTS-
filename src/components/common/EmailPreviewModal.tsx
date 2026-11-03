import React from 'react';
import { useEsports } from '../../context/EsportsContext';
import { X, CheckCircle, Mail, ExternalLink, Copy, ShieldCheck } from 'lucide-react';

export const EmailPreviewModal: React.FC = () => {
  const { emailReceiptModal, closeEmailReceiptModal } = useEsports();
  const [copied, setCopied] = React.useState(false);

  if (!emailReceiptModal.isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailReceiptModal.redeemCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#121824] border border-[#00E5FF]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#171F2F] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Nodemailer Automated Email Dispatcher</h3>
                {emailReceiptModal.mode === 'real_smtp' ? (
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"></span>
                    REAL GMAIL SMTP SENT 200 OK
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    PREVIEW GENERATED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {emailReceiptModal.mode === 'real_smtp'
                  ? `Delivered via Google Mail SMTP to ${emailReceiptModal.toEmail}`
                  : `Dispatched preview to ${emailReceiptModal.toEmail} (Configure SYSTEM_GMAIL in .env for live inbox delivery)`}
              </p>
            </div>
          </div>
          <button
            onClick={closeEmailReceiptModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Header Preview Bar */}
        <div className="px-6 py-3 bg-[#0B111E] border-b border-white/5 text-xs text-slate-400 space-y-1 font-mono">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-500">From:</span>{' '}
              <span className="text-white">
                {emailReceiptModal.sender
                  ? `"Zest Esports Payouts" <${emailReceiptModal.sender}>`
                  : 'Zest Esports Payouts <payouts@zestesports.gg>'}
              </span>
            </div>
            <span className="text-slate-500">{emailReceiptModal.timestamp}</span>
          </div>
          <div>
            <span className="text-slate-500">To:</span> <span className="text-[#00E5FF]">{emailReceiptModal.toEmail}</span>
            {emailReceiptModal.messageId && (
              <span className="ml-3 text-slate-500 text-[10px]">Message-ID: {emailReceiptModal.messageId}</span>
            )}
          </div>
          <div>
            <span className="text-slate-500">Subject:</span>{' '}
            <span className="text-amber-300 font-semibold">
              🎁 Your ₹{emailReceiptModal.amount} Google Play Redeem Code is Here! [Zest Esports]
            </span>
          </div>
        </div>

        {/* Email Body Simulation */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-200 text-sm">
          {/* Card Banner */}
          <div className="rounded-xl overflow-hidden border border-orange-500/20 bg-gradient-to-r from-[#FF5722] to-[#D84315] p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase bg-black/30 px-2.5 py-1 rounded">
                  Official Tournament Payout
                </span>
                <h2 className="text-xl font-black mt-2 font-gaming tracking-wide">ZEST ESPORTS REWARDS</h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-2xl">
                🎮
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white">Congratulations, {emailReceiptModal.userName}!</h4>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              Your tournament winnings withdrawal request has been verified and approved. Below is your official
              Google Play Gift Voucher Code ready to be redeemed on the Google Play Store for Free Fire Diamonds, Airdrops, or in-app purchases.
            </p>
          </div>

          {/* Redeem Code Card */}
          <div className="p-5 rounded-xl bg-[#171F2F] border-2 border-dashed border-[#00E5FF]/60 text-center relative overflow-hidden">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Google Play Gift Card Code (INR)
            </span>
            <div className="my-2.5 font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-[#00E5FF]">
              {emailReceiptModal.redeemCode}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E676]/10 text-[#00E676] text-xs font-bold border border-[#00E676]/20">
              <CheckCircle className="w-3.5 h-3.5" /> Value: ₹{emailReceiptModal.amount} INR
            </div>
            <div className="mt-4">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#090D16] font-bold text-xs transition-all shadow-lg shadow-[#00E5FF]/20"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'COPIED TO CLIPBOARD!' : 'COPY REDEEM CODE'}
              </button>
            </div>
          </div>

          {/* Redemption Steps */}
          <div className="p-4 rounded-xl bg-[#090D16] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#00E676]" /> How to Redeem on your Android Device:
            </div>
            <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-5">
              <li>Open the <strong className="text-slate-200">Google Play Store</strong> app on your Android device.</li>
              <li>Tap your profile icon in the top right corner.</li>
              <li>Tap <strong className="text-slate-200">Payments & subscriptions</strong> &rarr; <strong className="text-slate-200">Redeem code</strong>.</li>
              <li>Paste the code <code className="text-[#00E5FF] font-mono">{emailReceiptModal.redeemCode}</code> and tap Redeem!</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#171F2F] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-400">Automated by Zest Esports Nodemailer Service</span>
          <button
            onClick={closeEmailReceiptModal}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
