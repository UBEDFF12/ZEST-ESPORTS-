import React, { useState } from 'react';
import { useEsports } from '../../context/EsportsContext';
import {
  Trophy,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Gift,
  Upload,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';

export const MobileWalletScreen: React.FC = () => {
  const {
    currentUser,
    transactions,
    submitDepositRequest,
    submitUpiWithdrawal,
    submitGooglePlayWithdrawal,
  } = useEsports();

  const [activeTab, setActiveTab] = useState<'withdraw' | 'deposit' | 'ledger'>('withdraw');
  const [withdrawMethod, setWithdrawMethod] = useState<'upi' | 'google_play'>('upi');

  // Withdrawal States
  const [upiId, setUpiId] = useState('');
  const [upiAmount, setUpiAmount] = useState('100');

  const [googlePlayAmount, setGooglePlayAmount] = useState<number>(100);
  const [gmailAddress, setGmailAddress] = useState(currentUser.email || '');

  // Deposit States
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Status/Alert Feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const copyUpiVpa = () => {
    navigator.clipboard.writeText('zestpay@okicici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // 1. Submit UPI Withdrawal
  const handleUpiWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(upiAmount);
    const result = submitUpiWithdrawal(amountNum, upiId);
    if (result.success) {
      showToast(result.message, 'success');
      setUpiId('');
    } else {
      showToast(result.message, 'error');
    }
  };

  // 2. Submit Google Play Code Withdrawal
  const handleGooglePlayWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const result = submitGooglePlayWithdrawal(googlePlayAmount, gmailAddress);
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  // 3. Submit Deposit Request
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = submitDepositRequest(
      depositAmount,
      utrNumber,
      screenshotUploaded ? 'https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=600&auto=format&fit=crop&q=80' : undefined
    );
    if (result.success) {
      showToast(result.message, 'success');
      setUtrNumber('');
      setScreenshotUploaded(false);
    } else {
      showToast(result.message, 'error');
    }
  };

  // Filter transactions for current user
  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);

  return (
    <div className="space-y-4 pb-24 px-4 pt-2">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#00E676]/15 border-[#00E676]/40 text-[#00E676]'
              : 'bg-red-500/15 border-red-500/40 text-red-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* DUAL BALANCE HERO ARCHITECTURE */}
      <div className="p-4 rounded-2xl bg-[#121824] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Zest Dual-Balance Architecture
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> SECURE VAULT
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* WINNINGS CASH */}
          <div className="p-3.5 rounded-xl bg-[#171F2F] border border-[#00E676]/30 relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1 font-bold text-slate-300">
                <Trophy className="w-3.5 h-3.5 text-[#00E676]" /> WINNINGS CASH
              </span>
            </div>
            <div className="text-2xl font-black font-gaming text-[#00E676] tracking-tight">
              ₹{currentUser.winningsBalance.toFixed(2)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400/90 font-medium">
              <CheckCircle2 className="w-3 h-3 text-[#00E676]" /> 100% Withdrawable
            </div>
          </div>

          {/* DEPOSIT CASH */}
          <div className="p-3.5 rounded-xl bg-[#171F2F] border border-[#00E5FF]/30 relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1 font-bold text-slate-300">
                <Wallet className="w-3.5 h-3.5 text-[#00E5FF]" /> DEPOSIT CASH
              </span>
            </div>
            <div className="text-2xl font-black font-gaming text-[#00E5FF] tracking-tight">
              ₹{currentUser.depositBalance.toFixed(2)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-cyan-400/90 font-medium">
              <Clock className="w-3 h-3 text-[#00E5FF]" /> For Match Entry Only
            </div>
          </div>
        </div>
      </div>

      {/* TOP-LEVEL TABS (WITHDRAW / DEPOSIT / LEDGER) */}
      <div className="flex rounded-xl bg-[#121824] p-1 border border-white/5">
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 py-2 rounded-lg font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'withdraw'
              ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" /> WITHDRAW
        </button>
        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 py-2 rounded-lg font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'deposit'
              ? 'bg-[#00E5FF] text-[#090D16] shadow-md shadow-[#00E5FF]/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowDownLeft className="w-3.5 h-3.5" /> DEPOSIT
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex-1 py-2 rounded-lg font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'ledger'
              ? 'bg-white/15 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> HISTORY
        </button>
      </div>

      {/* TAB 1: WITHDRAWAL MODULE */}
      {activeTab === 'withdraw' && (
        <div className="space-y-4">
          {/* Method Sub-Toggle */}
          <div className="p-3 rounded-2xl bg-[#121824] border border-white/5 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Choose Payout Destination
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWithdrawMethod('upi')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  withdrawMethod === 'upi'
                    ? 'bg-[#FF5722]/15 border-[#FF5722] text-white'
                    : 'bg-[#171F2F] border-white/5 text-slate-400 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">Direct UPI Payout</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-mono">
                    FAST
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</p>
              </button>

              <button
                type="button"
                onClick={() => setWithdrawMethod('google_play')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  withdrawMethod === 'google_play'
                    ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-white'
                    : 'bg-[#171F2F] border-white/5 text-slate-400 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">Google Play Code</span>
                  <Gift className="w-3.5 h-3.5 text-[#00E5FF]" />
                </div>
                <p className="text-[10px] text-slate-400">Automated to Gmail</p>
              </button>
            </div>
          </div>

          {/* Form 1: Direct UPI Payout */}
          {withdrawMethod === 'upi' ? (
            <form onSubmit={handleUpiWithdraw} className="p-4 rounded-2xl bg-[#121824] border border-white/5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. gamer@okhdfcbank or 9876543210@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#FF5722]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Must follow standard <code className="text-[#FF5722]">username@bank</code> structure.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Withdrawal Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    max={currentUser.winningsBalance}
                    required
                    value={upiAmount}
                    onChange={(e) => setUpiAmount(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white text-base font-black font-gaming focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Available Winnings: ₹{currentUser.winningsBalance.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => setUpiAmount(currentUser.winningsBalance.toString())}
                    className="text-[#FF5722] hover:underline font-bold"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={currentUser.winningsBalance <= 0 || parseFloat(upiAmount) > currentUser.winningsBalance}
                className="w-full py-3 rounded-xl bg-[#FF5722] hover:bg-[#FF5722]/90 disabled:opacity-40 text-white font-gaming font-black text-xs tracking-wider shadow-lg shadow-[#FF5722]/30 active:scale-98 transition-all"
              >
                REQUEST DIRECT UPI PAYOUT (₹{upiAmount || 0})
              </button>
            </form>
          ) : (
            /* Form 2: Google Play Redeem Code */
            <form onSubmit={handleGooglePlayWithdraw} className="p-4 rounded-2xl bg-[#121824] border border-white/5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Select Gift Voucher Denomination (₹)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[10, 30, 80, 100, 250].map((denom) => {
                    const isSelected = googlePlayAmount === denom;
                    const canAfford = currentUser.winningsBalance >= denom;
                    return (
                      <button
                        key={denom}
                        type="button"
                        onClick={() => setGooglePlayAmount(denom)}
                        className={`py-2 rounded-xl text-xs font-bold font-gaming transition-all ${
                          isSelected
                            ? 'bg-[#00E5FF] text-[#090D16] shadow-md shadow-[#00E5FF]/40 scale-105'
                            : canAfford
                            ? 'bg-[#090D16] text-white hover:bg-white/10 border border-white/10'
                            : 'bg-[#090D16] text-slate-600 border border-white/5 opacity-50'
                        }`}
                      >
                        ₹{denom}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Target Google Account (@gmail.com only)
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={gmailAddress}
                  onChange={(e) => setGmailAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#00E5FF]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Strict requirement: Automated Nodemailer engine delivers 16-digit voucher to this inbox.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#090D16] border border-white/5 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Voucher Amount:</span>
                  <span className="font-bold text-[#00E5FF]">₹{googlePlayAmount} INR</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Deduction Source:</span>
                  <span className="font-bold text-[#00E676]">Winnings Cash</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={currentUser.winningsBalance < googlePlayAmount}
                className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-[#00E5FF]/90 disabled:opacity-40 text-[#090D16] font-gaming font-black text-xs tracking-wider shadow-lg shadow-[#00E5FF]/30 active:scale-98 transition-all"
              >
                DISPATCH GOOGLE PLAY CODE (₹{googlePlayAmount})
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: DEPOSIT MODULE WITH DYNAMIC UPI QR */}
      {activeTab === 'deposit' && (
        <form onSubmit={handleDepositSubmit} className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#121824] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-gaming font-bold text-white text-sm">DYNAMIC UPI QR TOPUP</h4>
                <p className="text-[11px] text-slate-400">Scan via GPay, PhonePe, Paytm, or BHIM</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-[#00E5FF] font-mono font-bold">
                0% CONVENIENCE FEE
              </span>
            </div>

            {/* Quick Amount Selector */}
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Deposit Amount
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 200, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-gaming font-bold transition-all ${
                      depositAmount === amt
                        ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                        : 'bg-[#090D16] text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Dynamic UPI QR Container */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-white/10 text-center space-y-3">
              <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-xl shadow-lg relative flex items-center justify-center">
                {/* SVG QR Code Simulation */}
                <svg className="w-full h-full text-black" viewBox="0 0 100 100">
                  <path
                    fill="currentColor"
                    d="M0 0h30v30H0zm4 4h22v22H4zm4 4h14v14H8zm62-8h30v30H70zm4 4h22v22H74zm4 4h14v14H78zm-78 62h30v30H0zm4 4h22v22H4zm4 4h14v14H8zm38-66h8v8h-8zm10 0h8v8h-8zm-10 10h8v8h-8zm20 0h8v8h-8zm-10 10h8v8h-8zm20 0h8v8h-8zm-40 20h8v8h-8zm10 0h8v8h-8zm20 0h8v8h-8zm10 0h8v8h-8zm20 0h8v8h-8zm-40 10h8v8h-8zm20 0h8v8h-8zm10 0h8v8h-8zm-40 10h8v8h-8zm10 0h8v8h-8zm30 0h8v8h-8zm-30 10h8v8h-8zm20 0h8v8h-8zm10 0h8v8h-8z"
                  />
                </svg>
                {/* Center Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-1.5 py-0.5 rounded bg-[#090D16] text-[#FF5722] font-black text-[9px] font-gaming">
                    ZEST
                  </div>
                </div>
              </div>

              {/* Copyable VPA */}
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="text-slate-400">UPI ID:</span>
                <span className="font-mono font-bold text-white">zestpay@okicici</span>
                <button
                  type="button"
                  onClick={copyUpiVpa}
                  className="p-1 rounded hover:bg-white/10 text-[#00E5FF]"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* 12-Digit UTR Validation */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Bank 12-Digit UTR / Transaction ID *
              </label>
              <input
                type="text"
                maxLength={12}
                required
                placeholder="e.g. 419208472910"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white text-sm font-mono tracking-widest focus:outline-none focus:border-[#00E5FF]"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>Find this 12-digit number on your GPay/PhonePe receipt.</span>
                <span className={utrNumber.length === 12 ? 'text-[#00E676] font-bold' : 'text-slate-500'}>
                  {utrNumber.length}/12 digits
                </span>
              </div>
            </div>

            {/* Screenshot simulation upload */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Upload Payment Screenshot (Optional for Instant Verification)
              </label>
              <button
                type="button"
                onClick={() => setScreenshotUploaded(!screenshotUploaded)}
                className={`w-full py-3 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                  screenshotUploaded
                    ? 'bg-[#00E676]/10 border-[#00E676] text-[#00E676]'
                    : 'bg-[#090D16] border-white/15 text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                {screenshotUploaded ? 'Screenshot Attached (phonepe_receipt.png)' : 'Click to Simulate Screenshot Upload'}
              </button>
            </div>

            <button
              type="submit"
              disabled={utrNumber.length !== 12}
              className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-[#00E5FF]/90 disabled:opacity-40 text-[#090D16] font-gaming font-black text-xs tracking-wider shadow-lg shadow-[#00E5FF]/30 active:scale-98 transition-all"
            >
              SUBMIT DEPOSIT VERIFICATION (₹{depositAmount})
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: TRANSACTION LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Financial Activity
            </span>
            <span className="text-[11px] text-slate-500">{userTransactions.length} events logged</span>
          </div>

          <div className="space-y-2">
            {userTransactions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">No transactions recorded yet.</div>
            ) : (
              userTransactions.map((tx) => {
                const isCredit = tx.type === 'deposit' || tx.type === 'prize_winnings' || tx.type === 'referral_bonus';
                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-[#121824] border border-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.type === 'prize_winnings'
                            ? 'bg-[#00E676]/20 text-[#00E676]'
                            : tx.type === 'deposit'
                            ? 'bg-[#00E5FF]/20 text-[#00E5FF]'
                            : 'bg-[#FF5722]/20 text-[#FF5722]'
                        }`}
                      >
                        {tx.type === 'prize_winnings' && <Trophy className="w-4 h-4" />}
                        {tx.type === 'deposit' && <ArrowDownLeft className="w-4 h-4" />}
                        {tx.type === 'withdrawal' && <ArrowUpRight className="w-4 h-4" />}
                        {tx.type === 'entry_fee' && <Wallet className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <div className="font-bold text-white truncate max-w-[170px] sm:max-w-none">
                          {tx.description}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                          <span>Ref: {tx.referenceId}</span>
                          <span>•</span>
                          <span>{new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`font-black font-gaming text-sm ${
                          isCredit ? 'text-[#00E676]' : 'text-slate-300'
                        }`}
                      >
                        {isCredit ? '+' : '-'}₹{tx.amount}
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                          tx.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : tx.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
