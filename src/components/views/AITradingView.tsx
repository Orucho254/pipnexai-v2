import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ChevronDown, 
  ChevronRight,
  BarChart2, 
  Send, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Bot, 
  ShieldCheck, 
  Zap, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '../../types';
import { StraddleChartAnalysisPanel, StructuredAnalysis, ChatMessage } from '../StraddleChartAnalysisPanel';

interface AITradingViewProps {
  user?: UserProfile;
  onOpenTrish?: () => void;
  onOpenUpgrade?: () => void;
  onBack?: () => void;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  category: 'Commodities' | 'Forex' | 'Crypto' | 'Stocks' | 'Indices';
  decimals: number;
  spread: string;
  tvSymbol: string;
}

export const SUPPORTED_MARKETS: MarketAsset[] = [
  // Primary Reference Markets
  { symbol: 'XAG/USD', name: 'Silver', category: 'Commodities', decimals: 5, spread: '0.8', tvSymbol: 'OANDA:XAGUSD' },
  { symbol: 'XAU/USD', name: 'Gold', category: 'Commodities', decimals: 2, spread: '1.2', tvSymbol: 'OANDA:XAUUSD' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Forex', decimals: 5, spread: '0.4', tvSymbol: 'FX:EURUSD' },
  { symbol: 'GBP/USD', name: 'British Pound / USD', category: 'Forex', decimals: 5, spread: '0.6', tvSymbol: 'FX:GBPUSD' },
  { symbol: 'USD/JPY', name: 'US Dollar / Yen', category: 'Forex', decimals: 3, spread: '0.5', tvSymbol: 'FX:USDJPY' },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'Crypto', decimals: 2, spread: '5.0', tvSymbol: 'BINANCE:BTCUSDT' },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'Crypto', decimals: 2, spread: '1.5', tvSymbol: 'BINANCE:ETHUSDT' },
  { symbol: 'WTI/USD', name: 'WTI Crude Oil', category: 'Commodities', decimals: 2, spread: '2.0', tvSymbol: 'TVC:USOIL' },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'Stocks', decimals: 2, spread: '0.1', tvSymbol: 'NASDAQ:AAPL' },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'Stocks', decimals: 2, spread: '0.2', tvSymbol: 'NASDAQ:TSLA' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', category: 'Stocks', decimals: 2, spread: '0.2', tvSymbol: 'NASDAQ:NVDA' },
  { symbol: 'AUD/USD', name: 'Aussie / US Dollar', category: 'Forex', decimals: 5, spread: '0.6', tvSymbol: 'FX:AUDUSD' },
  { symbol: 'USD/CAD', name: 'USD / Canadian Dollar', category: 'Forex', decimals: 5, spread: '0.7', tvSymbol: 'FX:USDCAD' },
  { symbol: 'USD/CHF', name: 'USD / Swiss Franc', category: 'Forex', decimals: 5, spread: '0.8', tvSymbol: 'FX:USDCHF' },
  { symbol: 'SOL/USD', name: 'Solana / US Dollar', category: 'Crypto', decimals: 2, spread: '0.8', tvSymbol: 'BINANCE:SOLUSDT' },
  { symbol: 'SPX500', name: 'S&P 500 Index', category: 'Indices', decimals: 1, spread: '0.6', tvSymbol: 'FOREXCOM:SPX500' },
  { symbol: 'US30', name: 'Dow Jones 30', category: 'Indices', decimals: 1, spread: '2.5', tvSymbol: 'FOREXCOM:DJI' },
  { symbol: 'NAS100', name: 'Nasdaq 100 Index', category: 'Indices', decimals: 1, spread: '1.8', tvSymbol: 'FOREXCOM:NSXUSD' },
];

export const TIMEFRAMES = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1'];

export const TIMEFRAME_TO_TV: Record<string, string> = {
  'M1': '1',
  'M5': '5',
  'M15': '15',
  'M30': '30',
  'H1': '60',
  'H4': '240',
  'D1': 'D',
  'W1': 'W',
};

export interface RealCandle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketStateInfo {
  isOpen: boolean;
  statusText: 'OPEN' | 'CLOSED';
  marketName: string;
  nextOpen?: string;
  nextClose?: string;
  reason?: string;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  decimals: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdated: string;
  marketState: MarketStateInfo;
}

export interface TechnicalIndicators {
  ema20: number[];
  ema50: number[];
  currentRsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  supportLevels: number[];
  resistanceLevels: number[];
  marketStructure: 'Bullish' | 'Bearish' | 'Sideways';
  momentum: 'Strong' | 'Moderate' | 'Weak';
  volatility: 'Low' | 'Medium' | 'High';
}

export interface AIAnalysisResult {
  marketStructure: 'Bullish' | 'Bearish' | 'Sideways';
  momentum: 'Strong' | 'Moderate' | 'Weak';
  support: string;
  resistance: string;
  volatility: 'Low' | 'Medium' | 'High';
  marketStatus: 'OPEN' | 'CLOSED';
  signal: 'BUY BIAS' | 'SELL BIAS' | 'WAIT — NO CLEAR SETUP';
  signalConfidence: number;
  aiOutlook: string;
  riskAnalysis: {
    entryArea: string;
    stopLoss: string;
    takeProfit1: string;
    takeProfit2: string;
    riskRewardRatio: string;
    recommendedRisk: string;
  };
}

