'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Lock, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        throw new Error(j.error || 'Falha no login')
      }
      router.push('/')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6"
      style={{ backgroundImage: 'radial-gradient(at 0% 0%, oklch(0.80 0.13 55 / 0.12) 0px, transparent 55%), radial-gradient(at 100% 100%, oklch(0.85 0.11 75 / 0.10) 0px, transparent 55%)' }}>
      <div className="w-full max-w-[400px]">
        {/* marca */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 grid h-16 w-16 place-items-center rounded-2xl text-white shadow-[0_12px_30px_-10px_rgba(226,88,18,0.6)]" style={{ background: 'linear-gradient(150deg, #FF810F, #E25010)' }}>
            <svg width="34" height="38" viewBox="0 0 44 48" fill="none">
              <path d="M22 2 L40 12 V36 L22 46 L4 36 V12 Z" stroke="#fff" strokeWidth="3.2" strokeLinejoin="round" />
              <path d="M18.5 18.5 a7.5 8 0 1 0 0 11" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M25 15 V30 H31 l-4.5 6" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-[Poppins] text-[26px] font-bold tracking-tight">CeLore <span className="text-primary">DMS</span></h1>
          <p className="mt-1 text-sm text-muted-foreground">Acesse o sistema de gestão</p>
        </div>

        {/* card de login */}
        <form onSubmit={submit} className="rounded-[20px] border border-border bg-card p-7 shadow-[0_20px_50px_-24px_rgba(28,25,23,0.35)]">
          <div className="mb-4">
            <label className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold"><User size={15} className="text-primary" /> Usuário</label>
            <input autoFocus value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ex: igor.bernardino"
              className="w-full rounded-[11px] border border-border bg-card px-4 py-[12px] text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
          </div>
          <div className="mb-5">
            <label className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold"><Lock size={15} className="text-primary" /> Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full rounded-[11px] border border-border bg-card px-4 py-[12px] text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
          </div>

          {error && <div className="mb-4 rounded-[11px] bg-[#FDECEC] px-4 py-3 text-[13px] font-medium text-[#DC2626]">{error}</div>}

          <button type="submit" disabled={loading || !username || !password}
            className="flex w-full items-center justify-center gap-2 rounded-[11px] bg-primary py-[13px] text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(226,88,18,0.6)] transition hover:bg-[#E25812] disabled:opacity-50">
            <LogIn size={17} /> {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">Celore Tech Solution · Celore DMS</p>
      </div>
    </div>
  )
}
