import React, { useState, useMemo } from 'react';
import { Copy, Check, Search, Shield, Sparkles, Sliders, Layout, Layers, Wand2 } from 'lucide-react';

interface BadgePreset {
  id: string;
  name: string;
  label: string;
  message: string;
  color: string;
  icon: string;
  style: string;
  description: string;
}

const PRESETS: BadgePreset[] = [
  {
    id: 'license-mit',
    name: 'MIT License',
    label: 'license',
    message: 'MIT',
    color: 'emerald',
    icon: 'git',
    style: 'flat',
    description: 'Permissive open source licensing'
  },
  {
    id: 'build-passing',
    name: 'Build Status',
    label: 'build',
    message: 'passing',
    color: 'success',
    icon: 'githubactions',
    style: 'flat-square',
    description: 'CI/CD pipeline status flow'
  },
  {
    id: 'coverage-high',
    name: 'Coverage',
    label: 'coverage',
    message: '94%',
    color: 'success',
    icon: 'codecov',
    style: 'flat',
    description: 'Test suite coverage metrics'
  },
  {
    id: 'issues-active',
    name: 'Issues Tracker',
    label: 'issues',
    message: '12 open',
    color: 'orange',
    icon: 'github',
    style: 'for-the-badge',
    description: 'Open bug/feature request tracker'
  },
  {
    id: 'version',
    name: 'NPM Version',
    label: 'npm',
    message: 'v2.4.0',
    color: 'blue',
    icon: 'npm',
    style: 'flat',
    description: 'Public library release version'
  }
];

const SHIELD_COLORS = [
  { name: 'Bright Green', value: 'brightgreen', hex: '#4c1' },
  { name: 'Green', value: 'green', hex: '#97ca00' },
  { name: 'Yellow', value: 'yellow', hex: '#dfb317' },
  { name: 'Orange', value: 'orange', hex: '#fe7d37' },
  { name: 'Red', value: 'red', hex: '#e05d44' },
  { name: 'Blue', value: 'blue', hex: '#007ec6' },
  { name: 'Dark Grey', value: 'darkgray', hex: '#555' },
  { name: 'Light Grey', value: 'lightgrey', hex: '#9f9f9f' },
];

const POPULAR_BRANDS = [
  { name: 'GitHub', slug: 'github' },
  { name: 'GitHub Actions', slug: 'githubactions' },
  { name: 'React', slug: 'react' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'Node.js', slug: 'nodedotjs' },
  { name: 'NPM', slug: 'npm' },
  { name: 'Docker', slug: 'docker' },
  { name: 'Python', slug: 'python' },
  { name: 'Rust', slug: 'rust' },
  { name: 'VS Code', slug: 'visualstudiocode' },
  { name: 'Tailwind CSS', slug: 'tailwindcss' },
  { name: 'Vitest', slug: 'vitest' },
  { name: 'Codecov', slug: 'codecov' },
  { name: 'Git', slug: 'git' },
  { name: 'Vite', slug: 'vite' },
  { name: 'Vercel', slug: 'vercel' },
  { name: 'Next.js', slug: 'nextdotjs' },
  { name: 'Google Cloud', slug: 'googlecloud' },
  { name: 'Figma', slug: 'figma' }
];

const SHIELD_STYLES = [
  { key: 'flat', label: 'Flat' },
  { key: 'flat-square', label: 'Flat Sq.' },
  { key: 'plastic', label: 'Plastic' },
  { key: 'for-the-badge', label: 'Large Badge' },
  { key: 'social', label: 'Social' }
];

