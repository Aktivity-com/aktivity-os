import { PageHeader } from "@/components/page-header";
import { CrmNav } from "@/components/crm-nav";
import { requireOsUser } from "@/lib/auth";
import { createOpportunity, moveOpportunity } from "../actions";

export default async function OpportunitiesPage(){
  const { supabase, osUser } = await requireOsUser();
  const [{data: opportunities},{data: organizations},{data: contacts},{data: products},{data: pipelines},{data: stages},{data: users}] = await Promise.all([
    supabase.from("crm_opportunities").select("*").order("created_at",{ascending:false}),
    supabase.from("organizations").select("id,name").order("name"),
    supabase.from("contacts").select("id,first_name,last_name").order("first_name"),
    supabase.from("commercial_products").select("id,name").eq("active",true).order("name"),
    supabase.from("crm_pipelines").select("id,name").eq("active",true).order("name"),
    supabase.from("crm_pipeline_stages").select("*").order("sort_order"),
    supabase.from("os_users").select("id,name").eq("status","active").order("name")
  ]);
  const orgMap=new Map((organizations??[]).map(o=>[o.id,o.name]));
  const productMap=new Map((products??[]).map(p=>[p.id,p.name]));
  const stageMap=new Map((stages??[]).map(s=>[s.id,s.name]));
  const userMap=new Map((users??[]).map(u=>[u.id,u.name]));
  const pipelineId=pipelines?.[0]?.id ?? "";
  const firstStage=(stages??[]).find(s=>s.pipeline_id===pipelineId);

  return <>
    <PageHeader title="Oportunidades" subtitle="Cada oportunidad representa una venta concreta" />
    <CrmNav active="/crm/opportunities" />
    <section className="card" style={{marginBottom:16}}>
      <h2 className="section-title">Nueva oportunidad</h2>
      <form action={createOpportunity} className="form-grid">
        <input name="name" required placeholder="Nombre de la oportunidad" className="span-2"/>
        <select name="organization_id" required defaultValue=""><option value="" disabled>Organización</option>{(organizations??[]).map(o=><option value={o.id} key={o.id}>{o.name}</option>)}</select>
        <select name="primary_contact_id" defaultValue=""><option value="">Contacto principal</option>{(contacts??[]).map(c=><option value={c.id} key={c.id}>{c.first_name} {c.last_name??""}</option>)}</select>
        <select name="product_id" defaultValue=""><option value="">Producto</option>{(products??[]).map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select>
        <select name="owner_id" defaultValue={osUser.id}>{(users??[]).map(u=><option value={u.id} key={u.id}>{u.name}</option>)}</select>
        <input name="value" type="number" min="0" step="0.01" placeholder="Valor €"/>
        <input name="expected_close_date" type="date"/>
        <input type="hidden" name="pipeline_id" value={pipelineId}/>
        <input type="hidden" name="stage_id" value={firstStage?.id??""}/>
        <input name="source" placeholder="Fuente"/>
        <input name="next_action" placeholder="Próxima acción" className="span-2"/>
        <label>Fecha próxima acción<input name="next_action_date" type="date"/></label>
        <textarea name="notes" className="span-2" placeholder="Notas"/>
        <button className="btn" type="submit">Crear oportunidad</button>
      </form>
    </section>

    <section className="card">
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Oportunidad</th><th>Organización</th><th>Producto</th><th>Propietario</th><th>Valor</th><th>Etapa</th><th>Cierre previsto</th></tr></thead>
        <tbody>{(opportunities??[]).map(o=><tr key={o.id}>
          <td><strong>{o.name}</strong></td><td>{orgMap.get(o.organization_id)??"—"}</td><td>{o.product_id?productMap.get(o.product_id):"—"}</td>
          <td>{userMap.get(o.owner_id)??"—"}</td><td>{o.value?Number(o.value).toLocaleString("es-ES")+" €":"—"}</td>
          <td><form action={moveOpportunity} className="inline-form"><input type="hidden" name="id" value={o.id}/>
            <select name="stage_id" defaultValue={o.stage_id}>{(stages??[]).filter(s=>s.pipeline_id===o.pipeline_id).map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select>
            <button className="text-btn" type="submit">Mover</button></form></td>
          <td>{o.expected_close_date??"—"}</td>
        </tr>)}</tbody>
      </table></div>
    </section>
  </>;
}
