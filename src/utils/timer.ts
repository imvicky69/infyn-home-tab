import { useSyncExternalStore } from 'react'

export const TIMER_STORAGE_KEY = 'infyn_focus_timer_state'

export type TimerMode = 'focus' | 'shortBreak' | 'deepWork'

export interface StoredTimer {
  mode: TimerMode
  timeLeft: number
  isRunning: boolean
  targetEndTime: number | null
}

export const modeDurations: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  deepWork: 45 * 60,
}

export function updateExtensionBadge(text: string, color: string = '#000000'): void {
  try {
    const chromeObj = (globalThis as any).chrome
    if (chromeObj?.action?.setBadgeText) {
      chromeObj.action.setBadgeText({ text })
      if (chromeObj?.action?.setBadgeBackgroundColor) {
        chromeObj.action.setBadgeBackgroundColor({ color })
      }
    }
  } catch {
    // Non-extension environment
  }
}

export const loadStoredTimer = (): StoredTimer => {
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY)
    if (raw) {
      const parsed: StoredTimer = JSON.parse(raw)
      if (parsed.isRunning && parsed.targetEndTime) {
        const remaining = Math.max(0, Math.round((parsed.targetEndTime - Date.now()) / 1000))
        return {
          ...parsed,
          timeLeft: remaining,
          isRunning: remaining > 0,
          targetEndTime: remaining > 0 ? parsed.targetEndTime : null,
        }
      }
      return parsed
    }
  } catch {
    // Fallback
  }
  return {
    mode: 'focus',
    timeLeft: 25 * 60,
    isRunning: false,
    targetEndTime: null,
  }
}

// Global Singleton Reactive Store
let currentTimer: StoredTimer = loadStoredTimer()
let isOverlayDismissed = false
const subscribers = new Set<() => void>()
let tickerInterval: any = null

function notify() {
  subscribers.forEach((cb) => cb())
}

function syncToStorage(state: StoredTimer) {
  try {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state))
    const chromeObj = (globalThis as any).chrome
    if (chromeObj?.storage?.local) {
      chromeObj.storage.local.set({ [TIMER_STORAGE_KEY]: state }).catch(() => {})
    }
    if (state.isRunning && state.timeLeft > 0) {
      const mins = Math.ceil(state.timeLeft / 60)
      updateExtensionBadge(`${mins}m`, '#000000')
    } else {
      updateExtensionBadge('')
    }
  } catch {
    // Ignore
  }
}

function startTicker() {
  if (tickerInterval) clearInterval(tickerInterval)
  tickerInterval = setInterval(() => {
    if (!currentTimer.isRunning || !currentTimer.targetEndTime) {
      stopTicker()
      return
    }
    const remaining = Math.max(0, Math.round((currentTimer.targetEndTime - Date.now()) / 1000))
    if (remaining <= 0) {
      stopTicker()
      currentTimer = {
        mode: currentTimer.mode,
        timeLeft: 0,
        isRunning: false,
        targetEndTime: null,
      }
      syncToStorage(currentTimer)
      notify()
    } else {
      currentTimer = {
        ...currentTimer,
        timeLeft: remaining,
      }
      const mins = Math.ceil(remaining / 60)
      updateExtensionBadge(`${mins}m`, '#000000')
      notify()
    }
  }, 500)
}

function stopTicker() {
  if (tickerInterval) {
    clearInterval(tickerInterval)
    tickerInterval = null
  }
  updateExtensionBadge('')
}

// If already running on load, start ticker
if (currentTimer.isRunning && currentTimer.targetEndTime) {
  startTicker()
}

// Global cross-tab & chrome.storage listener
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === TIMER_STORAGE_KEY && e.newValue) {
      try {
        const remote: StoredTimer = JSON.parse(e.newValue)
        if (remote.isRunning && remote.targetEndTime) {
          const remaining = Math.max(0, Math.round((remote.targetEndTime - Date.now()) / 1000))
          currentTimer = {
            ...remote,
            timeLeft: remaining,
            isRunning: remaining > 0,
          }
          if (remaining > 0) startTicker()
          else stopTicker()
        } else {
          currentTimer = remote
          stopTicker()
        }
        notify()
      } catch {}
    }
  })

  const chromeObj = (globalThis as any).chrome
  if (chromeObj?.storage?.onChanged) {
    chromeObj.storage.onChanged.addListener((changes: any, area: string) => {
      if (area === 'local' && changes[TIMER_STORAGE_KEY]) {
        const remote = changes[TIMER_STORAGE_KEY].newValue as StoredTimer
        if (remote) {
          if (remote.isRunning && remote.targetEndTime) {
            const remaining = Math.max(0, Math.round((remote.targetEndTime - Date.now()) / 1000))
            currentTimer = {
              ...remote,
              timeLeft: remaining,
              isRunning: remaining > 0,
            }
            if (remaining > 0) startTicker()
            else stopTicker()
          } else {
            currentTimer = remote
            stopTicker()
          }
          localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(currentTimer))
          notify()
        }
      }
    })
  }
}

export function useFocusTimer() {
  const timerState = useSyncExternalStore(
    (onStoreChange) => {
      subscribers.add(onStoreChange)
      return () => subscribers.delete(onStoreChange)
    },
    () => currentTimer
  )

  const { mode, timeLeft, isRunning, targetEndTime } = timerState

  const togglePlay = () => {
    if (currentTimer.isRunning) {
      // PAUSE:
      const remaining = currentTimer.targetEndTime
        ? Math.max(0, Math.round((currentTimer.targetEndTime - Date.now()) / 1000))
        : currentTimer.timeLeft
      stopTicker()
      currentTimer = {
        mode: currentTimer.mode,
        timeLeft: remaining,
        isRunning: false,
        targetEndTime: null,
      }
      syncToStorage(currentTimer)
      notify()
    } else {
      // START / RESUME:
      isOverlayDismissed = false
      const duration = currentTimer.timeLeft > 0 ? currentTimer.timeLeft : modeDurations[currentTimer.mode]
      const target = Date.now() + duration * 1000
      currentTimer = {
        mode: currentTimer.mode,
        timeLeft: duration,
        isRunning: true,
        targetEndTime: target,
      }
      startTicker()
      syncToStorage(currentTimer)
      notify()
    }
  }

  const setTimerMode = (newMode: TimerMode) => {
    stopTicker()
    isOverlayDismissed = false
    const newDuration = modeDurations[newMode]
    currentTimer = {
      mode: newMode,
      timeLeft: newDuration,
      isRunning: false,
      targetEndTime: null,
    }
    syncToStorage(currentTimer)
    notify()
  }

  const resetTimer = () => {
    stopTicker()
    isOverlayDismissed = false
    const fullDuration = modeDurations[currentTimer.mode]
    currentTimer = {
      mode: currentTimer.mode,
      timeLeft: fullDuration,
      isRunning: false,
      targetEndTime: null,
    }
    syncToStorage(currentTimer)
    notify()
  }

  const dismissOverlay = () => {
    isOverlayDismissed = true
    notify()
  }

  const totalDuration = modeDurations[mode]
  // Overlay should be visible if not dismissed AND (running OR actively paused mid-session)
  const isMidSession = timeLeft > 0 && timeLeft < totalDuration
  const shouldShowOverlay = !isOverlayDismissed && (isRunning || isMidSession)

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100)

  return {
    timerState,
    mode,
    timeLeft,
    isRunning,
    isPaused: !isRunning && isMidSession,
    targetEndTime,
    togglePlay,
    setTimerMode,
    resetTimer,
    dismissOverlay,
    shouldShowOverlay,
    formattedTime,
    progressPercent,
  }
}
