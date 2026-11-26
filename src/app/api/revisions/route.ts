import { NextResponse } from 'next/server'
import pool from '@/lib/db'
export async function GET() {
  const [rows] = await pool.query(`
    SELECT r.Revision_ID AS id, v.Make AS make, v.Model AS model, r.VIN AS vin,
           r.Plan_Mileage AS mileage, r.Due_Date AS dueDate, r.Status AS status
    FROM Revision r JOIN Vehicle v ON r.VIN = v.VIN
    ORDER BY r.Due_Date
  `)
  return NextResponse.json(rows)
}
