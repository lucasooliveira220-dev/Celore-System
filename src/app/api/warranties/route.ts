import { NextResponse } from 'next/server'
import pool from '@/lib/db'
export async function GET() {
  const [rows] = await pool.query(`
    SELECT w.Warranty_ID AS id, w.Coverage AS coverage, w.VIN AS vin,
           w.Start_Date AS startDate, w.End_Date AS endDate, w.Terms AS terms,
           p.Description AS part
    FROM Warranty w LEFT JOIN Part p ON w.Part_ID = p.Part_ID
    ORDER BY w.End_Date DESC
  `)
  return NextResponse.json(rows)
}
