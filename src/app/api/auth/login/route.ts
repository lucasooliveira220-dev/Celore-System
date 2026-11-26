import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'

// Valida usuário e senha; em caso de sucesso, cria a sessão (cookie).
export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: 'Informe usuário e senha' }, { status: 400 })
  }

  const [rows]: any = await pool.query(
    `SELECT u.User_ID AS id, u.Username AS username, u.Password_Hash AS hash,
            u.Role AS role, u.Active AS active, e.Name AS employee
     FROM AppUser u LEFT JOIN Employee e ON u.Employee_ID = e.Employee_ID
     WHERE u.Username = ? LIMIT 1`,
    [username.trim()],
  )
  const user = rows[0]

  if (!user || !user.active) {
    return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 })
  }
  const ok = await bcrypt.compare(password, user.hash)
  if (!ok) {
    return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 })
  }

  const res = NextResponse.json({
    id: user.id, username: user.username, role: user.role, employee: user.employee,
  })
  // sessão simples: cookie httpOnly com o id do usuário
  res.cookies.set('celore_uid', String(user.id), {
    httpOnly: true, path: '/', sameSite: 'lax', maxAge: 60 * 60 * 8, // 8 horas
  })
  return res
}
