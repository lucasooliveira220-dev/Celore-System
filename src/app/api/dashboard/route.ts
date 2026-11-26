import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Indicadores da operação (dados reais do banco) + quebra de status da oficina.
export async function GET() {
  const [[stock]]: any = await pool.query(
    "SELECT COUNT(*) AS n FROM Vehicle WHERE Status = 'inventory'",
  )
  const [[openOS]]: any = await pool.query(
    "SELECT COUNT(*) AS n FROM Service WHERE Status NOT IN ('faturada', 'cancelada')",
  )
  const [[salesCount]]: any = await pool.query('SELECT COUNT(*) AS n FROM Sales')
  const [[revenue]]: any = await pool.query(
    'SELECT COALESCE(SUM(v.Price), 0) AS total FROM Sales s JOIN Vehicle v ON s.VIN = v.VIN',
  )
  const [[lowStock]]: any = await pool.query(
    'SELECT COUNT(*) AS n FROM PartStock WHERE On_Hand < Min_Stock',
  )
  const [workshop] = await pool.query(
    'SELECT Status AS status, COUNT(*) AS count FROM Service GROUP BY Status',
  )

  return NextResponse.json({
    kpis: {
      vehiclesInStock: stock.n,
      openServiceOrders: openOS.n,
      salesCount: salesCount.n,
      salesRevenue: Number(revenue.total),
      lowStockParts: lowStock.n,
    },
    workshop,
  })
}
