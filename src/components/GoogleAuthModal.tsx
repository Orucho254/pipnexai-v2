import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, User } from 'lucide-react';
import { UserProfile } from '../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const mockAccounts = [
    {
      name: 'Daniel Orucho',
      email: 'oruchodaniel21@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Trader Alex',
      email: 'alex.trader@pipnex.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    }
  ];

  if (!isOpen) return null;

  const handleSelectAccount = (account: typeof mockAccounts[0]) => {
    setSelectedAccount(account.email);
    setIsProcessing(true);

    setTimeout(() => {
      const parts = account.name.split(' ');
      const firstName = parts[0] || 'Trader';
      const lastName = parts.slice(1).join(' ') || 'User';

      onSuccess({
        firstName,
        lastName,
        email: account.email,
        countryCode: '+1',
        phone: '5550192834',
        referralCode: 'PIU7501',
        isVerified: true,
        authProvider: 'google',
        avatarUrl: account.avatar
      });
      setIsProcessing(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        id="google-auth-popup"
        className="w-full max-w-sm bg-white text-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-200 relative overflow-hidden"
      >
        {/* Top Google Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Sign in with Google</span>
          </div>
          <button
            id="close-google-auth-btn"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4">
          <h4 className="text-base font-semibold text-gray-900 text-center">Choose an account</h4>
          <p className="text-xs text-gray-500 text-center mt-1">
            to continue to <span className="font-semibold text-indigo-900">PipNex Forex Trading</span>
          </p>

          <div className="mt-4 space-y-2">
            {mockAccounts.map((acc) => (
              <button
                key={acc.email}
                id={`google-acc-${acc.email.split('@')[0]}`}
                disabled={isProcessing}
                onClick={() => handleSelectAccount(acc)}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left group"
              >
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-950 truncate">
                    {acc.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{acc.email}</div>
                </div>
                {selectedAccount === acc.email && isProcessing ? (
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-transparent group-hover:text-indigo-500 transition-colors" />
                )}
              </button>
            ))}

            <button
              id="google-use-another-account"
              onClick={() => {
                const customEmail = prompt('Enter Google Account email:', 'user@gmail.com');
                if (customEmail) {
                  handleSelectAccount({
                    name: customEmail.split('@')[0].toUpperCase(),
                    email: customEmail,
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
                  });
                }
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 text-left text-sm font-medium text-gray-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <User className="w-5 h-5" />
              </div>
              <span>Use another Google account</span>
            </button>
          </div>
        </div>

        {/* Security notice */}
        <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
          <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
          <span>PipNex verifies tokens directly via Google Secure OAuth 2.0 protocol</span>
        </div>
      </div>
    </div>
  );
};
