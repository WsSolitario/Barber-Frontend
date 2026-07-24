"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { AdminPageHeader, AdminPanel, AsyncContentState, StatusBadge } from "@/components/admin/admin-ui";
import { httpClient } from "@/services/http-client";
import { useAuthStore } from "@/stores/auth-store";

type Branch = { id: string; name: string; code: string; address?: string; phone?: string; timezone?: string; status: "ACTIVE" | "INACTIVE" };

export default function SettingsPage() {
  const accessToken = useAuthStore((state) => state.accessToken); const hydrated = useAuthStore((state) => state.hydrated);
  const branches = useQuery({ queryKey: ["branches"], enabled: Boolean(accessToken) && hydrated, queryFn: async () => (await httpClient.get<Branch[]>("/api/admin/branches", { headers: { Authorization: `Bearer ${accessToken}` } })).data });
  if (!hydrated) return <main className="p-8">Restaurando sesion...</main>;
  if (!accessToken) return <main className="p-8"><h1 className="text-2xl font-bold">Configuracion</h1><Link className="mt-3 inline-block underline" href="/auth/login">Inicia sesion para ver la configuracion.</Link></main>;
  return <div className="p-5 md:p-8"><AdminPageHeader eyebrow="Operación" title="Configuración" description="Sucursales disponibles y datos operativos de tu organización." /><AdminPanel className="mt-7"><div className="border-b border-[#bac6c7] p-5"><h2 className="font-bold">Sucursales</h2></div><AsyncContentState loading={branches.isLoading} error={branches.isError} empty={!branches.isLoading && !branches.isError && branches.data?.length === 0} emptyTitle="No hay sucursales configuradas" emptyDescription="Crea una sucursal para comenzar a organizar agenda, servicios y equipo."><div className="divide-y divide-[#bac6c7]">{branches.data?.map((branch) => <article className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-start" key={branch.id}><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h3 className="font-bold text-[#172b34]">{branch.name}</h3><span className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-[.08em] text-[#486068]">{branch.code}</span></div><dl className="mt-3 grid gap-x-8 gap-y-1 text-sm text-[#486068] sm:grid-cols-2"><div><dt className="sr-only">Dirección</dt><dd className="truncate" title={branch.address}>{branch.address ?? "Sin dirección registrada"}</dd></div><div><dt className="sr-only">Zona horaria</dt><dd>{branch.timezone ?? "Zona horaria no configurada"}</dd></div></dl></div><StatusBadge status={branch.status} label={branch.status === "ACTIVE" ? "Activa" : "Inactiva"} /></article>)}</div></AsyncContentState></AdminPanel></div>;
}
