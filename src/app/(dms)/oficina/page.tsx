'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Bike, Wrench, Plus, Search, X, TriangleAlert, Check, Clock, CircleDollarSign,
} from 'lucide-react'

type OS = {
  id: number
  customer: string
  make: string
  model: string
  vin: string
  work: string | null
  estimated: number | null
  final: number | null
  status: string
}
type Customer = { id: number; name: string }
type Vehicle = { vin: string; label: string }

const brl = (n: number | null) =>
  n == null ? '—' : 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const STATUS: Record<string, { label: string; cls: string }> = {
  aberta:          { label: 'Aberta',            cls: 'bg-[#FEF4E0] text-[#B7791F]' },
  aguardando_peca: { label: 'Aguardando peça',   cls: 'bg-[#F3ECE4] text-[#905B31]' },
  em_reparo:       { label: 'Em reparo',         cls: 'bg-[#FFF3E3] text-[#E25812]' },
  pronta:          { label: 'Pronta p/ entrega', cls: 'bg-[#E8F0FE] text-[#2563EB]' },
  faturada:        { label: 'Faturada',          cls: 'bg-[#E9F7EE] text-[#16A34A]' },
  cancelada:       { label: 'Cancelada',         cls: 'bg-[#FDECEC] text-[#DC2626]' },
}

function Stat({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string; tone?: 'warn' | 'good' }) {
  const box = tone === 'warn' ? 'bg-[#FDECEC] text-[#DC2626]' : tone === 'good' ? 'bg-[#E9F7EE] text-[#16A34A]' : 'bg-[#FFF3E3] text-primary'
  return (
    <div className="flex items-center gap-[14px] rounded-[14px] border border-border bg-card px-[18px] py-4 shadow-sm">
      <div className={`grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-[11px] ${box}`}><Icon size={21} /></div>
      <div>
        <div className="text-[12.5px] font-medium text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-[Poppins] text-[22px] font-bold tracking-tight">{value}</div>
      </div>
    </div>
  )
}

const field = 'w-full rounded-[10px] border border-border bg-card px-3 py-[10px] text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15'
const lbl = 'mb-1.5 block text-[13px] font-semibold text-foreground'

