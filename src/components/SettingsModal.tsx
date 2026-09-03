import React from 'react'
import { X, Settings, Sliders, Palette, Check } from 'lucide-react'
import type { UserSettings, ThemeStyle, SearchEngineId } from '../types'
import { DEFAULT_SEARCH_ENGINES } from '../utils/storage'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: UserSettings
  onUpdateSettings: (newSettings: UserSettings) => void
}

const THEMES: { id: ThemeStyle; name: string; gradient: string }[] = [
  { id: 'deep-space', name: 'Indigo Aura', gradient: 'from-indigo-400 via-purple-400 to-pink-400' },
  { id: 'aurora', name: 'Aurora Mint', gradient: 'from-emerald-400 via-teal-400 to-indigo-400' },
  { id: 'midnight', name: 'Clean Slate', gradient: 'from-slate-400 via-slate-500 to-slate-700' },
  { id: 'sunset', name: 'Sunset Rose', gradient: 'from-rose-400 via-pink-400 to-orange-400' },
  { id: 'cyberpunk', name: 'Neon Cyber', gradient: 'from-fuchsia-400 via-cyan-400 to-amber-400' },
  { id: 'minimal', name: 'Monochrome', gradient: 'from-slate-300 via-slate-400 to-slate-600' },
]

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: value })
  }

  const toggleWidget = (widgetKey: keyof UserSettings['widgets']) => {
    onUpdateSettings({
      ...settings,
      widgets: {
        ...settings.widgets,
        [widgetKey]: !settings.widgets[widgetKey],
      },
    })
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Homescreen Preferences</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personalize your dashboard experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Identity & Greeting */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Profile & Greeting
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold block mb-1">Your Name</span>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) => updateSetting('userName', e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold block mb-1">Default Search Engine</span>
              <select
                value={settings.defaultSearchEngine}
                onChange={(e) => updateSetting('defaultSearchEngine', e.target.value as SearchEngineId)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {Object.values(DEFAULT_SEARCH_ENGINES).map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Show Welcome Greeting</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Display dynamic time-based greeting above clock</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showGreeting}
              onChange={(e) => updateSetting('showGreeting', e.target.checked)}
              className="rounded accent-indigo-600 h-4 w-4"
            />
          </div>
        </div>

        {/* Time & Clock Formats */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Clock Display
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateSetting('timeFormat', '12h')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                settings.timeFormat === '12h'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>12-Hour (AM/PM)</span>
              {settings.timeFormat === '12h' && <Check className="h-4 w-4" />}
            </button>

            <button
              onClick={() => updateSetting('timeFormat', '24h')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                settings.timeFormat === '24h'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>24-Hour (Military)</span>
              {settings.timeFormat === '24h' && <Check className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Show Seconds</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Display ticking seconds in main clock</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showSeconds}
              onChange={(e) => updateSetting('showSeconds', e.target.checked)}
              className="rounded accent-indigo-600 h-4 w-4"
            />
          </div>
        </div>

        {/* Theme Presets */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            Atmosphere Palette
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {THEMES.map((th) => (
              <button
                key={th.id}
                onClick={() => updateSetting('theme', th.id)}
                className={`p-2.5 rounded-2xl border text-left text-xs transition-all relative overflow-hidden ${
                  settings.theme === th.id
                    ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-md font-bold text-indigo-950 dark:text-white bg-white dark:bg-slate-900'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`h-6 rounded-xl bg-gradient-to-r ${th.gradient} mb-2 border border-slate-200/60 dark:border-slate-700/60`} />
                <span className="block truncate">{th.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Widgets Visibility */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            Active Widgets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'shortcuts', label: 'Shortcuts & Bookmarks' },
              { key: 'todos', label: 'Todos & Checklist' },
              { key: 'notes', label: 'Quick Scratchpad' },
              { key: 'focusTimer', label: 'Pomodoro Timer' },
              { key: 'quotes', label: 'Daily Inspiration' },
            ].map((widget) => (
              <label
                key={widget.key}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer"
              >
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{widget.label}</span>
                <input
                  type="checkbox"
                  checked={settings.widgets[widget.key as keyof UserSettings['widgets']]}
                  onChange={() => toggleWidget(widget.key as keyof UserSettings['widgets'])}
                  className="rounded accent-indigo-600 h-4 w-4"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
