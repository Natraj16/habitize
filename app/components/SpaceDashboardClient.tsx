'use client'

import { useState, useEffect } from 'react'
import { format, isSameDay, parseISO, startOfDay } from 'date-fns'
import HabitGrid from './HabitGrid'
import ProgressCharts from './ProgressCharts'

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

type Props = {
  spaceCode: string
  initialHabits: Habit[]
}

export default function SpaceDashboardClient({ spaceCode, initialHabits }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true)
      const monthStr = format(currentMonth, 'yyyy-MM')
      try {
        const res = await fetch(`/api/spaces/${spaceCode}/entries?month=${monthStr}`)
        if (res.ok) {
          const data = await res.json()
          setEntries(data)
        }
      } catch (error) {
        console.error('Failed to fetch entries', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntries()
  }, [spaceCode, currentMonth])

  const addHabit = async (name: string) => {
    if (!name.trim()) return false
    try {
      const res = await fetch(`/api/spaces/${spaceCode}/habits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      if (res.ok) {
        const newHabit = await res.json()
        setHabits([...habits, newHabit])
        setSelectedHabitId(newHabit.id)
        return true
      }
    } catch (error) {
      console.error('Failed to add habit', error)
    }
    return false
  }

  const toggleArchiveHabit = async (habitId: string, currentArchived: boolean) => {
    try {
      const res = await fetch(`/api/spaces/${spaceCode}/habits/${habitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: !currentArchived })
      })
      if (res.ok) {
        setHabits(habits.map(h => h.id === habitId ? { ...h, archived: !currentArchived } : h))
        if (!currentArchived && selectedHabitId === habitId) {
          setSelectedHabitId(null)
        }
      }
    } catch (error) {
      console.error('Failed to archive habit', error)
    }
  }

  const upsertEntry = async (habitId: string, value: number) => {
    const today = startOfDay(new Date()).toISOString()
    const existingIndex = entries.findIndex(e => e.habitId === habitId && isSameDay(parseISO(e.date), new Date()))
    
    let newEntries = [...entries]
    if (existingIndex >= 0) {
      newEntries[existingIndex] = { ...newEntries[existingIndex], value }
    } else {
      newEntries.push({ id: `temp-${Date.now()}`, habitId, date: today, value })
    }
    setEntries(newEntries)

    try {
      const res = await fetch(`/api/spaces/${spaceCode}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, value })
      })
      if (!res.ok) {
        console.error('Failed to save entry')
      }
    } catch (error) {
      console.error('Failed to save entry', error)
    }
  }

  return (
    <main className="space-y-[80px]">
      <section>
        <HabitGrid 
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          habits={habits}
          entries={entries}
          isLoading={isLoading}
          addHabit={addHabit}
          toggleArchiveHabit={toggleArchiveHabit}
          upsertEntry={upsertEntry}
          selectedHabitId={selectedHabitId}
          setSelectedHabitId={setSelectedHabitId}
        />
      </section>
      
      <section>
        <ProgressCharts 
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          habits={habits}
          entries={entries}
          isLoading={isLoading}
          selectedHabitId={selectedHabitId}
        />
      </section>
    </main>
  )
}
