import React from 'react'

export const CalendarCard: React.FC = () => {
  const now = new Date()
  const monthName = now.toLocaleString('default', { month: 'long' }).toUpperCase()
  const currentDay = now.getDate()
  const year = now.getFullYear()
  const month = now.getMonth()

  const firstDayIndex = new Date(year, month, 1).getDay()
  const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const calendarCells = []

  for (let i = 0; i < startDay; i++) {
    calendarCells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-slate-900/40 hover:bg-slate-900/50 border border-white/10 backdrop-blur-2xl p-3.5 flex flex-col justify-between text-white shadow-xl shadow-black/25 transition-all duration-300 hover:scale-102 hover:border-white/20 select-none">
        {/* Month Header */}
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-white/90">
          {monthName}
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-neutral-400">
          {days.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-0.5 gap-x-1 text-center text-[9px] font-semibold text-neutral-200">
          {calendarCells.slice(0, 35).map((d, index) => {
            if (d === null) {
              return <span key={index} className="opacity-0">.</span>
            }
            const isToday = d === currentDay
            return (
              <span
                key={index}
                className={`flex items-center justify-center h-4 w-4 mx-auto rounded-full ${
                  isToday
                    ? 'bg-white text-black font-extrabold shadow-sm shadow-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                {d}
              </span>
            )
          })}
        </div>
      </div>
      <span className="text-xs text-slate-200 font-medium mt-1.5 select-none drop-shadow-md">
        Calendar
      </span>
    </div>
  )
}
