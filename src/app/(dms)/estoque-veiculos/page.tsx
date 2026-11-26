'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Warehouse, Bike, Plus, X, ArrowDownToLine, ArrowUpFromLine, Boxes, Search,
} from 'lucide-react'

type Stock = { make: string; model: string; onHand: number; lastMovement: string | null; price: number | null }
type Movement = { id: number; make: string; model: string; type: string; quantity: number; date: string; note: string | null }

const fmtDateTime = (d: string | null) => (d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—')

function Stat({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string; tone?: 'warn' }) {
  return (
    <div className="flex items-center gap-[14px] rounded-[14px] border border-border bg-card px-[18px] py-4 shadow-sm">
      <div className={`grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-[11px] ${tone === 'warn' ? 'bg-[#FDECEC] text-[#DC2626]' : 'bg-[#FFF3E3] text-primary'}`}><Icon size={21} /></div>
      <div><div className="text-[12.5px] font-medium text-muted-foreground">{label}</div><div className="mt-0.5 font-[Poppins] text-[22px] font-bold tracking-tight">{value}</div></div>
    </div>
  )
}

const field = 'w-full rounded-[10px] border border-border bg-card px-3 py-[10px] text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15'
const lbl = 'mb-1.5 block text-[13px] font-semibold'

export default function EstoqueVeiculosPage() {
  const [stock, setStock] = useState<Stock[]>([])
  const [moves, setMoves] = useState<Movement[]>([])
  const [models, setModels] = useState<{ make: string; model: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ key: '', type: 'in', quantity: '', note: '' })

  function load() {
    setLoading(true)
    Promise.all([
      fetch('/api/vehicle-stock').then((r) => { if (!r.ok) throw new Error('Falha ao carregar o estoque'); return r.json() }),
      fetch('/api/vehicle-movements').then((r) => r.json()),
      fetch('/api/catalog').then((r) => r.json()),
    ])
      .then(([s, m, cat]) => {
        setStock(s); setMoves(m)
        const uniq = Array.from(new Map(cat.map((v: any) => [`${v.make}|${v.model}`, { make: v.make, model: v.model }])).values()) as { make: string; model: string }[]
        setModels(uniq.sort((a, b) => (a.make + a.model).localeCompare(b.make + b.model)))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function submit() {
    if (!form.key || !form.quantity) return
    const [make, model] = form.key.split('|')
    setSaving(true)
    try {
      const r = await fetch('/api/vehicle-movements', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ make, model, type: form.type, quantity: Number(form.quantity), note: form.note || null }),
      })
      if (!r.ok) throw new Error()
      setModal(false); setForm({ key: '', type: 'in', quantity: '', note: '' }); load()
    } catch { alert('Não foi possível registrar a movimentação.') } finally { setSaving(false) }
  }

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return stock
    return stock.filter((s) => `${s.make} ${s.model}`.toLowerCase().includes(t))
  }, [stock, q])

  const stats = useMemo(() => {
    const totalUnits = stock.reduce((a, s) => a + Number(s.onHand), 0)
    const outOfStock = stock.filter((s) => Number(s.onHand) <= 0).length
    return { models: stock.length, totalUnits, outOfStock }
  }, [stock])

  return (
    <>
      <div className="mb-[22px] mt-1.5 flex items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Estoque de Veículos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Controle de unidades por modelo — entradas e saídas.</p>
        </div>
        <div className="flex-1" />
        <button onClick={() => setModal(true)} className="flex items-center gap-2 rounded-[11px] bg-primary px-[18px] py-[11px] text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(226,88,18,0.5)] transition hover:bg-[#E25812]">
          <Plus size={16} strokeWidth={2.2} /> Registrar movimentação
        </button>
      </div>

      <div className="mb-[22px] grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat icon={Boxes} label="Modelos" value={String(stats.models)} />
        <Stat icon={Warehouse} label="Unidades em estoque" value={String(stats.totalUnits)} />
        <Stat icon={Bike} label="Modelos esgotados" value={String(stats.outOfStock)} tone={stats.outOfStock ? 'warn' : undefined} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] max-w-[420px] flex-1">
          <Search size={16} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por marca ou modelo..." className="w-full rounded-[11px] border border-border bg-card py-[11px] pl-10 pr-[14px] text-sm shadow-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
        </div>
      </div>

      {/* saldo por modelo */}
      <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FDF8F2]">
              <th className="border-b border-border px-[18px] py-[15px] text-left text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Modelo</th>
              <th className="border-b border-border px-[18px] py-[15px] text-center text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Em estoque</th>
              <th className="border-b border-border px-[18px] py-[15px] text-left text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Última movimentação</th>
              <th className="border-b border-border px-[18px] py-[15px] text-center text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Situação</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Carregando...</td></tr>}
            {error && !loading && <tr><td colSpan={4} className="px-[18px] py-10 text-center text-sm text-[#DC2626]">{error}. Confirme o banco (rode com down -v).</td></tr>}
            {!loading && !error && filtered.map((s, i) => (
              <tr key={i} className="border-t border-border transition hover:bg-[#FDF8F2]">
                <td className="px-[18px] py-[13px]">
                  <div className="flex items-center gap-3">
                    <div className="grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-[10px] bg-[#FFF3E3] text-primary"><Bike size={19} /></div>
                    <div><div className="text-[13.5px] font-semibold">{s.model}</div><div className="mt-px text-xs text-[#B4ACA6]">{s.make}</div></div>
                  </div>
                </td>
                <td className="px-[18px] py-[13px] text-center font-[Poppins] text-[16px] font-bold">{s.onHand}</td>
                <td className="px-[18px] py-[13px] text-[13px] text-muted-foreground">{fmtDateTime(s.lastMovement)}</td>
                <td className="px-[18px] py-[13px] text-center">
                  {Number(s.onHand) <= 0
                    ? <span className="inline-block rounded-full bg-[#FDECEC] px-[11px] py-1 text-xs font-semibold text-[#DC2626]">Esgotado</span>
                    : Number(s.onHand) <= 2
                      ? <span className="inline-block rounded-full bg-[#FEF4E0] px-[11px] py-1 text-xs font-semibold text-[#B7791F]">Estoque baixo</span>
                      : <span className="inline-block rounded-full bg-[#E9F7EE] px-[11px] py-1 text-xs font-semibold text-[#16A34A]">Disponível</span>}
                </td>
              </tr>
            ))}
            {!loading && !error && filtered.length === 0 && <tr><td colSpan={4} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Nenhum modelo encontrado.</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-border bg-[#FDF8F2] px-[18px] py-[13px] text-[13px] text-muted-foreground">
          <span>{filtered.length} modelos</span><span>view <b>VehicleStock</b> · tabela <b>VehicleMovement</b></span>
        </div>
      </div>

      {/* histórico de movimentações */}
      {!loading && !error && moves.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-base font-semibold">Últimas movimentações</h2>
          <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#FDF8F2]">
                  <th className="border-b border-border px-[18px] py-[13px] text-left text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Data</th>
                  <th className="border-b border-border px-[18px] py-[13px] text-left text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Modelo</th>
                  <th className="border-b border-border px-[18px] py-[13px] text-center text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Tipo</th>
                  <th className="border-b border-border px-[18px] py-[13px] text-right text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Qtd</th>
                  <th className="border-b border-border px-[18px] py-[13px] text-left text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">Observação</th>
                </tr>
              </thead>
              <tbody>
                {moves.slice(0, 12).map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="px-[18px] py-[11px] text-[13px]">{fmtDateTime(m.date)}</td>
                    <td className="px-[18px] py-[11px] text-[13px] font-medium">{m.make} {m.model}</td>
                    <td className="px-[18px] py-[11px] text-center">
                      {m.quantity >= 0
                        ? <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F7EE] px-[10px] py-0.5 text-xs font-semibold text-[#16A34A]"><ArrowDownToLine size={11} /> Entrada</span>
                        : <span className="inline-flex items-center gap-1 rounded-full bg-[#FDECEC] px-[10px] py-0.5 text-xs font-semibold text-[#DC2626]"><ArrowUpFromLine size={11} /> Saída</span>}
                    </td>
                    <td className={`px-[18px] py-[11px] text-right font-[Poppins] text-[14px] font-bold ${m.quantity < 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>{m.quantity > 0 ? '+' : ''}{m.quantity}</td>
                    <td className="px-[18px] py-[11px] text-[13px] text-muted-foreground">{m.note ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* modal registrar movimentação */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,25,23,0.42)] p-6 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="flex w-full max-w-[500px] flex-col overflow-hidden rounded-[20px] bg-background shadow-2xl">
            <div className="flex items-start gap-[14px] border-b border-border bg-card px-6 py-[18px]">
              <div className="grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-xl bg-[#FFF3E3] text-primary"><Warehouse size={21} /></div>
              <div><h2 className="text-[18px] font-bold">Registrar movimentação</h2><p className="mt-[3px] text-[13px] text-muted-foreground">Entrada (compra/lote) ou saída (venda/baixa) de unidades.</p></div>
              <button onClick={() => setModal(false)} className="ml-auto grid h-9 w-9 place-items-center rounded-[10px] border border-border bg-card text-muted-foreground hover:bg-[#FDF8F2]"><X size={16} /></button>
            </div>
            <div className="grid gap-4 px-6 py-[22px]">
              <div><label className={lbl}>Modelo</label>
                <select className={field} value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })}>
                  <option value="">Selecione...</option>
                  {models.map((m) => <option key={`${m.make}|${m.model}`} value={`${m.make}|${m.model}`}>{m.make} {m.model}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Tipo</label>
                  <select className={field} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="in">Entrada</option><option value="out">Saída</option>
                  </select>
                </div>
                <div><label className={lbl}>Quantidade</label><input type="number" min="1" className={field} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="ex: 5" /></div>
              </div>
              <div><label className={lbl}>Observação</label><input className={field} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="ex: Entrada de lote / Venda" /></div>
            </div>
            <div className="flex justify-end gap-3 border-t border-border bg-card px-6 py-4">
              <button onClick={() => setModal(false)} className="rounded-[10px] border border-border bg-card px-[18px] py-[10px] text-sm font-semibold text-muted-foreground hover:bg-[#FDF8F2]">Cancelar</button>
              <button onClick={submit} disabled={saving || !form.key || !form.quantity} className="rounded-[10px] bg-primary px-[18px] py-[10px] text-sm font-semibold text-white transition hover:bg-[#E25812] disabled:opacity-50">{saving ? 'Salvando...' : 'Registrar'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