export default function BadgeBuilder() {
  const [label, setLabel] = useState('build');
  const [message, setMessage] = useState('passing');
  const [color, setColor] = useState('brightgreen');
  const [customColor, setCustomColor] = useState('');
  const [icon, setIcon] = useState('githubactions');
  const [brandSearch, setBrandSearch] = useState('');
  const [shieldStyle, setShieldStyle] = useState('flat');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Filter local visual presets based on user text query search
  const filteredBrands = useMemo(() => {
    if (!brandSearch) return POPULAR_BRANDS;
    return POPULAR_BRANDS.filter(brand => 
      brand.name.toLowerCase().includes(brandSearch.toLowerCase()) || 
      brand.slug.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [brandSearch]);

  const activeColorValue = useMemo(() => {
    if (customColor) {
      return customColor.trim().replace('#', '');
    }
    return color;
  }, [customColor, color]);

  // Build the live shields.io URL
  const badgeUrl = useMemo(() => {
    const encodedLabel = encodeURIComponent(label.trim() || 'badge');
    const encodedMessage = encodeURIComponent(message.trim() || 'status');
    const encodedColor = encodeURIComponent(activeColorValue || 'blue');
    const queryParts: string[] = [];
    if (icon) {
      queryParts.push(`logo=${encodeURIComponent(icon.trim())}`);
    }
    if (shieldStyle && shieldStyle !== 'flat') {
      queryParts.push(`style=${encodeURIComponent(shieldStyle)}`);
    }
    const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    return `https://img.shields.io/badge/${encodedLabel}-${encodedMessage}-${encodedColor}${query}`;
  }, [label, message, activeColorValue, icon, shieldStyle]);

  const selectPreset = (preset: BadgePreset) => {
    setLabel(preset.label);
    setMessage(preset.message);
    setShieldStyle(preset.style);
    setIcon(preset.icon);
    
    // Check if the color exists in Shield colors
    const matchedColor = SHIELD_COLORS.find(c => c.value === preset.color);
    if (matchedColor) {
      setColor(preset.color);
      setCustomColor('');
    } else {
      setColor('');
      setCustomColor(preset.color === 'success' ? '#34d399' : (preset.color === 'emerald' ? '#10b981' : '#4f46e5'));
    }
  };

  const notifyCopy = (type: string, text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 1800);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" id="badge-builder">
      {/* Module Title */}
      <div className="border-b border-slate-100 bg-slate-50/40 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-indigo-500" /> Shields.io Badge Builder
          </h2>
          <p className="text-xs text-slate-500 mt-1">Configure live dynamic visual SVG badges with searchable brand icon integration.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Sparkles className="w-3 h-3 mr-1" /> Custom Engine
          </span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Preset Blueprint Quick Toggles */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-indigo-500" /> Preset Blueprint Templates
            </span>
            <span className="text-[10px] text-slate-400">Click to instantly load configs</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className="flex flex-col items-start p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 rounded-xl transition-all duration-150 text-left group shadow-sm"
              >
                <span className="font-bold text-xs text-slate-700 group-hover:text-indigo-600 transition-colors truncate w-full">{preset.name}</span>
                <span className="font-mono text-[9px] text-slate-400 mt-1 bg-slate-50 px-1 py-0.5 rounded group-hover:bg-indigo-50 transition-colors">
                  {preset.label}:{preset.message}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Master Editing Workspace layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Panel (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sliders className="w-3.5 h-3.5 text-slate-500" /> Dynamic Configuration Values
            </h3>

            {/* Label and Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Badge Left Label</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. license"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Badge Right Message</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. MIT"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
              </div>
            </div>

            {/* Advanced Theme Color Selectors */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-500">Badge Background Color</label>
              
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {SHIELD_COLORS.map((col) => (
                  <button
                    key={col.value}
                    onClick={() => {
                      setColor(col.value);
                      setCustomColor('');
                    }}
                    className={`h-8 rounded-lg text-xs font-medium transition-all relative border flex items-center justify-center ${
                      color === col.value && !customColor
                        ? 'border-indigo-600 ring-2 ring-indigo-500 text-slate-800 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                    title={col.name}
                  >
                    <span 
                      className="w-3 h-3 rounded-full mr-1.5 flex-shrink-0" 
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="truncate pr-1">{col.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Custom HEX color box */}
              <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Use custom hexadecimal color picker:</span>
                <input
                  type="color"
                  value={customColor.startsWith('#') ? customColor : '#4f46e5'}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setColor('');
                  }}
                  className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                />
                <input
                  type="text"
                  placeholder="#4F46E5"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setColor('');
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-xs rounded-lg w-28 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono shadow-sm"
                />
              </div>
            </div>

            {/* Badge Visual Style selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-500 flex items-center gap-1">
                <Layout className="w-3.5 h-3.5 text-slate-400" /> Badge Visual Style
              </label>
              <div className="grid grid-cols-5 gap-2">
                {SHIELD_STYLES.map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setShieldStyle(st.key)}
                    className={`py-1.5 px-1 text-xs text-center border rounded-lg transition-all ${
                      shieldStyle === st.key
                        ? 'bg-slate-800 text-white border-slate-850 font-semibold'
                        : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Simple-Icons API Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Active Simple Icons Name Slug
                </label>
                <span className="text-[10px] text-indigo-500 font-semibold">Over 3000+ brands supported</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-3.5">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Write Custom Name / Slug directly:</span>
                  <input
                    type="text"
                    placeholder="E.g. vercel, nextdotjs, google, github, react..."
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-indigo-900 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
                  />
                  <p className="text-[10px] text-slate-400 leading-normal">
                    💡 Shields.io pulls SVG vectors dynamically from the Simple Icons registry. You can specify any valid slug like <code className="bg-slate-100 text-slate-700 px-1 rounded">vercel</code>, <code className="bg-slate-100 text-slate-700 px-1 rounded">nextdotjs</code>, <code className="bg-slate-100 text-slate-700 px-1 rounded">fastapi</code>, or <code className="bg-slate-100 text-slate-700 px-1 rounded">airbnb</code>!
                  </p>
                </div>

                {/* Popular brand selections list (Searchable helper chips) */}
                <div className="border-t border-slate-100 pt-3">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Or search popular brand quick-chips:</span>
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 focus-within:ring-1 focus-within:ring-indigo-500 w-full mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Type reference..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="w-full text-xs outline-none bg-transparent py-0.5 text-slate-700"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50/40 rounded-lg border border-slate-100">
                    <button
                      onClick={() => setIcon('')}
                      className={`px-2 py-1 text-[11px] rounded transition-all border ${
                        icon === '' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      (Clear Logo)
                    </button>
                    {filteredBrands.map((brand) => (
                      <button
                        key={brand.slug}
                        onClick={() => setIcon(brand.slug)}
                        className={`px-2 py-1 text-[11px] rounded transition-all border flex items-center gap-1 ${
                          icon === brand.slug
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{brand.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Output Render + Exporters (5 columns) */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Graphic Output</span>
              
              <div className="min-h-28 bg-white border border-slate-200/60 rounded-xl p-6 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                <img
                  src={badgeUrl}
                  alt="Badge Output Preview"
                  className="transition-transform duration-100 hover:scale-105 select-none max-w-full"
                />
              </div>
              <p className="text-center text-[10px] text-slate-400">Shields.io Real-Time Dynamic Render SVG</p>
            </div>

            {/* Exporter Formats */}
            <div className="space-y-4 pt-4 border-t border-slate-200/60">
              <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest">Single-Click Exporter Formats</span>
              
              {/* Markdown Formatted Link */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500 text-[10px]">Markdown Link</span>
                  <button
                    onClick={() => notifyCopy('markdown', `![${label}](${badgeUrl})`)}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center font-bold text-[10px] transition-colors"
                  >
                    {copiedType === 'markdown' ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedType === 'markdown' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-200 text-xs font-mono p-2 rounded-lg border border-slate-850 truncate select-all select-none">
                  ![{label}]({badgeUrl})
                </div>
              </div>

              {/* Direct Url Formatted Link */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500 text-[10px]">Direct RAW URL</span>
                  <button
                    onClick={() => notifyCopy('url', badgeUrl)}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center font-bold text-[10px] transition-colors"
                  >
                    {copiedType === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedType === 'url' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-200 text-xs font-mono p-2 rounded-lg border border-slate-850 truncate select-all">
                  {badgeUrl}
                </div>
              </div>

              {/* HTML Image Tag Code Formatted Link */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500 text-[10px]">HTML Image Tag</span>
                  <button
                    onClick={() => notifyCopy('html', `<img src="${badgeUrl}" alt="${label}" />`)}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center font-bold text-[10px] transition-colors"
                  >
                    {copiedType === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedType === 'html' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-200 text-xs font-mono p-2 rounded-lg border border-slate-850 truncate select-all">
                  &lt;img src="{badgeUrl}" alt="{label}" /&gt;
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
