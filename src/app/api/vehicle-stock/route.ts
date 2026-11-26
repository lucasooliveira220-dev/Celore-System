import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Saldo de veículos por modelo (view VehicleStock)
export async function GET() {
  const [rows] = await pool.query(`
    SELECT vs.Make AS make, vs.Model AS model, vs.On_Hand AS onHand,
           vs.Last_Movement AS lastMovement, v.Price AS price
    FROM VehicleStock vs
    LEFT JOIN (SELECT Make, Model, MAX(Price) AS Price FROM Vehicle GROUP BY Make, Model) v
      ON v.Make = vs.Make AND v.Model = vs.Model
    ORDER BY vs.On_Hand DESC, vs.Make, vs.Model
  `)
  return NextResponse.json(rows)
}
