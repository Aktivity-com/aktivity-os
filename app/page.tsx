import { requireOsUser } from "@/lib/auth";

export default async function Home() {
  const { supabase, osUser } = await requireOsUser();
  const now = new Date();
  const today = now.toISOString().slice(0,10);
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate()+7);

  const [
    { count: todayCount },
    { count: overdueCount },
    { count: opportunityCount },
    { count: preregCount },
    { data: todayTasks },
    { data: milestones },
    { data: openOpportunities }
  ] = await Promise.all([
    supabase.from("os_tasks").select("*",{count:"exact",head:true}).eq("owner_id",osUser.id).eq("scheduled_date",today).neq("status","completed"),
    supabase.from("os_tasks").select("*",{count:"exact",head:true}).eq("owner_id",osUser.id).lt("deadline",now.toISOString()).neq("status","completed").neq("status","cancelled"),
    supabase.from("crm_opportunities").select("*",{count:"exact",head:true}).eq("owner_id",osUser.id).eq("status","open"),
    supabase.from("pre_registrations").select("*",{count:"exact",head:true}),
    supabase.from("os_tasks").select("id,title,priority,status,scheduled_date,deadline,project_id").eq("owner_id",osUser.id).neq("status","completed").or(`scheduled_date.eq.${today},deadline.lt.${now.toISOString()}`).order("priority").limit(8),
    supabase.from("os_milestones").select("id,name,target_date,status,project_id").lte("target_date",weekEnd.toISOString().slice(0,10)).neq("status","achieved").order("target_date").limit(6),
    supabase.from("crm_opportunities").select("id,name,value,currency,stage_id,organization_id").eq("owner_id",osUser.id).eq("status","open").limit(6)
  ]);

  const projectIds = Array.from(new Set((todayTasks ?? []).map(t=>t.project_id).filter(Boolean))) as string[];
  const { data: taskProjects } = projectIds.length
    ? await supabase.from("os_projects").select("id,name").in("id",projectIds)
    : { data: [] as {id:string;name:string}[] };
  const projectMap = new Map((taskProjects ?? []).map(p=>[p.id,p.name]));

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">Inicio</h1>
          <div className="muted">Qué requiere tu atención ahora</div>
        </div>
        <a className="btn" href="/inbox">+ Capturar</a>
      </div>

      <section className="grid grid-4" style={{marginBottom:16}}>
        <div className="card"><div className="muted">Tareas hoy</div><div className="metric">{todayCount ?? 0}</div></div>
        <div className="card"><div className="muted">Vencidas</div><div className="metric">{overdueCount ?? 0}</div></div>
        <div className="card"><div className="muted">Oportunidades abiertas</div><div className="metric">{opportunityCount ?? 0}</div></div>
        <div className="card"><div className="muted">Pre-registros</div><div className="metric">{preregCount ?? 0}</div></div>
      </section>

      <section className="grid grid-2">
        <div className="card">
          <h2 className="section-title">Hoy y vencidas</h2>
          <div className="list">
            {(todayTasks ?? []).map(task => (
              <a className="row" href="/tasks?view=today" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <div className="muted">{task.project_id ? projectMap.get(task.project_id) ?? "Proyecto" : "Sin proyecto"} · {task.status}</div>
                </div>
                <span className={"badge "+task.priority.toLowerCase()}>{task.priority}</span>
              </a>
            ))}
            {(todayTasks ?? []).length === 0 && <div className="muted">No tienes tareas urgentes ahora.</div>}
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Próximos hitos</h2>
          <div className="list">
            {(milestones ?? []).map(m => <div className="row" key={m.id}>
              <div><strong>{m.name}</strong><div className="muted">{m.target_date}</div></div>
              <span className="badge">{m.status}</span>
            </div>)}
            {(milestones ?? []).length === 0 && <div className="muted">Sin hitos próximos.</div>}
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Comercial</h2>
          <div className="list">
            {(openOpportunities ?? []).map(o => <a className="row" href="/crm" key={o.id}>
              <div><strong>{o.name}</strong><div className="muted">Oportunidad abierta</div></div>
              <strong>{o.value ? Number(o.value).toLocaleString("es-ES")+" "+o.currency : "—"}</strong>
            </a>)}
            {(openOpportunities ?? []).length === 0 && <div className="muted">Aún no hay oportunidades abiertas.</div>}
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Foco inmediato</h2>
          <div className="list">
            <div className="row"><div><strong>Aktivity OS operativo</strong><div className="muted">4 OCT 2026</div></div><span className="badge p0">P0</span></div>
            <div className="row"><div><strong>Inicio de ventas</strong><div className="muted">5 OCT 2026</div></div><span className="badge p0">P0</span></div>
            <div className="row"><div><strong>Lanzamiento Rankings</strong><div className="muted">1 ENE 2027</div></div><span className="badge p1">Hito</span></div>
          </div>
        </div>
      </section>
    </>
  );
}
