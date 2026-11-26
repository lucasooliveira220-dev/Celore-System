import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Query 1: Service a Vehicle
// Shows customer, mechanic(s), mileage, cost for each service record
export async function GET() {
  const [rows] = await pool.query(`
    SELECT s.Service_ID, s.VIN, s.Start_Mileage, s.End_Mileage,
           s.Estimated_Cost, s.Work_Performed, s.Final_Cost,
           v.Make, v.Model, v.Year,
           c.Name AS customer, c.P_Number AS customer_phone, c.Customer_ID,
           GROUP_CONCAT(e.Name ORDER BY e.Name SEPARATOR ', ') AS mechanics,
           CASE WHEN s.Final_Cost IS NULL THEN 'In Progress' ELSE 'Completed' END AS service_status
    FROM Service s
    JOIN Vehicle v ON s.VIN = v.VIN
    JOIN Customer c ON s.C_ID = c.Customer_ID
    LEFT JOIN ServiceEmployee se ON s.Service_ID = se.Serv_ID
    LEFT JOIN Employee e ON se.E_ID = e.Employee_ID
    GROUP BY s.Service_ID
    ORDER BY s.Final_Cost IS NOT NULL, s.Service_ID DESC
  `)
  return NextResponse.json(rows)
}

// Opens a new service record and assigns mechanics (Query 1 action path)
export async function POST(req: NextRequest) {
  const { VIN, C_ID, mechanic_ids, Start_Mileage, Estimated_Cost } = await req.json()

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const [result]: any = await conn.query(
      'INSERT INTO Service (VIN, C_ID, Start_Mileage, Estimated_Cost) VALUES (?, ?, ?, ?)',
      [VIN, C_ID, Start_Mileage, Estimated_Cost || null]
    )
    const Service_ID = result.insertId

    for (const E_ID of mechanic_ids) {
      await conn.query('INSERT INTO ServiceEmployee (Serv_ID, E_ID) VALUES (?, ?)', [Service_ID, E_ID])
    }

    await conn.query("UPDATE Vehicle SET Status = 'in_service' WHERE VIN = ?", [VIN])

    await conn.commit()
    return NextResponse.json({ success: true, Service_ID }, { status: 201 })
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}
