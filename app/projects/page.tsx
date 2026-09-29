import { PageHeader } from "@/components/page-header";
import { requireOsUser } from "@/lib/auth";
import { createProject, updateProjectProgress, updateProjectStatus } from "./actions";

const statusLabels: Record<string,string> = {
  pending: "Pendiente",
  planned: "Planificado",
  in_progress: "En curso",
  blocked: "Bloqueado",
  completed: "Completado",
  cancelled: "Cancelado"
};

export default async function ProjectsPage(){
  const { supabase, osUser } = await requireOsUser();

  const [{ data: projects }, { data: areas }, { data: users }] = await Promise.all([
    supabase.from("os_projects").select("*").order("priority").order("target_date", { ascending: true, nullsFirst: false }),
    supabase.from("os_areas").select("id,name").eq("active", true).order("sort_order"),
    supabase.from("os_users").select("id,name").eq("status","active").order("name")
  ]);

  const projectMap = new Map((projects ?? []).map(p => [p.id,p.name]));
  const areaMap = new Map((areas ?? []).map(a => [a.id,a.name]));
  const userMap = new Map((users ?? []).map(u => [u.id,u.name]));

  return <>
    <PageHeader title="Proyectos" subtitle="Proyectos, subproyectos, progreso e hitos" />
    <section className="card" style={{marginBottom:16}}>
      <h2 className="section-title">Nuevo proyecto</h2>
      <form action={createProject} className="form-grid">
        <input name="name" required placeholder="Nombre del proyecto" />
        <select name="area_id" defaultValue="">
          <option value="">Área</option>
          {(areas ?? []).map(a => <option value={a.id} key={a.id}>{a.name}</option>)}
        </select>
        <select name="parent_project_id" defaultValue="">
          <option value="">Sin proyecto padre</option>
          {(projects ?? []).map(p => <option value={p.id} key={p.id}>{p.name}</option>)}
        </select>
        <select name="owner_id" defaultValue={osUser.id}>
          {(users ?? []).map(u => <option value={u.id} key={u.id}>{u.name}</option>)}
        </select>
        <select name="priority" defaultValue="P2">
          <option>P0</option><option>P1</option><option>P2</option><option>P3</option>
        </select>
        <select name="status" defaultValue="planned">
          {Object.entries(statusLabels).map(([value,label]) => <option value={value} key={value}>{label}</option>)}
        </select>
        <label>Inicio<input name="start_date" type="date" /></label>
        <label>Objetivo<input name="target_date" type="date" /></label>
        <textarea name="description" placeholder="Descripción" className="span-2" />
        <button className="btn" type="submit">Crear proyecto</button>
      </form>
    </section>

    <section className="card">
      <h2 className="section-title">Proyectos activos</h2>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Proyecto</th><th>Área</th><th>Propietario</th><th>Prioridad</th><th>Estado</th><th>Objetivo</th><th>Progreso</th></tr></thead>
          <tbody>
          {(projects ?? []).map(p => <tr key={p.id}>
            <td><strong>{p.name}</strong>{p.parent_project_id && <div className="muted">↳ {projectMap.get(p.parent_project_id)}</div>}</td>
            <td>{p.area_id ? areaMap.get(p.area_id) : "—"}</td>
            <td>{userMap.get(p.owner_id) ?? "—"}</td>
            <td><span className={"badge " + p.priority.toLowerCase()}>{p.priority}</span></td>
            <td>
              <form action={updateProjectStatus}>
                <input type="hidden" name="id" value={p.id}/>
                <select name="status" defaultValue={p.status} onChange={undefined}>
                  {Object.entries(statusLabels).map(([value,label]) => <option value={value} key={value}>{label}</option>)}
                </select>
                <button className="text-btn" type="submit">Guardar</button>
              </form>
            </td>
            <td>{p.target_date ?? "—"}</td>
            <td>
              <form action={updateProjectProgress} className="inline-form">
                <input type="hidden" name="id" value={p.id}/>
                <input name="progress" type="number" min="0" max="100" defaultValue={Number(p.progress)} style={{width:70}}/>
                <span>%</span>
                <button className="text-btn" type="submit">OK</button>
              </form>
            </td>
          </tr>)}
          </tbody>
        </table>
      </div>
    </section>
  </>;
}
