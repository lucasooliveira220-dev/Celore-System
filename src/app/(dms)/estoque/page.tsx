'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Package, Search, Plus, TriangleAlert, Check, Sheet, CircleDollarSign, ScrollText,
} from 'lucide-react'

type Part = {
  id: number
  code: string
  description: string
  category: string
  unit: string
  price: number
  minStock: number
  onHand: number
}

const brl = (n: number) =>
  'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function Situacao({ onHand, min }: { onHand: number; min: number }) {
  if (onHand === 0)
    return <span className="inline-flex items-center gap-1 rounded-full bg-[#F3ECE4] px-[11px] py-1 text-xs font-semibold text-[#905B31]">Esgotado</span>
  if (onHand < min)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#FDECEC] px-[11px] py-1 text-xs font-semibold text-[#DC2626]">
        <TriangleAlert size={12} /> Abaixo do mínimo
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F7EE] px-[11px] py-1 text-xs font-semibold text-[#16A34A]">
      <Check size={12} /> OK
    </span>
  )
}

function Stat({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string; tone?: 'warn' }) {
  return (
    <div className="flex items-center gap-[14px] rounded-[14px] border border-border bg-card px-[18px] py-4 shadow-sm">
      <div className={`grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-[11px] ${tone === 'warn' ? 'bg-[#FDECEC] text-[#DC2626]' : 'bg-[#FFF3E3] text-primary'}`}>
        <Icon size={21} />
      </div>
      <div>
        <div className="text-[12.5px] font-medium text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-[Poppins] text-[22px] font-bold tracking-tight">{value}</div>
      </div>
    </div>
  )
}

export default function EstoquePage() {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    fetch('/api/parts')
      .then((r) => {
        if (!r.ok) throw new Error('Falha ao carregar peças')
        return r.json()
      })
      .then((data: Part[]) => setParts(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return parts
    return parts.filter(
      (p) => p.description.toLowerCase().includes(t) || p.code.toLowerCase().includes(t),
    )
  }, [parts, q])

  const stats = useMemo(() => {
    const totalUnits = parts.reduce((s, p) => s + p.onHand, 0)
    const belowMin = parts.filter((p) => p.onHand < p.minStock).length
    const stockValue = parts.reduce((s, p) => s + p.onHand * Number(p.price), 0)
    return { count: parts.length, totalUnits, belowMin, stockValue }
  }, [parts])

  return (
    <>
      {/* cabeçalho */}
      <div className="mb-[22px] mt-1.5 flex items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Estoque de Peças</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Catálogo e saldo em tempo real, do livro-razão de movimentações.
          </p>
        </div>
        <div className="flex-1" />
        <button className="flex items-center gap-2 rounded-[11px] bg-primary px-[18px] py-[11px] text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(226,88,18,0.5)] transition hover:bg-[#E25812]">
          <Plus size={16} strokeWidth={2.2} /> Nova peça
        </button>
      </div>

      {/* indicadores */}
      <div className="mb-[22px] grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Package} label="Itens no catálogo" value={String(stats.count)} />
        <Stat icon={Sheet} label="Peças em estoque" value={String(stats.totalUnits)} />
        <Stat icon={TriangleAlert} label="Abaixo do mínimo" value={String(stats.belowMin)} tone="warn" />
        <Stat icon={CircleDollarSign} label="Valor em estoque" value={brl(stats.stockValue)} />
      </div>

      {/* busca */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] max-w-[420px] flex-1">
          <Search size={16} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por descrição ou código..."
            className="w-full rounded-[11px] border border-border bg-card py-[11px] pl-10 pr-[14px] text-sm shadow-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15"
          />
        </div>
      </div>

      {/* tabela */}
      <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FDF8F2]">
              {['Peça', 'Categoria', 'Preço venda', 'Saldo', 'Mínimo', 'Situação', 'Kardex'].map((h, i) => (
                <th
                  key={h}
                  className={`border-b border-border px-[18px] py-[15px] text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6] ${i >= 2 ? 'text-center' : 'text-left'} ${i === 2 ? '!text-right' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Carregando peças...</td></tr>
            )}
            {error && !loading && (
              <tr><td colSpan={7} className="px-[18px] py-10 text-center text-sm text-[#DC2626]">
                {error}. Confirme que o banco tem o schema e o seed do Celore carregados.
              </td></tr>
            )}
            {!loading && !error && filtered.map((p) => (
              <tr key={p.id} className="border-t border-border transition hover:bg-[#FDF8F2]">
                <td className="px-[18px] py-[13px]">
                  <div className="flex items-center gap-3">
                    <div className="grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-[10px] bg-[#FFF3E3] text-primary">
                      <Package size={19} />
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold">{p.description}</div>
                      <div className="mt-px text-xs text-[#B4ACA6]">{p.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-[18px] py-[13px]">
                  <span className="inline-block rounded-full bg-[#FFF3E3] px-[11px] py-1 text-xs font-semibold text-[#E25812]">{p.category}</span>
                </td>
                <td className="px-[18px] py-[13px] text-right font-[Poppins] text-[13.5px] font-semibold">{brl(p.price)}</td>
                <td className="px-[18px] py-[13px] text-center font-[Poppins] text-[15px] font-bold">{p.onHand}</td>
                <td className="px-[18px] py-[13px] text-center text-[#B4ACA6]">{p.minStock}</td>
                <td className="px-[18px] py-[13px] text-center"><Situacao onHand={p.onHand} min={p.minStock} /></td>
                <td className="px-[18px] py-[13px] text-center">
                  <Link
                    href={`/estoque/${encodeURIComponent(p.code)}/kardex`}
                    title="Ver Kardex"
                    className="inline-grid h-8 w-8 place-items-center rounded-[9px] border border-border bg-card text-muted-foreground transition hover:border-[#FBD9BC] hover:bg-[#FFF3E3] hover:text-primary"
                  >
                    <ScrollText size={15} />
                  </Link>
                </td>
              </tr>
            ))}
            {!loading && !error && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Nenhuma peça encontrada.</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-border bg-[#FDF8F2] px-[18px] py-[13px] text-[13px] text-muted-foreground">
          <span>Mostrando {filtered.length} de {parts.length} peças</span>
          <span>Saldo via <b>StockMovement</b> · view <b>PartStock</b></span>
        </div>
      </div>
    </>
  )
}
