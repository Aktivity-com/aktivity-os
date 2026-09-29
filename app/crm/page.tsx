import { PageHeader } from "@/components/page-header";
import { CrmNav } from "@/components/crm-nav";
import { requireOsUser } from "@/lib/auth";

export default async function CRMPage(){
  const { supabase, osUser } = await requireOsUser();

  const [
    { count: orgCount },
    { count: oppCount },
    { data: opps },
    { data: activities },
    { data: tasks }
  ] = await Promise.all([
    supabase.from("organizations").select("*",{count:"exact",head:true}).eq("owner_id",osUser.id),
    supabase.from("crm_opportunities").select("*",{count:"exact",head:true}).eq("owner_id",osUser.id).eq("status","open"),
    supabase.from("crm_opportunities").select("id,name,value,currency,stage_id").eq("owner_id",osUser.id).eq("status","open"),
    supabase.from("crm_activities").select("id,activity_type,activity_date,summary").eq("owner_id",osUser.id).order("activity_date",{ascending:false}).limit(6),
    supabase.from("os_tasks").select("id,title,scheduled_date,source_id").eq("owner_id",osUser.id).eq("source_type","opportunity").neq("status","completed")
  ]);

  const pipelineValue = (opps ?? []).reduce((sum,o)=>sum+Number(o.value ?? 0),0);
  const noNextAction = (opps ?? []).filter(o => !(tasks ?? []).some(t => t.source_id===o.id)).length;

  return <>
    <PageHeader title="CRM" subtitle="Organizaciones, contactos, oportunidades y seguimiento" />
    <CrmNav active="/crm" />
    <section className="grid grid-4" style={{marginBottom:16}}>
      <div className="card"><div className="muted">Organizaciones asignadas</div><div className="metric">{orgCount ?? 0}</div></div>
      <div className="card"><div className="muted">Oportunidades abiertas</div><div className="metric">{oppCount ?? 0}</div></div>
      <div className="card"><div className="muted">Pipeline</div><div className="metric">{pipelineValue.toLocaleString("es-ES")} €</div></div>
      <div className="card"><div className="muted">Sin próxima acción</div><div className="metric">{noNextAction}</div></div>
    </section>

    <section className="grid grid-2">
      <div className="card">
        <h2 className="section-title">Actividad reciente</h2>
        <div className="list">
          {(activities ?? []).map(a => <div className="row" key={a.id}>
            <div><strong>{a.summary}</strong><div className="muted">{a.activity_type} · {new Date(a.activity_date).toLocaleString("es-ES")}</div></div>
          </div>)}
          {(activities ?? []).length===0 && <div className="muted">Aún no hay actividad comercial.</div>}
        </div>
      </div>
      <div className="card">
        <h2 className="section-title">Seguimiento pendiente</h2>
        <div className="list">
          {(tasks ?? []).slice(0,6).map(t => <a href="/tasks?view=next" className="row" key={t.id}>
            <div><strong>{t.title}</strong><div className="muted">{t.scheduled_date ?? "Sin fecha"}</div></div>
          </a>)}
          {(tasks ?? []).length===0 && <div className="muted">Sin acciones CRM pendientes.</div>}
        </div>
      </div>
    </section>
  </>;
}
