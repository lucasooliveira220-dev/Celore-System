'use client'
import ListScreen, { Col, fmtDate, Pill } from '@/components/dms/ListScreen'
const COV: Record<string,{label:string;cls:string}> = {
  vehicle:{label:'Veículo',cls:'bg-[#E8F0FE] text-[#2563EB]'},
  part:{label:'Peça',cls:'bg-[#FFF3E3] text-[#E25812]'},
  service:{label:'Serviço',cls:'bg-[#F3ECE4] text-[#905B31]'},
}
function vig(end:string){
  const active = new Date(end) >= new Date()
  return <Pill label={active?'Vigente':'Expirada'} cls={active?'bg-[#E9F7EE] text-[#16A34A]':'bg-[#FDECEC] text-[#DC2626]'} />
}
const cols: Col[] = [
  { key:'coverage', label:'Cobertura', align:'center', render:(r)=>{const c=COV[r.coverage]??{label:r.coverage,cls:''};return <Pill label={c.label} cls={c.cls}/>} },
  { key:'terms', label:'Descrição', render:(r)=>r.part?`${r.terms??''} (${r.part})`:r.terms??'—' },
  { key:'startDate', label:'Início', render:(r)=>fmtDate(r.startDate) },
  { key:'endDate', label:'Fim', render:(r)=>fmtDate(r.endDate) },
  { key:'vig', label:'Situação', align:'center', render:(r)=>vig(r.endDate) },
]
export default function Page(){
  return <ListScreen title="Garantias" subtitle="Garantias de veículos, peças e serviços." endpoint="/api/warranties" columns={cols} source="tabela <b>Warranty</b>" />
}
