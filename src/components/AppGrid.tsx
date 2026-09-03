import React, { useState, useRef, useEffect } from 'react'
import {
  Plus,
  X,
  Globe,
  Upload,
  Sparkles,
  Code,
  Database,
  Layers,
  Flame,
  Music,
  ShoppingBag,
  Terminal,
  Cloud,
  Shield,
  Compass,
  BookOpen,
  Star,
  Zap,
  Cpu,
  Rocket,
  Layout,
  MessageSquare,
  Folder,
  Palette,
  Laptop,
  Check,
  Bot,
  Mail,
  Radio,
  Box,
  Lightbulb,
  Settings,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { AppIconItem } from '../types'
import { AnimatedLogo } from './AnimatedLogo'

interface AppGridProps {
  apps: AppIconItem[]
  onAddApp: (app: Omit<AppIconItem, 'id'>) => void
  onRemoveApp: (id: string) => void
  onUpdateApp?: (app: AppIconItem) => void
  onReorderApps?: (newApps: AppIconItem[]) => void
}

const LUCIDE_ICONS: { name: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { name: 'globe', icon: Globe },
  { name: 'code', icon: Code },
  { name: 'database', icon: Database },
  { name: 'sparkles', icon: Sparkles },
  { name: 'rocket', icon: Rocket },
  { name: 'layers', icon: Layers },
  { name: 'terminal', icon: Terminal },
  { name: 'cloud', icon: Cloud },
  { name: 'shield', icon: Shield },
  { name: 'zap', icon: Zap },
  { name: 'cpu', icon: Cpu },
  { name: 'flame', icon: Flame },
  { name: 'settings', icon: Settings },
  { name: 'music', icon: Music },
  { name: 'shopping', icon: ShoppingBag },
  { name: 'compass', icon: Compass },
  { name: 'book', icon: BookOpen },
  { name: 'star', icon: Star },
  { name: 'layout', icon: Layout },
  { name: 'chat', icon: MessageSquare },
  { name: 'folder', icon: Folder },
  { name: 'palette', icon: Palette },
  { name: 'laptop', icon: Laptop },
]

const CORNER_BADGE_COLORS = [
  { name: 'Indigo', class: 'bg-indigo-600 text-white' },
  { name: 'Emerald', class: 'bg-emerald-500 text-white' },
  { name: 'Rose', class: 'bg-rose-500 text-white' },
  { name: 'Amber', class: 'bg-amber-500 text-slate-950' },
  { name: 'Purple', class: 'bg-purple-600 text-white' },
  { name: 'Sky', class: 'bg-sky-500 text-white' },
  { name: 'Slate', class: 'bg-slate-900 text-white border border-white/20' },
]

const COLOR_GRADIENTS = [
  { name: 'Indigo', class: 'bg-indigo-600 text-white' },
  { name: 'Blue', class: 'bg-blue-600 text-white' },
  { name: 'Emerald', class: 'bg-emerald-600 text-white' },
  { name: 'Rose', class: 'bg-rose-600 text-white' },
  { name: 'Amber', class: 'bg-amber-500 text-slate-950' },
  { name: 'Purple', class: 'bg-purple-600 text-white' },
  { name: 'Cyan', class: 'bg-cyan-600 text-white' },
  { name: 'Slate', class: 'bg-slate-900 text-white border border-white/20' },
  { name: 'Clean White', class: 'bg-white text-slate-900' },
]

export const AppGrid: React.FC<AppGridProps> = ({
  apps,
  onAddApp,
  onRemoveApp,
  onUpdateApp,
  onReorderApps,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<AppIconItem | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [iconMode, setIconMode] = useState<'auto' | 'infyn' | 'indivio' | 'lucide' | 'upload'>('auto')
  const [selectedLucide, setSelectedLucide] = useState('globe')
  const [selectedCornerBadge, setSelectedCornerBadge] = useState('code')
  const [selectedBadgeColor, setSelectedBadgeColor] = useState(CORNER_BADGE_COLORS[0].class)
  const [selectedBgColor, setSelectedBgColor] = useState(COLOR_GRADIENTS[0].class)
  const [uploadedImage, setUploadedImage] = useState<string>('')
  const [faviconPreview, setFaviconPreview] = useState<string>('')
  const [faviconError, setFaviconError] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  // Drag-and-drop state
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null)
  const [dragOverAppId, setDragOverAppId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const itemsPerPage = 16
  const totalPages = Math.max(1, Math.ceil(apps.length / itemsPerPage))
  const visibleApps = apps.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  // Extract domain from url string
  const getDomain = (urlStr: string) => {
    try {
      const clean = urlStr.trim()
      if (!clean) return ''
      const withProto = clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`
      const parsed = new URL(withProto)
      return parsed.hostname
    } catch {
      return ''
    }
  }

  // Update favicon preview whenever URL changes
  useEffect(() => {
    const domain = getDomain(newUrl)
    if (domain && domain.includes('.')) {
      const previewUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
      setFaviconPreview(previewUrl)
      setFaviconError(false)

      if (!newTitle.trim()) {
        const parts = domain.replace(/^www\./, '').split('.')
        if (parts[0]) {
          const autoTitle = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
          setNewTitle(autoTitle)
        }
      }
    } else {
      setFaviconPreview('')
    }
  }, [newUrl])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedImage(reader.result)
          setIconMode('upload')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOpenAdd = () => {
    setEditingApp(null)
    setNewTitle('')
    setNewUrl('')
    setUploadedImage('')
    setFaviconPreview('')
    setIconMode('auto')
    setIsAddModalOpen(true)
  }

  const handleOpenEdit = (app: AppIconItem) => {
    setEditingApp(app)
    setNewTitle(app.title)
    setNewUrl(app.url)
    if (app.iconType === 'infyn-badge' || app.iconType === 'indivio-badge') {
      setIconMode('infyn')
    } else if (app.iconType === 'upload') {
      setIconMode('upload')
      setUploadedImage(app.iconValue)
    } else if (app.iconType === 'preset') {
      setIconMode('lucide')
      setSelectedLucide(app.iconValue)
    } else {
      setIconMode('auto')
      setFaviconPreview(app.iconValue)
    }
    if (app.cornerBadge) setSelectedCornerBadge(app.cornerBadge)
    if (app.bgColor) {
      setSelectedBadgeColor(app.bgColor)
      setSelectedBgColor(app.bgColor)
    }
    setIsAddModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newUrl.trim()) return

    let formattedUrl = newUrl.trim()
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`
    }

    const domain = getDomain(formattedUrl)

    let appData: Omit<AppIconItem, 'id' | 'clicks'> = {
      title: newTitle.trim(),
      url: formattedUrl,
      iconType: 'favicon',
      iconValue: domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '',
      bgColor: 'bg-white text-slate-900',
    }

    if (iconMode === 'infyn' || iconMode === 'indivio') {
      appData = {
        title: newTitle.trim(),
        url: formattedUrl,
        iconType: 'infyn-badge',
        iconValue: '/logo.png',
        cornerBadge: selectedCornerBadge,
        bgColor: selectedBadgeColor,
      }
    } else if (iconMode === 'upload' && uploadedImage) {
      appData = {
        title: newTitle.trim(),
        url: formattedUrl,
        iconType: 'upload',
        iconValue: uploadedImage,
        bgColor: 'bg-white text-slate-900',
      }
    } else if (iconMode === 'lucide') {
      appData = {
        title: newTitle.trim(),
        url: formattedUrl,
        iconType: 'preset',
        iconValue: selectedLucide,
        bgColor: selectedBgColor,
      }
    }

    if (editingApp && onUpdateApp) {
      onUpdateApp({
        ...editingApp,
        ...appData,
      })
    } else {
      onAddApp({
        ...appData,
        clicks: 0,
      })
    }

    // Reset Form
    setEditingApp(null)
    setNewTitle('')
    setNewUrl('')
    setUploadedImage('')
    setFaviconPreview('')
    setIconMode('auto')
    setIsAddModalOpen(false)
  }

  const handleAppClick = (app: AppIconItem) => {
    if (onUpdateApp) {
      onUpdateApp({
        ...app,
        clicks: (app.clicks || 0) + 1,
      })
    }
  }

  // Touch swipe gesture for pagination
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    const diffY = touchStartY.current - e.changedTouches[0].clientY

    // Dominant horizontal swipe
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      if (diffX > 0 && currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1)
      } else if (diffX < 0 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1)
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  // Drag and Drop Reordering Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedAppId(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverAppId !== id) {
      setDragOverAppId(id)
    }
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedAppId || draggedAppId === targetId) {
      setDraggedAppId(null)
      setDragOverAppId(null)
      return
    }

    const fromIndex = apps.findIndex((a) => a.id === draggedAppId)
    const toIndex = apps.findIndex((a) => a.id === targetId)

    if (fromIndex !== -1 && toIndex !== -1 && onReorderApps) {
      const updatedApps = [...apps]
      const [movedItem] = updatedApps.splice(fromIndex, 1)
      updatedApps.splice(toIndex, 0, movedItem)
      onReorderApps(updatedApps)
    }

    setDraggedAppId(null)
    setDragOverAppId(null)
  }

  const handleDragEnd = () => {
    setDraggedAppId(null)
    setDragOverAppId(null)
  }

  const renderCornerBadgeIcon = (badgeName: string) => {
    const found = LUCIDE_ICONS.find((l) => l.name === badgeName)
    if (found) {
      const Comp = found.icon
      return <Comp className="h-2.5 w-2.5" />
    }
    return <Code className="h-2.5 w-2.5" />
  }

  const renderIcon = (app: AppIconItem) => {
    // 1. Infyn Logo with Corner Badge
    if (app.iconType === 'infyn-badge' || app.iconType === 'indivio-badge' || app.cornerBadge) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatedLogo variant="hero" width={28} className="text-slate-900" />
          {app.cornerBadge && (
            <div className={`absolute -bottom-1 -right-1 p-0.5 rounded-full ${app.bgColor || 'bg-indigo-600 text-white'} border border-slate-900 shadow-md flex items-center justify-center`}>
              {renderCornerBadgeIcon(app.cornerBadge)}
            </div>
          )}
        </div>
      )
    }

    // 2. Uploaded Base64 image
    if (app.iconType === 'upload' && app.iconValue) {
      return (
        <img
          src={app.iconValue}
          alt={app.title}
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg"
        />
      )
    }

    // 3. Favicon from URL
    if (app.iconType === 'favicon' && app.iconValue) {
      return (
        <img
          src={app.iconValue}
          alt={app.title}
          onError={(e) => {
            ;(e.currentTarget as HTMLElement).style.display = 'none'
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded"
        />
      )
    }

    // 4. Lucide or Preset Brand Icon
    switch (app.iconValue) {
      case 'github':
        return (
          <svg className="h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        )
      case 'youtube':
      case 'ytmusic':
        return (
          <svg className="h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        )
      case 'instagram':
        return (
          <svg className="h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        )
      case 'facebook':
        return (
          <svg className="h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )
      case 'whatsapp':
        return (
          <svg className="h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        )
      case 'chatgpt':
        return <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
      case 'mail':
        return <Mail className="h-6 w-6 sm:h-7 sm:w-7" />
      case 'music':
        return <Music className="h-6 w-6 sm:h-7 sm:w-7" />
      case 'podcast':
        return <Radio className="h-6 w-6 sm:h-7 sm:w-7" />
      case 'shopping':
        return <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7" />
      case 'book':
        return <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
      case 'box':
        return <Box className="h-6 w-6 sm:h-7 sm:w-7" />
      case 'star':
        return <Star className="h-6 w-6 sm:h-7 sm:w-7" />
      case 'bulb':
        return <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7" />
      default: {
        const found = LUCIDE_ICONS.find((l) => l.name === app.iconValue)
        if (found) {
          const IconComp = found.icon
          return <IconComp className="h-6 w-6 sm:h-7 sm:w-7" />
        }
        return <Globe className="h-6 w-6 sm:h-7 sm:w-7" />
      }
    }
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="flex flex-col items-center w-full touch-pan-y"
    >
      {/* 4x4 Draggable Reorderable Grid with fixed top-aligned height */}
      <div className="grid grid-cols-4 content-start items-start justify-items-center gap-y-3.5 gap-x-4 sm:gap-y-5 sm:gap-x-6 p-1 min-h-[350px] sm:min-h-[380px] w-full">
        {visibleApps.map((app) => {
          const isDragging = draggedAppId === app.id
          const isDragOver = dragOverAppId === app.id

          return (
            <div
              key={app.id}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, app.id)}
              onDragOver={(e) => handleDragOver(e, app.id)}
              onDrop={(e) => handleDrop(e, app.id)}
              onDragEnd={handleDragEnd}
              className={`group relative flex flex-col items-center select-none cursor-grab active:cursor-grabbing transition-all duration-200 ${
                isDragging ? 'opacity-40 scale-95' : ''
              } ${isDragOver ? 'scale-110 ring-2 ring-white/60 rounded-3xl' : ''}`}
            >
              <a
                href={app.url}
                onClick={() => handleAppClick(app)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center shadow-lg shadow-black/30 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1.5 group-hover:shadow-2xl relative ${
                  app.bgColor || 'bg-slate-800 text-white'
                }`}
                title={`${app.title} • Drag to reorder • ${app.url}`}
              >
                {renderIcon(app)}
              </a>

              {/* App Label */}
              <span className="text-[11px] sm:text-xs font-semibold text-white mt-1.5 truncate max-w-[70px] sm:max-w-[78px] text-center drop-shadow-md">
                {app.title}
              </span>

              {/* Action buttons on hover */}
              <div className="absolute -top-1.5 -right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleOpenEdit(app)
                  }}
                  className="h-5 w-5 rounded-full bg-slate-900/95 text-slate-300 hover:text-black hover:bg-white border border-white/20 flex items-center justify-center shadow-md transition-all hover:scale-110"
                  title={`Edit ${app.title}`}
                >
                  <Pencil className="h-2.5 w-2.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemoveApp(app.id)
                  }}
                  className="h-5 w-5 rounded-full bg-slate-900/95 text-slate-300 hover:text-white hover:bg-rose-600 border border-white/20 flex items-center justify-center shadow-md transition-all hover:scale-110"
                  title={`Remove ${app.title}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          )
        })}

        {/* Add Live Site Button */}
        <div className="flex flex-col items-center select-none">
          <button
            onClick={handleOpenAdd}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-black/30 hover:bg-black/50 border border-dashed border-white/30 hover:border-white/60 text-white/80 hover:text-white flex items-center justify-center shadow-md backdrop-blur-xl transition-all duration-300 hover:scale-105"
            title="Add Favorite Site"
          >
            <Plus className="h-6 w-6" />
          </button>
          <span className="text-[11px] sm:text-xs font-semibold text-white/80 mt-1.5 drop-shadow-xs">
            Add Site
          </span>
        </div>
      </div>

      {/* Pagination Controls with Arrow Navigators */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4 select-none">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="p-1 rounded-full text-white/50 hover:text-white disabled:opacity-20 transition-all hover:bg-white/10"
            title="Previous Page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentPage === idx ? 'w-5 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                title={`Page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-1 rounded-full text-white/50 hover:text-white disabled:opacity-20 transition-all hover:bg-white/10"
            title="Next Page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Advanced Add Favorite Site Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                {editingApp ? <Pencil className="h-4 w-4 text-white" /> : <Globe className="h-4 w-4 text-white" />}
                <h3 className="text-sm font-bold text-white">
                  {editingApp ? 'Edit Favorite Site' : 'Add Live Favorite Site'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingApp(null)
                  setIsAddModalOpen(false)
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Site URL Input */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Site Web Address (URL) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="e.g. github.com or https://..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-white/40 rounded-xl pl-3 pr-9 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
                    autoFocus
                  />
                  {faviconPreview && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md overflow-hidden bg-white/10 flex items-center justify-center pointer-events-none">
                      <img
                        src={faviconPreview}
                        alt="favicon"
                        className="w-4 h-4 object-contain"
                        onError={() => setFaviconError(true)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Site Name Input */}
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">
                  Display Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. GitHub"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-white/40 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Icon Mode Switcher Tabs */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                  Icon Style
                </label>
                <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-2xl border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setIconMode('auto')}
                    className={`py-1.5 px-1 rounded-xl font-semibold flex items-center justify-center gap-1 transition-all ${
                      iconMode === 'auto'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="h-3 w-3" />
                    <span>Auto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIconMode('infyn')}
                    className={`py-1.5 px-1 rounded-xl font-semibold flex items-center justify-center gap-1 transition-all ${
                      iconMode === 'infyn' || iconMode === 'indivio'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <AnimatedLogo variant="default" width={14} className="text-current" />
                    <span>Logo +</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIconMode('lucide')}
                    className={`py-1.5 px-1 rounded-xl font-semibold flex items-center justify-center gap-1 transition-all ${
                      iconMode === 'lucide'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Lucide</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIconMode('upload')}
                    className={`py-1.5 px-1 rounded-xl font-semibold flex items-center justify-center gap-1 transition-all ${
                      iconMode === 'upload'
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Upload className="h-3 w-3" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Auto Favicon Live Preview */}
              {iconMode === 'auto' && (
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-2 shadow-md shrink-0">
                    {faviconPreview && !faviconError ? (
                      <img
                        src={faviconPreview}
                        alt="Preview"
                        onError={() => setFaviconError(true)}
                        className="w-7 h-7 object-contain"
                      />
                    ) : (
                      <Globe className="h-6 w-6 text-slate-700" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {newTitle || 'Site Preview'}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                      {newUrl || 'Enter URL to fetch site favicon'}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Infyn Logo + Corner Badge Selection */}
              {(iconMode === 'infyn' || iconMode === 'indivio') && (
                <div className="space-y-3">
                  {/* Live Badge Preview */}
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-2 shadow-md shrink-0">
                      <AnimatedLogo variant="hero" width={32} className="text-slate-900" />
                      <div className={`absolute -bottom-1 -right-1 p-0.5 rounded-full ${selectedBadgeColor} border border-slate-900 shadow-md`}>
                        {renderCornerBadgeIcon(selectedCornerBadge)}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        Infyn Badge Icon
                      </h4>
                      <p className="text-[11px] text-white/80 font-medium">
                        Corner Badge: {selectedCornerBadge}
                      </p>
                    </div>
                  </div>

                  {/* Corner Badge Icon Selector */}
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                      Select Corner Lucide Glyph
                    </span>
                    <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto p-1 rounded-xl bg-slate-950 border border-white/10">
                      {LUCIDE_ICONS.map((item) => {
                        const IconComponent = item.icon
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => setSelectedCornerBadge(item.name)}
                            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                              selectedCornerBadge === item.name
                                ? 'bg-white text-black ring-2 ring-white/60'
                                : 'text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}
                            title={item.name}
                          >
                            <IconComponent className="h-4 w-4" />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Corner Badge Color Selector */}
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                      Corner Badge Color
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {CORNER_BADGE_COLORS.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedBadgeColor(c.class)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform ${c.class} ${
                            selectedBadgeColor === c.class
                              ? 'ring-2 ring-white scale-110'
                              : 'opacity-80 hover:opacity-100 hover:scale-105'
                          }`}
                          title={c.name}
                        >
                          {selectedBadgeColor === c.class && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Lucide Icons Picker */}
              {iconMode === 'lucide' && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                      Select Glyph
                    </span>
                    <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto p-1 rounded-xl bg-slate-950 border border-white/10">
                      {LUCIDE_ICONS.map((item) => {
                        const IconComponent = item.icon
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => setSelectedLucide(item.name)}
                            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                              selectedLucide === item.name
                                ? 'bg-white text-black ring-2 ring-white/60'
                                : 'text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                      Background Palette
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {COLOR_GRADIENTS.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedBgColor(c.class)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform ${c.class} ${
                            selectedBgColor === c.class
                              ? 'ring-2 ring-white scale-110'
                              : 'opacity-80 hover:opacity-100 hover:scale-105'
                          }`}
                        >
                          {selectedBgColor === c.class && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Custom Upload Image */}
              {iconMode === 'upload' && (
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-white/60 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-white/5"
                  >
                    {uploadedImage ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="w-10 h-10 object-contain rounded-xl shadow-md"
                        />
                        <span className="text-xs text-white/80 font-semibold">
                          Click to change image
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-white/40" />
                        <span className="text-xs text-white/80 font-semibold">
                          Upload Custom Favicon / App Icon
                        </span>
                        <span className="text-[10px] text-slate-500">
                          PNG, JPG, SVG, WebP up to 2MB
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-lg shadow-black/40 transition-all hover:scale-102"
                >
                  {editingApp ? 'Save Changes' : 'Save to Live Sites'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
