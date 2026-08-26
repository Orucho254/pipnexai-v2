import fs from 'fs';
import path from 'path';

export type PaymentMethod = 'mpesa_automated' | 'mpesa_manual' | 'binance_usdt';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';

export interface ProductPlan {
  id: string;
  name: string;
  usdPrice: number;
  billing: string;
  subtitle: string;
  badge?: string;
  highlighted?: boolean;
  color?: string;
  features: string[];
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  productId: string;
  productName: string;
  usdPrice: number;
  exchangeRate: number;
  kesAmount: number;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  merchantRequestId?: string;
  checkoutRequestId?: string;
  mpesaReceiptNumber?: string;
  transactionHash?: string;
  binanceId?: string;
  smsMessage?: string;
  notes?: string;
  status: PaymentStatus;
  statusMessage?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// ==========================================
// SERVER-SIDE PRODUCT CATALOGUE (SOURCE OF TRUTH)
// ==========================================
export const PRODUCTS_CATALOGUE: Record<string, ProductPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    usdPrice: 45,
    billing: '/ ½ month',
    subtitle: 'Perfect for getting started',
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
  pro: {
    id: 'pro',
    name: 'Pro',
    usdPrice: 95,
    billing: '/ month',
    subtitle: 'For serious traders',
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
  elite: {
    id: 'elite',
    name: 'Elite',
    usdPrice: 195,
    billing: '/ 3 months',
    subtitle: 'Maximum performance',
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
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum VIP',
    usdPrice: 349,
    billing: '/ 6 months',
    subtitle: 'Institutional grade trading',
    badge: 'INSTITUTIONAL',
    highlighted: false,
    features: [
      'All Elite Plan Features',
      'Dedicated Straddle AI Bot Engine',
      'Institutional Liquidity Heatmaps',
      'High-Frequency News Execution',
      'Direct 1-on-1 Trading Desk Access'
    ]
  },
  ultimate: {
    id: 'ultimate',
    name: 'Ultimate Lifetime',
    usdPrice: 599,
    billing: 'one-time',
    subtitle: 'Unlimited lifetime access',
    badge: 'LIFETIME ACCESS',
    highlighted: false,
    features: [
      'Lifetime Access to all future updates',
      'Unlimited Cloud Bots & VPS',
      'Institutional AI Alpha Models',
      'VIP Mastermind Access'
    ]
  }
};

export function getProduct(productId: string): ProductPlan | undefined {
  if (!productId) return undefined;
  const key = productId.trim().toLowerCase();
  if (PRODUCTS_CATALOGUE[key]) return PRODUCTS_CATALOGUE[key];

  // Try matching by name
  for (const prod of Object.values(PRODUCTS_CATALOGUE)) {
    if (prod.name.toLowerCase() === key || prod.id.toLowerCase() === key) {
      return prod;
    }
  }
  return undefined;
}

// ==========================================
// CONFIGURATION & EXCHANGE RATE
// ==========================================
export function getExchangeRate(): number {
  const envRate = process.env.USD_KES_RATE;
  if (envRate && !isNaN(Number(envRate))) {
    return Number(envRate);
  }
  return 129; // default USD/KES rate
}

export function calculateKesAmount(usdPrice: number): number {
  const rate = getExchangeRate();
  return Math.round(usdPrice * rate);
}

export function getPaymentConfig() {
  return {
    exchangeRate: getExchangeRate(),
    mpesa: {
      tillNumber: process.env.MPESA_TILL_NUMBER || '372203',
      businessName: process.env.MPESA_BUSINESS_NAME || 'Peak Markets Till',
      paybillNumber: process.env.MPESA_PAYBILL_NUMBER || '',
      accountName: process.env.MPESA_ACCOUNT_NAME || ''
    },
    binance: {
      binanceId: process.env.BINANCE_ID || '1067841957',
      walletAddress: process.env.BINANCE_WALLET_ADDRESS || 'TVvYRDdPyQCCg22onuaau56rS5PNP3Gx7s',
      walletProvider: process.env.BINANCE_WALLET_PROVIDER || 'OKX USDT (TRC20)',
      network: process.env.BINANCE_NETWORK || 'USDT (TRC20)',
      minDeposit: process.env.BINANCE_MIN_DEPOSIT || '10 USDT'
    },
    stkPushConfigured: Boolean(
      process.env.MPESA_CONSUMER_KEY && 
      process.env.MPESA_CONSUMER_SECRET && 
      process.env.MPESA_PASSKEY
    ),
    isSimulationMode: !Boolean(
      process.env.MPESA_CONSUMER_KEY && 
      process.env.MPESA_CONSUMER_SECRET
    )
  };
}

// ==========================================
// PERSISTENT PAYMENT DATABASE (DURABLE STORE)
// ==========================================
const DATA_DIR = path.join(process.cwd(), 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');

let paymentsStore: Map<string, PaymentRecord> = new Map();

function initPaymentsStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(PAYMENTS_FILE)) {
      const raw = fs.readFileSync(PAYMENTS_FILE, 'utf-8');
      const parsed: PaymentRecord[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        paymentsStore = new Map(parsed.map((p) => [p.id, p]));
      }
    }
  } catch (err) {
    console.error('[Payments Engine] Error initializing storage:', err);
  }
}

function savePaymentsToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const list = Array.from(paymentsStore.values());
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Payments Engine] Error persisting payments to disk:', err);
  }
}

// Initialize immediately
initPaymentsStorage();

export function createPaymentRecord(record: PaymentRecord): PaymentRecord {
  paymentsStore.set(record.id, record);
  savePaymentsToDisk();
  return record;
}

export function getPaymentRecord(id: string): PaymentRecord | undefined {
  return paymentsStore.get(id);
}

export function updatePaymentRecord(id: string, updates: Partial<PaymentRecord>): PaymentRecord | undefined {
  const existing = paymentsStore.get(id);
  if (!existing) return undefined;

  const updated: PaymentRecord = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  paymentsStore.set(id, updated);
  savePaymentsToDisk();
  return updated;
}

export function getAllPayments(): PaymentRecord[] {
  return Array.from(paymentsStore.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPaymentsByUser(userEmail: string): PaymentRecord[] {
  const normalized = userEmail.trim().toLowerCase();
  return getAllPayments().filter(
    (p) => p.userEmail.toLowerCase() === normalized
  );
}

// ==========================================
// M-PESA DARAJA & HEROPAY GATEWAY INTEGRATION
// ==========================================

/**
 * Normalizes and validates Kenyan phone numbers for M-Pesa STK Push
 * Handles: 07XX..., 01XX..., +254..., 254...
 * Returns normalized 2547XXXXXXXX or 2541XXXXXXXX format
 */
export function normalizeMpesaPhone(phone: string): { normalized: string; isValid: boolean; error?: string } {
  if (!phone || typeof phone !== 'string') {
    return { normalized: '', isValid: false, error: 'Phone number is required' };
  }

  // Strip all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    // already starts with 254
  } else if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    cleaned = '254' + cleaned;
  }

  // Validate format: must be 2547XXXXXXXX or 2541XXXXXXXX (12 digits)
  const isValid = /^2547[0-9]{8}$/.test(cleaned) || /^2541[0-9]{8}$/.test(cleaned);

  if (!isValid) {
    return {
      normalized: cleaned,
      isValid: false,
      error: 'Invalid M-Pesa number. Please enter a valid 07XX or 01XX Safaricom number.'
    };
  }

  return { normalized: cleaned, isValid: true };
}

// Backward-compatible alias
export function formatMpesaPhoneNumber(phone: string): string {
  const { normalized } = normalizeMpesaPhone(phone);
  return normalized || phone.replace(/\D/g, '');
}

/**
 * Generates unique traceable payment reference
 */
