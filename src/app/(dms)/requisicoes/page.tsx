'use client'
import ListScreen, { Col, fmtDate, Pill } from '@/components/dms/ListScreen'
const ST: Record<string,{label:string;cls:string}> = {
  open:{label:'Aberta',cls:'bg-[#FEF4E0] text-[#B7791F]'},
  fulfilled:{label:'Atendida',cls:'bg-[#E9F7EE] text-[#16A34A]'},
  cancelled:{label:'Cancelada',cls:'bg-[#F3ECE4] text-[#905B31]'},
}
const cols: Col[] = [
  { key:'id', label:'Requisição', render:(r)=><span className="font-semibold">#{r.id}</span> },
  { key:'employee', label:'Solicitante' },
  { key:'servId', label:'OS vinculada', render:(r)=>r.servId?`OS #${r.servId}`:'—' },
  { key:'items', label:'Itens', align:'center', render:(r)=><span className="font-[Poppins] font-bold">{r.items}</span> },
  { key:'date', label:'Data', render:(r)=>fmtDate(r.date) },
  { key:'status', label:'Status', align:'center', render:(r)=>{const s=ST[r.status]??{label:r.status,cls:''};return <Pill label={s.label} cls={s.cls}/>} },
]
export default function Page(){
  return <ListScreen title="Requisições de Peças" subtitle="Pedidos internos de peças para as ordens de serviço." endpoint="/api/requisitions" columns={cols} source="tabelas <b>Requisition</b> · <b>RequisitionItem</b>" />
}
