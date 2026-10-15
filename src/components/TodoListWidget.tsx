import React, { useState } from 'react'
import {
  CheckSquare,
  Circle,
  CheckCircle2,
  Plus,
  Trash2,
  Star,
  Tag,
  Sparkles,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { TodoItem, WidgetSize } from '../types'

interface TodoListWidgetProps {
  todos: TodoItem[]
  size?: WidgetSize
  onAddTodo: (text: string, options?: { starred?: boolean; tag?: string }) => void
  onToggleTodo: (id: string) => void
  onToggleStarTodo: (id: string) => void
  onUpdateTodoText: (id: string, text: string) => void
  onDeleteTodo: (id: string) => void
  onClearCompleted: () => void
}

type FilterType = 'all' | 'active' | 'starred' | 'completed'

const TAG_OPTIONS = ['General', 'Work', 'Personal', 'Urgent', 'Idea']

export const TodoListWidget: React.FC<TodoListWidgetProps> = ({
  todos,
  size = 'normal',
  onAddTodo,
  onToggleTodo,
  onToggleStarTodo,
  onUpdateTodoText,
  onDeleteTodo,
  onClearCompleted,
}) => {
  const [newText, setNewText] = useState('')
  const [newTag, setNewTag] = useState('General')
  const [newStarred, setNewStarred] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('infyn_todos_widget_collapsed') === 'true'
    } catch {
      return false
    }
  })

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('infyn_todos_widget_collapsed', String(next))
      } catch {}
      return next
    })
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newText.trim()) return
    onAddTodo(newText.trim(), {
      starred: newStarred,
      tag: newTag !== 'General' ? newTag : undefined,
    })
    setNewText('')
    setNewStarred(false)
  }

  const handleStartEdit = (todo: TodoItem) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }

  const handleSaveEdit = (id: string) => {
    if (editingText.trim()) {
      onUpdateTodoText(id, editingText.trim())
    }
    setEditingId(null)
  }

  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = todos.length - completedCount
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0

  const filteredTodos = todos.filter((item) => {
    if (filter === 'active') return !item.completed
    if (filter === 'starred') return item.starred
    if (filter === 'completed') return item.completed
    return true
  })

  // Dynamic max-height to guarantee the widget never overflows onto adjacent screens
  const listMaxHeightClass =
    size === 'compact'
      ? 'max-h-[120px]'
      : size === 'normal'
      ? 'max-h-[150px]'
      : 'max-h-[170px] sm:max-h-[195px]'

  const nextPendingTodo = todos.find((t) => !t.completed)

  return (
    <div className="flex flex-col bg-black/35 hover:bg-black/45 border border-white/10 hover:border-white/20 rounded-3xl p-3.5 sm:p-4 backdrop-blur-xl shadow-xl transition-all duration-300 text-white w-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-xl bg-white/10 border border-white/15 text-white shrink-0">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight shrink-0">
              Tasks
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 shrink-0">
              {completedCount}/{todos.length}
            </span>

            {/* Collapsed Preview */}
            {isCollapsed && nextPendingTodo && (
              <div className="flex items-center gap-1.5 min-w-0 ml-1 pl-2 border-l border-white/15 text-xs text-white/70 truncate">
                <span className="truncate">Next: {nextPendingTodo.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Filter Tabs + Collapse Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-0.5 bg-black/40 p-0.5 rounded-xl border border-white/10">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'active', label: 'Active' },
                  { id: 'starred', label: '★' },
                  { id: 'completed', label: 'Done' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                    filter === tab.id
                      ? 'bg-white text-black shadow-xs'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Collapse/Expand Toggle Button */}
          <button
            type="button"
            onClick={toggleCollapse}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all shrink-0"
            title={isCollapsed ? 'Expand tasks' : 'Collapse tasks'}
          >
            {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Task Area */}
      {!isCollapsed && (
        <div className="mt-2.5 flex flex-col space-y-2.5 animate-in fade-in duration-200">
          {/* Subtle Progress Bar */}
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden shrink-0">
            <div
              className="h-full bg-white transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Task Creation Input Form */}
          <form onSubmit={handleAdd} className="flex items-center gap-1.5 shrink-0">
            <div className="flex-1 relative min-w-0">
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Add a new task... (Press Enter)"
                className="w-full bg-black/45 border border-white/15 focus:border-white/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none transition-colors truncate"
              />
            </div>

            {/* Tag selector */}
            <div className="flex items-center gap-1 bg-black/45 border border-white/15 rounded-xl px-2 py-1 shrink-0">
              <Tag className="h-3 w-3 text-white/50" />
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-transparent text-[11px] text-white/80 focus:outline-none cursor-pointer"
              >
                {TAG_OPTIONS.map((tag) => (
                  <option key={tag} value={tag} className="bg-neutral-900 text-white">
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Star Toggle for New Task */}
            <button
              type="button"
              onClick={() => setNewStarred(!newStarred)}
              className={`p-1.5 rounded-xl border transition-all shrink-0 ${
                newStarred
                  ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                  : 'bg-black/45 border-white/15 text-white/40 hover:text-white'
              }`}
              title={newStarred ? 'Starred high priority' : 'Mark high priority'}
            >
              <Star className={`h-3.5 w-3.5 ${newStarred ? 'fill-amber-300' : ''}`} />
            </button>

            {/* Submit Add Button */}
            <button
              type="submit"
              disabled={!newText.trim()}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-bold flex items-center gap-1 shadow-sm transition-all shrink-0"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </form>

          {/* Strictly Capped Scrollable Tasks List */}
          <div
            className={`flex-1 overflow-y-auto space-y-1.5 pr-1.5 min-h-[100px] ${listMaxHeightClass}`}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.2) transparent',
            }}
          >
            {filteredTodos.length === 0 ? (
              <div className="text-center py-6 text-xs text-white/40 font-medium flex flex-col items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-white/20 animate-pulse" />
                <span>
                  {filter === 'completed'
                    ? 'No completed tasks yet.'
                    : filter === 'starred'
                    ? 'No starred tasks.'
                    : filter === 'active'
                    ? 'All clear! No active tasks pending.'
                    : 'No tasks on your board. Add your first goal above.'}
                </span>
              </div>
            ) : (
              filteredTodos.map((todo) => {
                const isEditing = editingId === todo.id

                return (
                  <div
                    key={todo.id}
                    className={`group flex items-center justify-between p-2 sm:p-2.5 rounded-xl border transition-all gap-2 ${
                      todo.completed
                        ? 'bg-black/25 border-white/5 opacity-60'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20 shadow-xs'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleTodo(todo.id)}
                      className="shrink-0 transition-transform active:scale-90"
                      title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="h-4 w-4 text-white/40 hover:text-white transition-colors" />
                      )}
                    </button>

                    {/* Task Title & Tag */}
                    <div className="flex-1 min-w-0 flex items-center gap-1.5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                          onBlur={() => handleSaveEdit(todo.id)}
                          autoFocus
                          className="w-full bg-black/60 border border-white/30 rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none"
                        />
                      ) : (
                        <span
                          onDoubleClick={() => handleStartEdit(todo)}
                          className={`text-xs font-medium leading-tight break-words cursor-pointer select-text truncate ${
                            todo.completed ? 'line-through text-white/40' : 'text-white'
                          }`}
                          title={todo.text}
                        >
                          {todo.text}
                        </span>
                      )}

                      {todo.tag && (
                        <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/10 border border-white/10 text-white/60 shrink-0">
                          {todo.tag}
                        </span>
                      )}
                    </div>

                    {/* Right Action Icons: Edit, Star, Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(todo.id)}
                          className="p-1 rounded text-emerald-400 hover:bg-white/10 transition-colors"
                          title="Save"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(todo)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-all"
                          title="Edit task"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      )}

                      {/* Star Toggle */}
                      <button
                        type="button"
                        onClick={() => onToggleStarTodo(todo.id)}
                        className={`p-1 rounded transition-colors ${
                          todo.starred
                            ? 'text-amber-300 hover:text-amber-400'
                            : 'opacity-0 group-hover:opacity-100 text-white/30 hover:text-white'
                        }`}
                        title={todo.starred ? 'Unstar task' : 'Star high priority'}
                      >
                        <Star className={`h-3 w-3 ${todo.starred ? 'fill-amber-300' : ''}`} />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onDeleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/40 hover:text-rose-400 hover:bg-white/10 transition-all"
                        title="Delete task"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer Summary */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60 shrink-0">
            <span>
              {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
            </span>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={onClearCompleted}
                className="text-white/50 hover:text-rose-400 flex items-center gap-1 transition-colors"
                title="Clear all completed tasks"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear Completed ({completedCount})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
