import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const code = (await params).code

  try {
    const space = await prisma.space.findUnique({
      where: { code },
      include: {
        habits: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 })
    }

    return NextResponse.json(space)
  } catch (error) {
    console.error('Failed to fetch space:', error)
    return NextResponse.json({ error: 'Failed to fetch space' }, { status: 500 })
  }
}
