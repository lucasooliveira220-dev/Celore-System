'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, LogOut, ChevronDown, Shield } from 'lucide-react'

const CRUMBS: Record<string, string> = {
  '/estoque': 'Mercadorias / Peças',
  '/movimentacao': 'Mercadorias / Movimentação',
  '/requisicoes': 'Mercadorias / Requisições',
  '/veiculos': 'Veículos / Catálogo',
  '/estoque-veiculos': 'Veículos / Estoque',
  '/vendas': 'Veículos / Vendas',
  '/simulacao': 'Veículos / Simulação de Venda',
  '/oficina': 'Oficina / Ordens de Serviço',
  '/agendamentos': 'Oficina / Agendamentos',
  '/revisoes': 'Oficina / Revisões',
  '/garantias': 'Oficina / Garantias',
  '/clientes': 'Clientes',
  '/financeiro': 'Financeiro',
  '/notas-fiscais': 'Financeiro / Notas Fiscais',
  '/relatorios': 'Relatórios',
  '/config': 'Configurações',
}

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador', salesperson: 'Vendedor', mechanic: 'Mecânico',
  billing: 'Faturamento', stock: 'Estoque',
}

type User = { name: string; username: string; role: string }

export default function Topbar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const crumb =
    Object.entries(CRUMBS)
      .filter(([href]) => pathname === href || pathname.startsWith(href + '/') || pathname.startsWith(href))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? 'Início'

  const initials = user.name.split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase()

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-[14px] px-[34px] pt-5">
      <div className="text-[13.5px] font-medium text-muted-foreground">
        <span className="font-semibold text-primary">Celore DMS</span> &nbsp;/&nbsp; {crumb}
      </div>
      <div className="flex-1" />
      <button className="relative grid h-10 w-10 place-items-center rounded-[11px] border border-border bg-card shadow-sm">
        <Bell size={17} />
        <span className="absolute -right-1 -top-1 grid h-[17px] min-w-[17px] place-items-center rounded-[9px] border-2 border-background bg-primary px-1 text-[10px] font-bold text-white">2</span>
      </button>

      {/* usuário + menu de logout */}
      <div className="relative" ref={ref}>
        <button onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-[9px] rounded-[11px] border border-border bg-card py-[5px] pl-[6px] pr-3 shadow-sm transition hover:bg-[#FDF8F2]">
          <div className="grid h-[30px] w-[30px] place-items-center rounded-full text-xs font-semibold text-white" style={{ background: 'linear-gradient(150deg, #FF810F, #E25812)' }}>{initials}</div>
          <span className="text-[13px] font-semibold">{user.name.split(' ')[0]} {user.name.split(' ')[1]?.[0] ? user.name.split(' ')[1][0] + '.' : ''}</span>
          <ChevronDown size={15} className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[240px] overflow-hidden rounded-[14px] border border-border bg-card shadow-[0_16px_40px_-16px_rgba(28,25,23,0.4)]">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <div className="grid h-11 w-11 place-items-center rounded-full text-sm font-semibold text-white" style={{ background: 'linear-gradient(150deg, #FF810F, #E25812)' }}>{initials}</div>
              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">@{user.username}</div>
              </div>
            </div>
            <div className="border-b border-border px-4 py-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E3] px-[11px] py-1 text-xs font-semibold text-[#E25812]">
                <Shield size={12} /> {ROLE_LABEL[user.role] ?? user.role}
              </span>
            </div>
            <button onClick={logout} className="flex w-full items-center gap-2.5 px-4 py-3 text-[13.5px] font-semibold text-[#DC2626] transition hover:bg-[#FDECEC]">
              <LogOut size={16} /> Sair
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
