import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dms/Sidebar'
import Topbar from '@/components/dms/Topbar'
import pool from '@/lib/db'

function titleCase(u: string) {
  return u.split(/[.\s]+/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
}

export default async function DmsLayout({ children }: { children: React.ReactNode }) {
  const uid = (await cookies()).get('celore_uid')?.value
  if (!uid) redirect('/login')

  const [rows]: any = await pool.query(
    `SELECT u.Username AS username, u.Role AS role, e.Name AS employee
     FROM AppUser u LEFT JOIN Employee e ON u.Employee_ID = e.Employee_ID
     WHERE u.User_ID = ? LIMIT 1`,
    [uid],
  )
  if (!rows.length) redirect('/login')

  const user = {
    name: rows[0].employee || titleCase(rows[0].username),
    username: rows[0].username,
    role: rows[0].role as string,
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} />
        <main className="px-[34px] pb-11 pt-4">{children}</main>
      </div>
    </div>
  )
}
