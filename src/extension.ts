/**
 * @license
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Mehak Sandhu
 */

import * as vscode from 'vscode';

let panel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('live-readme.openPreview', () => {
        const activeEditor = vscode.window.activeTextEditor;

        if (panel) {
            panel.reveal(vscode.ViewColumn.Two);
        } else {
            panel = vscode.window.createWebviewPanel(
                'liveReadmePreview',
                'Live Readme Preview',
                vscode.ViewColumn.Two,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                }
            );

            panel.onDidDispose(() => { panel = undefined; }, null, context.subscriptions);
        }

        panel.webview.html = getPreviewHtml(panel.webview);

        // Send current file content once webview is ready
        panel.webview.onDidReceiveMessage((msg) => {
            if (msg.type === 'ready') {
                if (activeEditor && activeEditor.document.languageId === 'markdown') {
                    panel!.webview.postMessage({ type: 'update', content: activeEditor.document.getText() });
                } else {
                    panel!.webview.postMessage({
                        type: 'update',
                        content: '# Open a Markdown file\n\nOpen any `.md` file in the editor to see a **live rendered preview** here.\n\nChanges sync in real-time as you type. ✨'
                    });
                }
            }
        }, undefined, context.subscriptions);

        // Live update as user types
        const changeDoc = vscode.workspace.onDidChangeTextDocument((event) => {
            if (panel && event.document === vscode.window.activeTextEditor?.document) {
                panel.webview.postMessage({ type: 'update', content: event.document.getText() });
            }
        });

        // Switch preview when user opens a different .md file
        const changeEditor = vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (panel && editor && editor.document.languageId === 'markdown') {
                panel.webview.postMessage({ type: 'update', content: editor.document.getText() });
            }
        });

        panel.onDidDispose(() => {
            changeDoc.dispose();
            changeEditor.dispose();
        }, null, context.subscriptions);
    });

    context.subscriptions.push(disposable);
}

function getPreviewHtml(webview: vscode.Webview): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'none';
    img-src https: data: ${webview.cspSource};
    style-src 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
    script-src 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
    font-src https://cdnjs.cloudflare.com;
  "/>
  <title>Live Readme Preview</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 15px;
      line-height: 1.7;
      color: #24292f;
      background: #ffffff;
      padding: 32px 40px 64px;
      max-width: 860px;
      margin: 0 auto;
    }

    /* Headings */
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      line-height: 1.3;
      color: #1f2328;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; margin-top: 0; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }

    /* Paragraphs & spacing */
    p { margin-bottom: 1em; }

    /* Links */
    a { color: #0969da; text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* Images — render badges inline */
    img { max-width: 100%; vertical-align: middle; }

    /* Code */
    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 85%;
      background: #f6f8fa;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      padding: 0.2em 0.4em;
      color: #e36209;
    }
    pre {
      background: #f6f8fa;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
      margin-bottom: 1em;
    }
    pre code {
      background: transparent;
      border: none;
      padding: 0;
      color: inherit;
      font-size: 13px;
    }

    /* Blockquote */
    blockquote {
      border-left: 4px solid #d0d7de;
      padding: 0 16px;
      color: #57606a;
      margin: 0 0 1em;
    }

    /* Tables */
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1em;
      display: block;
      overflow-x: auto;
    }
    th, td {
      border: 1px solid #d0d7de;
      padding: 8px 13px;
      text-align: left;
    }
    th { background: #f6f8fa; font-weight: 600; }
    tr:nth-child(even) td { background: #f6f8fa; }

    /* Task lists */
    .task-list-item { list-style: none; }
    .task-list-item input { margin-right: 6px; }
    ul, ol { padding-left: 2em; margin-bottom: 1em; }
    li { margin-bottom: 0.25em; }

    /* Horizontal rule */
    hr {
      border: none;
      border-top: 1px solid #d0d7de;
      margin: 2em 0;
    }

    /* Align center for divs (common in READMEs) */
    div[align="center"], div[align="middle"] {
      text-align: center;
    }
    div[align="center"] img, div[align="middle"] img {
      display: inline-block;
    }

    /* Badge row spacing */
    p > img + img { margin-left: 4px; }

    /* Loading state */
    #loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60vh;
      color: #57606a;
      font-size: 14px;
      gap: 8px;
    }
  </style>
</head>
<body>
  <div id="loading">⏳ Waiting for markdown content…</div>
  <div id="preview" style="display:none"></div>

  <script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>
    const vscode = acquireVsCodeApi();
    const preview = document.getElementById('preview');
    const loading = document.getElementById('loading');

    // Configure marked
    marked.use({
      gfm: true,
      breaks: false,
      renderer: (() => {
        const r = new marked.Renderer();
        // Render task list checkboxes
        r.listitem = (text, task, checked) => {
          if (task) {
            return '<li class="task-list-item"><input type="checkbox"' + (checked ? ' checked' : '') + ' disabled> ' + text + '</li>';
          }
          return '<li>' + text + '</li>';
        };
        return r;
      })()
    });

    function render(content) {
      try {
        preview.innerHTML = marked.parse(content);
        // Syntax highlight all code blocks
        preview.querySelectorAll('pre code').forEach(el => {
          hljs.highlightElement(el);
        });
        loading.style.display = 'none';
        preview.style.display = 'block';
      } catch (e) {
        preview.innerHTML = '<p style="color:red">Error rendering markdown: ' + e.message + '</p>';
      }
    }

    // Listen for content updates from extension
    window.addEventListener('message', event => {
      if (event.data.type === 'update') {
        render(event.data.content);
      }
    });

    // Tell extension we are ready
    vscode.postMessage({ type: 'ready' });
  </script>
</body>
</html>`;
}

export function deactivate() {}
