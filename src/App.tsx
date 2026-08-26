/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PipNexAuthCard } from './components/PipNexAuthCard';
import { ForexTicker } from './components/ForexTicker';
import { BotDashboard } from './components/BotDashboard';
import { LandingPage } from './components/LandingPage';
import { UpgradePlanModal } from './components/UpgradePlanModal';
import { UserProfile } from './types';
import { X } from 'lucide-react';
import { getActiveSession, logoutUser, saveActiveSession, loginUser } from './lib/authService';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return getActiveSession();
  });

  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>(() => {
    return getActiveSession() ? 'dashboard' : 'landing';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeTier, setUpgradeTier] = useState<'Starter' | 'Pro' | 'Elite'>('Pro');

  useEffect(() => {
    document.body.classList.remove('light');
    document.documentElement.classList.remove('light');
    document.body.classList.add('dark');
    document.documentElement.classList.add('dark');
  }, []);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const nextUser = { ...prev, ...updated };
      saveActiveSession(nextUser);
      return nextUser;
    });
  };

  const handleOpenSignIn = () => {
    setAuthModalMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignUp = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleStartTrading = () => {
    if (currentUser) {
      setCurrentView('dashboard');
    } else {
      setAuthModalMode('signup');
      setIsAuthModalOpen(true);
    }
  };

  const handleOpenUpgradeFromLanding = (tier: 'Starter' | 'Pro' | 'Elite' = 'Pro') => {
    setUpgradeTier(tier);
    setIsUpgradeModalOpen(true);
  };

  const handleUpgradeSuccess = (tier: any) => {
    if (currentUser) {
      handleUpdateUser({ plan: tier });
    } else {
      // If guest upgrades, open login to complete activation
      setAuthModalMode('signup');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060b] text-gray-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
      {/* Top Forex Live Ticker */}
      <ForexTicker />

      {/* Main View Router */}
      {currentView === 'dashboard' && currentUser ? (
        <BotDashboard
          user={currentUser}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      ) : (
        <LandingPage
          user={currentUser}
          onStartTrading={handleStartTrading}
          onOpenSignIn={handleOpenSignIn}
          onOpenSignUp={handleOpenSignUp}
          onOpenUpgrade={handleOpenUpgradeFromLanding}
        />
      )}

      {/* Auth Modal for Guests */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-md my-auto py-6 sm:py-8">
            <button
              id="close-auth-modal-btn"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute -top-3 right-0 sm:-top-10 sm:right-0 p-2 rounded-xl bg-[#141624] border border-[#23273e] text-gray-400 hover:text-white hover:bg-[#1a1e30] transition-colors cursor-pointer z-30 shadow-lg"
              title="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <PipNexAuthCard
              initialMode={authModalMode}
              onSuccessAuth={(profile) => {
                setCurrentUser(profile);
                setIsAuthModalOpen(false);
                setCurrentView('dashboard');
              }}
            />
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        defaultTier={upgradeTier}
        user={currentUser}
        onUpgradeSuccess={handleUpgradeSuccess}
      />
    </div>
  );
}
