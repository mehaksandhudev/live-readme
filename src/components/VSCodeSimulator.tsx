import React, { useState, useEffect, useRef } from 'react';
import { 
  FileCode, Terminal, HelpCircle, Copy, Check, Code, Play, 
  Settings, FolderOpen, Send, Info, Monitor 
} from 'lucide-react';

const EXTENSION_CODE = `import * as vscode from 'vscode';
import * as path from 'path';

// Active extension entry point trigger
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('gfm-badge-suite.openPreview', () => {
        // 1. Create and show a new Webview Editor panel
        const panel = vscode.window.createWebviewPanel(
            'gfmMarkdownPreview',
            'GFM Webview Preview',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
            }
        );

        // 2. Load primary Webview Panel HTML layout
        panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

        // 3. Bind active document event listener captures
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((event) => {
            if (event.document === vscode.window.activeTextEditor?.document) {
                // Stream updated string variables instantly
                panel.webview.postMessage({
                    type: 'update',
                    text: event.document.getText()
                });
            }
        });

        // Clean up visual event listener on closure
        panel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        }, null, context.subscriptions);
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    return \`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>GFM Render</title>
    </head>
    <body style="font-family: sans-serif; padding: 20px;">
        <h1 id="header">Waiting for VS Code text...</h1>
        <div id="content"></div>
        <script>
            // 4. Mount event listener to catch asynchronous message variables
            window.addEventListener('message', event => {
                const message = event.data;
                if (message.type === 'update') {
                    document.getElementById('header').innerText = "Live Synced GFM";
                    document.getElementById('content').innerHTML = "<em>Markdown length: </em>" + message.text.length;
                }
            });
        </script>
    </body>
    </html>\`;
}`;

const PACKAGE_JSON_CODE = `{
  "name": "gfm-badge-suite",
  "displayName": "GitHub GFM & Badge Suite Preview",
  "description": "Interactive Visual shields.io utility and side-by-side GFM rendering previewer panel",
  "version": "1.0.0",
  "publisher": "developer",
  "engines": {
    "vscode": "^1.80.0"
  },
  "categories": [
    "Other",
    "Visualization",
    "Formatters"
  ],
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "gfm-badge-suite.openPreview",
        "title": "GFM: Open Interactive Preview",
        "category": "GFM Suite"
      }
    ],
    "menus": {
      "editor/title": [
        {
          "command": "gfm-badge-suite.openPreview",
          "group": "navigation",
          "when": "editorLangId == markdown"
        }
      ]
    }
  }
}`;

