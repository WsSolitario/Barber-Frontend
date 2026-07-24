"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { AdminPageHeader, AdminPanel, AsyncContentState } from "@/components/admin/admin-ui";
import { httpClient } from "@/services/http-client";
import { useAuthStore } from "@/stores/auth-store";

type Report = { totalAppointments?: number; totalPaid?: number; netQuantity?: number; byStatus?: { status: string; count: number }[]; byMethod?: { type: string; count: number; amount: number }[]; byType?: { type: string; count: number; amount: number }[] };
const types = ["appointments", "finances", "inventory"] as const;
const labels = { appointments: "Citas", finances: "Finanzas", inventory: "Inventario" };

export default function ReportsPage() {
  const accessToken = useAuthStore((state) => state.accessToken); const hydrated = useAuthStore((state) => state.hydrated);
  const [type, setType] = useState<(typeof types)[number]>("appointments");
  const [startAt, setStartAt] = useState(() => new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10)); const [endAt, setEndAt] = useState(() => new Date().toISOString().slice(0, 10));
  const report = useQuery({ queryKey: ["reports", type, startAt, endAt], enabled: Boolean(accessToken) && hydrated, queryFn: async () => (await httpClient.get<Report>("/api/admin/reports", { params: { type, startAt: `${startAt}T00:00:00.000Z`, endAt: `${endAt}T23:59:59.999Z` }, headers: { Authorization: `Bearer ${accessToken}` } })).data });
  if (!hydrated) return <main className="p-8">Restaurando sesion...</main>;
  if (!accessToken) return <main className="p-8"><Link href="/auth/login">Inicia sesion para ver reportes.</Link></main>;
  const rows = report.data?.byStatus ?? report.data?.byMethod ?? report.data?.byType ?? [];
  const headline = type === "appointments" ? report.data?.totalAppointments ?? 0 : type === "finances" ? `$${report.data?.totalPaid ?? 0}` : report.data?.netQuantity ?? 0;
  return <div className="p-5 md:p-8"><AdminPageHeader eyebrow="Analisis operativo" title="Reportes" description="Consulta el comportamiento de la operación por periodo." /><AdminPanel className="mt-7"><div className="flex flex-col gap-5 border-b border-[#bac6c7] p-5 lg:flex-row lg:items-end lg:justify-between"><div className="flex flex-wrap gap-2" role="tablist" aria-label="Tipo de reporte">{types.map((item) => <button aria-selected={type === item} className={`min-h-11 px-4 text-sm font-extrabold ${type === item ? "bg-[#172b34] text-[#f4f3ed]" : "border border-[#bac6c7] text-[#486068] hover:border-[#172b34]"}`} key={item} onClick={() => setType(item)} role="tab">{labels[item]}</button>)}</div><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold text-[#486068]">Desde<input className="mt-1 block min-h-11 w-full border border-[#879a9e] bg-[#fffef9] px-3 text-sm text-[#172b34]" type="date" value={startAt} onChange={(event) => setStartAt(event.target.value)} /></label><label className="text-xs font-bold text-[#486068]">Hasta<input className="mt-1 block min-h-11 w-full border border-[#879a9e] bg-[#fffef9] px-3 text-sm text-[#172b34]" type="date" value={endAt} onChange={(event) => setEndAt(event.target.value)} /></label></div></div><AsyncContentState loading={report.isLoading} error={report.isError} empty={!report.isLoading && !report.isError && rows.length === 0} emptyTitle="Sin datos en este periodo" emptyDescription="Prueba con un rango de fechas más amplio o vuelve cuando haya actividad."><div className="grid lg:grid-cols-[.7fr_1.3fr]"><div className="border-b border-[#bac6c7] p-6 lg:border-b-0 lg:border-r"><p className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-[.1em] text-[#486068]">TOTAL DEL PERIODO</p><p className="mt-3 font-[family-name:var(--font-bebas-neue)] text-7xl leading-none tabular-nums text-[#172b34]">{headline}</p><p className="mt-4 text-sm leading-6 text-[#486068]">{labels[type]} consolidadas entre las fechas seleccionadas.</p></div><div className="divide-y divide-[#bac6c7]">{rows.map((row) => { const label = "status" in row ? row.status : row.type; return <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4 text-sm" key={label}><span className="font-bold text-[#172b34]">{label}</span><span className="tabular-nums text-[#486068]">{row.count} registros</span>{"amount" in row && <span className="tabular-nums font-extrabold text-[#172b34]">${row.amount}</span>}</div>; })}</div></div></AsyncContentState></AdminPanel></div>;
}
