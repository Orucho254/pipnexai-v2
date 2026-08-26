import { UserProfile } from '../types';

export interface RegisteredAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  referralCode?: string;
  createdAt: string;
  plan: 'Free Trial' | 'Pro' | 'Platinum' | 'Ultimate';
  isVerified: boolean;
  authProvider: 'email' | 'google';
  mt5Connected?: boolean;
}

export interface PasswordValidationResult {
  isStrong: boolean;
  score: number; // 0 to 5
  strengthLabel: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  checks: {
    minLength: boolean;      // >= 8 chars
    hasUpper: boolean;       // A-Z
    hasLower: boolean;       // a-z
    hasNumber: boolean;      // 0-9
    hasSpecial: boolean;     // symbols
  };
  feedback: string[];
}

const USERS_STORAGE_KEY = 'pipnex_users_db_v1';
const SESSION_STORAGE_KEY = 'pipnex_active_session_v1';
const LAST_EMAIL_STORAGE_KEY = 'pipnex_last_email_v1';

// Initial accounts array (empty by default)
const INITIAL_ACCOUNTS: RegisteredAccount[] = [];

export function getLastUsedEmail(): string {
  try {
    return localStorage.getItem(LAST_EMAIL_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setLastUsedEmail(email: string): void {
  try {
    localStorage.setItem(LAST_EMAIL_STORAGE_KEY, email.trim().toLowerCase());
  } catch {
    // ignore
  }
}

// Helper to evaluate password strength in real time
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const checks = {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial
  };

  let score = 0;
  if (minLength) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  const feedback: string[] = [];
  if (!minLength) feedback.push('At least 8 characters required');
  if (!hasUpper) feedback.push('Add an uppercase letter (A-Z)');
  if (!hasLower) feedback.push('Add a lowercase letter (a-z)');
  if (!hasNumber) feedback.push('Add at least one number (0-9)');
  if (!hasSpecial) feedback.push('Add a special character (!@#$%^&*)');

  let strengthLabel: PasswordValidationResult['strengthLabel'] = 'Very Weak';
  if (score <= 1) strengthLabel = 'Very Weak';
  else if (score === 2) strengthLabel = 'Weak';
  else if (score === 3 || score === 4) strengthLabel = 'Medium';
  else if (score === 5 && password.length >= 10) strengthLabel = 'Very Strong';
  else if (score === 5) strengthLabel = 'Strong';

  // Strict Strong Requirement: Must pass all 5 checks
  const isStrong = minLength && hasUpper && hasLower && hasNumber && hasSpecial;

  return {
    isStrong,
    score,
    strengthLabel,
    checks,
    feedback
  };
}

// Retrieve registered users from localStorage
export function getRegisteredUsers(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_ACCOUNTS;
  } catch (err) {
    console.error('Failed to read users database from localStorage:', err);
    return INITIAL_ACCOUNTS;
  }
}

// Find user by email
export function findUserByEmail(email: string): RegisteredAccount | undefined {
  const normalized = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  return users.find((u) => u.email.toLowerCase() === normalized);
}

// Register a brand new user via API and cache
export async function registerUserAsync(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  referralCode?: string;
}): Promise<UserProfile> {
  const normalizedEmail = data.email.trim().toLowerCase();

  // Strict Strong Password Requirement
  const passwordValidation = validatePasswordStrength(data.password);
  if (!passwordValidation.isStrong) {
    throw new Error(
      `Password is not strong enough. It must be at least 8 characters long and contain uppercase (A-Z), lowercase (a-z), a number (0-9), and a special character.`
    );
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: normalizedEmail,
        phone: data.phone.trim(),
        countryCode: data.countryCode,
        password: data.password,
        referralCode: data.referralCode
      })
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      throw new Error(resData.error || 'Failed to create account');
    }

    const profile: UserProfile = {
      firstName: resData.user.firstName,
      lastName: resData.user.lastName,
      email: resData.user.email,
      countryCode: resData.user.countryCode,
      phone: resData.user.phone,
      referralCode: data.referralCode,
      isVerified: true,
      authProvider: 'email',
      plan: resData.user.plan || 'Free Trial',
      mt5Connected: resData.user.mt5Connected || false
    };

    saveActiveSession(profile);
    setLastUsedEmail(profile.email);
    return profile;
  } catch (err: any) {
    // If backend is unreachable, fallback to localStorage register
    return registerUser(data);
  }
}

