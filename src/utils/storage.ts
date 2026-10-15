import type {
  AppIconItem,
  FirebaseProject,
  SearchEngine,
  UserSettings,
  WallpaperStyle,
  WidgetPlacement,
  DashboardScreen,
  WidgetConfig,
  TodoItem,
  GithubRepo,
} from '../types'

export const DEFAULT_SEARCH_ENGINES: Record<string, SearchEngine> = {
  google: {
    id: 'google',
    name: 'Google',
    urlPattern: 'https://www.google.com/search?q=',
    placeholder: 'Search Google or enter URL...',
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    urlPattern: 'https://chatgpt.com/?prompt=',
    placeholder: 'Ask ChatGPT...',
  },
  'chatgpt-temp': {
    id: 'chatgpt-temp',
    name: 'ChatGPT Anonymous',
    urlPattern: 'https://chatgpt.com/?temporary-chat=true&prompt=',
    placeholder: 'Ask ChatGPT in Temporary / Anonymous Mode...',
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    urlPattern: 'https://www.perplexity.ai/search?q=',
    placeholder: 'Ask Perplexity AI...',
  },
  duckduckgo: {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    urlPattern: 'https://duckduckgo.com/?q=',
    placeholder: 'Search DuckDuckGo...',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    urlPattern: 'https://github.com/search?q=',
    placeholder: 'Search GitHub...',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    urlPattern: 'https://www.youtube.com/results?search_query=',
    placeholder: 'Search YouTube...',
  },
}

export const DEFAULT_APPS: AppIconItem[] = [
  {
    id: 'features',
    title: 'Features Introdu...',
    url: 'https://indivio.studio/features',
    iconType: 'preset',
    iconValue: 'bulb',
    bgColor: 'bg-amber-400 text-white',
  },
  {
    id: 'bookmarks',
    title: 'Bookmarks',
    url: 'https://chrome.google.com/webstore',
    iconType: 'preset',
    iconValue: 'star',
    bgColor: 'bg-rose-400 text-white',
  },
  {
    id: 'youtube',
    title: 'YouTube',
    url: 'https://youtube.com',
    iconType: 'preset',
    iconValue: 'youtube',
    bgColor: 'bg-red-600 text-white',
  },
  {
    id: 'instagram',
    title: 'Instagram',
    url: 'https://instagram.com',
    iconType: 'preset',
    iconValue: 'instagram',
    bgColor: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white',
  },
  {
    id: 'facebook',
    title: 'Facebook',
    url: 'https://facebook.com',
    iconType: 'preset',
    iconValue: 'facebook',
    bgColor: 'bg-blue-600 text-white',
  },
  {
    id: 'infyn-admin',
    title: 'Infyn Admin',
    url: 'https://indivio.studio/admin',
    iconType: 'favicon',
    iconValue: '/logo.png',
    bgColor: 'bg-white text-slate-900',
  },
  {
    id: 'pw',
    title: 'Physics Wallah',
    url: 'https://pw.live',
    iconType: 'preset',
    iconValue: 'book',
    bgColor: 'bg-amber-100 text-amber-900',
  },
  {
    id: 'render',
    title: 'Render',
    url: 'https://render.com',
    iconType: 'preset',
    iconValue: 'box',
    bgColor: 'bg-slate-900 text-emerald-400',
  },
  {
    id: 'chatgpt',
    title: 'ChatGPT',
    url: 'https://chatgpt.com',
    iconType: 'preset',
    iconValue: 'chatgpt',
    bgColor: 'bg-teal-700 text-white',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    url: 'https://web.whatsapp.com',
    iconType: 'preset',
    iconValue: 'whatsapp',
    bgColor: 'bg-emerald-500 text-white',
  },
  {
    id: 'gmail',
    title: 'Gmail',
    url: 'https://mail.google.com',
    iconType: 'preset',
    iconValue: 'mail',
    bgColor: 'bg-white text-rose-500',
  },
  {
    id: 'apple-music',
    title: 'Apple Music',
    url: 'https://music.apple.com',
    iconType: 'preset',
    iconValue: 'music',
    bgColor: 'bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 text-white',
  },
  {
    id: 'apple-podcasts',
    title: 'Apple Podcasts',
    url: 'https://podcasts.apple.com',
    iconType: 'preset',
    iconValue: 'podcast',
    bgColor: 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white',
  },
  {
    id: 'ebay',
    title: 'eBay',
    url: 'https://ebay.com',
    iconType: 'preset',
    iconValue: 'shopping',
    bgColor: 'bg-white text-blue-600',
  },
  {
    id: 'yt-music',
    title: 'YouTube Music',
    url: 'https://music.youtube.com',
    iconType: 'preset',
    iconValue: 'ytmusic',
    bgColor: 'bg-red-700 text-white',
  },
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.com',
    iconType: 'preset',
    iconValue: 'github',
    bgColor: 'bg-slate-950 text-white',
  },
]

