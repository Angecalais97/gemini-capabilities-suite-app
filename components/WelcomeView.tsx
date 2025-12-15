import React from 'react';
import { AppMode } from '../types';
import { MessageSquareIcon, EyeIcon, SparklesIcon, GlobeIcon } from './Icons';

interface WelcomeViewProps {
  onSelectMode: (mode: AppMode) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onSelectMode }) => {
  const capabilities = [
    {
      mode: AppMode.CHAT,
      title: "Chat & Reasoning",
      description: "Ask questions, get help with code, or brainstorm ideas with Gemini 2.5 Flash.",
      icon: <MessageSquareIcon className="w-8 h-8 text-blue-400" />,
      color: "hover:border-blue-500/50 hover:bg-blue-500/10"
    },
    {
      mode: AppMode.VISION,
      title: "Visual Analysis",
      description: "Upload images to get detailed descriptions, text extraction, or object identification.",
      icon: <EyeIcon className="w-8 h-8 text-indigo-400" />,
      color: "hover:border-indigo-500/50 hover:bg-indigo-500/10"
    },
    {
      mode: AppMode.IMAGE_GEN,
      title: "Image Generation",
      description: "Turn your words into stunning visuals using the high-speed Nano Banana model.",
      icon: <SparklesIcon className="w-8 h-8 text-purple-400" />,
      color: "hover:border-purple-500/50 hover:bg-purple-500/10"
    },
    {
      mode: AppMode.SEARCH,
      title: "Search Grounding",
      description: "Get up-to-date answers grounded in real-time Google Search data.",
      icon: <GlobeIcon className="w-8 h-8 text-emerald-400" />,
      color: "hover:border-emerald-500/50 hover:bg-emerald-500/10"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 mb-4">
            What can I do for you?
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            I am a multimodal AI assistant powered by Gemini. Explore my capabilities below.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap) => (
            <button
              key={cap.mode}
              onClick={() => onSelectMode(cap.mode)}
              className={`text-left p-8 rounded-3xl bg-slate-800 border border-slate-700 transition-all duration-300 group ${cap.color}`}
            >
              <div className="bg-slate-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 transition-transform">
                {cap.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{cap.title}</h3>
              <p className="text-slate-400 leading-relaxed">{cap.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
