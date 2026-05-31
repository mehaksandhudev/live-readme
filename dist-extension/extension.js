var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var path = __toESM(require("path"));
var fs = __toESM(require("fs"));
function activate(context) {
  let disposable = vscode.commands.registerCommand("live-readme.openPreview", () => {
    const panel = vscode.window.createWebviewPanel(
      "liveReadmePreview",
      "Live Readme Studio",
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, "dist"))
        ]
      }
    );
    panel.webview.html = getWebviewContent(panel.webview, context);
    panel.webview.onDidReceiveMessage(
      (message) => {
        if (message.type === "webview_ready") {
          const activeEditor = vscode.window.activeTextEditor;
          if (activeEditor && activeEditor.document.languageId === "markdown") {
            panel.webview.postMessage({
              type: "vscode_simulator_update",
              text: activeEditor.document.getText()
            });
          }
        }
      },
      void 0,
      context.subscriptions
    );
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document === vscode.window.activeTextEditor?.document && event.document.languageId === "markdown") {
        panel.webview.postMessage({
          type: "vscode_simulator_update",
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
function getWebviewContent(webview, context) {
  const distPath = path.join(context.extensionPath, "dist");
  const indexPath = path.join(distPath, "index.html");
  if (!fs.existsSync(indexPath)) {
    return `<!DOCTYPE html><html><body><h3 style="font-family:sans-serif;padding:2rem;color:#ef4444;">
            Live Readme build output not found.<br/>
            Run <code>npm run build</code> in the extension directory.
        </h3></body></html>`;
  }
  let htmlContent = fs.readFileSync(indexPath, "utf-8");
  htmlContent = htmlContent.replace(/(href|src)="\/assets\/([^"]+)"/g, (match, attr, assetPath) => {
    const assetFile = path.join(distPath, "assets", assetPath);
    const assetUri = webview.asWebviewUri(vscode.Uri.file(assetFile));
    return `${attr}="${assetUri}"`;
  });
  return htmlContent;
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
