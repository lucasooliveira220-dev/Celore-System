'use client'

import { useEffect, useState } from 'react'
import { Users, Shield, Check, X, Plus, UserCog } from 'lucide-react'

type SysUser = {
  id: number
  username: string
  role: 'admin' | 'salesperson' | 'mechanic' | 'billing' | 'stock'
  active: number
  employee: string | null
}

const ROLE: Record<string, { label: string; cls: string }> = {
  admin: { label: 'Administrador', cls: 'bg-[#FFF3E3] text-[#E25812]' },
  salesperson: { label: 'Vendedor', cls: 'bg-[#E8F0FE] text-[#2563EB]' },
  mechanic: { label: 'Mecânico', cls: 'bg-[#F3ECE4] text-[#905B31]' },
  billing: { label: 'Faturamento', cls: 'bg-[#E9F7EE] text-[#16A34A]' },
  stock: { label: 'Estoque', cls: 'bg-[#FEF4E0] text-[#B7791F]' },
}

// "igor.bernardino" -> "Igor Bernardino"
function displayName(u: SysUser) {
  if (u.employee) return u.employee
  return u.username
    .split(/[.\s]+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

export default function ConfigPage() {
  const [users, setUsers] = useState<SysUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/users')
      .then((r) => { if (!r.ok) throw new Error('Falha ao carregar usuários'); return r.json() })
      .then((d: SysUser[]) => setUsers(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="mb-[22px] mt-1.5 flex items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Configurações</h1>
          <p className="mt-1 text-sm text-muted-foreground">Usuários, permissões e preferências do sistema.</p>
        </div>
        <div className="flex-1" />
        <button className="flex items-center gap-2 rounded-[11px] bg-primary px-[18px] py-[11px] text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(226,88,18,0.5)] transition hover:bg-[#E25812]">
          <Plus size={16} strokeWidth={2.2} /> Novo usuário
        </button>
      </div>

      <div className="mb-[15px] flex items-center gap-[10px]">
        <UserCog size={20} className="text-primary" />
        <h2 className="text-base font-semibold">Usuários do sistema</h2>
        <span className="rounded-full bg-[#FFF3E3] px-[9px] py-0.5 text-xs font-medium text-muted-foreground">{users.length}</span>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FDF8F2]">
              {['Usuário', 'Papel', 'Status'].map((h, i) => (
                <th key={h} className={`border-b border-border px-[18px] py-[15px] text-[11.5px] font-semibold uppercase tracking-wide text-[#B4ACA6] ${i === 2 ? 'text-center' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={3} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Carregando...</td></tr>}
            {error && !loading && <tr><td colSpan={3} className="px-[18px] py-10 text-center text-sm text-[#DC2626]">{error}.</td></tr>}
            {!loading && !error && users.map((u) => {
              const role = ROLE[u.role] ?? { label: u.role, cls: 'bg-[#F3ECE4] text-[#905B31]' }
              const name = displayName(u)
              const initials = name.split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase()
              return (
                <tr key={u.id} className="border-t border-border transition hover:bg-[#FDF8F2]">
                  <td className="px-[18px] py-[13px]">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full text-xs font-semibold text-white" style={{ background: 'linear-gradient(150deg, #FF810F, #E25812)' }}>{initials}</div>
                      <div>
                        <div className="text-[13.5px] font-semibold">{name}</div>
                        <div className="mt-px text-xs text-[#B4ACA6]">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-[18px] py-[13px]"><span className={`inline-flex items-center gap-1.5 rounded-full px-[11px] py-1 text-xs font-semibold ${role.cls}`}><Shield size={12} /> {role.label}</span></td>
                  <td className="px-[18px] py-[13px] text-center">
                    {u.active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F7EE] px-[11px] py-1 text-xs font-semibold text-[#16A34A]"><Check size={12} /> Ativo</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F3ECE4] px-[11px] py-1 text-xs font-semibold text-[#905B31]"><X size={12} /> Inativo</span>
                    )}
                  </td>
                </tr>
              )
            })}
            {!loading && !error && users.length === 0 && <tr><td colSpan={3} className="px-[18px] py-10 text-center text-sm text-muted-foreground">Nenhum usuário.</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-border bg-[#FDF8F2] px-[18px] py-[13px] text-[13px] text-muted-foreground">
          <span>{users.length} usuários</span><span>tabela <b>AppUser</b></span>
        </div>
      </div>

      <div className="mt-5 rounded-[16px] border border-border bg-card p-[22px] shadow-sm">
        <div className="flex items-center gap-[10px]">
          <Users size={20} className="text-primary" />
          <h2 className="text-base font-semibold">Sobre as permissões</h2>
        </div>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
          Cada usuário tem um papel (administrador, vendedor, mecânico, faturamento ou estoque) que define o que ele pode acessar.
          Quando o login for implementado, esses papéis vão controlar quais telas e ações ficam disponíveis para cada pessoa —
          e os atalhos da tela inicial passam a ser individuais por usuário.
        </p>
      </div>
    </>
  )
}
