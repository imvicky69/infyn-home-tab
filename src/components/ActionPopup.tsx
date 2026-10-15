import React, { useState, useEffect } from 'react'
import {
  Camera,
  Layers,
  Monitor,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Check,
  Copy,
  Download,
  ExternalLink,
} from 'lucide-react'
import { saveScreenshot, type ScreenshotItem } from '../utils/screenshotStorage'

declare const chrome: any

const TIMER_STORAGE_KEY = 'infyn_focus_timer_state'

interface TimerState {
  mode: 'focus' | 'shortBreak' | 'longBreak' | 'deepWork'
  timeLeft: number
  isRunning: boolean
  targetEndTime: number | null
}

const TIMER_DURATIONS: Record<string, { label: string; duration: number }> = {
  focus: { label: '25m Focus', duration: 25 * 60 },
  shortBreak: { label: '5m Break', duration: 5 * 60 },
  longBreak: { label: '15m Break', duration: 15 * 60 },
  deepWork: { label: '45m Deep', duration: 45 * 60 },
}

export const ActionPopup: React.FC = () => {
  // Active Tab Info
  const [activeTab, setActiveTab] = useState<{ id?: number; title?: string; url?: string; domain?: string }>({
    title: 'Current Browser Tab',
    domain: 'active-page',
  })

  // Timer State
  const [timer, setTimer] = useState<TimerState>({
    mode: 'focus',
    timeLeft: 25 * 60,
    isRunning: false,
    targetEndTime: null,
  })

  // Screenshot State
  const [capturingMode, setCapturingMode] = useState<'visible' | 'fullpage' | null>(null)
  const [captureStatus, setCaptureStatus] = useState<string | null>(null)
  const [lastCaptured, setLastCaptured] = useState<ScreenshotItem | null>(null)
  const [copied, setCopied] = useState(false)

  // Load Active Tab Info on mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]: any[]) => {
        if (tab) {
          let domain = 'webpage'
          try {
            if (tab.url) domain = new URL(tab.url).hostname
          } catch {}
          setActiveTab({
            id: tab.id,
            title: tab.title || 'Current Webpage',
            url: tab.url,
            domain,
          })
        }
      })
    }
  }, [])

  // Sync Timer from chrome.storage.local
  useEffect(() => {
    const loadTimer = async () => {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        const res = await chrome.storage.local.get([TIMER_STORAGE_KEY])
        if (res[TIMER_STORAGE_KEY]) {
          const t = res[TIMER_STORAGE_KEY]
          let currentRemaining = t.timeLeft
          if (t.isRunning && t.targetEndTime) {
            currentRemaining = Math.max(0, Math.round((t.targetEndTime - Date.now()) / 1000))
          }
          setTimer({ ...t, timeLeft: currentRemaining })
        }
      }
    }

    loadTimer()

    // Real-time 1s tick for countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (!prev.isRunning || !prev.targetEndTime) return prev
        const remaining = Math.max(0, Math.round((prev.targetEndTime - Date.now()) / 1000))
        if (remaining <= 0) {
          return { ...prev, isRunning: false, timeLeft: 0, targetEndTime: null }
        }
        return { ...prev, timeLeft: remaining }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const saveTimerState = async (newTimer: TimerState) => {
    setTimer(newTimer)
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ [TIMER_STORAGE_KEY]: newTimer })
      // Update badge
      if (newTimer.isRunning && newTimer.timeLeft > 0) {
        const mins = Math.ceil(newTimer.timeLeft / 60)
        chrome.action?.setBadgeText({ text: `${mins}m` })
        chrome.action?.setBadgeBackgroundColor({ color: '#000000' })
      } else {
        chrome.action?.setBadgeText({ text: '' })
      }
    }
  }

  const toggleTimerPlay = () => {
    if (timer.isRunning) {
      // Pause
      saveTimerState({
        ...timer,
        isRunning: false,
        targetEndTime: null,
      })
    } else {
      // Play
      const duration = timer.timeLeft > 0 ? timer.timeLeft : (TIMER_DURATIONS[timer.mode]?.duration || 25 * 60)
      saveTimerState({
        ...timer,
        isRunning: true,
        timeLeft: duration,
        targetEndTime: Date.now() + duration * 1000,
      })
    }
  }

  const setTimerMode = (mode: TimerState['mode']) => {
    const duration = TIMER_DURATIONS[mode]?.duration || 25 * 60
    saveTimerState({
      mode,
      timeLeft: duration,
      isRunning: false,
      targetEndTime: null,
    })
  }

  const resetTimer = () => {
    const duration = TIMER_DURATIONS[timer.mode]?.duration || 25 * 60
    saveTimerState({
      ...timer,
      timeLeft: duration,
      isRunning: false,
      targetEndTime: null,
    })
  }

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Calculate percentage
  const totalModeSeconds = TIMER_DURATIONS[timer.mode]?.duration || 25 * 60
  const progressPercent = Math.min(100, Math.max(0, Math.round(((totalModeSeconds - timer.timeLeft) / totalModeSeconds) * 100)))

  // Screenshot Capture Handler
  const handleCapture = async (mode: 'visible' | 'fullpage') => {
    setCapturingMode(mode)
    setCaptureStatus(mode === 'visible' ? 'Capturing screen...' : 'Stitching full page...')

    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.captureVisibleTab) {
        // If on internal Chrome pages (e.g. chrome://extensions), script injection is forbidden by Chrome
        const isInternalPage = activeTab.url?.startsWith('chrome://') || activeTab.url?.startsWith('chrome-extension://')

        if (mode === 'visible' || isInternalPage) {
          const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' }).catch(() => null)
          if (!dataUrl) {
            setCaptureStatus('Cannot capture system page')
            return
          }
          const item = await saveScreenshot({
            title: activeTab.title || 'Screen Capture',
            url: activeTab.url || '',
            domain: activeTab.domain || 'webpage',
            mode: 'visible',
            dataUrl,
            width: window.innerWidth,
            height: window.innerHeight,
          })
          setLastCaptured(item)
          setCaptureStatus('Saved to Infyn!')
        } else {
          // Full page capture via background message
          let targetTabId = activeTab.id
          if (!targetTabId && chrome.tabs?.query) {
            const [t] = await chrome.tabs.query({ active: true, currentWindow: true }).catch(() => [])
            targetTabId = t?.id
          }

          if (chrome.runtime?.sendMessage && targetTabId) {
            chrome.runtime.sendMessage(
              { action: 'capture_fullpage', tabId: targetTabId },
              async (response: any) => {
                const err = chrome.runtime?.lastError
                if (err) {
                  console.warn('Capture message error handled:', err.message)
                  setCaptureStatus('Could not capture page')
                  return
                }
                if (response?.success && response.screenshot) {
                  setLastCaptured(response.screenshot)
                  setCaptureStatus('Full page captured!')
                } else {
                  // Fallback to visible
                  const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' }).catch(() => null)
                  if (dataUrl) {
                    const item = await saveScreenshot({
                      title: activeTab.title || 'Page Fallback',
                      url: activeTab.url || '',
                      domain: activeTab.domain || 'webpage',
                      mode: 'visible',
                      dataUrl,
                      width: window.innerWidth,
                      height: window.innerHeight,
                    })
                    setLastCaptured(item)
                    setCaptureStatus('Saved!')
                  } else {
                    setCaptureStatus('Capture failed')
                  }
                }
              }
            )
          } else {
            // Visible fallback if no tabId
            const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' }).catch(() => null)
            if (dataUrl) {
              const item = await saveScreenshot({
                title: activeTab.title || 'Screen Capture',
                url: activeTab.url || '',
                domain: activeTab.domain || 'webpage',
                mode: 'visible',
                dataUrl,
                width: window.innerWidth,
                height: window.innerHeight,
              })
              setLastCaptured(item)
              setCaptureStatus('Saved!')
            }
          }
        }
      } else {
        // Dev fallback
        const canvas = document.createElement('canvas')
        canvas.width = 1280
        canvas.height = mode === 'visible' ? 720 : 1600
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = '#0f172a'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 32px sans-serif'
          ctx.fillText(`Infyn ${mode === 'visible' ? 'Visible' : 'Full Page'} Capture`, 60, 100)
        }
        const dataUrl = canvas.toDataURL('image/png')
        const item = await saveScreenshot({
          title: `Sample ${mode === 'visible' ? 'Visible' : 'Full-Page'} Capture`,
          url: 'https://infyn.software',
          domain: 'infyn.software',
          mode,
          dataUrl,
          width: canvas.width,
          height: canvas.height,
        })
        setLastCaptured(item)
        setCaptureStatus('Saved!')
      }
    } catch (err) {
      console.warn('Capture failed:', err)
      setCaptureStatus('Capture failed')
    } finally {
      setTimeout(() => {
        setCapturingMode(null)
      }, 1800)
    }
  }

  const handleCopyLast = async () => {
    if (!lastCaptured) return
    try {
      const res = await fetch(lastCaptured.dataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type || 'image/png']: blob,
        }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Clipboard copy failed:', err)
    }
  }

  const handleDownloadLast = () => {
    if (!lastCaptured) return
    const link = document.createElement('a')
    link.href = lastCaptured.dataUrl
    link.download = `screenshot_${lastCaptured.domain}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openNewTabDashboard = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html') })
    } else {
      window.open('/', '_blank')
    }
  }

  return (
    <div
      style={{ width: '360px', minWidth: '360px', maxWidth: '360px', boxSizing: 'border-box' }}
      className="w-[360px] min-w-[360px] max-w-[360px] bg-neutral-950 text-white font-sans p-4 space-y-4 border border-white/10 shadow-2xl selection:bg-white selection:text-black"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-400 flex items-center justify-center font-black text-xs text-white shadow-xs">
            ∞
          </div>
          <div>
            <span className="text-xs font-bold tracking-tight block">Infyn Quick Action</span>
            <span className="text-[10px] text-white/50 block truncate max-w-[170px]">
              {activeTab.domain}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={openNewTabDashboard}
          className="px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] font-semibold text-white/80 hover:text-white flex items-center gap-1 transition-colors"
          title="Open Infyn Home Tab"
        >
          <span>Dashboard</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </button>
      </div>

      {/* SECTION 1: TWO-MODE SCREENSHOT CAPTURE */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
            <Camera className="h-3.5 w-3.5 text-violet-400" />
            <span>Take Screenshot</span>
          </div>
          {captureStatus && (
            <span className="text-[10px] text-violet-300 font-medium animate-pulse">
              {captureStatus}
            </span>
          )}
        </div>

        {/* 2 Capture Mode Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {/* Mode 1: Visible View */}
          <button
            type="button"
            onClick={() => handleCapture('visible')}
            disabled={capturingMode !== null}
            className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-left transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-xl bg-white/10 group-hover:scale-105 transition-transform text-white">
                <Monitor className="h-4 w-4" />
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/60">
                1-Click
              </span>
            </div>
            <span className="text-xs font-bold block text-white group-hover:translate-x-0.5 transition-transform">
              Visible Screen
            </span>
            <span className="text-[10px] text-white/50 block truncate">Current view only</span>
          </button>

          {/* Mode 2: Full Page */}
          <button
            type="button"
            onClick={() => handleCapture('fullpage')}
            disabled={capturingMode !== null}
            className="p-2.5 rounded-2xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 hover:border-violet-500/50 text-left transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-xl bg-violet-500/20 group-hover:scale-105 transition-transform text-violet-300">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300">
                Scroll
              </span>
            </div>
            <span className="text-xs font-bold block text-white group-hover:translate-x-0.5 transition-transform">
              Full Page
            </span>
            <span className="text-[10px] text-white/50 block truncate">Auto-scroll & stitch</span>
          </button>
        </div>

        {/* Last Captured Quick Actions */}
        {lastCaptured && (
          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={lastCaptured.dataUrl}
                alt="Captured"
                className="w-8 h-8 rounded-lg object-cover border border-white/15 shrink-0"
              />
              <span className="text-[11px] text-white/80 font-medium truncate">
                Saved to Screenshots!
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopyLast}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>
              <button
                type="button"
                onClick={handleDownloadLast}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Download PNG"
              >
                <Download className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: VISIBLE SELECTABLE FOCUS TIMER */}
      <div className="pt-2.5 border-t border-white/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
            <Timer className="h-3.5 w-3.5 text-amber-400" />
            <span>Focus Timer</span>
          </div>
          <span className="text-[10px] font-mono text-white/50">
            {timer.isRunning ? 'Active' : 'Idle'}
          </span>
        </div>

        {/* Visible Selectable Duration Buttons */}
        <div className="grid grid-cols-4 gap-1 bg-black/40 p-1 rounded-2xl border border-white/10">
          {(
            [
              { id: 'focus', label: '25m' },
              { id: 'shortBreak', label: '5m' },
              { id: 'longBreak', label: '15m' },
              { id: 'deepWork', label: '45m' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setTimerMode(m.id)}
              className={`py-1 rounded-xl text-[11px] font-bold transition-all ${
                timer.mode === m.id
                  ? 'bg-white text-black shadow-xs font-black'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Large Visible Countdown & Controls Card */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-2xl font-mono font-black tracking-tight block">
              {formatTime(timer.timeLeft)}
            </span>
            <div className="w-24 bg-white/10 h-1 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTimerPlay}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                timer.isRunning
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30'
                  : 'bg-white text-black hover:bg-neutral-200 shadow-sm'
              }`}
            >
              {timer.isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-black" />}
              <span>{timer.isRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              type="button"
              onClick={resetTimer}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors border border-white/10"
              title="Reset Timer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
