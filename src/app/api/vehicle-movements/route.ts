import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET  → últimas movimentações de veículos
// POST → registra entrada/saída { make, model, type, quantity, note }
export async function GET() {
  const [rows] = await pool.query(`
    SELECT Movement_ID AS id, Make AS make, Model AS model, Type AS type,
           Quantity AS quantity, Movement_Date AS date, Note AS note
    FROM VehicleMovement
    ORDER BY Movement_Date DESC, Movement_ID DESC
    LIMIT 50
  `)
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const { make, model, type, quantity, note } = await req.json()
  if (!make || !model || !type || !quantity) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }
  // entrada = positivo, saída = negativo
  const qty = type === 'out' ? -Math.abs(Number(quantity)) : Math.abs(Number(quantity))
  await pool.query(
    'INSERT INTO VehicleMovement (Make, Model, Type, Quantity, Note) VALUES (?, ?, ?, ?, ?)',
    [make, model, type, qty, note || null],
  )
  return NextResponse.json({ success: true })
}
