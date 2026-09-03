import React, { useState, useRef, useEffect } from 'react'
import {
  Flame,
  Users,
  Database,
  HardDrive,
  Globe,
  Code,
  Settings,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  Copy,
  Check,
  X,
  FileText,
} from 'lucide-react'
import type { FirebaseProject } from '../types'

interface FirebaseProjectsWidgetProps {
  projects: FirebaseProject[]
  onAddProject: (project: Omit<FirebaseProject, 'id'>) => void
  onRemoveProject: (id: string) => void
}

export const FirebaseProjectsWidget: React.FC<FirebaseProjectsWidgetProps> = ({
  projects,
  onAddProject,
  onRemoveProject,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProjectId, setNewProjectId] = useState('')
  const [newProjectName, setNewProjectName] = useState('')
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

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || null
  const currentProjectId = activeProject?.projectId || ''
  const currentProjectName = activeProject?.name || ''

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedId = newProjectId.trim().toLowerCase().replace(/\s+/g, '-')
    if (!trimmedId) return

    onAddProject({
      name: newProjectName.trim() || trimmedId,
      projectId: trimmedId,
    })

    setNewProjectId('')
    setNewProjectName('')
    setIsAddModalOpen(false)
  }

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    onRemoveProject(id)
    const remaining = projects.filter((p) => p.id !== id)
    if (remaining.length > 0) {
      setSelectedProjectId(remaining[0].id)
    } else {
      setSelectedProjectId('')
    }
  }

  const handleCopyId = () => {
    if (!activeProject) return
    navigator.clipboard.writeText(currentProjectId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getLaunchShortcuts = (projectId: string) => [
    {
      id: 'auth',
      name: 'Auth',
      desc: 'Users & providers',
      icon: Users,
      url: `https://console.firebase.google.com/project/${projectId}/authentication/users`,
      badge: 'Users',
    },
    {
      id: 'firestore',
      name: 'Firestore',
      desc: 'Collections & data',
      icon: Database,
      url: `https://console.firebase.google.com/project/${projectId}/firestore/data`,
      badge: 'Data',
    },
    {
      id: 'storage',
      name: 'Storage',
      desc: 'Buckets & media',
      icon: HardDrive,
      url: `https://console.firebase.google.com/project/${projectId}/storage`,
      badge: 'Media',
    },
    {
      id: 'hosting',
      name: 'Hosting',
      desc: 'Deploys & domains',
      icon: Globe,
      url: `https://console.firebase.google.com/project/${projectId}/hosting`,
      badge: 'Domains',
    },
    {
      id: 'functions',
      name: 'Functions',
      desc: 'Cloud serverless',
      icon: Code,
      url: `https://console.firebase.google.com/project/${projectId}/functions`,
      badge: 'API',
    },
    {
      id: 'settings',
      name: 'Settings',
      desc: 'Keys & project config',
      icon: Settings,
      url: `https://console.firebase.google.com/project/${projectId}/settings/general`,
      badge: 'Config',
    },
  ]

  return (
    <div className="flex flex-col h-full bg-black/35 hover:bg-black/45 border border-white/10 hover:border-white/20 rounded-3xl p-5 backdrop-blur-xl shadow-xl transition-all text-white w-full">
      {/* Header Bar with Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white shadow-xs">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">Firebase Projects</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80">
                {projects.length} Connected
              </span>
            </div>
            <p className="text-[11px] text-white/60">Launch Firestore, Auth, Storage & cloud consoles</p>
          </div>
        </div>

        {/* Project Switcher & Add Button */}
        <div className="flex items-center gap-2">
          {projects.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/45 hover:bg-black/60 border border-white/15 text-xs text-white font-medium transition-all"
              >
                <Flame className="h-3 w-3 text-white/70" />
                <span className="max-w-[130px] truncate">{activeProject?.name}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-neutral-950/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl py-1 z-30 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-white/50 border-b border-white/10">
                    Switch Project
                  </div>
                  <div className="max-h-48 overflow-y-auto py-1">
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProjectId(p.id)
                          setIsDropdownOpen(false)
                        }}
                        className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                          activeProject?.id === p.id
                            ? 'bg-white/15 text-white font-bold'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="truncate">
                          <span className="block truncate">{p.name}</span>
                          <span className="text-[10px] text-white/40 block font-mono">{p.projectId}</span>
                        </div>
                        {projects.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleDelete(p.id, e)}
                            className="p-1 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/10"
                            title="Remove project"
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
            title="Add Firebase Project"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Active Project Banner & Quick Actions */}
      {activeProject ? (
        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white shrink-0">
                <Flame className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://console.firebase.google.com/project/${currentProjectId}/overview`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm font-bold text-white hover:underline truncate flex items-center gap-1.5"
                  >
                    <span>{currentProjectName}</span>
                    <ExternalLink className="h-3 w-3 text-white/50 shrink-0" />
                  </a>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white/70 shrink-0">
                    Console
                  </span>
                </div>
                <p className="text-[11px] text-white/60 font-mono truncate mt-0.5">ID: {currentProjectId}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyId}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] text-white flex items-center gap-1.5 transition-colors"
                title="Copy Project ID"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-white/60" />}
                <span>{copied ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>
          </div>

          {/* Quick Launcher Grid (Auth, Firestore, Storage, Hosting, Functions, Settings) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {getLaunchShortcuts(currentProjectId).map((item) => {
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
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              <span>console.firebase.google.com</span>
            </a>

            <div className="flex items-center gap-3">
              <a
                href="https://firebase.google.com/docs"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <FileText className="h-3 w-3" />
                <span>Documentation</span>
              </a>
              <a
                href={`https://console.firebase.google.com/project/${currentProjectId}/overview`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Overview
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-white/50 border border-dashed border-white/15 rounded-2xl flex flex-col items-center gap-3">
          <Flame className="h-8 w-8 text-white/30" />
          <p>No Firebase projects connected yet. Add your main project to get quick 1-click cloud launchers.</p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all"
          >
            Add Project
          </button>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-neutral-950 border border-white/20 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                <h4 className="text-sm font-bold">Add Firebase Project</h4>
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
                <span className="text-[11px] text-white/70 block mb-1">Project Name</span>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. My App Cloud"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div>
                <span className="text-[11px] text-white/70 block mb-1">Project ID</span>
                <input
                  type="text"
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  placeholder="e.g. my-app-prod-123"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  required
                />
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
                  disabled={!newProjectId.trim()}
                  className="px-4 py-1.5 rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-bold shadow-sm"
                >
                  Connect Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
