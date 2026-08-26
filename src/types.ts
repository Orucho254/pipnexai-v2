export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  referralCode?: string;
  isVerified: boolean;
  authProvider: 'email' | 'google';
  avatarUrl?: string;
  plan?: 'Free Trial' | 'Starter' | 'Pro' | 'Elite' | 'Platinum' | 'Ultimate';
  mt5Connected?: boolean;
}

export interface CountryItem {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export interface ForexPair {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  direction: 'up' | 'down';
  high: number;
  low: number;
}

export interface MacroEvent {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  impact: 'High' | 'Medium' | 'Low';
  category: 'Economic' | 'FOMC' | 'NFP' | 'PCE' | 'GDP' | 'Unemployment' | 'Consumer Confidence';
  dateStr: string;
  countdown: string;
  consensus?: string;
  previous?: string;
  analysis?: string;
}

export interface BotTrade {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  lotSize: number;
  profitPips: number;
  pnlUsd: number;
  status: 'OPEN' | 'CLOSED';
  botStrategy: string;
  timestamp: string;
}

export interface BotStrategy {
  id: string;
  name: string;
  version: string;
  winRate: number;
  totalPips: number;
  status: 'active' | 'paused';
  riskLevel: 'Low' | 'Medium' | 'Aggressive';
  pairs: string[];
  description: string;
}

export interface PulseSignal {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  tp1: number;
  tp2: number;
  sl: number;
  riskReward: string;
  confidence: number;
  timeframe: string;
  timeAgo: string;
  status: 'ACTIVE' | 'HIT_TP1' | 'HIT_TP2' | 'CLOSED';
  gainPips: number;
}
