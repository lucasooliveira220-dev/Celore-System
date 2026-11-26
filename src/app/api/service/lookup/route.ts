import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Query 1: Service a Vehicle — lookup all service records for a given VIN
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const vin = searchParams.get('vin')
  if (!vin) return NextResponse.json([])

  const [rows] = await pool.query(`
    SELECT Customer.Name AS customer, Employee.Name AS mechanic,
           Service.Start_Mileage, Service.End_Mileage,
           Service.Estimated_Cost, Service.Final_Cost,
           Service.Work_Performed, Service.Service_ID
    FROM Service
    JOIN Customer ON Service.C_ID = Customer.Customer_ID
    JOIN ServiceEmployee ON ServiceEmployee.Serv_ID = Service.Service_ID
    JOIN Employee ON ServiceEmployee.E_ID = Employee.Employee_ID
    JOIN Vehicle ON Vehicle.VIN = Service.VIN
    WHERE Vehicle.VIN = ?
    ORDER BY Service.Service_ID
  `, [vin])

  return NextResponse.json(rows)
}
