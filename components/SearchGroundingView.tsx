import React, { useState } from 'react';
import { GlobeIcon, LoaderIcon, SendIcon } from './Icons';
import { searchWeb } from '../services/geminiService';

export const SearchGroundingView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string, sources: Array<{ title: string, uri: string }> } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await searchWeb(query);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <GlobeIcon className="w-6 h-6 text-emerald-400" />
            Search Grounding
          </h2>
          <p className="text-slate-400">Ask questions about current events or topics requiring real-time web data.</p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Who won the Super Bowl in 2025?"
            className="w-full bg-slate-800 border-slate-700 text-slate-100 rounded-full px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-lg"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          >
            {loading ? <LoaderIcon className="w-5 h-5" /> : <SendIcon className="w-5 h-5" />}
          </button>
        </form>

        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
               <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">Answer</h3>
               <p className="text-slate-100 text-lg leading-relaxed">{result.text}</p>
            </div>

            {result.sources.length > 0 && (
              <div>
                <h3 className="text-slate-400 text-sm font-semibold mb-3">Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-slate-600 flex items-center justify-center shrink-0">
                        <GlobeIcon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-200 text-sm font-medium truncate">{source.title}</p>
                        <p className="text-slate-500 text-xs truncate">{source.uri}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
