import { PageHeader } from "@/components/page-header";
import { CrmNav } from "@/components/crm-nav";
import { requireOsUser } from "@/lib/auth";
import { createOrganization } from "../actions";

export default async function OrganizationsPage(){
  const { supabase, osUser } = await requireOsUser();
  const [{data: organizations},{data: users}] = await Promise.all([
    supabase.from("organizations").select("*").order("name"),
    supabase.from("os_users").select("id,name").eq("status","active").order("name")
  ]);
  const userMap=new Map((users??[]).map(u=>[u.id,u.name]));

  return <>
    <PageHeader title="Organizaciones" subtitle="Una única ficha por empresa, organizador, club, universidad, colectivo o marca" />
    <CrmNav active="/crm/organizations" />

    <section className="card" style={{marginBottom:16}}>
      <h2 className="section-title">Nueva organización</h2>
      <form action={createOrganization} className="form-grid">
        <input name="name" required placeholder="Nombre"/>
        <select name="organization_type" defaultValue="company">
          <option value="company">Empresa</option><option value="organizer">Organizador</option><option value="club">Club</option>
          <option value="university">Universidad</option><option value="collective">Colectivo</option><option value="brand">Marca</option>
          <option value="partner">Partner</option><option value="other">Otro</option>
        </select>
        <select name="owner_id" defaultValue={osUser.id}>{(users??[]).map(u=><option value={u.id} key={u.id}>{u.name}</option>)}</select>
        <input name="role_type" placeholder="Rol adicional (opcional)"/>
        <input name="website" placeholder="Web"/>
        <input name="domain" placeholder="Dominio"/>
        <input name="sector" placeholder="Sector"/>
        <input name="size" placeholder="Tamaño"/>
        <input name="country" placeholder="País"/>
        <input name="region" placeholder="Región / CCAA"/>
        <input name="city" placeholder="Ciudad"/>
        <input name="source" placeholder="Fuente"/>
        <textarea name="notes" className="span-2" placeholder="Notas"/>
        <button className="btn" type="submit">Crear organización</button>
      </form>
    </section>

    <section className="card">
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Organización</th><th>Tipo</th><th>Propietario</th><th>Sector</th><th>Ubicación</th><th>Fuente</th></tr></thead>
        <tbody>{(organizations??[]).map(o=><tr key={o.id}>
          <td><strong>{o.name}</strong><div className="muted">{o.domain ?? o.website ?? ""}</div></td>
          <td>{o.organization_type}</td><td>{userMap.get(o.owner_id)??"—"}</td><td>{o.sector??"—"}</td>
          <td>{[o.city,o.region,o.country].filter(Boolean).join(", ")||"—"}</td><td>{o.source??"—"}</td>
        </tr>)}</tbody>
      </table></div>
    </section>
  </>;
}
