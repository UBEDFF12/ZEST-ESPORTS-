import React, { useState } from 'react';
import { POSTGRESQL_SCHEMA_SQL, FIRESTORE_SCHEMA_JSON, FIRESTORE_RULES } from '../../deliverables/databaseSchema';
import { FLUTTER_WALLET_SCREEN_DART, FLUTTER_AUTH_SCREEN_DART } from '../../deliverables/flutterCode';
import { NODEJS_BACKEND_SERVER_TS } from '../../deliverables/backendServerCode';
import { PRIZE_DISTRIBUTION_LOGIC_CODE } from '../../deliverables/prizeDistributionLogic';
import { Database, Smartphone, Server, Trophy, Copy, Check, FileDown, Code2, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';

export const DeliverablesHub: React.FC = () => {
  const [activeDeliverable, setActiveDeliverable] = useState<1 | 2 | 3 | 4>(1);
  const [databaseTab, setDatabaseTab] = useState<'postgres' | 'firestore' | 'rules'>('postgres');
  const [flutterTab, setFlutterTab] = useState<'wallet' | 'auth'>('wallet');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#171F2F] via-[#121824] to-[#171F2F] border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 uppercase">
              Principal Architect Dossier
            </span>
            <span className="text-xs text-slate-400 font-mono">v3.4.0 Production Release</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-gaming mt-1 tracking-wide">
            DELIVERABLES &amp; CODE ARCHITECTURE HUB
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Complete production-grade source code, database DDLs, Flutter Dart modules, Express backend servers,
            and mathematical prize distribution engines requested for ZEST ESPORTS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4 text-[#00E676]" /> 100% SPEC COMPLIANT
          </span>
        </div>
      </div>

      {/* Deliverable Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveDeliverable(1)}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            activeDeliverable === 1
              ? 'bg-[#171F2F] border-[#00E5FF] shadow-lg shadow-[#00E5FF]/10'
              : 'bg-[#121824] border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeDeliverable === 1 ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-white/5 text-slate-400'}`}>
              <Database className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">DELIVERABLE 1</span>
          </div>
          <h4 className="font-gaming font-bold text-white text-sm">Database Schema</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">PostgreSQL DDL &amp; Firestore JSON Models</p>
        </button>

        <button
          onClick={() => setActiveDeliverable(2)}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            activeDeliverable === 2
              ? 'bg-[#171F2F] border-[#FF5722] shadow-lg shadow-[#FF5722]/10'
              : 'bg-[#121824] border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeDeliverable === 2 ? 'bg-[#FF5722]/20 text-[#FF5722]' : 'bg-white/5 text-slate-400'}`}>
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">DELIVERABLE 2</span>
          </div>
          <h4 className="font-gaming font-bold text-white text-sm">Flutter Wallet Screen</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Dart 3 Source with UPI &amp; Redeem Code Tabs</p>
        </button>

        <button
          onClick={() => setActiveDeliverable(3)}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            activeDeliverable === 3
              ? 'bg-[#171F2F] border-[#00E676] shadow-lg shadow-[#00E676]/10'
              : 'bg-[#121824] border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeDeliverable === 3 ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-white/5 text-slate-400'}`}>
              <Server className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">DELIVERABLE 3</span>
          </div>
          <h4 className="font-gaming font-bold text-white text-sm">Node.js Server &amp; Nodemailer</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Atomic Lock API &amp; Automated Emailer</p>
        </button>

        <button
          onClick={() => setActiveDeliverable(4)}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            activeDeliverable === 4
              ? 'bg-[#171F2F] border-amber-400 shadow-lg shadow-amber-400/10'
              : 'bg-[#121824] border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeDeliverable === 4 ? 'bg-amber-400/20 text-amber-400' : 'bg-white/5 text-slate-400'}`}>
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">DELIVERABLE 4</span>
          </div>
          <h4 className="font-gaming font-bold text-white text-sm">Prize Distribution Engine</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Calculation Formula &amp; Atomic Credit Logic</p>
        </button>
      </div>

      {/* DELIVERABLE 1: DATABASE SCHEMA */}
      {activeDeliverable === 1 && (
        <div className="rounded-2xl bg-[#121824] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4 bg-[#171F2F] border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Database Architecture &amp; Schemas
              </span>
              <div className="flex rounded-lg bg-[#090D16] p-0.5 border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setDatabaseTab('postgres')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    databaseTab === 'postgres' ? 'bg-[#00E5FF] text-[#090D16] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PostgreSQL DDL
                </button>
                <button
                  onClick={() => setDatabaseTab('firestore')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    databaseTab === 'firestore' ? 'bg-[#FF5722] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Firestore JSON
                </button>
                <button
                  onClick={() => setDatabaseTab('rules')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    databaseTab === 'rules' ? 'bg-[#00E676] text-[#090D16] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Firestore Security Rules
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const content = databaseTab === 'postgres' ? POSTGRESQL_SCHEMA_SQL : databaseTab === 'firestore' ? FIRESTORE_SCHEMA_JSON : FIRESTORE_RULES;
                  copyToClipboard(content, 'db_schema');
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                {copiedKey === 'db_schema' ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'db_schema' ? 'COPIED!' : 'COPY CODE'}
              </button>
              <button
                onClick={() => {
                  const content = databaseTab === 'postgres' ? POSTGRESQL_SCHEMA_SQL : databaseTab === 'firestore' ? FIRESTORE_SCHEMA_JSON : FIRESTORE_RULES;
                  const filename = databaseTab === 'postgres' ? 'schema.sql' : databaseTab === 'firestore' ? 'firestore.json' : 'firestore.rules';
                  downloadFile(content, filename, 'text/plain');
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                title="Download file"
              >
                <FileDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#090D16] overflow-x-auto max-h-[550px] font-mono text-xs text-slate-300 leading-relaxed">
            <pre>
              {databaseTab === 'postgres' && POSTGRESQL_SCHEMA_SQL}
              {databaseTab === 'firestore' && FIRESTORE_SCHEMA_JSON}
              {databaseTab === 'rules' && FIRESTORE_RULES}
            </pre>
          </div>
        </div>
      )}

      {/* DELIVERABLE 2: FLUTTER CODE */}
      {activeDeliverable === 2 && (
        <div className="rounded-2xl bg-[#121824] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4 bg-[#171F2F] border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#FF5722]" />
              <div className="flex rounded-lg bg-[#090D16] p-0.5 border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setFlutterTab('wallet')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    flutterTab === 'wallet' ? 'bg-[#FF5722] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  wallet_withdrawal_screen.dart
                </button>
                <button
                  onClick={() => setFlutterTab('auth')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    flutterTab === 'auth' ? 'bg-[#00E5FF] text-[#090D16] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  auth_login_screen.dart
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const content = flutterTab === 'wallet' ? FLUTTER_WALLET_SCREEN_DART : FLUTTER_AUTH_SCREEN_DART;
                  copyToClipboard(content, 'flutter_code');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#FF5722]/20"
              >
                {copiedKey === 'flutter_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'flutter_code' ? 'COPIED TO CLIPBOARD!' : 'COPY FLUTTER DART'}
              </button>
              <button
                onClick={() => {
                  const content = flutterTab === 'wallet' ? FLUTTER_WALLET_SCREEN_DART : FLUTTER_AUTH_SCREEN_DART;
                  const filename = flutterTab === 'wallet' ? 'wallet_withdrawal_screen.dart' : 'auth_login_screen.dart';
                  downloadFile(content, filename, 'text/x-dart');
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                title="Download Dart File"
              >
                <FileDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#090D16] overflow-x-auto max-h-[550px] font-mono text-xs text-slate-300 leading-relaxed">
            <pre>{flutterTab === 'wallet' ? FLUTTER_WALLET_SCREEN_DART : FLUTTER_AUTH_SCREEN_DART}</pre>
          </div>
        </div>
      )}

      {/* DELIVERABLE 3: NODE.JS BACKEND CODE */}
      {activeDeliverable === 3 && (
        <div className="rounded-2xl bg-[#121824] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4 bg-[#171F2F] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#00E676]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                src/server/withdrawalService.ts (Node.js 20+ / Express / TypeScript)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(NODEJS_BACKEND_SERVER_TS, 'backend_code')}
                className="px-3 py-1.5 rounded-lg bg-[#00E676] hover:bg-[#00E676]/90 text-[#090D16] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#00E676]/20"
              >
                {copiedKey === 'backend_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'backend_code' ? 'COPIED TO CLIPBOARD!' : 'COPY BACKEND TS'}
              </button>
              <button
                onClick={() => downloadFile(NODEJS_BACKEND_SERVER_TS, 'withdrawalService.ts', 'application/typescript')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                title="Download TypeScript File"
              >
                <FileDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#090D16] overflow-x-auto max-h-[550px] font-mono text-xs text-slate-300 leading-relaxed">
            <pre>{NODEJS_BACKEND_SERVER_TS}</pre>
          </div>
        </div>
      )}

      {/* DELIVERABLE 4: PRIZE ENGINE */}
      {activeDeliverable === 4 && (
        <div className="rounded-2xl bg-[#121824] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4 bg-[#171F2F] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                src/services/prizeDistributionEngine.ts (Calculations &amp; Concurrency Logic)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(PRIZE_DISTRIBUTION_LOGIC_CODE, 'prize_code')}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#090D16] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20"
              >
                {copiedKey === 'prize_code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'prize_code' ? 'COPIED TO CLIPBOARD!' : 'COPY PRIZE LOGIC'}
              </button>
              <button
                onClick={() => downloadFile(PRIZE_DISTRIBUTION_LOGIC_CODE, 'prizeDistributionEngine.ts', 'application/typescript')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                title="Download Engine File"
              >
                <FileDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#090D16] overflow-x-auto max-h-[550px] font-mono text-xs text-slate-300 leading-relaxed">
            <pre>{PRIZE_DISTRIBUTION_LOGIC_CODE}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