export default function OficinaPage() {
  const [list, setList] = useState<OS[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<string>('todas')

  const [modal, setModal] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [form, setForm] = useState({ cId: '', vin: '', startMileage: '', estimatedCost: '', workPerformed: '', status: 'aberta' })
  const [saving, setSaving] = useState(false)

  function load() {
    setLoading(true)
    fetch('/api/service-orders')
      .then((r) => { if (!r.ok) throw new Error('Falha ao carregar as ordens'); return r.json() })
      .then((data: OS[]) => setList(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function openModal() {
    setModal(true)
    if (!customers.length || !vehicles.length) {
      const r = await fetch('/api/service-orders?meta=1')
      const data = await r.json()
      setCustomers(data.customers)
      setVehicles(data.vehicles)
    }
  }

  async function submit() {
    if (!form.cId || !form.vin) return
    setSaving(true)
    try {
      const r = await fetch('/api/service-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cId: Number(form.cId),
          vin: form.vin,
          startMileage: form.startMileage ? Number(form.startMileage) : null,
          estimatedCost: form.estimatedCost ? Number(form.estimatedCost) : null,
          workPerformed: form.workPerformed || null,
          status: form.status,
        }),
      })
      if (!r.ok) throw new Error()
      setModal(false)
      setForm({ cId: '', vin: '', startMileage: '', estimatedCost: '', workPerformed: '', status: 'aberta' })
      load()
    } catch {
      alert('Não foi possível criar a OS. Tente de novo.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    return list.filter((o) => {
      if (filter !== 'todas' && o.status !== filter) return false
      if (!t) return true
      return (
        o.customer.toLowerCase().includes(t) ||
        `${o.make} ${o.model}`.toLowerCase().includes(t) ||
        (o.work ?? '').toLowerCase().includes(t)
      )
    })
  }, [list, q, filter])

  const stats = useMemo(() => {
    const open = list.filter((o) => !['faturada', 'cancelada'].includes(o.status)).length
    const waiting = list.filter((o) => o.status === 'aguardando_peca').length
    const ready = list.filter((o) => o.status === 'pronta').length
    return { open, waiting, ready }
  }, [list])

  return (
    <>
      {/* cabeçalho */}
      <div className="mb-[22px] mt-1.5 flex items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Ordens de Serviço</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acompanhe a oficina — da abertura à entrega.</p>
        </div>
        <div className="flex-1" />
        <button onClick={openModal} className="flex items-center gap-2 rounded-[11px] bg-primary px-[18px] py-[11px] text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(226,88,18,0.5)] transition hover:bg-[#E25812]">
          <Plus size={16} strokeWidth={2.2} /> Nova OS
        </button>
      </div>

      {/* indicadores */}
      <div className="mb-[22px] grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Wrench} label="OS em aberto" value={String(stats.open)} />
        <Stat icon={TriangleAlert} label="Aguardando peça" value={String(stats.waiting)} tone="warn" />
        <Stat icon={Check} label="Prontas p/ entrega" value={String(stats.ready)} tone="good" />
        <Stat icon={Clock} label="Total de ordens" value={String(list.length)} />
      </div>

      {/* busca + filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] max-w-[420px] flex-1">
          <Search size={16} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por cliente, veículo ou serviço..." className="w-full rounded-[11px] border border-border bg-card py-[11px] pl-10 pr-[14px] text-sm shadow-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[['todas', 'Todas'], ['aberta', 'Aberta'], ['aguardando_peca', 'Aguardando peça'], ['em_reparo', 'Em reparo'], ['pronta', 'Pronta'], ['faturada', 'Faturada']].map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} className={`rounded-full border px-[15px] py-[9px] text-[13px] font-semibold shadow-sm transition ${filter === k ? 'border-primary bg-primary text-white' : 'border-border bg-card text-muted-foreground hover:border-[#FBD9BC]'}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* tabela */}
      <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FDF8F2]">
              {['Veículo', 'Cliente', 'Serviço', 'Status', 'Valor'].map((h, i) => (
                <th key={h} className={`border-b border-border px-[18px] py-[15px] text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6] ${i === 3 ? 'text-center' : i === 4 ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Carregando ordens...</td></tr>}
            {error && !loading && <tr><td colSpan={5} className="px-[18px] py-10 text-center text-sm text-[#DC2626]">{error}. Confirme que o banco tem a coluna Status (rode com down -v).</td></tr>}
            {!loading && !error && filtered.map((o) => {
              const st = STATUS[o.status] ?? { label: o.status, cls: 'bg-[#F3ECE4] text-[#905B31]' }
              return (
                <tr key={o.id} className="border-t border-border transition hover:bg-[#FDF8F2]">
                  <td className="px-[18px] py-[13px]">
                    <div className="flex items-center gap-3">
                      <div className="grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-[10px] bg-[#FFF3E3] text-primary"><Bike size={19} /></div>
                      <div>
                        <div className="text-[13.5px] font-semibold">{o.make} {o.model}</div>
                        <div className="mt-px text-xs text-[#B4ACA6]">OS #{o.id} · {o.vin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-[18px] py-[13px] text-[13.5px]">{o.customer}</td>
                  <td className="px-[18px] py-[13px] text-[13.5px] text-muted-foreground">{o.work ?? <span className="italic">sem descrição</span>}</td>
                  <td className="px-[18px] py-[13px] text-center"><span className={`inline-block rounded-full px-[11px] py-1 text-xs font-semibold ${st.cls}`}>{st.label}</span></td>
                  <td className="px-[18px] py-[13px] text-right font-[Poppins] text-[13.5px] font-semibold">{brl(o.final ?? o.estimated)}</td>
                </tr>
              )
            })}
            {!loading && !error && filtered.length === 0 && <tr><td colSpan={5} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Nenhuma ordem encontrada.</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-border bg-[#FDF8F2] px-[18px] py-[13px] text-[13px] text-muted-foreground">
          <span>Mostrando {filtered.length} de {list.length} ordens</span>
          <span>tabelas <b>Service</b> · <b>Customer</b> · <b>Vehicle</b></span>
        </div>
      </div>

      {/* modal nova OS */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,25,23,0.42)] p-6 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[20px] bg-background shadow-2xl">
            <div className="flex items-start gap-[14px] border-b border-border bg-card px-6 py-[18px]">
              <div className="grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-xl bg-[#FFF3E3] text-primary"><Wrench size={21} /></div>
              <div>
                <h2 className="text-[18px] font-bold">Nova Ordem de Serviço</h2>
                <p className="mt-[3px] text-[13px] text-muted-foreground">Abra uma OS para um veículo e cliente.</p>
              </div>
              <button onClick={() => setModal(false)} className="ml-auto grid h-9 w-9 place-items-center rounded-[10px] border border-border bg-card text-muted-foreground hover:bg-[#FDF8F2]"><X size={16} /></button>
            </div>
            <div className="overflow-auto px-6 py-[22px]">
              <div className="grid gap-4">
                <div>
                  <label className={lbl}>Cliente</label>
                  <select className={field} value={form.cId} onChange={(e) => setForm({ ...form, cId: e.target.value })}>
                    <option value="">Selecione o cliente...</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Veículo</label>
                  <select className={field} value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })}>
                    <option value="">Selecione o veículo...</option>
                    {vehicles.map((v) => <option key={v.vin} value={v.vin}>{v.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Quilometragem</label>
                    <input type="number" className={field} value={form.startMileage} onChange={(e) => setForm({ ...form, startMileage: e.target.value })} placeholder="ex: 1200" />
                  </div>
                  <div>
                    <label className={lbl}>Custo estimado (R$)</label>
                    <input type="number" step="0.01" className={field} value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} placeholder="ex: 350.00" />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Descrição do serviço</label>
                  <textarea className={field} rows={3} value={form.workPerformed} onChange={(e) => setForm({ ...form, workPerformed: e.target.value })} placeholder="ex: Revisão de 1.000 km, troca de pastilhas..." />
                </div>
                <div>
                  <label className={lbl}>Status inicial</label>
                  <select className={field} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-border bg-card px-6 py-4">
              <button onClick={() => setModal(false)} className="rounded-[10px] border border-border bg-card px-[18px] py-[10px] text-sm font-semibold text-muted-foreground hover:bg-[#FDF8F2]">Cancelar</button>
              <button onClick={submit} disabled={saving || !form.cId || !form.vin} className="rounded-[10px] bg-primary px-[18px] py-[10px] text-sm font-semibold text-white transition hover:bg-[#E25812] disabled:opacity-50">
                {saving ? 'Salvando...' : 'Criar OS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
