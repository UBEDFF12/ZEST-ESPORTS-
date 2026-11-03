import React from 'react';
import { EsportsProvider, useEsports } from './context/EsportsContext';
import { MobileAppFrame } from './components/mobile/MobileAppFrame';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DeliverablesHub } from './components/deliverables/DeliverablesHub';
import { EmailPreviewModal } from './components/common/EmailPreviewModal';
import {
  Smartphone,
  LayoutDashboard,
  Columns,
  Code2,
  Flame,
  Activity,
  Trophy,
  Wallet,
  ShieldCheck,
} from 'lucide-react';

const MainShell: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    transactions,
    isAuthenticated,
    logout,
    firebaseConnected,
    firebaseProjectId,
  } = useEsports();

  const pendingPayoutCount = transactions.filter(
    (t) => t.type === 'withdrawal' && t.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Esports Master Navigation Bar */}
      <header className="bg-[#090D16]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#E64A19] to-[#FF9100] flex items-center justify-center shadow-lg shadow-[#FF5722]/30 border border-white/20">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-gaming font-black text-xl tracking-wider text-white">
                  ZEST <span className="text-[#FF5722]">ESPORTS</span>
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 uppercase">
                  ENTERPRISE ECOSYSTEM
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-[#00E676]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"></span>
                  {firebaseConnected ? '🔥 FIREBASE FIRESTORE & AUTH CONNECTED' : 'OFFLINE'}
                </span>
                <span>•</span>
                <span className="text-[#00E5FF] font-semibold">{firebaseProjectId}</span>
                <span>•</span>
                <span>24ms</span>
              </div>
            </div>
          </div>

          {/* View Switcher Pill Navigation */}
          <div className="flex items-center bg-[#121824] p-1 rounded-2xl border border-white/10 shadow-inner">
            <button
              onClick={() => setActiveView('mobile')}
              className={`px-3.5 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-1.5 transition-all ${
                activeView === 'mobile'
                  ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Gamer App (Android)</span>
            </button>

            <button
              onClick={() => setActiveView('admin')}
              className={`px-3.5 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-1.5 transition-all relative ${
                activeView === 'admin'
                  ? 'bg-[#00E5FF] text-[#090D16] shadow-lg shadow-[#00E5FF]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Web Panel</span>
              {pendingPayoutCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-ping absolute top-1 right-1"></span>
              )}
            </button>

            <button
              onClick={() => setActiveView('dual')}
              className={`px-3.5 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-1.5 transition-all ${
                activeView === 'dual'
                  ? 'bg-[#00E676] text-[#090D16] shadow-lg shadow-[#00E676]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Live Dual-View</span>
            </button>

            <button
              onClick={() => setActiveView('deliverables')}
              className={`px-3.5 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-1.5 transition-all ${
                activeView === 'deliverables'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Architect Deliverables</span>
            </button>
          </div>

          {/* Quick Header Mini Ledger */}
          <div className="hidden xl:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="px-3 py-1.5 rounded-xl bg-[#121824] border border-white/5 flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Player:</span>
                <span className="font-gaming font-bold text-white">{currentUser.freeFireIgn}</span>
                <span className="text-[#00E676] font-mono font-bold">₹{currentUser.winningsBalance} Win</span>
                <button
                  onClick={logout}
                  className="ml-1 text-[10px] text-red-400 hover:text-red-300 font-mono underline"
                  title="Log Out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveView('mobile')}
                className="px-3 py-1.5 rounded-xl bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FF5722] hover:bg-[#FF5722]/30 flex items-center gap-1.5 text-xs font-bold font-gaming"
              >
                <span>LOG IN / SIGN UP</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1">
        {/* Single Mobile View */}
        {activeView === 'mobile' && (
          <div className="py-6 px-4">
            <MobileAppFrame embeddedInDualView={false} />
          </div>
        )}

        {/* Single Admin View */}
        {activeView === 'admin' && <AdminDashboard />}

        {/* Dual Live Split View */}
        {activeView === 'dual' && (
          <div className="p-4 max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[calc(100vh-80px)]">
            {/* Left Column: Android Mobile Device Preview (5 cols) */}
            <div className="xl:col-span-5 flex flex-col items-center justify-start sticky top-20">
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <span className="text-xs font-bold text-[#FF5722] font-gaming uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> Live Mobile Client (Free Fire Gamer)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Sync: WebSocket 0ms</span>
              </div>
              <MobileAppFrame embeddedInDualView={true} />
            </div>

            {/* Right Column: Master Admin Panel (7 cols) */}
            <div className="xl:col-span-7 rounded-3xl bg-[#121824] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
              <div className="px-5 py-3.5 bg-[#171F2F] border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-[#00E5FF] font-gaming uppercase tracking-wider flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" /> Live Master Admin Control Center
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Test: Push Room ID or Distribute Prizes &rarr; observe phone on the left!
                </span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AdminDashboard />
              </div>
            </div>
          </div>
        )}

        {/* Deliverables Hub */}
        {activeView === 'deliverables' && <DeliverablesHub />}
      </main>

      {/* Automated Nodemailer Email Receipt Modal */}
      <EmailPreviewModal />
    </div>
  );
};

export default function App() {
  return (
    <EsportsProvider>
      <MainShell />
    </EsportsProvider>
  );
}
