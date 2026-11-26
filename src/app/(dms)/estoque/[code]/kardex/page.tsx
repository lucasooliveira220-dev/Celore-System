'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Package, Check, CircleDollarSign, Boxes } from 'lucide-react'

type Movement = {
  date: string
  type: 'in' | 'out' | 'adjust'
  quantity: number
  balance: number
}
type Part = {
  code: string
  description: string
  category: string
  price: number
  minStock: number
  onHand: number
}

const brl = (n: number) =>
  'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtDate = (d: string) => new Date(d).toLocaleDateString('pt-BR')

function TypePill({ type }: { type: Movement['type'] }) {
  const map = {
    in: { txt: 'Entrada', cls: 'bg-[#E9F7EE] text-[#16A34A]' },
    out: { txt: 'Saída', cls: 'bg-[#FDECEC] text-[#DC2626]' },
    adjust: { txt: 'Ajuste', cls: 'bg-[#FEF4E0] text-[#B7791F]' },
  }[type]
  return <span className={`inline-block rounded-full px-[11px] py-1 text-xs font-semibold ${map.cls}`}>{map.txt}</span>
}

function Stat({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string; tone?: 'good' }) {
  return (
    <div className="flex items-center gap-[14px] rounded-[14px] border border-border bg-card px-[18px] py-4 shadow-sm">
      <div className={`grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-[11px] ${tone === 'good' ? 'bg-[#E9F7EE] text-[#16A34A]' : 'bg-[#FFF3E3] text-primary'}`}>
        <Icon size={21} />
      </div>
      <div>
        <div className="text-[12.5px] font-medium text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-[Poppins] text-[22px] font-bold tracking-tight">{value}</div>
      </div>
    </div>
  )
}

export default function KardexPage() {
  const params = useParams<{ code: string }>()
  const code = decodeURIComponent(params.code)

  const [part, setPart] = useState<Part | null>(null)
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/parts/${encodeURIComponent(code)}/kardex`)
      .then((r) => {
        if (!r.ok) throw new Error('Falha ao carregar a Kardex')
        return r.json()
      })
      .then((data) => {
        setPart(data.part)
        setMovements(data.movements)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [code])

  const finalBalance = movements.length ? movements[movements.length - 1].balance : part?.onHand ?? 0

  return (
    <>
      {/* cabeçalho */}
      <div className="mb-[22px] mt-1.5 flex items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Ficha Kardex</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Extrato de movimentações com saldo acumulado{part ? ` — ${part.description}` : ''}.
          </p>
        </div>
        <div className="flex-1" />
        <Link
          href="/estoque"
          className="flex items-center gap-2 rounded-[11px] border border-border bg-card px-4 py-[10px] text-[13.5px] font-semibold text-[#E25812] shadow-sm transition hover:border-[#FBD9BC] hover:bg-[#FDF8F2]"
        >
          <ChevronLeft size={15} /> Voltar ao estoque
        </Link>
      </div>

      {/* indicadores */}
      {part && (
        <div className="mb-[22px] grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={Package} label="Peça" value={part.code} />
          <Stat icon={Check} label="Saldo atual" value={String(part.onHand)} tone="good" />
          <Stat icon={CircleDollarSign} label="Preço venda" value={brl(part.price)} />
          <Stat icon={Boxes} label="Estoque mínimo" value={String(part.minStock)} />
        </div>
      )}

      {/* tabela */}
      <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FDF8F2]">
              <th className="border-b border-border px-[18px] py-[15px] text-left text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Data</th>
              <th className="border-b border-border px-[18px] py-[15px] text-center text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Movimento</th>
              <th className="border-b border-border px-[18px] py-[15px] text-right text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Qtd</th>
              <th className="border-b border-border px-[18px] py-[15px] text-right text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Carregando movimentações...</td></tr>
            )}
            {error && !loading && (
              <tr><td colSpan={4} className="px-[18px] py-10 text-center text-sm text-[#DC2626]">{error}.</td></tr>
            )}
            {!loading && !error && movements.map((m, i) => (
              <tr key={i} className="border-t border-border transition hover:bg-[#FDF8F2]">
                <td className="px-[18px] py-[13px] text-[13.5px]">{fmtDate(m.date)}</td>
                <td className="px-[18px] py-[13px] text-center"><TypePill type={m.type} /></td>
                <td className={`px-[18px] py-[13px] text-right font-[Poppins] text-[15px] font-bold ${m.quantity < 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                  {m.quantity > 0 ? '+' : ''}{m.quantity}
                </td>
                <td className="px-[18px] py-[13px] text-right font-[Poppins] text-[15px] font-bold">{m.balance}</td>
              </tr>
            ))}
            {!loading && !error && movements.length === 0 && (
              <tr><td colSpan={4} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Nenhuma movimentação registrada.</td></tr>
            )}
          </tbody>
          {!loading && !error && movements.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-border bg-[#FDF8F2]">
                <td colSpan={3} className="px-[18px] py-[13px] font-[Poppins] text-sm font-bold">Saldo final</td>
                <td className="px-[18px] py-[13px] text-right font-[Poppins] text-sm font-bold">{finalBalance}</td>
              </tr>
            </tfoot>
          )}
        </table>
        <div className="flex items-center justify-between border-t border-border bg-[#FDF8F2] px-[18px] py-[13px] text-[13px] text-muted-foreground">
          <span>{movements.length} movimentações</span>
          <span>view <b>KardexView</b> (window function)</span>
        </div>
      </div>
    </>
  )
}
