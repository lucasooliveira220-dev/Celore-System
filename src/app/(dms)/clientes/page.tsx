'use client'

import { useEffect, useMemo, useState } from 'react'
import { Users, User, Plus, Search, X, ShoppingCart, Wrench, Eye } from 'lucide-react'

type Customer = {
  Customer_ID: number
  Name: string
  Address: string | null
  P_Number: string | null
  Email: string | null
  Type: 'purchase' | 'service' | 'visit' | null
}

const TYPE: Record<string, { label: string; cls: string }> = {
  purchase: { label: 'Compra', cls: 'bg-[#E8F0FE] text-[#2563EB]' },
  service: { label: 'Serviço', cls: 'bg-[#FFF3E3] text-[#E25812]' },
  visit: { label: 'Visita', cls: 'bg-[#F3ECE4] text-[#905B31]' },
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-[14px] rounded-[14px] border border-border bg-card px-[18px] py-4 shadow-sm">
      <div className="grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-[11px] bg-[#FFF3E3] text-primary"><Icon size={21} /></div>
      <div>
        <div className="text-[12.5px] font-medium text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-[Poppins] text-[22px] font-bold tracking-tight">{value}</div>
      </div>
    </div>
  )
}

const field = 'w-full rounded-[10px] border border-border bg-card px-3 py-[10px] text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15'
const lbl = 'mb-1.5 block text-[13px] font-semibold'

