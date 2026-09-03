import React, { useEffect, useState } from 'react'
import { CloudRain, Sun, Cloud, CloudLightning, Wind, Snowflake, RefreshCw } from 'lucide-react'
import { fetchLiveWeather } from '../utils/weather'
import type { WeatherData } from '../types'

interface WeatherCardProps {
  city?: string
  temp?: number
  condition?: string
  high?: number
  low?: number
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  city = 'Varanasi',
  temp: propTemp,
  condition: propCondition,
  high: propHigh,
  low: propLow,
}) => {
  const [weather, setWeather] = useState<WeatherData>({
    city,
    temp: propTemp ?? 26,
    condition: propCondition ?? 'Partly Cloudy',
    high: propHigh ?? 32,
    low: propLow ?? 25,
  })
  const [isLoading, setIsLoading] = useState(false)

  const loadWeather = async (cityName: string) => {
    setIsLoading(true)
    try {
      const data = await fetchLiveWeather(cityName)
      setWeather(data)
    } catch (err) {
      console.warn('Weather fetch failed, falling back to defaults:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWeather(city)
  }, [city])

  const getWeatherIcon = (cond: string) => {
    const lower = cond.toLowerCase()
    if (lower.includes('sun') || lower.includes('clear')) {
      return <Sun className="h-4 w-4 text-amber-400" />
    }
    if (lower.includes('thunder') || lower.includes('storm')) {
      return <CloudLightning className="h-4 w-4 text-yellow-400" />
    }
    if (lower.includes('snow')) {
      return <Snowflake className="h-4 w-4 text-cyan-300" />
    }
    if (lower.includes('wind')) {
      return <Wind className="h-4 w-4 text-teal-300" />
    }
    if (lower.includes('rain') || lower.includes('drizzle') || lower.includes('shower')) {
      return <CloudRain className="h-4 w-4 text-sky-300" />
    }
    return <Cloud className="h-4 w-4 text-slate-300" />
  }

  return (
    <div className="flex flex-col items-center group">
      <div
        onClick={() => loadWeather(city)}
        className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-slate-900/40 hover:bg-slate-900/50 border border-white/10 backdrop-blur-2xl p-4 flex flex-col justify-between text-white shadow-xl shadow-black/25 transition-all duration-300 hover:scale-102 hover:border-white/20 select-none cursor-pointer relative"
        title="Click to refresh weather"
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0 pr-1">
            <h4 className="text-xs font-bold text-slate-200 tracking-tight truncate">{weather.city}</h4>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-0.5 font-sans">
              {weather.temp}°
            </div>
          </div>
          <button
            type="button"
            aria-label="Refresh weather"
            onClick={(e) => {
              e.stopPropagation()
              loadWeather(city)
            }}
            className={`p-1 rounded-full text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 ${
              isLoading ? 'animate-spin opacity-100' : ''
            }`}
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
            {getWeatherIcon(weather.condition)}
            <span className="text-[11px] font-semibold truncate">{weather.condition}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            H:{weather.high}° L:{weather.low}°
          </p>
        </div>
      </div>
      <span className="text-xs text-slate-200 font-medium mt-1.5 select-none drop-shadow-md">
        Weather
      </span>
    </div>
  )
}