export default function VSCodeSimulator() {
  const [vscodeText, setVscodeText] = useState(
    `# Active Document (README.md)\n\nType something here to trigger a simulated \n\`vscode.workspace.onDidChangeTextDocument\` message!\n\n- [x] Stream parameters\n- [ ] Deploy live`
  );
  
  const [eventLogs, setEventLogs] = useState<Array<{ id: number; timestamp: string; label: string; details: string; type: 'info' | 'success' | 'send' }>>([]);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'simulator' | 'src-extension' | 'src-package'>('simulator');
  const logCounter = useRef(0);

  // Trigger simulated postMessage to webview panel on change
  useEffect(() => {
    const now = new Date().toLocaleTimeString();
    logCounter.current += 1;
    
    const newLog = {
      id: logCounter.current,
      timestamp: now,
      label: 'vscode.workspace.onDidChangeTextDocument',
      details: `Streaming postMessage string. Length: ${vscodeText.length} bytes.`,
      type: 'send' as const
    };

    setEventLogs((prev) => [newLog, ...prev.slice(0, 5)]);

    const messageEvent = new MessageEvent('message', {
      data: {
        type: 'vscode_simulator_update',
        text: vscodeText
      }
    });
    window.dispatchEvent(messageEvent);

  }, [vscodeText]);

  // Handle simulated message reception inside mock webview
  const [simulatedWebviewHtml, setSimulatedWebviewHtml] = useState('');
  useEffect(() => {
    const handleReceivedMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'vscode_simulator_update') {
        const text = e.data.text;
        
        let htmlPreview = `
          <div class="prose prose-sm prose-invert">
            <h1 class="text-[#f8fafc] text-sm font-bold border-b border-zinc-800 pb-2 flex items-center gap-1.5">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> 
              Simulated Extension Webview Panel
            </h1>
            <p class="text-[10px] text-zinc-550 text-zinc-400 mt-1">Executing sandboxed micro-compile runtime</p>
            <div class="mt-4 p-3.5 bg-zinc-950/80 rounded-lg border border-zinc-800 font-mono text-xs text-indigo-200 leading-relaxed max-h-56 overflow-auto">
              ${text.replace(/\n/g, '<br/>')}
            </div>
          </div>
        `;
        setSimulatedWebviewHtml(htmlPreview);
      }
    };

    window.addEventListener('message', handleReceivedMessage);
    return () => window.removeEventListener('message', handleReceivedMessage);
  }, []);

  const clearLogs = () => {
    setEventLogs([]);
  };

  const copyToClipboard = (type: string, text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 1800);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" id="vscode-integration-panel">
      
      {/* Title Header */}
      <div className="border-b border-slate-100 bg-slate-50/40 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Monitor className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">VS Code Desktop Bridge Studio</h2>
            <p className="text-xs text-slate-500 mt-0.5">Simulate and review desktop environment message passing structures.</p>
          </div>
        </div>

        {/* Workspace state controller tab selectors */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg self-start md:self-auto">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'simulator' ? 'bg-white text-slate-800 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('src-extension')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'src-extension' ? 'bg-white text-slate-800 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-650" />
            <span>extension.ts Blueprint</span>
          </button>
          <button
            onClick={() => setActiveTab('src-package')}
            className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'src-package' ? 'bg-white text-slate-800 font-bold shadow-sm' : 'text-slate-550 hover:text-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-emerald-650" />
            <span>package.json Manifest</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        
        {/* VIEW 1: INTERACTIVE SIMULATOR CLIENT-SIDE */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex items-start space-x-3 shadow-inner">
              <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-655 text-slate-600 leading-relaxed">
                <strong>How it works:</strong> Updates in the simulated README.md trigger a live 
                <code className="bg-white border border-slate-200 px-1 py-0.5 rounded mx-1 text-slate-850 font-mono">vscode.workspace.onDidChangeTextDocument</code> 
                event. The extension channels it instantly using a 
                <code className="bg-white border border-slate-200 px-1 py-0.5 rounded mx-1 text-slate-850 font-mono">panel.webview.postMessage</code> 
                call to process data inside the isolated iframe sandbox without freezing standard execution threads.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Mock VS Code Active Code Editor */}
              <div className="lg:col-span-6 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col overflow-hidden h-[330px] shadow-sm">
                <div className="bg-zinc-950 px-4 py-2 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]"></span>
                    <div className="h-3.5 w-px bg-zinc-800 mx-1.5"></div>
                    <span className="font-mono text-[10px] text-zinc-400 font-bold tracking-wider flex items-center gap-1">
                      <FolderOpen className="w-3 h-3 text-indigo-400" /> workspace/README.md
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-500 uppercase font-bold bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded-md">
                    Active Editor
                  </span>
                </div>
                
                <textarea
                  value={vscodeText}
                  onChange={(e) => setVscodeText(e.target.value)}
                  className="flex-grow p-4 bg-transparent outline-none resize-none font-mono text-xs text-zinc-200 leading-relaxed overflow-y-auto"
                  placeholder="# Write code in mock file editor..."
                />
              </div>

              {/* Mock Webview iframe simulation */}
              <div className="lg:col-span-6 bg-[#090d16] rounded-xl border border-slate-800 flex flex-col overflow-hidden h-[330px] shadow-sm">
                <div className="bg-[#04070d] px-4 py-2 flex items-center justify-between border-b border-slate-900">
                  <span className="font-mono text-[9px] font-bold text-amber-500 uppercase tracking-wider bg-amber-950/40 border border-amber-900/30 px-2 py-0.5 rounded-md">
                    Sandboxed Webview
                  </span>
                  <span className="font-mono text-[9px] text-zinc-500">Iframe sandbox context</span>
                </div>
                <div 
                  className="flex-grow p-5.5 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: simulatedWebviewHtml }}
                />
              </div>

            </div>

            {/* Simulated Event Trace Logs */}
            <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden font-mono shadow-sm">
              <div className="bg-zinc-900/60 px-4 py-2.5 border-b border-zinc-900 flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Channel Event Dispatch stream:
                </span>
                <button
                  onClick={clearLogs}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Clear console log
                </button>
              </div>
              <div className="p-3 max-h-36 overflow-auto text-xs space-y-1.5 text-zinc-300">
                {eventLogs.length === 0 ? (
                  <div className="text-zinc-650 text-[11px] italic text-center py-4 text-zinc-400">Stream empty. Modify the Active Editor buffer to dispatch events.</div>
                ) : (
                  eventLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2.5 text-[11px] leading-relaxed">
                      <span className="text-indigo-500">[{log.timestamp}]</span>
                      <span className="text-emerald-500 font-bold">{log.label}</span>
                      <span className="text-zinc-500">→</span>
                      <span className="text-zinc-350">{log.details}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: EXTENSION CODE */}
        {activeTab === 'src-extension' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">packages/vscode-extension/src/extension.ts</span>
              <button
                onClick={() => copyToClipboard('ext', EXTENSION_CODE)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer text-xs"
              >
                {copiedType === 'ext' ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3 h-3 mr-1" />}
                {copiedType === 'ext' ? 'Copied' : 'Copy code'}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4.5 rounded-xl text-xs font-mono overflow-auto max-h-[380px] border border-slate-800 leading-relaxed shadow-inner">
              {EXTENSION_CODE}
            </pre>
          </div>
        )}

        {/* VIEW 3: PACKAGE JSON */}
        {activeTab === 'src-package' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">packages/vscode-extension/package.json</span>
              <button
                onClick={() => copyToClipboard('pkg', PACKAGE_JSON_CODE)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer text-xs"
              >
                {copiedType === 'pkg' ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3 h-3 mr-1" />}
                {copiedType === 'pkg' ? 'Copied' : 'Copy code'}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4.5 rounded-xl text-xs font-mono overflow-auto max-h-[380px] border border-slate-800 leading-relaxed shadow-inner">
              {PACKAGE_JSON_CODE}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}
