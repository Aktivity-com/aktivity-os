import { PageHeader } from "@/components/page-header";
import { requireOsUser } from "@/lib/auth";
import { captureInboxItem, convertInboxToTask, discardInboxItem } from "./actions";

export default async function InboxPage(){
  const { supabase } = await requireOsUser();
  const { data: items } = await supabase
    .from("os_inbox_items")
    .select("*")
    .eq("status","pending")
    .order("created_at",{ascending:false});

  return <>
    <PageHeader title="Inbox" subtitle="Captura primero. Organiza después." />
    <section className="card" style={{marginBottom:16}}>
      <form action={captureInboxItem}>
        <textarea name="content" required placeholder="¿Qué quieres guardar?" style={{width:"100%",minHeight:120}} />
        <div className="inline-form" style={{marginTop:10}}>
          <select name="type" defaultValue="unclassified">
            <option value="unclassified">Sin clasificar</option>
            <option value="idea">Idea</option>
            <option value="action">Acción</option>
            <option value="lead">Lead</option>
            <option value="note">Nota</option>
          </select>
          <button className="btn" type="submit">Guardar en Inbox</button>
        </div>
      </form>
    </section>
    <section className="card">
      <h2 className="section-title">Pendientes · {(items ?? []).length}</h2>
      <div className="list">
        {(items ?? []).map(item => <div className="task-row" key={item.id}>
          <div className="task-main"><strong>{item.content}</strong><div className="muted">{item.type} · {new Date(item.created_at).toLocaleString("es-ES")}</div></div>
          <form action={convertInboxToTask}>
            <input type="hidden" name="id" value={item.id}/><input type="hidden" name="content" value={item.content}/>
            <button className="text-btn" type="submit">→ Tarea</button>
          </form>
          <form action={discardInboxItem}>
            <input type="hidden" name="id" value={item.id}/>
            <button className="text-btn danger" type="submit">Descartar</button>
          </form>
        </div>)}
        {(items ?? []).length === 0 && <div className="muted">Inbox vacío.</div>}
      </div>
    </section>
  </>;
}
