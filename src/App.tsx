import { useState, useEffect, useRef } from 'react'
import {
  Search,
  User,
  Keyboard,
  CornerDownLeft,
  ChevronDown,
  Sparkles,
  Command,
  Bot,
  EyeOff,
  Star,
} from 'lucide-react'
import type {
  AppIconItem,
  FirebaseProject,
  UserSettings,
  SearchEngineId,
  DashboardScreen,
  WidgetSize,
  TodoItem,
  GithubRepo,
} from './types'
import {
  DEFAULT_SETTINGS,
  DEFAULT_APPS,
  DEFAULT_FIREBASE_PROJECTS,
  DEFAULT_SEARCH_ENGINES,
  DEFAULT_SCREENS,
  DEFAULT_WIDGET_CONFIGS,
  DEFAULT_TODOS,
  DEFAULT_GITHUB_REPOS,
  WALLPAPERS,
  loadFromStorage,
  saveToStorage,
} from './utils/storage'
import { WeatherCard } from './components/WeatherCard'
import { CalendarCard } from './components/CalendarCard'
import { FirebaseProjectsWidget } from './components/FirebaseProjectsWidget'
import { AppGrid } from './components/AppGrid'
import { CustomizeModal } from './components/CustomizeModal'
import { NotesWidget } from './components/NotesWidget'
import { FocusTimerWidget } from './components/FocusTimerWidget'
import { TodoListWidget } from './components/TodoListWidget'
import { GithubWidget } from './components/GithubWidget'
import { ScreenshotsWidget } from './components/ScreenshotsWidget'
import { AnimatedLogo } from './components/AnimatedLogo'
import { ClockWidget } from './components/ClockWidget'
import { FloatingTimerOverlay } from './components/FloatingTimerOverlay'
import { LiveWallpaper } from './components/LiveWallpaper'

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
  const [scratchpadNote, setScratchpadNote] = useState<string>(() =>
    loadFromStorage('scratchpad_note', '')
  )
  const [todos, setTodos] = useState<TodoItem[]>(() =>
    loadFromStorage('todos', DEFAULT_TODOS)
  )
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>(() =>
    loadFromStorage('githubRepos', DEFAULT_GITHUB_REPOS)
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchEngineOpen, setIsSearchEngineOpen] = useState(false)
  const [currentEngine, setCurrentEngine] = useState<SearchEngineId>(settings.defaultSearchEngine)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchDropdownRef = useRef<HTMLDivElement>(null)

  const handleNoteChange = (text: string) => {
    setScratchpadNote(text)
    saveToStorage('scratchpad_note', text)
  }

  const handleAddTodo = (text: string, options?: { starred?: boolean; tag?: string }) => {
    const newTodo: TodoItem = {
      id: `todo-${Date.now().toString(36)}`,
      text,
      completed: false,
      createdAt: Date.now(),
      starred: options?.starred,
      tag: options?.tag,
    }
    setTodos((prev) => [newTodo, ...prev])
  }

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const handleToggleStarTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t))
    )
  }

  const handleUpdateTodoText = (id: string, text: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text } : t))
    )
  }

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const handleClearCompletedTodos = () => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  const handleAddGithubRepo = (newRepo: Omit<GithubRepo, 'id'>) => {
    const item: GithubRepo = {
      ...newRepo,
      id: `repo-${Date.now().toString(36)}`,
    }
    setGithubRepos((prev) => [...prev, item])
  }

  const handleRemoveGithubRepo = (id: string) => {
    setGithubRepos((prev) => prev.filter((r) => r.id !== id))
  }

  const handleUpdateGithubRepo = (updated: GithubRepo) => {
    setGithubRepos((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
  }

  const handleUpdateSettings = (newSettings: UserSettings) => {
    // If githubUsername changed, auto-update repos that were using the previous username
    if (newSettings.githubUsername && newSettings.githubUsername !== settings.githubUsername) {
      const oldUsername = settings.githubUsername || 'imvicky69'
      const newUsername = newSettings.githubUsername
      setGithubRepos((prev) =>
        prev.map((r) => (r.owner === oldUsername || !r.owner ? { ...r, owner: newUsername } : r))
      )
    }
    setSettings(newSettings)
  }

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

  useEffect(() => {
    saveToStorage('todos', todos)
  }, [todos])

  useEffect(() => {
    saveToStorage('githubRepos', githubRepos)
  }, [githubRepos])

  // Cross-tab synchronization for notes, settings, apps, projects
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'infyn_scratchpad_note' || e.key === 'indivio_scratchpad_note') {
        try {
          if (e.newValue !== null) {
            setScratchpadNote(JSON.parse(e.newValue))
          }
        } catch {}
      }
      if (e.key === 'infyn_todos' || e.key === 'indivio_todos') {
        try {
          if (e.newValue !== null) {
            setTodos(JSON.parse(e.newValue))
          }
        } catch {}
      }
      if (e.key === 'infyn_githubRepos' || e.key === 'indivio_githubRepos') {
        try {
          if (e.newValue !== null) {
            setGithubRepos(JSON.parse(e.newValue))
          }
        } catch {}
      }
      if (e.key === 'infyn_settings') {
        try {
          if (e.newValue !== null) {
            setSettings(JSON.parse(e.newValue))
          }
        } catch {}
      }
      if (e.key === 'infyn_apps') {
        try {
          if (e.newValue !== null) {
            setApps(JSON.parse(e.newValue))
          }
        } catch {}
      }
      if (e.key === 'infyn_firebaseProjects') {
        try {
          if (e.newValue !== null) {
            setFirebaseProjects(JSON.parse(e.newValue))
          }
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

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

  // Screens and Widget Configuration
  const screens: DashboardScreen[] = (settings.screens && settings.screens.length > 0)
    ? settings.screens
    : DEFAULT_SCREENS

  const defaultScreenId = settings.defaultScreenId || screens[0]?.id || 'screen-1'
  const widgetConfigs = settings.widgetConfigs || DEFAULT_WIDGET_CONFIGS

  const screenRefs = useRef<Record<string, HTMLElement | null>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeScreenId, setActiveScreenId] = useState<string>(() => defaultScreenId || screens[0]?.id || 'screen-1')

  const scrollToScreen = (screenId: string) => {
    setActiveScreenId(screenId)
    const el = screenRefs.current[screenId]
    const container = containerRef.current
    if (el && container) {
      container.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Sync activeScreenId with scroll position
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const height = container.clientHeight
      if (height <= 0) return
      const index = Math.min(screens.length - 1, Math.max(0, Math.round(scrollTop / height)))
      if (screens[index] && screens[index].id !== activeScreenId) {
        setActiveScreenId(screens[index].id)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [screens, activeScreenId])

  // Automatic startup scroll to chosen default screen
  const initialScrollRef = useRef(false)
  useEffect(() => {
    if (!initialScrollRef.current) {
      initialScrollRef.current = true
      if (defaultScreenId && defaultScreenId !== screens[0]?.id) {
        setTimeout(() => {
          setActiveScreenId(defaultScreenId)
          screenRefs.current[defaultScreenId]?.scrollIntoView({ behavior: 'smooth' })
        }, 80)
      }
    }
  }, [defaultScreenId, screens])

  const getScreenWidgets = (screenId: string) => {
    return Object.entries(widgetConfigs)
      .filter(([key, cfg]) => {
        if (settings.widgets && (settings.widgets as Record<string, boolean>)[key] === false) return false
        if (cfg.screenId !== screenId) return false
        if (cfg.screenId === 'hidden') return false
        return true
      })
      .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0))
      .map(([key, cfg]) => ({ key, ...cfg }))
  }

  const renderWidget = (key: string, size: WidgetSize = 'normal') => {
    switch (key) {
      case 'weather':
        return <WeatherCard city={settings.weatherCity} />
      case 'calendar':
        return <CalendarCard />
      case 'firebase':
        return (
          <div className="w-full">
            <FirebaseProjectsWidget
              projects={firebaseProjects}
              onAddProject={handleAddFirebaseProject}
              onRemoveProject={handleRemoveFirebaseProject}
            />
          </div>
        )
      case 'shortcuts':
        return (
          <div className="w-full flex justify-center">
            <AppGrid
              apps={apps}
              onAddApp={handleAddApp}
              onRemoveApp={handleRemoveApp}
              onUpdateApp={handleUpdateApp}
              onReorderApps={setApps}
            />
          </div>
        )
      case 'notes':
        return (
          <div className={`w-full ${size === 'compact' ? 'h-48 sm:h-52' : size === 'wide' ? 'h-[360px] sm:h-[420px]' : 'h-64 sm:h-72'}`}>
            <NotesWidget note={scratchpadNote} onNoteChange={handleNoteChange} />
          </div>
        )
      case 'focusTimer':
        return (
          <div className="w-full">
            <FocusTimerWidget />
          </div>
        )
      case 'todos':
        return (
          <div className="w-full">
            <TodoListWidget
              todos={todos}
              size={size}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onToggleStarTodo={handleToggleStarTodo}
              onUpdateTodoText={handleUpdateTodoText}
              onDeleteTodo={handleDeleteTodo}
              onClearCompleted={handleClearCompletedTodos}
            />
          </div>
        )
      case 'github':
        return (
          <div className="w-full">
            <GithubWidget
              repos={githubRepos}
              defaultUsername={settings.githubUsername || 'imvicky69'}
              onAddRepo={handleAddGithubRepo}
              onRemoveRepo={handleRemoveGithubRepo}
              onUpdateRepo={handleUpdateGithubRepo}
            />
          </div>
        )
      case 'screenshots':
        return (
          <div className="w-full">
            <ScreenshotsWidget size={size} />
          </div>
        )
      default:
        return null
    }
  }

  const renderOtherWidgets = (widgets: Array<{ key: string; size: WidgetSize }>) => {
    const hasWeather = widgets.some((w) => w.key === 'weather')
    const hasCalendar = widgets.some((w) => w.key === 'calendar')
    const pairWeatherCalendar = hasWeather && hasCalendar

    return (
      <div className="flex flex-col items-center gap-3.5 w-full sm:w-[310px] md:w-[320px] shrink-0 animate-in fade-in duration-300">
        {pairWeatherCalendar && (
          <div className="grid grid-cols-2 gap-3 w-full justify-items-center">
            <WeatherCard city={settings.weatherCity} />
            <CalendarCard />
          </div>
        )}
        {widgets.map(({ key, size }) => {
          if (pairWeatherCalendar && (key === 'weather' || key === 'calendar')) {
            return null
          }
          return (
            <div key={key} className="w-full">
              {renderWidget(key, size)}
            </div>
          )
        })}
      </div>
    )
  }

  const renderGridWidgets = (widgets: Array<{ key: string; size: WidgetSize }>) => {
    const hasWeather = widgets.some((w) => w.key === 'weather')
    const hasCalendar = widgets.some((w) => w.key === 'calendar')
    const pairWeatherCalendar = hasWeather && hasCalendar

    return (
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 items-start animate-in fade-in duration-300">
        {pairWeatherCalendar && (
          <div className="grid grid-cols-2 gap-3 w-full justify-items-center md:col-span-1">
            <WeatherCard city={settings.weatherCity} />
            <CalendarCard />
          </div>
        )}
        {widgets.map(({ key, size }) => {
          if (pairWeatherCalendar && (key === 'weather' || key === 'calendar')) {
            return null
          }
          const isWide = size === 'wide'
          return (
            <div
              key={key}
              className={`${isWide ? 'md:col-span-2' : 'col-span-1'} w-full flex justify-center items-start`}
            >
              {renderWidget(key, size)}
            </div>
          )
        })}
      </div>
    )
  }

  const showSearchBar = settings.widgets?.searchBar !== false
  const showClock = settings.widgets?.clock !== false
  const timerScreenId = widgetConfigs.focusTimer?.screenId || 'screen-2'

  const isLiveWallpaper = settings.liveWallpaper !== false

  return (
    <div
      ref={containerRef}
      className={`min-h-screen ${screens.length > 1 ? 'h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth' : ''} ${activeWallpaper} ${
        isLiveWallpaper ? 'live-wallpaper-motion' : ''
      } text-white flex flex-col selection:bg-white selection:text-black relative overflow-x-hidden transition-all duration-700 font-sans w-full max-w-full`}
      style={{
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }}
    >
      {/* Optional Subtle Ambient Live Wallpaper Movement Layer */}
      <LiveWallpaper wallpaper={settings.wallpaper} enabled={isLiveWallpaper} />
      {screens.map((screen, screenIndex) => {
        const screenWidgets = getScreenWidgets(screen.id)
        const hasShortcuts = screenWidgets.some((w) => w.key === 'shortcuts')
        const otherWidgets = screenWidgets.filter((w) => w.key !== 'shortcuts')
        const leftWidgets = otherWidgets.filter((w) => w.key !== 'screenshots')
        const rightWidgets = otherWidgets.filter((w) => w.key === 'screenshots')

        return (
          <section
            key={screen.id}
            id={screen.id}
            ref={(el) => {
              screenRefs.current[screen.id] = el
            }}
            className="w-full min-h-screen h-screen snap-start flex flex-col justify-between shrink-0 relative px-4 sm:px-6 py-4 z-20 overflow-hidden"
          >
            {/* Top Header: Screen 1 has full search & profile, other screens have back & screen title */}
            {screenIndex === 0 ? (
              <header className="w-full max-w-5xl mx-auto pt-2 flex items-center justify-between gap-3 relative z-30 shrink-0">
                {/* Left: Infyn Animated Logo Pill (Adaptive glass background, no white background) */}
                <div className="flex items-center gap-2">
                  <a
                    href="https://indivio.studio"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center bg-black/25 hover:bg-black/40 border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-2xl backdrop-blur-xl shadow-xs transition-all duration-300 hover:scale-105 group text-white"
                    title="Infyn Home Tab"
                  >
                    <AnimatedLogo variant="navbar" width={32} className="shrink-0 text-white drop-shadow-sm" />
                  </a>

                  {showSearchBar && (
                    <button
                      onClick={() => searchInputRef.current?.focus()}
                      className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] transition-colors"
                      title="Focus Search"
                    >
                      <Keyboard className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Center: Search Engine Dropdown + Search Bar (if enabled) */}
                {showSearchBar ? (
                  <div className="flex-1 max-w-md relative" ref={searchDropdownRef}>
                    <form onSubmit={handleSearch} className="relative w-full group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center gap-1.5 z-10">
                        <button
                          type="button"
                          onClick={() => setIsSearchEngineOpen(!isSearchEngineOpen)}
                          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors py-1 px-1.5 rounded-lg hover:bg-white/10"
                          title={`Current engine: ${activeEngine.name}. Click to switch.`}
                        >
                          {activeEngine.id === 'chatgpt-temp' ? (
                            <EyeOff className="h-4 w-4 text-white/70" />
                          ) : activeEngine.id === 'chatgpt' ? (
                            <Bot className="h-4 w-4 text-white/90" />
                          ) : activeEngine.id === 'perplexity' ? (
                            <Sparkles className="h-4 w-4 text-white/80" />
                          ) : (
                            <Search className="h-4 w-4 text-white/60 group-focus-within:text-white transition-colors" />
                          )}
                          <ChevronDown className="h-3 w-3 text-slate-400" />
                        </button>
                      </div>

                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={activeEngine.placeholder}
                        className="w-full pl-20 sm:pl-22 pr-20 py-2.5 rounded-2xl bg-black/30 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-xl transition-all shadow-lg text-xs sm:text-sm"
                      />

                      {/* Right side hotkey badge & submit indicator */}
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1 pointer-events-none">
                        {searchQuery ? (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white text-black border border-white/40 text-[10px] font-mono font-bold shadow-xs">
                            <span>Enter</span>
                            <CornerDownLeft className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.08] border border-white/10 text-[10px] text-white/50 font-mono">
                            <Command className="h-3 w-3" />
                            <span>K</span>
                          </div>
                        )}
                      </div>
                    </form>

                    {/* Search Engine Selector Dropdown Menu */}
                    {isSearchEngineOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-50 p-1 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
                          Default Engine
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
                                ? 'bg-white/15 text-white font-semibold'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {engine.id === 'chatgpt-temp' ? (
                                <EyeOff className="h-3.5 w-3.5 text-white/70" />
                              ) : engine.id === 'chatgpt' ? (
                                <Bot className="h-3.5 w-3.5 text-white/90" />
                              ) : engine.id === 'perplexity' ? (
                                <Sparkles className="h-3.5 w-3.5 text-white/80" />
                              ) : (
                                <Search className="h-3.5 w-3.5 text-slate-400" />
                              )}
                              <span>{engine.name}</span>
                            </div>
                            {activeEngine.id === engine.id && (
                              <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1" />
                )}

                {/* Right: Minimized User Profile Avatar Button */}
                <div className="flex items-center">
                  <button
                    onClick={() => setIsCustomizeOpen(true)}
                    className="flex items-center gap-2 bg-black/25 hover:bg-black/40 border border-white/10 hover:border-white/25 px-2.5 py-1.5 rounded-full backdrop-blur-xl text-xs font-semibold text-white/90 hover:text-white transition-all duration-200 hover:scale-105 shadow-sm group"
                    title={`Customize & Settings • ${settings.userName}`}
                  >
                    <div className="h-5 w-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold shadow-xs transition-transform group-hover:scale-105">
                      <User className="h-3 w-3 stroke-[2.5]" />
                    </div>
                    <span className="hidden sm:inline font-medium text-[11px] max-w-[100px] truncate">{settings.userName}</span>
                  </button>
                </div>
              </header>
            ) : (
              // Empty placeholder for Screen 2+ so layout is clean without duplicate headers
              <div className="h-4 shrink-0" />
            )}

            {/* Big Clock Time Widget (Below search bar or replacing it on Screen 1) */}
            {screenIndex === 0 && showClock && (
              <div className="w-full max-w-5xl mx-auto px-4 flex justify-center py-2 sm:py-3 relative z-20 animate-in fade-in duration-300">
                <ClockWidget settings={settings} onUpdateSettings={setSettings} />
              </div>
            )}

            {/* Screen Main Content */}
            {hasShortcuts ? (
              <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 relative z-20 min-h-0 overflow-y-auto no-scrollbar transition-all duration-300">
                {leftWidgets.length > 0 && renderOtherWidgets(leftWidgets)}
                <div className={`w-full max-w-lg flex justify-center animate-in fade-in duration-300 ${
                  leftWidgets.length === 0 && rightWidgets.length === 0 ? 'mx-auto' : ''
                }`}>
                  <AppGrid
                    apps={apps}
                    onAddApp={handleAddApp}
                    onRemoveApp={handleRemoveApp}
                    onUpdateApp={handleUpdateApp}
                    onReorderApps={setApps}
                  />
                </div>
                {rightWidgets.length > 0 && (
                  <div className="flex flex-col items-center gap-3.5 w-full sm:w-[310px] md:w-[320px] shrink-0 animate-in fade-in duration-300">
                    {rightWidgets.map(({ key, size }) => (
                      <div key={key} className="w-full">
                        {renderWidget(key, size)}
                      </div>
                    ))}
                  </div>
                )}
              </main>
            ) : (
              <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex items-center justify-center relative z-20 min-h-0 overflow-y-auto no-scrollbar transition-all duration-300">
                {screenWidgets.length > 0 ? (
                  renderGridWidgets(screenWidgets)
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-white/60 border border-dashed border-white/15 rounded-3xl max-w-md bg-black/20 backdrop-blur-sm">
                    <p className="text-sm font-semibold text-white">No widgets on this screen yet</p>
                    <p className="text-xs text-white/40 mt-1">Open Customize to move widgets here or adjust your layout.</p>
                    <button
                      onClick={() => setIsCustomizeOpen(true)}
                      className="mt-4 px-4 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md transition-all"
                    >
                      Customize Screen
                    </button>
                  </div>
                )}
              </main>
            )}

            {/* Bottom spacer for clean padding */}
            <div className="h-10 shrink-0 pointer-events-none" />
          </section>
        )
      })}

      {/* Single Persistent Floating Bottom Screen Dock */}
      {screens.length > 1 && (
        <aside
          aria-label="Screen Switcher"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-auto select-none"
        >
          <nav className="flex items-center gap-1.5 bg-black/75 border border-white/20 p-1.5 rounded-full backdrop-blur-2xl shadow-2xl shadow-black/80 text-white">
            {screens.map((s, sIdx) => {
              const isCurrent = s.id === activeScreenId
              const isDef = s.id === defaultScreenId
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollToScreen(s.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isCurrent
                      ? 'bg-white text-black shadow-sm font-black scale-105'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isDef && (
                    <Star
                      className={`h-2.5 w-2.5 ${isCurrent ? 'fill-black text-black' : 'fill-white/60 text-white/60'}`}
                    />
                  )}
                  <span>{s.name || `Screen ${sIdx + 1}`}</span>
                </button>
              )
            })}
          </nav>
        </aside>
      )}

      {/* Floating Focus Timer Overlay (Active across all screens) */}
      <FloatingTimerOverlay onScrollToTimer={() => scrollToScreen(timerScreenId)} />

      {/* Customise Modal */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        firebaseProjects={firebaseProjects}
        onAddFirebaseProject={handleAddFirebaseProject}
        onRemoveFirebaseProject={handleRemoveFirebaseProject}
        githubRepos={githubRepos}
        onAddGithubRepo={handleAddGithubRepo}
        onRemoveGithubRepo={handleRemoveGithubRepo}
        onUpdateGithubRepo={handleUpdateGithubRepo}
      />
    </div>
  )
}
