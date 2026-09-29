import { PageHeader } from "@/components/page-header";
import { requireOsUser } from "@/lib/auth";

function dateKey(value:string|null) {
  return value ? value.slice(0,10) : null;
}

function startOfWeek(d:Date) {
  const x=new Date(d);
  const day=(x.getDay()+6)%7;
  x.setDate(x.getDate()-day);
  x.setHours(0,0,0,0);
  return x;
}

export default async function AgendaPage(){
  const { supabase, osUser } = await requireOsUser();
  const start=startOfWeek(new Date());
  const end=new Date(start);
  end.setDate(end.getDate()+7);

  const startKey=start.toISOString().slice(0,10);
  const endKey=end.toISOString().slice(0,10);

  const [{data:tasks},{data:milestones},{data:projects}] = await Promise.all([
    supabase.from("os_tasks")
      .select("id,title,scheduled_date,deadline,status,priority,project_id")
      .eq("owner_id",osUser.id)
      .neq("status","completed")
      .neq("status","cancelled")
      .or(`and(scheduled_date.gte.${startKey},scheduled_date.lt.${endKey}),and(deadline.gte.${start.toISOString()},deadline.lt.${end.toISOString()})`)
      .order("scheduled_date"),
    supabase.from("os_milestones")
      .select("id,name,target_date,status,project_id")
      .eq("owner_id",osUser.id)
      .gte("target_date",startKey)
      .lt("target_date",endKey)
      .neq("status","achieved")
      .order("target_date"),
    supabase.from("os_projects").select("id,name")
  ]);

  const projectMap=new Map((projects??[]).map(p=>[p.id,p.name]));
  const days=Array.from({length:7},(_,i)=>{
    const d=new Date(start); d.setDate(start.getDate()+i); return d;
  });

  return <>
    <PageHeader title="Agenda" subtitle="Tareas programadas, deadlines e hitos de esta semana" />
    <div className="week-grid">
      {days.map(day=>{
        const key=day.toISOString().slice(0,10);
        const dayTasks=(tasks??[]).filter(t=>dateKey(t.scheduled_date)===key || dateKey(t.deadline)===key);
        const dayMilestones=(milestones??[]).filter(m=>m.target_date===key);
        return <section className="day-col" key={key}>
          <div className="day-head">
            <strong>{day.toLocaleDateString("es-ES",{weekday:"short"})}</strong>
            <span>{day.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"})}</span>
          </div>
          <div className="day-items">
            {dayTasks.map(t=><a className="agenda-item" href="/tasks?view=next" key={t.id}>
              <div><strong>{t.title}</strong></div>
              <div className="muted">{t.project_id?projectMap.get(t.project_id)??"Proyecto":"Sin proyecto"}</div>
              <div style={{marginTop:6}}><span className={"badge "+t.priority.toLowerCase()}>{t.priority}</span>{dateKey(t.deadline)===key&&<span className="badge" style={{marginLeft:5}}>Deadline</span>}</div>
            </a>)}
            {dayMilestones.map(m=><div className="agenda-item milestone" key={m.id}>
              <div><strong>{m.name}</strong></div><div className="muted">Hito</div>
            </div>)}
            {dayTasks.length===0&&dayMilestones.length===0&&<div className="muted empty-day">—</div>}
          </div>
        </section>
      })}
    </div>
    <div className="card" style={{marginTop:16}}>
      <h2 className="section-title">Google Calendar</h2>
      <div className="muted">La agenda interna ya está operativa. La sincronización bidireccional con Google Calendar se activará cuando publiquemos Aktivity OS y configuremos el OAuth del dominio interno.</div>
    </div>
  </>;
}
