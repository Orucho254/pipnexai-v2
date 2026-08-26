import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Shield, Crown, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { DynamicPaymentModal } from './DynamicPaymentModal';
import { fetchProductsCatalogue, ProductPlanInfo } from '../lib/paymentService';

export type PlanTierType = 'Starter' | 'Pro' | 'Elite' | 'Platinum' | 'Ultimate';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: PlanTierType;
  user?: UserProfile | null;
  onUpgradeSuccess: (tier: any) => void;
}

export const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({
  isOpen,
  onClose,
  defaultTier = 'Pro',
  user,
  onUpgradeSuccess
}) => {
  // Normalize default tier
  const initialTier: string = 
    defaultTier === 'Elite' ? 'elite' :
    defaultTier === 'Starter' ? 'starter' :
    defaultTier === 'Platinum' ? 'platinum' :
    defaultTier === 'Ultimate' ? 'ultimate' : 'pro';

  const [selectedProductId, setSelectedProductId] = useState<string>(initialTier);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductPlanInfo[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchProductsCatalogue().then((prods) => {
        if (prods.length > 0) {
          setProducts(prods);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fallbackTiers: ProductPlanInfo[] = [
    {
      id: 'starter',
      name: 'Starter',
      subtitle: 'Perfect for getting started',
      usdPrice: 45,
      exchangeRate: 129,
      kesAmount: 5805,
      formattedKes: 'KES 5,805',
      billing: '/ ½ month',
      badge: '',
      highlighted: false,
      color: 'from-blue-600 to-indigo-600',
      features: [
        '10 Chart Uploads per day',
        'Advanced Chart Analysis',
        'Multi-Timeframe Analysis',
        'PipNex Pulse Signals (2/day)',
        'AI News Trading Analysis',
        'Position Size Calculator',
        '3 Custom AI Setups per day',
        'Smart Chart Analyzer',
        'Trading Journal',
        '24/7 Priority Support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      subtitle: 'For serious traders',
      usdPrice: 95,
      exchangeRate: 129,
      kesAmount: 12255,
      formattedKes: 'KES 12,255',
      billing: '/ month',
      badge: '⭐ MOST POPULAR',
      highlighted: true,
      color: 'from-purple-600 to-indigo-600',
      features: [
        '24 Chart Uploads per day',
        'Multi-Timeframe Analysis',
        'Signal of the Day (90%+ accurate)',
        'PipNex Pulse Signals (2/day)',
        'AI News Trading Analysis (NFP/CPI)',
        'AI Auto trading',
        'PipNex PropPass',
        'Smart Chart Analyzer',
        'Unlimited Custom Setups',
        '24/7 Priority Support'
      ]
    },
    {
      id: 'elite',
      name: 'Elite',
      subtitle: 'Maximum performance',
      usdPrice: 195,
      exchangeRate: 129,
      kesAmount: 25155,
      formattedKes: 'KES 25,155',
      billing: '/ 3 months',
      badge: 'MAX PERFORMANCE',
      highlighted: false,
      color: 'from-amber-600 to-orange-600',
      features: [
        'Unlimited PipNex Pulse Signals',
        'Direct AI Chart Analysis (no uploads)',
        'Prompt Trading UI',
        'MT5 Account Connection',
        '🤖 Run Bots Without PC (Cloud Bots)',
        '🚀 Auto Trading (2000 AI credits)',
        '☁️ FREE VPS Included ($50/mo value)',
        'Voice-based AI Interaction',
        'AI reads account for journaling',
        'AI generates & executes strategies',
        'Unlimited MT5 accounts (10)',
        '24/7 Bot Monitoring & Alerts',
        'Priority AI processing',
        'White-glove support'
      ]
    }
  ];

  const activeTiers = products.length > 0 ? products.slice(0, 3) : fallbackTiers;
  const currentSelected = activeTiers.find((t) => t.id === selectedProductId) || activeTiers[1];

  const handleProceedToPayment = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentCompleted = (planName: string) => {
    onUpgradeSuccess(planName);
    setIsPaymentModalOpen(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div 
          id="upgrade-plan-modal"
          className="w-full max-w-5xl bg-[#0c0d15] border border-[#1d2030] rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#161826]">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Upgrade PipNex Membership</h2>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Unlock real-time AI chart intelligence, automated trading bots, and institutional signals.
              </p>
            </div>
            <button
              id="close-upgrade-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#141624] border border-[#22253a] text-gray-400 hover:text-white hover:bg-[#1a1e30] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pricing Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 my-5 overflow-y-auto pr-1">
            {activeTiers.map((tier) => {
              const isSelected = selectedProductId === tier.id;
              return (
                <div
                  key={tier.id}
                  id={`tier-card-${tier.id}`}
                  onClick={() => setSelectedProductId(tier.id)}
                  className={`rounded-3xl p-5 border cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#141626] border-purple-500/80 shadow-xl shadow-purple-950/40 ring-1 ring-purple-500/50'
                      : tier.highlighted
                      ? 'bg-[#0e101c] border-purple-500/40 hover:border-purple-500/70'
                      : 'bg-[#0a0b12] border-[#1a1d2c] hover:border-[#2b304c]'
                  }`}
                >
                  {tier.badge && (
                    <span className={`absolute -top-3 right-5 text-[10px] font-mono uppercase px-3 py-1 rounded-full font-bold shadow-md ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-400/40'
                        : 'bg-[#2b220e] text-[#f5a623] border border-[#f5a623]/30'
                    }`}>
                      {tier.badge}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-white tracking-tight">{tier.name}</div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-medium mt-0.5">{tier.subtitle}</div>

                    <div className="my-3 pb-3 border-b border-[#1a1d2e]">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold font-mono text-white tracking-tight">${tier.usdPrice}</span>
                        <span className="text-xs text-gray-400 font-mono">{tier.billing}</span>
                      </div>
                      <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                        ≈ KES {tier.kesAmount.toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-1">
                      {tier.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight text-gray-300 text-[12px]">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3">
                    <div
                      className={`w-full py-2.5 rounded-xl text-center text-xs font-bold transition-all shadow-sm ${
                        isSelected
                          ? 'bg-purple-600 hover:bg-purple-500 text-white'
                          : 'bg-[#141624] border border-[#2b304c] text-gray-200 hover:bg-[#1c2036]'
                      }`}
                    >
                      {isSelected ? '✓ Selected Plan' : `Choose ${tier.name}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upgrade Action Footer */}
          <div className="pt-4 border-t border-[#161826] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant M-Pesa STK push & Binance TRC20 verification supported.</span>
            </div>

            <button
              id="confirm-upgrade-plan-btn"
              onClick={handleProceedToPayment}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] text-white font-bold text-xs shadow-lg shadow-purple-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-[#ffd700]" />
              <span>Proceed to Pay for {currentSelected.name} (${currentSelected.usdPrice})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Payment Modal directly based on Screenshot templates */}
      <DynamicPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        productId={selectedProductId}
        user={user}
        onPaymentSuccess={handlePaymentCompleted}
      />
    </>
  );
};
