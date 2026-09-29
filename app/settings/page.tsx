import { PageHeader } from "@/components/page-header";
import { requireOsUser } from "@/lib/auth";
import { createOsUser, updateOsUser } from "./actions";

export default async function SettingsPage(){
  const { supabase, osUser } = await requireOsUser();
  const { data: users } = await supabase.from("os_users").select("*").order("name");

  return <>
    <PageHeader title="Configuración" subtitle="Usuarios internos, roles y acceso a Aktivity OS" />

    {osUser.role==="admin" && <section className="card" style={{marginBottom:16}}>
      <h2 className="section-title">Nuevo usuario interno</h2>
      <form action={createOsUser} className="form-grid">
        <input name="name" required placeholder="Nombre"/>
        <input name="email" required type="email" placeholder="Email"/>
        <select name="role" defaultValue="viewer">
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="sales">Sales</option>
          <option value="operations">Operations</option>
          <option value="viewer">Viewer</option>
        </select>
        <input name="auth_user_id" placeholder="Supabase Auth User ID (opcional)"/>
        <button className="btn" type="submit">Crear usuario</button>
      </form>
    </section>}

    <section className="card">
      <h2 className="section-title">Usuarios internos</h2>
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Auth ID</th><th></th></tr></thead>
        <tbody>{(users??[]).map(u=><tr key={u.id}>
          <td><strong>{u.name}</strong>{u.is_default&&<div className="muted">Propietario por defecto</div>}</td>
          <td>{u.email??"—"}</td>
          <td colSpan={4}>
            {osUser.role==="admin"
              ? <form action={updateOsUser} className="inline-form">
                  <input type="hidden" name="id" value={u.id}/>
                  <select name="role" defaultValue={u.role}>
                    <option value="admin">Admin</option><option value="manager">Manager</option><option value="sales">Sales</option><option value="operations">Operations</option><option value="viewer">Viewer</option>
                  </select>
                  <select name="status" defaultValue={u.status}><option value="active">Activo</option><option value="inactive">Inactivo</option></select>
                  <input name="auth_user_id" defaultValue={u.auth_user_id??""} placeholder="Auth User ID" style={{minWidth:260}}/>
                  <button className="text-btn" type="submit">Guardar</button>
                </form>
              : <span>{u.role} · {u.status}</span>}
          </td>
        </tr>)}</tbody>
      </table></div>
    </section>

    <div className="card" style={{marginTop:16}}>
      <h2 className="section-title">Acceso</h2>
      <div className="muted">Crear aquí un usuario interno no crea automáticamente su cuenta de Supabase Auth. Cuando añadamos a otra persona, primero crearemos/invitaremos su cuenta Auth y después vincularemos su Auth User ID. La estructura de propiedad del CRM ya está preparada para ello.</div>
    </div>
  </>;
}
