'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Package, Wrench, Users, CircleDollarSign,
  BarChart3, Settings, ChevronDown, Bike,
} from 'lucide-react'

type Child = { label: string; href?: string; header?: boolean } // header = subtítulo divisor; sem href = "em breve"
type Item = { key: string; label: string; href?: string; icon: React.ElementType; children?: Child[] }

const ITEMS: Item[] = [
  { key: 'inicio', label: 'Início', href: '/', icon: Home },
  { key: 'oficina', label: 'Oficina', icon: Wrench, children: [
    { label: 'Ordens de Serviço', href: '/oficina' },
    { label: 'Agendamentos', href: '/agendamentos' },
    { label: 'Revisões', href: '/revisoes' },
    { label: 'Garantias', href: '/garantias' },
    { label: 'Checklist' },
  ] },
  { key: 'mercadorias', label: 'Mercadorias', icon: Package, children: [
    { label: 'Peças', href: '/estoque' },
    { label: 'Movimentação', href: '/movimentacao' },
    { label: 'Requisições', href: '/requisicoes' },
    { label: 'Catálogo' },
  ] },
  { key: 'veiculos', label: 'Veículos', icon: Bike, children: [
    { label: 'Catálogo', href: '/veiculos' },
    { label: 'Estoque de Veículos', href: '/estoque-veiculos' },
    { label: 'Vendas', href: '/vendas' },
    { label: 'Simulação de Venda', href: '/simulacao' },
  ] },
  { key: 'clientes', label: 'Clientes', href: '/clientes', icon: Users },
  { key: 'financeiro', label: 'Financeiro', icon: CircleDollarSign, children: [
    { label: 'Extrato de Contas', href: '/financeiro' },
    { label: 'Notas Fiscais', href: '/notas-fiscais' },
  ] },
  { key: 'relatorios', label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { key: 'config', label: 'Configurações', icon: Settings, children: [
    { label: 'Usuários', href: '/config' },
    { label: 'Parâmetros' },
  ] },
]

function isActive(href: string | undefined, pathname: string) {
  if (!href) return false
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
}

export default function Sidebar() {
  const pathname = usePathname()

  // grupo aberto por padrão = o que contém a rota atual
  const initialOpen = ITEMS.find((it) => it.children?.some((c) => isActive(c.href, pathname)))?.key ?? null
  const [open, setOpen] = useState<string | null>(initialOpen)

  return (
    <aside
      className="sticky top-0 flex h-screen w-[250px] flex-shrink-0 flex-col overflow-y-auto px-[18px] pt-[26px] text-white"
      style={{ background: 'linear-gradient(178deg, #FB7A18, #E25010)' }}
    >
      <div className="flex items-center gap-3 px-1.5 pb-8">
        <svg width="36" height="40" viewBox="0 0 44 48" fill="none">
          <path d="M22 2 L40 12 V36 L22 46 L4 36 V12 Z" stroke="#fff" strokeWidth="3.2" strokeLinejoin="round" />
          <path d="M18.5 18.5 a7.5 8 0 1 0 0 11" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M25 15 V30 H31 l-4.5 6" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <div className="text-[22px] font-bold leading-none tracking-tight">CeLore</div>
          <div className="mt-[3px] text-[11px] font-medium text-[#FFD236]">Celore DMS</div>
        </div>
      </div>

      <nav className="flex flex-col gap-[3px] pb-6">
        {ITEMS.map((it) => {
          const Icon = it.icon
          const rowBase = 'flex items-center gap-[13px] rounded-[11px] px-[14px] py-[11px] text-sm font-medium transition'

          // item simples (sem filhos)
          if (!it.children) {
            const active = isActive(it.href, pathname)
            return (
              <Link key={it.key} href={it.href!} className={`${rowBase} ${active ? 'bg-[#FF810F] font-semibold shadow-[0_6px_16px_-6px_rgba(0,0,0,0.35)]' : 'opacity-90 hover:bg-white/10 hover:opacity-100'}`}>
                <Icon size={18} strokeWidth={2} /> {it.label}
              </Link>
            )
          }

          // grupo com accordion
          const groupActive = it.children.some((c) => isActive(c.href, pathname))
          const isOpen = open === it.key
          return (
            <div key={it.key}>
              <button
                onClick={() => setOpen(isOpen ? null : it.key)}
                className={`${rowBase} w-full ${groupActive && !isOpen ? 'bg-white/10' : ''} opacity-90 hover:bg-white/10 hover:opacity-100`}
              >
                <Icon size={18} strokeWidth={2} /> {it.label}
                <ChevronDown size={15} className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="mb-1 ml-[26px] mt-[3px] flex flex-col gap-[2px] border-l border-white/25 pl-[10px]">
                  {it.children.map((c) => {
                    if (c.header) {
                      return (
                        <div key={c.label} className="mt-2 px-[12px] pb-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
                          {c.label}
                        </div>
                      )
                    }
                    const active = isActive(c.href, pathname)
                    if (!c.href) {
                      return (
                        <span key={c.label} title="Em breve" className="cursor-default rounded-[9px] px-[12px] py-[8px] text-[13px] font-medium opacity-45">
                          {c.label}
                        </span>
                      )
                    }
                    return (
                      <Link key={c.label} href={c.href} className={`rounded-[9px] px-[12px] py-[8px] text-[13px] font-medium transition ${active ? 'bg-[#FF810F] font-semibold' : 'opacity-85 hover:bg-white/10 hover:opacity-100'}`}>
                        {c.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
