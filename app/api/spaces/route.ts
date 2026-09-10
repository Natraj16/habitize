import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateCode() {
  return Math.random().toString(36).substring(2, 8)
}

export async function POST() {
  let space = null;
  let retries = 3;
  
  while (retries > 0 && !space) {
    try {
      space = await prisma.space.create({
        data: {
          code: generateCode(),
        },
      })
    } catch (error) {
      retries--;
    }
  }

  if (!space) {
    return NextResponse.json({ error: 'Failed to create space' }, { status: 500 })
  }

  return NextResponse.json({ code: space.code })
}
