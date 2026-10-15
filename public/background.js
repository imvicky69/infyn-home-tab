// Chrome Extension Background Service Worker for Infyn Home Tab
const TIMER_STORAGE_KEY = 'infyn_focus_timer_state'

// Listen to timer changes in storage to update extension badge
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes[TIMER_STORAGE_KEY]) {
    const timer = changes[TIMER_STORAGE_KEY].newValue
    if (timer && timer.isRunning && timer.targetEndTime) {
      const remaining = Math.max(0, Math.round((timer.targetEndTime - Date.now()) / 1000))
      if (remaining > 0) {
        const mins = Math.ceil(remaining / 60)
        chrome.action.setBadgeText({ text: `${mins}m` })
        chrome.action.setBadgeBackgroundColor({ color: '#000000' })
      } else {
        chrome.action.setBadgeText({ text: '' })
      }
    } else {
      chrome.action.setBadgeText({ text: '' })
    }
  }
})

// Periodic 1-minute alarm to update extension badge countdown when tabs might be closed
try {
  chrome.alarms.create('infyn_badge_tick', { periodInMinutes: 1 })
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'infyn_badge_tick') {
      const res = await chrome.storage.local.get([TIMER_STORAGE_KEY])
      const timer = res[TIMER_STORAGE_KEY]
      if (timer && timer.isRunning && timer.targetEndTime) {
        const remaining = Math.max(0, Math.round((timer.targetEndTime - Date.now()) / 1000))
        if (remaining > 0) {
          const mins = Math.ceil(remaining / 60)
          chrome.action.setBadgeText({ text: `${mins}m` })
        } else {
          chrome.action.setBadgeText({ text: '' })
          await chrome.storage.local.set({
            [TIMER_STORAGE_KEY]: {
              ...timer,
              isRunning: false,
              timeLeft: 0,
              targetEndTime: null,
            },
          })
        }
      } else {
        chrome.action.setBadgeText({ text: '' })
      }
    }
  })
} catch {
  // Alarms API fallback
}

// ----------------------------------------------------
// IndexedDB Helper for Screenshots in Background Worker
// ----------------------------------------------------
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('infyn_db', 1)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('screenshots')) {
        const store = db.createObjectStore('screenshots', { keyPath: 'id' })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function saveScreenshotToDB(item) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('screenshots', 'readwrite')
    const store = tx.objectStore('screenshots')
    const req = store.put(item)
    req.onsuccess = () => resolve(item)
    req.onerror = () => reject(req.error)
  })
}

// Buffer to base64 Data URL in Service Worker
function bufferToDataUrl(buffer, mimeType = 'image/png') {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return `data:${mimeType};base64,${btoa(binary)}`
}

// ----------------------------------------------------
// Full-Page Scroll & Stitch Pipeline
// ----------------------------------------------------
async function captureFullPage(tabId) {
  // Check if tab is an internal Chrome page where scripting is restricted
  let tab
  try {
    tab = await chrome.tabs.get(tabId)
  } catch {}

  const isInternal = tab?.url?.startsWith('chrome://') || tab?.url?.startsWith('chrome-extension://') || !tab?.url

  if (isInternal) {
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' }).catch(() => null)
    if (!dataUrl) throw new Error('Cannot capture system page')
    const item = {
      id: `ss_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      title: tab?.title || 'Screen Capture',
      url: tab?.url || '',
      domain: 'browser',
      mode: 'visible',
      dataUrl,
      width: 1280,
      height: 720,
      timestamp: Date.now(),
    }
    await saveScreenshotToDB(item)
    await chrome.storage.local.set({ infyn_last_screenshot_id: item.id })
    return item
  }

  // 1. Get dimensions from active tab
  const [dimResult] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      )
      return {
        scrollHeight,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        dpr: window.devicePixelRatio || 1,
        originalScrollY: window.scrollY,
        title: document.title,
        url: window.location.href,
        domain: window.location.hostname,
      }
    },
  })

  const { scrollHeight, viewportHeight, viewportWidth, dpr, originalScrollY, title, url, domain } = dimResult.result

  // If page fits in one viewport, capture single visible screen
  if (scrollHeight <= viewportHeight) {
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' })
    const item = {
      id: `ss_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      title: title || 'Full Page Capture',
      url: url || '',
      domain: domain || 'webpage',
      mode: 'fullpage',
      dataUrl,
      width: Math.round(viewportWidth * dpr),
      height: Math.round(scrollHeight * dpr),
      timestamp: Date.now(),
    }
    await saveScreenshotToDB(item)
    await chrome.storage.local.set({ infyn_last_screenshot_id: item.id })
    return item
  }

  // 2. Loop through slices
  const slices = []
  let y = 0
  const maxCaptures = 25 // Safety cap for infinitely scrolling pages

  for (let i = 0; i < maxCaptures && y < scrollHeight; i++) {
    // Scroll to position
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (top) => window.scrollTo(0, top),
      args: [y],
    })

    // Wait for paint
    await new Promise((r) => setTimeout(r, 120))

    // Capture visible slice
    const sliceDataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' })
    slices.push({ y, dataUrl: sliceDataUrl })

    if (y + viewportHeight >= scrollHeight) {
      break
    }
    y += viewportHeight
  }

  // Restore original scroll
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (top) => window.scrollTo(0, top),
      args: [originalScrollY],
    })
  } catch {}

  // 3. Stitch using OffscreenCanvas
  const canvasWidth = Math.round(viewportWidth * dpr)
  const canvasHeight = Math.round(scrollHeight * dpr)
  const offscreen = new OffscreenCanvas(canvasWidth, canvasHeight)
  const ctx = offscreen.getContext('2d')

  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i]
    const resp = await fetch(slice.dataUrl)
    const blob = await resp.blob()
    const bitmap = await createImageBitmap(blob)

    const drawY = Math.round(slice.y * dpr)

    // For the last slice, prevent overlap duplication
    if (i === slices.length - 1 && slices.length > 1) {
      const remainingHeight = canvasHeight - drawY
      const cropY = Math.max(0, bitmap.height - remainingHeight)
      ctx.drawImage(
        bitmap,
        0,
        cropY,
        bitmap.width,
        remainingHeight,
        0,
        drawY,
        canvasWidth,
        remainingHeight
      )
    } else {
      ctx.drawImage(bitmap, 0, drawY)
    }
  }

  const finalBlob = await offscreen.convertToBlob({ type: 'image/png' })
  const arrayBuffer = await finalBlob.arrayBuffer()
  const finalDataUrl = bufferToDataUrl(arrayBuffer, 'image/png')

  const item = {
    id: `ss_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    title: title || 'Full Page Capture',
    url: url || '',
    domain: domain || 'webpage',
    mode: 'fullpage',
    dataUrl: finalDataUrl,
    width: canvasWidth,
    height: canvasHeight,
    timestamp: Date.now(),
  }

  await saveScreenshotToDB(item)
  await chrome.storage.local.set({ infyn_last_screenshot_id: item.id })
  return item
}

// ----------------------------------------------------
// Message Listener for Action Popup & Extension
// ----------------------------------------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.action === 'capture_fullpage') {
    captureFullPage(message.tabId)
      .then((screenshot) => {
        sendResponse({ success: true, screenshot })
      })
      .catch((err) => {
        console.error('Full page capture error:', err)
        sendResponse({ success: false, error: err ? err.message : 'Unknown error' })
      })
    return true // Keep channel open for async response
  }

  // Gracefully acknowledge any other messages so lastError is never raised
  sendResponse({ acknowledged: true })
  return false
})
