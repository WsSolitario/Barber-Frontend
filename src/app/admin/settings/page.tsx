"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

import { AdminPageHeader, AdminPanel, AsyncContentState, StatusBadge } from "@/components/admin/admin-ui";
import { httpClient } from "@/services/http-client";
import { useAuthStore } from "@/stores/auth-store";

type Branch = { id: string; name: string; code: string; address?: string; phone?: string; timezone?: string; status: "ACTIVE" | "INACTIVE" };
type Settings = { businessName?: string };
type Weekday = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
type BusinessHour = { weekday: Weekday; closed: boolean; startTime?: string | null; endTime?: string | null };

const today = () => new Date().toISOString().slice(0, 10);
const weekdays: { value: Weekday; label: string }[] = [
  { value: "MONDAY", label: "Lunes" }, { value: "TUESDAY", label: "Martes" }, { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" }, { value: "FRIDAY", label: "Viernes" }, { value: "SATURDAY", label: "Sábado" }, { value: "SUNDAY", label: "Domingo" },
];
const defaultHours = (): BusinessHour[] => weekdays.map(({ value }) => ({ weekday: value, closed: value === "SUNDAY", startTime: "09:00", endTime: "20:00" }));
const inputClass = "mt-1 min-h-11 w-full border border-[#879a9e] bg-[#fffef9] px-3 text-[#172b34]";
const buttonClass = "min-h-11 bg-[#172b34] px-4 text-sm font-extrabold text-[#f4f3ed] disabled:opacity-50";

export default function SettingsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const queryClient = useQueryClient();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch>();
  const [hoursBranchId, setHoursBranchId] = useState("");
  const [editedHours, setEditedHours] = useState<BusinessHour[]>();
  const [closureBranchId, setClosureBranchId] = useState("");
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("20:00");

  const settings = useQuery({ queryKey: ["settings"], enabled: Boolean(accessToken) && hydrated, queryFn: async () => (await httpClient.get<Settings>("/api/admin/settings", { headers })).data });
  const branches = useQuery({ queryKey: ["branches"], enabled: Boolean(accessToken) && hydrated, queryFn: async () => (await httpClient.get<Branch[]>("/api/admin/branches", { headers })).data });
  const selectedHoursBranchId = hoursBranchId || branches.data?.[0]?.id || "";
  const selectedClosureBranchId = closureBranchId || branches.data?.[0]?.id || "";
  const branchHours = useQuery({ queryKey: ["branch-business-hours", selectedHoursBranchId], enabled: Boolean(accessToken) && hydrated && Boolean(selectedHoursBranchId), queryFn: async () => (await httpClient.get<BusinessHour[]>(`/api/admin/branches/${selectedHoursBranchId}/business-hours`, { headers })).data });
  const hours = editedHours ?? (branchHours.data ? weekdays.map(({ value }) => branchHours.data.find((hour) => hour.weekday === value) ?? { weekday: value, closed: true }) : defaultHours());

  async function saveBusinessName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const businessName = String(new FormData(event.currentTarget).get("businessName")).trim(); if (!businessName) return;
    setIsSaving(true); setMessage("");
    try { await httpClient.put("/api/admin/settings", { businessName: businessName.trim() }, { headers }); await queryClient.invalidateQueries({ queryKey: ["settings"] }); setMessage("Nombre del negocio actualizado."); }
    catch { setMessage("No fue posible actualizar el nombre del negocio."); }
    finally { setIsSaving(false); }
  }

  async function saveBranch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const data = { name: String(form.get("name")).trim(), code: String(form.get("code")).trim(), address: String(form.get("address")).trim() || undefined, phone: String(form.get("phone")).trim() || undefined, timezone: String(form.get("timezone")).trim() || undefined, status: (form.get("status") as "ACTIVE" | "INACTIVE") };
    setIsSaving(true); setMessage("");
    try {
      if (editingBranch) await httpClient.put(`/api/admin/branches/${editingBranch.id}`, data, { headers });
      else await httpClient.post("/api/admin/branches", data, { headers });
      await queryClient.invalidateQueries({ queryKey: ["branches"] }); setShowBranchForm(false); setEditingBranch(undefined); setMessage(editingBranch ? "Sucursal actualizada." : "Sucursal creada.");
    } catch { setMessage("No fue posible guardar la sucursal. Revisa los datos y tus permisos."); }
    finally { setIsSaving(false); }
  }

  async function deactivateBranch(branch: Branch) {
    if (!window.confirm(`Desactivar ${branch.name}? No estará disponible para nuevas reservas.`)) return;
    setIsSaving(true); setMessage("");
    try { await httpClient.put(`/api/admin/branches/${branch.id}`, { name: branch.name, code: branch.code, address: branch.address, phone: branch.phone, timezone: branch.timezone, status: "INACTIVE" }, { headers }); await queryClient.invalidateQueries({ queryKey: ["branches"] }); setMessage("Sucursal desactivada."); }
    catch { setMessage("No fue posible desactivar la sucursal."); }
    finally { setIsSaving(false); }
  }

  async function saveHours(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selectedHoursBranchId) return;
    const payload = hours.map((hour) => hour.closed ? { weekday: hour.weekday, closed: true } : { weekday: hour.weekday, closed: false, startTime: hour.startTime || "09:00", endTime: hour.endTime || "20:00" });
    if (hours.some((hour) => !hour.closed && (hour.startTime ?? "") >= (hour.endTime ?? ""))) { setMessage("La hora de cierre debe ser posterior a la de apertura."); return; }
    setIsSaving(true); setMessage("");
    try { await httpClient.put(`/api/admin/branches/${selectedHoursBranchId}/business-hours`, { hours: payload }, { headers }); await queryClient.invalidateQueries({ queryKey: ["branch-business-hours", selectedHoursBranchId] }); setEditedHours(undefined); setMessage("Horario semanal actualizado."); }
    catch { setMessage("No fue posible guardar el horario semanal."); }
    finally { setIsSaving(false); }
  }

  async function blockPeriod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selectedClosureBranchId) return;
    const startAt = new Date(`${date}T${startTime}:00`).toISOString(); const endAt = new Date(`${date}T${endTime}:00`).toISOString();
    if (startAt >= endAt) { setMessage("La hora de cierre debe ser posterior a la hora de inicio."); return; }
    setIsSaving(true); setMessage("");
    try { await httpClient.post(`/api/admin/branches/${selectedClosureBranchId}/blocked-periods`, { startAt, endAt, reason: "Horario excepcional" }, { headers }); setMessage("Horario excepcional guardado. Ya no se mostrarán citas en esta franja."); }
    catch { setMessage("No fue posible guardar el horario. Verifica tus permisos."); }
    finally { setIsSaving(false); }
  }

  if (!hydrated) return <main className="p-8">Restaurando sesion...</main>;
  if (!accessToken) return <main className="p-8"><h1 className="text-2xl font-bold">Configuracion</h1><Link className="mt-3 inline-block underline" href="/auth/login">Inicia sesion para ver la configuracion.</Link></main>;

  const branchForm = <form className="grid gap-4 p-5" onSubmit={saveBranch}>
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-[#486068]">Nombre<input className={inputClass} defaultValue={editingBranch?.name} name="name" required /></label><label className="text-sm font-bold text-[#486068]">Código<input className={inputClass} defaultValue={editingBranch?.code} name="code" required /></label></div>
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-[#486068]">Dirección<input className={inputClass} defaultValue={editingBranch?.address} name="address" /></label><label className="text-sm font-bold text-[#486068]">Teléfono<input className={inputClass} defaultValue={editingBranch?.phone} name="phone" /></label></div>
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-[#486068]">Zona horaria<input className={inputClass} defaultValue={editingBranch?.timezone ?? "America/Mexico_City"} name="timezone" /></label><label className="text-sm font-bold text-[#486068]">Estado<select className={inputClass} defaultValue={editingBranch?.status ?? "ACTIVE"} name="status"><option value="ACTIVE">Activa</option><option value="INACTIVE">Inactiva</option></select></label></div>
    <div className="flex flex-wrap gap-3"><button className={buttonClass} disabled={isSaving}>{editingBranch ? "Guardar sucursal" : "Crear sucursal"}</button><button className="min-h-11 border border-[#879a9e] px-4 text-sm font-bold text-[#486068]" onClick={() => { setShowBranchForm(false); setEditingBranch(undefined); }} type="button">Cancelar</button></div>
  </form>;

  return <div className="p-5 md:p-8">
    <AdminPageHeader action={<button className={buttonClass} onClick={() => { setEditingBranch(undefined); setShowBranchForm(true); }}>Nueva sucursal</button>} eyebrow="Operación" title="Configuración" description="Datos del negocio, sucursales y horarios de atención." />
    {message && <p className="mt-5 border border-[#bac6c7] bg-[#fffef9] p-3 text-sm text-[#486068]" role="status">{message}</p>}
    <AdminPanel className="mt-7"><form className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-end" key={settings.data?.businessName} onSubmit={saveBusinessName}><label className="text-sm font-bold text-[#486068]">Nombre del negocio<input className={inputClass} defaultValue={settings.data?.businessName} name="businessName" required /></label><button className={buttonClass} disabled={isSaving || settings.isLoading}>Guardar nombre</button></form>{settings.isError && <p className="border-t border-[#bac6c7] p-5 text-sm text-[#7b2d25]" role="alert">No fue posible cargar el nombre del negocio.</p>}</AdminPanel>
    {showBranchForm && <AdminPanel className="mt-7"><div className="border-b border-[#bac6c7] p-5"><h2 className="font-bold">Crear sucursal</h2></div>{branchForm}</AdminPanel>}
    {editingBranch && <AdminPanel className="mt-7"><div className="border-b border-[#bac6c7] p-5"><h2 className="font-bold">Editar {editingBranch.name}</h2></div>{branchForm}</AdminPanel>}
    <AdminPanel className="mt-7"><div className="flex items-center justify-between border-b border-[#bac6c7] p-5"><h2 className="font-bold">Sucursales</h2><span className="font-[family-name:var(--font-bebas-neue)] text-2xl tabular-nums text-[#486068]">{branches.data?.length ?? 0}</span></div><AsyncContentState loading={branches.isLoading} error={branches.isError} empty={!branches.isLoading && !branches.isError && branches.data?.length === 0} emptyTitle="No hay sucursales configuradas" emptyDescription="Crea una sucursal para comenzar a organizar agenda, servicios y equipo."><div className="divide-y divide-[#bac6c7]">{branches.data?.map((branch) => <article className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-start" key={branch.id}><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h3 className="font-bold text-[#172b34]">{branch.name}</h3><span className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-[.08em] text-[#486068]">{branch.code}</span><StatusBadge status={branch.status} label={branch.status === "ACTIVE" ? "Activa" : "Inactiva"} /></div><p className="mt-3 truncate text-sm text-[#486068]" title={branch.address}>{branch.address ?? "Sin dirección registrada"}</p><p className="mt-1 text-sm text-[#486068]">{branch.timezone ?? "Zona horaria no configurada"}</p></div><div className="flex flex-wrap gap-2"><button className="min-h-10 border border-[#879a9e] px-3 text-sm font-bold text-[#486068]" onClick={() => { setEditingBranch(branch); setShowBranchForm(false); }}>Editar</button>{branch.status === "ACTIVE" && <button className="min-h-10 border border-[#b94a3f] px-3 text-sm font-bold text-[#7b2d25] disabled:opacity-50" disabled={isSaving} onClick={() => deactivateBranch(branch)}>Desactivar</button>}</div></article>)}</div></AsyncContentState></AdminPanel>
    <AdminPanel className="mt-7"><div className="border-b border-[#bac6c7] p-5"><h2 className="font-bold">Horario semanal</h2><p className="mt-1 text-sm text-[#486068]">Define la apertura de cada sucursal. Los días cerrados no muestran disponibilidad.</p></div><form className="p-5" onSubmit={saveHours}><label className="block max-w-md text-sm font-bold text-[#486068]">Sucursal<select className={inputClass} onChange={(event) => { setHoursBranchId(event.target.value); setEditedHours(undefined); }} value={selectedHoursBranchId}><option value="">Selecciona una sucursal...</option>{branches.data?.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label><AsyncContentState loading={Boolean(selectedHoursBranchId) && branchHours.isLoading} error={Boolean(selectedHoursBranchId) && branchHours.isError}>{selectedHoursBranchId && <div className="mt-5 grid gap-3">{hours.map((hour, index) => <div className="grid gap-3 border border-[#bac6c7] p-3 sm:grid-cols-[7rem_8rem_1fr_1fr] sm:items-center" key={hour.weekday}><strong className="text-sm text-[#172b34]">{weekdays[index].label}</strong><label className="flex items-center gap-2 text-sm font-bold text-[#486068]"><input checked={hour.closed} onChange={(event) => setEditedHours(hours.map((item) => item.weekday === hour.weekday ? { ...item, closed: event.target.checked } : item))} type="checkbox" /> Cerrado</label><label className="text-sm text-[#486068]">Abre<input className={inputClass} disabled={hour.closed} onChange={(event) => setEditedHours(hours.map((item) => item.weekday === hour.weekday ? { ...item, startTime: event.target.value } : item))} type="time" value={hour.startTime ?? "09:00"} /></label><label className="text-sm text-[#486068]">Cierra<input className={inputClass} disabled={hour.closed} onChange={(event) => setEditedHours(hours.map((item) => item.weekday === hour.weekday ? { ...item, endTime: event.target.value } : item))} type="time" value={hour.endTime ?? "20:00"} /></label></div>)}</div>}</AsyncContentState><button className={`mt-5 ${buttonClass}`} disabled={isSaving || !selectedHoursBranchId || branchHours.isLoading}>Guardar horario semanal</button></form></AdminPanel>
    <AdminPanel className="mt-7"><form className="grid gap-4 p-5 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto] lg:items-end" onSubmit={blockPeriod}><div><p className="font-bold text-[#172b34]">Horario excepcional</p><p className="mt-1 text-sm leading-6 text-[#486068]">Bloquea una franja sin modificar el horario semanal.</p></div><label className="text-sm font-bold text-[#486068]">Sucursal<select className={inputClass} onChange={(event) => setClosureBranchId(event.target.value)} required value={selectedClosureBranchId}><option value="">Selecciona...</option>{branches.data?.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label><label className="text-sm font-bold text-[#486068]">Fecha<input className={inputClass} min={today()} onChange={(event) => setDate(event.target.value)} required type="date" value={date} /></label><label className="text-sm font-bold text-[#486068]">De<input className={inputClass} onChange={(event) => setStartTime(event.target.value)} required type="time" value={startTime} /></label><label className="text-sm font-bold text-[#486068]">A<input className={inputClass} onChange={(event) => setEndTime(event.target.value)} required type="time" value={endTime} /></label><button className={buttonClass} disabled={isSaving || !selectedClosureBranchId}>Bloquear franja</button></form></AdminPanel>
  </div>;
}
