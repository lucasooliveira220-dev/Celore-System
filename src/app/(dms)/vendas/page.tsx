'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bike, CircleDollarSign, Plus, Search, X, ShoppingCart, Calendar } from 'lucide-react'

type Sale = {
  Sale_ID: number
  VIN: string
  Year: number
  Make: string
  Model: string
  Price: number
  customer: string
  Date: string
  Payment_Method: string | null
}
type Customer = { Customer_ID: number; Name: string }
type Vehicle = { VIN: string; Make: string; Model: string; Price: number }

const brl = (n: number | null) => (n == null ? '—' : 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
const fmtDate = (d: string) => (d ? new Date(d).toLocaleDateString('pt-BR') : '—')

const PAY: Record<string, string> = { cash: 'À vista', credit: 'Crédito', debit: 'Débito', financing: 'Financiado', check: 'Cheque' }

function Stat({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string; tone?: 'good' }) {
  return (
    <div className="flex items-center gap-[14px] rounded-[14px] border border-border bg-card px-[18px] py-4 shadow-sm">
      <div className={`grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-[11px] ${tone === 'good' ? 'bg-[#E9F7EE] text-[#16A34A]' : 'bg-[#FFF3E3] text-primary'}`}><Icon size={21} /></div>
      <div><div className="text-[12.5px] font-medium text-muted-foreground">{label}</div><div className="mt-0.5 font-[Poppins] text-[22px] font-bold tracking-tight">{value}</div></div>
    </div>
  )
}

const field = 'w-full rounded-[10px] border border-border bg-card px-3 py-[10px] text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15'
const lbl = 'mb-1.5 block text-[13px] font-semibold'

export default function VendasPage() {
  const [list, setList] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ C_ID: '', VIN: '', Date: new Date().toISOString().split('T')[0], Payment_Method: 'cash', Customization: '' })

  function load() {
    setLoading(true)
    fetch('/api/sales')
      .then((r) => { if (!r.ok) throw new Error('Falha ao carregar vendas'); return r.json() })
      .then((d: Sale[]) => setList(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function openModal() {
    setModal(true)
    if (!customers.length) fetch('/api/customers').then((r) => r.json()).then((d) => setCustomers(d))
    if (!vehicles.length) fetch('/api/vehicles?status=inventory').then((r) => r.json()).then((d) => setVehicles(d))
  }

  async function submit() {
    if (!form.C_ID || !form.VIN) return
    setSaving(true)
    try {
      const r = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          VIN: form.VIN, C_ID: Number(form.C_ID),
          Temp_Tag: 'TMP-' + Date.now().toString().slice(-8),
          Date: form.Date, Customization: form.Customization || null, Payment_Method: form.Payment_Method,
        }),
      })
      if (!r.ok) throw new Error()
      setModal(false)
      setVehicles([]) // veículo saiu do estoque; recarrega da próxima
      setForm({ C_ID: '', VIN: '', Date: new Date().toISOString().split('T')[0], Payment_Method: 'cash', Customization: '' })
      load()
    } catch {
      alert('Não foi possível registrar a venda.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return list
    return list.filter((s) => s.customer.toLowerCase().includes(t) || `${s.Make} ${s.Model}`.toLowerCase().includes(t))
  }, [list, q])

  const stats = useMemo(() => ({
    count: list.length,
    revenue: list.reduce((a, s) => a + Number(s.Price || 0), 0),
  }), [list])

  return (
    <>
      <div className="mb-[22px] mt-1.5 flex items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Vendas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Registro de vendas de veículos.</p>
        </div>
        <div className="flex-1" />
        <button onClick={openModal} className="flex items-center gap-2 rounded-[11px] bg-primary px-[18px] py-[11px] text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(226,88,18,0.5)] transition hover:bg-[#E25812]">
          <Plus size={16} strokeWidth={2.2} /> Nova venda
        </button>
      </div>

      <div className="mb-[22px] grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat icon={ShoppingCart} label="Vendas registradas" value={String(stats.count)} />
        <Stat icon={CircleDollarSign} label="Faturamento total" value={brl(stats.revenue)} tone="good" />
        <Stat icon={Bike} label="Veículos disponíveis" value={String(vehicles.length || '—')} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] max-w-[420px] flex-1">
          <Search size={16} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por cliente ou veículo..." className="w-full rounded-[11px] border border-border bg-card py-[11px] pl-10 pr-[14px] text-sm shadow-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
        </div>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FDF8F2]">
              {['Veículo', 'Cliente', 'Data', 'Pagamento', 'Valor'].map((h, i) => (
                <th key={h} className={`border-b border-border px-[18px] py-[15px] text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6] ${i === 4 ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Carregando...</td></tr>}
            {error && !loading && <tr><td colSpan={5} className="px-[18px] py-10 text-center text-sm text-[#DC2626]">{error}.</td></tr>}
            {!loading && !error && filtered.map((s) => (
              <tr key={s.Sale_ID} className="border-t border-border transition hover:bg-[#FDF8F2]">
                <td className="px-[18px] py-[13px]">
                  <div className="flex items-center gap-3">
                    <div className="grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-[10px] bg-[#FFF3E3] text-primary"><Bike size={19} /></div>
                    <div>
                      <div className="text-[13.5px] font-semibold">{s.Make} {s.Model} <span className="font-normal text-[#B4ACA6]">{s.Year}</span></div>
                      <div className="mt-px text-xs text-[#B4ACA6]">#V-{s.Sale_ID} · {s.VIN}</div>
                    </div>
                  </div>
                </td>
                <td className="px-[18px] py-[13px] text-[13.5px]">{s.customer}</td>
                <td className="px-[18px] py-[13px] text-[13.5px]">{fmtDate(s.Date)}</td>
                <td className="px-[18px] py-[13px] text-[13.5px]">{s.Payment_Method ? (PAY[s.Payment_Method] ?? s.Payment_Method) : '—'}</td>
                <td className="px-[18px] py-[13px] text-right font-[Poppins] text-[13.5px] font-semibold">{brl(s.Price)}</td>
              </tr>
            ))}
            {!loading && !error && filtered.length === 0 && <tr><td colSpan={5} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Nenhuma venda encontrada.</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-border bg-[#FDF8F2] px-[18px] py-[13px] text-[13px] text-muted-foreground">
          <span>Mostrando {filtered.length} de {list.length} vendas</span>
          <span>tabelas <b>Sales</b> · <b>Vehicle</b> · <b>Billing</b></span>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,25,23,0.42)] p-6 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="flex w-full max-w-[520px] flex-col overflow-hidden rounded-[20px] bg-background shadow-2xl">
            <div className="flex items-start gap-[14px] border-b border-border bg-card px-6 py-[18px]">
              <div className="grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-xl bg-[#FFF3E3] text-primary"><ShoppingCart size={21} /></div>
              <div><h2 className="text-[18px] font-bold">Nova venda</h2><p className="mt-[3px] text-[13px] text-muted-foreground">Registre a venda de um veículo do estoque.</p></div>
              <button onClick={() => setModal(false)} className="ml-auto grid h-9 w-9 place-items-center rounded-[10px] border border-border bg-card text-muted-foreground hover:bg-[#FDF8F2]"><X size={16} /></button>
            </div>
            <div className="grid gap-4 px-6 py-[22px]">
              <div><label className={lbl}>Cliente</label>
                <select className={field} value={form.C_ID} onChange={(e) => setForm({ ...form, C_ID: e.target.value })}>
                  <option value="">Selecione...</option>
                  {customers.map((c) => <option key={c.Customer_ID} value={c.Customer_ID}>{c.Name}</option>)}
                </select>
              </div>
              <div><label className={lbl}>Veículo (em estoque)</label>
                <select className={field} value={form.VIN} onChange={(e) => setForm({ ...form, VIN: e.target.value })}>
                  <option value="">Selecione...</option>
                  {vehicles.map((v) => <option key={v.VIN} value={v.VIN}>{v.Make} {v.Model} — {brl(v.Price)}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Data</label><input type="date" className={field} value={form.Date} onChange={(e) => setForm({ ...form, Date: e.target.value })} /></div>
                <div><label className={lbl}>Pagamento</label>
                  <select className={field} value={form.Payment_Method} onChange={(e) => setForm({ ...form, Payment_Method: e.target.value })}>
                    {Object.entries(PAY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div><label className={lbl}>Personalização</label><input className={field} value={form.Customization} onChange={(e) => setForm({ ...form, Customization: e.target.value })} placeholder="opcional" /></div>
            </div>
            <div className="flex justify-end gap-3 border-t border-border bg-card px-6 py-4">
              <button onClick={() => setModal(false)} className="rounded-[10px] border border-border bg-card px-[18px] py-[10px] text-sm font-semibold text-muted-foreground hover:bg-[#FDF8F2]">Cancelar</button>
              <button onClick={submit} disabled={saving || !form.C_ID || !form.VIN} className="rounded-[10px] bg-primary px-[18px] py-[10px] text-sm font-semibold text-white transition hover:bg-[#E25812] disabled:opacity-50">{saving ? 'Salvando...' : 'Registrar venda'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
