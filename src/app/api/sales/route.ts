import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// View: SalespersonSales — uses the SalespersonSales view for the core Vehicle+Customer join,
// extended with Sale_ID, Temp_Tag, Customization, and Billing columns not present in the view
export async function GET() {
  const [rows] = await pool.query(`
    SELECT sv.VIN, sv.Year, sv.Make, sv.Model, sv.Price,
           sv.Customer_Name AS customer, sv.Date,
           s.Sale_ID, s.Temp_Tag, s.Customization,
           b.Payment_Method, b.Billing_ID
    FROM SalespersonSales sv
    JOIN Sales s ON sv.VIN = s.VIN AND sv.Date = s.Date
    LEFT JOIN Billing b ON b.Sale_ID = s.Sale_ID
    ORDER BY sv.Date DESC
  `)
  return NextResponse.json(rows)
}

// Query 5: Sell a Vehicle
// Transactional: marks vehicle sold, inserts Sale record, removes from Inventory, creates Billing
export async function POST(req: NextRequest) {
  const { VIN, C_ID, Temp_Tag, Date: date, Customization, Payment_Method } = await req.json()

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    await conn.query("UPDATE Vehicle SET Status = 'sold' WHERE VIN = ?", [VIN])

    const [saleResult]: any = await conn.query(
      'INSERT INTO Sales (VIN, C_ID, Temp_Tag, Date, Customization) VALUES (?, ?, ?, ?, ?)',
      [VIN, C_ID, Temp_Tag, date, Customization || null]
    )
    const Sale_ID = saleResult.insertId

    await conn.query('DELETE FROM Inventory WHERE VIN = ?', [VIN])

    await conn.query(
      'INSERT INTO Billing (Sale_ID, Serv_ID, C_ID, Payment_Method, Date) VALUES (?, NULL, ?, ?, ?)',
      [Sale_ID, C_ID, Payment_Method, date]
    )

    await conn.commit()
    return NextResponse.json({ success: true, Sale_ID }, { status: 201 })
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}
