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
} from 'lucide-react'
import type { TodoItem } from '../types'

interface TodoListWidgetProps {
  todos: TodoItem[]
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

  return (
    <div className="flex flex-col h-full bg-black/35 hover:bg-black/45 border border-white/10 hover:border-white/20 rounded-3xl p-5 backdrop-blur-xl shadow-xl transition-all text-white w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white shadow-xs">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">Productivity Board</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80">
                {completedCount}/{todos.length} Done
              </span>
            </div>
            <p className="text-[11px] text-white/60">Organize focus tasks, milestones & daily goals</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10 self-start sm:self-auto">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'starred', label: '★ Starred' },
              { id: 'completed', label: 'Done' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                filter === tab.id
                  ? 'bg-white text-black font-black shadow-xs scale-102'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subtle Progress Bar */}
      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-white transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Task Creation Bar */}
      <form onSubmit={handleAdd} className="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-4">
        <div className="flex-1 relative min-w-[200px]">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add a new task or milestone... (Press Enter)"
            className="w-full bg-black/45 border border-white/15 focus:border-white/40 rounded-2xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Tag selector */}
        <div className="flex items-center gap-1 bg-black/45 border border-white/15 rounded-2xl px-2 py-1.5 shrink-0">
          <Tag className="h-3.5 w-3.5 text-white/50" />
          <select
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="bg-transparent text-xs text-white/80 focus:outline-none cursor-pointer"
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
          className={`p-2 rounded-2xl border transition-all shrink-0 ${
            newStarred
              ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
              : 'bg-black/45 border-white/15 text-white/40 hover:text-white'
          }`}
          title={newStarred ? 'Starred high priority' : 'Mark high priority'}
        >
          <Star className={`h-4 w-4 ${newStarred ? 'fill-amber-300' : ''}`} />
        </button>

        {/* Submit Add Button */}
        <button
          type="submit"
          disabled={!newText.trim()}
          className="px-3.5 py-2 rounded-2xl bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-102 shrink-0"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3]" />
          <span>Add</span>
        </button>
      </form>

      {/* Scrollable Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px] min-h-[140px] no-scrollbar">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-10 text-xs text-white/40 font-medium flex flex-col items-center gap-2">
            <Sparkles className="h-6 w-6 text-white/20 animate-pulse" />
            <span>
              {filter === 'completed'
                ? 'No completed tasks yet.'
                : filter === 'starred'
                ? 'No starred tasks. Star important goals for quick focus.'
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
                className={`group flex items-center justify-between p-3 rounded-2xl border transition-all gap-2.5 ${
                  todo.completed
                    ? 'bg-black/25 border-white/5 opacity-60'
                    : 'bg-black/40 hover:bg-black/55 border-white/10 hover:border-white/25 shadow-xs'
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
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                      onBlur={() => handleSaveEdit(todo.id)}
                      autoFocus
                      className="w-full bg-black/60 border border-white/30 rounded-xl px-2 py-0.5 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => handleStartEdit(todo)}
                      className={`text-xs sm:text-sm font-medium leading-relaxed break-words cursor-pointer select-text ${
                        todo.completed ? 'line-through text-white/40' : 'text-white'
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}

                  {todo.tag && (
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-white/70 shrink-0">
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
                      className="p-1 rounded-lg text-emerald-400 hover:bg-white/10 transition-colors"
                      title="Save"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(todo)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      title="Edit task"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {/* Star Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleStarTodo(todo.id)}
                    className={`p-1 rounded-lg transition-colors ${
                      todo.starred
                        ? 'text-amber-300 hover:text-amber-400'
                        : 'opacity-0 group-hover:opacity-100 text-white/30 hover:text-white'
                    }`}
                    title={todo.starred ? 'Unstar task' : 'Star high priority'}
                  >
                    <Star className={`h-3.5 w-3.5 ${todo.starred ? 'fill-amber-300' : ''}`} />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => onDeleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/10 transition-all"
                    title="Delete task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer Summary */}
      <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60 shrink-0">
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
  )
}
