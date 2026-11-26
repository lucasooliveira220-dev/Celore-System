import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Usuário atual = id guardado no cookie de sessão (definido no login).
function currentUserId(req: NextRequest): number | null {
  const raw = req.cookies.get('celore_uid')?.value
  const id = raw ? Number(raw) : NaN
  return Number.isFinite(id) ? id : null
}

// GET → function keys favoritadas do usuário logado
export async function GET(req: NextRequest) {
  const uid = currentUserId(req)
  if (!uid) return NextResponse.json([])
  const [rows]: any = await pool.query(
    'SELECT Function_Key AS functionKey FROM UserFavorite WHERE User_ID = ? ORDER BY Position',
    [uid],
  )
  return NextResponse.json(rows.map((r: any) => r.functionKey))
}

// POST { key } → fixa um atalho
export async function POST(req: NextRequest) {
  const uid = currentUserId(req)
  if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  const { key } = await req.json()
  if (!key) return NextResponse.json({ error: 'key ausente' }, { status: 400 })

  const [[{ nextPos }]]: any = await pool.query(
    'SELECT COALESCE(MAX(Position), -1) + 1 AS nextPos FROM UserFavorite WHERE User_ID = ?',
    [uid],
  )
  await pool.query(
    `INSERT INTO UserFavorite (User_ID, Function_Key, Position) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE Position = Position`,
    [uid, key, nextPos],
  )
  return NextResponse.json({ success: true })
}

// DELETE { key } → remove um atalho
export async function DELETE(req: NextRequest) {
  const uid = currentUserId(req)
  if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  const { key } = await req.json()
  if (!key) return NextResponse.json({ error: 'key ausente' }, { status: 400 })

  await pool.query('DELETE FROM UserFavorite WHERE User_ID = ? AND Function_Key = ?', [uid, key])
  return NextResponse.json({ success: true })
}
