import type { ReactNode } from "react";

export function AdminPageHeader({ eyebrow, title, description, action }: Readonly<{ eyebrow: string; title: string; description?: string; action?: ReactNode }>) {
  return <header className="flex flex-wrap items-end justify-between gap-5 border-b border-[#bac6c7] pb-6"><div><p className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-[.12em] text-[#486068]">{eyebrow}</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#172b34] md:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-xl text-sm leading-6 text-[#486068]">{description}</p>}</div>{action}</header>;
}

export function AdminPanel({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return <section className={`border border-[#bac6c7] bg-[#fffef9] ${className}`}>{children}</section>;
}

export function AsyncContentState({ loading, error, empty, emptyTitle, emptyDescription, children }: Readonly<{ loading: boolean; error: boolean; empty?: boolean; emptyTitle?: string; emptyDescription?: string; children: ReactNode }>) {
  if (loading) return <div className="py-12 text-center" role="status"><p className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-[.1em] text-[#486068]">Cargando datos...</p><p className="mt-2 text-sm text-[#486068]">Estamos preparando esta vista.</p></div>;
  if (error) return <div className="border-l-2 border-[#b94a3f] bg-[#fae9e5] p-5" role="alert"><p className="font-bold text-[#7b2d25]">No pudimos cargar esta información.</p><p className="mt-1 text-sm leading-6 text-[#7b2d25]">Actualiza la página o verifica que tienes permisos para consultar estos datos.</p></div>;
  if (empty) return <div className="py-14 text-center"><p className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-[.08em] text-[#172b34]">{emptyTitle ?? "Aún no hay registros"}</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#486068]">{emptyDescription ?? "Cuando haya actividad, aparecerá aquí para que puedas actuar sobre ella."}</p></div>;
  return children;
}

const statusStyles = { ACTIVE: "bg-[#dff0df] text-[#285a35]", INACTIVE: "bg-[#e8ece8] text-[#486068]", LOCKED: "bg-[#fae9e5] text-[#7b2d25]", PAID: "bg-[#dff0df] text-[#285a35]", PENDING: "bg-[#f9edca] text-[#765713]", DEFAULT: "bg-[#e8ece8] text-[#486068]" };

export function StatusBadge({ status, label }: Readonly<{ status: keyof typeof statusStyles; label?: string }>) {
  return <span className={`inline-flex items-center px-2.5 py-1 text-xs font-extrabold tracking-wide ${statusStyles[status] ?? statusStyles.DEFAULT}`}>{label ?? status}</span>;
}
