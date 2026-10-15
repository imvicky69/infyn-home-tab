import React, { useState } from 'react'
import {
  X,
  Palette,
  User,
  Search,
  Check,
  Flame,
  Trash2,
  Sliders,
  Cloud,
  Calendar,
  FileText,
  Timer,
  LayoutGrid,
  Plus,
  Star,
  Clock,
  Sparkles,
  ExternalLink,
  CheckSquare,
  GitBranch,
  Code2,
  Edit3,
  Camera,
} from 'lucide-react'
import { GithubIcon } from './GithubWidget'
import type {
  UserSettings,
  SearchEngineId,
  FirebaseProject,
  GithubRepo,
  DashboardScreen,
} from '../types'
import { WALLPAPERS, DEFAULT_SEARCH_ENGINES, DEFAULT_SCREENS, DEFAULT_WIDGET_CONFIGS } from '../utils/storage'
import { POPULAR_TIMEZONES } from '../utils/timezones'

interface CustomizeModalProps {
  isOpen: boolean
  onClose: () => void
  settings: UserSettings
  onUpdateSettings: (settings: UserSettings) => void
  firebaseProjects?: FirebaseProject[]
  onAddFirebaseProject?: (project: Omit<FirebaseProject, 'id'>) => void
  onRemoveFirebaseProject?: (id: string) => void
  githubRepos?: GithubRepo[]
  onAddGithubRepo?: (repo: Omit<GithubRepo, 'id'>) => void
  onRemoveGithubRepo?: (id: string) => void
  onUpdateGithubRepo?: (repo: GithubRepo) => void
}

