const items = [
  ["Resumen","/crm"],
  ["Organizaciones","/crm/organizations"],
  ["Contactos","/crm/contacts"],
  ["Oportunidades","/crm/opportunities"],
  ["Pipeline","/crm/pipeline"],
  ["Actividad","/crm/activities"]
];

export function CrmNav({active}:{active:string}) {
  return <div className="tabs">
    {items.map(([label,href]) => <a key={href} href={href} className={"tab "+(active===href?"active":"")}>{label}</a>)}
  </div>;
}
