import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Crown, 
  Share2, 
  Copy, 
  Check, 
  Mic, 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ChevronRight, 
  Shield, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Calculator, 
  Award,
  Wallet,
  ArrowUpRight,
  ExternalLink,
  Users,
  DollarSign,
  BarChart2,
  Zap,
  Globe,
  Flame,
  Radio
} from 'lucide-react';
import { UserProfile, MacroEvent } from '../../types';
import { MACRO_EVENTS } from '../../data/macroEvents';

interface OverviewViewProps {
  user: UserProfile;
  onOpenTrish: () => void;
  onOpenMacroAnalysis: (event: MacroEvent) => void;
  onOpenUpgrade: (tier?: 'Starter' | 'Pro' | 'Elite' | 'Platinum' | 'Ultimate') => void;
  onNavigateToTab: (tabId: string) => void;
}

const MARKET_TICKERS = [
  { symbol: 'XAUUSD', price: '4,602.990', change: '+84.035 (+1.86%)', isUp: true, icon: '🪙' },
  { symbol: 'EURUSD', price: '1.16782', change: '+0.00 (+0.01%)', isUp: true, icon: '💶' },
  { symbol: 'BTCUSD', price: '78,008.79', change: '+954.35 (+1.24%)', isUp: true, icon: '₿' },
  { symbol: 'US30', price: '53,258.6', change: '+477.2 (+0.90%)', isUp: true, icon: '📈' },
  { symbol: 'GBPUSD', price: '1.34120', change: '+0.0034 (+0.25%)', isUp: true, icon: '💷' },
  { symbol: 'USDJPY', price: '154.62', change: '-0.38 (-0.24%)', isUp: false, icon: '💴' },
  { symbol: 'NAS100', price: '21,450.2', change: '+188.4 (+0.89%)', isUp: true, icon: '📊' },
];

