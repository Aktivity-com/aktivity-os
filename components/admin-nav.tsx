const items = [
  ["Resumen","/admin"],
  ["Pre-registros","/admin/preregistrations"],
  ["Leads B2B","/admin/b2b-leads"],
  ["Referidos","/admin/referrals"],
  ["Contacto web","/admin/contact-requests"]
];

export function AdminNav({active}:{active:string}) {
  return <div className="tabs">
    {items.map(([label,href]) => <a key={href} href={href} className={"tab "+(active===href?"active":"")}>{label}</a>)}
  </div>;
}
