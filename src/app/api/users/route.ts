import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Usuários do sistema (AppUser) com o funcionário vinculado, se houver.
export async function GET() {
  const [rows] = await pool.query(`
    SELECT u.User_ID AS id, u.Username AS username, u.Role AS role,
           u.Active AS active, e.Name AS employee
    FROM AppUser u
    LEFT JOIN Employee e ON u.Employee_ID = e.Employee_ID
    ORDER BY u.User_ID
  `)
  return NextResponse.json(rows)
}
