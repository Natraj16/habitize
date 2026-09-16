import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, parseISO, isValid, format } from 'date-fns'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const code = (await params).code
  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'Invalid month format, expected YYYY-MM' }, { status: 400 })
  }

  try {
    const space = await prisma.space.findUnique({
      where: { code }
    })

    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 })
    }

    // Parse the month to get date range
    const parsedDate = parseISO(`${month}-01`)
    if (!isValid(parsedDate)) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
    }

    const start = startOfMonth(parsedDate)
    const end = endOfMonth(parsedDate)

    const entries = await prisma.entry.findMany({
      where: {
        habit: {
          spaceId: space.id
        },
        date: {
          gte: start,
          lte: end
        }
      }
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Failed to fetch entries:', error)
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const code = (await params).code

  try {
    const space = await prisma.space.findUnique({
      where: { code }
    })

    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 })
    }

    const { habitId, value } = await request.json()

    if (!habitId || typeof value !== 'number' || value < 1 || value > 10) {
      return NextResponse.json({ error: 'Invalid payload, expected habitId and value (1-10)' }, { status: 400 })
    }

    // Verify habit belongs to this space
    const habit = await prisma.habit.findUnique({
      where: { id: habitId }
    })

    if (!habit || habit.spaceId !== space.id) {
      return NextResponse.json({ error: 'Habit not found in this space' }, { status: 404 })
    }

    // Rule 2: The server sets date to the server's current date, discarding time
    const today = new Date()
    today.setHours(0, 0, 0, 0) // normalized to start of day in server timezone

    const entry = await prisma.entry.upsert({
      where: {
        habitId_date: {
          habitId: habitId,
          date: today
        }
      },
      update: {
        value
      },
      create: {
        habitId,
        date: today,
        value
      }
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Failed to save entry:', error)
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const code = (await params).code
  const { searchParams } = new URL(request.url)
  const habitId = searchParams.get('habitId')

  if (!habitId) {
    return NextResponse.json({ error: 'Missing habitId' }, { status: 400 })
  }

  try {
    const space = await prisma.space.findUnique({
      where: { code }
    })

    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 })
    }

    const habit = await prisma.habit.findUnique({
      where: { id: habitId }
    })

    if (!habit || habit.spaceId !== space.id) {
      return NextResponse.json({ error: 'Habit not found in this space' }, { status: 404 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    await prisma.entry.deleteMany({
      where: {
        habitId: habitId,
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete entry:', error)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}

