import React, { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import type { UserSettings } from '../types'

interface ClockWidgetProps {
  settings: UserSettings
  onUpdateSettings?: (settings: UserSettings) => void
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({
  settings,
}) => {
  const [now, setNow] = useState(new Date())

  const is24h = settings.timeFormat === '24h'
  const showSeconds = settings.showSeconds ?? false
  const showDate = settings.showDate ?? false
  const showGreeting = settings.showGreeting ?? false
  const timezone = settings.timezone || 'auto'

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Format time based on timezone & 12h/24h
  const getFormattedParts = () => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        hour: is24h ? '2-digit' : 'numeric',
        minute: '2-digit',
        hour12: !is24h,
      }
      if (showSeconds) {
        options.second = '2-digit'
      }
      if (timezone !== 'auto') {
        options.timeZone = timezone
      }

      const timeString = new Intl.DateTimeFormat('en-US', options).format(now)
      let timeMain = timeString
      let ampm = ''

      if (!is24h) {
        const match = timeString.match(/(.*?)\s*(AM|PM)/i)
        if (match) {
          timeMain = match[1]
          ampm = match[2].toUpperCase()
        }
      }

      // Date formatting
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }
      if (timezone !== 'auto') {
        dateOptions.timeZone = timezone
      }
      const dateString = new Intl.DateTimeFormat('en-US', dateOptions).format(now)

      return { timeMain, ampm, dateString }
    } catch {
      return {
        timeMain: now.toLocaleTimeString(),
        ampm: '',
        dateString: now.toLocaleDateString(),
      }
    }
  }

  const { timeMain, ampm, dateString } = getFormattedParts()

  // Dynamic greeting based on current hour in selected timezone
  const getGreeting = () => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        hour12: false,
      }
      if (timezone !== 'auto') {
        options.timeZone = timezone
      }
      const hour = parseInt(new Intl.DateTimeFormat('en-US', options).format(now), 10)
      if (hour >= 5 && hour < 12) return 'Good morning'
      if (hour >= 12 && hour < 17) return 'Good afternoon'
      if (hour >= 17 && hour < 22) return 'Good evening'
      return 'Good night'
    } catch {
      return 'Welcome'
    }
  }

  const hasSubLine = showDate || (showGreeting && settings.userName)

  return (
    <div className="flex flex-col items-center justify-center text-center select-none py-1 group/clock relative text-white">
      {/* Big Digital Clock Time (Monochrome Black & White) */}
      <div className="flex items-baseline justify-center gap-2.5">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-mono font-black tracking-tight text-white drop-shadow-xl text-shadow">
          {timeMain}
        </h1>

        {ampm && (
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white/90 bg-white/10 border border-white/20 px-2 py-0.5 rounded-lg shadow-xs self-center">
            {ampm}
          </span>
        )}
      </div>

      {/* Date & Greeting Line (Optional - only rendered if enabled) */}
      {hasSubLine && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1 text-xs sm:text-sm text-white/80 drop-shadow-md font-medium">
          {showDate && <span>{dateString}</span>}

          {showDate && showGreeting && settings.userName && (
            <span className="text-white/30">•</span>
          )}

          {showGreeting && settings.userName && (
            <span className="text-white/90 flex items-center gap-1 font-semibold">
              <Sparkles className="h-3 w-3 text-white/70" />
              {getGreeting()}, {settings.userName}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
