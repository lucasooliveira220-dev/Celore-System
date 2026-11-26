import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Query 10: Mechanic Workload — job count per mechanic, ranked busiest first
export async function GET() {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS workload, e.Name
    FROM ServiceEmployee se
    JOIN Employee e ON se.E_ID = e.Employee_ID
    GROUP BY e.Name
    ORDER BY workload DESC
  `)
  return NextResponse.json(rows)
}
