// Chrome Extension Background Service Worker for Infyn Home Tab
const TIMER_STORAGE_KEY = 'infyn_focus_timer_state'

// When user clicks the pinned extension icon in the Chrome toolbar
chrome.action.onClicked.addListener(async () => {
  try {
    const res = await chrome.storage.local.get([TIMER_STORAGE_KEY])
    let timer = res[TIMER_STORAGE_KEY]

    if (!timer) {
      timer = {
        mode: 'focus',
        timeLeft: 25 * 60,
        isRunning: false,
        targetEndTime: null,
      }
    }

    if (timer.isRunning) {
      // Pause
      const remaining = timer.targetEndTime
        ? Math.max(0, Math.round((timer.targetEndTime - Date.now()) / 1000))
        : timer.timeLeft
      timer.isRunning = false
      timer.timeLeft = remaining
      timer.targetEndTime = null
      chrome.action.setBadgeText({ text: '' })
    } else {
      // Quick Start Focus Timer (25 minutes or resume)
      const duration = timer.timeLeft > 0 ? timer.timeLeft : 25 * 60
      timer.isRunning = true
      timer.timeLeft = duration
      timer.targetEndTime = Date.now() + duration * 1000

      const mins = Math.ceil(duration / 60)
      chrome.action.setBadgeText({ text: `${mins}m` })
      chrome.action.setBadgeBackgroundColor({ color: '#000000' })
    }

    await chrome.storage.local.set({ [TIMER_STORAGE_KEY]: timer })
  } catch (err) {
    console.error('Failed to toggle focus timer from action icon:', err)
  }
})

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
