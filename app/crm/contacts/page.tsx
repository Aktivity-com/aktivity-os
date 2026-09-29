import { PageHeader } from "@/components/page-header";
import { CrmNav } from "@/components/crm-nav";
import { requireOsUser } from "@/lib/auth";
import { createContact } from "../actions";

export default async function ContactsPage(){
  const { supabase, osUser } = await requireOsUser();
  const [{data: contacts},{data: organizations},{data: users},{data: relations}] = await Promise.all([
    supabase.from("contacts").select("*").order("first_name"),
    supabase.from("organizations").select("id,name").order("name"),
    supabase.from("os_users").select("id,name").eq("status","active").order("name"),
    supabase.from("organization_contacts").select("*")
  ]);
  const userMap=new Map((users??[]).map(u=>[u.id,u.name]));
  const orgMap=new Map((organizations??[]).map(o=>[o.id,o.name]));
  const relationMap=new Map((relations??[]).map(r=>[r.contact_id,r]));

  return <>
    <PageHeader title="Contactos" subtitle="Personas vinculadas a las organizaciones del CRM" />
    <CrmNav active="/crm/contacts" />
    <section className="card" style={{marginBottom:16}}>
      <h2 className="section-title">Nuevo contacto</h2>
      <form action={createContact} className="form-grid">
        <input name="first_name" required placeholder="Nombre"/>
        <input name="last_name" placeholder="Apellidos"/>
        <input name="email" type="email" placeholder="Email"/>
        <input name="phone" placeholder="Teléfono"/>
        <select name="organization_id" defaultValue=""><option value="">Sin organización</option>{(organizations??[]).map(o=><option value={o.id} key={o.id}>{o.name}</option>)}</select>
        <input name="job_title" placeholder="Cargo"/>
        <input name="department" placeholder="Departamento"/>
        <select name="owner_id" defaultValue={osUser.id}>{(users??[]).map(u=><option value={u.id} key={u.id}>{u.name}</option>)}</select>
        <input name="linkedin_url" placeholder="LinkedIn"/>
        <input name="source" placeholder="Fuente"/>
        <label style={{display:"flex",alignItems:"center",gap:6}}><input name="is_primary" type="checkbox"/> Contacto principal</label>
        <textarea name="notes" className="span-2" placeholder="Notas"/>
        <button className="btn" type="submit">Crear contacto</button>
      </form>
    </section>

    <section className="card">
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Contacto</th><th>Organización</th><th>Cargo</th><th>Propietario</th><th>Email</th><th>LinkedIn</th></tr></thead>
        <tbody>{(contacts??[]).map(c=>{
          const rel=relationMap.get(c.id);
          return <tr key={c.id}><td><strong>{c.first_name} {c.last_name??""}</strong></td>
          <td>{rel?orgMap.get(rel.organization_id):"—"}</td><td>{rel?.job_title??"—"}</td><td>{userMap.get(c.owner_id)??"—"}</td>
          <td>{c.email??"—"}</td><td>{c.linkedin_url?<a href={c.linkedin_url} target="_blank">Abrir</a>:"—"}</td></tr>
        })}</tbody>
      </table></div>
    </section>
  </>;
}
