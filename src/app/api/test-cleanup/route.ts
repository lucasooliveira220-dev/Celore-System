import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function DELETE() {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    // Delete test service records
    await conn.query(`
      DELETE sm FROM ServiceMechanic sm
      JOIN ServiceRecord sr ON sm.service_id = sr.service_id
      WHERE sr.vin LIKE 'PWTEST%'
    `)
    await conn.query("DELETE FROM ServiceRecord WHERE vin LIKE 'PWTEST%'")

    // Delete test sales
    await conn.query("DELETE FROM Sale WHERE vin LIKE 'PWTEST%'")

    // Delete test vehicles
    await conn.query("DELETE FROM Vehicle WHERE vin LIKE 'PWTEST%'")

    // Delete test customers
    await conn.query("DELETE FROM Customer WHERE first_name = 'Playwright'")

    await conn.commit()
    return NextResponse.json({ success: true })
  } catch (err) {
    await conn.rollback()
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  } finally {
    conn.release()
  }
}
