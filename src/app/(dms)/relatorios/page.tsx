'use client'

import { useState } from 'react'
import {
  FileSpreadsheet, Printer, Calendar, ShoppingCart, Wrench, Package,
  CircleDollarSign, FileBarChart,
} from 'lucide-react'

type Col = { key: string; label: string }
type ReportData = { title: string; columns: Col[]; rows: any[] }

const TYPES = [
  { key: 'vendas', label: 'Vendas', icon: ShoppingCart },
  { key: 'servicos', label: 'Serviços', icon: Wrench },
  { key: 'estoque', label: 'Estoque', icon: Package },
  { key: 'financeiro', label: 'Financeiro', icon: CircleDollarSign },
]

const brl = (n: any) => (n == null || isNaN(Number(n)) ? String(n ?? '—') : 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
const isMoney = (key: string) => /valor|amount|custo/i.test(key)

export default function RelatoriosPage() {
  const today = new Date().toISOString().split('T')[0]
  const [type, setType] = useState('vendas')
  const [start, setStart] = useState('2026-06-01')
  const [end, setEnd] = useState(today)
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true); setError(null)
    try {
      const r = await fetch(`/api/reports/data?type=${type}&start=${start}&end=${end}`)
      if (!r.ok) throw new Error('Falha ao gerar o relatório')
      const d: ReportData = await r.json()
      setData(d)
    } catch (e: any) { setError(e.message); setData(null) } finally { setLoading(false) }
  }

  const total = data
    ? data.rows.reduce((a, row) => {
        const moneyCol = data.columns.find((c) => isMoney(c.key))
        return moneyCol ? a + (Number(row[moneyCol.key]) || 0) : a
      }, 0)
    : 0
  const hasMoney = data?.columns.some((c) => isMoney(c.key))

  async function exportExcel() {
    if (!data) return
    const XLSX = await import('xlsx')
    // monta linhas com os rótulos das colunas
    const aoa = data.rows.map((row) => {
      const o: Record<string, any> = {}
      data.columns.forEach((c) => { o[c.label] = row[c.key] })
      return o
    })
    const ws = XLSX.utils.json_to_sheet(aoa)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório')
    const nome = `${data.title.replace(/[^\w]+/g, '_')}_${start}_a_${end}.xlsx`
    XLSX.writeFile(wb, nome)
  }

  function printPDF() {
    if (!data) return
    const head = data.columns.map((c) => `<th>${c.label}</th>`).join('')
    const body = data.rows.map((row) =>
      '<tr>' + data.columns.map((c) => `<td${isMoney(c.key) ? ' class="r"' : ''}>${isMoney(c.key) ? brl(row[c.key]) : (row[c.key] ?? '—')}</td>`).join('') + '</tr>'
    ).join('')
    const totalRow = hasMoney ? `<tr class="tot"><td colspan="${data.columns.length - 1}">Total</td><td class="r">${brl(total)}</td></tr>` : ''
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`
      <html><head><title>${data.title}</title><meta charset="utf-8">
      <style>
        body{font-family:Arial,sans-serif;color:#1C1917;padding:32px}
        h1{font-size:20px;margin:0 0 4px}.sub{color:#777;font-size:13px;margin-bottom:20px}
        table{width:100%;border-collapse:collapse;font-size:12.5px}
        th{background:#FF6900;color:#fff;text-align:left;padding:8px 10px}
        td{padding:7px 10px;border-bottom:1px solid #eee}.r{text-align:right}
        .tot{font-weight:bold;background:#FFF3E3}.tot td{border-top:2px solid #FF6900}
        .brand{color:#FF6900;font-weight:bold}
      </style></head><body>
      <div class="brand">Celore DMS</div>
      <h1>${data.title}</h1>
      <div class="sub">Período: ${start.split('-').reverse().join('/')} a ${end.split('-').reverse().join('/')} · ${data.rows.length} registro(s)</div>
      <table><thead><tr>${head}</tr></thead><tbody>${body}${totalRow}</tbody></table>
      </body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 300)
  }

  return (
    <>
      <div className="mb-[22px] mt-1.5">
        <h1 className="text-[28px] font-bold tracking-tight">Relatórios</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gere relatórios por período e exporte em Excel ou PDF.</p>
      </div>

      {/* painel de configuração */}
      <div className="mb-6 rounded-[16px] border border-border bg-card p-[22px] shadow-sm">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-[42px] w-[42px] place-items-center rounded-[11px] bg-[#FFF3E3] text-primary"><FileBarChart size={21} /></div>
          <h2 className="text-base font-semibold">Configurar relatório</h2>
        </div>

        {/* tipo */}
        <div className="mb-4">
          <label className="mb-2 block text-[13px] font-semibold">Tipo de relatório</label>
          <div className="flex flex-wrap gap-2.5">
            {TYPES.map((t) => {
              const Icon = t.icon
              const active = type === t.key
              return (
                <button key={t.key} onClick={() => { setType(t.key); setData(null) }}
                  className={`flex items-center gap-2 rounded-[11px] border px-[16px] py-[10px] text-sm font-semibold transition ${active ? 'border-primary bg-primary text-white shadow-[0_8px_20px_-8px_rgba(226,88,18,0.5)]' : 'border-border bg-card text-muted-foreground hover:border-[#FBD9BC]'}`}>
                  <Icon size={16} /> {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* período */}
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold"><Calendar size={14} className="text-primary" /> De</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="rounded-[10px] border border-border bg-card px-3 py-[10px] text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold"><Calendar size={14} className="text-primary" /> Até</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="rounded-[10px] border border-border bg-card px-3 py-[10px] text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15" />
          </div>
          <button onClick={generate} disabled={loading} className="rounded-[11px] bg-primary px-[22px] py-[11px] text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(226,88,18,0.5)] transition hover:bg-[#E25812] disabled:opacity-50">
            {loading ? 'Gerando...' : 'Gerar relatório'}
          </button>
        </div>
      </div>

      {error && <div className="rounded-[16px] border border-[#FDECEC] bg-[#FDECEC] px-5 py-4 text-sm text-[#DC2626]">{error}.</div>}

      {/* resultado */}
      {data && !error && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div>
              <h2 className="font-[Poppins] text-[18px] font-bold">{data.title}</h2>
              <p className="text-[13px] text-muted-foreground">{data.rows.length} registro(s) no período{hasMoney ? ` · total ${brl(total)}` : ''}</p>
            </div>
            <div className="flex-1" />
            <button onClick={exportExcel} disabled={!data.rows.length} className="flex items-center gap-2 rounded-[10px] border border-border bg-card px-[16px] py-[10px] text-[13.5px] font-semibold text-[#16A34A] shadow-sm transition hover:bg-[#E9F7EE] disabled:opacity-50">
              <FileSpreadsheet size={16} /> Exportar Excel
            </button>
            <button onClick={printPDF} disabled={!data.rows.length} className="flex items-center gap-2 rounded-[10px] border border-border bg-card px-[16px] py-[10px] text-[13.5px] font-semibold text-[#DC2626] shadow-sm transition hover:bg-[#FDECEC] disabled:opacity-50">
              <Printer size={16} /> Imprimir / PDF
            </button>
          </div>

          <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FDF8F2]">
                    {data.columns.map((c) => (
                      <th key={c.key} className={`border-b border-border px-[18px] py-[13px] text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6] ${isMoney(c.key) ? 'text-right' : 'text-left'}`}>{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, i) => (
                    <tr key={i} className="border-t border-border transition hover:bg-[#FDF8F2]">
                      {data.columns.map((c) => (
                        <td key={c.key} className={`px-[18px] py-[11px] text-[13px] ${isMoney(c.key) ? 'text-right font-[Poppins] font-semibold' : ''}`}>
                          {isMoney(c.key) ? brl(row[c.key]) : (row[c.key] ?? '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {data.rows.length === 0 && (
                    <tr><td colSpan={data.columns.length} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Nenhum registro nesse período.</td></tr>
                  )}
                </tbody>
                {hasMoney && data.rows.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-border bg-[#FDF8F2]">
                      <td colSpan={data.columns.length - 1} className="px-[18px] py-[13px] font-[Poppins] text-sm font-bold">Total</td>
                      <td className="px-[18px] py-[13px] text-right font-[Poppins] text-sm font-bold text-primary">{brl(total)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </>
      )}

      {!data && !error && !loading && (
        <div className="rounded-[16px] border-2 border-dashed border-border py-16 text-center text-muted-foreground">
          <FileBarChart size={40} className="mx-auto mb-3 text-[#B4ACA6]" strokeWidth={1.3} />
          Escolha o tipo e o período, e clique em <b className="text-foreground">Gerar relatório</b>.
        </div>
      )}
    </>
  )
}