// Authenticate existing user via API and cache
export async function loginUserAsync(email: string, password: string): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password })
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      throw new Error(resData.error || 'Invalid credentials');
    }

    const profile: UserProfile = {
      firstName: resData.user.firstName,
      lastName: resData.user.lastName,
      email: resData.user.email,
      countryCode: resData.user.countryCode,
      phone: resData.user.phone,
      isVerified: true,
      authProvider: 'email',
      plan: resData.user.plan || 'Free Trial',
      mt5Connected: resData.user.mt5Connected || false
    };

    saveActiveSession(profile);
    setLastUsedEmail(profile.email);
    return profile;
  } catch (err: any) {
    // If API error is credential failure, throw immediately
    if (err.message && (err.message.includes('Invalid') || err.message.includes('password') || err.message.includes('No account'))) {
      throw err;
    }
    // Fallback to local session check
    return loginUser(email, password);
  }
}

// Register a brand new user (synchronous backup)
export function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  referralCode?: string;
}): UserProfile {
  const normalizedEmail = data.email.trim().toLowerCase();

  // 1. Email format check
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Please provide a valid email address.');
  }

  // 2. Names check
  if (!data.firstName.trim() || !data.lastName.trim()) {
    throw new Error('Please provide both your first name and last name.');
  }

  // 3. Duplicate email check
  const existing = findUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists. Please switch to Sign In.');
  }

  // 4. Strict Strong Password Requirement
  const passwordValidation = validatePasswordStrength(data.password);
  if (!passwordValidation.isStrong) {
    throw new Error(
      `Password is not strong enough. It must be at least 8 characters long and contain uppercase (A-Z), lowercase (a-z), a number (0-9), and a special character.`
    );
  }

  // 5. Create new account record
  const newAccount: RegisteredAccount = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: normalizedEmail,
    phone: data.phone.trim(),
    countryCode: data.countryCode,
    password: data.password, // Stored for exact credential matching
    referralCode: data.referralCode?.trim() || undefined,
    createdAt: new Date().toISOString(),
    plan: 'Free Trial',
    isVerified: true,
    authProvider: 'email',
    mt5Connected: false
  };

  const users = getRegisteredUsers();
  users.push(newAccount);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  // Convert to public UserProfile
  const profile: UserProfile = {
    firstName: newAccount.firstName,
    lastName: newAccount.lastName,
    email: newAccount.email,
    countryCode: newAccount.countryCode,
    phone: newAccount.phone,
    referralCode: newAccount.referralCode,
    isVerified: newAccount.isVerified,
    authProvider: newAccount.authProvider,
    plan: newAccount.plan,
    mt5Connected: newAccount.mt5Connected
  };

  saveActiveSession(profile);
  setLastUsedEmail(newAccount.email);
  return profile;
}

// Authenticate existing user with exact credentials
export function loginUser(email: string, password: string): UserProfile {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error('Please enter your registered email address.');
  }

  if (!password) {
    throw new Error('Please enter your password.');
  }

  const user = findUserByEmail(normalizedEmail);

  // If user does not exist in registered database
  if (!user) {
    throw new Error('No account found with this email. Please sign up first to create an account.');
  }

  // If password does not match
  if (user.password !== password) {
    throw new Error('Incorrect password. Please verify your credentials and try again.');
  }

  // Successful login
  const profile: UserProfile = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    countryCode: user.countryCode,
    phone: user.phone,
    referralCode: user.referralCode,
    isVerified: user.isVerified,
    authProvider: user.authProvider,
    plan: user.plan,
    mt5Connected: user.mt5Connected
  };

  saveActiveSession(profile);
  setLastUsedEmail(user.email);
  return profile;
}

// Active session storage
export function saveActiveSession(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to save active session:', err);
  }
}

export function getActiveSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read active session:', err);
    return null;
  }
}

export function logoutUser(): void {
  saveActiveSession(null);
}