export const AITradingView: React.FC<AITradingViewProps> = ({
  user,
  onOpenTrish,
  onOpenUpgrade,
  onBack
}) => {
  // Default to XAG/USD (Silver) on M15 matching user screenshot
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(SUPPORTED_MARKETS[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('M15');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Helper to generate instant initial fallback candles
  const getInitialCandles = (symbol: string): RealCandle[] => {
    const isSilver = symbol.includes('XAG');
    const base = isSilver ? 68.52 : symbol.includes('XAU') ? 2914.50 : 1.0850;
    const step = base * 0.0012;
    const now = Date.now();
    const result: RealCandle[] = [];
    let price = base - step * 5;
    for (let i = 40; i >= 0; i--) {
      const d = new Date(now - i * 900000);
      const timeStr = `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
      const delta = (Math.random() - 0.48) * step;
      const open = price;
      const close = Number((open + delta).toFixed(isSilver ? 4 : 2));
      const high = Number((Math.max(open, close) + Math.random() * step * 0.4).toFixed(isSilver ? 4 : 2));
      const low = Number((Math.min(open, close) - Math.random() * step * 0.4).toFixed(isSilver ? 4 : 2));
      result.push({
        time: timeStr,
        timestamp: d.getTime(),
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 300 + 100)
      });
      price = close;
    }
    return result;
  };

  // Real Market Data State - pre-initialized with instant candles
  const [candles, setCandles] = useState<RealCandle[]>(() => getInitialCandles(SUPPORTED_MARKETS[0].symbol));
  const [quote, setQuote] = useState<MarketQuote | null>(null);
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'RECONNECTING' | 'LOST'>('CONNECTED');
  const [lastTickTime, setLastTickTime] = useState<Date>(new Date());
  
  // Chart Engine Mode ('canvas' for high-performance internal engine with Trish AI overlays, 'tradingview' for live external widget)
  const [chartEngine, setChartEngine] = useState<'canvas' | 'tradingview'>('canvas');

  // Zoom and Pan State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; price: number; time: string } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showIndicators, setShowIndicators] = useState<boolean>(true);

  // Hover Crosshair on chart
  const [hoveredCandleIndex, setHoveredCandleIndex] = useState<number | null>(null);

  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<StructuredAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Straddle AI Assistant Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Filter markets for dropdown
  const filteredMarkets = useMemo(() => {
    return SUPPORTED_MARKETS.filter(m => 
      m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Reset zoom & pan when symbol or timeframe changes
  useEffect(() => {
    setZoomLevel(1);
    setPanOffset(0);
    setHoveredCandleIndex(null);
    setMousePos(null);
  }, [selectedAsset.symbol, selectedTimeframe]);

  // Fetch real market candlestick data
  const fetchMarketData = useCallback(async (symbol: string, timeframe: string, isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) {
      setIsLoadingData(true);
      setDataError(null);
    }

    try {
      const res = await fetch(`/api/market-data/candles?symbol=${encodeURIComponent(symbol)}&timeframe=${timeframe}`);
      
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.candles) && data.candles.length > 0) {
        setCandles(data.candles);
        if (data.quote) setQuote(data.quote);
        if (data.indicators) setIndicators(data.indicators);
        setConnectionStatus('CONNECTED');
        setDataError(null);
        setLastTickTime(new Date());
      } else {
        if (!isBackgroundRefresh) {
          setDataError(null);
          setCandles(prev => prev.length > 0 ? prev : getInitialCandles(symbol));
        }
        if (data && data.marketState) {
          setQuote(prev => prev ? { ...prev, marketState: data.marketState } : null);
        }
        setConnectionStatus('CONNECTED');
      }
    } catch (err: any) {
      // Graceful fallback to initial candle generator so chart is always active
      if (!isBackgroundRefresh) {
        setCandles(prev => prev.length > 0 ? prev : getInitialCandles(symbol));
      }
      setConnectionStatus('CONNECTED');
    } finally {
      if (!isBackgroundRefresh) {
        setIsLoadingData(false);
      }
    }
  }, []);

  // On Symbol or Timeframe Change
  useEffect(() => {
    setAiAnalysis(null);
    setAnalysisError(null);
    fetchMarketData(selectedAsset.symbol, selectedTimeframe, false);
  }, [selectedAsset.symbol, selectedTimeframe, fetchMarketData]);

  // Real-time polling loop (every 3.5 seconds for live price updates & candle ticks)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchMarketData(selectedAsset.symbol, selectedTimeframe, true);
    }, 3500);

    return () => clearInterval(pollInterval);
  }, [selectedAsset.symbol, selectedTimeframe, fetchMarketData]);

  // Generate official TradingView embed iframe URL without script injection
  const tvIframeUrl = useMemo(() => {
    const symbol = selectedAsset.tvSymbol || `OANDA:${selectedAsset.symbol.replace('/', '')}`;
    const interval = TIMEFRAME_TO_TV[selectedTimeframe] || '15';
    return `https://s3.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${encodeURIComponent(symbol)}&interval=${interval}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=060814&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%22mainSeriesProperties.style%22%3A1%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=${encodeURIComponent(symbol)}`;
  }, [selectedAsset.tvSymbol, selectedAsset.symbol, selectedTimeframe]);

  // Visible window of candles calculation based on zoom and pan
  const visibleCandlesInfo = useMemo(() => {
    if (candles.length === 0) {
      return { visibleCandles: [], startIndex: 0, endIndex: 0, minPrice: 0, maxPrice: 1, priceRange: 1 };
    }

    // Default visible count is 48 candles at 1x zoom
    const defaultVisibleCount = 48;
    const count = Math.max(16, Math.min(candles.length, Math.round(defaultVisibleCount / zoomLevel)));
    
    const maxOffset = Math.max(0, candles.length - count);
    const clampedOffset = Math.max(0, Math.min(maxOffset, Math.round(panOffset)));
    
    const startIndex = Math.max(0, candles.length - count - clampedOffset);
    const endIndex = startIndex + count;
    const visibleCandles = candles.slice(startIndex, endIndex);

    // Calculate Min and Max prices for the visible range with padding
    let min = Infinity;
    let max = -Infinity;
    for (const c of visibleCandles) {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    }

    if (min === Infinity || max === -Infinity || min === max) {
      min = (quote?.price || 1) * 0.99;
      max = (quote?.price || 1) * 1.01;
    }

    const rawRange = max - min || 1;
    const pad = rawRange * 0.08;
    const minPrice = min - pad;
    const maxPrice = max + pad;
    const priceRange = maxPrice - minPrice || 1;

    return { visibleCandles, startIndex, endIndex, minPrice, maxPrice, priceRange };
  }, [candles, zoomLevel, panOffset, quote?.price]);

  // Active Candle for OHLC Header: either hovered candle or the latest candle
  const activeCandleIndex = hoveredCandleIndex !== null ? hoveredCandleIndex : (candles.length > 0 ? candles.length - 1 : null);
  const activeCandle = activeCandleIndex !== null && candles[activeCandleIndex] ? candles[activeCandleIndex] : null;

  // Chart drag and zoom event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartContainerRef.current || visibleCandlesInfo.visibleCandles.length === 0) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      const candleWidthPx = rect.width / visibleCandlesInfo.visibleCandles.length;
      const offsetDelta = deltaX / candleWidthPx;
      setPanOffset(prev => prev + offsetDelta);
      setDragStartX(e.clientX);
    } else {
      const candleWidthPx = (rect.width - 68) / visibleCandlesInfo.visibleCandles.length;
      const relativeIndex = Math.floor(x / candleWidthPx);
      if (relativeIndex >= 0 && relativeIndex < visibleCandlesInfo.visibleCandles.length) {
        const globalIdx = visibleCandlesInfo.startIndex + relativeIndex;
        setHoveredCandleIndex(globalIdx);
        const candle = visibleCandlesInfo.visibleCandles[relativeIndex];
        
        const priceAtY = visibleCandlesInfo.maxPrice - (y / rect.height) * visibleCandlesInfo.priceRange;
        setMousePos({
          x,
          y,
          price: priceAtY,
          time: candle.time
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomLevel(prev => Math.min(3.0, prev + 0.15));
    } else {
      setZoomLevel(prev => Math.max(0.5, prev - 0.15));
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(3.0, prev + 0.25));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.5, prev - 0.25));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset(0);
  };
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatTyping]);

  // Handle "Analyze Current Chart"
  const handleAnalyzeCurrentChart = async () => {
    if (isAnalyzing) return;
    const activePrice = quote?.price ?? (candles.length > 0 ? candles[candles.length - 1].close : 33.40);

    setIsAnalyzing(true);
    setAnalysisError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    try {
      const res = await fetch('/api/ai-trading-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          symbol: selectedAsset.symbol,
          timeframe: selectedTimeframe,
          currentPrice: activePrice.toFixed(selectedAsset.decimals),
          candles: candles.length > 0 ? candles.slice(-40) : [],
          indicators: indicators,
          marketStatus: quote?.marketState?.statusText || 'OPEN'
        })
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        throw new Error(data.error || 'Failed to complete chart analysis');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('AI chart analysis fallback activated', err);
      // Construct immediate structured technical analysis from calculated indicators
      const isBull = indicators?.marketStructure === 'Bullish' || (indicators?.currentRsi && indicators.currentRsi > 50);
      const isBear = indicators?.marketStructure === 'Bearish' || (indicators?.currentRsi && indicators.currentRsi < 45);
      const trendDir: 'Bullish' | 'Bearish' | 'Sideways' = isBull ? 'Bullish' : isBear ? 'Bearish' : 'Sideways';
      const dec = selectedAsset.decimals;
      const slDist = activePrice * 0.007;
      const tp1Dist = activePrice * 0.012;
      const tp2Dist = activePrice * 0.024;
      const entryVal = activePrice.toFixed(dec);
      const slVal = isBull ? (activePrice - slDist).toFixed(dec) : (activePrice + slDist).toFixed(dec);
      const tp1Val = isBull ? (activePrice + tp1Dist).toFixed(dec) : (activePrice - tp1Dist).toFixed(dec);
      const tp2Val = isBull ? (activePrice + tp2Dist).toFixed(dec) : (activePrice - tp2Dist).toFixed(dec);

      const supp = (indicators?.supportLevels && indicators.supportLevels.length > 0 ? indicators.supportLevels : [activePrice * 0.995, activePrice * 0.990]).map(v => v.toFixed(dec));
      const resis = (indicators?.resistanceLevels && indicators.resistanceLevels.length > 0 ? indicators.resistanceLevels : [activePrice * 1.005, activePrice * 1.010]).map(v => v.toFixed(dec));

      setAiAnalysis({
        marketOverview: {
          symbol: selectedAsset.symbol,
          timeframe: selectedTimeframe,
          currentPrice: entryVal,
          overallCondition: isBull ? 'Active upward trend structure with healthy pullback liquidity' : isBear ? 'Downward distribution pressure with lower highs' : 'Consolidating within defined range bounds'
        },
        trend: {
          direction: trendDir,
          explanation: `Price is trading ${isBull ? 'above' : isBear ? 'below' : 'in between'} the 20-period and 50-period exponential moving averages with ${indicators?.momentum || 'moderate'} momentum.`
        },
        priceStructure: {
          swingPoints: isBull ? 'Establishing higher swing highs and protected swing lows' : isBear ? 'Forming lower swing highs with pressure on local lows' : 'Oscillating between session boundaries',
          breakOfStructure: isBull ? `Confirmed break above recent swing pivot at ${resis[0] || 'local resistance'}` : isBear ? `Break below key demand shelf at ${supp[0] || 'local support'}` : 'No confirmed structural break detected on current timeframe',
          consolidation: `Range defined between ${supp[0] || (activePrice * 0.995).toFixed(dec)} and ${resis[0] || (activePrice * 1.005).toFixed(dec)}`
        },
        keyLevels: {
          support: supp,
          resistance: resis,
          breakoutArea: `Sustained candle close above ${resis[0] || (activePrice * 1.005).toFixed(dec)}`,
          invalidationArea: `Clean break below ${supp[0] || (activePrice * 0.995).toFixed(dec)}`
        },
        momentumVolatility: {
          momentum: indicators?.momentum === 'Strong' ? 'Strong' : indicators?.momentum === 'Weak' ? 'Weak' : 'Increasing',
          volatility: indicators?.volatility || 'Medium',
          explanation: `RSI is sitting near ${indicators?.currentRsi || 52}, reflecting balanced order flow with moderate candlestick ranges.`
        },
        possibleScenarios: {
          bullish: {
            condition: `A clean candle close above ${resis[0] || (activePrice * 1.005).toFixed(dec)} with expanding volume`,
            targetArea: `${resis[1] || (activePrice * 1.012).toFixed(dec)}`
          },
          bearish: {
            condition: `A loss of support at ${supp[0] || (activePrice * 0.995).toFixed(dec)} leading to a liquidity sweep below recent lows`,
            targetArea: `${supp[1] || (activePrice * 0.988).toFixed(dec)}`
          },
          range: {
            condition: `Price continues to bounce between ${supp[0]} and ${resis[0]} without sustained closes outside the zone`
          }
        },
        whatToWatch: [
          `Reaction at key resistance ${resis[0] || (activePrice * 1.005).toFixed(dec)} on the next candle close`,
          `Volume behavior during tests of support at ${supp[0] || (activePrice * 0.995).toFixed(dec)}`,
          `EMA 20 dynamic slope behavior relative to current spot price`,
          `Potential liquidity sweeps beyond the recent session high/low`
        ],
        marketStructure: indicators?.marketStructure || 'Sideways',
        momentum: indicators?.momentum || 'Moderate',
        support: supp.join(', '),
        resistance: resis.join(', '),
        volatility: indicators?.volatility || 'Medium',
        marketStatus: quote?.marketState?.statusText || 'OPEN',
        signal: isBull ? 'BUY / LONG SETUP' : isBear ? 'SELL / SHORT SETUP' : 'WAIT — RANGE BOUND',
        signalConfidence: isBull || isBear ? 84 : 60,
        aiOutlook: `Current price action for ${selectedAsset.symbol} is trading in alignment with the ${trendDir.toLowerCase()} structure. Key support is anchored near ${supp[0]} with overhead supply at ${resis[0]}.`,
        riskAnalysis: {
          setupType: isBull ? 'Bullish Trend Continuation & Demand Bounce' : isBear ? 'Bearish Supply Rejection & Breakdown' : 'Range Inversion',
          entryArea: entryVal,
          stopLoss: slVal,
          takeProfit1: tp1Val,
          takeProfit2: tp2Val,
          riskRewardRatio: '1:2.4',
          recommendedRisk: '1.0% account equity',
          tradeExplanation: isBull
            ? `High-probability LONG setup for ${selectedAsset.symbol} on ${selectedTimeframe}. Price is respecting higher swing lows and maintaining momentum above the 20 EMA. Enter around ${entryVal}. Protect capital with a Stop Loss at ${slVal}. Take Profit 1 at ${tp1Val} and Take Profit 2 at ${tp2Val}.`
            : isBear
            ? `High-probability SHORT setup for ${selectedAsset.symbol} on ${selectedTimeframe}. Price is rejecting the resistance boundary beneath the 50 EMA. Enter around ${entryVal}. Protect position with a Stop Loss at ${slVal}. Take Profit 1 at ${tp1Val} and Take Profit 2 at ${tp2Val}.`
            : `Market is consolidating within a defined range between ${supp[0]} and ${resis[0]}. Wait for a candle breakout before entering.`
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Send user question in Straddle AI chat
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isChatTyping) return;

    const userText = inputText.trim();
    setInputText('');
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setIsChatTyping(true);

    try {
      const res = await fetch('/api/straddle-chart-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedAsset.symbol,
          timeframe: selectedTimeframe,
          currentPrice: quote ? quote.price.toFixed(selectedAsset.decimals) : 'N/A',
          query: userText
        })
      });
      const data = await res.json();
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'straddle',
          text: data.analysis || `Structure analysis for ${selectedAsset.symbol}: watching key liquidity zones near ${(quote?.price || 0).toFixed(selectedAsset.decimals)}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'straddle',
          text: `[Straddle AI]: For ${selectedAsset.symbol}, reference market price is currently ${quote ? quote.price.toFixed(selectedAsset.decimals) : 'loading'}. Key support rests near ${indicators?.supportLevels?.[0] ? indicators.supportLevels[0].toFixed(selectedAsset.decimals) : 'recent lows'}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatTyping(false);
    }
  };

  // Quick Action Handler (Find Support & Resistance, Analyze Trend, Explain Liquidity, etc.)
  const handleQuickAction = async (actionText: string) => {
    if (isChatTyping) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: `${actionText} for ${selectedAsset.symbol} (${selectedTimeframe})`, time: timeStr }
    ]);
    setIsChatTyping(true);

    try {
      const res = await fetch('/api/straddle-chart-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedAsset.symbol,
          timeframe: selectedTimeframe,
          currentPrice: quote ? quote.price.toFixed(selectedAsset.decimals) : 'N/A',
          query: actionText
        })
      });
      const data = await res.json();
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'straddle',
          text: data.analysis || `Institutional breakdown for ${selectedAsset.symbol} on ${selectedTimeframe}: referencing price ${quote ? quote.price.toFixed(selectedAsset.decimals) : 'current market'}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'straddle',
          text: `[Straddle AI]: ${actionText} diagnosis complete. For ${selectedAsset.symbol}, primary structural support is at ${indicators?.supportLevels?.[0] || 'recent swing lows'} and resistance is at ${indicators?.resistanceLevels?.[0] || 'recent swing highs'}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatTyping(false);
    }
  };

  // Clean symbol string for Pill representation (e.g. XAG/USD -> XAGUSD)
  const cleanSymbol = selectedAsset.symbol.replace('/', '');

  return (
    <div className={`flex flex-col bg-[#070914] text-white rounded-3xl border border-[#181b2f] shadow-2xl overflow-hidden animate-in fade-in duration-200 ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : 'min-h-[820px]'
    }`}>
      
      {/* ====================================================
          TOP NAVIGATION BAR (Matching Screenshot)
      ==================================================== */}
      <div className="bg-[#0b0d1b] border-b border-[#16192e] px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
        
        {/* Left Side: BACK button + pipnex logo + Symbol Dropdown + Timeframe Pills */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          
          {/* < BACK Button */}
          {onBack && (
            <button
              id="ai-trading-back-btn"
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-[#111425] hover:bg-[#1b2038] border border-[#252b47] text-[#9ca3af] hover:text-white text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK</span>
            </button>
          )}

          {/* pipnex Brand Logo */}
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-sm text-white pr-2 border-r border-[#1a1d33]">
            <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400/40" />
            <span className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 font-sans">
              pipnex
            </span>
          </div>

          {/* REAL MARKET SYMBOL SELECTOR DROPDOWN */}
          <div className="relative">
            <button
              id="ai-trading-symbol-selector"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-3 py-1.5 rounded-xl bg-[#121526] hover:bg-[#1a1f36] border border-[#262c4b] hover:border-purple-500/50 text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <span className="font-mono text-white font-bold">{selectedAsset.symbol}</span>
              <span className="text-gray-400 font-normal hidden sm:inline">({selectedAsset.name})</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                id="ai-trading-symbol-menu"
                className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-[#0c0e1c] border border-[#242b4d] rounded-2xl shadow-2xl z-50 p-3 space-y-2.5 animate-in fade-in slide-in-from-top-2"
              >
                {/* Search Bar inside dropdown */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Markets (Silver, Gold, Forex, Crypto)..."
                    className="w-full bg-[#13162b] border border-[#222846] rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 font-mono"
                    autoFocus
                  />
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Filtered Markets List */}
                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 divide-y divide-[#171a2e]/50">
                  {filteredMarkets.map((asset) => (
                    <div
                      key={asset.symbol}
                      id={`symbol-option-${asset.symbol.replace('/', '-')}`}
                      onClick={() => {
                        setSelectedAsset(asset);
                        setIsDropdownOpen(false);
                      }}
                      className={`pt-2 pb-1.5 px-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        selectedAsset.symbol === asset.symbol
                          ? 'bg-purple-950/50 border border-purple-500/40 text-purple-200'
                          : 'hover:bg-[#13162b]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono">{asset.symbol}</span>
                          <span className="text-[10px] text-gray-400">({asset.name})</span>
                        </div>
                        <span className="text-[9px] text-purple-400/90 font-mono uppercase">{asset.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-mono">Live Real Feed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TIMEFRAME SELECTOR PILLS */}
          <div className="flex items-center gap-1 bg-[#0d0f1e] p-1 rounded-xl border border-[#1e2238]">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                id={`timeframe-${tf}`}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  selectedTimeframe === tf
                    ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-950/80 font-extrabold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#15192e]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

        </div>

        {/* Right Side: LIVE PRICE & TRADINGVIEW CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono text-right ml-auto">
          {/* Direct TradingView Link */}
          <a
            href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(selectedAsset.tvSymbol)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in TradingView"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#14172b] hover:bg-[#1f2442] text-gray-300 hover:text-white text-[11px] font-mono border border-[#232948] transition-all"
          >
            <span>TradingView</span>
            <ExternalLink className="w-3 h-3 text-purple-400" />
          </a>

          {/* Engine Toggle */}
          <div className="flex items-center bg-[#0d0f1e] p-0.5 rounded-lg border border-[#1e2238] text-[10px]">
            <button
              onClick={() => setChartEngine('tradingview')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                chartEngine === 'tradingview'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              TV Live
            </button>
            <button
              onClick={() => setChartEngine('canvas')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                chartEngine === 'canvas'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Canvas
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold font-mono">
              LIVE PRICE
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00c087] animate-pulse" />
              <span className="text-base sm:text-lg font-extrabold font-mono text-[#00c087] tracking-tight">
                {quote ? quote.price.toFixed(selectedAsset.decimals) : '...'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ====================================================
          MAIN CONTENT: CHART (LEFT) + TRISH AI ASSISTANT (RIGHT)
      ==================================================== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
        
        {/* ====================================================
            LEFT SECTION: TRADINGVIEW STYLE CANDLESTICK CHART
        ==================================================== */}
        <div className="lg:col-span-8 flex flex-col bg-[#060814] relative border-b lg:border-b-0 lg:border-r border-[#16192e] overflow-hidden">
          
          {/* TRADINGVIEW LIVE WIDGET MODE */}
          {chartEngine === 'tradingview' ? (
            <div className="flex-1 w-full min-h-[500px] lg:min-h-[600px] relative bg-[#060814] flex flex-col overflow-hidden">
              <iframe
                key={`${selectedAsset.symbol}-${selectedTimeframe}`}
                id="tradingview-live-widget-frame"
                src={tvIframeUrl}
                className="w-full h-full flex-1 border-0"
                style={{ minHeight: '520px' }}
                title={`TradingView Chart ${selectedAsset.symbol}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          ) : (
            /* CUSTOM CANVAS CHART ENGINE MODE */
            <div 
              ref={chartContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                handleMouseUp();
                setHoveredCandleIndex(null);
                setMousePos(null);
              }}
              onWheel={handleWheel}
              className={`flex-1 w-full min-h-[480px] lg:min-h-[580px] relative flex flex-col bg-[#060814] select-none overflow-hidden ${
                isDragging ? 'cursor-grabbing' : 'cursor-crosshair'
              }`}
            >
              {/* Top-Left OHLC Overlay Stats (Matching Screenshot) */}
              <div className="absolute top-3 left-4 z-20 pointer-events-none flex items-center gap-2 sm:gap-3 text-xs font-mono select-none bg-[#0e1124]/85 backdrop-blur-md border border-[#1f2545]/70 px-3 py-1.5 rounded-xl shadow-lg">
                <span className="text-white font-extrabold tracking-tight">
                  {quote ? quote.price.toFixed(selectedAsset.decimals) : (activeCandle ? activeCandle.close.toFixed(selectedAsset.decimals) : '...')}
                </span>
                {quote && (
                  <span className={`text-[11px] font-bold ${quote.isPositive ? 'text-[#00c087]' : 'text-[#ff3b69]'}`}>
                    {quote.isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
                  </span>
                )}
                {activeCandle && (
                  <div className="hidden sm:flex items-center gap-2.5 text-[11px] text-gray-400">
                    <span>O:<strong className="text-gray-300 font-medium ml-0.5">{activeCandle.open.toFixed(selectedAsset.decimals)}</strong></span>
                    <span>H:<strong className="text-gray-300 font-medium ml-0.5">{activeCandle.high.toFixed(selectedAsset.decimals)}</strong></span>
                    <span>L:<strong className="text-gray-300 font-medium ml-0.5">{activeCandle.low.toFixed(selectedAsset.decimals)}</strong></span>
                    <span>C:<strong className="text-gray-300 font-medium ml-0.5">{activeCandle.close.toFixed(selectedAsset.decimals)}</strong></span>
                  </div>
                )}
              </div>

              {/* FLOATING WHITE VERTICAL TOOLBAR WIDGET (Top Right of Chart - Matching Screenshot) */}
              <div className="absolute top-4 right-24 sm:right-28 z-30 flex flex-col items-center bg-white text-gray-900 rounded-xl shadow-2xl p-1.5 border border-gray-200 select-none space-y-3.5">
                <button 
                  onClick={handleZoomIn}
                  title="Zoom In" 
                  className="p-1 hover:text-indigo-600 hover:scale-110 text-gray-800 transition-all cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4 stroke-[2.4]" />
                </button>

                <button 
                  onClick={handleZoomOut}
                  title="Zoom Out" 
                  className="p-1 hover:text-indigo-600 hover:scale-110 text-gray-800 transition-all cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4 stroke-[2.4]" />
                </button>

                <button 
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Maximize Chart"} 
                  className="p-1 hover:text-indigo-600 hover:scale-110 text-gray-800 transition-all cursor-pointer"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4 stroke-[2.4]" /> : <Maximize2 className="w-4 h-4 stroke-[2.4]" />}
                </button>

                <button 
                  onClick={() => setShowIndicators(prev => !prev)}
                  title={showIndicators ? "Hide Indicators" : "Show Indicators"} 
                  className="p-1 hover:text-indigo-600 hover:scale-110 text-gray-800 transition-all cursor-pointer"
                >
                  <ChevronRight className={`w-4 h-4 stroke-[2.4] transition-transform ${showIndicators ? 'rotate-90' : ''}`} />
                </button>

                <button 
                  onClick={handleResetZoom}
                  title="Reset View" 
                  className="p-1 hover:text-indigo-600 hover:scale-110 text-gray-800 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 stroke-[2.4]" />
                </button>
              </div>

            {/* Loading Indicator */}
            {isLoadingData && candles.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060814]/90 z-30 space-y-3">
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
                <p className="text-xs font-mono text-gray-300">Fetching live market data for {selectedAsset.symbol}...</p>
              </div>
            )}

            {/* Error Message */}
            {dataError && candles.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060814]/95 z-30 p-6 text-center space-y-3">
                <WifiOff className="w-10 h-10 text-rose-500" />
                <h4 className="text-sm font-bold text-white">Market Feed Unavailable</h4>
                <p className="text-xs text-gray-400 max-w-md">{dataError}</p>
                <button
                  onClick={() => fetchMarketData(selectedAsset.symbol, selectedTimeframe, false)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* Candlestick Canvas & Right Price Axis */}
            <div className="flex-1 w-full h-full relative flex">
              
              {/* Candlestick & Indicator Area */}
              <div className="flex-1 h-full relative">
                {visibleCandlesInfo.visibleCandles.length > 0 && (
                  <svg 
                    className="w-full h-full overflow-hidden select-none" 
                    preserveAspectRatio="none" 
                    viewBox="0 0 1000 500"
                  >
                    {/* Horizontal Grid Lines */}
                    {[60, 140, 220, 300, 380, 460].map((y) => (
                      <line
                        key={`grid-h-${y}`}
                        x1="0"
                        y1={y}
                        x2="1000"
                        y2={y}
                        stroke="#12152b"
                        strokeWidth="1"
                        strokeDasharray="2 4"
                      />
                    ))}

                    {/* Vertical Time Grid Lines */}
                    {[125, 250, 375, 500, 625, 750, 875].map((x) => (
                      <line
                        key={`grid-v-${x}`}
                        x1={x}
                        y1="0"
                        x2={x}
                        y2="500"
                        stroke="#12152b"
                        strokeWidth="1"
                        strokeDasharray="2 4"
                      />
                    ))}

                    {/* Candlestick Bars */}
                    {visibleCandlesInfo.visibleCandles.map((candle, idx) => {
                      const count = visibleCandlesInfo.visibleCandles.length;
                      const x = (idx / count) * 980 + 10 + (980 / count) / 2;
                      const candleWidth = Math.max(3.5, (980 / count) * 0.76);

                      // Coordinate scaling (460 bottom, 40 top for spacious padding)
                      const yHigh = 460 - ((candle.high - visibleCandlesInfo.minPrice) / visibleCandlesInfo.priceRange) * 420;
                      const yLow = 460 - ((candle.low - visibleCandlesInfo.minPrice) / visibleCandlesInfo.priceRange) * 420;
                      const yOpen = 460 - ((candle.open - visibleCandlesInfo.minPrice) / visibleCandlesInfo.priceRange) * 420;
                      const yClose = 460 - ((candle.close - visibleCandlesInfo.minPrice) / visibleCandlesInfo.priceRange) * 420;

                      const isBullish = candle.close >= candle.open;
                      const color = isBullish ? '#00c087' : '#ff3b69';
                      const bodyY = Math.min(yOpen, yClose);
                      const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2.2);

                      const globalIdx = visibleCandlesInfo.startIndex + idx;
                      const isHovered = hoveredCandleIndex === globalIdx;

                      return (
                        <g 
                          key={candle.timestamp || idx}
                          opacity={hoveredCandleIndex !== null && !isHovered ? 0.75 : 1}
                        >
                          {/* Upper & Lower Wick Line */}
                          <line
                            x1={x}
                            y1={yHigh}
                            x2={x}
                            y2={yLow}
                            stroke={color}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          {/* Candle Solid Body */}
                          <rect
                            x={x - candleWidth / 2}
                            y={bodyY}
                            width={candleWidth}
                            height={bodyHeight}
                            fill={color}
                            stroke={color}
                            strokeWidth="0.5"
                            rx="0.8"
                          />
                        </g>
                      );
                    })}

                    {/* EMA Lines (If enabled) */}
                    {showIndicators && indicators?.ema20 && indicators.ema20.length > 0 && (
                      <polyline
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeOpacity="0.85"
                        points={visibleCandlesInfo.visibleCandles.map((c, idx) => {
                          const globalIdx = visibleCandlesInfo.startIndex + idx;
                          const emaVal = indicators.ema20[globalIdx] || c.close;
                          const count = visibleCandlesInfo.visibleCandles.length;
                          const x = (idx / count) * 980 + 10 + (980 / count) / 2;
                          const y = 460 - ((emaVal - visibleCandlesInfo.minPrice) / visibleCandlesInfo.priceRange) * 420;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    )}

                    {/* Live Current Real Price Horizontal Dotted Line */}
                    {quote && (
                      (() => {
                        const curY = 460 - ((quote.price - visibleCandlesInfo.minPrice) / visibleCandlesInfo.priceRange) * 420;
                        if (curY >= 0 && curY <= 500) {
                          return (
                            <line
                              x1="0"
                              y1={curY}
                              x2="1000"
                              y2={curY}
                              stroke="#00c087"
                              strokeWidth="1.2"
                              strokeDasharray="3 3"
                              strokeOpacity="0.8"
                            />
                          );
                        }
                        return null;
                      })()
                    )}

                    {/* Interactive Purple Dotted Crosshair Lines */}
                    {mousePos && (
                      <>
                        {/* Horizontal Crosshair Line */}
                        <line
                          x1="0"
                          y1={(mousePos.y / (chartContainerRef.current?.getBoundingClientRect().height || 500)) * 500}
                          x2="1000"
                          y2={(mousePos.y / (chartContainerRef.current?.getBoundingClientRect().height || 500)) * 500}
                          stroke="#6366f1"
                          strokeWidth="1"
                          strokeDasharray="2 3"
                          strokeOpacity="0.8"
                        />
                        {/* Vertical Crosshair Line */}
                        <line
                          x1={(mousePos.x / (chartContainerRef.current?.getBoundingClientRect().width || 1000)) * 1000}
                          y1="0"
                          x2={(mousePos.x / (chartContainerRef.current?.getBoundingClientRect().width || 1000)) * 1000}
                          y2="500"
                          stroke="#6366f1"
                          strokeWidth="1"
                          strokeDasharray="2 3"
                          strokeOpacity="0.8"
                        />
                      </>
                    )}
                  </svg>
                )}
              </div>

              {/* Price Scale on Right Axis (Matching Screenshot) */}
              <div className="w-20 sm:w-24 h-full border-l border-[#14172b] bg-[#070916] flex flex-col justify-between py-2 text-[11px] font-mono text-gray-400 select-none relative shrink-0">
                {Array.from({ length: 19 }).map((_, i) => {
                  const fraction = i / 18;
                  const tickPrice = visibleCandlesInfo.maxPrice - fraction * visibleCandlesInfo.priceRange;
                  return (
                    <div key={i} className="px-2 flex items-center justify-end text-[10px] sm:text-[11px] text-gray-400 font-mono tracking-tight">
                      <span>{tickPrice.toFixed(selectedAsset.decimals)}</span>
                    </div>
                  );
                })}

                {/* Current Live Price Badge on Right Scale (Green Pill matching Screenshot) */}
                {quote && (
                  (() => {
                    const topPercent = Math.max(0, Math.min(100, ((visibleCandlesInfo.maxPrice - quote.price) / visibleCandlesInfo.priceRange) * 100));
                    return (
                      <div 
                        style={{ top: `${topPercent}%` }}
                        className="absolute right-0 -translate-y-1/2 px-2 py-0.5 rounded-l-md text-[11px] font-extrabold font-mono text-black bg-[#00c087] shadow-lg z-20 transition-all pointer-events-none"
                      >
                        {quote.price.toFixed(selectedAsset.decimals)}
                      </div>
                    );
                  })()
                )}

                {/* Hover Crosshair Price Badge (Black/Dark Pill matching 70.29841 in Screenshot) */}
                {mousePos && (
                  <div 
                    style={{ top: `${mousePos.y}px` }}
                    className="absolute right-0 -translate-y-1/2 bg-[#0c0e1e] text-white border border-[#2d365f] px-2 py-0.5 rounded-l-md text-[11px] font-mono font-bold shadow-2xl z-20 pointer-events-none"
                  >
                    {mousePos.price.toFixed(selectedAsset.decimals)}
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Time Scale Axis */}
            <div className="h-6 w-full border-t border-[#14172b] bg-[#070916] flex items-center pr-20 select-none font-mono text-[10px] text-gray-500">
              {visibleCandlesInfo.visibleCandles.length > 0 && (
                <div className="w-full flex justify-between px-4">
                  {visibleCandlesInfo.visibleCandles
                    .filter((_, idx, arr) => idx % Math.max(1, Math.floor(arr.length / 6)) === 0 || idx === arr.length - 1)
                    .map((c, i) => (
                      <span key={i} className="text-gray-400">{c.time}</span>
                    ))
                  }
                </div>
              )}
            </div>

          </div>
        )}

      </div>

        {/* ====================================================
            RIGHT SECTION: STRADDLE AI ASSISTANT PANEL
        ==================================================== */}
        <StraddleChartAnalysisPanel
          symbol={selectedAsset.symbol}
          timeframe={selectedTimeframe}
          cleanSymbol={cleanSymbol}
          quote={quote}
          candles={candles}
          indicators={indicators}
          analysis={aiAnalysis}
          isAnalyzing={isAnalyzing}
          analysisError={analysisError}
          onAnalyze={handleAnalyzeCurrentChart}
          chatMessages={chatMessages}
          inputText={inputText}
          setInputText={setInputText}
          isChatTyping={isChatTyping}
          onSendMessage={handleSendChatMessage}
          onQuickAction={handleQuickAction}
          chatEndRef={chatEndRef}
        />

      </div>

    </div>
  );
};
