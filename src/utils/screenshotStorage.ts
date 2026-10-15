// IndexedDB Screenshot Storage for Infyn Home Tab
export interface ScreenshotItem {
  id: string
  title: string
  url: string
  domain: string
  timestamp: number
  mode: 'visible' | 'fullpage'
  dataUrl: string
  width: number
  height: number
}

declare const chrome: any

const DB_NAME = 'infyn_db'
const DB_VERSION = 1
const STORE_NAME = 'screenshots'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'))
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// In-memory fallback if IndexedDB is temporarily unavailable
let memoryScreenshots: ScreenshotItem[] = []

export async function saveScreenshot(
  item: Omit<ScreenshotItem, 'id' | 'timestamp'>
): Promise<ScreenshotItem> {
  const newItem: ScreenshotItem = {
    ...item,
    id: `ss_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    timestamp: Date.now(),
  }

  try {
    const db = await openDB()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.put(newItem)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.warn('Failed to save to IndexedDB, using memory fallback:', err)
    memoryScreenshots = [newItem, ...memoryScreenshots]
  }

  // Notify active windows/tabs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('infyn_screenshots_updated', { detail: newItem }))
  }

  // Cross-context notification via chrome.storage if in extension
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    try {
      await chrome.storage.local.set({ infyn_last_screenshot_id: newItem.id })
    } catch {}
  }

  return newItem
}

export async function getAllScreenshots(): Promise<ScreenshotItem[]> {
  try {
    const db = await openDB()
    const items = await new Promise<ScreenshotItem[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => reject(req.error)
    })

    // Sort newest first
    return items.sort((a, b) => b.timestamp - a.timestamp)
  } catch (err) {
    console.warn('Failed to read from IndexedDB, using memory fallback:', err)
    return memoryScreenshots.sort((a, b) => b.timestamp - a.timestamp)
  }
}

export async function deleteScreenshot(id: string): Promise<void> {
  try {
    const db = await openDB()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.delete(id)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.warn('Failed to delete from IndexedDB:', err)
    memoryScreenshots = memoryScreenshots.filter((s) => s.id !== id)
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('infyn_screenshots_updated', { detail: { deletedId: id } }))
  }

  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    try {
      await chrome.storage.local.set({ infyn_last_screenshot_deleted: id })
    } catch {}
  }
}

export async function clearAllScreenshots(): Promise<void> {
  try {
    const db = await openDB()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.clear()
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.warn('Failed to clear IndexedDB:', err)
    memoryScreenshots = []
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('infyn_screenshots_updated'))
  }
}
