# Changelog

All notable changes to **Live Readme & Badge Designer** are documented here.

## [1.1.0] - 2026-05-31

### Added
- Interactive GFM Markdown split-panel editor with live preview
- Shields.io Badge Builder with 3000+ brand icon support via Simple Icons
- VS Code Desktop Bridge Studio — simulates `postMessage` between editor and webview
- Document outline sidebar showing H1–H3 headers
- Document analytics: word count, reading time, checklist completion %
- Drag-and-drop `.md` file loading
- One-click Markdown / HTML / URL badge format exporters
- Sync-scrolling between editor and preview pane
- Emoji shortcode rendering (`:rocket:`, `:fire:`, etc.)
- GFM task list checkbox rendering
- Code syntax highlighting via highlight.js (GitHub theme)
- Toolbar shortcuts: Bold, Italic, Link, Image, Table, Code, Checklist, List

### Changed
- Upgraded to React 19, Vite 6, Tailwind CSS v4
- Extension engine minimum bumped to VS Code `^1.90.0`

### Fixed
- Webview initial content sync now uses proper `ready` message handshake instead of `setTimeout`
- Asset URI paths correctly rewritten for VS Code webview security policy

## [1.0.0] - 2026-04-01

### Added
- Initial release with basic Markdown preview panel
- Basic Shields.io badge URL generator
