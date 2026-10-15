import React, { useState, useEffect } from 'react'
import {
  Camera,
  Copy,
  Check,
  Trash2,
  Download,
  Maximize2,
  ChevronDown,
  ChevronUp,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  Monitor,
  Plus,
} from 'lucide-react'
import {
  getAllScreenshots,
  deleteScreenshot,
  saveScreenshot,
  type ScreenshotItem,
} from '../utils/screenshotStorage'

declare const chrome: any
import type { WidgetSize } from '../types'

interface ScreenshotsWidgetProps {
  size?: WidgetSize
}

export const ScreenshotsWidget: React.FC<ScreenshotsWidgetProps> = ({ size = 'normal' }) => {
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedScreenshot, setSelectedScreenshot] = useState<ScreenshotItem | null>(null)
  const [zoomScale, setZoomScale] = useState(1)
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureStatus, setCaptureStatus] = useState<string | null>(null)
  const [isCaptureMenuOpen, setIsCaptureMenuOpen] = useState(false)
  const captureMenuRef = React.useRef<HTMLDivElement>(null)

  // Close capture dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (captureMenuRef.current && !captureMenuRef.current.contains(e.target as Node)) {
        setIsCaptureMenuOpen(false)
      }
    }
    if (isCaptureMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCaptureMenuOpen])

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('infyn_screenshots_widget_collapsed') === 'true'
    } catch {
      return false
    }
  })

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('infyn_screenshots_widget_collapsed', String(next))
      } catch {}
      return next
    })
  }

  const loadScreenshots = async () => {
    try {
      const items = await getAllScreenshots()
      setScreenshots(items)
    } catch (err) {
      console.error('Failed to load screenshots:', err)
    }
  }

  useEffect(() => {
    loadScreenshots()

    const handleUpdate = () => {
      loadScreenshots()
    }

    window.addEventListener('infyn_screenshots_updated', handleUpdate)

    if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
      const handleStorageChange = (changes: any) => {
        if (changes.infyn_last_screenshot_id || changes.infyn_last_screenshot_deleted) {
          loadScreenshots()
        }
      }
      chrome.storage.onChanged.addListener(handleStorageChange)
      return () => {
        window.removeEventListener('infyn_screenshots_updated', handleUpdate)
        chrome.storage.onChanged.removeListener(handleStorageChange)
      }
    }

    return () => {
      window.removeEventListener('infyn_screenshots_updated', handleUpdate)
    }
  }, [])

  // Helper to copy image to clipboard
  const handleCopy = async (item: ScreenshotItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    try {
      // Convert base64 dataUrl to blob
      const res = await fetch(item.dataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type || 'image/png']: blob,
        }),
      ])
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.warn('Direct image clipboard copy failed, falling back to dataUrl text:', err)
      try {
        await navigator.clipboard.writeText(item.dataUrl)
        setCopiedId(item.id)
        setTimeout(() => setCopiedId(null), 2000)
      } catch (e2) {
        console.error('Clipboard copy failed:', e2)
      }
    }
  }

  // Helper to download PNG
  const handleDownload = (item: ScreenshotItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const link = document.createElement('a')
    link.href = item.dataUrl
    const cleanDomain = (item.domain || 'page').replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const dateStr = new Date(item.timestamp).toISOString().slice(0, 10)
    link.download = `screenshot_${cleanDomain}_${dateStr}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Helper to delete screenshot
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    await deleteScreenshot(id)
    setScreenshots((prev) => prev.filter((s) => s.id !== id))
    if (selectedScreenshot?.id === id) {
      setSelectedScreenshot(null)
    }
  }

  // Trigger capture directly from the widget
  const handleCapture = async (mode: 'visible' | 'fullpage') => {
    setIsCapturing(true)
    setCaptureStatus(mode === 'visible' ? 'Capturing screen...' : 'Stitching full page...')

    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.captureVisibleTab) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (!tab || !tab.id) {
          throw new Error('No active browser tab found')
        }

        // If on internal Chrome pages (e.g. chrome://newtab), script injection is forbidden by Chrome
        const isInternalPage = tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://')

        if (mode === 'visible' || isInternalPage) {
          const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' }).catch(() => null)
          if (!dataUrl) {
            setCaptureStatus('Cannot capture system page')
            return
          }
          const domain = tab.url ? new URL(tab.url).hostname : 'local'
          await saveScreenshot({
            title: tab.title || 'Screen Capture',
            url: tab.url || '',
            domain,
            mode: 'visible',
            dataUrl,
            width: window.innerWidth,
            height: window.innerHeight,
          })
          setCaptureStatus('Saved!')
        } else {
          // Send message to background service worker to coordinate full page scroll & stitch
          if (chrome.runtime?.sendMessage) {
            chrome.runtime.sendMessage({ action: 'capture_fullpage', tabId: tab.id }, async (response: any) => {
              const err = chrome.runtime?.lastError
              if (err) {
                console.warn('Screenshot message error handled:', err.message)
                setCaptureStatus('Could not capture this tab')
                return
              }
              if (response?.success && response.screenshot) {
                setCaptureStatus('Saved!')
              } else {
                // Fallback to visible if fullpage fails
                const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' }).catch(() => null)
                if (dataUrl) {
                  const domain = tab.url ? new URL(tab.url).hostname : 'local'
                  await saveScreenshot({
                    title: tab.title || 'Full Page Fallback',
                    url: tab.url || '',
                    domain,
                    mode: 'visible',
                    dataUrl,
                    width: window.innerWidth,
                    height: window.innerHeight,
                  })
                }
              }
              await loadScreenshots()
            })
          }
        }
      } else {
        // Fallback for dev server / non-extension preview: generate a sample capture preview
        const canvas = document.createElement('canvas')
        canvas.width = 1280
        canvas.height = mode === 'visible' ? 720 : 1800
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          grad.addColorStop(0, '#0f172a')
          grad.addColorStop(0.5, '#1e1b4b')
          grad.addColorStop(1, '#020617')
          ctx.fillStyle = grad
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 36px sans-serif'
          ctx.fillText(`Infyn Sample ${mode === 'visible' ? 'Visible' : 'Full Page'} Capture`, 60, 100)

          ctx.fillStyle = 'rgba(255,255,255,0.6)'
          ctx.font = '20px sans-serif'
          ctx.fillText(`Captured on ${new Date().toLocaleTimeString()} • ${mode === 'visible' ? '1280 × 720' : '1280 × 1800'} px`, 60, 150)

          // Decorative grid pattern
          ctx.strokeStyle = 'rgba(255,255,255,0.1)'
          ctx.lineWidth = 1
          for (let x = 40; x < canvas.width; x += 60) {
            ctx.beginPath()
            ctx.moveTo(x, 180)
            ctx.lineTo(x, canvas.height - 40)
            ctx.stroke()
          }
        }

        const dataUrl = canvas.toDataURL('image/png')
        await saveScreenshot({
          title: `Demo ${mode === 'visible' ? 'Visible' : 'Full-Page'} Capture`,
          url: 'https://infyn.software',
          domain: 'infyn.software',
          mode,
          dataUrl,
          width: canvas.width,
          height: canvas.height,
        })
        setCaptureStatus('Saved sample!')
      }

      await loadScreenshots()
    } catch (err) {
      console.warn('Capture error:', err)
      setCaptureStatus('Capture failed')
    } finally {
      setTimeout(() => {
        setIsCapturing(false)
        setCaptureStatus(null)
      }, 1500)
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  // Dynamic max-height to ensure it remains compact and responsive
  const listHeightClass =
    size === 'compact'
      ? 'max-h-[140px]'
      : size === 'wide'
      ? 'max-h-[260px]'
      : 'max-h-[190px] sm:max-h-[210px]'

  return (
    <>
      <div className="flex flex-col bg-black/35 hover:bg-black/45 border border-white/10 hover:border-white/20 rounded-3xl p-3.5 sm:p-4 backdrop-blur-xl shadow-xl transition-all duration-300 text-white w-full">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            {/* Medium-sized icon for screenshots */}
            <div className="p-1.5 rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 shrink-0">
              <Camera className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight shrink-0">
                Screenshots
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 shrink-0">
                {screenshots.length}
              </span>

              {isCollapsed && screenshots.length > 0 && (
                <span className="text-[11px] text-white/50 truncate ml-1 pl-2 border-l border-white/15">
                  Latest: {screenshots[0].domain}
                </span>
              )}
            </div>
          </div>

          {/* Right: Quick Capture Menu & Collapse Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!isCollapsed && (
              <div className="relative" ref={captureMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsCaptureMenuOpen((prev) => !prev)}
                  disabled={isCapturing}
                  className={`p-1.5 rounded-xl border transition-all ${
                    isCaptureMenuOpen
                      ? 'bg-violet-600 text-white border-violet-500 shadow-sm'
                      : 'bg-white/5 hover:bg-white/15 border-white/10 text-white/70 hover:text-white'
                  } disabled:opacity-50`}
                  title="Take screenshot"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>

                {/* Dropdown Popover */}
                {isCaptureMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-neutral-900/95 border border-white/15 rounded-2xl p-1.5 shadow-2xl z-30 flex flex-col gap-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCaptureMenuOpen(false)
                        handleCapture('visible')
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-xs text-white text-left transition-colors"
                    >
                      <Monitor className="h-3.5 w-3.5 text-violet-300" />
                      <span>Visible View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCaptureMenuOpen(false)
                        handleCapture('fullpage')
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-xs text-white text-left transition-colors"
                    >
                      <Layers className="h-3.5 w-3.5 text-violet-300" />
                      <span>Full Page</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all shrink-0"
              title={isCollapsed ? 'Expand screenshots' : 'Collapse screenshots'}
            >
              {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Capturing Status Toast */}
        {captureStatus && (
          <div className="mt-2 text-[11px] font-medium text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-xl flex items-center gap-1.5 animate-pulse">
            <Sparkles className="h-3 w-3 text-violet-400" />
            <span>{captureStatus}</span>
          </div>
        )}

        {/* Expanded Content: Screenshots Grid / List */}
        {!isCollapsed && (
          <div className="mt-3 space-y-2 animate-in fade-in duration-200">
            {screenshots.length === 0 ? (
              <div className="py-7 text-center text-xs text-white/40 flex flex-col items-center gap-2 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <Camera className="h-6 w-6 text-white/20" />
                <p>No local screenshots captured yet.</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => handleCapture('visible')}
                    className="px-3 py-1 rounded-xl bg-white text-black font-semibold text-xs shadow-xs hover:bg-neutral-200 transition-all"
                  >
                    Take Visible SS
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCapture('fullpage')}
                    className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all"
                  >
                    Full Page SS
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`overflow-y-auto space-y-2 pr-1.5 ${listHeightClass}`}
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255,255,255,0.2) transparent',
                }}
              >
                {screenshots.map((item) => {
                  const isCopied = copiedId === item.id

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedScreenshot(item)
                        setZoomScale(1)
                      }}
                      className="group flex items-center justify-between p-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 transition-all gap-2.5 cursor-pointer shadow-xs"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-12 h-10 rounded-xl bg-black/60 border border-white/15 overflow-hidden shrink-0 relative">
                          <img
                            src={item.dataUrl}
                            alt={item.title}
                            className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Maximize2 className="h-3 w-3 text-white drop-shadow" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-white truncate max-w-[150px] sm:max-w-[180px]">
                            {item.title}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-white/50 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-[9px] shrink-0">
                              {item.mode === 'fullpage' ? 'Full' : 'Visible'}
                            </span>
                            <span className="truncate max-w-[80px]">{item.domain}</span>
                            <span>•</span>
                            <span className="shrink-0">{formatTimeAgo(item.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Actions: Copy, Download, Delete */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={(e) => handleCopy(item, e)}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all"
                          title="Copy screenshot to clipboard"
                        >
                          {isCopied ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>

                        {/* Download Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDownload(item, e)}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all"
                          title="Download PNG"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 rounded-xl text-white/40 hover:text-rose-400 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete screenshot"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Fullscreen Preview Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col p-4 sm:p-6 animate-in fade-in">
          {/* Lightbox Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/15 text-white shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Camera className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold truncate">{selectedScreenshot.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-white/50">
                  <span className="truncate">{selectedScreenshot.url || selectedScreenshot.domain}</span>
                  <span>•</span>
                  <span>
                    {selectedScreenshot.width} × {selectedScreenshot.height} px
                  </span>
                  <span>•</span>
                  <span className="capitalize">{selectedScreenshot.mode} Mode</span>
                </div>
              </div>
            </div>

            {/* Lightbox Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-white/10 border border-white/15 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setZoomScale((z) => Math.max(0.25, z - 0.25))}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="text-[10px] font-mono px-1 min-w-[32px] text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomScale((z) => Math.min(3, z + 0.25))}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                  title="Reset Zoom (100%)"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>

              {/* Copy */}
              <button
                type="button"
                onClick={() => handleCopy(selectedScreenshot)}
                className="px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white flex items-center gap-1.5 transition-colors"
              >
                {copiedId === selectedScreenshot.id ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedId === selectedScreenshot.id ? 'Copied' : 'Copy'}</span>
              </button>

              {/* Download */}
              <button
                type="button"
                onClick={() => handleDownload(selectedScreenshot)}
                className="px-3 py-1.5 rounded-2xl bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDelete(selectedScreenshot.id)}
                className="p-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-colors"
                title="Delete screenshot"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setSelectedScreenshot(null)}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Lightbox Image Viewport */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 min-h-0 relative">
            <div
              className="transition-transform duration-150 origin-center max-w-full max-h-full"
              style={{ transform: `scale(${zoomScale})` }}
            >
              <img
                src={selectedScreenshot.dataUrl}
                alt={selectedScreenshot.title}
                className="rounded-2xl border border-white/20 shadow-2xl max-h-[82vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
