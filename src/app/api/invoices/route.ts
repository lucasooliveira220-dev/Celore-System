import { NextResponse } from 'next/server'
import pool from '@/lib/db'
export async function GET() {
  const [rows] = await pool.query(`
    SELECT Invoice_ID AS id, Number AS number, Kind AS kind,
           Issue_Date AS issueDate, Total AS total, XML_Imported AS xmlImported
    FROM Invoice ORDER BY Issue_Date DESC
  `)
  return NextResponse.json(rows)
}
