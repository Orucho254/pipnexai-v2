import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  Zap,
  MessageSquare, 
  UploadCloud, 
  Layers, 
  Radio, 
  Crown, 
  BookOpen, 
  Headphones, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ChevronDown, 
  ChevronRight,
  User, 
  ShieldCheck, 
  Calculator, 
  Shield, 
  Sun, 
  Moon, 
  BarChart2,
  CreditCard,
  Link2,
  Diamond,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, MacroEvent } from '../types';
import { ForexTicker } from './ForexTicker';
import { OverviewView } from './views/OverviewView';
import { PromptTradingView } from './views/PromptTradingView';
import { AutoTradingView } from './views/AutoTradingView';
import { AITradingView } from './views/AITradingView';
import { UploadChartView } from './views/UploadChartView';
import { ManageBotsView } from './views/ManageBotsView';
import { PulseSignalsView } from './views/PulseSignalsView';
import { PositionCalculatorView } from './views/PositionCalculatorView';
import { PropPassView } from './views/PropPassView';
import { QuickAccessTools } from './views/QuickAccessToolsView';
import { SubscriptionView } from './views/SubscriptionView';
import { HowToUseView } from './views/HowToUseView';
import { ContactSupportView } from './views/ContactSupportView';
import { SettingsView } from './views/SettingsView';
import { TrishAssistantModal } from './TrishAssistantModal';
import { MacroAnalysisModal } from './MacroAnalysisModal';
import { UpgradePlanModal } from './UpgradePlanModal';
import { MT5ConnectionModal } from './MT5ConnectionModal';
import { MyProfileModal } from './MyProfileModal';

