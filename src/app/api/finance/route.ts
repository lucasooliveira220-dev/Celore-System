import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Extrato de contas (AccountStatement) + Ficha financeira por cliente (CustomerLedger)
export async function GET() {
  const [entries] = await pool.query(`
    SELECT Entry_ID AS id, Direction AS direction, Amount AS amount,
           Due_Date AS dueDate, Paid_Date AS paidDate, Status AS status, Party AS party
    FROM AccountStatement
    ORDER BY Due_Date DESC
  `)
  const [ledger] = await pool.query(`
    SELECT Customer_ID AS id, Name AS name,
           Open_Balance AS openBalance, Total_Paid AS totalPaid
    FROM CustomerLedger
    ORDER BY Open_Balance DESC
  `)
  return NextResponse.json({ entries, ledger })
}
