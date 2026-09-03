import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Timer, Flame } from 'lucide-react'

export const FocusTimerWidget: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'deepWork'>('focus')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)

  const modeDurations = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    deepWork: 45 * 60,
  }

  useEffect(() => {
    let interval: any = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleModeChange = (newMode: 'focus' | 'shortBreak' | 'deepWork') => {
    setMode(newMode)
    setTimeLeft(modeDurations[newMode])
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(modeDurations[mode])
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  const totalDuration = modeDurations[mode]
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100)

  return (
    <div className="flex flex-col h-full bg-white/85 dark:bg-slate-900/75 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-black/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <Timer className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Focus Timer</h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <button
            onClick={() => handleModeChange('focus')}
            className={`px-2.5 py-0.5 rounded-xl text-[10px] font-bold transition-all ${
              mode === 'focus' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            25m
          </button>
          <button
            onClick={() => handleModeChange('shortBreak')}
            className={`px-2.5 py-0.5 rounded-xl text-[10px] font-bold transition-all ${
              mode === 'shortBreak' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            5m
          </button>
          <button
            onClick={() => handleModeChange('deepWork')}
            className={`px-2.5 py-0.5 rounded-xl text-[10px] font-bold transition-all ${
              mode === 'deepWork' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            45m
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <div className="text-4xl sm:text-5xl font-mono font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-xs">
          {formattedTime}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-semibold">
          <Flame className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
          {mode === 'shortBreak' ? 'Rest & recharge' : 'Deep focus sprint'}
        </p>

        {/* Progress meter */}
        <div className="w-48 bg-slate-100 dark:bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isRunning ? 'Pause' : 'Start Focus'}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
