"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { AdminCalendar } from "@/components/calendar/admin-calendar";
import { httpClient } from "@/services/http-client";
import { useAuthStore } from "@/stores/auth-store";

type Dashboard = { totalAppointments: number; dailyIncome: number; pendingTransfers: number; activeBarbers: number; appointments: Record<string, number> };

const metrics = [
  { key: "totalAppointments", label: "Citas de hoy", accent: "bg-amber-400" },
  { key: "dailyIncome", label: "Ingresos de hoy", accent: "bg-emerald-500" },
  { key: "pendingTransfers", label: "Transferencias", accent: "bg-sky-500" },
  { key: "activeBarbers", label: "Barberos activos", accent: "bg-violet-500" },
] as const;

export default function AdminPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const dashboard = useQuery({ queryKey: ["dashboard"], enabled: Boolean(accessToken), queryFn: async () => (await httpClient.get<Dashboard>("/api/admin/dashboard", { headers: { Authorization: `Bearer ${accessToken}` } })).data });

  if (!hydrated) return <main className="p-8">Restaurando sesion...</main>;
  if (!accessToken) return <main className="p-8"><h1 className="text-2xl font-bold">Panel administrativo</h1><Link className="mt-3 inline-block text-amber-700 underline" href="/auth/login">Inicia sesion para abrir el dashboard.</Link></main>;

  return <div className="p-5 md:p-8"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Vista general</p><h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Buenos dias, equipo.</h1><p className="mt-2 text-stone-500">Una mirada a la operacion de hoy.</p></div><Link className="rounded-xl bg-stone-950 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-stone-800" href="/admin/calendar">Abrir calendario</Link></header>{dashboard.isLoading && <p className="mt-8 text-stone-500">Cargando dashboard...</p>}{dashboard.isError && <p className="mt-8 rounded-xl bg-red-50 p-4 text-red-800">No fue posible cargar el resumen. Intenta actualizar la pagina.</p>}{dashboard.data && <><section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => { const value = dashboard.data[metric.key]; return <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200" key={metric.key}><div className={`h-1.5 ${metric.accent}`} /><div className="p-5"><p className="text-sm text-stone-500">{metric.label}</p><p className="mt-2 text-3xl font-black">{metric.key === "dailyIncome" ? `$${value}` : value}</p></div></article>; })}</section><section className="mt-8 grid gap-5 xl:grid-cols-[1.5fr_1fr]"><div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Proximos siete dias</p><h2 className="mt-1 text-xl font-bold">Agenda proxima</h2></div><Link className="text-sm font-bold text-amber-700 hover:text-amber-900" href="/admin/calendar">Ver completa</Link></div><AdminCalendar accessToken={accessToken} compact /></div><div className="rounded-2xl bg-stone-950 p-5 text-white shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-400">Pulso de citas</p><h2 className="mt-1 text-xl font-bold">Estados actuales</h2><div className="mt-6 space-y-3">{Object.entries(dashboard.data.appointments ?? {}).map(([status, count]) => <div className="flex items-center justify-between border-b border-stone-800 pb-3" key={status}><span className="text-sm text-stone-300">{status.replaceAll("_", " ")}</span><span className="grid size-8 place-items-center rounded-full bg-stone-800 text-sm font-bold">{count}</span></div>)}</div></div></section></>}</div>;
}
