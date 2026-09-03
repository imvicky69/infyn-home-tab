import React, { useState, useRef, useEffect } from 'react'
import {
  Flame,
  Users,
  Database,
  HardDrive,
  Globe,
  Code,
  Settings,
  Shield,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  Copy,
  Check,
  X,
  Zap,
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
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ''
  )
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProjectId, setNewProjectId] = useState('')
  const [newProjectName, setNewProjectName] = useState('')
  const [copied, setCopied] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-sync selectedProjectId if current active project was removed
  const activeProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || null

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedId = newProjectId.trim()
    if (!trimmedId) return

    const newId = Date.now().toString()
    onAddProject({
      name: newProjectName.trim() || trimmedId,
      projectId: trimmedId,
    })

    setSelectedProjectId(newId)
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

    // Select remaining project
    const remaining = projects.filter((p) => p.id !== id)
    if (remaining.length > 0) {
      setSelectedProjectId(remaining[0].id)
    } else {
      setSelectedProjectId('')
    }
  }

  const handleCopyId = () => {
    if (!activeProject) return
    navigator.clipboard.writeText(activeProject.projectId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getFirebaseLinks = (projectId: string) => [
    {
      id: 'auth',
      name: 'Auth',
      fullName: 'Authentication',
      desc: 'Users & Providers',
      icon: Users,
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/30',
      url: `https://console.firebase.google.com/project/${projectId}/authentication/users`,
    },
    {
      id: 'firestore',
      name: 'Firestore',
      fullName: 'Cloud Firestore',
      desc: 'Collections & Documents',
      icon: Database,
      color: 'text-orange-400 bg-orange-500/15 border-orange-500/30 hover:bg-orange-500/30',
      url: `https://console.firebase.google.com/project/${projectId}/firestore/data`,
    },
    {
      id: 'storage',
      name: 'Storage',
      fullName: 'Cloud Storage',
      desc: 'Buckets & Media files',
      icon: HardDrive,
      color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30 hover:bg-yellow-500/30',
      url: `https://console.firebase.google.com/project/${projectId}/storage`,
    },
    {
      id: 'hosting',
      name: 'Hosting',
      fullName: 'Firebase Hosting',
      desc: 'Web Domains & Deploys',
      icon: Globe,
      color: 'text-sky-400 bg-sky-500/15 border-sky-500/30 hover:bg-sky-500/30',
      url: `https://console.firebase.google.com/project/${projectId}/hosting`,
    },
    {
      id: 'functions',
      name: 'Functions',
      fullName: 'Cloud Functions',
      desc: 'Serverless backend & logs',
      icon: Code,
      color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/30',
      url: `https://console.firebase.google.com/project/${projectId}/functions`,
    },
    {
      id: 'realtime',
      name: 'Realtime DB',
      fullName: 'Realtime Database',
      desc: 'JSON Tree & WebSocket',
      icon: Zap,
      color: 'text-amber-300 bg-amber-400/15 border-amber-400/30 hover:bg-amber-400/30',
      url: `https://console.firebase.google.com/project/${projectId}/database`,
    },
    {
      id: 'appcheck',
      name: 'App Check',
      fullName: 'App Check & Rules',
      desc: 'Security tokens & rules',
      icon: Shield,
      color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30 hover:bg-indigo-500/30',
      url: `https://console.firebase.google.com/project/${projectId}/appcheck`,
    },
    {
      id: 'settings',
      name: 'Settings',
      fullName: 'Project Settings',
      desc: 'Web API Keys & Config',
      icon: Settings,
      color: 'text-slate-200 bg-white/10 border-white/20 hover:bg-white/20',
      url: `https://console.firebase.google.com/project/${projectId}/settings/general`,
    },
  ]

  return (
    <div className="w-full">
      {/* Firebase Developer Command Center Box */}
      <div className="w-full rounded-3xl bg-slate-900/60 hover:bg-slate-900/75 border border-amber-500/35 hover:border-amber-500/55 backdrop-blur-2xl p-4 text-white shadow-2xl shadow-black/40 transition-all duration-300 relative group">
        {/* Top Header: Project Selector & Actions */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/30">
              <Flame className="h-4 w-4" />
            </div>

            {/* Project Switcher Dropdown */}
            {projects.length > 0 ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 text-left text-xs font-bold text-white hover:text-amber-300 transition-colors bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-xl border border-white/15"
                >
                  <span className="truncate max-w-[130px]">
                    {activeProject?.name || 'Select Project'}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-70 shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 bg-slate-900/98 border border-amber-500/40 rounded-2xl p-1.5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Firebase Projects ({projects.length})
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1 my-1 pr-1">
                      {projects.map((proj) => (
                        <div
                          key={proj.id}
                          onClick={() => {
                            setSelectedProjectId(proj.id)
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors group/item ${
                            activeProject?.id === proj.id
                              ? 'bg-amber-500/25 text-amber-300 font-bold'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="truncate font-semibold">{proj.name}</p>
                            <p className="text-[9px] text-slate-400 font-mono truncate">
                              {proj.projectId}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {activeProject?.id === proj.id && (
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mr-1" />
                            )}
                            {/* Delete button right inside dropdown item */}
                            <button
                              type="button"
                              onClick={(e) => handleDelete(proj.id, e)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-all opacity-70 group-hover/item:opacity-100"
                              title={`Delete ${proj.name}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false)
                        setIsAddModalOpen(true)
                      }}
                      className="w-full mt-1 pt-1.5 border-t border-white/10 text-left px-2.5 py-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 rounded-lg hover:bg-amber-500/10 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Add Another Project
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-200">Firebase Hub</span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 transition-all"
              title="Add New Firebase Project"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>

            {activeProject && (
              <button
                type="button"
                onClick={() => handleDelete(activeProject.id)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/25 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all"
                title={`Delete ${activeProject.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Project ID Bar */}
        {activeProject ? (
          <>
            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 mb-3 text-[11px]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[10px] text-slate-400 font-mono">ID:</span>
                <span className="font-mono text-amber-300 font-semibold truncate">
                  {activeProject.projectId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center gap-1 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors ml-2 shrink-0"
                title="Copy Project ID"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* 8 Developer Action Launch Buttons Grid */}
            <div className="grid grid-cols-4 gap-2">
              {getFirebaseLinks(activeProject.projectId).map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group/btn flex flex-col items-center justify-center p-2 rounded-2xl border ${link.color} transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 shadow-sm text-center select-none`}
                    title={`${link.fullName} • ${link.desc}`}
                  >
                    <Icon className="h-4 w-4 mb-1 transition-transform duration-200 group-hover/btn:scale-110" />
                    <span className="text-[10px] font-bold tracking-tight truncate w-full">
                      {link.name}
                    </span>
                  </a>
                )
              })}
            </div>

            {/* Bottom Direct Console Link */}
            <a
              href={`https://console.firebase.google.com/project/${activeProject.projectId}/overview`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/25 transition-all hover:scale-101"
            >
              <span>Open Firebase Console</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-xs text-slate-300 mb-2">No Firebase projects connected.</p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-md hover:scale-105 transition-all"
            >
              + Add Your First Project
            </button>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                <Flame className="h-4 w-4 text-amber-400" />
                Add Firebase Project
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">
                  Project Name / Alias
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Infyn Production"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">
                  Firebase Project ID <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  placeholder="e.g. infyn-app"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/30"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
