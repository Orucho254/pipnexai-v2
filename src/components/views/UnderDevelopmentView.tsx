import React from 'react';
import { ArrowLeft, Shield, Eye, Lock } from 'lucide-react';

interface UnderDevelopmentViewProps {
  featureName?: string;
  customDescription?: string;
  onBack?: () => void;
  onPreviewLive?: () => void;
  showPreviewToggle?: boolean;
}

export const UnderDevelopmentView: React.FC<UnderDevelopmentViewProps> = ({
  featureName = 'Feature',
  customDescription,
  onBack,
  onPreviewLive,
  showPreviewToggle = true,
}) => {
  return (
    <div 
      id="under-development-screen"
      className="min-h-[75vh] flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-2xl bg-[#14151a] border border-[#232634] rounded-3xl p-8 sm:p-14 shadow-2xl space-y-7 text-left relative overflow-hidden">
        
        {/* Subtle glowing ambient accent */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Top Header from Screenshot 2: WE'LL BE BACK SOON */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-white uppercase font-sans">
            WE'LL BE BACK SOON
          </h1>
        </div>

        {/* 2. Headline: Development in Progress */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 font-sans">
            Development in Progress
          </h2>
        </div>

        {/* 3. Description Paragraph from Screenshot 2 */}
        <div className="space-y-5 text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
          <p>
            We're currently working behind the scenes to improve the platform and complete the remaining features. Some services and features may not be available yet.
          </p>

          <p className="font-semibold text-white">
            Please be patient — we're building something better for you.
          </p>

          <p className="font-semibold text-white">
            Thank you for waiting and supporting us.
          </p>
        </div>

        {/* Status Pill Badge */}
        <div className="pt-2 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span className="text-xs font-semibold text-gray-400 font-mono">
            {featureName} Upgrade Mode Active
          </span>
        </div>

        {/* Action Controls */}
        <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-[#232634]/80">
          {onBack && (
            <button
              id="back-to-overview-btn"
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl bg-[#1d202e] hover:bg-[#272b3e] border border-[#2f344d] text-xs font-semibold text-gray-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
          )}

          {showPreviewToggle && onPreviewLive && (
            <button
              id="preview-live-feature-btn"
              type="button"
              onClick={onPreviewLive}
              className="px-4 py-2.5 rounded-xl bg-[#1e2338] hover:bg-[#282f4d] border border-[#3b4570] text-xs font-semibold text-indigo-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Live {featureName}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
