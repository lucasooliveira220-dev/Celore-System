'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Wrench, Clock, ShieldCheck, Package, FileText, Calendar, BookOpen,
  ClipboardList, Boxes, ShoppingCart, CalendarCheck, FileCode, ArrowRightLeft,
  Receipt, BarChart3, ScrollText, CircleDollarSign, Users, Star, Plus, X,
} from 'lucide-react'

type Fn = { key: string; label: string; icon: React.ElementType; route?: string }

// Catálogo de funções. route definido = tela pronta (navega); senão, "em breve".
const FUNCS: Fn[] = [
  { key: 'os',      label: 'Ordem de Serviço',  icon: Wrench },
  { key: 'rev',     label: 'Revisões',          icon: Clock },
  { key: 'gar',     label: 'Garantia',          icon: ShieldCheck },
  { key: 'pecas',   label: 'Estoque de Peças',  icon: Package, route: '/estoque' },
  { key: 'orc',     label: 'Orçamento',         icon: FileText },
  { key: 'cal',     label: 'Agendamento',       icon: Calendar },
  { key: 'cat',     label: 'Catálogo de Peças', icon: BookOpen },
  { key: 'req',     label: 'Requisição',        icon: ClipboardList },
  { key: 'merc',    label: 'Mercadoria',        icon: Boxes },
  { key: 'pc',      label: 'Pedido de Compra',  icon: ShoppingCart },
  { key: 'reserva', label: 'Reserva',           icon: CalendarCheck },
  { key: 'xml',     label: 'Integração XML',    icon: FileCode },
  { key: 'mov',     label: 'Movimentação',      icon: ArrowRightLeft },
  { key: 'nf',      label: 'Nota Fiscal',       icon: Receipt },
  { key: 'fat',     label: 'Faturamento',       icon: BarChart3 },
  { key: 'kardex',  label: 'Ficha Kardex',      icon: ScrollText },
  { key: 'ext',     label: 'Extrato de Contas', icon: FileText },
  { key: 'fin',     label: 'Ficha Financeira',  icon: CircleDollarSign },
  { key: 'pessoa',  label: 'Pessoa / Cliente',  icon: Users },
]
const BY_KEY = Object.fromEntries(FUNCS.map((f) => [f.key, f]))

