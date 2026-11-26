'use client'
import ListScreen, { Col, fmtDateTime, Pill } from '@/components/dms/ListScreen'
const TYPE: Record<string, {label:string;cls:string}> = {
  in:{label:'Entrada',cls:'bg-[#E9F7EE] text-[#16A34A]'},
  out:{label:'Saída',cls:'bg-[#FDECEC] text-[#DC2626]'},
  adjust:{label:'Ajuste',cls:'bg-[#FEF4E0] text-[#B7791F]'},
}
const ORIGIN: Record<string,string> = { purchase:'Compra', service:'Serviço', sale:'Venda', adjustment:'Ajuste', xml_import:'Importação XML' }
const cols: Col[] = [
  { key:'date', label:'Data', render:(r)=>fmtDateTime(r.date) },
  { key:'part', label:'Peça', render:(r)=><div><div className="font-semibold">{r.part}</div><div className="text-xs text-[#B4ACA6]">{r.code}</div></div> },
  { key:'type', label:'Tipo', align:'center', render:(r)=>{const t=TYPE[r.type]??{label:r.type,cls:''};return <Pill label={t.label} cls={t.cls}/>} },
  { key:'origin', label:'Origem', render:(r)=>ORIGIN[r.origin]??r.origin },
  { key:'quantity', label:'Qtd', align:'right', render:(r)=><span className={`font-[Poppins] font-bold ${r.quantity<0?'text-[#DC2626]':'text-[#16A34A]'}`}>{r.quantity>0?'+':''}{r.quantity}</span> },
  { key:'note', label:'Observação', render:(r)=><span className="text-muted-foreground">{r.note??'—'}</span> },
]
export default function Page(){
  return <ListScreen title="Movimentação de Estoque" subtitle="Livro-razão de todas as entradas, saídas e ajustes de peças." endpoint="/api/movements" columns={cols} source="tabela <b>StockMovement</b>" />
}