type TabKey = 'wallpapers' | 'widgets' | 'dev' | 'general'

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  firebaseProjects = [],
  onAddFirebaseProject,
  onRemoveFirebaseProject,
  githubRepos = [],
  onAddGithubRepo,
  onRemoveGithubRepo,
  onUpdateGithubRepo,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('wallpapers')
  const [newFirebaseName, setNewFirebaseName] = useState('')
  const [newFirebaseId, setNewFirebaseId] = useState('')

  const [newRepoName, setNewRepoName] = useState('')
  const [newRepoOwner, setNewRepoOwner] = useState('')
  const newRepoBranch = 'main'
  const [newRepoDesc, setNewRepoDesc] = useState('')

  const [editingRepoId, setEditingRepoId] = useState<string | null>(null)
  const [editRepoName, setEditRepoName] = useState('')
  const [editRepoOwner, setEditRepoOwner] = useState('')
  const [editRepoBranch, setEditRepoBranch] = useState('main')

  const startEditRepo = (r: GithubRepo) => {
    setEditingRepoId(r.id)
    setEditRepoName(r.name)
    setEditRepoOwner(r.owner || settings.githubUsername || 'imvicky69')
    setEditRepoBranch(r.defaultBranch || 'main')
  }

  const saveEditRepo = (r: GithubRepo) => {
    if (!onUpdateGithubRepo) return
    onUpdateGithubRepo({
      ...r,
      name: editRepoName.trim() || r.name,
      owner: editRepoOwner.trim() || settings.githubUsername || 'imvicky69',
      defaultBranch: editRepoBranch.trim() || 'main',
    })
    setEditingRepoId(null)
  }

  if (!isOpen) return null

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    onUpdateSettings({
      ...settings,
      [key]: value,
    })
  }

  const activeWallpaperClass =
    WALLPAPERS.find((w) => w.id === settings.wallpaper)?.class || WALLPAPERS[0].class

  const screens: DashboardScreen[] =
    settings.screens && settings.screens.length > 0 ? settings.screens : DEFAULT_SCREENS
  const defaultScreenId = settings.defaultScreenId || screens[0]?.id || 'screen-1'
  const widgetConfigs = settings.widgetConfigs || DEFAULT_WIDGET_CONFIGS

  const handleAddScreen = () => {
    const nextIdx = screens.length + 1
    const newScreen: DashboardScreen = {
      id: `screen-${Date.now().toString(36)}`,
      name: `Screen ${nextIdx}`,
    }
    updateSetting('screens', [...screens, newScreen])
  }

  const handleDeleteScreen = (screenId: string) => {
    if (screens.length <= 1) return
    const filteredScreens = screens.filter((s) => s.id !== screenId)
    const fallbackDefault = defaultScreenId === screenId ? filteredScreens[0].id : defaultScreenId

    const nextConfigs = { ...widgetConfigs }
    Object.keys(nextConfigs).forEach((wKey) => {
      if (nextConfigs[wKey].screenId === screenId) {
        nextConfigs[wKey] = {
          ...nextConfigs[wKey],
          screenId: 'screen-1',
        }
      }
    })

    onUpdateSettings({
      ...settings,
      screens: filteredScreens,
      defaultScreenId: fallbackDefault,
      widgetConfigs: nextConfigs,
    })
  }

  const handleRenameScreen = (screenId: string, newName: string) => {
    const updatedScreens = screens.map((s) =>
      s.id === screenId ? { ...s, name: newName } : s
    )
    updateSetting('screens', updatedScreens)
  }

  const handleSetDefaultScreen = (screenId: string) => {
    updateSetting('defaultScreenId', screenId)
  }

  const updateWidgetScreen = (widgetKey: string, targetScreenId: string) => {
    const isEnabled = targetScreenId !== 'hidden'
    const defaultCfg = DEFAULT_WIDGET_CONFIGS[widgetKey] || {
      id: widgetKey,
      screenId: 'screen-1',
      size: 'normal',
      order: 0,
    }
    const currentCfg = widgetConfigs[widgetKey] || defaultCfg
    const nextConfigs = {
      ...widgetConfigs,
      [widgetKey]: {
        ...currentCfg,
        screenId: targetScreenId,
        size: defaultCfg.size,
        order: defaultCfg.order,
      },
    }

    const nextWidgets = {
      ...settings.widgets,
      [widgetKey]: isEnabled,
    }

    onUpdateSettings({
      ...settings,
      widgetConfigs: nextConfigs,
      widgets: nextWidgets,
    })
  }

  const updateWidgetEnabled = (widgetKey: string, enable: boolean) => {
    const defaultCfg = DEFAULT_WIDGET_CONFIGS[widgetKey] || {
      id: widgetKey,
      screenId: 'screen-1',
      size: 'normal',
      order: 0,
    }
    const currentCfg = widgetConfigs[widgetKey] || defaultCfg

    const defaultScreenForWidget =
      defaultCfg.screenId ||
      (widgetKey === 'notes' || widgetKey === 'focusTimer' || widgetKey === 'todos'
        ? (screens[1]?.id || 'screen-2')
        : (widgetKey === 'github' || widgetKey === 'firebase')
        ? (screens[2]?.id || 'screen-3')
        : (screens[0]?.id || 'screen-1'))

    const targetScreen = enable
      ? (currentCfg.screenId && currentCfg.screenId !== 'hidden'
          ? currentCfg.screenId
          : defaultScreenForWidget)
      : 'hidden'

    const nextConfigs = {
      ...widgetConfigs,
      [widgetKey]: {
        ...currentCfg,
        screenId: targetScreen,
        size: defaultCfg.size,
        order: defaultCfg.order,
      },
    }

    const nextWidgets = {
      ...settings.widgets,
      [widgetKey]: enable,
    }

    onUpdateSettings({
      ...settings,
      widgetConfigs: nextConfigs,
      widgets: nextWidgets,
    })
  }

  const resetDefaultScreensAndWidgets = () => {
    onUpdateSettings({
      ...settings,
      screens: DEFAULT_SCREENS,
      defaultScreenId: 'screen-1',
      widgetConfigs: DEFAULT_WIDGET_CONFIGS,
    })
  }

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFirebaseName.trim() || !newFirebaseId.trim() || !onAddFirebaseProject) return
    onAddFirebaseProject({
      name: newFirebaseName.trim(),
      projectId: newFirebaseId.trim().toLowerCase().replace(/\s+/g, '-'),
      color: 'from-amber-500 to-orange-600',
    })
    setNewFirebaseName('')
    setNewFirebaseId('')
  }

  const handleAddRepoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRepoName.trim() || !onAddGithubRepo) return
    onAddGithubRepo({
      name: newRepoName.trim(),
      owner: newRepoOwner.trim() || settings.githubUsername || 'imvicky69',
      defaultBranch: newRepoBranch.trim() || 'main',
      description: newRepoDesc.trim() || undefined,
    })
    setNewRepoName('')
    setNewRepoDesc('')
  }

  const isFirebaseEnabled = settings.widgets?.firebase !== false
  const isGithubEnabled = settings.widgets?.github !== false

  const toggleFirebase = () => {
    const nextVal = !isFirebaseEnabled
    onUpdateSettings({
      ...settings,
      widgets: {
        ...settings.widgets,
        firebase: nextVal,
      },
      widgetConfigs: {
        ...widgetConfigs,
        firebase: {
          ...(widgetConfigs.firebase || { id: 'firebase', size: 'normal', order: 1 }),
          screenId: nextVal
            ? widgetConfigs.firebase?.screenId === 'hidden'
              ? 'screen-3'
              : widgetConfigs.firebase?.screenId || 'screen-3'
            : 'hidden',
        },
      },
    })
  }

  const toggleGithub = () => {
    const nextVal = !isGithubEnabled
    onUpdateSettings({
      ...settings,
      widgets: {
        ...settings.widgets,
        github: nextVal,
      },
      widgetConfigs: {
        ...widgetConfigs,
        github: {
          ...(widgetConfigs.github || { id: 'github', size: 'normal', order: 0 }),
          screenId: nextVal
            ? widgetConfigs.github?.screenId === 'hidden'
              ? 'screen-3'
              : widgetConfigs.github?.screenId || 'screen-3'
            : 'hidden',
        },
      },
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div
        className={`relative overflow-hidden border border-white/20 rounded-3xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] text-white ${activeWallpaperClass} transition-all duration-700`}
      >
        {/* Adaptive translucent glass overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl pointer-events-none -z-0" />

        {/* Modal content container */}
        <div className="relative z-10 flex flex-col p-5 sm:p-6 h-full max-h-[90vh] min-h-0 overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/15 border border-white/20 text-white shadow-sm">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Customize Dashboard</h2>
                <p className="text-xs text-white/70">Theme, Screens & Developer Tools</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Organized Navigation Tabs */}
          <div className="flex items-center gap-1.5 py-3 border-b border-white/15 shrink-0 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('wallpapers')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'wallpapers'
                  ? 'bg-white text-black shadow-md font-black scale-102'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Palette className="h-3.5 w-3.5" />
              <span>Wallpapers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('widgets')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'widgets'
                  ? 'bg-white text-black shadow-md font-black scale-102'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Widgets & Screens</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dev')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'dev'
                  ? 'bg-white text-black shadow-md font-black scale-102'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Dev Suite</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/20 font-mono font-bold">
                GitHub & Firebase
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'general'
                  ? 'bg-white text-black shadow-md font-black scale-102'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Clock & Search</span>
            </button>
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 overflow-y-auto pt-4 space-y-5 pr-1 no-scrollbar">
            {/* TAB 1: WALLPAPERS & LIVE MOTION */}
            {activeTab === 'wallpapers' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider">
                      Wallpaper Themes ({WALLPAPERS.length})
                    </h3>
                    <p className="text-[11px] text-white/70">
                      The panel adapts live to whatever background you choose
                    </p>
                  </div>
                </div>

                {/* 12 Wallpaper Presets Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {WALLPAPERS.map((wp) => (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => updateSetting('wallpaper', wp.id)}
                      className={`p-3 rounded-2xl border text-left text-xs transition-all relative overflow-hidden flex flex-col justify-between h-22 backdrop-blur-md ${
                        settings.wallpaper === wp.id
                          ? 'border-white ring-2 ring-white/50 shadow-xl font-bold text-white bg-white/20 scale-102'
                          : 'border-white/15 hover:border-white/30 text-white/70 hover:text-white bg-black/35 hover:bg-black/50'
                      }`}
                    >
                      <div className={`h-8 w-full rounded-xl bg-gradient-to-r ${wp.preview} border border-white/15 shadow-xs`} />
                      <div className="flex items-center justify-between mt-2">
                        <span className="truncate text-xs font-medium">{wp.name}</span>
                        {settings.wallpaper === wp.id && (
                          <span className="p-0.5 rounded-full bg-white text-black shrink-0">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Live Wallpaper Subtle Motion Toggle */}
                <div
                  onClick={() => updateSetting('liveWallpaper', settings.liveWallpaper !== false ? false : true)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between backdrop-blur-md ${
                    settings.liveWallpaper !== false
                      ? 'bg-white/15 border-white/30 text-white shadow-lg'
                      : 'bg-black/35 border-white/15 text-white/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl transition-colors ${
                        settings.liveWallpaper !== false ? 'bg-white text-black' : 'bg-white/15 text-white'
                      }`}
                    >
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold block text-white">Live Wallpaper Motion</span>
                      <span className="text-xs text-white/70">
                        Gentle, organic ambient fluid movement customized to your chosen wallpaper
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${
                      settings.liveWallpaper !== false ? 'bg-white' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full shadow-md transform transition-transform ${
                        settings.liveWallpaper !== false ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: WIDGETS & SCREENS */}
            {activeTab === 'widgets' && (
              <div className="space-y-5 animate-in fade-in">
                {/* Screens Manager */}
                <div className="space-y-3 bg-black/35 backdrop-blur-md border border-white/15 p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider">
                        Screen Manager ({screens.length})
                      </h3>
                      <p className="text-[11px] text-white/70">
                        Add screens, rename, or set your default home screen on startup
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddScreen}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-102"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Screen</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {screens.map((screen, idx) => {
                      const isDefault = screen.id === defaultScreenId
                      return (
                        <div
                          key={screen.id}
                          className={`p-3 rounded-2xl border transition-all space-y-2 backdrop-blur-md ${
                            isDefault
                              ? 'bg-white/15 border-white/30 text-white'
                              : 'bg-black/30 border-white/15 text-white/80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-white/60">#{idx + 1}</span>
                              {isDefault && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-black flex items-center gap-1 shadow-xs">
                                  <Star className="h-2.5 w-2.5 fill-black text-black" />
                                  <span>Default</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {!isDefault && (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultScreen(screen.id)}
                                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                  title="Set as default screen"
                                >
                                  <Star className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {screens.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteScreen(screen.id)}
                                  className="p-1 rounded-lg text-white/60 hover:text-rose-400 hover:bg-white/10 transition-colors"
                                  title="Delete this screen"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <input
                            type="text"
                            value={screen.name}
                            onChange={(e) => handleRenameScreen(screen.id, e.target.value)}
                            placeholder="Screen Name"
                            className="w-full bg-black/45 border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Widgets Placement & Grid Ordering */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider">
                        Dashboard Widgets Placement & Sizing
                      </h3>
                      <p className="text-[11px] text-white/70">
                        Toggle on/off, move widgets across Home, Productivity & Dev screens
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetDefaultScreensAndWidgets}
                      className="px-2.5 py-1 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 text-[11px] font-semibold text-white/80 hover:text-white transition-colors shrink-0 self-start sm:self-auto"
                      title="Reset all screens and widgets to factory layout"
                    >
                      Reset Layout
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { key: 'weather', label: 'Weather Card', desc: 'Live temperature, conditions & forecast', icon: Cloud, defaultScreen: 'Home' },
                      { key: 'calendar', label: 'Calendar Card', desc: 'Monthly date tracker & highlights', icon: Calendar, defaultScreen: 'Home' },
                      { key: 'shortcuts', label: 'Apps & Shortcuts Grid', desc: 'Live favorite bookmarks launcher', icon: LayoutGrid, defaultScreen: 'Home' },
                      { key: 'notes', label: 'Quick Scratchpad', desc: 'Persistent notes saved across tabs', icon: FileText, defaultScreen: 'Productivity' },
                      { key: 'focusTimer', label: 'Focus Timer', desc: 'Pomodoro timer with persistent HUD overlay', icon: Timer, defaultScreen: 'Productivity' },
                      { key: 'todos', label: 'Todo Board & Checklist', desc: 'Focus goals, priorities, tags & progress tracker', icon: CheckSquare, defaultScreen: 'Productivity' },
                      { key: 'github', label: 'GitHub Projects', desc: 'Commits, actions, PRs & repo consoles', icon: GithubIcon, defaultScreen: 'Dev' },
                      { key: 'firebase', label: 'Firebase Dev Suite', desc: 'Console links and cloud project shortcuts', icon: Flame, defaultScreen: 'Dev' },
                      { key: 'screenshots', label: 'Screenshots Gallery', desc: 'Local captures with quick copy, download & preview', icon: Camera, defaultScreen: 'Home' },
                    ].map(({ key, label, desc, icon: IconComp, defaultScreen }) => {
                      const cfg = widgetConfigs[key] || DEFAULT_WIDGET_CONFIGS[key] || { id: key, screenId: 'screen-1', size: 'normal', order: 0 }
                      const currentScreenId = cfg.screenId
                      const isHidden = currentScreenId === 'hidden'

                      return (
                        <div
                          key={key}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 backdrop-blur-md ${
                            isHidden
                              ? 'bg-black/20 border-white/5 opacity-60 text-white/60'
                              : 'bg-black/35 border-white/15 text-white shadow-sm'
                          }`}
                        >
                          {/* Left: Icon, Label & On/Off Switch */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              onClick={() => updateWidgetEnabled(key, isHidden)}
                              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                                !isHidden ? 'bg-white' : 'bg-white/20'
                              }`}
                              title={!isHidden ? 'Click to turn widget OFF' : 'Click to turn widget ON'}
                            >
                              <div
                                className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                  !isHidden ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'
                                }`}
                              />
                            </div>

                            <div
                              className={`p-2 rounded-xl border shrink-0 ${
                                isHidden
                                  ? 'bg-white/5 border-white/10 text-white/40'
                                  : 'bg-white/15 border-white/20 text-white'
                              }`}
                            >
                              <IconComp className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold truncate">{label}</span>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                                    isHidden
                                      ? 'bg-white/10 text-white/50'
                                      : 'bg-white text-black font-black shadow-xs'
                                  }`}
                                >
                                  {isHidden ? 'Off' : screens.find((s) => s.id === currentScreenId)?.name || defaultScreen}
                                </span>
                              </div>
                              <span className="text-[10px] text-white/70 block truncate">{desc}</span>
                            </div>
                          </div>

                          {/* Right Controls: Clean Screen Destination Selector */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-white/60 font-medium hidden sm:inline">Screen:</span>
                              <select
                                value={currentScreenId}
                                onChange={(e) => updateWidgetScreen(key, e.target.value)}
                                className="bg-neutral-950 border border-white/20 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-white/50"
                              >
                                {screens.map((s, sIdx) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name || `Screen ${sIdx + 1}`}
                                  </option>
                                ))}
                                <option value="hidden">Hidden (Off)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DEV SUITE (GITHUB & FIREBASE) */}
            {activeTab === 'dev' && (
              <div className="space-y-6 animate-in fade-in">
                {/* 1. GITHUB PROJECTS SECTION */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-white/10 border border-white/15 text-white">
                        <GithubIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          GitHub Developer Tools
                        </h4>
                        <span className="text-[10px] text-white/60">Launch commits, actions & PRs on Screen 3 (Dev)</span>
                      </div>
                    </div>

                    {/* Master GitHub Widget Toggle */}
                    <div
                      onClick={toggleGithub}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <span className="text-xs text-white/70">{isGithubEnabled ? 'Enabled' : 'Disabled'}</span>
                      <div
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                          isGithubEnabled ? 'bg-white' : 'bg-white/20'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            isGithubEnabled ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* GitHub Username Input */}
                  <div className="bg-black/35 backdrop-blur-md border border-white/15 p-3 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-white/70" />
                      <span className="text-xs text-white/80 font-medium">Default GitHub Username:</span>
                    </div>
                    <input
                      type="text"
                      value={settings.githubUsername || ''}
                      onChange={(e) => updateSetting('githubUsername', e.target.value.trim())}
                      placeholder="e.g. imvicky69"
                      className="bg-black/50 border border-white/20 rounded-xl px-3 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50 w-44"
                    />
                  </div>

                  {/* Quick Add GitHub Repo Form */}
                  {onAddGithubRepo && (
                    <form
                      onSubmit={handleAddRepoSubmit}
                      className="bg-black/35 backdrop-blur-md border border-white/15 p-4 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
                          Pin New GitHub Repository
                        </h5>
                        <span className="text-[10px] text-white/50">Generates instant action cards</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="sm:col-span-1">
                          <span className="text-[11px] text-white/70 block mb-1">Owner</span>
                          <input
                            type="text"
                            value={newRepoOwner}
                            onChange={(e) => setNewRepoOwner(e.target.value)}
                            placeholder={settings.githubUsername || 'e.g. imvicky69'}
                            className="w-full bg-black/45 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <span className="text-[11px] text-white/70 block mb-1">Repository Name</span>
                          <input
                            type="text"
                            value={newRepoName}
                            onChange={(e) => setNewRepoName(e.target.value)}
                            placeholder="e.g. indivio-extension"
                            className="w-full bg-black/45 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          disabled={!newRepoName.trim()}
                          className="px-4 py-1.5 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Pin Repo</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Connected GitHub Repos List */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider block">
                      Pinned Repositories ({githubRepos.length})
                    </span>

                    {githubRepos.length > 0 ? (
                      <div className="space-y-1.5">
                        {githubRepos.map((r) => {
                          const isEditing = editingRepoId === r.id
                          if (isEditing) {
                            return (
                              <div
                                key={r.id}
                                className="p-3 rounded-2xl bg-black/50 border border-white/30 text-xs space-y-2.5 animate-in fade-in"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-white text-[11px] uppercase">Edit Repository</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-[10px] text-white/60 block mb-0.5">Owner</span>
                                    <input
                                      type="text"
                                      value={editRepoOwner}
                                      onChange={(e) => setEditRepoOwner(e.target.value)}
                                      className="w-full bg-black/60 border border-white/20 rounded-xl px-2.5 py-1 text-xs text-white"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-white/60 block mb-0.5">Repo Name</span>
                                    <input
                                      type="text"
                                      value={editRepoName}
                                      onChange={(e) => setEditRepoName(e.target.value)}
                                      className="w-full bg-black/60 border border-white/20 rounded-xl px-2.5 py-1 text-xs text-white"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-1.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditingRepoId(null)}
                                    className="px-2.5 py-1 rounded-xl text-xs text-white/70 hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => saveEditRepo(r)}
                                    className="px-3 py-1 rounded-xl bg-white text-black font-bold text-xs shadow-xs"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )
                          }

                          return (
                            <div
                              key={r.id}
                              className="flex items-center justify-between p-2.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/15 text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <GitBranch className="h-3.5 w-3.5 text-white/60 shrink-0" />
                                <div className="min-w-0">
                                  <span className="font-bold text-white block truncate">{r.owner || settings.githubUsername || 'imvicky69'}/{r.name}</span>
                                  {r.description && <span className="text-[10px] text-white/60 block truncate">{r.description}</span>}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {onUpdateGithubRepo && (
                                  <button
                                    type="button"
                                    onClick={() => startEditRepo(r)}
                                    className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                    title="Edit repository"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                {onRemoveGithubRepo && (
                                  <button
                                    type="button"
                                    onClick={() => onRemoveGithubRepo(r.id)}
                                    className="p-1.5 rounded-xl text-white/50 hover:text-rose-400 hover:bg-white/10 transition-colors"
                                    title="Remove repo"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl border border-dashed border-white/15 text-center text-white/50 text-xs">
                        No repositories pinned yet. Add one above.
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/15 pt-5" />

                {/* 2. FIREBASE CONSOLE SECTION */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-white/10 border border-white/15 text-white">
                        <Flame className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Firebase Cloud Dev Tools
                        </h4>
                        <span className="text-[10px] text-white/60">Firestore, Auth, Storage & Hosting on Screen 3 (Dev)</span>
                      </div>
                    </div>

                    {/* Master Firebase Toggle */}
                    <div
                      onClick={toggleFirebase}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <span className="text-xs text-white/70">{isFirebaseEnabled ? 'Enabled' : 'Disabled'}</span>
                      <div
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                          isFirebaseEnabled ? 'bg-white' : 'bg-white/20'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            isFirebaseEnabled ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Add Firebase Project */}
                  {onAddFirebaseProject && (
                    <form
                      onSubmit={handleAddProjectSubmit}
                      className="bg-black/35 backdrop-blur-md border border-white/15 p-4 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
                          Add New Firebase Project
                        </h5>
                        <span className="text-[10px] text-white/50">Auto-creates direct console links</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <span className="text-[11px] text-white/70 block mb-1">Display Name</span>
                          <input
                            type="text"
                            value={newFirebaseName}
                            onChange={(e) => setNewFirebaseName(e.target.value)}
                            placeholder="e.g. My SaaS Cloud"
                            className="w-full bg-black/45 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                          />
                        </div>

                        <div>
                          <span className="text-[11px] text-white/70 block mb-1">Project ID</span>
                          <input
                            type="text"
                            value={newFirebaseId}
                            onChange={(e) => setNewFirebaseId(e.target.value)}
                            placeholder="e.g. my-app-prod-123"
                            className="w-full bg-black/45 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          disabled={!newFirebaseName.trim() || !newFirebaseId.trim()}
                          className="px-4 py-1.5 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Project</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Connected Firebase Projects List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider block">
                        Connected Projects ({firebaseProjects.length})
                      </span>
                      <a
                        href="https://console.firebase.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-white/70 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <span>Firebase Console</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {firebaseProjects.length > 0 ? (
                      <div className="space-y-1.5">
                        {firebaseProjects.map((proj) => (
                          <div
                            key={proj.id}
                            className="flex items-center justify-between p-2.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/15 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-1 rounded-lg bg-white/15 border border-white/20 text-white">
                                <Flame className="h-3.5 w-3.5" />
                              </div>
                              <div>
                                <span className="font-bold text-white block">{proj.name}</span>
                                <span className="text-[10px] text-white/60 font-mono">ID: {proj.projectId}</span>
                              </div>
                            </div>

                            {onRemoveFirebaseProject && (
                              <button
                                type="button"
                                onClick={() => onRemoveFirebaseProject(proj.id)}
                                className="p-1.5 rounded-xl text-white/50 hover:text-rose-400 hover:bg-white/10 transition-colors"
                                title="Remove project"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl border border-dashed border-white/15 text-center text-white/50 text-xs">
                        No Firebase projects added yet. Add one above.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CLOCK, SEARCH & PROFILE */}
            {activeTab === 'general' && (
              <div className="space-y-5 animate-in fade-in">
                {/* Profile & Weather Location */}
                <div className="space-y-3 bg-black/35 backdrop-blur-md border border-white/15 p-4 rounded-2xl">
                  <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-white" />
                    <span>Profile & Weather City</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-white/70 block mb-1">Your Name</span>
                      <input
                        type="text"
                        value={settings.userName}
                        onChange={(e) => updateSetting('userName', e.target.value)}
                        placeholder="e.g. Vikky Raja"
                        className="w-full bg-black/45 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                      />
                    </div>

                    <div>
                      <span className="text-xs text-white/70 block mb-1">Weather City</span>
                      <input
                        type="text"
                        value={settings.weatherCity}
                        onChange={(e) => updateSetting('weatherCity', e.target.value)}
                        placeholder="e.g. Varanasi"
                        className="w-full bg-black/45 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Default Search Engine */}
                <div className="space-y-3 bg-black/35 backdrop-blur-md border border-white/15 p-4 rounded-2xl">
                  <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-white" />
                    <span>Search Engine Configuration</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-white/70 block mb-1">Default Search Engine</span>
                      <select
                        value={settings.defaultSearchEngine}
                        onChange={(e) => updateSetting('defaultSearchEngine', e.target.value as SearchEngineId)}
                        className="w-full bg-neutral-950 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/50"
                      >
                        {Object.values(DEFAULT_SEARCH_ENGINES).map((eng) => (
                          <option key={eng.id} value={eng.id}>
                            {eng.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Toggle Search Bar On Screen 1 */}
                    <div
                      onClick={() =>
                        onUpdateSettings({
                          ...settings,
                          widgets: {
                            ...settings.widgets,
                            searchBar: settings.widgets?.searchBar === false ? true : false,
                          },
                        })
                      }
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between backdrop-blur-md ${
                        settings.widgets?.searchBar !== false
                          ? 'bg-white/15 border-white/30 text-white'
                          : 'bg-black/30 border-white/10 text-white/60'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">Top Search Bar</span>
                        <span className="text-[10px] text-white/70">Display input on Screen 1</span>
                      </div>
                      <div
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                          settings.widgets?.searchBar !== false ? 'bg-white' : 'bg-white/20'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            settings.widgets?.searchBar !== false ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clock Widget Configuration */}
                <div className="space-y-3 bg-black/35 backdrop-blur-md border border-white/15 p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-white" />
                      <span>Big Clock Time Widget</span>
                    </h3>

                    <div
                      onClick={() =>
                        onUpdateSettings({
                          ...settings,
                          widgets: {
                            ...settings.widgets,
                            clock: settings.widgets?.clock === false ? true : false,
                          },
                        })
                      }
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <span className="text-xs text-white/70">
                        {settings.widgets?.clock !== false ? 'Visible' : 'Hidden'}
                      </span>
                      <div
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                          settings.widgets?.clock !== false ? 'bg-white' : 'bg-white/20'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            settings.widgets?.clock !== false ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {settings.widgets?.clock !== false && (
                    <div className="space-y-3 pt-2 border-t border-white/15">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Timezone Selector */}
                        <div>
                          <span className="text-xs text-white/70 block mb-1">Clock Timezone</span>
                          <select
                            value={settings.timezone || 'auto'}
                            onChange={(e) => updateSetting('timezone', e.target.value)}
                            className="w-full bg-neutral-950 border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/50"
                          >
                            {POPULAR_TIMEZONES.map((tz) => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 12h vs 24h format */}
                        <div>
                          <span className="text-xs text-white/70 block mb-1">Time Format</span>
                          <div className="grid grid-cols-2 gap-1 bg-black/45 p-1 rounded-xl border border-white/20">
                            <button
                              type="button"
                              onClick={() => updateSetting('timeFormat', '12h')}
                              className={`py-1 rounded-lg text-xs font-bold transition-all ${
                                settings.timeFormat !== '24h'
                                  ? 'bg-white text-black font-black shadow-xs'
                                  : 'text-white/60 hover:text-white'
                              }`}
                            >
                              12-Hour
                            </button>
                            <button
                              type="button"
                              onClick={() => updateSetting('timeFormat', '24h')}
                              className={`py-1 rounded-lg text-xs font-bold transition-all ${
                                settings.timeFormat === '24h'
                                  ? 'bg-white text-black font-black shadow-xs'
                                  : 'text-white/60 hover:text-white'
                              }`}
                            >
                              24-Hour
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Subtitle Checkboxes: Date, Greeting, Seconds */}
                      <div className="pt-2 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <label className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={settings.showSeconds ?? false}
                            onChange={(e) => updateSetting('showSeconds', e.target.checked)}
                            className="rounded border-white/30 bg-black/60 text-white focus:ring-0"
                          />
                          <span className="text-white/80">Show Seconds</span>
                        </label>

                        <label className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={settings.showDate ?? false}
                            onChange={(e) => updateSetting('showDate', e.target.checked)}
                            className="rounded border-white/30 bg-black/60 text-white focus:ring-0"
                          />
                          <span className="text-white/80">Show Date</span>
                        </label>

                        <label className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={settings.showGreeting ?? false}
                            onChange={(e) => updateSetting('showGreeting', e.target.checked)}
                            className="rounded border-white/30 bg-black/60 text-white focus:ring-0"
                          />
                          <span className="text-white/80">Show Greeting</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-white/15 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-white/60">Infyn Home Tab • Settings auto-save</span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md transition-all hover:scale-102"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
