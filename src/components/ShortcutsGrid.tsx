import React, { useState } from 'react'
import { Plus, X, Globe } from 'lucide-react'
import type { Shortcut } from '../types'

interface ShortcutsGridProps {
  shortcuts: Shortcut[]
  onAddShortcut: (shortcut: Omit<Shortcut, 'id'>) => void
  onRemoveShortcut: (id: string) => void
}

const GRADIENT_PRESETS = [
  'from-indigo-500 to-purple-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-slate-600 to-slate-800',
]

export const ShortcutsGrid: React.FC<ShortcutsGridProps> = ({
  shortcuts,
  onAddShortcut,
  onRemoveShortcut,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newUrl.trim()) return

    let formattedUrl = newUrl.trim()
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`
    }

    const randomColor = GRADIENT_PRESETS[Math.floor(Math.random() * GRADIENT_PRESETS.length)]
    onAddShortcut({
      title: newTitle.trim(),
      url: formattedUrl,
      color: randomColor,
    })

    setNewTitle('')
    setNewUrl('')
    setIsModalOpen(false)
  }

  const getDomain = (url: string) => {
    try {
      const parsed = new URL(url)
      return parsed.hostname
    } catch {
      return url
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-1">
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
        {shortcuts.map((item) => {
          const domain = getDomain(item.url)
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

          return (
            <div key={item.id} className="group relative">
              <a
                href={item.url}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/70 dark:bg-slate-900/60 hover:bg-white/95 dark:hover:bg-slate-900/95 border border-black/5 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md hover:shadow-indigo-500/10 backdrop-blur-xl transition-all duration-200 group-hover:-translate-y-1 w-16 sm:w-18"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center p-2 shadow-2xs overflow-hidden">
                  <img
                    src={faviconUrl}
                    alt={item.title}
                    onError={(e) => {
                      ;(e.currentTarget as HTMLElement).style.display = 'none'
                    }}
                    className="w-5 h-5 object-contain rounded pointer-events-none"
                  />
                  <div
                    className={`w-5 h-5 rounded bg-gradient-to-br ${item.color || 'from-indigo-500 to-purple-500'} hidden group-has-[img[style*="display: none"]]:flex items-center justify-center text-[10px] font-bold text-white uppercase`}
                  >
                    {item.title.charAt(0)}
                  </div>
                </div>

                {/* Title */}
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate max-w-[64px] text-center">
                  {item.title}
                </span>
              </a>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onRemoveShortcut(item.id)
                }}
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white dark:bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xs"
                title="Remove shortcut"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          )
        })}

        {/* Add Shortcut Tile */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-white/40 dark:bg-slate-900/30 hover:bg-white/80 dark:hover:bg-slate-900/70 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 w-16 sm:w-18 h-[76px]"
          title="Add shortcut"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 flex items-center justify-center">
            <Plus className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-medium text-slate-400">Add</span>
        </button>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Add Shortcut
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. GitHub"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block mb-1">URL</label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  Add Shortcut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
