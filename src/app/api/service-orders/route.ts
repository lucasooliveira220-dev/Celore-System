import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET            → lista de Ordens de Serviço (com cliente e veículo)
// GET ?meta=1    → dados para o formulário (clientes e veículos)
// POST           → cria uma nova OS
export async function GET(req: NextRequest) {
  const meta = req.nextUrl.searchParams.get('meta')

  if (meta) {
    const [customers] = await pool.query(
      'SELECT Customer_ID AS id, Name AS name FROM Customer ORDER BY Name',
    )
    const [vehicles] = await pool.query(
      `SELECT VIN AS vin, CONCAT(Make, ' ', Model, ' — ', VIN) AS label
       FROM Vehicle ORDER BY Make, Model`,
    )
    return NextResponse.json({ customers, vehicles })
  }

  const [rows] = await pool.query(`
    SELECT
      s.Service_ID     AS id,
      c.Name           AS customer,
      v.Make           AS make,
      v.Model          AS model,
      s.VIN            AS vin,
      s.Work_Performed AS work,
      s.Estimated_Cost AS estimated,
      s.Final_Cost     AS final,
      s.Status         AS status
    FROM Service s
    JOIN Customer c ON s.C_ID = c.Customer_ID
    JOIN Vehicle  v ON s.VIN  = v.VIN
    ORDER BY s.Service_ID DESC
  `)
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { cId, vin, startMileage, estimatedCost, workPerformed, status } = body

  if (!cId || !vin) {
    return NextResponse.json({ error: 'Cliente e veículo são obrigatórios' }, { status: 400 })
  }

  const [result]: any = await pool.query(
    `INSERT INTO Service (VIN, C_ID, Start_Mileage, Estimated_Cost, Work_Performed, Status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      vin,
      cId,
      startMileage || null,
      estimatedCost || null,
      workPerformed || null,
      status || 'aberta',
    ],
  )
  return NextResponse.json({ success: true, id: result.insertId })
}
