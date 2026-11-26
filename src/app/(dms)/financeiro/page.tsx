'use client'

import { useEffect, useMemo, useState } from 'react'
import { CircleDollarSign, TrendingUp, TrendingDown, TriangleAlert } from 'lucide-react'

type Entry = {
  id: number
  direction: 'receivable' | 'payable'
  amount: number
  dueDate: string
  paidDate: string | null
  status: 'open' | 'paid' | 'overdue' | 'cancelled'
  party: string | null
}
type Ledger = { id: number; name: string; openBalance: number; totalPaid: number }

const brl = (n: number | null) => (n == null ? '—' : 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
const fmtDate = (d: string) => (d ? new Date(d).toLocaleDateString('pt-BR') : '—')

const ST: Record<string, { label: string; cls: string }> = {
  paid: { label: 'Pago', cls: 'bg-[#E9F7EE] text-[#16A34A]' },
  open: { label: 'Aberto', cls: 'bg-[#FEF4E0] text-[#B7791F]' },
  overdue: { label: 'Vencido', cls: 'bg-[#FDECEC] text-[#DC2626]' },
  cancelled: { label: 'Cancelado', cls: 'bg-[#F3ECE4] text-[#905B31]' },
}

function Stat({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string; tone?: 'good' | 'warn' | 'bad' }) {
  const box = tone === 'good' ? 'bg-[#E9F7EE] text-[#16A34A]' : tone === 'warn' ? 'bg-[#FEF4E0] text-[#B7791F]' : tone === 'bad' ? 'bg-[#FDECEC] text-[#DC2626]' : 'bg-[#FFF3E3] text-primary'
  return (
    <div className="flex items-center gap-[14px] rounded-[14px] border border-border bg-card px-[18px] py-4 shadow-sm">
      <div className={`grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-[11px] ${box}`}><Icon size={21} /></div>
      <div><div className="text-[12.5px] font-medium text-muted-foreground">{label}</div><div className="mt-0.5 font-[Poppins] text-[20px] font-bold tracking-tight">{value}</div></div>
    </div>
  )
}

export default function FinanceiroPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [ledger, setLedger] = useState<Ledger[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'extrato' | 'ficha'>('extrato')

  useEffect(() => {
    fetch('/api/finance')
      .then((r) => { if (!r.ok) throw new Error('Falha ao carregar dados financeiros'); return r.json() })
      .then((d) => { setEntries(d.entries); setLedger(d.ledger) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const receivableOpen = entries.filter((e) => e.direction === 'receivable' && e.status === 'open').reduce((a, e) => a + Number(e.amount), 0)
    const payableOpen = entries.filter((e) => e.direction === 'payable' && e.status === 'open').reduce((a, e) => a + Number(e.amount), 0)
    const overdue = entries.filter((e) => e.status === 'overdue').reduce((a, e) => a + Number(e.amount), 0)
    return { receivableOpen, payableOpen, overdue }
  }, [entries])

  return (
    <>
      <div className="mb-[22px] mt-1.5">
        <h1 className="text-[28px] font-bold tracking-tight">Financeiro</h1>
        <p className="mt-1 text-sm text-muted-foreground">Contas a pagar e receber, e ficha financeira dos clientes.</p>
      </div>

      <div className="mb-[22px] grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat icon={TrendingUp} label="A receber (em aberto)" value={brl(stats.receivableOpen)} tone="good" />
        <Stat icon={TrendingDown} label="A pagar (em aberto)" value={brl(stats.payableOpen)} tone="warn" />
        <Stat icon={TriangleAlert} label="Vencidos" value={brl(stats.overdue)} tone="bad" />
      </div>

      <div className="mb-[18px] flex gap-1 border-b border-border">
        {[['extrato', 'Extrato de Contas'], ['ficha', 'Ficha Financeira']].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k as any)} className={`-mb-px border-b-2 px-4 py-[11px] text-sm font-semibold transition ${tab === k ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{label}</button>
        ))}
      </div>

      {loading && <div className="py-16 text-center text-sm text-muted-foreground">Carregando...</div>}
      {error && !loading && <div className="py-16 text-center text-sm text-[#DC2626]">{error}.</div>}

      {!loading && !error && tab === 'extrato' && (
        <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FDF8F2]">
                {['Direção', 'Parte', 'Vencimento', 'Status', 'Valor'].map((h, i) => (
                  <th key={h} className={`border-b border-border px-[18px] py-[15px] text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6] ${i === 4 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => {
                const st = ST[e.status] ?? { label: e.status, cls: 'bg-[#F3ECE4] text-[#905B31]' }
                const rec = e.direction === 'receivable'
                return (
                  <tr key={e.id} className="border-t border-border transition hover:bg-[#FDF8F2]">
                    <td className="px-[18px] py-[13px]"><span className={`inline-block rounded-full px-[11px] py-1 text-xs font-semibold ${rec ? 'bg-[#E9F7EE] text-[#16A34A]' : 'bg-[#FEF4E0] text-[#B7791F]'}`}>{rec ? 'A receber' : 'A pagar'}</span></td>
                    <td className="px-[18px] py-[13px] text-[13.5px] font-medium">{e.party ?? '—'}</td>
                    <td className="px-[18px] py-[13px] text-[13.5px]">{fmtDate(e.dueDate)}</td>
                    <td className="px-[18px] py-[13px]"><span className={`inline-block rounded-full px-[11px] py-1 text-xs font-semibold ${st.cls}`}>{st.label}</span></td>
                    <td className={`px-[18px] py-[13px] text-right font-[Poppins] text-[13.5px] font-semibold ${rec ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{rec ? '+' : '−'} {brl(e.amount)}</td>
                  </tr>
                )
              })}
              {entries.length === 0 && <tr><td colSpan={5} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Nenhum lançamento.</td></tr>}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-border bg-[#FDF8F2] px-[18px] py-[13px] text-[13px] text-muted-foreground">
            <span>{entries.length} lançamentos</span><span>view <b>AccountStatement</b></span>
          </div>
        </div>
      )}

      {!loading && !error && tab === 'ficha' && (
        <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FDF8F2]">
                {['Cliente', 'Saldo em aberto', 'Total pago'].map((h, i) => (
                  <th key={h} className={`border-b border-border px-[18px] py-[15px] text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6] ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledger.map((l) => (
                <tr key={l.id} className="border-t border-border transition hover:bg-[#FDF8F2]">
                  <td className="px-[18px] py-[13px] text-[13.5px] font-medium">{l.name}</td>
                  <td className={`px-[18px] py-[13px] text-right font-[Poppins] text-[13.5px] font-semibold ${Number(l.openBalance) > 0 ? 'text-[#B7791F]' : 'text-muted-foreground'}`}>{brl(l.openBalance)}</td>
                  <td className="px-[18px] py-[13px] text-right font-[Poppins] text-[13.5px] font-semibold text-[#16A34A]">{brl(l.totalPaid)}</td>
                </tr>
              ))}
              {ledger.length === 0 && <tr><td colSpan={3} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Nenhum cliente com movimento.</td></tr>}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-border bg-[#FDF8F2] px-[18px] py-[13px] text-[13px] text-muted-foreground">
            <span>{ledger.length} clientes</span><span>view <b>CustomerLedger</b></span>
          </div>
        </div>
      )}
    </>
  )
}
