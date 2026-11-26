'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bike, Zap, Gauge, MapPin, BatteryCharging, Search, Plus, CircleDollarSign } from 'lucide-react'

type Vehicle = {
  vin: string
  make: string
  model: string
  year: number
  price: number
  status: 'inventory' | 'sold' | 'leased' | 'in_service'
  motorW: number | null
  maxSpeed: number | null
  rangeKm: number | null
  battery: string | null
}

const brl = (n: number) => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const STATUS: Record<string, { label: string; cls: string }> = {
  inventory: { label: 'Em estoque', cls: 'bg-[#E9F7EE] text-[#16A34A]' },
  in_service: { label: 'Em serviço', cls: 'bg-[#FFF3E3] text-[#E25812]' },
  leased: { label: 'Locado', cls: 'bg-[#E8F0FE] text-[#2563EB]' },
  sold: { label: 'Vendido', cls: 'bg-[#F3ECE4] text-[#905B31]' },
}

// Classificação legal (CONTRAN 996/2023) a partir de potência e velocidade
function legalClass(motorW: number | null, maxSpeed: number | null) {
  const w = motorW ?? 0, s = maxSpeed ?? 0
  if (w <= 1000 && s <= 32) return { label: 'Autopropelido', hint: 'Sem CNH / sem placa', cls: 'bg-[#E9F7EE] text-[#16A34A]' }
  if (w <= 4000 && s <= 50) return { label: 'Ciclomotor', hint: 'Exige ACC/CNH + placa', cls: 'bg-[#FEF4E0] text-[#B7791F]' }
  return { label: 'Motocicleta', hint: 'Exige CNH A + placa', cls: 'bg-[#FDECEC] text-[#DC2626]' }
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-[14px] rounded-[14px] border border-border bg-card px-[18px] py-4 shadow-sm">
      <div className="grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-[11px] bg-[#FFF3E3] text-primary"><Icon size={21} /></div>
      <div><div className="text-[12.5px] font-medium text-muted-foreground">{label}</div><div className="mt-0.5 font-[Poppins] text-[22px] font-bold tracking-tight">{value}</div></div>
    </div>
  )
}

function Spec({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-[#FFF3E3] text-primary"><Icon size={15} /></div>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-[#B4ACA6]">{label}</div>
        <div className="truncate text-[13px] font-semibold">{value}</div>
      </div>
    </div>
  )
}

export default function VeiculosPage() {
  const [list, setList] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    fetch('/api/catalog')
      .then((r) => { if (!r.ok) throw new Error('Falha ao carregar veículos'); return r.json() })
      .then((d: Vehicle[]) => setList(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    return list.filter((v) => {
      if (filter === 'estoque' && v.status !== 'inventory') return false
      if (!t) return true
      return `${v.make} ${v.model}`.toLowerCase().includes(t)
    })
  }, [list, q, filter])

  const stats = useMemo(() => {
    const inStock = list.filter((v) => v.status === 'inventory')
    const value = inStock.reduce((a, v) => a + Number(v.price || 0), 0)
    return { total: list.length, inStock: inStock.length, value }
  }, [list])

  return (
    <>
      <div className="mb-[22px] mt-1.5 flex items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Veículos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Catálogo de motos elétricas — especificações e disponibilidade.</p>
        </div>
        <div className="flex-1" />
        <button className="flex items-center gap-2 rounded-[11px] bg-primary px-[18px] py-[11px] text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(226,88,18,0.5)] transition hover:bg-[#E25812]">
          <Plus size={16} strokeWidth={2.2} /> Novo veículo
        </button>
      </div>

      <div className="mb-[22px] grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat icon={Bike} label="Veículos no catálogo" value={String(stats.total)} />
        <Stat icon={BatteryCharging} label="Em estoque" value={String(stats.inStock)} />
        <Stat icon={CircleDollarSign} label="Valor em estoque" value={stats.value ? 'R$ ' + stats.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : '—'} />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] max-w-[420px] flex-1">
          <Search size={16} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por marca ou modelo..." className="w-full rounded-[11px] border border-border bg-card py-[11px] pl-10 pr-[14px] text-sm shadow-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
        </div>
        <div className="flex gap-2">
          {[['todos', 'Todos'], ['estoque', 'Só em estoque']].map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} className={`rounded-full border px-[15px] py-[9px] text-[13px] font-semibold shadow-sm transition ${filter === k ? 'border-primary bg-primary text-white' : 'border-border bg-card text-muted-foreground hover:border-[#FBD9BC]'}`}>{label}</button>
          ))}
        </div>
      </div>

      {loading && <div className="py-16 text-center text-sm text-muted-foreground">Carregando veículos...</div>}
      {error && !loading && <div className="py-16 text-center text-sm text-[#DC2626]">{error}. Confirme que o banco tem os campos técnicos (rode com down -v).</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => {
            const st = STATUS[v.status] ?? { label: v.status, cls: '' }
            const lc = legalClass(v.motorW, v.maxSpeed)
            return (
              <div key={v.vin} className="flex flex-col overflow-hidden rounded-[18px] border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-18px_rgba(226,88,18,0.35)]">
                {/* topo: ilustração + status */}
                <div className="relative flex h-[120px] items-center justify-center bg-gradient-to-br from-[#FFF6EC] to-[#FDEFE0]">
                  <Bike size={62} className="text-[#F0A868]" strokeWidth={1.2} />
                  <span className={`absolute right-3 top-3 rounded-full px-[11px] py-1 text-xs font-semibold ${st.cls}`}>{st.label}</span>
                </div>
                {/* corpo */}
                <div className="flex flex-1 flex-col p-[18px]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">{v.make}</div>
                      <h3 className="font-[Poppins] text-[18px] font-bold leading-tight">{v.model}</h3>
                      <div className="mt-0.5 text-xs text-[#B4ACA6]">{v.year}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-[Poppins] text-[17px] font-bold text-primary">{brl(v.price)}</div>
                    </div>
                  </div>

                  {/* specs técnicos */}
                  <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3.5">
                    <Spec icon={Zap} label="Motor" value={v.motorW ? `${v.motorW} W` : '—'} />
                    <Spec icon={Gauge} label="Velocidade" value={v.maxSpeed ? `${v.maxSpeed} km/h` : '—'} />
                    <Spec icon={MapPin} label="Autonomia" value={v.rangeKm ? `até ${v.rangeKm} km` : '—'} />
                    <Spec icon={BatteryCharging} label="Bateria" value={v.battery ?? '—'} />
                  </div>

                  {/* classificação legal */}
                  <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-[#FDF8F2] px-3 py-2.5">
                    <span className={`rounded-full px-[10px] py-0.5 text-[11px] font-semibold ${lc.cls}`}>{lc.label}</span>
                    <span className="text-[11.5px] text-muted-foreground">{lc.hint}</span>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && <div className="col-span-full py-16 text-center text-sm text-muted-foreground">Nenhum veículo encontrado.</div>}
        </div>
      )}

      {!loading && !error && (
        <p className="mt-5 text-center text-xs text-muted-foreground">
          {filtered.length} de {list.length} veículos · dados da tabela <b>Vehicle</b> · classificação conforme Resolução CONTRAN 996/2023
        </p>
      )}
    </>
  )
}
