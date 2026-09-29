import { PageHeader } from "@/components/page-header";
import { CrmNav } from "@/components/crm-nav";
import { requireOsUser } from "@/lib/auth";
import { moveOpportunity } from "../actions";

export default async function PipelinePage(){
  const { supabase } = await requireOsUser();
  const [{data: opportunities},{data: stages},{data: organizations}] = await Promise.all([
    supabase.from("crm_opportunities").select("*").order("created_at"),
    supabase.from("crm_pipeline_stages").select("*").order("sort_order"),
    supabase.from("organizations").select("id,name")
  ]);
  const orgMap=new Map((organizations??[]).map(o=>[o.id,o.name]));
  return <>
    <PageHeader title="Pipeline" subtitle="Vista Kanban del proceso comercial" />
    <CrmNav active="/crm/pipeline" />
    <div className="kanban">
      {(stages??[]).map(stage=>{
        const cards=(opportunities??[]).filter(o=>o.stage_id===stage.id);
        const total=cards.reduce((sum,o)=>sum+Number(o.value??0),0);
        return <section className="kanban-col" key={stage.id}>
          <div className="kanban-head"><strong>{stage.name}</strong><span className="muted">{cards.length} · {total.toLocaleString("es-ES")} €</span></div>
          <div className="kanban-cards">{cards.map(o=><div className="kanban-card" key={o.id}>
            <strong>{o.name}</strong>
            <div className="muted">{orgMap.get(o.organization_id)??"—"}</div>
            <div style={{fontWeight:700,margin:"8px 0"}}>{o.value?Number(o.value).toLocaleString("es-ES")+" €":"—"}</div>
            <form action={moveOpportunity} className="inline-form">
              <input type="hidden" name="id" value={o.id}/>
              <select name="stage_id" defaultValue={o.stage_id}>{(stages??[]).filter(s=>s.pipeline_id===o.pipeline_id).map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select>
              <button className="text-btn" type="submit">Mover</button>
            </form>
          </div>)}</div>
        </section>
      })}
    </div>
  </>;
}
