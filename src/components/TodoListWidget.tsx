import React, { useState } from 'react'
import { CheckCircle2, Circle, Plus, Trash2, CheckSquare } from 'lucide-react'
import type { TodoItem } from '../types'

interface TodoListWidgetProps {
  todos: TodoItem[]
  onAddTodo: (text: string) => void
  onToggleTodo: (id: string) => void
  onDeleteTodo: (id: string) => void
}

export const TodoListWidget: React.FC<TodoListWidgetProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}) => {
  const [newText, setNewText] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newText.trim()) return
    onAddTodo(newText.trim())
    setNewText('')
  }

  const completedCount = todos.filter((t) => t.completed).length
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0

  const filteredTodos = todos.filter((item) => {
    if (filter === 'active') return !item.completed
    if (filter === 'completed') return item.completed
    return true
  })

  return (
    <div className="flex flex-col h-full bg-white/85 dark:bg-slate-900/75 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-black/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Today's Focus</h3>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
          {completedCount}/{todos.length} done ({progressPercent}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Input */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-3">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/70"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
          title="Add Task"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-2">
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
              filter === tab
                ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List items */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-56 min-h-[120px]">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 font-medium">
            {filter === 'completed'
              ? 'No completed tasks yet'
              : filter === 'active'
              ? 'No active tasks!'
              : 'All clear! Add a task above.'}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/40 hover:bg-slate-100/90 dark:hover:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800/60 transition-colors"
            >
              <button
                onClick={() => onToggleTodo(todo.id)}
                className="flex items-center gap-2.5 flex-1 text-left"
              >
                {todo.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 transition-colors" />
                )}
                <span
                  className={`text-xs sm:text-sm font-medium leading-snug break-all ${
                    todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {todo.text}
                </span>
              </button>

              <button
                onClick={() => onDeleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-all"
                title="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
