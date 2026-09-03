import React from 'react'
import { Play, Pause, RotateCcw, Flame, ArrowUpRight, X } from 'lucide-react'
import { useFocusTimer } from '../utils/timer'

interface FloatingTimerOverlayProps {
  onScrollToTimer?: () => void
}

export const FloatingTimerOverlay: React.FC<FloatingTimerOverlayProps> = ({
  onScrollToTimer,
}) => {
  const {
    mode,
    isRunning,
    isPaused,
    shouldShowOverlay,
    formattedTime,
    togglePlay,
    resetTimer,
    dismissOverlay,
  } = useFocusTimer()

  if (!shouldShowOverlay) return null

  const modeLabels = {
    focus: 'Focus',
    shortBreak: 'Break',
    deepWork: 'Deep Work',
  }

  return (
    <div className="fixed bottom-14 right-4 sm:bottom-6 sm:right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-2.5 sm:gap-3 bg-black/90 border border-white/20 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-2xl shadow-2xl shadow-black/80 select-none group hover:border-white/40 transition-all text-white">
        {/* Flame / Status Indicator */}
        <div className="relative flex items-center justify-center">
          {isRunning && (
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xs animate-ping" />
          )}
          <div
            className={`relative p-1.5 rounded-xl border transition-colors ${
              isRunning
                ? 'bg-white text-black border-white'
                : 'bg-white/10 text-white/70 border-white/15'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Mode & Countdown */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60">
              {modeLabels[mode]}
            </span>
            {isPaused && (
              <span className="text-[8px] font-bold uppercase px-1 py-0.2 rounded bg-white/20 text-white">
                Paused
              </span>
            )}
          </div>
          <span className="text-base sm:text-lg font-mono font-extrabold text-white tracking-tight leading-none">
            {formattedTime}
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-white/15" />

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={togglePlay}
            className="p-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black shadow-xs transition-all hover:scale-105 active:scale-95 font-bold"
            title={isRunning ? 'Pause Timer' : 'Resume Timer'}
          >
            {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-black" />}
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all hover:scale-105"
            title="Reset Timer"
          >
            <RotateCcw className="h-3 w-3" />
          </button>

          {onScrollToTimer && (
            <button
              type="button"
              onClick={onScrollToTimer}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 transition-all hover:scale-105 ml-0.5"
              title="Jump to Full Focus Timer Widget"
            >
              <ArrowUpRight className="h-3 w-3" />
            </button>
          )}

          {/* Dismiss ✕ Button */}
          <button
            type="button"
            onClick={dismissOverlay}
            className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
            title="Dismiss overlay"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
