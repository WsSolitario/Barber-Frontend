"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { AdminPageHeader, AdminPanel, AsyncContentState, StatusBadge } from "@/components/admin/admin-ui";
import { httpClient } from "@/services/http-client";
import { useAuthStore } from "@/stores/auth-store";

type User = { id: string; firstName: string; lastName?: string; email: string; status: "ACTIVE" | "INACTIVE" | "LOCKED"; roles: { code: string; name: string }[] };

export default function UsersPage() {
  const accessToken = useAuthStore((state) => state.accessToken); const hydrated = useAuthStore((state) => state.hydrated);
  const users = useQuery({ queryKey: ["users"], enabled: Boolean(accessToken) && hydrated, queryFn: async () => (await httpClient.get<User[]>("/api/admin/users", { headers: { Authorization: `Bearer ${accessToken}` } })).data });
  if (!hydrated) return <main className="p-8">Restaurando sesion...</main>;
  if (!accessToken) return <main className="p-8"><h1 className="text-2xl font-bold">Equipo</h1><Link className="mt-3 inline-block underline" href="/auth/login">Inicia sesion para ver el equipo.</Link></main>;
  return <div className="p-5 md:p-8"><AdminPageHeader eyebrow="Personas y accesos" title="Usuarios y permisos" description="Revisa quién puede operar la organización y con qué rol." /><AdminPanel className="mt-7"><div className="flex items-center justify-between border-b border-[#bac6c7] p-5"><h2 className="font-bold">Miembros</h2><span className="font-[family-name:var(--font-bebas-neue)] text-2xl tabular-nums text-[#486068]">{users.data?.length ?? 0}</span></div><AsyncContentState loading={users.isLoading} error={users.isError} empty={!users.isLoading && !users.isError && users.data?.length === 0} emptyTitle="Aún no hay usuarios" emptyDescription="Los miembros con acceso aparecerán aquí cuando se creen."><div className="divide-y divide-[#bac6c7]">{users.data?.map((user) => <article className="grid gap-3 p-5 md:grid-cols-[3rem_1fr_auto_auto] md:items-center" key={user.id}><span className="grid size-11 place-items-center rounded-full bg-[#e8d6b3] font-bold text-[#172b34]">{user.firstName.slice(0, 1).toUpperCase()}</span><div className="min-w-0"><h3 className="font-bold text-[#172b34]">{user.firstName} {user.lastName}</h3><p className="truncate text-sm text-[#486068]" title={user.email}>{user.email}</p></div><p className="text-sm font-bold text-[#486068]">{user.roles.map((role) => role.name).join(" · ") || "Sin rol"}</p><StatusBadge status={user.status} label={user.status === "ACTIVE" ? "Activo" : user.status === "INACTIVE" ? "Inactivo" : "Bloqueado"} /></article>)}</div></AsyncContentState></AdminPanel></div>;
}
