import React from 'react'
import { Play, Pause, RotateCcw, Timer, Flame } from 'lucide-react'
import { useFocusTimer } from '../utils/timer'

export const FocusTimerWidget: React.FC = () => {
  const {
    mode,
    isRunning,
    isPaused,
    formattedTime,
    progressPercent,
    togglePlay,
    setTimerMode,
    resetTimer,
  } = useFocusTimer()

  return (
    <div className="flex flex-col h-full bg-black/35 hover:bg-black/45 border border-white/10 hover:border-white/20 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl transition-all text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/10 border border-white/15 text-white">
            <Timer className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Focus Timer</h3>
        </div>

        {/* Mode selector pills */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setTimerMode('focus')}
            className={`px-2.5 py-0.5 rounded-xl text-[10px] font-bold transition-all ${
              mode === 'focus'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            25m
          </button>
          <button
            onClick={() => setTimerMode('shortBreak')}
            className={`px-2.5 py-0.5 rounded-xl text-[10px] font-bold transition-all ${
              mode === 'shortBreak'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            5m
          </button>
          <button
            onClick={() => setTimerMode('deepWork')}
            className={`px-2.5 py-0.5 rounded-xl text-[10px] font-bold transition-all ${
              mode === 'deepWork'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            45m
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white tracking-tight drop-shadow-xs">
          {formattedTime}
        </div>
        <p className="text-xs text-white/70 mt-1 flex items-center gap-1 font-semibold">
          <Flame className="h-3.5 w-3.5 text-white/90" />
          {isPaused
            ? 'Session paused'
            : mode === 'shortBreak'
            ? 'Rest & recharge'
            : 'Deep focus sprint'}
        </p>

        {/* Progress meter */}
        <div className="w-48 bg-white/10 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-white transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 shadow-lg shadow-black/40 transition-all hover:scale-105 active:scale-95"
          >
            {isRunning ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-black" />
            )}
            {isRunning ? 'Pause' : isPaused ? 'Resume' : 'Start Focus'}
          </button>

          <button
            onClick={resetTimer}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
