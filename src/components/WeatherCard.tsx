import React from 'react'
import { CloudRain, Sun, Cloud, CloudLightning, Wind } from 'lucide-react'

interface WeatherCardProps {
  city?: string
  temp?: number
  condition?: string
  high?: number
  low?: number
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  city = 'Varanasi',
  temp = 30,
  condition = 'Thundershower',
  high = 34,
  low = 26,
}) => {
  const getWeatherIcon = () => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-4 w-4 text-amber-400" />
      case 'cloudy':
        return <Cloud className="h-4 w-4 text-slate-300" />
      case 'windy':
        return <Wind className="h-4 w-4 text-teal-300" />
      case 'thundershower':
      case 'storm':
        return <CloudLightning className="h-4 w-4 text-yellow-400" />
      case 'rainy':
      default:
        return <CloudRain className="h-4 w-4 text-sky-300" />
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-slate-900/40 hover:bg-slate-900/50 border border-white/10 backdrop-blur-2xl p-4 flex flex-col justify-between text-white shadow-xl shadow-black/25 transition-all duration-300 hover:scale-102 hover:border-white/20 select-none">
        <div>
          <h4 className="text-xs font-bold text-slate-200 tracking-tight truncate">{city}</h4>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-0.5 font-sans">
            {temp}°
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
            {getWeatherIcon()}
            <span className="text-[11px] font-semibold truncate">{condition}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            H:{high}° L:{low}°
          </p>
        </div>
      </div>
      <span className="text-xs text-slate-200 font-medium mt-1.5 select-none drop-shadow-md">
        Weather
      </span>
    </div>
  )
}
