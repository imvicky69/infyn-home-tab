import React, { useState } from 'react'
import { FileText, Copy, Check, Trash2 } from 'lucide-react'

interface NotesWidgetProps {
  note: string
  onNoteChange: (text: string) => void
}

export const NotesWidget: React.FC<NotesWidgetProps> = ({ note, onNoteChange }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!note) return
    navigator.clipboard.writeText(note)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    if (window.confirm('Clear your scratchpad note?')) {
      onNoteChange('')
    }
  }

  return (
    <div className="flex flex-col h-full bg-white/85 dark:bg-slate-900/75 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-black/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <FileText className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Quick Scratchpad</h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            disabled={!note}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
            title="Copy Note"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleClear}
            disabled={!note}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
            title="Clear Note"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Type quick thoughts, snippets, links, or draft prompts here. Auto-saved instantly..."
        className="flex-1 w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/70 resize-none min-h-[140px] font-sans leading-relaxed"
      />
      <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium">
        <span>Auto-saved to local storage</span>
        <span>{note.length} chars</span>
      </div>
    </div>
  )
}
