import React from 'react'
import type { WallpaperStyle } from '../types'

interface LiveWallpaperProps {
  wallpaper: WallpaperStyle
  enabled: boolean
}

const LIVE_ORB_CONFIG: Record<
  WallpaperStyle,
  {
    orb1: string
    orb2: string
    orb3: string
  }
> = {
  'silk-aurora': {
    orb1: 'bg-[#1e3799]/45',
    orb2: 'bg-[#009432]/40',
    orb3: 'bg-[#00d2d3]/25',
  },
  'deep-ocean': {
    orb1: 'bg-[#004d7a]/50',
    orb2: 'bg-[#008793]/45',
    orb3: 'bg-[#00cec9]/30',
  },
  'purple-nebula': {
    orb1: 'bg-[#5758bb]/50',
    orb2: 'bg-[#833471]/45',
    orb3: 'bg-[#6c5ce7]/35',
  },
  'sunset-glow': {
    orb1: 'bg-[#8e24aa]/50',
    orb2: 'bg-[#ff6f00]/40',
    orb3: 'bg-[#e17055]/30',
  },
  'cyber-mesh': {
    orb1: 'bg-[#302b63]/50',
    orb2: 'bg-[#3d348b]/40',
    orb3: 'bg-[#24243e]/40',
  },
  'clean-light': {
    orb1: 'bg-[#8ec5fc]/50',
    orb2: 'bg-[#e0c3fc]/45',
    orb3: 'bg-[#c7ecee]/40',
  },
  'emerald-aurora': {
    orb1: 'bg-[#0d5940]/55',
    orb2: 'bg-[#009432]/40',
    orb3: 'bg-[#10ac84]/30',
  },
  'midnight-abyss': {
    orb1: 'bg-[#151c2e]/60',
    orb2: 'bg-[#1e272e]/50',
    orb3: 'bg-[#2f3640]/30',
  },
  'cosmic-fusion': {
    orb1: 'bg-[#35104d]/55',
    orb2: 'bg-[#5f27cd]/40',
    orb3: 'bg-[#e056fd]/30',
  },
  'electric-indigo': {
    orb1: 'bg-[#1d2368]/60',
    orb2: 'bg-[#273c75]/50',
    orb3: 'bg-[#40739e]/35',
  },
  'carbon-titanium': {
    orb1: 'bg-[#242731]/55',
    orb2: 'bg-[#353b48]/45',
    orb3: 'bg-[#57606f]/30',
  },
  'hyper-marine': {
    orb1: 'bg-[#0a4358]/60',
    orb2: 'bg-[#0097e6]/35',
    orb3: 'bg-[#00cec9]/30',
  },
}

export const LiveWallpaper: React.FC<LiveWallpaperProps> = ({ wallpaper, enabled }) => {
  if (!enabled) return null

  const config = LIVE_ORB_CONFIG[wallpaper] || LIVE_ORB_CONFIG['silk-aurora']

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden -z-0 select-none transition-opacity duration-1000 animate-in fade-in"
      aria-hidden="true"
    >
      {/* Ambient Orb 1 - Top Right flowing */}
      <div
        className={`absolute -top-32 -right-32 w-[34rem] sm:w-[42rem] h-[34rem] sm:h-[42rem] rounded-full blur-3xl ${config.orb1} animate-live-drift-1`}
      />

      {/* Ambient Orb 2 - Bottom Left flowing */}
      <div
        className={`absolute -bottom-32 -left-32 w-[36rem] sm:w-[46rem] h-[36rem] sm:h-[46rem] rounded-full blur-3xl ${config.orb2} animate-live-drift-2`}
      />

      {/* Ambient Orb 3 - Center breathing highlight */}
      <div
        className={`absolute top-1/3 left-1/3 w-[26rem] sm:w-[32rem] h-[26rem] sm:h-[32rem] rounded-full blur-3xl ${config.orb3} animate-live-drift-3`}
      />
    </div>
  )
}
