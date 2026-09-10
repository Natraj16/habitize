import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ code: string; habitId: string }> }
) {
  const { code, habitId } = await params

  try {
    const space = await prisma.space.findUnique({
      where: { code }
    })

    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, archived } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (archived !== undefined) updateData.archived = archived

    // Ensure the habit belongs to the space before updating
    const existingHabit = await prisma.habit.findUnique({
      where: { id: habitId }
    })

    if (!existingHabit || existingHabit.spaceId !== space.id) {
      return NextResponse.json({ error: 'Habit not found in this space' }, { status: 404 })
    }

    const habit = await prisma.habit.update({
      where: { id: habitId },
      data: updateData
    })

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Failed to update habit:', error)
    return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 })
  }
}
