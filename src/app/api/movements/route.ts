import { NextResponse } from 'next/server'
import pool from '@/lib/db'
export async function GET() {
  const [rows] = await pool.query(`
    SELECT m.Movement_ID AS id, p.Code AS code, p.Description AS part,
           m.Type AS type, m.Quantity AS quantity, m.Origin AS origin,
           m.Movement_Date AS date, m.Note AS note
    FROM StockMovement m JOIN Part p ON m.Part_ID = p.Part_ID
    ORDER BY m.Movement_Date DESC, m.Movement_ID DESC
  `)
  return NextResponse.json(rows)
}
