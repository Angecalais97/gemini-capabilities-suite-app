import React from 'react';
import { AppMode } from '../types';
import { MessageSquareIcon, EyeIcon, SparklesIcon, GlobeIcon, ArrowLeftIcon } from './Icons';

interface SidebarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, onSelectMode, isOpen, setIsOpen }) => {
  const menuItems = [
    { mode: AppMode.CHAT, label: 'Chat', icon: <MessageSquareIcon /> },
    { mode: AppMode.VISION, label: 'Vision', icon: <EyeIcon /> },
    { mode: AppMode.IMAGE_GEN, label: 'Imagine', icon: <SparklesIcon /> },
    { mode: AppMode.SEARCH, label: 'Search', icon: <GlobeIcon /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 px-4 py-6 mb-4 cursor-pointer" onClick={() => onSelectMode(AppMode.HOME)}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white text-lg">
              G
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Gemini Suite</span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.mode}
                onClick={() => {
                  onSelectMode(item.mode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  currentMode === item.mode
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <span className="[&>svg]:w-5 [&>svg]:h-5">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
            <p>Powered by Google Gemini 2.5</p>
          </div>
        </div>
      </div>
    </>
  );
};
