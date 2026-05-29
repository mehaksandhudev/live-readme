import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { 
  FileCode, Edit3, Eye, Copy, Check, Type, FileUp, ListChecks,
  Bold, Italic, List, ListChecks as ChecksIcon, Link, Image, Table, Code, RefreshCw,
  Clock, FileText, Sparkles, BookOpen, Layers, CheckSquare, ChevronRight, ArrowDown
} from 'lucide-react';

const markedInstance = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

const EMOJI_MAP: Record<string, string> = {
  ':rocket:': '🚀',
  ':star:': '⭐',
  ':warning:': '⚠️',
  ':fire:': '🔥',
  ':white_check_mark:': '✅',
  ':lock:': '🔒',
  ':bulb:': '💡',
  ':chart_with_upwards_trend:': '📈',
  ':bug:': '🐛',
  ':memo:': '📝',
  ':package:': '📦',
  ':x:': '❌',
  ':books:': '📚',
  ':heart:': '❤️',
  ':eyes:': '👀'
};

const TEMPLATES = [
  {
    id: 'saas',
    name: '⚡ SaaS Application',
    description: 'Boilerplate for full-stack apps, badges, and tech stack tables.',
    markdown: `# ⚡ Saasify Next - Ultimate Boilerplate

[![Build Status](https://img.shields.io/badge/build-passing-emerald?logo=githubactions)](https://github.com) [![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com) [![NPM version](https://img.shields.io/badge/npm-v1.4.2-orange)](https://github.com)

A high-performance premium web stack built with Next.js 15, React 19, Tailwind CSS, and Prisma database synchronization.

## ✨ Core Highlights
- [x] Pre-configured React 19 server-side middleware
- [x] Integrated Tailwind CSS styling pipelines
- [ ] Implement multi-tenant schema migration
- [ ] Connect Stripe subscription billing engine

## 📊 Deployment Infrastructure
| Database Layer | Cache Store | Server Ingress |
| :--- | :---: | :---: |
| PostgreSQL | Redis Cloud | Cloud Run (Nginx) |

## 🚀 Quick Setup
Run the setup script:
\`\`\`bash
npm install && npm run dev
\`\`\`
`
  },
  {
    id: 'npm-pkg',
    name: '📦 Developer Tool / Library',
    description: 'Technical spec sheet with installation lines and interactive code blocks.',
    markdown: `# 📦 ts-query-engine

[![NPM Version](https://img.shields.io/badge/npm-v3.2.0-blue?logo=npm)](https://github.com) [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-brightgreen?logo=typescript)](https://github.com) [![Code Coverage](https://img.shields.io/badge/coverage-98%25-success?logo=codecov)](https://github.com)

A ultra-lightweight, zero-dependency async query compiler styled for microservices.

## 💾 Installation
\`\`\`bash
npm i ts-query-engine
\`\`\`

## 🛠️ Usage Example
\`\`\`typescript
import { compileQuery } from 'ts-query-engine';

const query = compileQuery({
  filter: { status: 'active' },
  sort: 'createdAt'
});
console.log(query.toSql());
\`\`\`

## 📋 Features Checklist
- [x] Support structured query parameters compiler
- [x] Async promise debounce pipeline
- [ ] Optimize database indexing triggers
`
  },
  {
    id: 'portfolio',
    name: '👋 Personal Profile README',
    description: 'Elegant template for developer bios, social badges, and milestone checklists.',
    markdown: `# 👋 Hello, I'm Alex!

[![GitHub followers](https://img.shields.io/badge/followers-1.2k-indigo?logo=github)](https://github.com) [![Rust Developer](https://img.shields.io/badge/Rust-Developer-orange?logo=rust)](https://github.com) [![Twitter](https://img.shields.io/badge/X-@alexdev-black?logo=x)](https://github.com)

I am an open-source advocate & full-stack software crafter interested in Rust compilers, React interface structures, and real-time visualization systems.

## 🛠️ Technology Belt
- **Backend:** Axum, Actix Web, Node.js, Go
- **Frontend:** React, Next.js, Tailwind CSS
- **Databases:** PostgreSQL, Redis, Cloud Spanner

## 📈 My Personal Objectives
- [x] Complete developer portfolio interface standardizations
- [ ] Publish the open-source markdown live-render utility
- [ ] Give a presentation on WebAssembly state compilers
`
  }
];

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(TEMPLATES[0].markdown);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'split' | 'edit' | 'preview'>('split');
  const [dragActive, setDragActive] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('saas');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute total lines inside editor
  const lineCount = useMemo(() => {
    return markdown.split('\n').length;
  }, [markdown]);

  // Parse markdown content with GFM preprocessing (emojis & checklists)
  const compiledHtml = useMemo(() => {
    let processed = markdown;

    // Replace emoji shortcodes
    Object.entries(EMOJI_MAP).forEach(([shortcode, emoji]) => {
      processed = processed.replaceAll(shortcode, emoji);
    });

    try {
      let html = markedInstance.parse(processed) as string;

      // Post-process to render GFM checkboxes gracefully
      html = html.replace(
        /<li>\[x\]\s/g,
        '<li class="task-list-item flex items-start gap-2 select-none"><input type="checkbox" checked disabled class="mt-1 flex-shrink-0 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" /> '
      );
      html = html.replace(
        /<li>\[\s\]\s/g,
        '<li class="task-list-item flex items-start gap-2 select-none"><input type="checkbox" disabled class="mt-1 flex-shrink-0 w-4 h-4 text-slate-300 border-gray-300 rounded focus:ring-indigo-500" /> '
      );

      return html;
    } catch (err) {
      return `<p class="text-red-500">Parsing execution failed: ${(err as Error).message}</p>`;
    }
  }, [markdown]);

  // Document Metrics Heuristics
  const stats = useMemo(() => {
    const text = markdown || '';
    const charCount = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const readTimeMins = Math.max(1, Math.ceil(words / 200));

    // Checkbox statistics parsing
    const checkedCount = (text.match(/- \[[xX]\]/g) || []).length;
    const uncheckedCount = (text.match(/- \[\s\]/g) || []).length;
    const totalChecks = checkedCount + uncheckedCount;
    const checkRatio = totalChecks > 0 ? Math.round((checkedCount / totalChecks) * 100) : 0;

    // Badges / Shields.io detector count
    const badgeCount = (text.match(/img\.shields\.io\/badge/g) || []).length;

    // Headers generator list
    const lines = text.split('\n');
    const headersList: Array<{ level: number; text: string; id: string }> = [];
    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        headersList.push({
          level: match[1].length,
          text: match[2].trim().replace(/:[a-zA-Z_0-9]+:/g, ''), // strip emoji tags for sidebar view
          id: match[2].toLowerCase().replace(/[^\w]+/g, '-')
        });
      }
    });

    return {
      charCount,
      words,
      readTimeMins,
      checkedCount,
      totalChecks,
      checkRatio,
      badgeCount,
      headers: headersList
    };
  }, [markdown]);

  // Sync scrolling left -> right
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (previewRef.current && activeTab === 'split') {
      const editor = e.currentTarget;
      const preview = previewRef.current;
      const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
    }
  };

  const copyRawMarkdown = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Local file loading handlers (FileReader API)
  const loadMdContent = (file: File) => {
    if (file && (file.name.endsWith('.md') || file.type === 'text/markdown' || file.type === 'text/plain')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setMarkdown(e.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadMdContent(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadMdContent(e.target.files[0]);
    }
  };

  const handleInsertShortcut = (type: string) => {
    if (!textareaRef.current) return;
    
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selectedText = text.substring(start, end);
    
    let insertion = '';
    let cursorOffset = 0;

    switch (type) {
      case 'header':
        insertion = `\n## ${selectedText || 'Heading'}\n`;
        cursorOffset = insertion.length;
        break;
      case 'bold':
        insertion = `**${selectedText || 'bold text'}**`;
        cursorOffset = start + insertion.length - 2;
        break;
      case 'italic':
        insertion = `*${selectedText || 'italic text'}*`;
        cursorOffset = start + insertion.length - 1;
        break;
      case 'link':
        insertion = `[${selectedText || 'text'}](https://github.com)`;
        cursorOffset = start + insertion.length;
        break;
      case 'image':
        insertion = `![${selectedText || 'image alt'}](https://img.shields.io/badge/badge-example-indigo)`;
        cursorOffset = start + insertion.length;
        break;
      case 'list':
        insertion = `\n- ${selectedText || 'list item'}\n`;
        cursorOffset = insertion.length;
        break;
      case 'checklist':
        insertion = `\n- [ ] ${selectedText || 'new objective'}\n`;
        cursorOffset = insertion.length;
        break;
      case 'code':
        insertion = `\`\`\`typescript\n${selectedText || '// code segment'}\n\`\`\``;
        cursorOffset = insertion.length;
        break;
      case 'table':
        insertion = `\n| Column A | Column B |\n| --- | --- |\n| Info 1 | Info 2 |\n`;
        cursorOffset = insertion.length;
        break;
      default:
        break;
    }

    const newMarkdown = text.substring(0, start) + insertion + text.substring(end);
    setMarkdown(newMarkdown);
    
    // Resume focus
    setTimeout(() => {
      el.focus();
      if (selectedText) {
        el.setSelectionRange(start + insertion.length, start + insertion.length);
      } else if (cursorOffset) {
        el.setSelectionRange(cursorOffset, cursorOffset);
      }
    }, 10);
  };

  return (
    <div 
      className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden ${
        dragActive ? 'border-indigo-500 ring-2 ring-indigo-500/10 scale-[0.995]' : 'border-slate-200/85'
      }`} 
      id="markdown-previewer"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {/* Top Banner indicating Drag & Drop Active state */}
      {dragActive && (
        <div className="bg-indigo-600 text-white text-center py-2 text-xs font-semibold animate-pulse flex items-center justify-center gap-1.5 z-50">
          <FileUp className="w-4 h-4" /> Drop your README.md file now to instantly load!
        </div>
      )}

      {/* Header Panel with Stats Badges */}
      <div className="border-b border-slate-100 bg-slate-50/40 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm flex-shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Interactive GFM Canvas</h2>
            <p className="text-xs text-slate-500 mt-0.5">Edit in high-congruency split panels or drag-and-drop live .md files.</p>
          </div>
        </div>

        {/* Dynamic Analytics Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Word Count */}
          <div className="bg-slate-100 border border-slate-200/60 rounded-lg px-2.5 py-1 flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-mono text-slate-650 font-bold">{stats.words} words</span>
          </div>

          {/* Reading Time */}
          <div className="bg-slate-100 border border-slate-200/60 rounded-lg px-2.5 py-1 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-mono text-slate-650 font-bold">{stats.readTimeMins} min read</span>
          </div>

          {/* Checklist Completeness Percentage */}
          {stats.totalChecks > 0 && (
            <div className={`border rounded-lg px-2.5 py-1 flex items-center space-x-1.5 ${
              stats.checkRatio === 100 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-indigo-50/70 border-indigo-150 text-indigo-700'
            }`}>
              <CheckSquare className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold font-mono">
                {stats.checkedCount}/{stats.totalChecks} ({stats.checkRatio}%) Objectives
              </span>
            </div>
          )}

          {/* Badge detection counts */}
          {stats.badgeCount > 0 && (
            <div className="bg-amber-55/40 bg-amber-50 border border-amber-200/60 rounded-lg px-2.5 py-1 flex items-center space-x-1.5 text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-mono font-bold">{stats.badgeCount} shields</span>
            </div>
          )}
        </div>
      </div>

      {/* Blueprints and Load Library Toggles */}
      <div className="bg-white border-b border-slate-100 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Core Templates
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  setSelectedTemplateId(tmpl.id);
                  setMarkdown(tmpl.markdown);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                  selectedTemplateId === tmpl.id
                    ? 'bg-indigo-600 border-indigo-700 text-white font-semibold shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* File Drag / Selector Action */}
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept=".md,text/markdown,text/plain"
            className="hidden" 
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 text-slate-700 cursor-pointer shadow-sm"
          >
            <FileUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload README.md</span>
          </button>
        </div>
      </div>

      {/* GFM Live Toolbar */}
      <div className="bg-slate-50/70 border-b border-slate-100 py-2.5 px-5 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <button onClick={() => handleInsertShortcut('header')} className="p-1.5 text-slate-550 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer" title="Header">
            <span className="text-xs font-bold leading-none">H2</span>
          </button>
          <button onClick={() => handleInsertShortcut('bold')} className="p-1.5 text-slate-550 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer" title="Bold text">
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleInsertShortcut('italic')} className="p-1.5 text-slate-550 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer" title="Italic text">
            <Italic className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <button onClick={() => handleInsertShortcut('list')} className="p-1.5 text-slate-550 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer" title="Bullet List">
            <List className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleInsertShortcut('checklist')} className="p-1.5 text-slate-550 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer" title="Checklist">
            <ChecksIcon className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <button onClick={() => handleInsertShortcut('link')} className="p-1.5 text-slate-550 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer" title="Link">
            <Link className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleInsertShortcut('image')} className="p-1.5 text-slate-550 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer" title="Image badge">
            <Image className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleInsertShortcut('table')} className="p-1.5 text-slate-550 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer" title="Data Table">
            <Table className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleInsertShortcut('code')} className="p-1.5 text-slate-550 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer" title="Code Block">
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Workspace Display Nav tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-100/80 p-0.5.5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'split' ? 'bg-white text-slate-800 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Split Panel</span>
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'edit' ? 'bg-white text-slate-800 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Type className="w-3.5 h-3.5 text-indigo-600" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'preview' ? 'bg-white text-slate-800 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Preview Only</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid featuring Sidebar outline */}
      <div className="flex h-[540px] border-b border-slate-100" id="editor-preview-container">
        
        {/* Outline Navigator Sidebar - Collapsed/hidden on small screens, shown in split tab */}
        {activeTab === 'split' && stats.headers.length > 0 && (
          <div className="hidden lg:flex flex-col w-56 border-r border-slate-200/80 bg-slate-50/50 p-4 shrink-0 overflow-y-auto" id="headers-outline-sidebar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1 shrink-0">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Document Outline
            </span>
            <div className="space-y-1.5 text-xs" id="outline-inner-list">
              {stats.headers.map((hdr, index) => (
                <div 
                  key={index}
                  className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors select-none py-0.5"
                  style={{ paddingLeft: `${(hdr.level - 1) * 10}px` }}
                >
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mr-1" />
                  <span className="truncate font-medium cursor-default" title={hdr.text}>{hdr.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEFT WORKSPACE CODE EDITOR */}
        {(activeTab === 'split' || activeTab === 'edit') && (
          <div className="flex flex-1 bg-slate-900 overflow-hidden relative" id="editor-textarea-holder">
            {/* Fine line numbers indicator column */}
            <div className="px-2 py-4 text-right bg-slate-950/40 text-slate-600 font-mono text-[11px] leading-6 flex-shrink-0 w-11 select-none overflow-hidden">
              {Array.from({ length: Math.max(1, lineCount) }).map((_, idx) => (
                <div key={idx} className="h-6 leading-6 text-slate-650 opacity-40">
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Editor textarea */}
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => {
                setMarkdown(e.target.value);
                setSelectedTemplateId(''); // unlink template preset state
              }}
              onScroll={handleScroll}
              className="flex-1 p-4 bg-transparent outline-none resize-none overflow-y-auto font-mono text-sm leading-6 text-slate-100 placeholder-slate-700 w-full"
              placeholder="# Begin writing GFM document here..."
            />
          </div>
        )}

        {/* RIGHT HTML CANVAS PREVIEW */}
        {(activeTab === 'split' || activeTab === 'preview') && (
          <div 
            ref={previewRef}
            className="flex-1 p-8 overflow-auto bg-white"
            id="gfm-preview-pane"
          >
            {/* CSS typography style specifications directly on elements */}
            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-[13.5px] h-full pr-1.5 w-full">
              <style>{`
                .prose table { width: 100%; border-collapse: collapse; margin-top: 1.25em; margin-bottom: 1.25em; border: 1px solid #e1e8f0; font-size: 13px; }
                .prose th { background-color: #f8fafc; font-weight: 600; padding: 0.5rem 0.7rem; border: 1px solid #e1e8f0; text-align: left; }
                .prose td { padding: 0.5rem 0.7rem; border: 1px solid #e1e8f0; }
                .prose pre { padding: 0.95rem; border-radius: 0.6rem; background-color: #0d1117; color: #c9d1d9; border: 1px solid #30363d; font-size: 12px; margin: 1em 0; overflow-x: auto; }
                .prose blockquote { border-left-width: 4px; border-left-color: #e1e8f0; padding-left: 1rem; color: #57606a; font-style: italic; margin-top: 1em; margin-bottom: 1em; }
                .prose a { color: #0969da; text-decoration: none; font-weight: 500; }
                .prose a:hover { text-decoration: underline; }
                .prose h1 { border-bottom: 1px solid #d8dee4; padding-bottom: 0.3em; font-size: 1.75em; font-weight: 700; color: #0f172a; margin-top: 0.4em; margin-bottom: 0.6em; }
                .prose h2 { border-bottom: 1px solid #d8dee4; padding-bottom: 0.3em; font-size: 1.4em; font-weight: 600; color: #1e293b; margin-top: 1.3em; margin-bottom: 0.5em; }
                .prose h3 { font-size: 1.15em; font-weight: 600; color: #334155; margin-top: 1.1em; margin-bottom: 0.4em; }
                .prose hr { margin-top: 1.5em; margin-bottom: 1.5em; border: 0; border-bottom: 1px solid #d8dee4; }
                .prose ul { list-style-type: disc; padding-left: 1.5em; margin-top: 0.5em; margin-bottom: 0.5em; }
                .prose li { margin-top: 0.25em; margin-bottom: 0.25em; }
                .prose img { display: inline-block; vertical-align: middle; margin: 2px; }
              `}</style>
              
              <div dangerouslySetInnerHTML={{ __html: compiledHtml }} />
            </div>
          </div>
        )}

      </div>

      {/* Bottom bar with action shortcuts info */}
      <div className="bg-slate-50/50 px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-slate-500 gap-2">
        <span className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
          <span>💡 Tip: Select text and click toolbar buttons (like <strong className="text-slate-700">Bold</strong> or <strong className="text-slate-700">Code</strong>) to wrap snippets automatically!</span>
        </span>
        <button 
          onClick={copyRawMarkdown} 
          className="font-semibold text-indigo-650 text-indigo-600 hover:text-indigo-805 hover:underline flex items-center gap-1 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied code to clipboard!' : 'Copy raw GFM code'}</span>
        </button>
      </div>

    </div>
  );
}
