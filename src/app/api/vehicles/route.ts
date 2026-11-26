import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Query 7: Available Inventory — all vehicles in inventory ordered by location
// Also supports search/status filter for the salesperson inventory tab
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  let query = `
    SELECT v.VIN, v.Make, v.Model, v.Year, v.Price, v.Status, i.Location
    FROM Vehicle v
    LEFT JOIN Inventory i ON v.VIN = i.VIN
    WHERE 1=1
  `
  const params: string[] = []

  if (status) {
    query += ' AND v.Status = ?'
    params.push(status)
  }
  if (search) {
    query += ' AND (v.Make LIKE ? OR v.Model LIKE ? OR v.VIN LIKE ?)'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  query += ' ORDER BY i.Location, v.Make, v.Model'

  const [rows] = await pool.query(query, params)
  return NextResponse.json(rows)
}

// Query 4: Insert a new Vehicle into the Database
// Transactional: inserts Vehicle then Inventory row atomically
export async function POST(req: NextRequest) {
  const { VIN, Make, Model, Year, Price, Location } = await req.json()

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    await conn.query(
      'INSERT INTO Vehicle (VIN, Make, Model, Year, Price, Status) VALUES (?, ?, ?, ?, ?, ?)',
      [VIN, Make, Model, Year, Price, 'inventory']
    )
    await conn.query(
      'INSERT INTO Inventory (VIN, `Location`) VALUES (?, ?)',
      [VIN, Location || 'main_lot']
    )

    await conn.commit()
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}
