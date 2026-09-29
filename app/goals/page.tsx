import { PageHeader } from "@/components/page-header";
import { requireOsUser } from "@/lib/auth";
import { createGoal, updateGoalProgress } from "./actions";

export default async function GoalsPage(){
  const { supabase, osUser } = await requireOsUser();
  const [{data:goals},{data:areas},{data:users}] = await Promise.all([
    supabase.from("os_goals").select("*").order("end_date"),
    supabase.from("os_areas").select("id,name").eq("active",true).order("sort_order"),
    supabase.from("os_users").select("id,name").eq("status","active").order("name")
  ]);
  const areaMap=new Map((areas??[]).map(a=>[a.id,a.name]));
  const userMap=new Map((users??[]).map(u=>[u.id,u.name]));

  return <>
    <PageHeader title="Objetivos" subtitle="Objetivo, actual y progreso" />
    <section className="card" style={{marginBottom:16}}>
      <h2 className="section-title">Nuevo objetivo</h2>
      <form action={createGoal} className="form-grid">
        <input name="name" required placeholder="Objetivo" className="span-2"/>
        <select name="area_id" defaultValue=""><option value="">Área</option>{(areas??[]).map(a=><option value={a.id} key={a.id}>{a.name}</option>)}</select>
        <select name="owner_id" defaultValue={osUser.id}>{(users??[]).map(u=><option value={u.id} key={u.id}>{u.name}</option>)}</select>
        <input name="metric_type" placeholder="Métrica" defaultValue="manual"/>
        <input name="target_value" required type="number" step="0.01" placeholder="Objetivo"/>
        <input name="current_value" type="number" step="0.01" placeholder="Actual" defaultValue="0"/>
        <input name="unit" placeholder="Unidad"/>
        <label>Inicio<input name="start_date" required type="date"/></label>
        <label>Fin<input name="end_date" required type="date"/></label>
        <textarea name="notes" className="span-2" placeholder="Notas"/>
        <button className="btn" type="submit">Crear objetivo</button>
      </form>
    </section>

    <section className="grid grid-2">
      {(goals??[]).map(g=>{
        const target=Number(g.target_value||0);
        const current=Number(g.current_value||0);
        const pct=target>0?Math.min(100,Math.round(current/target*100)):0;
        return <div className="card" key={g.id}>
          <div className="row" style={{paddingTop:0}}>
            <div><strong>{g.name}</strong><div className="muted">{g.area_id?areaMap.get(g.area_id):"Sin área"} · {userMap.get(g.owner_id)}</div></div>
            <span className="badge">{g.status}</span>
          </div>
          <div className="metric">{current.toLocaleString("es-ES")} / {target.toLocaleString("es-ES")} {g.unit??""}</div>
          <div className="progress-track"><div className="progress-bar" style={{width:pct+"%"}}/></div>
          <div className="muted" style={{marginTop:7}}>{pct}% · hasta {g.end_date}</div>
          <form action={updateGoalProgress} className="inline-form" style={{marginTop:12}}>
            <input type="hidden" name="id" value={g.id}/>
            <input name="current_value" type="number" step="0.01" defaultValue={current} style={{width:120}}/>
            <button className="text-btn" type="submit">Actualizar</button>
          </form>
        </div>
      })}
      {(goals??[]).length===0 && <div className="card muted">Aún no hay objetivos definidos.</div>}
    </section>
  </>;
}
