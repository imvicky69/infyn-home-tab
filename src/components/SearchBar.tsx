import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  CornerDownLeft,
  ChevronDown,
  Sparkles,
  Command,
  Bot,
} from 'lucide-react'
import type { SearchEngineId } from '../types'
import { DEFAULT_SEARCH_ENGINES } from '../utils/storage'

interface SearchBarProps {
  currentEngine: SearchEngineId
  onEngineChange: (engine: SearchEngineId) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ currentEngine, onEngineChange }) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeEngine = DEFAULT_SEARCH_ENGINES[currentEngine] || DEFAULT_SEARCH_ENGINES.google

  // Shortcut key focus listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    // If it looks like a URL, go directly to it
    const urlPattern = /^(http:\/\/|https:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/
    if (urlPattern.test(trimmed)) {
      const targetUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`
      window.location.href = targetUrl
      return
    }

    // Otherwise use chosen search engine
    const searchUrl = `${activeEngine.urlPattern}${encodeURIComponent(trimmed)}`
    window.location.href = searchUrl
  }

  return (
    <div className="w-full max-w-xl mx-auto relative z-30">
      <form
        onSubmit={handleSearch}
        className="group relative flex items-center bg-white/75 dark:bg-slate-900/70 hover:bg-white/90 dark:hover:bg-slate-900/90 border border-black/5 dark:border-white/10 focus-within:border-indigo-500/80 focus-within:ring-4 focus-within:ring-indigo-500/10 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-black/40 backdrop-blur-2xl transition-all duration-300"
      >
        {/* Engine Switcher Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 pl-3.5 pr-2.5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border-r border-slate-200/60 dark:border-slate-800/80"
          >
            {activeEngine.id === 'chatgpt' ? (
              <Bot className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
            ) : activeEngine.id === 'perplexity' ? (
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
            ) : (
              <Search className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span className="hidden sm:inline text-xs">{activeEngine.name}</span>
            <ChevronDown className="h-3 w-3 text-slate-400 opacity-70" />
          </button>

          {/* Engine Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl backdrop-blur-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Search Engine
              </div>
              {Object.values(DEFAULT_SEARCH_ENGINES).map((engine) => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => {
                    onEngineChange(engine.id as SearchEngineId)
                    setIsOpen(false)
                    inputRef.current?.focus()
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                    activeEngine.id === engine.id
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{engine.name}</span>
                  {activeEngine.id === engine.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={activeEngine.placeholder}
          className="flex-1 bg-transparent px-3.5 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />

        {/* Action button / Shortcut Hint */}
        <div className="pr-2.5 flex items-center gap-1">
          {query.trim() ? (
            <button
              type="submit"
              className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <CornerDownLeft className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-[10px] text-slate-400 font-mono">
              <Command className="h-2.5 w-2.5" />
              <span>K</span>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
