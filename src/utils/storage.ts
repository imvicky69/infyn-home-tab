import type {
  AppIconItem,
  FirebaseProject,
  SearchEngine,
  UserSettings,
  WallpaperStyle,
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
]

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Vikky Raja',
  userAvatar: '',
  wallpaper: 'silk-aurora',
  colorMode: 'dark',
  defaultSearchEngine: 'google',
  weatherCity: 'Varanasi',
  firebaseProjects: DEFAULT_FIREBASE_PROJECTS,
  apps: DEFAULT_APPS,
  widgets: {
    shortcuts: true,
    todos: true,
    notes: true,
    focusTimer: true,
    quotes: true,
  },
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`infyn_${key}`) || localStorage.getItem(`indivio_${key}`)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error)
    return defaultValue
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`infyn_${key}`, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error)
  }
}
