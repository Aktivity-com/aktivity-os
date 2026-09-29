export function PageHeader({title,subtitle,action}:{title:string;subtitle?:string;action?:string}) {
  return <div className="topbar">
    <div><h1 className="page-title">{title}</h1>{subtitle && <div className="muted">{subtitle}</div>}</div>
    {action && <button className="btn">{action}</button>}
  </div>;
}
