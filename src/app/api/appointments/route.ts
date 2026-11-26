import { NextResponse } from 'next/server'
import pool from '@/lib/db'
export async function GET() {
  const [rows] = await pool.query(`
    SELECT a.Appointment_ID AS id, c.Name AS customer, v.Make AS make, v.Model AS model,
           a.Scheduled_For AS scheduledFor, a.Reason AS reason, a.Status AS status, e.Name AS employee
    FROM Appointment a
    JOIN Customer c ON a.C_ID = c.Customer_ID
    LEFT JOIN Vehicle v ON a.VIN = v.VIN
    LEFT JOIN Employee e ON a.Employee_ID = e.Employee_ID
    ORDER BY a.Scheduled_For
  `)
  return NextResponse.json(rows)
}
