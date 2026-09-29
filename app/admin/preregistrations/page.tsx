import { PageHeader } from "@/components/page-header";
import { AdminNav } from "@/components/admin-nav";
import { requireOsUser } from "@/lib/auth";
import { updateAdminNotes, updateAdminStatus } from "../actions";

export default async function PreregistrationsPage(){
  const { supabase } = await requireOsUser();
  const { data: rows } = await supabase.from("pre_registrations").select("*").order("created_at",{ascending:false});

  return <>
    <PageHeader title="Pre-registros" subtitle="Usuarios interesados en participar en Aktivity" />
    <AdminNav active="/admin/preregistrations" />
    <section className="card">
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Fecha</th><th>Email</th><th>Deporte</th><th>Ranking</th><th>Origen</th><th>Estado</th><th>Notas</th></tr></thead>
        <tbody>{(rows??[]).map(r=><tr key={r.id}>
          <td>{new Date(r.created_at).toLocaleString("es-ES")}</td><td><strong>{r.email}</strong></td><td>{r.sport??"—"}</td><td>{r.ranking??"—"}</td><td>{r.source??"—"}</td>
          <td><form action={updateAdminStatus} className="inline-form"><input type="hidden" name="table" value="pre_registrations"/><input type="hidden" name="id" value={r.id}/>
            <select name="admin_status" defaultValue={r.admin_status}><option value="new">Nuevo</option><option value="reviewed">Revisado</option><option value="contacted">Contactado</option><option value="converted">Convertido</option><option value="discarded">Descartado</option></select><button className="text-btn">Guardar</button>
          </form></td>
          <td><form action={updateAdminNotes} className="inline-form"><input type="hidden" name="table" value="pre_registrations"/><input type="hidden" name="id" value={r.id}/><input name="admin_notes" defaultValue={r.admin_notes??""} placeholder="Nota"/><button className="text-btn">OK</button></form></td>
        </tr>)}</tbody>
      </table></div>
    </section>
  </>;
}
