import React, { useState, useRef, useEffect } from 'react'
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Zap,
  Package,
  Settings,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  Copy,
  Check,
  X,
  Star,
  User,
  Edit3,
} from 'lucide-react'
import type { GithubRepo } from '../types'

export const GithubIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

interface GithubWidgetProps {
  repos: GithubRepo[]
  defaultUsername?: string
  onAddRepo: (repo: Omit<GithubRepo, 'id'>) => void
  onRemoveRepo: (id: string) => void
  onUpdateRepo?: (repo: GithubRepo) => void
}

export const GithubWidget: React.FC<GithubWidgetProps> = ({
  repos,
  defaultUsername = 'imvicky69',
  onAddRepo,
  onRemoveRepo,
  onUpdateRepo,
}) => {
  const [selectedRepoId, setSelectedRepoId] = useState<string>(repos[0]?.id || '')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [newRepoName, setNewRepoName] = useState('')
  const [newOwner, setNewOwner] = useState(defaultUsername)
  const [newBranch, setNewBranch] = useState('main')
  const [newDescription, setNewDescription] = useState('')

  const [editRepoName, setEditRepoName] = useState('')
  const [editOwner, setEditOwner] = useState('')
  const [editBranch, setEditBranch] = useState('main')
  const [editDescription, setEditDescription] = useState('')

  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  const activeRepo = repos.find((r) => r.id === selectedRepoId) || repos[0] || null
  const currentOwner = (activeRepo?.owner && activeRepo.owner !== 'imvicky69')
    ? activeRepo.owner
    : (defaultUsername || activeRepo?.owner || 'imvicky69')
  const currentRepoName = activeRepo?.name || ''
  const currentBranch = activeRepo?.defaultBranch || 'main'

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = newRepoName.trim()
    if (!trimmedName) return

    const owner = newOwner.trim() || defaultUsername
    onAddRepo({
      name: trimmedName,
      owner,
      defaultBranch: newBranch.trim() || 'main',
      description: newDescription.trim() || undefined,
    })

    setNewRepoName('')
    setNewDescription('')
    setIsAddModalOpen(false)
  }

  const openEditModal = () => {
    if (!activeRepo) return
    setEditRepoName(activeRepo.name)
    setEditOwner(activeRepo.owner || defaultUsername)
    setEditBranch(activeRepo.defaultBranch || 'main')
    setEditDescription(activeRepo.description || '')
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeRepo || !editRepoName.trim() || !onUpdateRepo) return

    onUpdateRepo({
      ...activeRepo,
      name: editRepoName.trim(),
      owner: editOwner.trim() || defaultUsername,
      defaultBranch: editBranch.trim() || 'main',
      description: editDescription.trim() || undefined,
    })

    setIsEditModalOpen(false)
  }

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    onRemoveRepo(id)
    const remaining = repos.filter((r) => r.id !== id)
    if (remaining.length > 0) {
      setSelectedRepoId(remaining[0].id)
    } else {
      setSelectedRepoId('')
    }
  }

  const handleCopyClone = () => {
    if (!activeRepo) return
    const cloneUrl = `https://github.com/${currentOwner}/${currentRepoName}.git`
    navigator.clipboard.writeText(cloneUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getLaunchShortcuts = (owner: string, repo: string, branch: string) => [
    {
      id: 'commits',
      name: 'Commits',
      desc: 'Log & history',
      icon: GitCommit,
      url: `https://github.com/${owner}/${repo}/commits/${branch}`,
      badge: 'git log',
    },
    {
      id: 'actions',
      name: 'Actions',
      desc: 'CI/CD workflows',
      icon: Zap,
      url: `https://github.com/${owner}/${repo}/actions`,
      badge: 'CI/CD',
    },
    {
      id: 'pulls',
      name: 'Pull Requests',
      desc: 'Reviews & merges',
      icon: GitPullRequest,
      url: `https://github.com/${owner}/${repo}/pulls`,
      badge: 'PRs',
    },
    {
      id: 'issues',
      name: 'Issues',
      desc: 'Bug tracking & tasks',
      icon: AlertCircle,
      url: `https://github.com/${owner}/${repo}/issues`,
      badge: 'Bugs',
    },
    {
      id: 'releases',
      name: 'Releases',
      desc: 'Tags & artifacts',
      icon: Package,
      url: `https://github.com/${owner}/${repo}/releases`,
      badge: 'Tags',
    },
    {
      id: 'settings',
      name: 'Settings',
      desc: 'Hooks & access',
      icon: Settings,
      url: `https://github.com/${owner}/${repo}/settings`,
      badge: 'Config',
    },
  ]

  return (
    <div className="flex flex-col h-full bg-black/35 hover:bg-black/45 border border-white/10 hover:border-white/20 rounded-3xl p-5 backdrop-blur-xl shadow-xl transition-all text-white w-full">
      {/* Header Bar with Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white shadow-xs">
            <GithubIcon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">GitHub Projects</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80">
                {repos.length} Pinned
              </span>
            </div>
            <p className="text-[11px] text-white/60">Launch commits, actions, PRs & repo consoles</p>
          </div>
        </div>

        {/* Repos Switcher & Add Button */}
        <div className="flex items-center gap-2">
          {repos.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/45 hover:bg-black/60 border border-white/15 text-xs text-white font-medium transition-all"
              >
                <GitBranch className="h-3 w-3 text-white/70" />
                <span className="max-w-[130px] truncate">{activeRepo?.name}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-neutral-950/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl py-1 z-30 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-white/50 border-b border-white/10">
                    Switch Repository
                  </div>
                  <div className="max-h-48 overflow-y-auto py-1">
                    {repos.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setSelectedRepoId(r.id)
                          setIsDropdownOpen(false)
                        }}
                        className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                          activeRepo?.id === r.id ? 'bg-white/15 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="truncate">
                          <span className="block truncate">{r.name}</span>
                          <span className="text-[10px] text-white/40 block font-mono">{r.owner || defaultUsername}</span>
                        </div>
                        {repos.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleDelete(r.id, e)}
                            className="p-1 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/10"
                            title="Remove pinned repo"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white shadow-xs transition-all hover:scale-105"
            title="Add GitHub Repository"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Active Repo Banner & Quick Actions */}
      {activeRepo ? (
        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white shrink-0">
                <GitBranch className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://github.com/${currentOwner}/${currentRepoName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm font-bold text-white hover:underline truncate flex items-center gap-1.5"
                  >
                    <span>{currentOwner}/{currentRepoName}</span>
                    <ExternalLink className="h-3 w-3 text-white/50 shrink-0" />
                  </a>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white/70 shrink-0">
                    {currentBranch}
                  </span>
                </div>
                {activeRepo.description && (
                  <p className="text-[11px] text-white/60 truncate mt-0.5">{activeRepo.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {onUpdateRepo && (
                <button
                  type="button"
                  onClick={openEditModal}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] text-white flex items-center gap-1 transition-colors"
                  title="Edit repository name, owner or branch"
                >
                  <Edit3 className="h-3 w-3 text-white/70" />
                  <span>Edit</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyClone}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] text-white flex items-center gap-1.5 transition-colors"
                title="Copy git clone URL"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-white/60" />}
                <span>{copied ? 'Copied' : 'Clone'}</span>
              </button>
            </div>
          </div>

          {/* Quick Launcher Grid (Commits, Actions, PRs, Issues, Releases, Settings) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {getLaunchShortcuts(currentOwner, currentRepoName, currentBranch).map((item) => {
              const Icon = item.icon

              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-3 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/30 text-white transition-all flex flex-col justify-between h-20 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded-xl bg-white/10 border border-white/15 text-white group-hover:scale-105 transition-transform">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/50 group-hover:text-white/80 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold block truncate group-hover:translate-x-0.5 transition-transform">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-white/50 block truncate">{item.desc}</span>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Bottom Profile Links Bar */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
            <a
              href={`https://github.com/${currentOwner}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <User className="h-3 w-3" />
              <span>github.com/{currentOwner}</span>
            </a>

            <div className="flex items-center gap-3">
              <a
                href={`https://github.com/${currentOwner}?tab=repositories`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Repositories
              </a>
              <a
                href={`https://github.com/${currentOwner}?tab=stars`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <Star className="h-3 w-3 fill-white/20" />
                <span>Stars</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-white/50 border border-dashed border-white/15 rounded-2xl flex flex-col items-center gap-3">
          <GithubIcon className="h-8 w-8 text-white/30" />
          <p>No GitHub repositories pinned yet. Add your main project to get quick 1-click launchers.</p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all"
          >
            Add Repository
          </button>
        </div>
      )}

      {/* Edit Repository Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-neutral-950 border border-white/20 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                <h4 className="text-sm font-bold">Edit GitHub Project</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <span className="text-[11px] text-white/70 block mb-1">Owner / Username</span>
                <input
                  type="text"
                  value={editOwner}
                  onChange={(e) => setEditOwner(e.target.value)}
                  placeholder={defaultUsername}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div>
                <span className="text-[11px] text-white/70 block mb-1">Repository Name</span>
                <input
                  type="text"
                  value={editRepoName}
                  onChange={(e) => setEditRepoName(e.target.value)}
                  placeholder="e.g. my-cool-project"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-white/70 block mb-1">Branch</span>
                  <input
                    type="text"
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    placeholder="main"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-white/70 block mb-1">Description</span>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="e.g. Core App"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editRepoName.trim()}
                  className="px-4 py-1.5 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Repository Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-neutral-950 border border-white/20 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <GithubIcon className="h-5 w-5" />
                <h4 className="text-sm font-bold">Add GitHub Project</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <span className="text-[11px] text-white/70 block mb-1">Owner / Username</span>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder={defaultUsername}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                />
              </div>

              <div>
                <span className="text-[11px] text-white/70 block mb-1">Repository Name</span>
                <input
                  type="text"
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  placeholder="e.g. indivio-extension"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-white/70 block mb-1">Branch</span>
                  <input
                    type="text"
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    placeholder="main"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-white/70 block mb-1">Description (Optional)</span>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="e.g. Browser home tab"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newRepoName.trim()}
                  className="px-4 py-1.5 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-bold shadow-sm"
                >
                  Pin Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
