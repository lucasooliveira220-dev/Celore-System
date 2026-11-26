import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Ficha Kardex de uma peça: dados da peça + extrato de movimentações
// com saldo acumulado (view KardexView, que usa window function).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const partCode = decodeURIComponent(code)

  const [partRows]: any = await pool.query(
    `SELECT p.Code AS code, p.Description AS description, p.Category AS category,
            p.Sale_Price AS price, p.Min_Stock AS minStock, ps.On_Hand AS onHand
     FROM Part p
     JOIN PartStock ps ON ps.Part_ID = p.Part_ID
     WHERE p.Code = ?`,
    [partCode],
  )

  if (!partRows.length) {
    return NextResponse.json({ error: 'Peça não encontrada' }, { status: 404 })
  }

  const [movements] = await pool.query(
    `SELECT Movement_Date AS date, Type AS type, Quantity AS quantity, Balance AS balance
     FROM KardexView
     WHERE Code = ?
     ORDER BY Movement_Date`,
    [partCode],
  )

  return NextResponse.json({ part: partRows[0], movements })
}