export default function ClientesPage() {
  const [list, setList] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('todos')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ Name: '', Email: '', P_Number: '', Address: '', Type: 'purchase' })

  function load() {
    setLoading(true)
    fetch('/api/customers')
      .then((r) => { if (!r.ok) throw new Error('Falha ao carregar clientes'); return r.json() })
      .then((d: Customer[]) => setList(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function submit() {
    if (!form.Name) return
    setSaving(true)
    try {
      const r = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        throw new Error(j.reason || 'Erro ao salvar')
      }
      setModal(false)
      setForm({ Name: '', Email: '', P_Number: '', Address: '', Type: 'purchase' })
      load()
    } catch (e: any) {
      alert(e.message === 'Email already exists' ? 'Já existe um cliente com esse e-mail.' : 'Não foi possível criar o cliente.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    return list.filter((c) => {
      if (filter !== 'todos' && c.Type !== filter) return false
      if (!t) return true
      return c.Name.toLowerCase().includes(t) || (c.Email ?? '').toLowerCase().includes(t) || (c.P_Number ?? '').includes(t)
    })
  }, [list, q, filter])

  const stats = useMemo(() => ({
    total: list.length,
    purchase: list.filter((c) => c.Type === 'purchase').length,
    service: list.filter((c) => c.Type === 'service').length,
  }), [list])

  return (
    <>
      <div className="mb-[22px] mt-1.5 flex items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Cadastro de clientes e histórico de relacionamento.</p>
        </div>
        <div className="flex-1" />
        <button onClick={() => setModal(true)} className="flex items-center gap-2 rounded-[11px] bg-primary px-[18px] py-[11px] text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(226,88,18,0.5)] transition hover:bg-[#E25812]">
          <Plus size={16} strokeWidth={2.2} /> Novo cliente
        </button>
      </div>

      <div className="mb-[22px] grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat icon={Users} label="Clientes cadastrados" value={String(stats.total)} />
        <Stat icon={ShoppingCart} label="Compradores" value={String(stats.purchase)} />
        <Stat icon={Wrench} label="De serviço" value={String(stats.service)} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] max-w-[420px] flex-1">
          <Search size={16} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, e-mail ou telefone..." className="w-full rounded-[11px] border border-border bg-card py-[11px] pl-10 pr-[14px] text-sm shadow-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
        </div>
        <div className="flex gap-2">
          {[['todos', 'Todos'], ['purchase', 'Compra'], ['service', 'Serviço'], ['visit', 'Visita']].map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} className={`rounded-full border px-[15px] py-[9px] text-[13px] font-semibold shadow-sm transition ${filter === k ? 'border-primary bg-primary text-white' : 'border-border bg-card text-muted-foreground hover:border-[#FBD9BC]'}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FDF8F2]">
              {['Cliente', 'Telefone', 'Tipo'].map((h) => (
                <th key={h} className="border-b border-border px-[18px] py-[15px] text-left text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={3} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Carregando...</td></tr>}
            {error && !loading && <tr><td colSpan={3} className="px-[18px] py-10 text-center text-sm text-[#DC2626]">{error}.</td></tr>}
            {!loading && !error && filtered.map((c) => {
              const t = c.Type ? TYPE[c.Type] : null
              return (
                <tr key={c.Customer_ID} className="border-t border-border transition hover:bg-[#FDF8F2]">
                  <td className="px-[18px] py-[13px]">
                    <div className="flex items-center gap-3">
                      <div className="grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-full bg-[#FFF3E3] text-primary"><User size={18} /></div>
                      <div>
                        <div className="text-[13.5px] font-semibold">{c.Name}</div>
                        <div className="mt-px text-xs text-[#B4ACA6]">{c.Email ?? '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-[18px] py-[13px] text-[13.5px]">{c.P_Number ?? '—'}</td>
                  <td className="px-[18px] py-[13px]">{t ? <span className={`inline-block rounded-full px-[11px] py-1 text-xs font-semibold ${t.cls}`}>{t.label}</span> : '—'}</td>
                </tr>
              )
            })}
            {!loading && !error && filtered.length === 0 && <tr><td colSpan={3} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Nenhum cliente encontrado.</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-border bg-[#FDF8F2] px-[18px] py-[13px] text-[13px] text-muted-foreground">
          <span>Mostrando {filtered.length} de {list.length} clientes</span>
          <span>tabela <b>Customer</b></span>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,25,23,0.42)] p-6 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="flex w-full max-w-[520px] flex-col overflow-hidden rounded-[20px] bg-background shadow-2xl">
            <div className="flex items-start gap-[14px] border-b border-border bg-card px-6 py-[18px]">
              <div className="grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-xl bg-[#FFF3E3] text-primary"><User size={21} /></div>
              <div><h2 className="text-[18px] font-bold">Novo cliente</h2><p className="mt-[3px] text-[13px] text-muted-foreground">Cadastre um cliente no sistema.</p></div>
              <button onClick={() => setModal(false)} className="ml-auto grid h-9 w-9 place-items-center rounded-[10px] border border-border bg-card text-muted-foreground hover:bg-[#FDF8F2]"><X size={16} /></button>
            </div>
            <div className="grid gap-4 px-6 py-[22px]">
              <div><label className={lbl}>Nome *</label><input className={field} value={form.Name} onChange={(e) => setForm({ ...form, Name: e.target.value })} placeholder="Nome completo" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>E-mail</label><input className={field} value={form.Email} onChange={(e) => setForm({ ...form, Email: e.target.value })} placeholder="email@exemplo.com" /></div>
                <div><label className={lbl}>Telefone</label><input className={field} value={form.P_Number} onChange={(e) => setForm({ ...form, P_Number: e.target.value })} placeholder="(13) 99999-0000" /></div>
              </div>
              <div><label className={lbl}>Endereço</label><input className={field} value={form.Address} onChange={(e) => setForm({ ...form, Address: e.target.value })} placeholder="Rua, número, cidade" /></div>
              <div><label className={lbl}>Tipo</label>
                <select className={field} value={form.Type} onChange={(e) => setForm({ ...form, Type: e.target.value })}>
                  <option value="purchase">Compra</option><option value="service">Serviço</option><option value="visit">Visita</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-border bg-card px-6 py-4">
              <button onClick={() => setModal(false)} className="rounded-[10px] border border-border bg-card px-[18px] py-[10px] text-sm font-semibold text-muted-foreground hover:bg-[#FDF8F2]">Cancelar</button>
              <button onClick={submit} disabled={saving || !form.Name} className="rounded-[10px] bg-primary px-[18px] py-[10px] text-sm font-semibold text-white transition hover:bg-[#E25812] disabled:opacity-50">{saving ? 'Salvando...' : 'Criar cliente'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
