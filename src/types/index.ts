export interface Shortcut {
  id: string
  title: string
  url: string
  icon?: string
  color?: string
}

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export interface FirebaseProject {
  id: string
  name: string
  projectId: string
  color?: string
}

export interface AppIconItem {
  id: string
  title: string
  url: string
  iconType: 'preset' | 'favicon' | 'url' | 'upload' | 'infyn-badge' | 'indivio-badge'
  iconValue: string
  cornerBadge?: string
  bgColor?: string
  category?: string
  clicks?: number
}

export interface WeatherData {
  city: string
  temp: number
  condition: string
  high: number
  low: number
}

export type SearchEngineId = 'google' | 'chatgpt' | 'chatgpt-temp' | 'perplexity' | 'duckduckgo' | 'github' | 'youtube' | 'bing'

export interface SearchEngine {
  id: SearchEngineId
  name: string
  urlPattern: string
  placeholder: string
}

export type WallpaperStyle = 'silk-aurora' | 'deep-ocean' | 'purple-nebula' | 'sunset-glow' | 'cyber-mesh' | 'clean-light'

export type ThemeStyle = 'deep-space' | 'aurora' | 'midnight' | 'sunset' | 'cyberpunk' | 'minimal'

export interface UserSettings {
  userName: string
  userAvatar?: string
  wallpaper: WallpaperStyle
  colorMode: 'light' | 'dark'
  timeFormat?: '12h' | '24h'
  showSeconds?: boolean
  showGreeting?: boolean
  theme?: ThemeStyle
  defaultSearchEngine: SearchEngineId
  weatherCity: string
  firebaseProjects: FirebaseProject[]
  apps: AppIconItem[]
  widgets: {
    shortcuts: boolean
    todos: boolean
    notes: boolean
    focusTimer: boolean
    quotes: boolean
  }
}
