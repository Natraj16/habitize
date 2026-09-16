import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SpaceDashboardClient from '@/app/components/SpaceDashboardClient'
import ThemeToggle from '@/app/components/ThemeToggle'

export default async function SpacePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const code = (await params).code

  let space = await prisma.space.findUnique({
    where: { code },
    include: {
      habits: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!space) {
    // Auto-create the space if it doesn't exist, like dontpad
    space = await prisma.space.create({
      data: { code },
      include: {
        habits: true,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-deep-ink)] selection:bg-[var(--color-hi-yellow)] selection:text-[#130e30]">
      
      {/* Navigation Bar */}
      <nav className="bg-[var(--color-soft-meadow)] border-b border-[var(--color-card-border)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-hedvig text-2xl font-bold text-[var(--color-deep-ink)] tracking-tight">
            habitize
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-slate)] hidden sm:block">
            Your Secret Code
          </span>
          <div className="bg-[var(--color-input-bg)] border border-[var(--color-slate)]/20 px-3 py-1 rounded-[1440px] text-[14px] font-medium text-[var(--color-deep-ink)]">
            {code}
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto p-6 md:p-12 space-y-[80px]">
        
        <header className="space-y-4">
          <h1 className="font-hedvig text-5xl md:text-[64px] font-bold leading-none tracking-tight text-[var(--color-deep-ink)]">
            Your habits, illuminated.
          </h1>
          <p className="text-[var(--color-slate)] text-[18px] max-w-2xl">
            Track your consistency day by day. Every action counts towards your overall progress.
          </p>
        </header>

        <SpaceDashboardClient spaceCode={code} initialHabits={space.habits} />
      </div>
    </div>
  )
}
