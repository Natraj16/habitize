'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import ThemeToggle from '@/app/components/ThemeToggle'

export default function LandingPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const goToSpace = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    
    setIsLoading(true)
    // The space dashboard will auto-create the space if it doesn't exist
    router.push(`/space/${encodeURIComponent(code.trim().toLowerCase())}`)
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-canvas)] text-[var(--color-deep-ink)] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Theme Toggle in Top-Right Corner */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 blob-moss rounded-[1440px] -z-10 mix-blend-multiply dark:mix-blend-screen"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 blob-fuchsia rounded-[1440px] -z-10 mix-blend-multiply dark:mix-blend-screen"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[30rem] h-[30rem] blob-yellow rounded-[1440px] -z-10 mix-blend-multiply dark:mix-blend-screen"></div>
      
      <div className="max-w-xl w-full space-y-12 text-center bg-[var(--color-soft-meadow)]/80 backdrop-blur-xl p-12 rounded-[24px] border border-[var(--color-card-border)] shadow-sm relative z-10">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight font-hedvig text-[var(--color-deep-ink)]">
            habitize
          </h1>
          <p className="text-lg text-[var(--color-slate)] font-medium max-w-sm mx-auto">
            Sunlit, private habit tracking. Type a secret code to open or create your space.
          </p>
        </div>

        <div className="pt-8 flex flex-col items-center gap-4">
          <form onSubmit={goToSpace} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="my-secret-space"
              className="flex-1 w-full bg-[var(--color-input-bg)] border border-[var(--color-slate)]/30 rounded-[1440px] px-6 py-4 text-[16px] text-[var(--color-deep-ink)] placeholder-[var(--color-slate)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-deep-ink)] transition-shadow shadow-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-[var(--color-hi-yellow)] hover:opacity-90 text-[#130e30] font-medium text-[16px] rounded-[1440px] transition-all duration-300 ease-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[var(--color-deep-ink)] shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#130e30]/30 border-t-[#130e30] rounded-[1440px] animate-spin" />
              ) : (
                <>
                  <span>Go</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
          
          <p className="text-[12px] uppercase tracking-widest font-semibold text-[var(--color-slate)] mt-2">
            No signup. No passwords.
          </p>
        </div>
      </div>
    </div>
  )
}