export const DEFAULT_FIREBASE_PROJECTS: FirebaseProject[] = [
  {
    id: 'fb-1',
    name: 'Infyn Studio App',
    projectId: 'infyn-studio-app',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'fb-2',
    name: 'Infyn Cloud Prod',
    projectId: 'infyn-cloud-prod',
    color: 'from-orange-500 to-red-600',
  },
]

export const WALLPAPERS: { id: WallpaperStyle; name: string; class: string; preview: string }[] = [
  {
    id: 'silk-aurora',
    name: 'Silk Aurora (Reference)',
    class: 'bg-gradient-to-br from-[#0c2461] via-[#1e3799] to-[#009432]',
    preview: 'from-blue-900 via-indigo-700 to-emerald-600',
  },
  {
    id: 'deep-ocean',
    name: 'Deep Ocean Blue',
    class: 'bg-gradient-to-br from-[#051937] via-[#004d7a] to-[#008793]',
    preview: 'from-slate-900 via-blue-800 to-teal-600',
  },
  {
    id: 'purple-nebula',
    name: 'Purple Nebula',
    class: 'bg-gradient-to-br from-[#1b1464] via-[#5758bb] to-[#833471]',
    preview: 'from-indigo-950 via-purple-800 to-pink-700',
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    class: 'bg-gradient-to-br from-[#4a0072] via-[#8e24aa] to-[#ff6f00]',
    preview: 'from-purple-900 via-rose-700 to-amber-500',
  },
  {
    id: 'cyber-mesh',
    name: 'Cyber Mesh',
    class: 'bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]',
    preview: 'from-slate-950 via-indigo-900 to-slate-900',
  },
  {
    id: 'clean-light',
    name: 'Clean Light Silk',
    class: 'bg-gradient-to-br from-[#e0c3fc] via-[#8ec5fc] to-[#e2ebf0]',
    preview: 'from-purple-200 via-blue-200 to-slate-100',
  },
  {
    id: 'emerald-aurora',
    name: 'Emerald Borealis',
    class: 'bg-gradient-to-br from-[#062c20] via-[#0d5940] to-[#041a13]',
    preview: 'from-emerald-950 via-emerald-700 to-teal-900',
  },
  {
    id: 'midnight-abyss',
    name: 'Midnight Obsidian',
    class: 'bg-gradient-to-br from-[#090b10] via-[#151c2e] to-[#06070a]',
    preview: 'from-black via-slate-900 to-zinc-950',
  },
  {
    id: 'cosmic-fusion',
    name: 'Cosmic Velvet',
    class: 'bg-gradient-to-br from-[#1a0826] via-[#35104d] to-[#0f0417]',
    preview: 'from-purple-950 via-fuchsia-900 to-slate-950',
  },
  {
    id: 'electric-indigo',
    name: 'Electric Indigo Silk',
    class: 'bg-gradient-to-br from-[#0a0d2c] via-[#1d2368] to-[#07091e]',
    preview: 'from-indigo-950 via-blue-900 to-indigo-950',
  },
  {
    id: 'carbon-titanium',
    name: 'Carbon Titanium',
    class: 'bg-gradient-to-br from-[#121316] via-[#242731] to-[#0d0e11]',
    preview: 'from-neutral-900 via-zinc-800 to-stone-950',
  },
  {
    id: 'hyper-marine',
    name: 'Deep Marine Cyan',
    class: 'bg-gradient-to-br from-[#051c24] via-[#0a4358] to-[#03131a]',
    preview: 'from-cyan-950 via-teal-800 to-slate-950',
  },
]

