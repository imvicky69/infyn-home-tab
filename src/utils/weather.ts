import type { WeatherData } from '../types'

interface WeatherCacheEntry {
  data: WeatherData
  timestamp: number
}

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

function mapWmoCodeToCondition(code: number): string {
  if (code === 0) return 'Sunny'
  if (code === 1 || code === 2) return 'Partly Cloudy'
  if (code === 3) return 'Overcast'
  if (code === 45 || code === 48) return 'Foggy'
  if (code >= 51 && code <= 55) return 'Drizzle'
  if (code >= 61 && code <= 65) return 'Rainy'
  if (code >= 71 && code <= 77) return 'Snowy'
  if (code >= 80 && code <= 82) return 'Showers'
  if (code >= 85 && code <= 86) return 'Snow Showers'
  if (code >= 95 && code <= 99) return 'Thundershower'
  return 'Cloudy'
}

export async function fetchLiveWeather(city: string): Promise<WeatherData> {
  const trimmedCity = city.trim() || 'Varanasi'
  const cacheKey = `infyn_weather_${trimmedCity.toLowerCase()}`

  // Check cache first
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const entry: WeatherCacheEntry = JSON.parse(cached)
      if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
        return entry.data
      }
    }
  } catch {
    // Ignore cache read errors
  }

  // 1. Geocode city name to lat/lon
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedCity)}&count=1&language=en&format=json`
  const geoRes = await fetch(geoUrl)
  if (!geoRes.ok) {
    throw new Error(`Failed to geocode city ${trimmedCity}`)
  }

  const geoData = await geoRes.json()
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`City "${trimmedCity}" not found`)
  }

  const location = geoData.results[0]
  const resolvedCity = location.name || trimmedCity
  const lat = location.latitude
  const lon = location.longitude

  // 2. Fetch forecast
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
  const weatherRes = await fetch(weatherUrl)
  if (!weatherRes.ok) {
    throw new Error('Failed to fetch weather forecast')
  }

  const weatherJson = await weatherRes.json()
  const currentTemp = Math.round(weatherJson.current?.temperature_2m ?? 25)
  const weatherCode = weatherJson.current?.weather_code ?? 0
  const highTemp = Math.round(weatherJson.daily?.temperature_2m_max?.[0] ?? currentTemp + 4)
  const lowTemp = Math.round(weatherJson.daily?.temperature_2m_min?.[0] ?? currentTemp - 4)

  const weatherData: WeatherData = {
    city: resolvedCity,
    temp: currentTemp,
    condition: mapWmoCodeToCondition(weatherCode),
    high: highTemp,
    low: lowTemp,
  }

  // Save to cache
  try {
    const entry: WeatherCacheEntry = {
      data: weatherData,
      timestamp: Date.now(),
    }
    localStorage.setItem(cacheKey, JSON.stringify(entry))
  } catch {
    // Ignore cache save errors
  }

  return weatherData
}
