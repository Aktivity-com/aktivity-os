import { PageHeader } from "@/components/page-header";
import { requireOsUser } from "@/lib/auth";
import { createTask, rescheduleTask, setTaskStatus } from "./actions";

const statusLabels: Record<string,string> = {
  pending: "Pendiente",
  scheduled: "Programada",
  in_progress: "En curso",
  blocked: "Bloqueada",
  completed: "Completada",
  cancelled: "Cancelada"
};

type SearchParams = Promise<{view?:string}>;

export default async function TasksPage({searchParams}:{searchParams:SearchParams}){
  const { supabase, osUser } = await requireOsUser();
  const params = await searchParams;
  const view = params.view ?? "today";
  const today = new Date().toISOString().slice(0,10);

  let query = supabase.from("os_tasks").select("*").order("priority").order("scheduled_date",{ascending:true,nullsFirst:false}).order("deadline",{ascending:true,nullsFirst:false});

  if (view === "today") query = query.or(`scheduled_date.eq.${today},and(deadline.lt.${new Date().toISOString()},status.neq.completed)`);
  if (view === "in_progress") query = query.eq("status","in_progress");
  if (view === "blocked") query = query.eq("status","blocked");
  if (view === "backlog") query = query.is("scheduled_date",null).eq("status","pending");
  if (view === "completed") query = query.eq("status","completed");
  if (view === "next") query = query.gte("scheduled_date",today).neq("status","completed");

  const [{ data: tasks }, { data: projects }, { data: users }] = await Promise.all([
    query,
    supabase.from("os_projects").select("id,name").neq("status","cancelled").order("name"),
    supabase.from("os_users").select("id,name").eq("status","active").order("name")
  ]);

  const projectMap = new Map((projects ?? []).map(p => [p.id,p.name]));
  const userMap = new Map((users ?? []).map(u => [u.id,u.name]));
  const views=[["today","Hoy"],["next","Próximas"],["in_progress","En curso"],["blocked","Bloqueadas"],["backlog","Backlog"],["completed","Completadas"]];

  return <>
    <PageHeader title="Tareas" subtitle="Una única lista de trabajo para todo Aktivity" />
    <div className="tabs">
      {views.map(([key,label])=><a className={"tab "+(view===key?"active":"")} href={"/tasks?view="+key} key={key}>{label}</a>)}
    </div>

    <section className="card" style={{marginBottom:16}}>
      <h2 className="section-title">Nueva tarea</h2>
      <form action={createTask} className="form-grid">
        <input name="title" required placeholder="Qué hay que hacer" className="span-2"/>
        <select name="project_id" defaultValue="">
          <option value="">Sin proyecto</option>
          {(projects ?? []).map(p => <option value={p.id} key={p.id}>{p.name}</option>)}
        </select>
        <select name="owner_id" defaultValue={osUser.id}>
          {(users ?? []).map(u => <option value={u.id} key={u.id}>{u.name}</option>)}
        </select>
        <select name="priority" defaultValue="P2"><option>P0</option><option>P1</option><option>P2</option><option>P3</option></select>
        <select name="status" defaultValue="pending">{Object.entries(statusLabels).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select>
        <label>Programada<input name="scheduled_date" type="date"/></label>
        <label>Deadline<input name="deadline" type="datetime-local"/></label>
        <input name="estimated_minutes" type="number" min="0" placeholder="Minutos estimados"/>
        <textarea name="description" placeholder="Descripción" className="span-2"/>
        <button className="btn" type="submit">Crear tarea</button>
      </form>
    </section>

    <section className="card">
      <h2 className="section-title">{views.find(([key])=>key===view)?.[1] ?? "Tareas"} · {(tasks ?? []).length}</h2>
      <div className="list">
        {(tasks ?? []).map(t => <div className="task-row" key={t.id}>
          <div className="task-main">
            <div><strong>{t.title}</strong></div>
            <div className="muted">
              {t.project_id ? projectMap.get(t.project_id) : "Sin proyecto"} · {userMap.get(t.owner_id)} · {t.scheduled_date ?? "Sin fecha"}
              {t.deadline ? " · Deadline "+new Date(t.deadline).toLocaleString("es-ES",{dateStyle:"short",timeStyle:"short"}) : ""}
            </div>
          </div>
          <span className={"badge "+t.priority.toLowerCase()}>{t.priority}</span>
          <form action={setTaskStatus} className="inline-form">
            <input type="hidden" name="id" value={t.id}/>
            <select name="status" defaultValue={t.status}>{Object.entries(statusLabels).map(([v,l])=><option value={v} key={v}>{l}</option>)}</select>
            <button className="text-btn" type="submit">Guardar</button>
          </form>
          <form action={rescheduleTask} className="inline-form">
            <input type="hidden" name="id" value={t.id}/>
            <input name="scheduled_date" type="date" defaultValue={t.scheduled_date ?? ""}/>
            <button className="text-btn" type="submit">Mover</button>
          </form>
        </div>)}
        {(tasks ?? []).length === 0 && <div className="muted">No hay tareas en esta vista.</div>}
      </div>
    </section>
  </>;
}
