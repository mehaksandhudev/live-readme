<div align="center">
  <img width="128" height="128" alt="Live Readme Logo" src="assets/icon.png" />
  <h1>Live Readme & Badge Designer</h1>
  <p><strong>Interactive GFM Markdown preview + Shields.io badge builder for VS Code</strong></p>

  [![Version](https://img.shields.io/badge/version-1.1.0-indigo?logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=mehaksandhudev.live-readme-studio)
  [![License](https://img.shields.io/badge/license-MIT-emerald?logo=opensourceinitiative)](https://github.com/mehaksandhudev/live-readme/blob/main/LICENSE)
  [![Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue?logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=mehaksandhudev.live-readme-studio)
  [![GitHub](https://img.shields.io/badge/GitHub-mehaksandhudev-black?logo=github)](https://github.com/mehaksandhudev/live-readme)
</div>

---

## ✨ Features

### 📝 Live GFM Markdown Editor
- **Split-panel editor** — write on the left, see GitHub-accurate preview on the right
- **Sync scrolling** — editor and preview scroll in perfect sync
- **Drag & drop** `.md` files directly into the panel to load them instantly
- **Document analytics** — live word count, reading time, checklist completion %
- **Document outline** sidebar — H1–H3 header navigator
- **Emoji shortcodes** — `:rocket:` → 🚀, `:fire:` → 🔥, and more
- **GFM task list** checkboxes rendered correctly
- **Syntax highlighting** — code blocks highlighted via highlight.js (GitHub theme)

### 🛡️ Shields.io Badge Builder
- Live SVG badge preview directly from [shields.io](https://shields.io)
- **3000+ brand icons** from the Simple Icons registry
- Choose from preset styles: Flat, Flat Square, Plastic, For-the-Badge, Social
- Custom hex color picker
- One-click copy in **3 formats**: Markdown link, Raw URL, HTML `<img>` tag
- Preset blueprints: MIT License, Build Status, Coverage, NPM Version, Issues

### 🖥️ VS Code Bridge Studio
- Simulates the full `postMessage` communication between VS Code editor and webview
- View `extension.ts` and `package.json` source code with one-click copy
- Live event dispatch log for debugging message passing

---

## 🚀 Usage

1. Open any `.md` file in VS Code
2. Click the **Live Readme** button in the editor title bar (top right)  
   — or use the Command Palette: `Ctrl+Shift+P` → **"Live Readme: Open Interactive Preview"**
3. The interactive panel opens in a split view beside your file

---

## 📦 Installation

### From VS Code Marketplace
Search **"Live Readme"** in the Extensions panel (`Ctrl+Shift+X`) or visit the [Marketplace page](https://marketplace.visualstudio.com/items?itemName=mehaksandhudev.live-readme-studio).

### From VSIX (manual)
```bash
code --install-extension live-readme-studio-1.1.0.vsix
```

---

## 🛠️ Local Development

```bash
# Clone the repo
git clone https://github.com/mehaksandhudev/live-readme.git
cd live-readme

# Install dependencies
npm install

# Run the web UI locally (port 3000)
npm run dev

# Build the VS Code extension
npm run build

# Package the .vsix
npm run package
```

---

## 🐳 Docker (Web UI)

```bash
docker pull mehakxsandhu/live-readme:latest
docker run -p 8080:80 mehakxsandhu/live-readme:latest
```

Then open [http://localhost:8080](http://localhost:8080)

---

## 📁 Project Structure

```
live-readme/
├── src/
│   ├── extension.ts          # VS Code extension entry point
│   ├── App.tsx               # Main React app
│   └── components/
│       ├── BadgeBuilder.tsx   # Shields.io badge builder
│       ├── MarkdownPreview.tsx # GFM live editor & preview
│       └── VSCodeSimulator.tsx # VS Code bridge simulator
├── assets/
│   └── icon.png              # Extension icon
├── Dockerfile                # Multi-stage Docker build
└── package.json
```

---

## 📄 License

MIT © [Mehak Sandhu](https://mehak-sandhu.in) · [live-readme.mehak-sandhu.in](https://live-readme.mehak-sandhu.in)