export const DEFAULT_SCREENS: DashboardScreen[] = [
  { id: 'screen-1', name: 'Home' },
  { id: 'screen-2', name: 'Productivity' },
  { id: 'screen-3', name: 'Dev' },
]

export const DEFAULT_GITHUB_REPOS: GithubRepo[] = [
  {
    id: 'repo-1',
    name: 'indivio-extension',
    owner: 'imvicky69',
    defaultBranch: 'main',
    description: 'Infyn Home Tab - Minimalist Chrome extension dashboard',
  },
]

export const DEFAULT_TODOS: TodoItem[] = [
  { id: 'todo-1', text: 'Plan top 3 goals for today', completed: false, createdAt: Date.now() - 3600000, starred: true, tag: 'Work' },
  { id: 'todo-2', text: 'Review sprint tasks & architecture', completed: false, createdAt: Date.now() - 1800000, tag: 'Work' },
  { id: 'todo-3', text: 'Take a mindful breather & focus break', completed: true, createdAt: Date.now() - 7200000, tag: 'Personal' },
]

export const DEFAULT_WIDGET_CONFIGS: Record<string, WidgetConfig> = {
  weather: { id: 'weather', screenId: 'screen-1', size: 'compact', order: 0 },
  calendar: { id: 'calendar', screenId: 'screen-1', size: 'compact', order: 1 },
  shortcuts: { id: 'shortcuts', screenId: 'screen-1', size: 'wide', order: 2 },
  notes: { id: 'notes', screenId: 'screen-2', size: 'normal', order: 0 },
  focusTimer: { id: 'focusTimer', screenId: 'screen-2', size: 'normal', order: 1 },
  todos: { id: 'todos', screenId: 'screen-2', size: 'wide', order: 2 },
  github: { id: 'github', screenId: 'screen-3', size: 'normal', order: 0 },
  firebase: { id: 'firebase', screenId: 'screen-3', size: 'normal', order: 1 },
  screenshots: { id: 'screenshots', screenId: 'screen-1', size: 'normal', order: 3 },
}

