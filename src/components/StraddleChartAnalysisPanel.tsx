import React, { useState } from 'react';
import { 
  BarChart2, 
  RefreshCw, 
  Send, 
  MessageSquare, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  HelpCircle, 
  Target, 
  Droplets, 
  Compass, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  Copy,
  Check,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { RealCandle, MarketQuote, TechnicalIndicators } from './views/AITradingView';

export interface StructuredAnalysis {
  marketOverview?: {
    symbol: string;
    timeframe: string;
    currentPrice: string;
    overallCondition: string;
  };
  trend?: {
    direction: 'Bullish' | 'Bearish' | 'Sideways' | 'Unclear';
    explanation: string;
  };
  priceStructure?: {
    swingPoints: string;
    breakOfStructure: string;
    consolidation: string;
  };
  keyLevels?: {
    support: string[];
    resistance: string[];
    breakoutArea: string;
    invalidationArea: string;
  };
  momentumVolatility?: {
    momentum: 'Strong' | 'Weak' | 'Increasing' | 'Decreasing' | string;
    volatility: 'High' | 'Medium' | 'Low' | string;
    explanation: string;
  };
  possibleScenarios?: {
    bullish?: {
      condition: string;
      targetArea?: string;
    };
    bearish?: {
      condition: string;
      targetArea?: string;
    };
    range?: {
      condition: string;
    };
  };
  whatToWatch?: string[];
  
  // Legacy / fallback properties
  marketStructure?: 'Bullish' | 'Bearish' | 'Sideways';
  momentum?: 'Strong' | 'Moderate' | 'Weak';
  support?: string;
  resistance?: string;
  volatility?: 'Low' | 'Medium' | 'High';
  marketStatus?: 'OPEN' | 'CLOSED';
  signal?: string;
  signalConfidence?: number;
  aiOutlook?: string;
  riskAnalysis?: {
    setupType?: string;
    entryArea: string;
    stopLoss: string;
    takeProfit1: string;
    takeProfit2: string;
    riskRewardRatio: string;
    recommendedRisk: string;
    tradeExplanation?: string;
  };
}

export interface ChatMessage {
  sender: 'straddle' | 'user';
  text: string;
  time: string;
}

interface StraddleChartAnalysisPanelProps {
  symbol: string;
  timeframe: string;
  cleanSymbol: string;
  quote: MarketQuote | null;
  candles: RealCandle[];
  indicators: TechnicalIndicators | null;
  analysis: StructuredAnalysis | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  onAnalyze: () => void;
  chatMessages: ChatMessage[];
  inputText: string;
  setInputText: (val: string) => void;
  isChatTyping: boolean;
  onSendMessage: (e: React.FormEvent) => void;
  onQuickAction: (actionText: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export const StraddleChartAnalysisPanel: React.FC<StraddleChartAnalysisPanelProps> = ({
  symbol,
  timeframe,
  cleanSymbol,
  quote,
  candles,
  indicators,
  analysis,
  isAnalyzing,
  analysisError,
  onAnalyze,
  chatMessages,
  inputText,
  setInputText,
  isChatTyping,
  onSendMessage,
  onQuickAction,
  chatEndRef
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'chat'>('analysis');
  const [copiedSetup, setCopiedSetup] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    tradePlan: true,
    overview: true,
    trend: true,
    structure: true,
    levels: true,
    momentum: true,
    scenarios: true,
    watch: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const trendDirection = analysis?.trend?.direction || analysis?.marketStructure || indicators?.marketStructure || 'Sideways';
  const isBullish = trendDirection.toLowerCase().includes('bull');
  const isBearish = trendDirection.toLowerCase().includes('bear');

  const priceDisplay = quote ? quote.price.toFixed(quote.decimals) : '0.00';

  const tradeSignal = analysis?.signal || (isBullish ? 'BUY / LONG SETUP' : isBearish ? 'SELL / SHORT SETUP' : 'WAIT — RANGE BOUND');
  const isBuySignal = tradeSignal.toUpperCase().includes('BUY') || tradeSignal.toUpperCase().includes('LONG');
  const isSellSignal = tradeSignal.toUpperCase().includes('SELL') || tradeSignal.toUpperCase().includes('SHORT');

  const handleCopySetup = () => {
    if (!analysis?.riskAnalysis) return;
    const { entryArea, stopLoss, takeProfit1, takeProfit2, riskRewardRatio, recommendedRisk } = analysis.riskAnalysis;
    const text = `🎯 STRADDLE AI TRADE SETUP
Symbol: ${cleanSymbol} (${timeframe})
Signal: ${tradeSignal}
Entry: ${entryArea}
Stop Loss (S.L): ${stopLoss}
Take Profit 1 (T.P 1): ${takeProfit1}
Take Profit 2 (T.P 2): ${takeProfit2}
Risk/Reward: ${riskRewardRatio}
Risk Size: ${recommendedRisk}
Generated on live market price: ${priceDisplay}`;

    navigator.clipboard.writeText(text);
    setCopiedSetup(true);
    setTimeout(() => setCopiedSetup(false), 2000);
  };

  return (
    <div 
      id="straddle-ai-panel" 
      className="w-full lg:w-[410px] xl:w-[450px] bg-[#090b17] border-t lg:border-t-0 lg:border-l border-[#191d35] flex flex-col shrink-0 overflow-hidden"
    >
      {/* Top Header */}
      <div className="p-3.5 border-b border-[#16192f] bg-[#0c0e1e] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#15182e] border border-[#2b335a] flex items-center justify-center text-purple-400 shadow-inner">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Straddle AI Assistant
              </h2>
              <span className="px-1.5 py-0.2 rounded-md bg-[#19142e] border border-purple-500/30 text-purple-300 text-[9px] font-mono font-bold">
                LIVE
              </span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              Analyzing <strong className="text-gray-200">{symbol}</strong> ({timeframe})
            </div>
          </div>
        </div>

        {/* View Switcher: Analysis vs Live Chat */}
        <div className="flex items-center bg-[#121528] p-0.5 rounded-lg border border-[#202644]">
          <button
            id="tab-analysis-btn"
            onClick={() => setActiveTab('analysis')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'analysis'
                ? 'bg-[#4f46e5] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Analysis
          </button>
          <button
            id="tab-chat-btn"
            onClick={() => setActiveTab('chat')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'chat'
                ? 'bg-[#4f46e5] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>Chat</span>
            {chatMessages.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 custom-scrollbar">
        
        {/* Prominent Action Button: [ 📊 Analyze Current Chart ] */}
        <div className="space-y-1.5">
          <button
            id="analyze-current-chart-btn"
            aria-label="Analyze current chart"
            onClick={onAnalyze}
            disabled={isAnalyzing || candles.length === 0}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] disabled:opacity-50 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/80 cursor-pointer active:scale-[0.99] border border-indigo-400/30"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing Current Chart...</span>
              </>
            ) : (
              <>
                <BarChart2 className="w-4 h-4 stroke-[2.4]" />
                <span>Analyze Current Chart</span>
              </>
            )}
          </button>

          <div className="text-[10px] text-center text-gray-400 font-mono">
            {candles.length > 0 ? (
              <span>Reading {candles.length} live {timeframe} candles · Spot: {priceDisplay}</span>
            ) : (
              <span className="text-indigo-400 flex items-center justify-center gap-1.5">
                <RefreshCw className="w-2.5 h-2.5 animate-spin text-indigo-400" />
                <span>Live market data stream connected</span>
              </span>
            )}
          </div>
        </div>

        {/* 3 Status Badges in a Row: SYMBOL / INTERVAL / STATUS */}
        <div className="grid grid-cols-3 gap-2 shrink-0">
          <div className="bg-[#0e1124] border border-[#1c223f] rounded-xl py-2 px-2 text-center shadow-xs">
            <div className="text-[9px] uppercase tracking-wider text-gray-500 font-mono font-semibold">
              SYMBOL
            </div>
            <div className="text-xs font-bold font-mono text-white mt-0.5 truncate">
              {cleanSymbol}
            </div>
          </div>

          <div className="bg-[#0e1124] border border-[#1c223f] rounded-xl py-2 px-2 text-center shadow-xs">
            <div className="text-[9px] uppercase tracking-wider text-gray-500 font-mono font-semibold">
              INTERVAL
            </div>
            <div className="text-xs font-bold font-mono text-white mt-0.5">
              {timeframe}
            </div>
          </div>

          <div className="bg-[#0e1124] border border-[#1c223f] rounded-xl py-2 px-2 text-center shadow-xs">
            <div className="text-[9px] uppercase tracking-wider text-gray-500 font-mono font-semibold">
              STATUS
            </div>
            <div className="text-xs font-bold font-mono text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Active</span>
            </div>
          </div>
        </div>

        {/* ERROR STATE */}
        {analysisError && (
          <div className="bg-[#240e13] border border-rose-500/40 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Unable to analyze this chart</span>
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              {analysisError}
            </p>
            <button
              onClick={onAnalyze}
              className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800/80 border border-rose-500/50 text-white text-[11px] font-bold transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {isAnalyzing && (
          <div className="bg-[#0b0e20] border border-[#1f2648] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Evaluating {symbol} Chart Structure</h4>
              <p className="text-[11px] text-gray-400 max-w-[280px]">
                Calculating swing pivots, EMAs, order flow imbalance, and probabilistic continuation pathways...
              </p>
            </div>
          </div>
        )}

        {/* VIEW 1: STRUCTURED ANALYSIS */}
        {activeTab === 'analysis' && !isAnalyzing && (
          <>
            {analysis ? (
              <div className="space-y-3.5">
                
                {/* 🌟 HIGHLIGHTED TRADE EXECUTION PLAN & STRATEGY CARD (ENTRY, S.L, T.P 1, T.P 2, R:R & EXPLANATION) */}
                {analysis.riskAnalysis && (
                  <section 
                    aria-labelledby="trade-execution-heading" 
                    className="rounded-2xl bg-gradient-to-b from-[#0f142d] to-[#0a0d1f] border-2 border-indigo-500/50 p-4 space-y-3.5 shadow-xl shadow-indigo-950/60 relative overflow-hidden"
                  >
                    {/* Glowing Accent Bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                      isBuySignal ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300' : isSellSignal ? 'bg-gradient-to-r from-rose-500 via-pink-400 to-rose-300' : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300'
                    }`} />

                    {/* Card Header: Signal Badge & Copy Action */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 shadow-sm ${
                          isBuySignal 
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50' 
                            : isSellSignal 
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50' 
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                        }`}>
                          <Zap className="w-3.5 h-3.5" />
                          <span>{tradeSignal}</span>
                        </span>
                        
                        {analysis.signalConfidence && (
                          <span className="px-2 py-0.5 rounded-md bg-[#181c3b] border border-[#2b3366] text-[10px] font-mono text-purple-300">
                            {analysis.signalConfidence}% Confidence
                          </span>
                        )}
                      </div>

                      <button
                        onClick={handleCopySetup}
                        className="px-2.5 py-1 rounded-lg bg-[#181c3b] hover:bg-[#252c5c] border border-[#2b3366] text-[10px] font-mono text-gray-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        title="Copy setup to clipboard"
                      >
                        {copiedSetup ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-indigo-300" />
                            <span>Copy Setup</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Setup Classification Subheading */}
                    {analysis.riskAnalysis.setupType && (
                      <div className="text-[11px] font-mono text-indigo-300 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Setup: <strong>{analysis.riskAnalysis.setupType}</strong></span>
                      </div>
                    )}

                    {/* 4 Execution Numeric Metric Cards (ENTRY, STOP LOSS, TAKE PROFIT 1, TAKE PROFIT 2) */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      
                      {/* ENTRY */}
                      <div className="p-3 rounded-xl bg-[#111736] border border-blue-500/40 flex flex-col justify-between space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-blue-300 font-sans font-bold uppercase tracking-wider">
                          <span>Entry Zone</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300 font-mono">MARKET</span>
                        </div>
                        <div className="text-base font-extrabold text-white">
                          {analysis.riskAnalysis.entryArea}
                        </div>
                        <span className="text-[9px] text-gray-400 font-sans">Current reference level</span>
                      </div>

                      {/* STOP LOSS (S.L) */}
                      <div className="p-3 rounded-xl bg-[#2b1218] border border-rose-500/50 flex flex-col justify-between space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-rose-300 font-sans font-bold uppercase tracking-wider">
                          <span>Stop Loss (S.L)</span>
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                        </div>
                        <div className="text-base font-extrabold text-rose-400">
                          {analysis.riskAnalysis.stopLoss}
                        </div>
                        <span className="text-[9px] text-rose-300/70 font-sans">Strict invalidation level</span>
                      </div>

                      {/* TAKE PROFIT 1 (T.P 1) */}
                      <div className="p-3 rounded-xl bg-[#0f271c] border border-emerald-500/40 flex flex-col justify-between space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-emerald-300 font-sans font-bold uppercase tracking-wider">
                          <span>Take Profit 1 (T.P 1)</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono">50% Scale</span>
                        </div>
                        <div className="text-base font-extrabold text-emerald-400">
                          {analysis.riskAnalysis.takeProfit1}
                        </div>
                        <span className="text-[9px] text-emerald-300/70 font-sans">Move SL to Breakeven</span>
                      </div>

                      {/* TAKE PROFIT 2 (T.P 2) */}
                      <div className="p-3 rounded-xl bg-[#0d2a2a] border border-teal-500/40 flex flex-col justify-between space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-teal-300 font-sans font-bold uppercase tracking-wider">
                          <span>Take Profit 2 (T.P 2)</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-950/80 border border-teal-500/30 text-teal-300 font-mono">Runner</span>
                        </div>
                        <div className="text-base font-extrabold text-teal-300">
                          {analysis.riskAnalysis.takeProfit2}
                        </div>
                        <span className="text-[9px] text-teal-300/70 font-sans">Full liquidity target</span>
                      </div>

                    </div>

                    {/* Risk / Reward & Position Sizing Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#0c0f24] p-2.5 rounded-xl border border-[#1d234d]">
                      <div>
                        <span className="text-[10px] text-gray-400 font-sans block">Risk / Reward Ratio</span>
                        <strong className="text-purple-300">{analysis.riskAnalysis.riskRewardRatio || '1:2.4'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-sans block">Recommended Position Risk</span>
                        <strong className="text-amber-300">{analysis.riskAnalysis.recommendedRisk || '1.0% Equity'}</strong>
                      </div>
                    </div>

                    {/* Detailed Trader Explanation Narrative */}
                    <div className="p-3 rounded-xl bg-[#121634] border border-indigo-500/30 space-y-1.5 text-[11px] font-sans leading-relaxed">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 font-mono">
                        <Info className="w-3.5 h-3.5 text-purple-400" />
                        <span>How to Trade & Full Setup Logic:</span>
                      </div>
                      <p className="text-gray-200">
                        {analysis.riskAnalysis.tradeExplanation || analysis.aiOutlook || `Execute ${tradeSignal} near ${analysis.riskAnalysis.entryArea}. Protect capital with Stop Loss at ${analysis.riskAnalysis.stopLoss}. Take initial profit at ${analysis.riskAnalysis.takeProfit1}, and trail remaining position into ${analysis.riskAnalysis.takeProfit2}.`}
                      </p>
                    </div>

                  </section>
                )}
                
                {/* 1. Market Overview */}
                <section aria-labelledby="section-overview" className="bg-[#0d1022] border border-[#1a203f] rounded-2xl p-3.5 space-y-2 shadow-xs">
                  <div 
                    onClick={() => toggleSection('overview')}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      <h3 id="section-overview" className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                        1. Market Overview
                      </h3>
                    </div>
                    {expandedSections.overview ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>

                  {expandedSections.overview && (
                    <div className="pt-1.5 space-y-2 border-t border-[#171c38]">
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-[#121630] p-2 rounded-xl border border-[#20274f]">
                          <span className="text-[10px] text-gray-400 block font-sans">Symbol & Interval</span>
                          <strong className="text-white">{analysis.marketOverview?.symbol || symbol} ({analysis.marketOverview?.timeframe || timeframe})</strong>
                        </div>
                        <div className="bg-[#121630] p-2 rounded-xl border border-[#20274f]">
                          <span className="text-[10px] text-gray-400 block font-sans">Reference Price</span>
                          <strong className="text-emerald-400">{analysis.marketOverview?.currentPrice || priceDisplay}</strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed font-sans bg-[#11142a] p-2.5 rounded-xl border border-[#1b2144]">
                        {analysis.marketOverview?.overallCondition || analysis.aiOutlook || 'Active market structure trading in defined range.'}
                      </p>
                    </div>
                  )}
                </section>

                {/* 2. Trend */}
                <section aria-labelledby="section-trend" className="bg-[#0d1022] border border-[#1a203f] rounded-2xl p-3.5 space-y-2 shadow-xs">
                  <div 
                    onClick={() => toggleSection('trend')}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isBullish ? 'bg-emerald-400' : isBearish ? 'bg-rose-400' : 'bg-amber-400'}`}></span>
                      <h3 id="section-trend" className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                        2. Trend
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                        isBullish 
                          ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40' 
                          : isBearish 
                          ? 'bg-rose-950/70 text-rose-400 border border-rose-500/40' 
                          : 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
                      }`}>
                        {trendDirection.toUpperCase()}
                      </span>
                      {expandedSections.trend ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                  </div>

                  {expandedSections.trend && (
                    <div className="pt-1.5 border-t border-[#171c38]">
                      <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                        {analysis.trend?.explanation || `Price is establishing ${isBullish ? 'higher highs above dynamic EMA support' : isBearish ? 'lower highs beneath resistance' : 'horizontal consolidation'} on ${timeframe}.`}
                      </p>
                    </div>
                  )}
                </section>

                {/* 3. Price Structure */}
                <section aria-labelledby="section-structure" className="bg-[#0d1022] border border-[#1a203f] rounded-2xl p-3.5 space-y-2 shadow-xs">
                  <div 
                    onClick={() => toggleSection('structure')}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <h3 id="section-structure" className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                        3. Price Structure
                      </h3>
                    </div>
                    {expandedSections.structure ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>

                  {expandedSections.structure && (
                    <div className="pt-1.5 space-y-2 border-t border-[#171c38] text-[11px] font-sans">
                      <div className="bg-[#121630] p-2.5 rounded-xl border border-[#20274f] space-y-1">
                        <span className="text-[10px] text-gray-400 font-mono font-semibold block">SWING BEHAVIOR</span>
                        <p className="text-gray-200">{analysis.priceStructure?.swingPoints || 'Establishing structured swing pivots.'}</p>
                      </div>
                      <div className="bg-[#121630] p-2.5 rounded-xl border border-[#20274f] space-y-1">
                        <span className="text-[10px] text-gray-400 font-mono font-semibold block">BREAK OF STRUCTURE</span>
                        <p className="text-gray-200">{analysis.priceStructure?.breakOfStructure || 'No recent invalidation break detected.'}</p>
                      </div>
                      <div className="bg-[#121630] p-2.5 rounded-xl border border-[#20274f] space-y-1">
                        <span className="text-[10px] text-gray-400 font-mono font-semibold block">CONSOLIDATION / RANGE</span>
                        <p className="text-gray-200">{analysis.priceStructure?.consolidation || 'Trading within current session boundaries.'}</p>
                      </div>
                    </div>
                  )}
                </section>

                {/* 4. Key Levels */}
                <section aria-labelledby="section-levels" className="bg-[#0d1022] border border-[#1a203f] rounded-2xl p-3.5 space-y-2 shadow-xs">
                  <div 
                    onClick={() => toggleSection('levels')}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <h3 id="section-levels" className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                        4. Key Levels
                      </h3>
                    </div>
                    {expandedSections.levels ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>

                  {expandedSections.levels && (
                    <div className="pt-1.5 space-y-2 border-t border-[#171c38] text-xs font-mono">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#102419] p-2.5 rounded-xl border border-emerald-500/30">
                          <span className="text-[10px] text-emerald-400/80 uppercase font-sans font-semibold block">Support Areas</span>
                          <div className="font-bold text-emerald-300 mt-0.5 space-y-0.5">
                            {analysis.keyLevels?.support ? (
                              analysis.keyLevels.support.map((lvl, idx) => (
                                <div key={idx}>• {lvl}</div>
                              ))
                            ) : (
                              <div>{analysis.support || 'Dynamic EMA'}</div>
                            )}
                          </div>
                        </div>

                        <div className="bg-[#261218] p-2.5 rounded-xl border border-rose-500/30">
                          <span className="text-[10px] text-rose-400/80 uppercase font-sans font-semibold block">Resistance Areas</span>
                          <div className="font-bold text-rose-300 mt-0.5 space-y-0.5">
                            {analysis.keyLevels?.resistance ? (
                              analysis.keyLevels.resistance.map((lvl, idx) => (
                                <div key={idx}>• {lvl}</div>
                              ))
                            ) : (
                              <div>{analysis.resistance || 'Recent Highs'}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#121630] p-2.5 rounded-xl border border-[#20274f] space-y-1.5 text-[11px] font-sans">
                        <div>
                          <strong className="text-purple-300 font-mono text-[10px] uppercase">Breakout Zone: </strong>
                          <span className="text-gray-300">{analysis.keyLevels?.breakoutArea || 'Clean expansion candle close outside local range.'}</span>
                        </div>
                        <div>
                          <strong className="text-[#ff4b58] font-mono text-[10px] uppercase">Invalidation Zone: </strong>
                          <span className="text-gray-300">{analysis.keyLevels?.invalidationArea || 'Break below structural demand pivot.'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* 5. Momentum & Volatility */}
                <section aria-labelledby="section-momentum" className="bg-[#0d1022] border border-[#1a203f] rounded-2xl p-3.5 space-y-2 shadow-xs">
                  <div 
                    onClick={() => toggleSection('momentum')}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <h3 id="section-momentum" className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                        5. Momentum & Volatility
                      </h3>
                    </div>
                    {expandedSections.momentum ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>

                  {expandedSections.momentum && (
                    <div className="pt-1.5 space-y-2 border-t border-[#171c38]">
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-[#121630] p-2 rounded-xl border border-[#20274f]">
                          <span className="text-[10px] text-gray-400 block font-sans">Momentum</span>
                          <strong className="text-white">{analysis.momentumVolatility?.momentum || analysis.momentum || 'Moderate'}</strong>
                        </div>
                        <div className="bg-[#121630] p-2 rounded-xl border border-[#20274f]">
                          <span className="text-[10px] text-gray-400 block font-sans">Volatility</span>
                          <strong className="text-purple-300">{analysis.momentumVolatility?.volatility || analysis.volatility || 'Medium'}</strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                        {analysis.momentumVolatility?.explanation || `RSI is sitting near ${indicators?.currentRsi || 50}, reflecting balanced order flow and standard market participation.`}
                      </p>
                    </div>
                  )}
                </section>

                {/* 6. Possible Scenarios */}
                <section aria-labelledby="section-scenarios" className="bg-[#0d1022] border border-[#1a203f] rounded-2xl p-3.5 space-y-2 shadow-xs">
                  <div 
                    onClick={() => toggleSection('scenarios')}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <h3 id="section-scenarios" className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                        6. Possible Scenarios
                      </h3>
                    </div>
                    {expandedSections.scenarios ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>

                  {expandedSections.scenarios && (
                    <div className="pt-1.5 space-y-2 border-t border-[#171c38] text-[11px] font-sans">
                      {/* Bullish Scenario */}
                      <div className="bg-[#0f1f18] p-2.5 rounded-xl border border-emerald-500/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-[10px] uppercase">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Bullish Scenario</span>
                        </div>
                        <p className="text-gray-300">
                          {analysis.possibleScenarios?.bullish?.condition || 'A clean breakout above immediate resistance with expanding volume.'}
                        </p>
                        {analysis.possibleScenarios?.bullish?.targetArea && (
                          <div className="text-[10px] font-mono text-emerald-300">
                            Target: {analysis.possibleScenarios.bullish.targetArea}
                          </div>
                        )}
                      </div>

                      {/* Bearish Scenario */}
                      <div className="bg-[#241117] p-2.5 rounded-xl border border-rose-500/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-rose-400 font-bold font-mono text-[10px] uppercase">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>Bearish Scenario</span>
                        </div>
                        <p className="text-gray-300">
                          {analysis.possibleScenarios?.bearish?.condition || 'A loss of immediate support leading to downward liquidity sweep.'}
                        </p>
                        {analysis.possibleScenarios?.bearish?.targetArea && (
                          <div className="text-[10px] font-mono text-rose-300">
                            Target: {analysis.possibleScenarios.bearish.targetArea}
                          </div>
                        )}
                      </div>

                      {/* Range Scenario */}
                      <div className="bg-[#1e1910] p-2.5 rounded-xl border border-amber-500/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono text-[10px] uppercase">
                          <Activity className="w-3.5 h-3.5" />
                          <span>Range Scenario</span>
                        </div>
                        <p className="text-gray-300">
                          {analysis.possibleScenarios?.range?.condition || 'Continued rotation between support and resistance boundaries.'}
                        </p>
                      </div>
                    </div>
                  )}
                </section>

                {/* 7. What to Watch */}
                <section aria-labelledby="section-watch" className="bg-[#0d1022] border border-[#1a203f] rounded-2xl p-3.5 space-y-2 shadow-xs">
                  <div 
                    onClick={() => toggleSection('watch')}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                      <h3 id="section-watch" className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                        7. What to Watch
                      </h3>
                    </div>
                    {expandedSections.watch ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>

                  {expandedSections.watch && (
                    <div className="pt-1.5 border-t border-[#171c38]">
                      <ul className="space-y-1.5 text-[11px] text-gray-300 font-sans">
                        {analysis.whatToWatch && analysis.whatToWatch.length > 0 ? (
                          analysis.whatToWatch.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-purple-400 font-mono text-xs font-bold mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 font-mono text-xs font-bold mt-0.5">•</span>
                              <span>Candlestick close relative to key moving average on {timeframe}.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 font-mono text-xs font-bold mt-0.5">•</span>
                              <span>Volume surge during retest of support or resistance levels.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 font-mono text-xs font-bold mt-0.5">•</span>
                              <span>Liquidity sweep signals above/below recent session extremes.</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </section>

              </div>
            ) : (
              /* Awaiting Analysis Initial State */
              <div className="bg-[#070914] border border-[#16192d] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[260px]">
                <div className="w-12 h-12 rounded-2xl bg-[#101428] border border-[#202747] flex items-center justify-center text-purple-400 shadow-inner">
                  <BarChart2 className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="text-sm font-semibold text-gray-200">
                  Ready to Analyze Current Chart
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[280px]">
                  Click the button above to scan live candlestick structure, support/resistance, and scenario forecasts for {symbol}.
                </p>
              </div>
            )}

            {/* Quick Action Interactive Buttons */}
            <div className="pt-2 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-mono font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Quick Actions</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => onQuickAction('Explain This')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#121630] hover:bg-[#1c224a] border border-[#222956] text-[11px] font-medium text-gray-200 hover:text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <HelpCircle className="w-3 h-3 text-indigo-400" />
                  <span>Explain This</span>
                </button>

                <button
                  onClick={() => onQuickAction('Find Support & Resistance')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#121630] hover:bg-[#1c224a] border border-[#222956] text-[11px] font-medium text-gray-200 hover:text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <Target className="w-3 h-3 text-emerald-400" />
                  <span>Find Support & Resistance</span>
                </button>

                <button
                  onClick={() => onQuickAction('Analyze Trend')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#121630] hover:bg-[#1c224a] border border-[#222956] text-[11px] font-medium text-gray-200 hover:text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <TrendingUp className="w-3 h-3 text-cyan-400" />
                  <span>Analyze Trend</span>
                </button>

                <button
                  onClick={() => onQuickAction('Explain Liquidity')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#121630] hover:bg-[#1c224a] border border-[#222956] text-[11px] font-medium text-gray-200 hover:text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <span>Explain Liquidity</span>
                </button>

                <button
                  onClick={() => onQuickAction('Find Possible Setups')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#121630] hover:bg-[#1c224a] border border-[#222956] text-[11px] font-medium text-gray-200 hover:text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <Compass className="w-3 h-3 text-purple-400" />
                  <span>Find Possible Setups</span>
                </button>

                <button
                  onClick={onAnalyze}
                  className="px-2.5 py-1.5 rounded-lg bg-[#121630] hover:bg-[#1c224a] border border-[#222956] text-[11px] font-medium text-gray-200 hover:text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <RefreshCw className="w-3 h-3 text-amber-400" />
                  <span>Refresh Analysis</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: CHAT STREAM */}
        {activeTab === 'chat' && (
          <div className="space-y-3 min-h-[300px] flex flex-col justify-between">
            <div className="space-y-2.5">
              {chatMessages.length === 0 ? (
                <div className="p-6 text-center text-gray-400 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-purple-400 opacity-60" />
                  <p className="text-xs">
                    Ask Straddle AI anything about the current <strong>{symbol}</strong> chart, key levels, or strategy adjustments.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col text-xs ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`p-3 rounded-2xl max-w-[95%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#4f46e5] text-white rounded-br-xs'
                        : 'bg-[#101428] text-gray-200 border border-[#1f2648] rounded-bl-xs'
                    }`}>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    <span className="text-[9px] font-mono text-gray-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))
              )}

              {isChatTyping && (
                <div className="flex items-center gap-1.5 text-xs text-purple-300 font-mono p-2">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Straddle AI is evaluating market flow...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts in Chat */}
            <div className="pt-2 border-t border-[#171a30] flex flex-wrap gap-1">
              <button
                onClick={() => onQuickAction('Find Support & Resistance')}
                className="px-2 py-1 rounded-md bg-[#131730] text-[10px] text-gray-300 hover:text-white"
              >
                Key Levels
              </button>
              <button
                onClick={() => onQuickAction('Analyze Trend')}
                className="px-2 py-1 rounded-md bg-[#131730] text-[10px] text-gray-300 hover:text-white"
              >
                Trend
              </button>
              <button
                onClick={() => onQuickAction('Explain Liquidity')}
                className="px-2 py-1 rounded-md bg-[#131730] text-[10px] text-gray-300 hover:text-white"
              >
                Liquidity
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Chat / Prompt Input Form */}
      <form 
        onSubmit={onSendMessage}
        className="p-3 border-t border-[#16192e] bg-[#0c0e1e] space-y-1.5 shrink-0"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message Straddle AI about this chart..."
            className="flex-1 bg-[#070914] border border-[#1d223f] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isChatTyping}
            className="p-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#6366f1] disabled:opacity-40 text-white transition-all cursor-pointer shadow-md shadow-indigo-950"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-gray-500 px-1">
          <span>STRADDLE AI DESK</span>
          <span>{symbol} · {timeframe}</span>
        </div>
      </form>
    </div>
  );
};
