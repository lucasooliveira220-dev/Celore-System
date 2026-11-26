import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Query 6: Daily Operational Report
// All billing activity (sales + services) for a given date
// Query 9: Revenue Summary — sales vs service revenue per date
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

  // Q6: daily report
  const [daily]: any = await pool.query(`
    SELECT c.Name, v.Price, COALESCE(serv.Final_Cost, v.Price) AS Amount, b.Date,
           CASE WHEN b.Sale_ID IS NOT NULL THEN 'Sale' ELSE 'Service' END AS Transaction_Type
    FROM Sales s RIGHT JOIN Billing b ON s.Sale_ID = b.Sale_ID
    LEFT JOIN Service serv ON serv.Service_ID = b.Serv_ID
    JOIN Customer c ON c.Customer_ID = b.C_ID
    LEFT JOIN Vehicle v ON v.VIN = s.VIN
    WHERE b.Date = ?
  `, [date])

  // Q9: revenue summary across all dates
  const [revenue]: any = await pool.query(`
    SELECT b.Date, SUM(serv.Final_Cost) AS service_revenue, SUM(v.Price) AS sales_revenue
    FROM Billing b
    LEFT JOIN Service serv ON b.Serv_ID = serv.Service_ID
    LEFT JOIN Sales s ON s.Sale_ID = b.Sale_ID
    LEFT JOIN Vehicle v ON v.VIN = s.VIN
    GROUP BY b.Date
    ORDER BY b.Date DESC
  `)

  const totalSales   = daily.filter((r: any) => r.Transaction_Type === 'Sale').reduce((s: number, r: any) => s + Number(r.Amount || 0), 0)
  const totalService = daily.filter((r: any) => r.Transaction_Type === 'Service').reduce((s: number, r: any) => s + Number(r.Amount || 0), 0)

  return NextResponse.json({
    date,
    summary: {
      total_transactions: daily.length,
      sales_revenue: totalSales,
      service_revenue: totalService,
      total_revenue: totalSales + totalService,
    },
    daily,
    revenue,
  })
}
