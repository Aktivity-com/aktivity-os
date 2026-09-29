"use client";

import { usePathname } from "next/navigation";

const nav = [
  ["Inicio","/"],
  ["Proyectos","/projects"],
  ["Tareas","/tasks"],
  ["Agenda","/agenda"],
  ["CRM","/crm"],
  ["Admin Aktivity","/admin"],
  ["Objetivos","/goals"],
  ["Inbox","/inbox"],
  ["Configuración","/settings"]
];

export function AppShell({children}:{children:React.ReactNode}) {
  const pathname = usePathname();
  const publicPage = pathname.startsWith("/login") || pathname.startsWith("/unauthorized");

  if (publicPage) return <main className="public-main">{children}</main>;

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><span>aktivity</span> OS</div>
      <nav className="nav">
        {nav.map(([item,href]) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return <a href={href} key={href} className={active ? "active" : ""}>{item}</a>;
        })}
      </nav>
    </aside>
    <main className="main">{children}</main>
    <nav className="mobile-nav">
      <a href="/">Inicio</a>
      <a href="/tasks">Tareas</a>
      <a href="/crm">CRM</a>
      <a href="/inbox" className="mobile-add">+</a>
      <a href="/settings">Más</a>
    </nav>
  </div>;
}
