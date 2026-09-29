import { PageHeader } from "@/components/page-header";
import { CrmNav } from "@/components/crm-nav";
import { requireOsUser } from "@/lib/auth";
import { createActivity } from "../actions";

export default async function ActivitiesPage(){
  const { supabase, osUser } = await requireOsUser();
  const [{data: activities},{data: organizations},{data: contacts},{data: opportunities},{data: users}] = await Promise.all([
    supabase.from("crm_activities").select("*").order("activity_date",{ascending:false}).limit(100),
    supabase.from("organizations").select("id,name").order("name"),
    supabase.from("contacts").select("id,first_name,last_name").order("first_name"),
    supabase.from("crm_opportunities").select("id,name").eq("status","open").order("name"),
    supabase.from("os_users").select("id,name").eq("status","active").order("name")
  ]);
  const orgMap=new Map((organizations??[]).map(o=>[o.id,o.name]));
  const contactMap=new Map((contacts??[]).map(c=>[c.id,`${c.first_name} ${c.last_name??""}`.trim()]));
  const oppMap=new Map((opportunities??[]).map(o=>[o.id,o.name]));
  const userMap=new Map((users??[]).map(u=>[u.id,u.name]));

  return <>
    <PageHeader title="Actividad comercial" subtitle="Email, LinkedIn, WhatsApp, llamadas, reuniones y propuestas" />
    <CrmNav active="/crm/activities" />
    <section className="card" style={{marginBottom:16}}>
      <h2 className="section-title">Registrar actividad</h2>
      <form action={createActivity} className="form-grid">
        <select name="activity_type" defaultValue="email"><option value="email">Email</option><option value="linkedin">LinkedIn</option><option value="whatsapp">WhatsApp</option><option value="call">Llamada</option><option value="meeting">Reunión</option><option value="proposal">Propuesta</option><option value="note">Nota</option><option value="other">Otro</option></select>
        <select name="organization_id" defaultValue=""><option value="">Organización</option>{(organizations??[]).map(o=><option value={o.id} key={o.id}>{o.name}</option>)}</select>
        <select name="contact_id" defaultValue=""><option value="">Contacto</option>{(contacts??[]).map(c=><option value={c.id} key={c.id}>{c.first_name} {c.last_name??""}</option>)}</select>
        <select name="opportunity_id" defaultValue=""><option value="">Oportunidad</option>{(opportunities??[]).map(o=><option value={o.id} key={o.id}>{o.name}</option>)}</select>
        <select name="owner_id" defaultValue={osUser.id}>{(users??[]).map(u=><option value={u.id} key={u.id}>{u.name}</option>)}</select>
        <input name="activity_date" type="datetime-local"/>
        <input name="summary" required placeholder="Resumen" className="span-2"/>
        <input name="result" placeholder="Resultado"/>
        <input name="next_action" placeholder="Próxima acción" className="span-2"/>
        <label>Fecha próxima acción<input name="next_action_date" type="date"/></label>
        <textarea name="notes" className="span-2" placeholder="Notas"/>
        <button className="btn" type="submit">Guardar actividad</button>
      </form>
    </section>

    <section className="card">
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Fecha</th><th>Tipo</th><th>Resumen</th><th>Organización</th><th>Contacto</th><th>Oportunidad</th><th>Propietario</th></tr></thead>
        <tbody>{(activities??[]).map(a=><tr key={a.id}>
          <td>{new Date(a.activity_date).toLocaleString("es-ES")}</td><td>{a.activity_type}</td><td><strong>{a.summary}</strong><div className="muted">{a.result??""}</div></td>
          <td>{a.organization_id?orgMap.get(a.organization_id):"—"}</td><td>{a.contact_id?contactMap.get(a.contact_id):"—"}</td><td>{a.opportunity_id?oppMap.get(a.opportunity_id):"—"}</td><td>{userMap.get(a.owner_id)??"—"}</td>
        </tr>)}</tbody>
      </table></div>
    </section>
  </>;
}
