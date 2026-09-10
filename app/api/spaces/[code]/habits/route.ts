import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const { name } = await request.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const habit = await prisma.habit.create({
      data: {
        name,
        spaceId: space.id
      }
    })

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Failed to create habit:', error)
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 })
  }
}