export function generatePaymentReference(prefix = 'PIPNEX'): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${dateStr}-${randomStr}`;
}

/**
 * Checks for recent duplicate pending payments to prevent duplicate STK Push requests
 */
export function checkRecentDuplicatePayment(phone: string, windowSeconds = 20): PaymentRecord | undefined {
  const normalizedPhone = formatMpesaPhoneNumber(phone);
  const now = Date.now();
  const cutoff = now - windowSeconds * 1000;

  for (const record of paymentsStore.values()) {
    if (
      record.paymentMethod === 'mpesa_automated' &&
      record.phoneNumber === normalizedPhone &&
      (record.status === 'PENDING' || record.status === 'PROCESSING') &&
      new Date(record.createdAt).getTime() > cutoff
    ) {
      return record;
    }
  }
  return undefined;
}

/**
 * Executes STK Push via HeroPay API or Safaricom Daraja API
 */
export async function initiateMpesaStkPushGateway(params: {
  paymentId: string;
  phoneNumber: string;
  amount: number;
  productName: string;
  accountReference: string;
  userId?: string;
  userEmail?: string;
}): Promise<{
  success: boolean;
  merchantRequestId?: string;
  checkoutRequestId?: string;
  responseDescription?: string;
  gateway?: 'heropay' | 'daraja' | 'simulation';
  error?: string;
}> {
  const { normalized, isValid, error } = normalizeMpesaPhone(params.phoneNumber);
  if (!isValid) {
    return { success: false, error: error || 'Invalid M-Pesa phone number.' };
  }

  if (params.amount < 10) {
    return { success: false, error: 'Minimum deposit amount is KES 10' };
  }

  const appUrl = process.env.APP_URL || 'https://api.pipnex.ai';
  const callbackUrl = process.env.MPESA_CALLBACK_URL || `${appUrl}/api/payments/mpesa/callback`;

  // -------------------------------------------------------------
  // GATEWAY 1: HEROPAY COLLECTIONS API (If configured)
  // -------------------------------------------------------------
  const heroChannelId = process.env.HEROPAY_CHANNEL_ID;
  const heroAccountId = process.env.HEROPAY_ACCOUNT_ID;
  const heroApiKey = process.env.HEROPAY_API_KEY;
  const heroBaseUrl = process.env.HEROPAY_BASE_URL || 'https://api.heropay.co.ke';

  if (heroChannelId && heroAccountId) {
    try {
      console.log(`[HeroPay STK Push] Sending request for KES ${params.amount} to ${normalized}`);
      const heroPayload = {
        channel_id: heroChannelId,
        account_id: heroAccountId,
        phone_number: normalized,
        amount: params.amount,
        reference: params.accountReference,
        description: `PipNex AI ${params.productName.substring(0, 15)}`,
        callback_url: callbackUrl
      };

      const heroHeaders: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (heroApiKey) {
        heroHeaders['Authorization'] = `Bearer ${heroApiKey}`;
      }

      const response = await fetch(`${heroBaseUrl}/v1/collections/requests`, {
        method: 'POST',
        headers: heroHeaders,
        body: JSON.stringify(heroPayload)
      });

      const data = await response.json();
      const httpCode = response.status;
      const checkoutId = data.checkout_request_id || data.data?.checkout_request_id || data.id || data.reference;

      if ([200, 201].includes(httpCode) && checkoutId) {
        return {
          success: true,
          merchantRequestId: data.merchant_request_id || params.accountReference,
          checkoutRequestId: checkoutId,
          responseDescription: data.message || 'STK push prompt sent successfully.',
          gateway: 'heropay'
        };
      } else {
        const errorMsg = data.message || data.error || data.errorMessage || 'HeroPay STK Push dispatch failed';
        console.warn('[HeroPay API Error Response]:', data);
        return {
          success: false,
          error: errorMsg,
          gateway: 'heropay'
        };
      }
    } catch (heroErr: any) {
      console.error('[HeroPay Gateway Exception]:', heroErr);
      // Fall through to try Daraja or Simulation
    }
  }

  // -------------------------------------------------------------
  // GATEWAY 2: SAFARICOM DARAJA DIRECT API (If configured)
  // -------------------------------------------------------------
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const passkey = process.env.MPESA_PASSKEY;
  const shortcode = process.env.MPESA_SHORTCODE || '174379';
  const environment = process.env.MPESA_ENVIRONMENT || 'sandbox';

  if (consumerKey && consumerSecret && passkey) {
    try {
      const baseUrl = environment === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';

      // 1. Get OAuth token
      const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: { Authorization: `Basic ${authHeader}` }
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        throw new Error('Failed to acquire M-Pesa OAuth access token');
      }

      // 2. Generate Timestamp & Password
      const date = new Date();
      const timestamp = date.getFullYear().toString() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

      // 3. Initiate STK Push
      const stkPayload = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: params.amount,
        PartyA: normalized,
        PartyB: shortcode,
        PhoneNumber: normalized,
        CallBackURL: callbackUrl,
        AccountReference: params.accountReference.substring(0, 12),
        TransactionDesc: `PipNex ${params.productName.substring(0, 10)}`
      };

      const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stkPayload)
      });

      const stkData = await stkRes.json();
      if (stkData.ResponseCode === '0') {
        return {
          success: true,
          merchantRequestId: stkData.MerchantRequestID,
          checkoutRequestId: stkData.CheckoutRequestID,
          responseDescription: stkData.ResponseDescription || 'Success. Request accepted for processing',
          gateway: 'daraja'
        };
      } else {
        return {
          success: false,
          error: stkData.ResponseDescription || stkData.errorMessage || 'M-Pesa STK Push rejected',
          gateway: 'daraja'
        };
      }
    } catch (err: any) {
      console.error('[M-Pesa Daraja Gateway Error]:', err);
      return {
        success: false,
        error: err.message || 'M-Pesa Gateway Connection Failed',
        gateway: 'daraja'
      };
    }
  }

  // -------------------------------------------------------------
  // GATEWAY 3: SANDBOX / SIMULATION DISPATCHER
  // -------------------------------------------------------------
  const mockMerchantId = `MR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const mockCheckoutId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  return {
    success: true,
    merchantRequestId: mockMerchantId,
    checkoutRequestId: mockCheckoutId,
    responseDescription: 'Success. Request accepted for processing (STK prompt dispatched).',
    gateway: 'simulation'
  };
}

// Backward-compatible alias
export const initiateDarajaStkPush = initiateMpesaStkPushGateway;

