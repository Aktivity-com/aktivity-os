import { PageHeader } from "@/components/page-header";
import { AdminNav } from "@/components/admin-nav";
import { requireOsUser } from "@/lib/auth";
import { updateAdminNotes, updateAdminStatus } from "../actions";

export default async function ReferralsPage(){
  const { supabase } = await requireOsUser();
  const { data: rows } = await supabase.from("referrals").select("*").order("created_at",{ascending:false});
  return <>
    <PageHeader title="Referidos" subtitle="Personas y organizaciones recomendadas desde la web" />
    <AdminNav active="/admin/referrals" />
    <section className="card"><div className="table-wrap"><table className="data-table">
      <thead><tr><th>Fecha</th><th>Tipo</th><th>Recomienda</th><th>Organización</th><th>Recomendado</th><th>Estado</th><th>Notas</th></tr></thead>
      <tbody>{(rows??[]).map(r=><tr key={r.id}>
        <td>{new Date(r.created_at).toLocaleString("es-ES")}</td><td>{r.referral_type}</td><td>{r.referrer_name}<div className="muted">{r.referrer_email}</div></td><td>{r.organization_name}</td><td>{r.recommended_name}<div className="muted">{r.recommended_email??""}</div></td>
        <td><form action={updateAdminStatus} className="inline-form"><input type="hidden" name="table" value="referrals"/><input type="hidden" name="id" value={r.id}/><select name="admin_status" defaultValue={r.admin_status}><option value="new">Nuevo</option><option value="reviewed">Revisado</option><option value="contacted">Contactado</option><option value="converted">Convertido</option><option value="discarded">Descartado</option></select><button className="text-btn">Guardar</button></form></td>
        <td><form action={updateAdminNotes} className="inline-form"><input type="hidden" name="table" value="referrals"/><input type="hidden" name="id" value={r.id}/><input name="admin_notes" defaultValue={r.admin_notes??""}/><button className="text-btn">OK</button></form></td>
      </tr>)}</tbody>
    </table></div></section>
  </>;
}