export const DEFAULT_WIDGET_PLACEMENTS: Record<string, WidgetPlacement> = {
  weather: 'screen1',
  calendar: 'screen1',
  shortcuts: 'screen1',
  notes: 'screen2',
  focusTimer: 'screen2',
  todos: 'screen2',
  github: 'screen2',
  firebase: 'screen2',
}

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Vikky Raja',
  userAvatar: '',
  wallpaper: 'silk-aurora',
  liveWallpaper: true,
  colorMode: 'dark',
  defaultSearchEngine: 'google',
  weatherCity: 'Varanasi',
  firebaseProjects: DEFAULT_FIREBASE_PROJECTS,
  githubUsername: 'imvicky69',
  githubRepos: DEFAULT_GITHUB_REPOS,
  apps: DEFAULT_APPS,
  timeFormat: '12h',
  showSeconds: false,
  showGreeting: false,
  showDate: true,
  showSearchBar: false,
  timezone: 'auto',
  widgets: {
    weather: true,
    calendar: true,
    firebase: true,
    github: true,
    shortcuts: true,
    todos: true,
    notes: true,
    focusTimer: true,
    quotes: false,
    clock: true,
    searchBar: true,
    screenshots: true,
  },
  widgetPlacements: DEFAULT_WIDGET_PLACEMENTS,
  screens: DEFAULT_SCREENS,
  defaultScreenId: 'screen-1',
  widgetConfigs: DEFAULT_WIDGET_CONFIGS,
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`infyn_${key}`) || localStorage.getItem(`indivio_${key}`)
    if (!item) return defaultValue
    const parsed = JSON.parse(item)
    if (key === 'settings' && typeof defaultValue === 'object' && defaultValue !== null) {
      const def = defaultValue as Record<string, any>
      const parsedPlacements = parsed.widgetPlacements || {}

      const mergedConfigs: Record<string, WidgetConfig> = {
        ...DEFAULT_WIDGET_CONFIGS,
        ...(parsed.widgetConfigs || {}),
      }

      // Backward compatibility: If legacy widgetPlacements exist but not widgetConfigs
      if (!parsed.widgetConfigs && parsed.widgetPlacements) {
        Object.entries(parsed.widgetPlacements).forEach(([wId, placement]) => {
          if (mergedConfigs[wId]) {
            mergedConfigs[wId] = {
              ...mergedConfigs[wId],
              screenId: placement === 'screen1' ? 'screen-1' : placement === 'screen2' ? 'screen-2' : 'hidden',
            }
          }
        })
      }

      // Auto-migrate legacy default 'wide' size for notes and focusTimer to 'normal'
      if (mergedConfigs.notes && mergedConfigs.notes.size === 'wide') {
        mergedConfigs.notes.size = 'normal'
      }
      if (mergedConfigs.focusTimer && mergedConfigs.focusTimer.size === 'wide') {
        mergedConfigs.focusTimer.size = 'normal'
      }

      // Move firebase from screen-1 to screen-3 (Dev)
      if (mergedConfigs.firebase && (mergedConfigs.firebase.screenId === 'screen-1' || !mergedConfigs.firebase.screenId)) {
        mergedConfigs.firebase.screenId = 'screen-3'
      }

      // Ensure github is configured on screen-3 by default
      if (!mergedConfigs.github) {
        mergedConfigs.github = { id: 'github', screenId: 'screen-3', size: 'normal', order: 0 }
      }

      // Ensure todos is configured on screen-2 by default if not set
      if (!mergedConfigs.todos) {
        mergedConfigs.todos = { id: 'todos', screenId: 'screen-2', size: 'wide', order: 2 }
      }

      // Ensure Dev screen exists in screens array
      let resolvedScreens: DashboardScreen[] =
        Array.isArray(parsed.screens) && parsed.screens.length > 0 ? parsed.screens : DEFAULT_SCREENS
      if (!resolvedScreens.some((s) => s.id === 'screen-3')) {
        resolvedScreens = [...resolvedScreens, { id: 'screen-3', name: 'Dev' }]
      }

      const resolvedWidgets = {
        ...def.widgets,
        ...(parsed.widgets || {}),
        github: parsed.widgets?.github ?? true,
        firebase: parsed.widgets?.firebase ?? true,
      }

      // Ensure any widget that is assigned to a screen (and not hidden) is enabled in widgets map
      Object.entries(mergedConfigs).forEach(([wKey, cfg]) => {
        if (cfg.screenId && cfg.screenId !== 'hidden') {
          resolvedWidgets[wKey] = true
        } else if (cfg.screenId === 'hidden') {
          resolvedWidgets[wKey] = false
        }
      })

      return {
        ...def,
        ...parsed,
        screens: resolvedScreens,
        defaultScreenId: parsed.defaultScreenId || 'screen-1',
        widgetConfigs: mergedConfigs,
        widgets: resolvedWidgets,
        widgetPlacements: {
          ...DEFAULT_WIDGET_PLACEMENTS,
          ...parsedPlacements,
        },
      } as T
    }
    return parsed
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error)
    return defaultValue
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`infyn_${key}`, JSON.stringify(value))
    const chromeObj = (globalThis as any).chrome
    if (chromeObj?.storage?.local) {
      chromeObj.storage.local.set({ [`infyn_${key}`]: value }).catch(() => { })
    }
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error)
  }
}
