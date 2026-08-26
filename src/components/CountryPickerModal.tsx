import React, { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { CountryItem } from '../types';

interface CountryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry: CountryItem;
  onSelect: (country: CountryItem) => void;
}

export const CountryPickerModal: React.FC<CountryPickerModalProps> = ({
  isOpen,
  onClose,
  selectedCountry,
  onSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        c.dialCode.includes(query)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="country-picker-modal"
        className="w-full max-w-md bg-[#0e0f17] border border-[#2a2d3d] rounded-2xl p-6 shadow-2xl text-white relative max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1f2233]">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-wide">Select Country Code</h3>
            <p className="text-xs text-gray-400 mt-0.5">Choose your international calling prefix</p>
          </div>
          <button
            id="close-country-picker-btn"
            onClick={onClose}
            className="p-2 rounded-lg bg-[#161926] text-gray-400 hover:text-white hover:bg-[#202538] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="pt-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="country-search-input"
              type="text"
              placeholder="Search country or dial code (e.g. +1, UK, Japan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#141724] border border-[#24283b] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Countries List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar max-h-[360px]">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => {
              const isSelected = country.code === selectedCountry.code;
              return (
                <button
                  key={country.code}
                  id={`country-item-${country.code.toLowerCase()}`}
                  onClick={() => {
                    onSelect(country);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : 'bg-[#131622]/60 hover:bg-[#1c2033] border border-transparent text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{country.flag}</span>
                    <span className="text-sm font-medium">{country.name}</span>
                    <span className="text-xs text-gray-500 uppercase">({country.code})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#1c2033] text-indigo-300">
                      {country.dialCode}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">
              No matching countries found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
