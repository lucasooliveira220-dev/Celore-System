import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Lista de peças com saldo em tempo real.
// O saldo (On_Hand) vem da view PartStock, que soma o StockMovement.
export async function GET() {
  const [rows] = await pool.query(`
    SELECT
      p.Part_ID    AS id,
      p.Code       AS code,
      p.Description AS description,
      p.Category   AS category,
      p.Unit       AS unit,
      p.Sale_Price AS price,
      p.Min_Stock  AS minStock,
      ps.On_Hand   AS onHand
    FROM Part p
    JOIN PartStock ps ON ps.Part_ID = p.Part_ID
    ORDER BY p.Description
  `)
  return NextResponse.json(rows)
}
