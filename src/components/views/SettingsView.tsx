import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Bell, 
  User, 
  ChevronRight, 
  Diamond, 
  AlertTriangle, 
  LogOut, 
  Trash2, 
  Check, 
  ShieldCheck, 
  X, 
  Sparkles,
  Lock
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLogout?: () => void;
  onOpenUpgrade?: (tier?: 'Pro' | 'Platinum' | 'Ultimate') => void;
  currentTheme?: 'dark' | 'light' | 'auto';
  onSetTheme?: (mode: 'dark' | 'light' | 'auto') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onOpenUpgrade,
  currentTheme = 'auto',
  onSetTheme
}) => {
  // Theme Mode
  const [selectedThemeMode, setSelectedThemeMode] = useState<'light' | 'dark' | 'auto'>(currentTheme);

  const handleSelectTheme = (mode: 'light' | 'dark' | 'auto') => {
    setSelectedThemeMode(mode);
    onSetTheme?.(mode);
  };

  // Notification Toggles
  const [pushNotifications, setPushNotifications] = useState(true);
  const [tradeAlerts, setTradeAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);

  // Modals for Profile & Privacy
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Edit Profile Form State
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [email, setEmail] = useState(user.email || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      firstName,
      lastName,
      email
    });
    setIsEditProfileOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      
      {/* 1. Appearance Card (Screenshot 5) */}
      <div className="bg-[#080911] border border-[#161828] rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <Sun className="w-4 h-4 text-purple-400" />
            <span>Appearance</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Customize how PipNex looks for you
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-3">Theme Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Light Mode */}
            <button
              onClick={() => handleSelectTheme('light')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedThemeMode === 'light'
                  ? 'bg-[#121422] border-[#a78bfa] ring-1 ring-[#a78bfa]/50 shadow-md'
                  : 'bg-[#0b0c14] border-[#1a1d2e] hover:border-[#2b304c]'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#141624] border border-[#23273c] flex items-center justify-center text-amber-300 mb-3">
                <Sun className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Light</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Bright and clean interface</div>
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => handleSelectTheme('dark')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedThemeMode === 'dark'
                  ? 'bg-[#121422] border-[#a78bfa] ring-1 ring-[#a78bfa]/50 shadow-md'
                  : 'bg-[#0b0c14] border-[#1a1d2e] hover:border-[#2b304c]'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#141624] border border-[#23273c] flex items-center justify-center text-purple-400 mb-3">
                <Moon className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Dark</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Easy on the eyes</div>
            </button>

            {/* Auto Mode (Selected in Screenshot 5) */}
            <button
              onClick={() => handleSelectTheme('auto')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedThemeMode === 'auto'
                  ? 'bg-[#121422] border-[#a78bfa] ring-1 ring-[#a78bfa]/50 shadow-md'
                  : 'bg-[#0b0c14] border-[#1a1d2e] hover:border-[#2b304c]'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#141624] border border-[#23273c] flex items-center justify-center text-purple-300 mb-3">
                <Laptop className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Auto</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Adapts to system &amp; time</div>
            </button>
          </div>
        </div>

        <div className="pt-2 text-xs text-gray-400 font-mono">
          Current theme: <span className="text-white font-bold capitalize">{selectedThemeMode === 'auto' ? 'Night' : selectedThemeMode}</span>
        </div>
      </div>

      {/* 2. Notifications Card (Screenshot 5) */}
      <div className="bg-[#080911] border border-[#161828] rounded-3xl p-6 shadow-xl space-y-5">
        <div>
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <Bell className="w-4 h-4 text-purple-400" />
            <span>Notifications</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your alert preferences
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {/* Push Notifications */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Push Notifications</div>
              <div className="text-gray-400 text-xs mt-0.5">Receive notifications about your account</div>
            </div>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                pushNotifications ? 'bg-[#a78bfa]' : 'bg-[#1b1e2f]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                  pushNotifications ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Trade Alerts */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Trade Alerts</div>
              <div className="text-gray-400 text-xs mt-0.5">Get notified when trades are executed</div>
            </div>
            <button
              onClick={() => setTradeAlerts(!tradeAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                tradeAlerts ? 'bg-[#a78bfa]' : 'bg-[#1b1e2f]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                  tradeAlerts ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Price Alerts */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Price Alerts</div>
              <div className="text-gray-400 text-xs mt-0.5">Alerts when prices hit your targets</div>
            </div>
            <button
              onClick={() => setPriceAlerts(!priceAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                priceAlerts ? 'bg-[#a78bfa]' : 'bg-[#1b1e2f]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                  priceAlerts ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Account Card (Screenshot 5) */}
      <div className="bg-[#080911] border border-[#161828] rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <User className="w-4 h-4 text-purple-400" />
            <span>Account</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your account settings
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0b0c15] hover:bg-[#121422] border border-[#1a1d2e] hover:border-[#2b304c] text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <span>Edit Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0b0c15] hover:bg-[#121422] border border-[#1a1d2e] hover:border-[#2b304c] text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <span>Privacy &amp; Security</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 4. MT5 Account Connection (Platinum Feature) (Screenshot 5) */}
      <div className="bg-[#080911] border border-[#161828] rounded-3xl p-8 text-center shadow-xl relative overflow-hidden flex flex-col items-center justify-center space-y-3">
        {/* Diamond Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#141626] border border-[#272b44] flex items-center justify-center text-purple-400 mb-1">
          <Diamond className="w-6 h-6" />
        </div>

        {/* Platinum Feature Badge */}
        <div>
          <span className="px-3 py-1 rounded-full bg-[#181a2e] text-purple-300 text-[10px] font-bold uppercase tracking-wider font-mono border border-purple-500/30">
            💎 Platinum Feature
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white">
          MT5 Account Connection
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-gray-400 max-w-md leading-relaxed">
          Connect your MT5 account for automated trading, PropPass, and AI position sizing.
        </p>

        {/* Upgrade to Platinum Button */}
        <div className="pt-2">
          <button
            onClick={() => onOpenUpgrade?.('Platinum')}
            className="px-6 py-2.5 rounded-xl bg-[#a78bfa] hover:bg-[#bba4fb] active:scale-[0.98] text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Upgrade to Platinum</span>
          </button>
        </div>
      </div>

      {/* 5. Danger Zone Card (Screenshot 5) */}
      <div className="bg-[#080911] border border-rose-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <div className="flex items-center gap-2 text-base font-bold text-rose-500">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Danger Zone</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Irreversible actions
          </p>
        </div>

        <div className="space-y-3">
          {/* Sign Out Button */}
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-2xl bg-[#0b0c15] hover:bg-[#121422] border border-[#1f2235] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          {/* Delete Account Button */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full py-3 rounded-2xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] shadow-md"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#090a12] border border-[#1d2033] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#181a28] pb-3">
              <h3 className="text-sm font-bold text-white">Edit Profile Details</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#10121f] border border-[#1e2235] rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#10121f] border border-[#1e2235] rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#10121f] border border-[#1e2235] rounded-xl text-white focus:outline-none focus:border-purple-500/50 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 bg-[#121422] text-gray-300 rounded-xl hover:bg-[#1a1d2e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#a78bfa] text-slate-950 font-bold rounded-xl hover:bg-[#bba4fb]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Privacy & Security Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#090a12] border border-[#1d2033] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#181a28] pb-3">
              <h3 className="text-sm font-bold text-white">Privacy &amp; Security Settings</h3>
              <button onClick={() => setIsPrivacyOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#0e101c] border border-[#1c1f30] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Two-Factor Authentication (2FA)</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">Protect your account with OTP authenticator</div>
                </div>
                <span className="px-2 py-0.5 bg-[#122b1c] text-emerald-400 text-[10px] font-bold rounded-md">Enabled</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e101c] border border-[#1c1f30]">
                <div className="font-bold text-white">Active Session Encryption</div>
                <div className="text-gray-400 text-[11px] mt-0.5">TLS 1.3 256-bit encrypted broker bridge keys</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="px-4 py-2 bg-[#171a2e] text-white text-xs font-semibold rounded-xl hover:bg-[#222742]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Warning Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#090a12] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-500">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Delete PipNex Account?</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to delete your account? All automated bot parameters, backtesting logs, and MT5 API bridge keys will be permanently erased.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-[#121422] text-gray-300 rounded-xl hover:bg-[#1a1d2e] text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  onLogout?.();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
