"use client";

import Link from "next/link";

import { AdminCalendar } from "@/components/calendar/admin-calendar";
import { useAuthStore } from "@/stores/auth-store";

export default function CalendarPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);

  if (!hydrated) return <main className="p-8">Restaurando sesion...</main>;
  if (!accessToken) return <main className="p-8"><h1 className="text-2xl font-bold">Calendario</h1><Link className="mt-3 inline-block text-amber-700 underline" href="/auth/login">Inicia sesion para ver el calendario.</Link></main>;

  return <div className="min-h-screen p-5 md:p-8"><header className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Agenda</p><h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Calendario de citas</h1></div><p className="max-w-sm text-sm text-stone-500">Gestiona llegadas y servicios sin salir de la agenda.</p></header><AdminCalendar accessToken={accessToken} /></div>;
}
