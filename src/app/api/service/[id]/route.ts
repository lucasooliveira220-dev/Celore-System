import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Complete a service record: fills in End_Mileage, Work_Performed, Final_Cost, creates Billing
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { End_Mileage, Work_Performed, Final_Cost, Payment_Method, C_ID } = await req.json()

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    // Get VIN for this service record
    const [rows]: any = await conn.query('SELECT VIN FROM Service WHERE Service_ID = ?', [id])
    const VIN = rows[0]?.VIN

    await conn.query(
      'UPDATE Service SET End_Mileage = ?, Work_Performed = ?, Final_Cost = ? WHERE Service_ID = ?',
      [End_Mileage, Work_Performed, Final_Cost, id]
    )

    await conn.query(
      'INSERT INTO Billing (Sale_ID, Serv_ID, C_ID, Payment_Method, Date) VALUES (NULL, ?, ?, ?, CURDATE())',
      [id, C_ID, Payment_Method]
    )

    // Check if any other open service records exist for this vehicle
    const [open]: any = await conn.query(
      'SELECT Service_ID FROM Service WHERE VIN = ? AND Final_Cost IS NULL AND Service_ID != ?',
      [VIN, id]
    )
    if (open.length === 0) {
      await conn.query("UPDATE Vehicle SET Status = 'inventory' WHERE VIN = ?", [VIN])
    }

    await conn.commit()
    return NextResponse.json({ success: true })
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}
