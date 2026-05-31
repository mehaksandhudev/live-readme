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
import { Shield, Monitor, Github, ExternalLink, Code2, User } from 'lucide-react';

const LINKS = {
  github: 'https://github.com/mehaksandhudev/live-readme',
  marketplace: 'https://marketplace.visualstudio.com/items?itemName=mehaksandhudev.live-readme-studio',
  portfolio: 'https://mehak-sandhu.in',
};

export default function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<'design' | 'extension'>('design');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col" id="root-container">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center shadow-sm">
              <img src={appLogo} alt="Live Readme" className="w-full h-full object-cover" />
            </div>
            <div className="leading-none">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">Live Readme</h1>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">v1.1.0</p>
            </div>
          </div>

          {/* Tab switcher — centre */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveWorkspace('design')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeWorkspace === 'design'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Badge & Markdown
            </button>
            <button
              onClick={() => setActiveWorkspace('extension')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeWorkspace === 'extension'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              VS Code Studio
            </button>
          </div>

          {/* External links — right */}
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              title="GitHub Repository"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href={LINKS.marketplace}
              target="_blank"
              rel="noreferrer"
              title="VS Code Marketplace"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Extension</span>
            </a>
            <a
              href={LINKS.portfolio}
              target="_blank"
              rel="noreferrer"
              title="Mehak Sandhu — Portfolio"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">mehak-sandhu.in</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero strip ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              GFM Markdown Preview &amp; Shields.io Badge Builder
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live markdown editor · Badge designer · VS Code webview simulator — open source, MIT licensed.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={LINKS.marketplace}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Install VS Code Extension
            </a>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
            >
              <Github className="w-3.5 h-3.5" />
              Star on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 py-7">
        {activeWorkspace === 'design' ? (
          <div className="space-y-7" id="design-station-workspace">
            <BadgeBuilder />
            <MarkdownPreview />
          </div>
        ) : (
          <div id="vscode-studio-workspace">
            <VSCodeSimulator />
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>
            © 2026{' '}
            <a href={LINKS.portfolio} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline font-medium">
              Mehak Sandhu
            </a>
            {' '}· Live Readme · MIT License
          </span>
          <div className="flex items-center gap-4">
            <a href={LINKS.portfolio} target="_blank" rel="noreferrer" className="hover:text-slate-700 transition-colors flex items-center gap-1">
              <User className="w-3 h-3" /> mehak-sandhu.in
            </a>
            <a href={LINKS.github} target="_blank" rel="noreferrer" className="hover:text-slate-700 transition-colors flex items-center gap-1">
              <Github className="w-3 h-3" /> GitHub
            </a>
            <a href={LINKS.marketplace} target="_blank" rel="noreferrer" className="hover:text-slate-700 transition-colors flex items-center gap-1">
              <Code2 className="w-3 h-3" /> Marketplace
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
