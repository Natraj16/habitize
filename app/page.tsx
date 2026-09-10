'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

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
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 blob-moss rounded-[1440px] opacity-60 -z-10 mix-blend-multiply"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 blob-fuchsia rounded-[1440px] opacity-40 -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[30rem] h-[30rem] blob-yellow rounded-[1440px] opacity-50 -z-10 mix-blend-multiply"></div>
      
      <div className="max-w-xl w-full space-y-12 text-center bg-[var(--color-soft-meadow)]/80 backdrop-blur-xl p-12 rounded-[24px] border border-white/50 shadow-sm relative z-10">
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
              className="flex-1 w-full bg-white border border-[var(--color-slate)]/30 rounded-[1440px] px-6 py-4 text-[16px] text-[var(--color-deep-ink)] placeholder-[var(--color-slate)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-deep-ink)] transition-shadow shadow-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-[var(--color-hi-yellow)] hover:opacity-90 text-[var(--color-deep-ink)] font-medium text-[16px] rounded-[1440px] transition-all duration-300 ease-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[var(--color-deep-ink)] shadow-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[var(--color-deep-ink)]/30 border-t-[var(--color-deep-ink)] rounded-[1440px] animate-spin" />
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
