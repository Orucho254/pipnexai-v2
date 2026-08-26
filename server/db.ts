import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  plan: 'Free Trial' | 'Pro' | 'Platinum' | 'Ultimate';
  balance: number;
  isVerified: boolean;
  authProvider: 'email' | 'google';
  mt5Connected: boolean;
  mt5AccountNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentEntity {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  productId: string;
  productName: string;
  usdPrice: number;
  exchangeRate: number;
  kesAmount: number;
  paymentMethod: 'mpesa_automated' | 'mpesa_manual' | 'binance_usdt';
  phoneNumber?: string;
  merchantRequestId?: string;
  checkoutRequestId?: string;
  mpesaReceiptNumber?: string;
  transactionHash?: string;
  binanceId?: string;
  smsMessage?: string;
  notes?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  statusMessage?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface PropPassEntity {
  id: string;
  userId: string;
  clientName: string;
  email: string;
  phone: string;
  firmName: string; // FTMO, FundedNext, MFF, etc.
  accountSize: string; // $50,000, $100,000, etc.
  phase: 'Phase 1' | 'Phase 2' | 'Funded Stage';
  mtVersion: 'MT4' | 'MT5';
  loginId: string;
  serverName: string;
  status: 'PENDING_SETUP' | 'IN_PROGRESS' | 'PASSED' | 'FAILED';
  currentProfitPercent: number;
  targetProfitPercent: number;
  currentDrawdownPercent: number;
  maxDrawdownLimitPercent: number;
  totalTrades: number;
  winRatePercent: number;
  botModel: string;
  passedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrategyBotEntity {
  id: string;
  userId: string;
  name: string;
  asset: string;
  timeframe: string;
  strategyPrompt: string;
  lotSize: number;
  stopLossPips: number;
  takeProfitPips: number;
  trailingStopPips: number;
  maxDailyTrades: number;
  status: 'ACTIVE' | 'PAUSED' | 'BACKTESTING';
  winRate: number;
  totalPnl: number;
  tradesCount: number;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChartAnalysisEntity {
  id: string;
  userId: string;
  symbol: string;
  timeframe: string;
  direction: 'BUY' | 'SELL' | 'NEUTRAL';
  entryPrice: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
  riskReward: string;
  confidence: number;
  setupType: string;
  analysisSummary: string;
  imageUrl?: string;
  createdAt: string;
}

export interface SupportTicketEntity {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: 'Billing' | 'Bot Execution' | 'PropPass' | 'Signals' | 'API & MT5' | 'Other';
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  replies: Array<{
    id: string;
    sender: 'user' | 'agent' | 'system';
    senderName: string;
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface JournalTradeEntity {
  id: string;
  userId: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  lotSize: number;
  entryPrice: number;
  exitPrice?: number;
  stopLoss: number;
  takeProfit: number;
  pnl?: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  notes: string;
  setupType?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  users: Record<string, UserEntity>;
  payments: Record<string, PaymentEntity>;
  proppass_accounts: Record<string, PropPassEntity>;
  strategies: Record<string, StrategyBotEntity>;
  chart_analyses: Record<string, ChartAnalysisEntity>;
  support_tickets: Record<string, SupportTicketEntity>;
  journal_trades: Record<string, JournalTradeEntity>;
  metadata: {
    version: string;
    lastSaved: string;
    totalRecords: number;
  };
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'pipnex_database.json');

// Password security helpers
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const currentSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, currentSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: currentSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = hashPassword(password, salt);
  return check.hash === hash;
}

// Initial Database Seeder
function createInitialDatabase(): DatabaseSchema {
  const defaultUserSalt = crypto.randomBytes(16).toString('hex');
  const defaultUserHash = hashPassword('Trader@2026!', defaultUserSalt).hash;

  const demoUserId = 'usr_demo_trader_001';

  return {
    users: {
      [demoUserId]: {
        id: demoUserId,
        email: 'trader@pipnex.ai',
        passwordHash: defaultUserHash,
        salt: defaultUserSalt,
        firstName: 'Alex',
        lastName: 'Vance',
        phone: '+254712345678',
        countryCode: '+254',
        plan: 'Pro',
        balance: 15450.00,
        isVerified: true,
        authProvider: 'email',
        mt5Connected: true,
        mt5AccountNumber: '8849201',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    payments: {
      'pay_init_001': {
        id: 'pay_init_001',
        userId: demoUserId,
        userEmail: 'trader@pipnex.ai',
        userName: 'Alex Vance',
        productId: 'pro',
        productName: 'Pro Bot Access',
        usdPrice: 95,
        exchangeRate: 130,
        kesAmount: 12350,
        paymentMethod: 'mpesa_automated',
        phoneNumber: '254712345678',
        mpesaReceiptNumber: 'QKB7492XLP',
        status: 'COMPLETED',
        statusMessage: 'Verified and confirmed via M-Pesa Daraja Gateway',
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        completedAt: new Date(Date.now() - 15 * 86400000).toISOString()
      }
    },
    proppass_accounts: {
      'prop_ftmo_100k_1': {
        id: 'prop_ftmo_100k_1',
        userId: demoUserId,
        clientName: 'Alex Vance',
        email: 'trader@pipnex.ai',
        phone: '+254712345678',
        firmName: 'FTMO',
        accountSize: '$100,000',
        phase: 'Phase 1',
        mtVersion: 'MT5',
        loginId: '10928471',
        serverName: 'FTMO-Server2',
        status: 'IN_PROGRESS',
        currentProfitPercent: 6.4,
        targetProfitPercent: 10.0,
        currentDrawdownPercent: 1.1,
        maxDrawdownLimitPercent: 5.0,
        totalTrades: 38,
        winRatePercent: 78.9,
        botModel: 'PipNex Institutional Straddle V4',
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      'prop_fundednext_50k': {
        id: 'prop_fundednext_50k',
        userId: demoUserId,
        clientName: 'Alex Vance',
        email: 'trader@pipnex.ai',
        phone: '+254712345678',
        firmName: 'FundedNext',
        accountSize: '$50,000',
        phase: 'Funded Stage',
        mtVersion: 'MT5',
        loginId: '5540192',
        serverName: 'FundedNext-Live',
        status: 'PASSED',
        currentProfitPercent: 12.8,
        targetProfitPercent: 8.0,
        currentDrawdownPercent: 0.8,
        maxDrawdownLimitPercent: 5.0,
        totalTrades: 74,
        winRatePercent: 83.2,
        botModel: 'PipNex Gold Scalper Algo',
        passedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    strategies: {
      'strat_gold_fvg': {
        id: 'strat_gold_fvg',
        userId: demoUserId,
        name: 'Gold Institutional FVG Algo',
        asset: 'XAU/USD',
        timeframe: 'M15',
        strategyPrompt: 'Buy Gold on 15m Fair Value Gap tap during London & NY overlap with 25 pip SL and 1:3 RR',
        lotSize: 0.25,
        stopLossPips: 25,
        takeProfitPips: 75,
        trailingStopPips: 15,
        maxDailyTrades: 4,
        status: 'ACTIVE',
        winRate: 81.5,
        totalPnl: 4820.50,
        tradesCount: 42,
        confidenceScore: 92,
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      'strat_eur_liquidity': {
        id: 'strat_eur_liquidity',
        userId: demoUserId,
        name: 'EURUSD Asian Low Sweep Hunter',
        asset: 'EUR/USD',
        timeframe: 'M5',
        strategyPrompt: 'Short EURUSD upon sweep of Asian session high with bearish engulfing confirmation on M15',
        lotSize: 0.50,
        stopLossPips: 15,
        takeProfitPips: 45,
        trailingStopPips: 10,
        maxDailyTrades: 3,
        status: 'ACTIVE',
        winRate: 76.2,
        totalPnl: 2940.00,
        tradesCount: 29,
        confidenceScore: 88,
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    chart_analyses: {
      'ana_sample_xau': {
        id: 'ana_sample_xau',
        userId: demoUserId,
        symbol: 'XAU/USD',
        timeframe: 'M15',
        direction: 'BUY',
        entryPrice: '2884.50',
        stopLoss: '2869.00',
        takeProfit1: '2905.00',
        takeProfit2: '2925.00',
        riskReward: '1:2.6',
        confidence: 94,
        setupType: 'Bullish Fair Value Gap Retest',
        analysisSummary: 'Confirmed bullish liquidity grab below London low with volume delta expansion above 20 EMA.',
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
      }
    },
    support_tickets: {
      'tkt_001': {
        id: 'tkt_001',
        userId: demoUserId,
        userEmail: 'trader@pipnex.ai',
        userName: 'Alex Vance',
        subject: 'MT5 Webhook Latency Check',
        category: 'API & MT5',
        message: 'Can I connect multiple MT5 terminals to the same PipNex webhook listener?',
        priority: 'MEDIUM',
        status: 'RESOLVED',
        replies: [
          {
            id: 'rep_1',
            sender: 'user',
            senderName: 'Alex Vance',
            text: 'Can I connect multiple MT5 terminals to the same PipNex webhook listener?',
            timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
          },
          {
            id: 'rep_2',
            sender: 'agent',
            senderName: 'PipNex Support Desk',
            text: 'Yes! Pro and Platinum tiers support up to 5 concurrent MetaTrader terminals using your unique Webhook Token.',
            timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    },
    journal_trades: {
      'jrn_001': {
        id: 'jrn_001',
        userId: demoUserId,
        symbol: 'XAU/USD',
        type: 'BUY',
        lotSize: 0.5,
        entryPrice: 2884.50,
        exitPrice: 2908.20,
        stopLoss: 2869.00,
        takeProfit: 2905.00,
        pnl: 1185.00,
        status: 'CLOSED',
        notes: 'Followed PipNex Pulse signal. Hit TP1 cleanly with zero drawdown.',
        setupType: 'Institutional FVG Retest',
        date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    },
    metadata: {
      version: '1.0.0',
      lastSaved: new Date().toISOString(),
      totalRecords: 8
    }
  };
}

class PersistentDatabase {
  private schema: DatabaseSchema;
  private isSaving = false;

  constructor() {
    this.ensureDirectory();
    this.schema = this.loadDatabase();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.users && parsed.proppass_accounts) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('[Database] Failed to read existing database file, rebuilding schema:', err);
    }

    const initial = createInitialDatabase();
    this.saveImmediate(initial);
    return initial;
  }

  private saveImmediate(data: DatabaseSchema) {
    try {
      this.ensureDirectory();
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      data.metadata.lastSaved = new Date().toISOString();
      let recordCount = 0;
      recordCount += Object.keys(data.users).length;
      recordCount += Object.keys(data.payments).length;
      recordCount += Object.keys(data.proppass_accounts).length;
      recordCount += Object.keys(data.strategies).length;
      recordCount += Object.keys(data.chart_analyses).length;
      recordCount += Object.keys(data.support_tickets).length;
      recordCount += Object.keys(data.journal_trades).length;
      data.metadata.totalRecords = recordCount;

      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('[Database] Error saving database atomically:', err);
    }
  }

  public save() {
    if (this.isSaving) return;
    this.isSaving = true;
    setTimeout(() => {
      this.saveImmediate(this.schema);
      this.isSaving = false;
    }, 50);
  }

  // ==========================================
  // USERS CRUD
  // ==========================================
  public createUser(user: Omit<UserEntity, 'createdAt' | 'updatedAt'>): UserEntity {
    const now = new Date().toISOString();
    const newUser: UserEntity = {
      ...user,
      createdAt: now,
      updatedAt: now
    };
    this.schema.users[newUser.id] = newUser;
    this.save();
    return newUser;
  }

  public getUserById(id: string): UserEntity | undefined {
    return this.schema.users[id];
  }

  public getUserByEmail(email: string): UserEntity | undefined {
    const norm = email.trim().toLowerCase();
    return Object.values(this.schema.users).find(u => u.email.toLowerCase() === norm);
  }

  public updateUser(id: string, updates: Partial<UserEntity>): UserEntity | undefined {
    const existing = this.schema.users[id];
    if (!existing) return undefined;

    const updated: UserEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.schema.users[id] = updated;
    this.save();
    return updated;
  }

  public deleteUser(id: string): boolean {
    if (this.schema.users[id]) {
      delete this.schema.users[id];
      this.save();
      return true;
    }
    return false;
  }

  public getAllUsers(): UserEntity[] {
    return Object.values(this.schema.users);
  }

  // ==========================================
  // PAYMENTS CRUD
  // ==========================================
  public createPayment(payment: PaymentEntity): PaymentEntity {
    this.schema.payments[payment.id] = payment;
    this.save();
    return payment;
  }

  public getPaymentById(id: string): PaymentEntity | undefined {
    return this.schema.payments[id];
  }

  public getPaymentsByUser(userEmail: string): PaymentEntity[] {
    const norm = userEmail.trim().toLowerCase();
    return Object.values(this.schema.payments)
      .filter(p => p.userEmail.toLowerCase() === norm)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAllPayments(): PaymentEntity[] {
    return Object.values(this.schema.payments)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public updatePayment(id: string, updates: Partial<PaymentEntity>): PaymentEntity | undefined {
    const existing = this.schema.payments[id];
    if (!existing) return undefined;

    const updated: PaymentEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.schema.payments[id] = updated;
    this.save();
    return updated;
  }

  public deletePayment(id: string): boolean {
    if (this.schema.payments[id]) {
      delete this.schema.payments[id];
      this.save();
      return true;
    }
    return false;
  }

  // ==========================================
  // PROPPASS ACCOUNTS CRUD
  // ==========================================
  public createPropPass(account: Omit<PropPassEntity, 'id' | 'createdAt' | 'updatedAt'>): PropPassEntity {
    const id = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newRecord: PropPassEntity = {
      id,
      ...account,
      createdAt: now,
      updatedAt: now
    };
    this.schema.proppass_accounts[id] = newRecord;
    this.save();
    return newRecord;
  }

  public getPropPassById(id: string): PropPassEntity | undefined {
    return this.schema.proppass_accounts[id];
  }

  public getPropPassByUser(emailOrUserId: string): PropPassEntity[] {
    const norm = emailOrUserId.trim().toLowerCase();
    return Object.values(this.schema.proppass_accounts)
      .filter(p => p.email.toLowerCase() === norm || p.userId === emailOrUserId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAllPropPass(): PropPassEntity[] {
    return Object.values(this.schema.proppass_accounts)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public updatePropPass(id: string, updates: Partial<PropPassEntity>): PropPassEntity | undefined {
    const existing = this.schema.proppass_accounts[id];
    if (!existing) return undefined;

    const updated: PropPassEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.schema.proppass_accounts[id] = updated;
    this.save();
    return updated;
  }

  public deletePropPass(id: string): boolean {
    if (this.schema.proppass_accounts[id]) {
      delete this.schema.proppass_accounts[id];
      this.save();
      return true;
    }
    return false;
  }

  // ==========================================
  // STRATEGIES & BOTS CRUD
  // ==========================================
  public createStrategy(strategy: Omit<StrategyBotEntity, 'id' | 'createdAt' | 'updatedAt'>): StrategyBotEntity {
    const id = `strat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newRecord: StrategyBotEntity = {
      id,
      ...strategy,
      createdAt: now,
      updatedAt: now
    };
    this.schema.strategies[id] = newRecord;
    this.save();
    return newRecord;
  }

  public getStrategiesByUser(userId: string): StrategyBotEntity[] {
    return Object.values(this.schema.strategies)
      .filter(s => s.userId === userId || userId === 'all')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getStrategyById(id: string): StrategyBotEntity | undefined {
    return this.schema.strategies[id];
  }

  public updateStrategy(id: string, updates: Partial<StrategyBotEntity>): StrategyBotEntity | undefined {
    const existing = this.schema.strategies[id];
    if (!existing) return undefined;

    const updated: StrategyBotEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.schema.strategies[id] = updated;
    this.save();
    return updated;
  }

  public deleteStrategy(id: string): boolean {
    if (this.schema.strategies[id]) {
      delete this.schema.strategies[id];
      this.save();
      return true;
    }
    return false;
  }

  // ==========================================
  // CHART ANALYSES CRUD
  // ==========================================
  public createChartAnalysis(analysis: Omit<ChartAnalysisEntity, 'id' | 'createdAt'>): ChartAnalysisEntity {
    const id = `ana_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newRecord: ChartAnalysisEntity = {
      id,
      ...analysis,
      createdAt: new Date().toISOString()
    };
    this.schema.chart_analyses[id] = newRecord;
    this.save();
    return newRecord;
  }

  public getChartAnalysesByUser(userId: string): ChartAnalysisEntity[] {
    return Object.values(this.schema.chart_analyses)
      .filter(a => a.userId === userId || userId === 'all')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public deleteChartAnalysis(id: string): boolean {
    if (this.schema.chart_analyses[id]) {
      delete this.schema.chart_analyses[id];
      this.save();
      return true;
    }
    return false;
  }

  // ==========================================
  // SUPPORT TICKETS CRUD
  // ==========================================
  public createSupportTicket(ticket: Omit<SupportTicketEntity, 'id' | 'createdAt' | 'updatedAt' | 'replies'>): SupportTicketEntity {
    const id = `tkt_${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();
    const newRecord: SupportTicketEntity = {
      id,
      ...ticket,
      replies: [
        {
          id: `rep_${Date.now()}`,
          sender: 'user',
          senderName: ticket.userName,
          text: ticket.message,
          timestamp: now
        }
      ],
      createdAt: now,
      updatedAt: now
    };
    this.schema.support_tickets[id] = newRecord;
    this.save();
    return newRecord;
  }

  public getSupportTicketsByUser(userEmailOrId: string): SupportTicketEntity[] {
    const norm = userEmailOrId.trim().toLowerCase();
    return Object.values(this.schema.support_tickets)
      .filter(t => t.userEmail.toLowerCase() === norm || t.userId === userEmailOrId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAllSupportTickets(): SupportTicketEntity[] {
    return Object.values(this.schema.support_tickets)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addTicketReply(ticketId: string, reply: { sender: 'user' | 'agent'; senderName: string; text: string }): SupportTicketEntity | undefined {
    const existing = this.schema.support_tickets[ticketId];
    if (!existing) return undefined;

    const newReply = {
      id: `rep_${Date.now()}`,
      ...reply,
      timestamp: new Date().toISOString()
    };

    existing.replies.push(newReply);
    existing.updatedAt = new Date().toISOString();
    this.save();
    return existing;
  }

  public updateSupportTicket(id: string, updates: Partial<SupportTicketEntity>): SupportTicketEntity | undefined {
    const existing = this.schema.support_tickets[id];
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.schema.support_tickets[id] = updated;
    this.save();
    return updated;
  }

  // ==========================================
  // TRADING JOURNAL CRUD
  // ==========================================
  public createJournalTrade(trade: Omit<JournalTradeEntity, 'id' | 'createdAt' | 'updatedAt'>): JournalTradeEntity {
    const id = `jrn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newRecord: JournalTradeEntity = {
      id,
      ...trade,
      createdAt: now,
      updatedAt: now
    };
    this.schema.journal_trades[id] = newRecord;
    this.save();
    return newRecord;
  }

  public getJournalTradesByUser(userId: string): JournalTradeEntity[] {
    return Object.values(this.schema.journal_trades)
      .filter(t => t.userId === userId || userId === 'all')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public updateJournalTrade(id: string, updates: Partial<JournalTradeEntity>): JournalTradeEntity | undefined {
    const existing = this.schema.journal_trades[id];
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.schema.journal_trades[id] = updated;
    this.save();
    return updated;
  }

  public deleteJournalTrade(id: string): boolean {
    if (this.schema.journal_trades[id]) {
      delete this.schema.journal_trades[id];
      this.save();
      return true;
    }
    return false;
  }
}

export const db = new PersistentDatabase();