interface BotDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const BotDashboard: React.FC<BotDashboardProps> = ({
  user,
  onLogout,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMT5ModalOpen, setIsMT5ModalOpen] = useState(false);

  // Theme Management (Default: Dark Mode)
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'auto'>('dark');

  useEffect(() => {
    const isLight = themeMode === 'light';
    if (isLight) {
      document.body.classList.add('light');
      document.documentElement.classList.add('light');
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    } else {
      document.body.classList.remove('light');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    }
  }, [themeMode]);

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Modals state
  const [isTrishOpen, setIsTrishOpen] = useState(false);
  const [selectedMacroEvent, setSelectedMacroEvent] = useState<MacroEvent | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeDefaultTier, setUpgradeDefaultTier] = useState<any>('Pro');

  const handleOpenUpgrade = (tier: any = 'Pro') => {
    setUpgradeDefaultTier(tier);
    setIsUpgradeModalOpen(true);
  };

  const handleUpgradeSuccess = (newPlan: any) => {
    onUpdateUser({ plan: newPlan });
  };

  // Sidebar navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'quick-start', label: 'Quick Start', icon: Zap },
    { id: 'prompt-trading', label: 'Prompt Chart', icon: MessageSquare },
    { id: 'auto-trading', label: 'Auto Trading', icon: Zap },
    { id: 'ai-trading', label: 'AI Trading', icon: BarChart2 },
    { id: 'upload-chart', label: 'Upload Chart', icon: UploadCloud },
    { id: 'position-calculator', label: 'Position Size Calc', icon: Calculator },
    { id: 'proppass', label: 'PropPass', icon: Shield },
    { id: 'manage-bots', label: 'Manage Bots', icon: Layers, dotColor: 'bg-[#a855f7]' },
    { id: 'pulse-signals', label: 'Pulse Signals', icon: Radio, dotColor: 'bg-[#10b981]' },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'how-to-use', label: 'How to Use', icon: BookOpen },
    { id: 'contact-support', label: 'Contact Support', icon: Headphones },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Secondary Horizontal Navigation items
  const topNavPills = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'quick-start', label: 'Quick Start', icon: Zap },
    { id: 'prompt-trading', label: 'Prompt Chart', icon: MessageSquare },
    { id: 'auto-trading', label: 'Auto Trading', icon: Zap },
    { id: 'ai-trading', label: 'AI Trading', icon: BarChart2 },
    { id: 'upload-chart', label: 'Upload Chart', icon: UploadCloud },
    { id: 'position-calculator', label: 'Position Calc', icon: Calculator },
    { id: 'proppass', label: 'PropPass', icon: Shield },
    { id: 'manage-bots', label: 'Manage Bots', icon: Layers },
    { id: 'pulse-signals', label: 'Pulse Signals', icon: Radio },
    { id: 'subscription', label: 'Subscription', icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-[#07080d] text-gray-100 flex flex-col font-sans selection:bg-purple-600/30 relative">
      {/* Top Floating Ticker */}
      <ForexTicker />

      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Desktop) - PERSISTENT & INTACT */}
        <aside className="hidden lg:flex w-64 flex-col bg-[#090a10] border-r border-[#151724] p-4 shrink-0 justify-between">
          <div>
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5 px-3 py-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#141624] border border-[#272c44] flex items-center justify-center text-purple-400 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white font-mono">pipnex</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#161828] text-purple-300 font-mono border border-[#25293d]">BOT</span>
              </div>
            </div>

            {/* Navigation List */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || 
                  (item.id === 'quick-start' && activeTab === 'quick-access') ||
                  (item.id === 'prompt-trading' && activeTab === 'prompt-chart');

                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-semibold tracking-normal transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-[#121422] text-white border border-[#24283e] shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-[#10121d] border border-transparent hover:border-[#1c1f30]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-[#141624] border border-[#272c44] flex items-center justify-center text-purple-400 shrink-0 group-hover:border-purple-500/40 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-white font-semibold">{item.label}</span>
                    </div>

                    {item.dotColor && (
                      <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor} shrink-0 shadow-sm`} />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Account Snippet at Bottom */}
          <div className="pt-4 border-t border-[#151724] mt-4">
            <div className="p-3 rounded-2xl bg-[#0d0e17] border border-[#1a1d2d] flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-[#151828] border border-[#262a3f] flex items-center justify-center font-bold text-white text-xs shrink-0">
                  {user.firstName[0] || 'U'}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[10px] text-purple-300 font-mono truncate">
                    {user.plan || 'Free Trial'}
                  </div>
                </div>
              </div>

              <button
                id="sidebar-logout-btn"
                onClick={onLogout}
                title="Sign out"
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-[#161826] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-[#090a10] border-r border-[#151724] p-4 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center justify-between px-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#141624] border border-[#272c44] flex items-center justify-center text-purple-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-base font-black text-white font-mono">pipnex</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-[#121420] text-gray-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1.5 overflow-y-auto max-h-[75vh]">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id || 
                      (item.id === 'quick-start' && activeTab === 'quick-access') ||
                      (item.id === 'prompt-trading' && activeTab === 'prompt-chart');
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-semibold tracking-normal transition-all ${
                          isActive
                            ? 'bg-[#121422] text-white border border-[#24283e]'
                            : 'text-white hover:bg-[#10121d]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-lg bg-[#141624] border border-[#272c44] flex items-center justify-center text-purple-400 shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-white font-semibold">{item.label}</span>
                        </div>

                        {item.dotColor && (
                          <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor} shrink-0`} />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-3 border-t border-[#151724]">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 rounded-xl bg-[#261216] border border-[#ff4b58]/30 text-[#ff4b58] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Center Main View Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
          
          {/* Top App Bar */}
          <header className="h-16 border-b border-[#151724] px-4 md:px-8 flex items-center justify-between shrink-0 bg-[#08090f]/90 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-[#121420] text-gray-300 hover:text-white border border-[#1e2233] cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 hidden sm:inline">PipNex Portal /</span>
                <span className="font-bold text-white uppercase tracking-wider font-mono">
                  {activeTab.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Right Header Action Items (Matching Screenshot 1) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Circular Dark Mode / Light Mode Toggle Button */}
              <button
                id="header-theme-toggle-btn"
                onClick={handleToggleTheme}
                title={themeMode === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
                aria-label="Toggle dark and light theme"
                className="w-9 h-9 rounded-full bg-white dark:bg-[#121422] hover:bg-gray-100 dark:hover:bg-[#1a1d2e] border border-gray-200 dark:border-[#23273c] flex items-center justify-center text-gray-700 dark:text-gray-200 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {themeMode === 'light' ? (
                  <Moon className="w-4 h-4 text-gray-700" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-300 transition-colors" />
                )}
              </button>

              {/* Notification Bell Button */}
              <div className="relative">
                <button
                  id="header-notifications-btn"
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsUserMenuOpen(false);
                  }}
                  title="Notifications"
                  className="w-9 h-9 rounded-full bg-white dark:bg-[#121422] hover:bg-gray-100 dark:hover:bg-[#1a1d2e] border border-gray-200 dark:border-[#23273c] flex items-center justify-center text-gray-700 dark:text-gray-200 transition-all shadow-sm active:scale-95 cursor-pointer relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-purple-500 absolute top-2 right-2 border-2 border-white dark:border-[#121422]" />
                </button>

                {/* Notifications Popover */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0c0e1a] border border-gray-200 dark:border-[#222742] rounded-2xl p-3 shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-2 text-gray-900 dark:text-white">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#1a1d30]">
                      <span className="font-bold text-sm">Notifications</span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold cursor-pointer">Mark all as read</span>
                    </div>
                    <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                      <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/30 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-xs">Signal Triggered: XAG/USD</div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Silver reached the key resistance level at $68.96.</div>
                          <div className="text-[10px] text-gray-400 mt-1">2 mins ago</div>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#121526] border border-gray-100 dark:border-[#1c2138] flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-xs">Straddle AI Daily Briefing</div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Macro sentiment index updated for New York session.</div>
                          <div className="text-[10px] text-gray-400 mt-1">1 hour ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Dropdown Menu (Exact Match for Screenshot 1) */}
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className="w-9 h-9 rounded-full bg-[#ede9fe] dark:bg-[#1a1733] hover:bg-[#ddd6fe] dark:hover:bg-[#251f49] border border-[#d8b4fe] dark:border-[#581c87] text-[#7c3aed] dark:text-[#c084fc] font-bold text-xs flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
                  title={`${user.firstName} ${user.lastName}`}
                >
                  {user.firstName && user.lastName
                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                    : (user.firstName ? user.firstName.substring(0, 2).toUpperCase() : 'DJ')}
                </button>

                {/* DROPDOWN MENU MATCHING SCREENSHOT 2 */}
                {isUserMenuOpen && (
                  <div 
                    id="user-profile-dropdown-card"
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0c0e1a] border border-gray-200 dark:border-[#222742] rounded-3xl p-3.5 shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-2 text-gray-900 dark:text-white select-none"
                  >
                    {/* User Header Profile Block */}
                    <div className="p-2 flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-[#f3e8ff] dark:bg-[#20183b] border border-[#e9d5ff] dark:border-[#581c87] text-[#9333ea] dark:text-[#c084fc] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {user.firstName && user.lastName
                          ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                          : (user.email ? user.email.substring(0, 2).toUpperCase() : 'DD')}
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <div className="font-medium text-gray-800 dark:text-gray-200 text-[13px] truncate">
                          {user.email || `${user.firstName?.toLowerCase() || 'orucho'}@gmail.com`}
                        </div>
                        <div className="mt-1">
                          <span className="px-2.5 py-0.5 rounded-md bg-transparent text-gray-400 dark:text-gray-400 text-[11px] font-normal tracking-wide inline-block border border-gray-200 dark:border-gray-700">
                            {user.plan === 'Platinum' ? 'Platinum Tier' : 'Free Trial'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="my-2 border-t border-gray-100 dark:border-[#1a1d30]" />

                    {/* Section 1: Profile & Connections */}
                    <div className="space-y-1">
                      {/* 1. My Profile */}
                      <button
                        id="menu-my-profile-btn"
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-[#1a1733] hover:text-[#9333ea] dark:hover:text-[#c084fc] flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <User className="w-4 h-4 text-gray-800 dark:text-gray-200 group-hover:text-[#9333ea] dark:group-hover:text-[#c084fc] stroke-[1.8] transition-colors" />
                          <span className="font-normal text-[14px] text-gray-900 dark:text-gray-100 group-hover:text-[#9333ea] dark:group-hover:text-[#c084fc]">My Profile</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      {/* 2. Subscription & Billing */}
                      <button
                        id="menu-subscription-billing-btn"
                        onClick={() => {
                          setActiveTab('subscription');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-[#1a1733] hover:text-[#9333ea] dark:hover:text-[#c084fc] flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <CreditCard className="w-4 h-4 text-gray-800 dark:text-gray-200 group-hover:text-[#9333ea] dark:group-hover:text-[#c084fc] stroke-[1.8] transition-colors" />
                          <span className="font-normal text-[14px] text-gray-900 dark:text-gray-100 group-hover:text-[#9333ea] dark:group-hover:text-[#c084fc]">Subscription &amp; Billing</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      {/* 3. MT5 Account Connection (Highlighted with vibrant purple and gold Platinum badge) */}
                      <button
                        id="menu-mt5-connection-btn"
                        onClick={() => {
                          setIsMT5ModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white flex items-center justify-between transition-colors shadow-sm cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5">
                          <Link2 className="w-4 h-4 text-white stroke-[2]" />
                          <span className="font-medium text-[14px] text-white">MT5 Account Connection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#581c87]/90 text-[#fbbf24] border border-[#a855f7]/60 text-[11px] font-bold flex items-center gap-1 shadow-xs">
                            <Diamond className="w-2.5 h-2.5 fill-[#fbbf24] text-[#fbbf24]" />
                            Platinum
                          </span>
                          <ChevronRight className="w-4 h-4 text-purple-200 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    </div>

                    <div className="my-2 border-t border-gray-100 dark:border-[#1a1d30]" />

                    {/* Section 2: Settings, Privacy, Help */}
                    <div className="space-y-1">
                      {/* 4. Settings */}
                      <button
                        id="menu-settings-btn"
                        onClick={() => {
                          setActiveTab('settings');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-[#1a1733] hover:text-[#9333ea] dark:hover:text-[#c084fc] flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <Settings className="w-4 h-4 text-gray-800 dark:text-gray-200 group-hover:text-[#9333ea] dark:group-hover:text-[#c084fc] stroke-[1.8] transition-colors" />
                          <span className="font-normal text-[14px] text-gray-900 dark:text-gray-100 group-hover:text-[#9333ea] dark:group-hover:text-[#c084fc]">Settings</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      {/* 5. Privacy & Security */}
                      <button
                        id="menu-privacy-security-btn"
                        onClick={() => {
                          setActiveTab('settings');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-[#1a1733] hover:text-[#9333ea] dark:hover:text-[#c084fc] flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <Shield className="w-4 h-4 text-gray-800 dark:text-gray-200 group-hover:text-[#9333ea] dark:group-hover:text-[#c084fc] stroke-[1.8] transition-colors" />
                          <span className="font-normal text-[14px] text-gray-900 dark:text-gray-100 group-hover:text-[#9333ea] dark:group-hover:text-[#c084fc]">Privacy &amp; Security</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      {/* 6. Help & Support */}
                      <button
                        id="menu-help-support-btn"
                        onClick={() => {
                          setActiveTab('contact-support');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-[#1a1733] hover:text-[#9333ea] dark:hover:text-[#c084fc] flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <HelpCircle className="w-4 h-4 text-gray-800 dark:text-gray-200 group-hover:text-[#9333ea] dark:group-hover:text-[#c084fc] stroke-[1.8] transition-colors" />
                          <span className="font-normal text-[14px] text-gray-900 dark:text-gray-100 group-hover:text-[#9333ea] dark:group-hover:text-[#c084fc]">Help &amp; Support</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    <div className="my-2 border-t border-gray-100 dark:border-[#1a1d30]" />

                    {/* Section 3: Sign Out */}
                    <div>
                      <button
                        id="menu-sign-out-btn"
                        onClick={onLogout}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-[#ef4444] hover:bg-rose-50 dark:hover:bg-[#201014] flex items-center gap-3.5 font-medium transition-colors cursor-pointer group"
                      >
                        <LogOut className="w-4 h-4 text-[#ef4444] stroke-[2]" />
                        <span className="text-[14px] font-medium text-[#ef4444]">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className={`p-3 md:p-6 pb-28 w-full flex-1 space-y-6 ${
            activeTab === 'ai-trading' ? 'max-w-[1720px] mx-auto px-2 sm:px-4' : 'max-w-7xl mx-auto'
          }`}>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <OverviewView
                user={user}
                onOpenTrish={() => setIsTrishOpen(true)}
                onOpenMacroAnalysis={(evt) => setSelectedMacroEvent(evt)}
                onOpenUpgrade={handleOpenUpgrade}
                onNavigateToTab={(tabId) => setActiveTab(tabId)}
              />
            )}

            {/* Quick Start / Quick Access Tools */}
            {(activeTab === 'quick-start' || activeTab === 'quick-access') && (
              <QuickAccessTools 
                onNavigateToTab={(tabId) => setActiveTab(tabId)} 
                onOpenUpgrade={handleOpenUpgrade}
              />
            )}

            {/* Prompt Trading AI / Prompt Chart */}
            {(activeTab === 'prompt-trading' || activeTab === 'prompt-chart') && (
              <PromptTradingView />
            )}

            {/* Upload Chart */}
            {activeTab === 'upload-chart' && (
              <UploadChartView />
            )}

            {/* Manage Bots */}
            {activeTab === 'manage-bots' && (
              <ManageBotsView 
                onBack={() => setActiveTab('overview')} 
                onNavigateToBuilder={() => setActiveTab('prompt-trading')}
              />
            )}

            {/* Auto Trading */}
            {activeTab === 'auto-trading' && (
              <AutoTradingView 
                user={user} 
                onOpenUpgrade={handleOpenUpgrade} 
              />
            )}

            {/* AI Trading */}
            {activeTab === 'ai-trading' && (
              <AITradingView
                user={user}
                onOpenTrish={() => setIsTrishOpen(true)}
                onOpenUpgrade={handleOpenUpgrade}
                onBack={() => setActiveTab('overview')}
              />
            )}

            {/* Position Size Calc */}
            {activeTab === 'position-calculator' && (
              <PositionCalculatorView />
            )}

            {/* PropPass */}
            {activeTab === 'proppass' && (
              <PropPassView onNavigateToTab={(tab) => setActiveTab(tab)} />
            )}

            {/* SCREENSHOT 1: Pulse Signals */}
            {activeTab === 'pulse-signals' && (
              <PulseSignalsView 
                onBack={() => setActiveTab('overview')}
                onOpenUpgrade={handleOpenUpgrade}
                onExecuteSignal={(sig) => {
                  setActiveTab('ai-trading');
                }}
              />
            )}

            {/* SCREENSHOT 2: Subscription Management */}
            {activeTab === 'subscription' && (
              <SubscriptionView
                user={user}
                onOpenUpgrade={handleOpenUpgrade}
              />
            )}

            {/* SCREENSHOT 3: How to Use */}
            {activeTab === 'how-to-use' && (
              <HowToUseView />
            )}

            {/* SCREENSHOT 4: Contact Support */}
            {activeTab === 'contact-support' && (
              <ContactSupportView 
                user={user} 
                onBack={() => setActiveTab('overview')}
              />
            )}

            {/* SCREENSHOT 5: Settings */}
            {activeTab === 'settings' && (
              <SettingsView
                user={user}
                onUpdateUser={onUpdateUser}
                onLogout={onLogout}
                onOpenUpgrade={handleOpenUpgrade}
                currentTheme={themeMode}
                onSetTheme={setThemeMode}
              />
            )}

          </div>

          {/* FLOATING BOTTOM OVERLAY NAVIGATION BAR (Color-Graded to Image 1 & Image 2) */}
          <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 px-3 pointer-events-none max-w-[96vw] sm:max-w-fit w-full sm:w-auto flex justify-center">
            <div 
              id="floating-bottom-overlay-navbar"
              className="pointer-events-auto max-w-fit bg-white dark:bg-[#0c0d18] border border-gray-200/90 dark:border-[#23273c] rounded-full px-2.5 py-1.5 sm:px-3.5 sm:py-2 flex items-center justify-start gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar shadow-[0_12px_32px_-4px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.06)] transition-all"
            >
              {topNavPills.map((pill) => {
                const PillIcon = pill.icon;
                const isPillActive = activeTab === pill.id || 
                  (pill.id === 'quick-start' && activeTab === 'quick-access') ||
                  (pill.id === 'prompt-trading' && activeTab === 'prompt-chart');
                const isUpload = pill.id === 'upload-chart';

                return (
                  <button
                    key={pill.id}
                    id={`floating-bottom-nav-${pill.id}`}
                    onClick={() => setActiveTab(pill.id)}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 group ${
                      isPillActive
                        ? 'bg-[#f3e8ff] dark:bg-[#20183b] text-[#7c3aed] dark:text-[#c084fc] border border-[#e9d5ff] dark:border-[#581c87] shadow-xs font-semibold'
                        : isUpload
                        ? 'bg-transparent text-gray-700 dark:text-gray-300 hover:text-[#7c3aed] dark:hover:text-[#c084fc] hover:bg-[#faf5ff] dark:hover:bg-[#18142a] border border-transparent font-medium'
                        : 'text-[#475569] dark:text-gray-400 hover:text-[#0f172a] dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-[#141728] border border-transparent font-medium'
                    }`}
                  >
                    {isUpload ? (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform ${
                        isPillActive ? 'bg-[#7c3aed]' : 'bg-[#7c3aed]/80'
                      }`}>
                        <PillIcon className="w-3 h-3 text-white stroke-[2.5]" />
                      </div>
                    ) : (
                      <PillIcon className={`w-3.5 h-3.5 transition-colors shrink-0 stroke-[1.8] ${
                        isPillActive ? 'text-[#7c3aed] dark:text-[#c084fc]' : 'text-[#64748b] dark:text-gray-400 group-hover:text-[#7c3aed]'
                      }`} />
                    )}
                    <span className={isPillActive ? 'font-semibold text-[#7c3aed] dark:text-[#c084fc]' : ''}>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Trish Voice & Chat AI Assistant Modal */}
      <TrishAssistantModal
        isOpen={isTrishOpen}
        onClose={() => setIsTrishOpen(false)}
      />

      {/* Macro Event Analysis Modal */}
      <MacroAnalysisModal
        isOpen={Boolean(selectedMacroEvent)}
        onClose={() => setSelectedMacroEvent(null)}
        event={selectedMacroEvent}
      />

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        defaultTier={upgradeDefaultTier}
        user={user}
        onUpgradeSuccess={handleUpgradeSuccess}
      />

      {/* My Profile Modal */}
      <MyProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdateUser={onUpdateUser}
        onOpenUpgrade={handleOpenUpgrade}
      />

      {/* MT5 Account Connection Modal */}
      <MT5ConnectionModal
        isOpen={isMT5ModalOpen}
        onClose={() => setIsMT5ModalOpen(false)}
        user={user}
        onOpenUpgrade={handleOpenUpgrade}
      />
    </div>
  );
};
