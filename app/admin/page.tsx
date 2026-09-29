import { PageHeader } from "@/components/page-header";
import { AdminNav } from "@/components/admin-nav";
import { requireOsUser } from "@/lib/auth";

export default async function AdminPage(){
  const { supabase } = await requireOsUser();
  const since = new Date();
  since.setDate(since.getDate()-7);

  const [
    {count: preregTotal},{count: prereg7},{count: b2bTotal},{count: referralsTotal},{count: contactsTotal},
    {data: preregBySource},{data: recentB2B}
  ] = await Promise.all([
    supabase.from("pre_registrations").select("*",{count:"exact",head:true}),
    supabase.from("pre_registrations").select("*",{count:"exact",head:true}).gte("created_at",since.toISOString()),
    supabase.from("b2b_leads").select("*",{count:"exact",head:true}),
    supabase.from("referrals").select("*",{count:"exact",head:true}),
    supabase.from("contact_requests").select("*",{count:"exact",head:true}),
    supabase.from("pre_registrations").select("source"),
    supabase.from("b2b_leads").select("id,organization_name,lead_type,contact_name,created_at,admin_status").order("created_at",{ascending:false}).limit(6)
  ]);

  const sourceCounts = new Map<string,number>();
  (preregBySource??[]).forEach(r=>{
    const key=r.source||"desconocido";
    sourceCounts.set(key,(sourceCounts.get(key)||0)+1);
  });
  const topSources=[...sourceCounts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6);

  return <>
    <PageHeader title="Admin Aktivity" subtitle="Operación del producto, formularios y pre-registros" />
    <AdminNav active="/admin" />
    <section className="grid grid-4" style={{marginBottom:16}}>
      <div className="card"><div className="muted">Pre-registros</div><div className="metric">{preregTotal??0}</div><div className="muted">+{prereg7??0} últimos 7 días</div></div>
      <div className="card"><div className="muted">Leads B2B</div><div className="metric">{b2bTotal??0}</div></div>
      <div className="card"><div className="muted">Referidos</div><div className="metric">{referralsTotal??0}</div></div>
      <div className="card"><div className="muted">Contacto web</div><div className="metric">{contactsTotal??0}</div></div>
    </section>
    <section className="grid grid-2">
      <div className="card">
        <h2 className="section-title">Origen de pre-registros</h2>
        <div className="list">
          {topSources.map(([source,count])=><div className="row" key={source}><strong>{source}</strong><span>{count}</span></div>)}
          {topSources.length===0 && <div className="muted">Sin datos de origen todavía.</div>}
        </div>
      </div>
      <div className="card">
        <h2 className="section-title">Últimos leads B2B</h2>
        <div className="list">
          {(recentB2B??[]).map(l=><a href="/admin/b2b-leads" className="row" key={l.id}><div><strong>{l.organization_name}</strong><div className="muted">{l.lead_type} · {l.contact_name}</div></div><span className="badge">{l.admin_status}</span></a>)}
          {(recentB2B??[]).length===0 && <div className="muted">No hay leads B2B.</div>}
        </div>
      </div>
    </section>
  </>;
}
