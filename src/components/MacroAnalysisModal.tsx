import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  BarChart2 
} from 'lucide-react';
import { MacroEvent } from '../types';

interface MacroAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: MacroEvent | null;
}

export const MacroAnalysisModal: React.FC<MacroAnalysisModalProps> = ({
  isOpen,
  onClose,
  event
}) => {
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !event) {
      setAnalysisText(null);
      return;
    }

    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/analyze-macro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventTitle: event.title,
            country: event.country,
            impact: event.impact,
            date: event.dateStr,
            consensus: event.consensus,
            previous: event.previous
          })
        });
        const data = await res.json();
        setAnalysisText(data.analysis);
      } catch {
        setAnalysisText(event.analysis || 'Analysis generated for ' + event.title);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const isHigh = event.impact === 'High';
  const isMedium = event.impact === 'Medium';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="macro-analysis-modal"
        className="w-full max-w-xl bg-[#0a0c16] border border-[#1a1e30] rounded-3xl p-6 shadow-2xl text-white relative flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#161828]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#141628] border border-[#272d4c] flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">{event.title}</span>
                <span className="text-sm">{event.countryFlag}</span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">NewsIQ Algorithmic Impact Prediction</p>
            </div>
          </div>
          <button
            id="close-macro-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#121422] text-gray-400 hover:text-white hover:bg-[#1a1e34] border border-[#1e2338] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Key Metric Chips */}
        <div className="grid grid-cols-4 gap-2 my-4">
          <div className="bg-[#0f1120] p-2.5 rounded-xl border border-[#1c223a] text-center">
            <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-mono">IMPACT</div>
            <div className="pt-0.5">
              <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded ${
                isHigh ? 'bg-[#2b1216] text-[#ff4b58] border border-[#ff4b58]/30' : isMedium ? 'bg-[#2b220e] text-[#f5a623] border border-[#f5a623]/30' : 'bg-[#181a26] text-gray-400'
              }`}>
                {event.impact}
              </span>
            </div>
          </div>

          <div className="bg-[#0f1120] p-2.5 rounded-xl border border-[#1c223a] text-center">
            <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-mono">SCHEDULE</div>
            <div className="font-mono text-gray-200 text-xs font-semibold pt-1 truncate">
              {event.dateStr.split(',')[0]}
            </div>
          </div>

          <div className="bg-[#0f1120] p-2.5 rounded-xl border border-[#1c223a] text-center">
            <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-mono">COUNTDOWN</div>
            <div className="font-mono text-emerald-400 text-xs font-bold pt-1">
              {event.countdown}
            </div>
          </div>

          <div className="bg-[#0f1120] p-2.5 rounded-xl border border-[#1c223a] text-center">
            <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-mono">STATUS</div>
            <div className="font-mono text-purple-300 text-xs font-bold pt-1">
              AI READY
            </div>
          </div>
        </div>

        {/* Content Body with Small Easy-to-Scan Sections */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 text-xs leading-relaxed custom-scrollbar">
          {loading ? (
            <div className="py-14 flex flex-col items-center justify-center gap-3 text-gray-400">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium">NewsIQ AI analyzing historical volatility &amp; order book depth...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Structured Metric Summary Box */}
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="bg-[#0e1122] p-3 rounded-xl border border-[#1b2240] space-y-1">
                  <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">EXPECTED RANGE</div>
                  <div className="text-xs font-bold text-white">45–80 Pips Volatility</div>
                </div>

                <div className="bg-[#0e1122] p-3 rounded-xl border border-[#1b2240] space-y-1">
                  <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">PRIMARY PAIRS</div>
                  <div className="text-xs font-bold text-purple-300">EUR/USD · XAU/USD · USD/JPY</div>
                </div>
              </div>

              {/* Scenarios: Bullish & Bearish Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-[#0d1717] border border-emerald-500/30 p-3 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Bullish Scenario</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-snug">
                    Print beats consensus: USD strengthens, EUR/USD retests 1.0810, Gold tests $2,865 support.
                  </p>
                </div>

                <div className="bg-[#1a0e14] border border-rose-500/30 p-3 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Bearish Scenario</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-snug">
                    Print misses consensus: USD weakens, EUR/USD expands to 1.0920, Gold breaks toward $2,910.
                  </p>
                </div>
              </div>

              {/* Bot Action Plan */}
              <div className="p-3.5 rounded-xl bg-[#0e1122] border border-[#1b2240] space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>PipNex Auto-Trading Guard Recommendations</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300">
                  <div className="flex items-start gap-2 bg-[#090b16] p-2 rounded-lg border border-[#161a30]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Trailing Stop Buffer: +15 Pips</span>
                  </div>
                  <div className="flex items-start gap-2 bg-[#090b16] p-2 rounded-lg border border-[#161a30]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Max Equity Drawdown Cap: 1.0%</span>
                  </div>
                </div>
              </div>

              {/* Additional AI Overview */}
              {analysisText && (
                <div className="p-3 rounded-xl bg-[#0a0c16] border border-[#16192c] text-gray-400 text-[11px] whitespace-pre-wrap leading-relaxed">
                  {analysisText}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#161828] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#141628] hover:bg-[#1f243e] border border-[#2b3152] hover:border-purple-500/40 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
