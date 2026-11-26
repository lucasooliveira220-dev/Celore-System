import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')

  let query = 'SELECT * FROM Customer WHERE 1=1'
  const params: string[] = []

  if (search) {
    query += ' AND (Name LIKE ? OR Email LIKE ? OR P_Number LIKE ?)'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  query += ' ORDER BY Name'

  const [rows] = await pool.query(query, params)
  return NextResponse.json(rows)
}

// Query 3: Insert a new Customer into the Database
// Idempotent — skips insert if email already exists
export async function POST(req: NextRequest) {
  const { Name, Address, P_Number, Email, Type } = await req.json()

  const [result]: any = await pool.query(
    `INSERT INTO Customer (Name, Address, P_Number, Email, Type)
     SELECT * FROM (SELECT ?, ?, ?, ?, ?) AS tmp
     WHERE NOT EXISTS (SELECT 1 FROM Customer WHERE Email = ?)`,
    [Name, Address, P_Number, Email, Type, Email]
  )

  if (result.affectedRows === 0) {
    return NextResponse.json({ success: false, reason: 'Email already exists' }, { status: 409 })
  }
  return NextResponse.json({ success: true, Customer_ID: result.insertId }, { status: 201 })
}
