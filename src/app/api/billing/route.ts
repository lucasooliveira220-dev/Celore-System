import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Query 2: Getting Customer Billing Information
// Returns billing records joined to customer, service, sales, and vehicle data
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const customer_id = searchParams.get('customer_id')

  let query = `
    SELECT b.Billing_ID, b.Date, b.Payment_Method,
           CASE WHEN b.Sale_ID IS NOT NULL THEN 'Sale' ELSE 'Service' END AS Transaction_Type,
           CASE WHEN b.Sale_ID IS NOT NULL THEN v.Price ELSE serv.Final_Cost END AS Amount,
           c.Name AS customer, c.Email AS customer_email, c.Customer_ID
    FROM Billing b
    JOIN Customer c ON b.C_ID = c.Customer_ID
    LEFT JOIN Service serv ON b.Serv_ID = serv.Service_ID
    LEFT JOIN Sales s ON b.Sale_ID = s.Sale_ID
    LEFT JOIN Vehicle v ON s.VIN = v.VIN
    WHERE 1=1
  `
  const params: (string | number)[] = []

  if (customer_id) {
    query += ' AND b.C_ID = ?'
    params.push(Number(customer_id))
  }
  if (search) {
    query += ' AND c.Name LIKE ?'
    params.push(`%${search}%`)
  }
  query += ' ORDER BY b.Date DESC'

  const [rows] = await pool.query(query, params)
  return NextResponse.json(rows)
}
