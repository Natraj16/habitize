'use client'

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isAfter } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'

type Habit = {
  id: string
  name: string
  archived: boolean
}

type Entry = {
  id: string
  habitId: string
  date: string
  value: number
}

type ProgressChartsProps = {
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  habits: Habit[]
  entries: Entry[]
  isLoading: boolean
  selectedHabitId: string | null
}

export default function ProgressCharts({
  currentMonth,
  setCurrentMonth,
  habits,
  entries,
  isLoading,
  selectedHabitId
}: ProgressChartsProps) {
  const activeHabits = habits.filter(h => !h.archived)
  
  if (activeHabits.length === 0) return null

  // Process data for Overall Line Chart
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  }).filter(day => !isAfter(day, new Date())) // Only chart up to today

  const overallData = daysInMonth.map(day => {
    const dayEntries = entries.filter(e => isSameDay(parseISO(e.date), day))
    const avg = dayEntries.length > 0 
      ? dayEntries.reduce((acc, e) => acc + e.value, 0) / dayEntries.length 
      : 0
    
    return {
      date: format(day, 'MMM dd'),
      average: Number(avg.toFixed(1))
    }
  })

  // Find selected habit stats
  const selectedHabit = activeHabits.find(h => h.id === selectedHabitId)
  let selectedHabitStats = null

  if (selectedHabit) {
    const habitEntries = entries.filter(e => e.habitId === selectedHabit.id)
    const sortedEntries = [...habitEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    const daysLogged = habitEntries.length
    const avgRating = daysLogged > 0 
      ? habitEntries.reduce((acc, e) => acc + e.value, 0) / daysLogged 
      : 0

    let streak = 0
    let checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)
    
    const hasToday = sortedEntries.some(e => isSameDay(parseISO(e.date), checkDate))
    
    if (!hasToday) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    for (let i = 0; i <= sortedEntries.length; i++) {
      const entryForDate = sortedEntries.find(e => isSameDay(parseISO(e.date), checkDate))
      if (entryForDate) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    const barData = daysInMonth.map(day => {
      const entry = habitEntries.find(e => isSameDay(parseISO(e.date), day))
      return {
        date: format(day, 'dd'),
        value: entry ? entry.value : 0
      }
    })

    selectedHabitStats = {
      ...selectedHabit,
      daysLogged,
      avgRating: Number(avgRating.toFixed(1)),
      streak,
      barData
    }
  }

  const getColorForValue = (value: number) => {
    if (value === 0) return 'transparent'
    if (value >= 8) return 'var(--color-hi-yellow)'
    if (value >= 5) return 'var(--color-deep-ink)'
    return 'var(--color-slate)'
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-hedvig font-bold text-[var(--color-deep-ink)] tracking-tight">Progress Overview</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-[var(--color-deep-ink)] animate-spin" />
        </div>
      ) : (
        <>
          {/* Overall Average Line Chart */}
          <div className="bg-[var(--color-soft-meadow)] border border-[var(--color-slate)]/10 rounded-[24px] p-8">
            <h3 className="text-[16px] font-semibold text-[var(--color-deep-ink)] mb-8">Daily Average (All Habits)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overallData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate)" opacity={0.2} vertical={false} />
                  <XAxis dataKey="date" stroke="var(--color-slate)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 10]} stroke="var(--color-slate)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--color-canvas)', borderColor: 'var(--color-slate)', borderRadius: '24px', color: 'var(--color-deep-ink)' }}
                    itemStyle={{ color: 'var(--color-deep-ink)', fontWeight: 600 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="var(--color-deep-ink)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-canvas)', stroke: 'var(--color-deep-ink)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'var(--color-hi-yellow)', stroke: 'var(--color-deep-ink)' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-Habit Stats and Bar Charts */}
          <div className="bg-[var(--color-soft-meadow)] border border-[var(--color-slate)]/10 rounded-[24px] p-8 min-h-[300px] flex flex-col justify-center">
            {!selectedHabitStats ? (
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[var(--color-canvas)] rounded-[1440px] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-[18px] font-bold text-[var(--color-deep-ink)]">Select a habit</h3>
                <p className="text-[var(--color-slate)] text-sm">Click any habit in the grid above to view its detailed progress and monthly trajectory.</p>
              </div>
            ) : (
              <div className="flex flex-col h-full w-full">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-[22px] font-hedvig font-bold truncate pr-4 text-[var(--color-deep-ink)]">{selectedHabitStats.name}</h3>
                  <div className="flex gap-6 text-center">
                    <div>
                      <div className="text-[24px] font-bold text-[var(--color-deep-ink)] leading-none">{selectedHabitStats.streak}</div>
                      <div className="text-[10px] text-[var(--color-slate)] uppercase tracking-widest font-semibold mt-1">Streak</div>
                    </div>
                    <div>
                      <div className="text-[24px] font-bold text-[var(--color-deep-ink)] leading-none">{selectedHabitStats.avgRating}</div>
                      <div className="text-[10px] text-[var(--color-slate)] uppercase tracking-widest font-semibold mt-1">Avg</div>
                    </div>
                    <div>
                      <div className="text-[24px] font-bold text-[var(--color-deep-ink)] leading-none">{selectedHabitStats.daysLogged}</div>
                      <div className="text-[10px] text-[var(--color-slate)] uppercase tracking-widest font-semibold mt-1">Days</div>
                    </div>
                  </div>
                </div>
                
                <div className="h-64 w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedHabitStats.barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate)" opacity={0.1} vertical={false} />
                      <XAxis dataKey="date" stroke="var(--color-slate)" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 10]} stroke="var(--color-slate)" fontSize={10} tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        cursor={{ stroke: 'var(--color-slate)', strokeWidth: 1, strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: 'var(--color-canvas)', borderColor: 'var(--color-slate)', borderRadius: '24px', color: 'var(--color-deep-ink)' }}
                        itemStyle={{ color: 'var(--color-deep-ink)', fontWeight: 600 }}
                        formatter={(value: number) => [value, 'Rating']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="var(--color-slate)"
                        strokeOpacity={0.3}
                        strokeWidth={2}
                        dot={(props: any) => {
                          const { cx, cy, payload } = props;
                          if (payload.value === 0) return <circle key={`dot-${cx}`} cx={cx} cy={cy} r={2} fill="var(--color-slate)" opacity={0.3} />;
                          return (
                            <circle 
                              key={`dot-${cx}`} 
                              cx={cx} 
                              cy={cy} 
                              r={4} 
                              fill={getColorForValue(payload.value)} 
                              stroke="var(--color-deep-ink)" 
                              strokeWidth={1.5} 
                            />
                          );
                        }}
                        activeDot={{ r: 6, fill: 'var(--color-hi-yellow)', stroke: 'var(--color-deep-ink)' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
