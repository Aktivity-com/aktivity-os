import { PageHeader } from "@/components/page-header";
import { AdminNav } from "@/components/admin-nav";
import { requireOsUser } from "@/lib/auth";
import { convertB2BLeadToCrm, updateAdminNotes, updateAdminStatus } from "../actions";

export default async function B2BLeadsPage(){
  const { supabase } = await requireOsUser();
  const { data: rows } = await supabase.from("b2b_leads").select("*").order("created_at",{ascending:false});

  return <>
    <PageHeader title="Leads B2B" subtitle="Solicitudes de empresas, organizadores, clubes, universidades y marcas" />
    <AdminNav active="/admin/b2b-leads" />
    <section className="card">
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Fecha</th><th>Organización</th><th>Tipo</th><th>Contacto</th><th>Email</th><th>Estado</th><th>CRM</th><th>Notas</th></tr></thead>
        <tbody>{(rows??[]).map(r=><tr key={r.id}>
          <td>{new Date(r.created_at).toLocaleString("es-ES")}</td><td><strong>{r.organization_name}</strong><div className="muted">{r.website??""}</div></td><td>{r.lead_type}</td>
          <td>{r.contact_name}<div className="muted">{r.contact_role??""}</div></td><td>{r.contact_email}</td>
          <td><form action={updateAdminStatus} className="inline-form"><input type="hidden" name="table" value="b2b_leads"/><input type="hidden" name="id" value={r.id}/>
            <select name="admin_status" defaultValue={r.admin_status}><option value="new">Nuevo</option><option value="reviewed">Revisado</option><option value="contacted">Contactado</option><option value="converted">Convertido</option><option value="discarded">Descartado</option></select><button className="text-btn">Guardar</button></form></td>
          <td>{r.crm_organization_id?<span className="badge">En CRM</span>:<form action={convertB2BLeadToCrm}><input type="hidden" name="id" value={r.id}/><button className="text-btn">→ Crear en CRM</button></form>}</td>
          <td><form action={updateAdminNotes} className="inline-form"><input type="hidden" name="table" value="b2b_leads"/><input type="hidden" name="id" value={r.id}/><input name="admin_notes" defaultValue={r.admin_notes??""} placeholder="Nota"/><button className="text-btn">OK</button></form></td>
        </tr>)}</tbody>
      </table></div>
    </section>
  </>;
}
