import { useState, useEffect, useRef } from 'react'
import {
  Search,
  Pencil,
  User,
  Keyboard,
  CornerDownLeft,
  ChevronDown,
  Sparkles,
  Command,
  Bot,
  EyeOff,
} from 'lucide-react'
import type {
  AppIconItem,
  FirebaseProject,
  UserSettings,
  SearchEngineId,
} from './types'
import {
  DEFAULT_SETTINGS,
  DEFAULT_APPS,
  DEFAULT_FIREBASE_PROJECTS,
  DEFAULT_SEARCH_ENGINES,
  WALLPAPERS,
  loadFromStorage,
  saveToStorage,
} from './utils/storage'
import { WeatherCard } from './components/WeatherCard'
import { CalendarCard } from './components/CalendarCard'
import { FirebaseProjectsWidget } from './components/FirebaseProjectsWidget'
import { AppGrid } from './components/AppGrid'
import { CustomizeModal } from './components/CustomizeModal'

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadFromStorage('settings', DEFAULT_SETTINGS)
  )
  const [apps, setApps] = useState<AppIconItem[]>(() =>
    loadFromStorage('apps', DEFAULT_APPS)
  )
  const [firebaseProjects, setFirebaseProjects] = useState<FirebaseProject[]>(() =>
    loadFromStorage('firebaseProjects', DEFAULT_FIREBASE_PROJECTS)
  )
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchEngineOpen, setIsSearchEngineOpen] = useState(false)
  const [currentEngine, setCurrentEngine] = useState<SearchEngineId>(settings.defaultSearchEngine)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchDropdownRef = useRef<HTMLDivElement>(null)

  // Sync to LocalStorage
  useEffect(() => {
    saveToStorage('settings', settings)
  }, [settings])

  useEffect(() => {
    saveToStorage('apps', apps)
  }, [apps])

  useEffect(() => {
    saveToStorage('firebaseProjects', firebaseProjects)
  }, [firebaseProjects])

  // Shortcut key focus listener ('/' or 'Cmd+K')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) &&
        document.activeElement !== searchInputRef.current
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
        setIsSearchEngineOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeEngine = DEFAULT_SEARCH_ENGINES[currentEngine] || DEFAULT_SEARCH_ENGINES.google

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    const urlPattern = /^(http:\/\/|https:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/
    if (urlPattern.test(trimmed)) {
      const targetUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`
      window.location.href = targetUrl
      return
    }

    if (currentEngine === 'chatgpt-temp') {
      window.location.href = `https://chatgpt.com/?prompt=${encodeURIComponent(trimmed)}&temporary-chat=true`
      return
    }

    if (currentEngine === 'chatgpt') {
      window.location.href = `https://chatgpt.com/?prompt=${encodeURIComponent(trimmed)}`
      return
    }

    window.location.href = `${activeEngine.urlPattern}${encodeURIComponent(trimmed)}`
  }

  // App handlers
  const handleAddApp = (newApp: Omit<AppIconItem, 'id'>) => {
    const item: AppIconItem = {
      ...newApp,
      id: Date.now().toString(),
    }
    setApps((prev) => [...prev, item])
  }

  const handleRemoveApp = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id))
  }

  const handleUpdateApp = (updatedApp: AppIconItem) => {
    setApps((prev) => prev.map((a) => (a.id === updatedApp.id ? updatedApp : a)))
  }

  // Firebase handlers
  const handleAddFirebaseProject = (newProject: Omit<FirebaseProject, 'id'>) => {
    const item: FirebaseProject = {
      ...newProject,
      id: Date.now().toString(),
    }
    setFirebaseProjects((prev) => [...prev, item])
  }

  const handleRemoveFirebaseProject = (id: string) => {
    setFirebaseProjects((prev) => prev.filter((p) => p.id !== id))
  }

  // Find active wallpaper styling
  const activeWallpaper =
    WALLPAPERS.find((w) => w.id === settings.wallpaper)?.class || WALLPAPERS[0].class

  return (
    <div
      className={`min-h-screen ${activeWallpaper} text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-x-hidden transition-all duration-700 font-sans`}
      style={{
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }}
    >
      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between relative z-30">
        {/* Left: Infyn Home Tab Wordmark Logo */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://indivio.studio"
            target="_blank"
            rel="noreferrer"
            className="flex items-center bg-white px-3 py-1.5 rounded-2xl shadow-xs border border-white/20 transition-all duration-300 hover:scale-102"
            title="Infyn Home Tab"
          >
            <img
              src="/infyn-home-tab.svg"
              alt="Infyn Home Tab"
              className="h-5 sm:h-6 w-auto max-w-[170px] object-contain"
            />
          </a>

          <button
            onClick={() => searchInputRef.current?.focus()}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] transition-colors"
            title="Press / to search"
          >
            <Keyboard className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Center: Clean Floating Pill Search Bar with Quick Selector */}
        <div className="w-full max-w-xl mx-4 relative" ref={searchDropdownRef}>
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-black/40 hover:bg-black/50 focus-within:bg-black/60 border border-white/15 focus-within:border-white/35 rounded-full px-3.5 py-1.5 text-xs sm:text-sm backdrop-blur-2xl shadow-lg transition-all duration-200"
          >
            {/* Active Engine Icon / Selector */}
            <button
              type="button"
              onClick={() => setIsSearchEngineOpen(!isSearchEngineOpen)}
              className="flex items-center gap-1 text-slate-300 hover:text-white mr-2 border-r border-white/15 pr-2"
              title={`Active: ${activeEngine.name}`}
            >
              {currentEngine === 'chatgpt-temp' ? (
                <EyeOff className="h-3.5 w-3.5 text-purple-400" />
              ) : currentEngine === 'chatgpt' ? (
                <Bot className="h-3.5 w-3.5 text-emerald-400" />
              ) : currentEngine === 'perplexity' ? (
                <Sparkles className="h-3 w-3 text-indigo-400" />
              ) : (
                <Search className="h-3 w-3 text-slate-300" />
              )}
              <ChevronDown className="h-2.5 w-2.5 opacity-60" />
            </button>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeEngine.placeholder}
              className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none text-xs sm:text-sm"
            />

            {/* Quick Engine Switcher (Google, ChatGPT, Anonymous) */}
            <div className="flex items-center gap-1 mr-1">
              <button
                type="button"
                onClick={() => {
                  setCurrentEngine('google')
                  searchInputRef.current?.focus()
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all flex items-center gap-1 ${
                  currentEngine === 'google'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title="Search on Google"
              >
                <Search className="h-2.5 w-2.5" />
                <span className="hidden sm:inline">Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentEngine('chatgpt')
                  searchInputRef.current?.focus()
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all flex items-center gap-1 ${
                  currentEngine === 'chatgpt'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                    : 'text-white/60 hover:text-emerald-300 hover:bg-white/10'
                }`}
                title="Ask ChatGPT"
              >
                <Bot className="h-2.5 w-2.5" />
                <span className="hidden sm:inline">ChatGPT</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentEngine('chatgpt-temp')
                  searchInputRef.current?.focus()
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all flex items-center gap-1 ${
                  currentEngine === 'chatgpt-temp'
                    ? 'bg-purple-500 text-white font-bold shadow-xs shadow-purple-500/30'
                    : 'text-white/60 hover:text-purple-300 hover:bg-white/10'
                }`}
                title="Ask ChatGPT in Temporary / Anonymous Mode"
              >
                <EyeOff className="h-2.5 w-2.5" />
                <span className="hidden sm:inline">Anonymous</span>
              </button>
            </div>

            {searchQuery.trim() ? (
              <button
                type="submit"
                className="p-1 rounded-full bg-white text-slate-950 shadow-sm transition-transform hover:scale-105"
              >
                <CornerDownLeft className="h-3 w-3" />
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/60 font-mono">
                <Command className="h-2.5 w-2.5" />
                <span>K</span>
              </div>
            )}
          </form>

          {/* Full Engine Dropdown */}
          {isSearchEngineOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900/98 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 text-white">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Search Engine
              </div>
              {Object.values(DEFAULT_SEARCH_ENGINES).map((engine) => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => {
                    setCurrentEngine(engine.id)
                    setIsSearchEngineOpen(false)
                    searchInputRef.current?.focus()
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                    activeEngine.id === engine.id
                      ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {engine.id === 'chatgpt-temp' ? (
                      <EyeOff className="h-3.5 w-3.5 text-purple-400" />
                    ) : engine.id === 'chatgpt' ? (
                      <Bot className="h-3.5 w-3.5 text-emerald-400" />
                    ) : engine.id === 'perplexity' ? (
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    ) : (
                      <Search className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    <span>{engine.name}</span>
                  </div>
                  {activeEngine.id === engine.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: User Profile Avatar Badge */}
        <div className="flex items-center">
          <button
            onClick={() => setIsCustomizeOpen(true)}
            className="flex items-center gap-2 bg-black/25 hover:bg-black/40 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur-xl text-xs font-semibold text-white transition-all duration-300 hover:scale-105 shadow-md"
            title="Account & Dashboard Settings"
          >
            <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
              <User className="h-3 w-3" />
            </div>
            <span className="hidden sm:inline font-medium">{settings.userName}</span>
          </button>
        </div>
      </header>

      {/* Main Content: Left Column + Right 4x4 Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-14 relative z-20">
        {/* Left Column: Weather, Calendar & Full Firebase Developer Suite */}
        <div className="flex flex-col items-center gap-4 w-full sm:w-[330px] md:w-[350px] shrink-0">
          <div className="grid grid-cols-2 gap-3.5 w-full justify-items-center">
            {/* Weather Card */}
            <WeatherCard
              city={settings.weatherCity}
              temp={30}
              condition="Thundershower"
              high={34}
              low={26}
            />

            {/* Calendar Card */}
            <CalendarCard />
          </div>

          {/* Firebase Projects Developer Suite */}
          <div className="w-full">
            <FirebaseProjectsWidget
              projects={firebaseProjects}
              onAddProject={handleAddFirebaseProject}
              onRemoveProject={handleRemoveFirebaseProject}
            />
          </div>
        </div>

        {/* Right Column: 4x4 Live Favorite Sites Grid */}
        <div className="flex-1 w-full max-w-xl">
          <AppGrid
            apps={apps}
            onAddApp={handleAddApp}
            onRemoveApp={handleRemoveApp}
            onUpdateApp={handleUpdateApp}
            onReorderApps={setApps}
          />
        </div>
      </main>

      {/* Bottom Footer Bar */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between text-xs text-white/70 relative z-20">
        <div className="text-center sm:text-left text-[11px] text-white/60 drop-shadow-xs">
          <span>Infyn Home Tab • Minimalist Workspace</span>
        </div>

        {/* Floating Customise Dashboard Button */}
        <button
          onClick={() => setIsCustomizeOpen(true)}
          className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-white/20 px-4 py-2 rounded-full backdrop-blur-2xl text-xs font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:border-white/40"
        >
          <Pencil className="h-3.5 w-3.5 text-rose-400" />
          <span>Customise</span>
        </button>
      </footer>

      {/* Customise Modal */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        firebaseProjects={firebaseProjects}
        onRemoveFirebaseProject={handleRemoveFirebaseProject}
      />
    </div>
  )
}
