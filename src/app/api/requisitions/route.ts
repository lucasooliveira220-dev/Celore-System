import { NextResponse } from 'next/server'
import pool from '@/lib/db'
export async function GET() {
  const [rows] = await pool.query(`
    SELECT r.Req_ID AS id, e.Name AS employee, r.Serv_ID AS servId,
           r.Req_Date AS date, r.Status AS status, COUNT(ri.Part_ID) AS items
    FROM Requisition r
    JOIN Employee e ON r.Employee_ID = e.Employee_ID
    LEFT JOIN RequisitionItem ri ON ri.Req_ID = r.Req_ID
    GROUP BY r.Req_ID, e.Name, r.Serv_ID, r.Req_Date, r.Status
    ORDER BY r.Req_Date DESC
  `)
  return NextResponse.json(rows)
}
