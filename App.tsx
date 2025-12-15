import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { WelcomeView } from './components/WelcomeView';
import { ChatView } from './components/ChatView';
import { VisionView } from './components/VisionView';
import { ImageGenView } from './components/ImageGenView';
import { SearchGroundingView } from './components/SearchGroundingView';
import { AppMode } from './types';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentMode) {
      case AppMode.CHAT:
        return <ChatView />;
      case AppMode.VISION:
        return <VisionView />;
      case AppMode.IMAGE_GEN:
        return <ImageGenView />;
      case AppMode.SEARCH:
        return <SearchGroundingView />;
      case AppMode.HOME:
      default:
        return <WelcomeView onSelectMode={setCurrentMode} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-900 overflow-hidden text-slate-100 font-sans">
      <Sidebar 
        currentMode={currentMode} 
        onSelectMode={setCurrentMode} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-slate-800 bg-slate-950">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </button>
          <span className="ml-3 font-semibold text-lg">Gemini Suite</span>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
