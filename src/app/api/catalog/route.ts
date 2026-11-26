import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Catálogo de veículos com os dados técnicos (motor, velocidade, autonomia, bateria).
export async function GET() {
  const [rows] = await pool.query(`
    SELECT
      VIN        AS vin,
      Make       AS make,
      Model      AS model,
      Year       AS year,
      Price      AS price,
      Status     AS status,
      Motor_W    AS motorW,
      Max_Speed  AS maxSpeed,
      Range_Km   AS rangeKm,
      Battery    AS battery
    FROM Vehicle
    ORDER BY FIELD(Status, 'inventory', 'in_service', 'leased', 'sold'), Price DESC
  `)
  return NextResponse.json(rows)
}
