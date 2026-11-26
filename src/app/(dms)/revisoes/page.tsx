'use client'
import ListScreen, { Col, fmtDate, Pill } from '@/components/dms/ListScreen'
const ST: Record<string,{label:string;cls:string}> = {
  pending:{label:'Pendente',cls:'bg-[#FEF4E0] text-[#B7791F]'},
  done:{label:'Feita',cls:'bg-[#E9F7EE] text-[#16A34A]'},
  overdue:{label:'Atrasada',cls:'bg-[#FDECEC] text-[#DC2626]'},
}
const cols: Col[] = [
  { key:'vehicle', label:'Veículo', render:(r)=><div><div className="font-semibold">{r.make} {r.model}</div><div className="text-xs text-[#B4ACA6]">{r.vin}</div></div> },
  { key:'mileage', label:'Plano', render:(r)=>`${Number(r.mileage).toLocaleString('pt-BR')} km` },
  { key:'dueDate', label:'Vencimento', render:(r)=>fmtDate(r.dueDate) },
  { key:'status', label:'Status', align:'center', render:(r)=>{const s=ST[r.status]??{label:r.status,cls:''};return <Pill label={s.label} cls={s.cls}/>} },
]
export default function Page(){
  return <ListScreen title="Revisões Programadas" subtitle="Revisões por quilometragem — pós-vendas." endpoint="/api/revisions" columns={cols} source="tabela <b>Revision</b>" />
}
