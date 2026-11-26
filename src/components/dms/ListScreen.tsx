'use client'

import { useEffect, useState } from 'react'

export type Col = { key: string; label: string; align?: 'left' | 'center' | 'right'; render?: (row: any) => React.ReactNode }

export function brl(n: number | null) {
  return n == null ? '—' : 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
export function fmtDate(d: string | null) {
  return d ? new Date(d).toLocaleDateString('pt-BR') : '—'
}
export function fmtDateTime(d: string | null) {
  return d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
}
export function Pill({ label, cls }: { label: string; cls: string }) {
  return <span className={`inline-block rounded-full px-[11px] py-1 text-xs font-semibold ${cls}`}>{label}</span>
}

export default function ListScreen({
  title, subtitle, endpoint, columns, source, empty = 'Nenhum registro encontrado.',
}: {
  title: string; subtitle: string; endpoint: string; columns: Col[]; source: string; empty?: string
}) {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(endpoint)
      .then((r) => { if (!r.ok) throw new Error('Falha ao carregar'); return r.json() })
      .then((d) => setRows(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [endpoint])

  return (
    <>
      <div className="mb-[22px] mt-1.5">
        <h1 className="text-[28px] font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FDF8F2]">
              {columns.map((c) => (
                <th key={c.key} className={`border-b border-border px-[18px] py-[15px] text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6] ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'}`}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={columns.length} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Carregando...</td></tr>}
            {error && !loading && <tr><td colSpan={columns.length} className="px-[18px] py-10 text-center text-sm text-[#DC2626]">{error}.</td></tr>}
            {!loading && !error && rows.map((row, i) => (
              <tr key={i} className="border-t border-border transition hover:bg-[#FDF8F2]">
                {columns.map((c) => (
                  <td key={c.key} className={`px-[18px] py-[13px] text-[13.5px] ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'}`}>
                    {c.render ? c.render(row) : (row[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
            {!loading && !error && rows.length === 0 && <tr><td colSpan={columns.length} className="px-[18px] py-10 text-center text-sm text-muted-foreground">{empty}</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-border bg-[#FDF8F2] px-[18px] py-[13px] text-[13px] text-muted-foreground">
          <span>{rows.length} registro(s)</span>
          <span dangerouslySetInnerHTML={{ __html: source }} />
        </div>
      </div>
    </>
  )
}
