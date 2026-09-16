'use client'

import { useState } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, parseISO } from 'date-fns'
import { Plus, Archive, Loader2, Save, X } from 'lucide-react'

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

type HabitGridProps = {
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  habits: Habit[]
  entries: Entry[]
  isLoading: boolean
  addHabit: (name: string) => Promise<boolean>
  toggleArchiveHabit: (habitId: string, currentArchived: boolean) => Promise<void>
  upsertEntry: (habitId: string, value: number | null) => Promise<void>
  selectedHabitId: string | null
  setSelectedHabitId: (id: string | null) => void
}

export default function HabitGrid({
  currentMonth,
  setCurrentMonth,
  habits,
  entries,
  isLoading,
  addHabit,
  toggleArchiveHabit,
  upsertEntry,
  selectedHabitId,
  setSelectedHabitId
}: HabitGridProps) {
  const [newHabitName, setNewHabitName] = useState('')
  const [isAddingHabit, setIsAddingHabit] = useState(false)

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await addHabit(newHabitName)
    if (success) {
      setNewHabitName('')
      setIsAddingHabit(false)
    }
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  const activeHabits = habits.filter(h => !h.archived)
  
  // Create an array of 1-10 for the dropdown
  const ratingOptions = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      {/* Grid Controls & Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 bg-[var(--color-soft-meadow)] p-1 rounded-[1440px] border border-[var(--color-slate)]/10">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="px-4 py-1.5 rounded-[1440px] hover:bg-[var(--color-canvas)] transition-colors text-sm font-medium text-[var(--color-deep-ink)]"
          >
            &larr; Prev
          </button>
          <span className="font-semibold min-w-[120px] text-center text-[var(--color-deep-ink)] text-[16px]">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            disabled={isSameDay(startOfMonth(currentMonth), startOfMonth(new Date()))}
            className="px-4 py-1.5 rounded-[1440px] hover:bg-[var(--color-canvas)] transition-colors text-sm font-medium text-[var(--color-deep-ink)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next &rarr;
          </button>
        </div>
        
        {isSameDay(startOfMonth(currentMonth), startOfMonth(new Date())) && (
          <div className="text-[12px] text-[var(--color-deep-ink)] uppercase tracking-widest font-semibold px-3 py-1 bg-[var(--color-hi-yellow)] rounded-[1440px]">
            Editing Today
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="bg-[var(--color-soft-meadow)] rounded-[24px] overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-[var(--color-slate)]/10">
              <thead className="bg-[var(--color-soft-meadow)]">
                <tr>
                  <th scope="col" className="sticky left-0 z-10 bg-[var(--color-soft-meadow)]/90 backdrop-blur-sm py-4 pl-4 pr-3 text-left text-[14px] font-medium text-[var(--color-slate)] sm:pl-6 w-48 border-r border-[var(--color-slate)]/10">
                    Habit
                  </th>
                  {daysInMonth.map(day => {
                    const isCurrentDay = isToday(day)
                    return (
                      <th 
                        key={day.toISOString()} 
                        scope="col" 
                        className={`px-2 py-4 text-center text-xs font-medium ${isCurrentDay ? 'bg-[var(--color-canvas)] text-[var(--color-deep-ink)]' : 'text-[var(--color-slate)]'}`}
                        title={format(day, 'PP')}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="opacity-70">{format(day, 'EEE')}</span>
                          <span className={isCurrentDay ? 'w-6 h-6 rounded-[1440px] bg-[var(--color-hi-yellow)] text-[var(--color-deep-ink)] flex items-center justify-center font-bold' : ''}>
                            {format(day, 'd')}
                          </span>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-slate)]/10 bg-[var(--color-canvas)]">
                {activeHabits.map(habit => {
                  const isSelected = selectedHabitId === habit.id;
                  return (
                    <tr 
                      key={habit.id} 
                      className={`transition-colors ${isSelected ? 'bg-[var(--color-hi-yellow)]/10' : 'hover:bg-[var(--color-soft-meadow)]/50'}`}
                    >
                      <td 
                        onClick={() => setSelectedHabitId(isSelected ? null : habit.id)}
                        className={`sticky left-0 z-10 ${isSelected ? 'bg-[var(--color-hi-yellow)]/20' : 'bg-[var(--color-canvas)]/90'} backdrop-blur-sm py-4 pl-4 pr-3 text-[16px] font-medium text-[var(--color-deep-ink)] sm:pl-6 border-r border-[var(--color-slate)]/10 flex items-center justify-between group cursor-pointer transition-colors`}
                      >
                        <span className="truncate pr-2">{habit.name}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleArchiveHabit(habit.id, habit.archived)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--color-soft-meadow)] rounded-[1440px] text-[var(--color-slate)] hover:text-[var(--color-deep-ink)] transition-all"
                          title="Archive Habit"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      {daysInMonth.map(day => {
                        const isCurrentDay = isToday(day)
                        const entry = entries.find(e => e.habitId === habit.id && isSameDay(parseISO(e.date), day))
                        const hasValue = entry !== undefined

                        return (
                          <td 
                            key={day.toISOString()} 
                            className={`whitespace-nowrap px-1 py-2 text-center text-sm ${isCurrentDay ? 'bg-[var(--color-soft-meadow)]' : ''}`}
                          >
                            {isCurrentDay ? (
                              <select
                                value={entry?.value || ''}
                                onChange={(e) => {
                                  const val = e.target.value
                                  upsertEntry(habit.id, val === '' ? null : parseInt(val))
                                }}
                                className="block w-full min-w-[44px] appearance-none rounded-[1440px] border border-[var(--color-slate)]/20 py-1 px-0 text-[var(--color-deep-ink)] bg-[var(--color-input-bg)] focus:ring-2 focus:ring-[var(--color-deep-ink)] text-center text-[14px] cursor-pointer hover:border-[var(--color-deep-ink)] transition-colors"
                              >
                                <option value="" className="bg-[var(--color-input-bg)] text-[var(--color-deep-ink)]">-</option>
                                {ratingOptions.map(opt => (
                                  <option key={opt} value={opt} className="bg-[var(--color-input-bg)] text-[var(--color-deep-ink)]">{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <div className="flex justify-center items-center h-8">
                                {hasValue ? (
                                  <span className="w-7 h-7 rounded-[1440px] flex items-center justify-center text-[12px] font-medium bg-[var(--color-deep-ink)] text-[var(--color-canvas)]">
                                    {entry.value}
                                  </span>
                                ) : (
                                  <span className="w-7 h-7 rounded-[1440px] bg-[var(--color-soft-meadow)] flex items-center justify-center text-[var(--color-slate)] text-[12px]">
                                    -
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
                
                {/* Empty State / Add Habit Row */}
                <tr>
                  <td colSpan={daysInMonth.length + 1} className="py-4 px-6 bg-[var(--color-canvas)]">
                    {isAddingHabit ? (
                      <form onSubmit={handleAddHabit} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={newHabitName}
                          onChange={(e) => setNewHabitName(e.target.value)}
                          placeholder="e.g. Morning Jog, Read 10 Pages..."
                          className="flex-1 bg-[var(--color-input-bg)] border border-[var(--color-slate)]/30 rounded-[1440px] px-4 py-2 text-[16px] text-[var(--color-deep-ink)] placeholder-[var(--color-slate)] focus:outline-none focus:ring-2 focus:ring-[var(--color-deep-ink)]"
                          autoFocus
                        />
                        <button type="submit" disabled={!newHabitName.trim()} className="px-6 py-2 bg-[var(--color-hi-yellow)] hover:opacity-90 disabled:opacity-50 text-[#130e30] text-[14px] font-medium rounded-[1440px] transition-opacity flex items-center gap-2 cursor-pointer">
                          <Save className="w-4 h-4" /> Save
                        </button>
                        <button type="button" onClick={() => setIsAddingHabit(false)} className="px-4 py-2 bg-[var(--color-soft-meadow)] hover:bg-[var(--color-slate)]/10 text-[var(--color-deep-ink)] rounded-[1440px] transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <button 
                        onClick={() => setIsAddingHabit(true)}
                        className="flex items-center gap-2 text-[14px] font-medium text-[var(--color-deep-ink)] hover:opacity-70 transition-opacity"
                      >
                        <div className="w-6 h-6 rounded-[1440px] bg-[var(--color-soft-meadow)] flex items-center justify-center">
                          <Plus className="w-4 h-4" />
                        </div>
                        Add new habit
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 text-[var(--color-deep-ink)] animate-spin" />
        </div>
      )}
    </div>
  )
}
