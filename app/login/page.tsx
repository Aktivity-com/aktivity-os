import { login } from "./actions";

export default async function LoginPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params = await searchParams;
  return (
    <div style={{maxWidth:420,margin:"12vh auto",background:"#fff",border:"1px solid var(--border)",borderRadius:16,padding:28}}>
      <div className="brand" style={{color:"#101820",marginBottom:8}}><span>aktivity</span> OS</div>
      <p className="muted" style={{marginTop:0}}>Acceso interno</p>
      <form action={login} className="grid">
        <label>
          <div style={{fontWeight:700,marginBottom:6}}>Email</div>
          <input name="email" type="email" required style={{width:"100%",padding:11,border:"1px solid var(--border)",borderRadius:9}} />
        </label>
        <label>
          <div style={{fontWeight:700,marginBottom:6}}>Contraseña</div>
          <input name="password" type="password" required style={{width:"100%",padding:11,border:"1px solid var(--border)",borderRadius:9}} />
        </label>
        {params.error && <div style={{color:"var(--danger)"}}>{params.error}</div>}
        <button className="btn" type="submit">Entrar</button>
      </form>
    </div>
  );
}
