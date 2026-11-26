'use client'
import ListScreen, { Col, fmtDate, brl, Pill } from '@/components/dms/ListScreen'
const KIND: Record<string,{label:string;cls:string}> = {
  sale:{label:'Venda',cls:'bg-[#E8F0FE] text-[#2563EB]'},
  service:{label:'Serviço',cls:'bg-[#FFF3E3] text-[#E25812]'},
  purchase:{label:'Compra',cls:'bg-[#F3ECE4] text-[#905B31]'},
}
const cols: Col[] = [
  { key:'number', label:'Número', render:(r)=><span className="font-mono text-xs">{r.number?String(r.number).slice(0,20)+'…':'—'}</span> },
  { key:'kind', label:'Tipo', align:'center', render:(r)=>{const k=KIND[r.kind]??{label:r.kind,cls:''};return <Pill label={k.label} cls={k.cls}/>} },
  { key:'issueDate', label:'Emissão', render:(r)=>fmtDate(r.issueDate) },
  { key:'xmlImported', label:'Origem', align:'center', render:(r)=>r.xmlImported? <Pill label="Importada XML" cls="bg-[#E9F7EE] text-[#16A34A]"/> : <span className="text-muted-foreground">Manual</span> },
  { key:'total', label:'Valor', align:'right', render:(r)=><span className="font-[Poppins] font-semibold">{brl(r.total)}</span> },
]
export default function Page(){
  return <ListScreen title="Notas Fiscais" subtitle="Notas de venda, serviço e compra (inclui importadas por XML)." endpoint="/api/invoices" columns={cols} source="tabela <b>Invoice</b>" />
}
