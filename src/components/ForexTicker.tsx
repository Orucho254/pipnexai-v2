import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { ForexPair } from '../types';

const INITIAL_PAIRS: ForexPair[] = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0842, change: 0.0034, changePercent: 0.31, direction: 'up', high: 1.0865, low: 1.0810 },
  { symbol: 'GBP/USD', name: 'British Pound / USD', price: 1.2915, change: 0.0052, changePercent: 0.40, direction: 'up', high: 1.2940, low: 1.2870 },
  { symbol: 'USD/JPY', name: 'US Dollar / Yen', price: 154.28, change: -0.45, changePercent: -0.29, direction: 'down', high: 155.10, low: 153.90 },
  { symbol: 'XAU/USD', name: 'Gold / US Dollar', price: 2894.60, change: 18.40, changePercent: 0.64, direction: 'up', high: 2905.00, low: 2872.10 },
  { symbol: 'USD/CHF', name: 'USD / Swiss Franc', price: 0.8870, change: -0.0018, changePercent: -0.20, direction: 'down', high: 0.8895, low: 0.8850 },
  { symbol: 'AUD/USD', name: 'Aussie / US Dollar', price: 0.6580, change: 0.0022, changePercent: 0.34, direction: 'up', high: 0.6605, low: 0.6550 },
  { symbol: 'BTC/USD', name: 'Bitcoin / USD', price: 96450.00, change: 1280.00, changePercent: 1.34, direction: 'up', high: 97200.00, low: 94800.00 },
];

export const ForexTicker: React.FC = () => {
  const [pairs, setPairs] = useState<ForexPair[]>(INITIAL_PAIRS);

  useEffect(() => {
    const interval = setInterval(() => {
      setPairs((prev) =>
        prev.map((pair) => {
          const delta = (Math.random() - 0.48) * (pair.price * 0.0006);
          const newPrice = Number((pair.price + delta).toFixed(pair.price > 100 ? 2 : 4));
          const changePercent = Number((pair.changePercent + (Math.random() - 0.5) * 0.05).toFixed(2));
          return {
            ...pair,
            price: newPrice,
            direction: delta >= 0 ? 'up' : 'down',
            changePercent: changePercent
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#08090f] border-b border-[#151724] py-2 overflow-hidden select-none z-10">
      <div className="flex items-center gap-2 max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wider shrink-0 mr-2 font-mono">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Pips</span>
        </div>

        <div className="flex items-center gap-6 shrink-0 animate-marquee whitespace-nowrap">
          {pairs.map((pair) => {
            const isUp = pair.direction === 'up' || pair.changePercent >= 0;
            return (
              <div key={pair.symbol} className="flex items-center gap-2 text-xs">
                <span className="font-bold text-gray-200">{pair.symbol}</span>
                <span className="font-mono text-gray-300">
                  {pair.price > 100 ? pair.price.toLocaleString() : pair.price.toFixed(4)}
                </span>
                <span
                  className={`flex items-center text-[11px] font-semibold font-mono ${
                    isUp ? 'text-emerald-400' : 'text-[#ff4b58]'
                  }`}
                >
                  {isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                  {isUp ? '+' : ''}
                  {pair.changePercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
