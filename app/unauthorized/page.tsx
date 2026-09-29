export default function UnauthorizedPage(){
  return <div className="card" style={{maxWidth:600,margin:"10vh auto"}}>
    <h1>Acceso no autorizado</h1>
    <p className="muted">Tu cuenta de Supabase Auth todavía no está vinculada a un usuario interno de Aktivity OS.</p>
  </div>;
}
