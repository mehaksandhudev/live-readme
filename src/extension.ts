import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('live-readme.openPreview', () => {
        const panel = vscode.window.createWebviewPanel(
            'liveReadmePreview',
            'Live Readme Studio',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'dist'))
                ]
            }
        );

        panel.webview.html = getWebviewContent(panel.webview, context);

        // Wait for the webview React app to signal it is ready before sending content
        panel.webview.onDidReceiveMessage(
            (message) => {
                if (message.type === 'webview_ready') {
                    // Webview is ready — send initial markdown if active editor is markdown
                    const activeEditor = vscode.window.activeTextEditor;
                    if (activeEditor && activeEditor.document.languageId === 'markdown') {
                        panel.webview.postMessage({
                            type: 'vscode_simulator_update',
                            text: activeEditor.document.getText()
                        });
                    }
                }
            },
            undefined,
            context.subscriptions
        );

        // Track active text document changes to sync with webview
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((event) => {
            if (
                event.document === vscode.window.activeTextEditor?.document &&
                event.document.languageId === 'markdown'
            ) {
                panel.webview.postMessage({
                    type: 'vscode_simulator_update',
                    text: event.document.getText()
                });
            }
        });

        panel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        }, null, context.subscriptions);
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(webview: vscode.Webview, context: vscode.ExtensionContext): string {
    const distPath = path.join(context.extensionPath, 'dist');
    const indexPath = path.join(distPath, 'index.html');

    if (!fs.existsSync(indexPath)) {
        return `<!DOCTYPE html><html><body><h3 style="font-family:sans-serif;padding:2rem;color:#ef4444;">
            Live Readme build output not found.<br/>
            Run <code>npm run build</code> in the extension directory.
        </h3></body></html>`;
    }

    let htmlContent = fs.readFileSync(indexPath, 'utf-8');

    // Replace relative asset paths with VS Code Webview Resource URIs
    htmlContent = htmlContent.replace(/(href|src)="\/assets\/([^"]+)"/g, (match, attr, assetPath) => {
        const assetFile = path.join(distPath, 'assets', assetPath);
        const assetUri = webview.asWebviewUri(vscode.Uri.file(assetFile));
        return `${attr}="${assetUri}"`;
    });

    return htmlContent;
}

export function deactivate() {}
