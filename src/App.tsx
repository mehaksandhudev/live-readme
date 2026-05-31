/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Mehak Sandhu
 */

import React, { useState } from 'react';
import BadgeBuilder from './components/BadgeBuilder';
import MarkdownPreview from './components/MarkdownPreview';
import VSCodeSimulator from './components/VSCodeSimulator';
import appLogo from '@/assets/icon.png';
import { 
  Shield, Monitor, Sparkles, Github
} from 'lucide-react';

export default function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<'design' | 'extension'>('design');

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 pb-20 antialiased" id="root-container">
      
      {/* Premium Minimal Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/60 shadow-sm/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center p-1 cursor-pointer overflow-hidden shadow-md">
              <img 
                src={appLogo} 
                alt="Live Readme Logo" 
                className="w-full h-full object-cover rounded" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-930 tracking-tight leading-none flex items-center gap-1.5">
                Live Readme
              </h1>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">v1.1.0 Stable</p>
            </div>
          </div>

          {/* Clean Segmented Tab Navigation Control */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveWorkspace('design')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeWorkspace === 'design' 
                  ? 'bg-white text-slate-900 shadow-sm font-bold' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Design Canvas</span>
            </button>
            <button
              onClick={() => setActiveWorkspace('extension')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeWorkspace === 'extension' 
                  ? 'bg-white text-slate-900 shadow-sm font-bold' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>VS Code Studio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* Welcome Banner Hero (Extremely Elegant and Focused) */}
        <div className="bg-white rounded-2xl p-6.5 border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100/80 rounded-2xl flex items-center justify-center p-1.5 shadow-sm flex-shrink-0">
              <img 
                src={appLogo} 
                alt="Live Readme" 
                className="w-full h-full object-cover rounded-xl" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> GFM Rendering Engine & Customization Kit
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Standardize Your GitHub Portals
              </h2>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Construct high-impact Shields.io badge configurations, parse live Markdown documents following GFM standards, or design mock Webview controllers inside simulated VS Code workspaces.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0 self-start md:self-auto bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100">
            <Github className="w-4 h-4 text-slate-700" />
            <div className="text-left font-mono text-xs">
              <span className="block text-slate-400 text-[9px] leading-none uppercase">Open Source</span>
              <span className="font-semibold text-slate-700 text-[11px]">MIT License</span>
            </div>
          </div>
        </div>

        {/* Dynamic Workspace Container */}
        {activeWorkspace === 'design' ? (
          <div className="space-y-8" id="design-station-workspace">
            {/* Visual Badge Customizer */}
            <BadgeBuilder />

            {/* Split Screen GFM Playground */}
            <MarkdownPreview />
          </div>
        ) : (
          <div id="vscode-studio-workspace">
            {/* Interactive Local Host VS Code Extension Simulator */}
            <VSCodeSimulator />
          </div>
        )}

      </main>

      {/* Visual Footer Credit - Minimal, beautiful and clean */}
      <footer className="max-w-6xl mx-auto px-6 mt-16 text-center text-xs text-slate-400">
        <p>© 2026 <a href="https://mehak-sandhu.in" className="text-indigo-500 hover:underline" target="_blank" rel="noreferrer">Mehak Sandhu</a> · Live Readme · MIT License</p>
        <div className="flex justify-center space-x-4 mt-2 font-mono text-[9px]">
          <span>Interactive Shields API v2</span>
          <span>•</span>
          <span>Tailwind CSS Pipeline</span>
          <span>•</span>
          <span>VS Code Host Simulator</span>
        </div>
      </footer>

    </div>
  );
}
