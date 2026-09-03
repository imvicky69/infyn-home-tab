import React, { useState, useEffect } from 'react'
import { Sun, Moon, Sunrise, Sunset, Sparkles } from 'lucide-react'
import type { UserSettings } from '../types'

interface ClockGreetingProps {
  settings: UserSettings
}

export const ClockGreeting: React.FC<ClockGreetingProps> = ({ settings }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours()
  let greeting = 'Hello'
  let GreetingIcon = Sun

  if (hours >= 5 && hours < 12) {
    greeting = 'Good Morning'
    GreetingIcon = Sunrise
  } else if (hours >= 12 && hours < 17) {
    greeting = 'Good Afternoon'
    GreetingIcon = Sun
  } else if (hours >= 17 && hours < 21) {
    greeting = 'Good Evening'
    GreetingIcon = Sunset
  } else {
    greeting = 'Good Night'
    GreetingIcon = Moon
  }

  const formatTime = () => {
    let h = time.getHours()
    const m = time.getMinutes().toString().padStart(2, '0')
    const s = time.getSeconds().toString().padStart(2, '0')
    let period = ''

    if (settings.timeFormat === '12h') {
      period = h >= 12 ? 'PM' : 'AM'
      h = h % 12 || 12
    }

    const hourStr = h.toString().padStart(settings.timeFormat === '24h' ? 2 : 1, '0')
    return {
      main: `${hourStr}:${m}`,
      seconds: settings.showSeconds ? `:${s}` : '',
      period: settings.timeFormat === '12h' ? period : '',
    }
  }

  const formatDate = () => {
    return time.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }

  const timeFormatted = formatTime()

  return (
    <div className="flex flex-col items-center justify-center text-center select-none py-1">
      {settings.showGreeting && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/60 border border-black/5 dark:border-white/10 backdrop-blur-xl text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 shadow-xs transition-all hover:scale-105">
          <GreetingIcon className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
          <span>
            {greeting}, <strong className="text-slate-900 dark:text-white font-bold">{settings.userName}</strong>
          </span>
          <Sparkles className="h-3 w-3 text-indigo-500 dark:text-indigo-400 opacity-80" />
        </div>
      )}

      {/* Main Clock */}
      <div className="flex items-baseline justify-center tracking-tight font-extrabold">
        <span className="text-7xl sm:text-8xl md:text-9xl font-mono tracking-tighter text-slate-900 dark:text-white drop-shadow-sm">
          {timeFormatted.main}
        </span>
        {timeFormatted.seconds && (
          <span className="text-2xl sm:text-3xl md:text-4xl text-slate-400 dark:text-slate-500 font-mono font-medium ml-1">
            {timeFormatted.seconds}
          </span>
        )}
        {timeFormatted.period && (
          <span className="text-base sm:text-lg md:text-xl text-indigo-600 dark:text-indigo-400 font-bold tracking-wider ml-3 uppercase">
            {timeFormatted.period}
          </span>
        )}
      </div>

      {/* Date */}
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-1">
        {formatDate()}
      </p>
    </div>
  )
}
