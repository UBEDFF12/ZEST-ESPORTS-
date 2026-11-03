import React, { useState, useEffect } from 'react';
import { EsportsProvider, useEsports } from './context/EsportsContext';
import { MobileAppFrame } from './components/mobile/MobileAppFrame';
import { AdminLoginScreen } from './components/admin/AdminLoginScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DeliverablesHub } from './components/deliverables/DeliverablesHub';
import { EmailPreviewModal } from './components/common/EmailPreviewModal';
import { ShieldCheck, LogOut, Code2, LayoutDashboard, Flame, ExternalLink, ArrowLeft } from 'lucide-react';

// Route checking helper supporting both standard pathnames (/admin) and hashes (#admin)
const checkIsAdminRoute = () => {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path.startsWith('/admin') ||
    hash.startsWith('#admin') ||
    hash.startsWith('#/admin')
  );
};

const MainShell: React.FC = () => {
  const { firebaseConnected, firebaseProjectId, transactions } = useEsports();
  const [isAdminRoute, setIsAdminRoute] = useState(checkIsAdminRoute);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'deliverables'>('dashboard');

  // Listen to browser navigation changes (popstate & hashchange)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdminRoute(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const handleExitAdmin = () => {
    setIsAdminUnlocked(false);
    // Navigate back to public route
    window.location.hash = '';
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  const pendingPayoutCount = transactions.filter(
    (t) => t.type === 'withdrawal' && t.status === 'pending'
  ).length;

  // PUBLIC SCREEN: If route is not /admin, render ONLY the Gamer App full screen.
  // No admin tabs, no top preview switcher, no fake frame borders.
  if (!isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#090D16]">
        <MobileAppFrame />
        <EmailPreviewModal />
      </div>
    );
  }

  // SECRET /ADMIN ROUTE: PIN Protected (PIN: 1234)
  if (!isAdminUnlocked) {
    return (
      <AdminLoginScreen
        onSuccess={() => setIsAdminUnlocked(true)}
        onExit={handleExitAdmin}
      />
    );
  }

  // UNLOCKED ADMIN PANEL & ARCHITECT CONTROL CENTER
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Admin Master Header */}
      <header className="bg-[#121824] border-b border-white/10 sticky top-0 z-50 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Operational Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#E64A19] to-[#FF9100] flex items-center justify-center shadow-lg shadow-[#FF5722]/30 border border-white/20">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-gaming font-black text-xl tracking-wider text-white">
                  ZEST <span className="text-[#FF5722]">ADMIN CONSOLE</span>
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-red-400" /> RESTRICTED
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-[#00E676]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"></span>
                  {firebaseConnected ? 'FIREBASE SECURE' : 'OFFLINE'}
                </span>
                <span>•</span>
                <span className="text-[#00E5FF]">{firebaseProjectId}</span>
                <span>•</span>
                <span className="text-slate-400">PIN: 1234 Authenticated</span>
              </div>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#090D16] p-1 rounded-2xl border border-white/10 shadow-inner">
              <button
                onClick={() => setAdminTab('dashboard')}
                className={`px-4 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-1.5 transition-all relative ${
                  adminTab === 'dashboard'
                    ? 'bg-[#00E5FF] text-[#090D16] shadow-lg shadow-[#00E5FF]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>OPERATIONS &amp; PAYOUTS</span>
                {pendingPayoutCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-ping absolute top-1 right-1"></span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('deliverables')}
                className={`px-4 py-2 rounded-xl text-xs font-gaming font-bold tracking-wider flex items-center gap-1.5 transition-all ${
                  adminTab === 'deliverables'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>ARCHITECT DELIVERABLES</span>
              </button>
            </div>

            {/* Exit Admin / Return to Gamer App */}
            <button
              onClick={handleExitAdmin}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Return to Public Gamer App"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1">
        {adminTab === 'dashboard' ? <AdminDashboard /> : <DeliverablesHub />}
      </main>

      {/* Email Delivery Receipts Modal */}
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