export default function InicioPage() {
  const router = useRouter()
  const [favs, setFavs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((keys: string[]) => setFavs(keys))
      .catch(() => setFavs([]))
      .finally(() => setLoading(false))
  }, [])

  function flash(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 1600)
  }

  async function toggle(key: string) {
    const isFav = favs.includes(key)
    // otimista
    setFavs((prev) => (isFav ? prev.filter((k) => k !== key) : [...prev, key]))
    try {
      await fetch('/api/favorites', {
        method: isFav ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })
    } catch {
      // reverte em caso de falha
      setFavs((prev) => (isFav ? [...prev, key] : prev.filter((k) => k !== key)))
      flash('Não foi possível salvar. Tente de novo.')
    }
  }

  function openShortcut(f: Fn) {
    if (f.route) router.push(f.route)
    else flash('Em breve: ' + f.label)
  }

  const favList = favs.map((k) => BY_KEY[k]).filter(Boolean)

  return (
    <>
      {/* meus atalhos */}
      <div className="mb-[15px] mt-1.5 flex items-center gap-[10px]">
        <Star size={20} className="fill-[#F5A81C] text-[#F5A81C]" />
        <h2 className="text-base font-semibold">Meus atalhos</h2>
        <span className="rounded-full bg-[#FFF3E3] px-[9px] py-0.5 text-xs font-medium text-muted-foreground">{favList.length}</span>
        <button
          onClick={() => setModal(true)}
          className="ml-auto flex items-center gap-2 rounded-[10px] border border-border bg-card px-[14px] py-[9px] text-[13px] font-semibold text-[#E25812] shadow-sm transition hover:border-[#FBD9BC] hover:bg-[#FDF8F2]"
        >
          <Plus size={15} /> Personalizar
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Carregando atalhos...</div>
      ) : favList.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border px-5 py-10 text-center text-muted-foreground">
          <Star size={38} className="mx-auto mb-2.5 text-[#B4ACA6]" />
          <div>Você ainda não fixou nenhum atalho.<br /><b className="text-foreground">Personalize</b> e escolha as funções que mais usa.</div>
          <button onClick={() => setModal(true)} className="mx-auto mt-4 flex items-center gap-2 rounded-[10px] bg-primary px-4 py-[9px] text-[13px] font-semibold text-white hover:bg-[#E25812]">
            Escolher funções
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(158px,1fr))] gap-[14px]">
          {favList.map((f) => (
            <div
              key={f.key}
              onClick={() => openShortcut(f)}
              className="group relative flex min-h-[104px] cursor-pointer flex-col gap-3 rounded-[14px] border border-border bg-card p-[18px_16px] shadow-sm transition hover:-translate-y-0.5 hover:border-[#FBD9BC] hover:shadow-[0_10px_26px_-14px_rgba(226,88,18,0.32)]"
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggle(f.key) }}
                title="Remover dos atalhos"
                className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-lg hover:bg-[#FFF3E3]"
              >
                <Star size={17} className="fill-[#F5A81C] text-[#F5A81C]" />
              </button>
              <div className="grid h-10 w-10 place-items-center rounded-[11px] bg-[#FFF3E3] text-primary">
                <f.icon size={20} />
              </div>
              <div className="text-[13.5px] font-semibold leading-tight">{f.label}</div>
            </div>
          ))}
          {/* adicionar */}
          <button
            onClick={() => setModal(true)}
            className="flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-border text-muted-foreground transition hover:border-primary hover:bg-[#FDF8F2] hover:text-primary"
          >
            <div className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-[#FFF3E3] text-primary"><Plus size={20} /></div>
            <div className="text-[13px] font-semibold">Adicionar atalho</div>
          </button>
        </div>
      )}

      {/* modal seletor */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,25,23,0.42)] p-6 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setModal(false) }}
        >
          <div className="flex max-h-[86vh] w-full max-w-[840px] flex-col overflow-hidden rounded-[20px] bg-background shadow-2xl">
            <div className="flex items-start gap-[14px] border-b border-border bg-card px-6 py-[18px]">
              <div className="grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-xl bg-[#FFF3E3] text-primary"><Package size={21} /></div>
              <div>
                <h2 className="text-[18px] font-bold">Todas as funções</h2>
                <p className="mt-[3px] text-[13px] text-muted-foreground">Marque a estrela das funções que quer fixar na tela inicial.</p>
              </div>
              <button onClick={() => setModal(false)} className="ml-auto grid h-9 w-9 place-items-center rounded-[10px] border border-border bg-card text-muted-foreground hover:bg-[#FDF8F2] hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="overflow-auto px-6 py-[22px]">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(158px,1fr))] gap-[14px]">
                {FUNCS.map((f) => {
                  const on = favs.includes(f.key)
                  return (
                    <div
                      key={f.key}
                      onClick={() => toggle(f.key)}
                      className="relative flex min-h-[104px] cursor-pointer flex-col gap-3 rounded-[14px] border border-border bg-card p-[18px_16px] shadow-sm transition hover:-translate-y-0.5 hover:border-[#FBD9BC]"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle(f.key) }}
                        className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-lg hover:bg-[#FFF3E3]"
                      >
                        <Star size={17} className={on ? 'fill-[#F5A81C] text-[#F5A81C]' : 'text-[#B4ACA6]'} />
                      </button>
                      <div className="grid h-10 w-10 place-items-center rounded-[11px] bg-[#FFF3E3] text-primary"><f.icon size={20} /></div>
                      <div className="text-[13.5px] font-semibold leading-tight">{f.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[99] -translate-x-1/2 rounded-xl bg-[#1C1917] px-5 py-[11px] text-[13px] font-semibold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </>
  )
}