export const OverviewView: React.FC<OverviewViewProps> = ({
  user,
  onOpenTrish,
  onOpenMacroAnalysis,
  onOpenUpgrade,
  onNavigateToTab,
}) => {
  const [macroFilter, setMacroFilter] = useState<'All' | 'High'>('All');
  const [referralTab, setReferralTab] = useState<'Overview' | 'Referrals' | 'Withdrawals'>('Overview');
  const [copiedRef, setCopiedRef] = useState(false);

  const filteredEvents = macroFilter === 'All' 
    ? MACRO_EVENTS 
    : MACRO_EVENTS.filter(e => e.impact === 'High');

  const referralLink = `https://pipnex-ai.com/ref/${user.referralCode || 'PNX782'}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const userFullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  const userGreetingName = userFullName || user.firstName || (user.email ? user.email.split('@')[0] : 'Trader');

  return (
    <div className="space-y-6 animate-in fade-in duration-200 w-full max-w-[1600px] mx-auto pb-12">
      
      {/* 1. Header Section: Personalized Welcome to PipNex */}
      <div className="pt-2 pb-1 space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-300" />
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            Hello {userGreetingName}, Welcome to PipNex
          </h2>
        </div>
        <p className="text-xs text-gray-400 pl-11">
          Your all-in-one AI trading intelligence platform.
        </p>
      </div>

      {/* Subtle Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2d251e] to-transparent my-1" />

      {/* 2. STATS OVERVIEW & CORE FEATURE LAUNCHERS (Matching Screenshot 4) */}
      <div className="space-y-4">
        {/* 2x2 / 4-Column Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
          {/* Card 1: Active Bots */}
          <div 
            id="stat-card-active-bots"
            onClick={() => onNavigateToTab('manage-bots')}
            className="bg-[#f0f7ff] dark:bg-[#0c1424] border border-[#e0edff] dark:border-[#1e2a4a] rounded-2xl p-4 md:p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs md:text-sm font-medium text-[#475569] dark:text-[#94a3b8]">Active Bots</div>
                <div className="text-xl md:text-2xl font-extrabold text-[#0f172a] dark:text-white mt-1">
                  0 <span className="text-[#94a3b8] dark:text-gray-500 font-normal text-sm md:text-base">/ 0</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#16213b] border border-blue-100/80 dark:border-blue-900/40 text-[#3b82f6] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[11px] md:text-xs text-[#94a3b8] dark:text-gray-400 font-medium mt-3">
              None running
            </div>
          </div>

          {/* Card 2: Active EAs */}
          <div 
            id="stat-card-active-eas"
            onClick={() => onNavigateToTab('settings')}
            className="bg-[#faf5ff] dark:bg-[#160f29] border border-[#f3e8ff] dark:border-[#2a1b4d] rounded-2xl p-4 md:p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs md:text-sm font-medium text-[#475569] dark:text-[#94a3b8]">Active EAs</div>
                <div className="text-xl md:text-2xl font-extrabold text-[#0f172a] dark:text-white mt-1">
                  0
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#261845] border border-purple-100/80 dark:border-purple-900/40 text-[#8b5cf6] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[11px] md:text-xs text-[#94a3b8] dark:text-gray-400 font-medium mt-3">
              0 brokers connected
            </div>
          </div>

          {/* Card 3: Total Trades */}
          <div 
            id="stat-card-total-trades"
            onClick={() => onNavigateToTab('ai-trading')}
            className="bg-[#fffbeb] dark:bg-[#241a0b] border border-[#fef3c7] dark:border-[#422e11] rounded-2xl p-4 md:p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs md:text-sm font-medium text-[#475569] dark:text-[#94a3b8]">Total Trades</div>
                <div className="text-xl md:text-2xl font-extrabold text-[#0f172a] dark:text-white mt-1">
                  0
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#38260f] border border-amber-100/80 dark:border-amber-900/40 text-[#f59e0b] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <BarChart2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[11px] md:text-xs text-[#94a3b8] dark:text-gray-400 font-medium mt-3">
              All time
            </div>
          </div>

          {/* Card 4: Total P&L */}
          <div 
            id="stat-card-total-pnl"
            onClick={() => onNavigateToTab('ai-trading')}
            className="bg-[#f0fdf4] dark:bg-[#0c2217] border border-[#dcfce7] dark:border-[#15422d] rounded-2xl p-4 md:p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs md:text-sm font-medium text-[#475569] dark:text-[#94a3b8]">Total P&amp;L</div>
                <div className="text-xl md:text-2xl font-extrabold text-[#16a34a] dark:text-[#22c55e] font-mono mt-1">
                  +$0.00
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#123826] border border-emerald-100/80 dark:border-emerald-900/40 text-[#10b981] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[11px] md:text-xs text-[#64748b] dark:text-gray-300 font-medium mt-3">
              Balance: $0.00
            </div>
          </div>
        </div>

        {/* 3 Vibrant Action Banners (Matching Screenshot 4) */}
        <div className="space-y-3.5">
          {/* Banner 1: AI Trading (Royal Blue / Indigo Gradient) */}
          <div 
            id="banner-ai-trading"
            className="rounded-3xl p-5 md:p-6 bg-gradient-to-r from-[#3b82f6] to-[#6052f7] text-white shadow-lg flex items-center justify-between transition-all hover:shadow-xl group"
          >
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">AI Trading</h3>
              <p className="text-xs md:text-sm text-white/90 font-normal">Let AI trade for you</p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigateToTab('ai-trading')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span>Start AI</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-xs backdrop-blur-xs group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 md:w-7 md:h-7 stroke-[2.2]" />
            </div>
          </div>

          {/* Banner 2: Connect Broker (Emerald / Mint Teal Gradient) */}
          <div 
            id="banner-connect-broker"
            className="rounded-3xl p-5 md:p-6 bg-gradient-to-r from-[#00b074] to-[#10b981] text-white shadow-lg flex items-center justify-between transition-all hover:shadow-xl group"
          >
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">Connect Broker</h3>
              <p className="text-xs md:text-sm text-white/90 font-normal">Link your trading account</p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigateToTab('settings')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span>Connect</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-xs backdrop-blur-xs group-hover:scale-105 transition-transform">
              <Wallet className="w-6 h-6 md:w-7 md:h-7 stroke-[2.2]" />
            </div>
          </div>

          {/* Banner 3: Market Pulse (Vibrant Purple / Magenta Gradient) */}
          <div 
            id="banner-market-pulse"
            className="rounded-3xl p-5 md:p-6 bg-gradient-to-r from-[#9333ea] to-[#ec4899] text-white shadow-lg flex items-center justify-between transition-all hover:shadow-xl group"
          >
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">Market Pulse</h3>
              <p className="text-xs md:text-sm text-white/90 font-normal">Live market insights</p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigateToTab('pulse-signals')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-xs backdrop-blur-xs group-hover:scale-105 transition-transform">
              <BarChart2 className="w-6 h-6 md:w-7 md:h-7 stroke-[2.2]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Market Pulse (Full Horizontal Live Ticker Strip) */}
      <div 
        id="market-pulse-section"
        className="w-full bg-[#0a0c14] border border-[#171a27] rounded-2xl p-5 shadow-xl space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>Market Pulse</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
            </h2>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Real-time market updates
        </p>

        {/* Horizontal Ticker Chips */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {MARKET_TICKERS.map((ticker, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#10121d] border border-[#1c2032] shrink-0 hover:border-purple-500/30 transition-all font-mono text-xs"
            >
              <span className="text-sm">{ticker.icon}</span>
              <span className="font-bold text-white">{ticker.symbol}</span>
              <span className="text-gray-200">{ticker.price}</span>
              <span className={`text-[11px] font-semibold ${ticker.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {ticker.change}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={() => onNavigateToTab('pulse-signals')}
            className="px-4 py-2 rounded-xl bg-[#121422] hover:bg-[#1a1e33] border border-[#22273c] text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            Open Full Market Page
          </button>
        </div>
      </div>

      {/* 4. Exclusive VIP Signal of the Day Banner (Full-width horizontal card) */}
      <div 
        id="signal-of-the-day-banner"
        className="w-full bg-[#0a0c14] border border-[#171a27] rounded-2xl p-8 shadow-xl text-center relative overflow-hidden flex flex-col items-center justify-center space-y-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
          <Shield className="w-6 h-6" />
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase font-mono tracking-wider px-3 py-1 rounded-md bg-[#161828] text-purple-300 border border-[#2b2f48]">
            Exclusive to Ultimate &amp; Platinum Plans
          </span>
          <h2 className="text-base md:text-lg font-bold text-white tracking-tight pt-2">
            Get access to daily high-precision trading signals generated by Straddle AI
          </h2>
          <p className="text-xs text-gray-400 max-w-xl mx-auto">
            Institutional algorithmic signals with verified win-rates, optimal trade entry levels &amp; auto-execution.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onOpenUpgrade('Platinum')}
            className="px-6 py-2.5 rounded-xl bg-[#141624] hover:bg-[#20253d] border border-[#2d324e] hover:border-purple-500/50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Crown className="w-3.5 h-3.5 text-purple-400" />
            <span>Upgrade to Unlock</span>
          </button>
        </div>
      </div>

      {/* 5. NewsIQ — Upcoming Macro Events (Full Horizontal Layout) */}
      <div 
        id="newsiq-macro-events-full"
        className="w-full bg-[#0a0c14] border border-[#171a27] rounded-2xl p-5 md:p-6 shadow-xl space-y-4"
      >
        {/* NewsIQ Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#161826] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm md:text-base font-bold text-white tracking-wide">
                NewsIQ — Upcoming Macro Events
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              NFP &amp; CPI releases affecting XAUUSD and USD pairs
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Filter Toggle */}
            <div className="flex items-center bg-[#10121d] p-1 rounded-xl border border-[#1e2233] text-xs">
              <button
                onClick={() => setMacroFilter('All')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  macroFilter === 'All'
                    ? 'bg-[#1a1d2e] text-white border border-[#2c314a] shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMacroFilter('High')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  macroFilter === 'High'
                    ? 'bg-[#1a1d2e] text-white border border-[#2c314a] shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                High Impact
              </button>
            </div>

            <button
              onClick={() => onOpenMacroAnalysis(MACRO_EVENTS[0])}
              className="px-4 py-1.5 rounded-xl bg-[#141624] hover:bg-[#1e2238] border border-[#2b304c] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Analyze All (1)</span>
            </button>
          </div>
        </div>

        {/* Horizontal Full-Width Macro Event Rows */}
        <div className="space-y-3">
          {filteredEvents.map((evt, idx) => {
            const isNextUp = idx === 0;
            const isHigh = evt.impact === 'High';
            const isMedium = evt.impact === 'Medium';

            return (
              <div
                key={evt.id}
                className={`w-full p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isNextUp 
                    ? 'bg-[#0f111d] border-purple-500/40 shadow-sm shadow-purple-950/20' 
                    : 'bg-[#0c0e18] border-[#181b2a] hover:border-[#282d44]'
                }`}
              >
                {/* Left Side: Badges + Title + Country */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {isNextUp && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        Next Up
                      </span>
                    )}
                    {isHigh && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#2b1216] text-[#ff4b58] border border-[#ff4b58]/35">
                        High
                      </span>
                    )}
                    {isMedium && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#2b220e] text-[#f5a623] border border-[#f5a623]/35">
                        Medium
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-gray-400 bg-[#141624] px-2 py-0.5 rounded border border-[#202438]">
                      {evt.category}
                    </span>
                    <span className="text-xs font-bold text-gray-200 flex items-center gap-1 font-mono">
                      <span>{evt.countryFlag}</span>
                      <span>{evt.country}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {evt.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 font-mono">
                    <span>{evt.dateStr}</span>
                    {evt.consensus && (
                      <span className="text-gray-400">
                        Consensus: <strong className="text-white font-mono">{evt.consensus}</strong>
                      </span>
                    )}
                    {evt.previous && (
                      <span className="text-gray-500">
                        Previous: <strong className="text-gray-300 font-mono">{evt.previous}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side: Countdown + Status + AI Analyze Button */}
                <div className="flex items-center md:flex-col md:items-end justify-between gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1a1c2c]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-white">
                      {evt.countdown}
                    </span>
                    {isNextUp && (
                      <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>Imminent</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenMacroAnalysis(evt)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#141624] hover:bg-[#1e2338] border border-[#2b304c] hover:border-purple-500/40 text-gray-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>AI Analyze</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. News Signal (NFP/CPI) Wide Locked Feature Section */}
      <div 
        id="news-signal-nfp-cpi-full-section"
        className="w-full bg-[#05060a] border border-[#141724] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
      >
        {/* Title and Subtitle at Top-Left */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-300" />
            <h3 className="text-sm md:text-base font-bold text-white tracking-wide">
              News Signal (NFP/CPI)
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            Pro plan (or higher) required to access news signals
          </p>
        </div>

        {/* Centered Lock, Copy, and Upgrade Button */}
        <div className="flex flex-col items-center justify-center text-center py-8 md:py-10 space-y-3.5">
          <Lock className="w-7 h-7 text-gray-400 stroke-[1.5]" />
          <p className="text-xs md:text-sm text-gray-300 max-w-xl font-normal">
            Upgrade to Pro (or higher) to receive high-confidence NFP &amp; CPI trading signals
          </p>
          <div className="pt-1">
            <button
              onClick={() => onOpenUpgrade('Pro')}
              className="px-7 py-2.5 rounded-xl bg-[#9d83e9] hover:bg-[#ad94f8] text-[#0d0f19] font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>

      {/* 7. Referral Program Full Width Horizontal Section (Matching Screenshot 2) */}
      <div 
        id="referral-program-section-full"
        className="w-full bg-[#07080f] border border-[#171a27] rounded-2xl p-6 shadow-xl space-y-4"
      >
        {/* Header with Title and Available Balance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-300 font-bold">$</span>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white tracking-wide">
                Referral Program
              </h3>
              <p className="text-[11px] text-gray-500">
                Earn real money when your referrals subscribe
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-gray-500 font-mono uppercase">Available Balance</div>
            <div className="text-sm font-mono font-bold text-emerald-400">$0.00</div>
          </div>
        </div>

        {/* Navigation Tabs (Overview, Referrals, Withdrawals) */}
        <div className="flex items-center gap-2 border-b border-[#171a27] pb-2 text-xs">
          {(['Overview', 'Referrals', 'Withdrawals'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setReferralTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                referralTab === tab
                  ? 'bg-[#151726] text-white border border-[#2b304c]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 4 Purple Metric Cards (Total Referred, Subscribed, Pending, Earnings) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#50446b] border border-[#645685] text-center shadow-inner">
            <div className="text-lg font-bold font-mono text-white">0</div>
            <div className="text-[10px] text-purple-200 uppercase tracking-wider font-semibold mt-0.5">
              Total Referred
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#50446b] border border-[#645685] text-center shadow-inner">
            <div className="flex items-center justify-center gap-1 text-lg font-bold font-mono text-white">
              <Users className="w-4 h-4 text-purple-200" />
              <span>0</span>
            </div>
            <div className="text-[10px] text-purple-200 uppercase tracking-wider font-semibold mt-0.5">
              Subscribed
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#50446b] border border-[#645685] text-center shadow-inner">
            <div className="flex items-center justify-center gap-1 text-lg font-bold font-mono text-white">
              <Clock className="w-4 h-4 text-purple-200" />
              <span>0</span>
            </div>
            <div className="text-[10px] text-purple-200 uppercase tracking-wider font-semibold mt-0.5">
              Pending
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#50446b] border border-[#645685] text-center shadow-inner">
            <div className="text-lg font-bold font-mono text-white">$0.00</div>
            <div className="text-[10px] text-purple-200 uppercase tracking-wider font-semibold mt-0.5">
              Earnings
            </div>
          </div>
        </div>

        {/* Account ID Display */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] text-gray-400 font-medium block">Your Account ID</label>
          <div className="px-3.5 py-2 bg-[#0c0d16] border border-[#1a1d2d] rounded-xl text-gray-300 font-mono text-xs w-full max-w-sm">
            DAVB669
          </div>
        </div>

        {/* Referral Link with Copy Button */}
        <div className="space-y-1">
          <label className="text-[11px] text-gray-400 font-medium block">Your Referral Link</label>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 px-3.5 py-2.5 bg-[#0c0d16] border border-[#1a1d2d] rounded-xl text-purple-300 font-mono text-xs focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-[#141624] hover:bg-[#1e2338] border border-[#262b40] text-gray-200 hover:text-white font-bold transition-all flex items-center gap-1.5 text-xs shadow-sm active:scale-95 cursor-pointer"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-300" />}
              <span>{copiedRef ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Withdrawal Bar Banner */}
        <div className="w-full py-2 px-4 rounded-xl bg-[#594d75] text-center text-xs font-semibold text-purple-100 flex items-center justify-center gap-2">
          <span>↓</span>
          <span>Withdraw (Min $75 - Need $75.00 more)</span>
        </div>

        {/* Earnings tier cards */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] text-gray-400 font-medium">Earn real money when your referrals subscribe:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#0c0d16] border border-[#1a1d2d] text-center">
              <div className="text-sm font-bold font-mono text-purple-300">$5</div>
              <div className="text-[10px] text-gray-400">Pro</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0c0d16] border border-[#1a1d2d] text-center">
              <div className="text-sm font-bold font-mono text-purple-300">$10</div>
              <div className="text-[10px] text-gray-400">Ultimate</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0c0d16] border border-[#3b3122] text-center">
              <div className="text-sm font-bold font-mono text-amber-400">$36</div>
              <div className="text-[10px] text-amber-500">Platinum</div>
            </div>
          </div>
          <div className="text-[10px] text-gray-500 flex items-center gap-1">
            <span>💡</span>
            <span>You can also use your balance to pay for subscriptions!</span>
          </div>
        </div>
      </div>

      {/* 8. MT5 Account Full Width Strip */}
      <div 
        id="mt5-account-full-strip"
        className="w-full bg-[#07080f] border border-[#171a27] rounded-2xl p-6 shadow-xl space-y-4"
      >
        <div className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            MT5 Account
          </h3>
        </div>

        <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
          <Activity className="w-6 h-6 text-gray-500" />
          <div className="text-xs text-gray-300 font-medium">No MT5 account connected</div>
          <div className="text-[11px] text-gray-500">
            Connect your account in <span className="text-purple-400 cursor-pointer" onClick={() => onNavigateToTab('settings')}>Settings &rarr; MT5 Bridge</span>
          </div>
        </div>
      </div>

      {/* 9. Trish Assistant & Activity Summary (Horizontal 2-Column Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trish Assistant Card */}
        <div 
          id="trish-assistant-overview-card"
          className="w-full bg-[#07080f] border border-[#171a27] rounded-2xl p-6 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Trish Assistant Assistant
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>
          <p className="text-xs text-gray-500">Integrated voice-enabled trading assistant</p>

          <div className="space-y-1 pt-1 text-xs">
            <div className="text-gray-400 text-[11px] font-semibold mb-1">Capabilities:</div>
            {['Market analysis', 'Chart breakdowns', 'Strategy building', 'Trading education', 'Risk management help'].map((cap, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-300 text-xs">
                <span className="text-purple-400">•</span>
                <span>{cap}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenTrish}
            className="w-full py-2.5 rounded-xl bg-[#8c74dc] hover:bg-[#9d85eb] text-[#0d0f19] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Talk to Trish</span>
          </button>
        </div>

        {/* Activity Summary Card */}
        <div 
          id="activity-summary-overview-card"
          className="w-full bg-[#07080f] border border-[#171a27] rounded-2xl p-6 shadow-xl space-y-4"
        >
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Activity Summary
            </h3>
          </div>
          <p className="text-xs text-gray-500">Your usage statistics</p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#141624] pb-2">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span>Last Login:</span>
              </span>
              <span className="font-semibold text-white">Today</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#141624] pb-2">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-gray-500" />
                <span>Membership Plan:</span>
              </span>
              <span className="font-semibold text-purple-400">Free Trial</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#141624] pb-2">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-gray-500" />
                <span>Features Used This Week:</span>
              </span>
              <span className="font-semibold text-white font-mono">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span>AI Time Used:</span>
              </span>
              <span className="font-semibold text-white font-mono">0 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* 10. Daily Usage Stats Full Width Strip */}
      <div 
        id="daily-usage-stats-full"
        className="w-full bg-[#07080f] border border-[#171a27] rounded-2xl p-6 shadow-xl space-y-4"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Daily Usage Stats
          </h3>
        </div>
        <p className="text-xs text-gray-500">Track your feature usage and remaining limits</p>

        <div className="space-y-3 pt-2 text-xs">
          <div className="flex items-center justify-between border-b border-[#141624] pb-2">
            <span className="text-gray-400">AI Chart Analyses</span>
            <span className="font-mono font-bold text-white">0 / 2</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#141624] pb-2">
            <span className="text-gray-400">Voice Sessions</span>
            <span className="font-mono font-bold text-white">0 / 0</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#141624] pb-2">
            <span className="text-gray-400">Custom AI Setups</span>
            <span className="font-mono font-bold text-white">0 / 0</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-gray-400">Current Plan: <strong className="text-purple-400">Free Trial</strong></span>
            <span className="text-[11px] text-gray-500 font-mono">Trial ends Aug 30, 2026</span>
          </div>
        </div>
      </div>

      {/* 11. Your Tools & Shortcuts */}
      <div 
        id="your-tools-shortcuts-full"
        className="w-full bg-[#07080f] border border-[#171a27] rounded-2xl p-6 shadow-xl space-y-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🧰</span>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Your Tools &amp; Shortcuts
          </h3>
        </div>
        <p className="text-xs text-gray-500">Quick access to popular PipNex features</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <button
            onClick={() => onNavigateToTab('prop-pass')}
            className="p-4 rounded-xl bg-[#0c0d16] border border-[#1c2032] hover:border-purple-500/40 text-left transition-all group cursor-pointer"
          >
            <Shield className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-white">PropPass</div>
            <div className="text-[10px] text-gray-500">Prop firm challenge guard</div>
          </button>

          <button
            onClick={() => onNavigateToTab('calc')}
            className="p-4 rounded-xl bg-[#0c0d16] border border-[#1c2032] hover:border-purple-500/40 text-left transition-all group cursor-pointer"
          >
            <Calculator className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-white">Position Size Calculator</div>
            <div className="text-[10px] text-gray-500">Risk &amp; lot size calculator</div>
          </button>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onNavigateToTab('quick-access')}
            className="px-4 py-2 rounded-xl bg-[#141624] hover:bg-[#1f233a] border border-[#24283c] text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            Explore Tools
          </button>
        </div>
      </div>

      {/* 12. Membership Plans Showcase */}
      <div 
        id="membership-plans-overview-card"
        className="w-full bg-[#07080f] border border-[#171a27] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#141624] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                PipNex Membership Plans
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Choose the tier that matches your trading goals and execution volume.
            </p>
          </div>
          <button
            onClick={() => onOpenUpgrade('Pro')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            Upgrade Membership
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {/* Starter Plan */}
          <div className="p-5 rounded-2xl bg-[#0b0c15] border border-[#1b1e2e] flex flex-col justify-between space-y-4">
            <div>
              <div className="text-sm font-bold text-white">Starter</div>
              <div className="text-[11px] text-gray-400">Perfect for getting started</div>
              <div className="text-2xl font-extrabold font-mono text-white mt-2">
                $45 <span className="text-xs text-gray-400 font-sans font-normal">/ ½ month</span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#161826] space-y-1.5 text-xs text-gray-300">
                <div className="flex items-center gap-1.5">✓ 10 Chart Uploads per day</div>
                <div className="flex items-center gap-1.5">✓ Advanced Chart Analysis</div>
                <div className="flex items-center gap-1.5">✓ Multi-Timeframe Analysis</div>
                <div className="flex items-center gap-1.5">✓ PipNex Pulse Signals (2/day)</div>
                <div className="flex items-center gap-1.5">✓ AI News Trading Analysis</div>
                <div className="flex items-center gap-1.5">✓ Position Size Calculator</div>
                <div className="flex items-center gap-1.5">✓ 3 Custom AI Setups per day</div>
                <div className="flex items-center gap-1.5">✓ Smart Chart Analyzer</div>
                <div className="flex items-center gap-1.5">✓ Trading Journal</div>
                <div className="flex items-center gap-1.5">✓ 24/7 Priority Support</div>
              </div>
            </div>

            <button
              onClick={() => onOpenUpgrade('Starter')}
              className="w-full py-2.5 rounded-xl bg-[#141624] hover:bg-[#1c2034] border border-[#262b42] text-xs font-semibold text-gray-200 transition-all cursor-pointer"
            >
              Get Starter ($45)
            </button>
          </div>

          {/* Pro Plan (⭐ MOST POPULAR) */}
          <div className="p-5 rounded-2xl bg-[#111324] border border-purple-500/60 flex flex-col justify-between space-y-4 relative shadow-xl shadow-purple-950/40">
            <span className="absolute -top-3 right-5 text-[10px] font-mono uppercase px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold border border-purple-400/40 shadow-sm">
              ⭐ MOST POPULAR
            </span>

            <div>
              <div className="text-sm font-bold text-white">Pro</div>
              <div className="text-[11px] text-purple-300">For serious traders</div>
              <div className="text-2xl font-extrabold font-mono text-white mt-2">
                $95 <span className="text-xs text-gray-400 font-sans font-normal">/ month</span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1f2338] space-y-1.5 text-xs text-gray-300">
                <div className="flex items-center gap-1.5">✓ 24 Chart Uploads per day</div>
                <div className="flex items-center gap-1.5">✓ Multi-Timeframe Analysis</div>
                <div className="flex items-center gap-1.5 text-purple-200 font-medium">✓ Signal of the Day (90%+ accurate)</div>
                <div className="flex items-center gap-1.5">✓ PipNex Pulse Signals (2/day)</div>
                <div className="flex items-center gap-1.5">✓ AI News Trading Analysis (NFP/CPI)</div>
                <div className="flex items-center gap-1.5">✓ AI Auto trading</div>
                <div className="flex items-center gap-1.5">✓ PipNex PropPass</div>
                <div className="flex items-center gap-1.5">✓ Smart Chart Analyzer</div>
                <div className="flex items-center gap-1.5">✓ Unlimited Custom Setups</div>
                <div className="flex items-center gap-1.5">✓ 24/7 Priority Support</div>
              </div>
            </div>

            <button
              onClick={() => onOpenUpgrade('Pro')}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
            >
              Get Pro ($95)
            </button>
          </div>

          {/* Elite Plan */}
          <div className="p-5 rounded-2xl bg-[#0b0c15] border border-amber-500/40 flex flex-col justify-between space-y-4 relative">
            <span className="absolute -top-3 right-5 text-[10px] font-mono uppercase px-3 py-0.5 rounded-full bg-[#2a1d08] text-amber-400 font-bold border border-amber-500/30">
              MAX PERFORMANCE
            </span>

            <div>
              <div className="text-sm font-bold text-white">Elite</div>
              <div className="text-[11px] text-amber-300">Maximum performance</div>
              <div className="text-2xl font-extrabold font-mono text-white mt-2">
                $195 <span className="text-xs text-gray-400 font-sans font-normal">/ 3 months</span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1b1f30] space-y-1.5 text-xs text-gray-300">
                <div className="flex items-center gap-1.5 text-amber-200">✓ Unlimited PipNex Pulse Signals</div>
                <div className="flex items-center gap-1.5">✓ Direct AI Chart Analysis (no uploads)</div>
                <div className="flex items-center gap-1.5">✓ Prompt Trading UI</div>
                <div className="flex items-center gap-1.5">✓ MT5 Account Connection</div>
                <div className="flex items-center gap-1.5 font-medium text-amber-200">✓ 🤖 Run Bots Without PC (Cloud Bots)</div>
                <div className="flex items-center gap-1.5 font-medium text-amber-200">✓ 🚀 Auto Trading (2000 AI credits)</div>
                <div className="flex items-center gap-1.5 font-medium text-amber-200">✓ ☁️ FREE VPS Included ($50/mo value)</div>
                <div className="flex items-center gap-1.5">✓ Voice-based AI Interaction</div>
                <div className="flex items-center gap-1.5">✓ AI reads account for journaling</div>
                <div className="flex items-center gap-1.5">✓ AI generates &amp; executes strategies</div>
                <div className="flex items-center gap-1.5">✓ Unlimited MT5 accounts (10)</div>
                <div className="flex items-center gap-1.5">✓ 24/7 Bot Monitoring &amp; Alerts</div>
                <div className="flex items-center gap-1.5">✓ Priority AI processing</div>
                <div className="flex items-center gap-1.5">✓ White-glove support</div>
              </div>
            </div>

            <button
              onClick={() => onOpenUpgrade('Elite')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
            >
              Get Elite ($195)
            </button>
          </div>
        </div>

        {/* Support Contact Footer Banner */}
        <div className="p-4 rounded-2xl bg-[#0c0e1a] border border-[#1d2238] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-gray-300">
            <span className="text-emerald-400 font-bold">24/7 Customer Support:</span>
            <span>Reach out anytime to our dedicated desk</span>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="mailto:Pipnexaicustomer@gmail.com" 
              className="font-mono text-purple-300 hover:text-purple-200 underline"
            >
              Pipnexaicustomer@gmail.com
            </a>
            <span className="text-gray-600">•</span>
            <a 
              href="tel:+254726222093" 
              className="font-mono text-emerald-400 hover:text-emerald-300 underline"
            >
              +254726222093
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
