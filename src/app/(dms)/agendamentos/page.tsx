'use client'
import ListScreen, { Col, fmtDateTime, Pill } from '@/components/dms/ListScreen'
const ST: Record<string,{label:string;cls:string}> = {
  scheduled:{label:'Agendado',cls:'bg-[#E8F0FE] text-[#2563EB]'},
  done:{label:'Realizado',cls:'bg-[#E9F7EE] text-[#16A34A]'},
  cancelled:{label:'Cancelado',cls:'bg-[#FDECEC] text-[#DC2626]'},
  no_show:{label:'Não compareceu',cls:'bg-[#F3ECE4] text-[#905B31]'},
}
const cols: Col[] = [
  { key:'scheduledFor', label:'Data/Hora', render:(r)=>fmtDateTime(r.scheduledFor) },
  { key:'customer', label:'Cliente' },
  { key:'vehicle', label:'Veículo', render:(r)=>r.make?`${r.make} ${r.model}`:'—' },
  { key:'reason', label:'Motivo', render:(r)=><span className="text-muted-foreground">{r.reason??'—'}</span> },
  { key:'employee', label:'Responsável', render:(r)=>r.employee??'—' },
  { key:'status', label:'Status', align:'center', render:(r)=>{const s=ST[r.status]??{label:r.status,cls:''};return <Pill label={s.label} cls={s.cls}/>} },
]
export default function Page(){
  return <ListScreen title="Agendamentos" subtitle="Atendimentos e serviços agendados na oficina." endpoint="/api/appointments" columns={cols} source="tabela <b>Appointment</b>" />
}
