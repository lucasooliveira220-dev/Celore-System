import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Gera os dados de um relatório por tipo e período.
// GET /api/reports/data?type=vendas&start=2026-06-01&end=2026-08-31
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const type = sp.get('type') || 'vendas'
  const start = sp.get('start') || '2000-01-01'
  const end = sp.get('end') || '2100-12-31'

  let title = ''
  let columns: { key: string; label: string }[] = []
  let sql = ''
  let params: any[] = [start, end]

  switch (type) {
    case 'vendas':
      title = 'Relatório de Vendas'
      columns = [
        { key: 'data', label: 'Data' }, { key: 'veiculo', label: 'Veículo' },
        { key: 'cliente', label: 'Cliente' }, { key: 'pagamento', label: 'Pagamento' },
        { key: 'valor', label: 'Valor (R$)' },
      ]
      sql = `
        SELECT DATE_FORMAT(s.Date, '%d/%m/%Y') AS data,
               CONCAT(v.Make, ' ', v.Model) AS veiculo, c.Name AS cliente,
               b.Payment_Method AS pagamento, v.Price AS valor
        FROM Sales s
        JOIN Vehicle v ON s.VIN = v.VIN
        JOIN Customer c ON s.C_ID = c.Customer_ID
        LEFT JOIN Billing b ON b.Sale_ID = s.Sale_ID
        WHERE DATE(s.Date) BETWEEN ? AND ?
        ORDER BY s.Date`
      break

    case 'servicos':
      title = 'Relatório de Serviços'
      columns = [
        { key: 'data', label: 'Abertura' }, { key: 'veiculo', label: 'Veículo' },
        { key: 'cliente', label: 'Cliente' }, { key: 'servico', label: 'Serviço' },
        { key: 'status', label: 'Status' }, { key: 'valor', label: 'Valor (R$)' },
      ]
      sql = `
        SELECT DATE_FORMAT(sv.Opened_Date, '%d/%m/%Y') AS data,
               CONCAT(v.Make, ' ', v.Model) AS veiculo, c.Name AS cliente,
               sv.Work_Performed AS servico, sv.Status AS status,
               COALESCE(sv.Final_Cost, sv.Estimated_Cost) AS valor
        FROM Service sv
        JOIN Vehicle v ON sv.VIN = v.VIN
        JOIN Customer c ON sv.C_ID = c.Customer_ID
        WHERE DATE(sv.Opened_Date) BETWEEN ? AND ?
        ORDER BY sv.Opened_Date`
      break

    case 'estoque':
      title = 'Relatório de Estoque (Movimentações)'
      columns = [
        { key: 'data', label: 'Data' }, { key: 'codigo', label: 'Código' },
        { key: 'peca', label: 'Peça' }, { key: 'tipo', label: 'Tipo' },
        { key: 'quantidade', label: 'Qtd' }, { key: 'origem', label: 'Origem' },
      ]
      sql = `
        SELECT DATE_FORMAT(m.Movement_Date, '%d/%m/%Y') AS data,
               p.Code AS codigo, p.Description AS peca, m.Type AS tipo,
               m.Quantity AS quantidade, m.Origin AS origem
        FROM StockMovement m
        JOIN Part p ON m.Part_ID = p.Part_ID
        WHERE DATE(m.Movement_Date) BETWEEN ? AND ?
        ORDER BY m.Movement_Date`
      break

    case 'financeiro':
      title = 'Relatório Financeiro'
      columns = [
        { key: 'vencimento', label: 'Vencimento' }, { key: 'direcao', label: 'Direção' },
        { key: 'parte', label: 'Parte' }, { key: 'status', label: 'Status' },
        { key: 'valor', label: 'Valor (R$)' },
      ]
      sql = `
        SELECT DATE_FORMAT(a.Due_Date, '%d/%m/%Y') AS vencimento,
               CASE a.Direction WHEN 'receivable' THEN 'A receber' ELSE 'A pagar' END AS direcao,
               COALESCE(c.Name, s.Name) AS parte, a.Status AS status, a.Amount AS valor
        FROM AccountEntry a
        LEFT JOIN Customer c ON a.C_ID = c.Customer_ID
        LEFT JOIN Supplier s ON a.Supplier_ID = s.Supplier_ID
        WHERE DATE(a.Due_Date) BETWEEN ? AND ?
        ORDER BY a.Due_Date`
      break

    default:
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  }

  const [rows] = await pool.query(sql, params)
  return NextResponse.json({ title, columns, rows })
}
