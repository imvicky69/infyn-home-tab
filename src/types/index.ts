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
  priority?: 'low' | 'normal' | 'high'
  starred?: boolean
  tag?: string
}

export interface FirebaseProject {
  id: string
  name: string
  projectId: string
  color?: string
}

export interface GithubRepo {
  id: string
  name: string
  owner: string
  description?: string
  defaultBranch?: string
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

export type WallpaperStyle =
  | 'silk-aurora'
  | 'deep-ocean'
  | 'purple-nebula'
  | 'sunset-glow'
  | 'cyber-mesh'
  | 'clean-light'
  | 'emerald-aurora'
  | 'midnight-abyss'
  | 'cosmic-fusion'
  | 'electric-indigo'
  | 'carbon-titanium'
  | 'hyper-marine'

export type ThemeStyle = 'deep-space' | 'aurora' | 'midnight' | 'sunset' | 'cyberpunk' | 'minimal'

export type WidgetPlacement = 'screen1' | 'screen2' | 'hidden'

export interface DashboardScreen {
  id: string
  name: string
}

export type WidgetSize = 'compact' | 'normal' | 'wide'

export interface WidgetConfig {
  id: string
  screenId: string // e.g. 'screen-1', 'screen-2', 'screen-3', etc., or 'hidden'
  size: WidgetSize
  order: number
}

export interface UserSettings {
  userName: string
  userAvatar?: string
  wallpaper: WallpaperStyle
  liveWallpaper?: boolean
  colorMode: 'light' | 'dark'
  timeFormat?: '12h' | '24h'
  showSeconds?: boolean
  showGreeting?: boolean
  showDate?: boolean
  showSearchBar?: boolean
  timezone?: string
  theme?: ThemeStyle
  defaultSearchEngine: SearchEngineId
  weatherCity: string
  firebaseProjects: FirebaseProject[]
  githubUsername?: string
  githubRepos?: GithubRepo[]
  apps: AppIconItem[]
  widgets: {
    weather: boolean
    calendar: boolean
    firebase: boolean
    shortcuts: boolean
    todos: boolean
    notes: boolean
    focusTimer: boolean
    quotes: boolean
    clock?: boolean
    searchBar?: boolean
    github?: boolean
  }
  widgetPlacements?: Record<string, WidgetPlacement>
  screens?: DashboardScreen[]
  defaultScreenId?: string
  widgetConfigs?: Record<string, WidgetConfig>
}
