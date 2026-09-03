import React from 'react'
import {
  X,
  Palette,
  User,
  Search,
  Check,
  Flame,
  Trash2,
} from 'lucide-react'
import type { UserSettings, SearchEngineId, FirebaseProject } from '../types'
import { WALLPAPERS, DEFAULT_SEARCH_ENGINES } from '../utils/storage'

interface CustomizeModalProps {
  isOpen: boolean
  onClose: () => void
  settings: UserSettings
  onUpdateSettings: (settings: UserSettings) => void
  firebaseProjects?: FirebaseProject[]
  onRemoveFirebaseProject?: (id: string) => void
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  firebaseProjects = [],
  onRemoveFirebaseProject,
}) => {
  if (!isOpen) return null

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: value })
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Customise Dashboard</h2>
              <p className="text-xs text-slate-400">Wallpapers, Profile & Projects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wallpaper Presets */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-indigo-400" />
            Wallpaper Backgrounds
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {WALLPAPERS.map((wp) => (
              <button
                key={wp.id}
                onClick={() => updateSetting('wallpaper', wp.id)}
                className={`p-3 rounded-2xl border text-left text-xs transition-all relative overflow-hidden flex flex-col justify-between h-20 ${
                  settings.wallpaper === wp.id
                    ? 'border-indigo-400 ring-2 ring-indigo-500/40 shadow-lg font-bold text-white'
                    : 'border-white/10 hover:border-white/25 text-slate-400 hover:text-white bg-slate-950/40'
                }`}
              >
                <div className={`h-8 w-full rounded-xl bg-gradient-to-r ${wp.preview} border border-white/10`} />
                <div className="flex items-center justify-between mt-1">
                  <span className="truncate">{wp.name}</span>
                  {settings.wallpaper === wp.id && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Connected Firebase Projects */}
        {firebaseProjects.length > 0 && onRemoveFirebaseProject && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              Connected Firebase Projects ({firebaseProjects.length})
            </label>
            <div className="space-y-2">
              {firebaseProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{proj.name}</span>
                    <span className="text-[10px] text-amber-400/90 font-mono">ID: {proj.projectId}</span>
                  </div>
                  <button
                    onClick={() => onRemoveFirebaseProject(proj.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                    title={`Delete ${proj.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Profile & Weather */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-indigo-400" />
            Profile & Weather Location
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Your Name</span>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) => updateSetting('userName', e.target.value)}
                placeholder="e.g. Vikky Raja"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Weather City</span>
              <input
                type="text"
                value={settings.weatherCity}
                onChange={(e) => updateSetting('weatherCity', e.target.value)}
                placeholder="e.g. Varanasi"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Search Engine */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5 text-indigo-400" />
            Default Search Engine
          </label>
          <select
            value={settings.defaultSearchEngine}
            onChange={(e) => updateSetting('defaultSearchEngine', e.target.value as SearchEngineId)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            {Object.values(DEFAULT_SEARCH_ENGINES).map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
