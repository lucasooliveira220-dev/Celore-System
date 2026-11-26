'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calculator, Bike, CircleDollarSign, Percent, CalendarClock } from 'lucide-react'

type Vehicle = { vin: string; make: string; model: string; price: number; status: string }

const brl = (n: number) => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function SimulacaoPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [vin, setVin] = useState('')
  const [entrada, setEntrada] = useState('')
  const [parcelas, setParcelas] = useState(12)
  const [taxa, setTaxa] = useState('1.99')

  useEffect(() => {
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((d: Vehicle[]) => setVehicles(d.filter((v) => v.status === 'inventory')))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const selected = vehicles.find((v) => v.vin === vin) || null
  const price = selected ? Number(selected.price) : 0

  const sim = useMemo(() => {
    if (!selected) return null
    const down = Math.min(Number(entrada) || 0, price)
    const financed = Math.max(price - down, 0)
    const i = (Number(taxa) || 0) / 100
    let parcela: number
    if (financed <= 0) parcela = 0
    else if (i === 0) parcela = financed / parcelas
    else parcela = (financed * i) / (1 - Math.pow(1 + i, -parcelas)) // Tabela Price (PMT)
    const totalParcelado = parcela * parcelas
    const total = totalParcelado + down
    const juros = total - price
    return { down, financed, parcela, totalParcelado, total, juros }
  }, [selected, entrada, parcelas, taxa, price])

  const field = 'w-full rounded-[10px] border border-border bg-card px-3 py-[11px] text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15'
  const lbl = 'mb-1.5 flex items-center gap-2 text-[13px] font-semibold'

  return (
    <>
      <div className="mb-[22px] mt-1.5">
        <h1 className="text-[28px] font-bold tracking-tight">Simulação de Venda</h1>
        <p className="mt-1 text-sm text-muted-foreground">Simule o financiamento de uma moto antes de fechar a venda.</p>
      </div>

      <div className="grid gap-[18px] lg:grid-cols-[1fr_1.1fr]">
        {/* painel de entrada */}
        <div className="rounded-[16px] border border-border bg-card p-[22px] shadow-sm">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="grid h-[42px] w-[42px] place-items-center rounded-[11px] bg-[#FFF3E3] text-primary"><Calculator size={21} /></div>
            <h2 className="text-base font-semibold">Dados da simulação</h2>
          </div>

          <div className="grid gap-4">
            <div>
              <label className={lbl}><Bike size={15} className="text-primary" /> Veículo</label>
              <select className={field} value={vin} onChange={(e) => setVin(e.target.value)} disabled={loading}>
                <option value="">{loading ? 'Carregando...' : 'Selecione a moto...'}</option>
                {vehicles.map((v) => <option key={v.vin} value={v.vin}>{v.make} {v.model} — {brl(v.price)}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}><CircleDollarSign size={15} className="text-primary" /> Entrada (R$)</label>
              <input type="number" className={field} value={entrada} onChange={(e) => setEntrada(e.target.value)} placeholder="ex: 2000" disabled={!selected} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}><CalendarClock size={15} className="text-primary" /> Parcelas</label>
                <select className={field} value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))} disabled={!selected}>
                  {[6, 12, 18, 24, 36, 48].map((n) => <option key={n} value={n}>{n}x</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}><Percent size={15} className="text-primary" /> Juros (% a.m.)</label>
                <input type="number" step="0.01" className={field} value={taxa} onChange={(e) => setTaxa(e.target.value)} disabled={!selected} />
              </div>
            </div>
          </div>
        </div>

        {/* painel de resultado */}
        <div className="rounded-[16px] border border-border bg-gradient-to-br from-[#FFF6EC] to-[#FDEFE0] p-[22px] shadow-sm">
          {!selected ? (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-muted-foreground">
              <Calculator size={44} className="mb-3 text-[#F0A868]" strokeWidth={1.3} />
              <p className="text-sm">Selecione uma moto para ver a simulação.</p>
            </div>
          ) : sim && (
            <>
              <div className="mb-4">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">{selected.make}</div>
                <h2 className="font-[Poppins] text-[22px] font-bold leading-tight">{selected.model}</h2>
                <div className="mt-1 text-sm text-muted-foreground">Valor: <b className="text-foreground">{brl(price)}</b></div>
              </div>

              {/* parcela em destaque */}
              <div className="rounded-[14px] border border-[#FCE4CE] bg-white p-5 text-center shadow-sm">
                <div className="text-[13px] font-medium text-muted-foreground">{parcelas}x de</div>
                <div className="font-[Poppins] text-[34px] font-bold text-primary">{brl(sim.parcela)}</div>
                {sim.financed <= 0 && <div className="mt-1 text-xs text-[#16A34A]">Pago à vista com a entrada</div>}
              </div>

              {/* detalhamento */}
              <div className="mt-5 grid gap-2.5">
                {[
                  ['Entrada', brl(sim.down)],
                  ['Valor financiado', brl(sim.financed)],
                  ['Total das parcelas', brl(sim.totalParcelado)],
                  ['Juros total', brl(sim.juros)],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between rounded-[10px] bg-white/70 px-4 py-2.5 text-[13.5px]">
                    <span className="font-medium text-muted-foreground">{k}</span>
                    <span className="font-[Poppins] font-semibold">{v}</span>
                  </div>
                ))}
                <div className="mt-1 flex items-center justify-between rounded-[12px] bg-primary px-4 py-3 text-white">
                  <span className="text-[13.5px] font-semibold">Total a prazo</span>
                  <span className="font-[Poppins] text-[17px] font-bold">{brl(sim.total)}</span>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">Simulação pela Tabela Price. Valores aproximados, sujeitos a análise de crédito.</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
