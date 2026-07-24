"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { httpClient } from "@/services/http-client";

type Appointment = { confirmationCode: string; status: string; paymentStatus: string; startAt: string; customer: { name: string }; barber: { name: string }; services: { serviceName: string }[] };

export default function AppointmentPage() {
  const params = useParams<{ confirmationCode: string }>();
  const confirmationCode = params.confirmationCode;
  const appointment = useQuery({ queryKey: ["public-appointment", confirmationCode], queryFn: async () => (await httpClient.get<Appointment>(`/api/public/appointments/${confirmationCode}`)).data, refetchInterval: 3000 });
  if (appointment.isLoading) return <main className="grid min-h-screen place-items-center bg-stone-950 text-stone-100">Confirmando pago...</main>;
  if (appointment.isError || !appointment.data) return <main className="grid min-h-screen place-items-center bg-stone-950 text-stone-100">No encontramos esta cita.</main>;
  const data = appointment.data;
  return <main className="grid min-h-screen place-items-center bg-stone-950 p-6 text-stone-100"><section className="w-full max-w-lg rounded-3xl border border-emerald-500/40 bg-stone-900 p-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-400">Cita {data.status === "PAID" ? "pagada" : "confirmada"}</p><h1 className="mt-3 text-3xl font-bold">{data.confirmationCode}</h1><p className="mt-4 text-stone-300">{data.customer.name}, tu cita con {data.barber.name} esta {data.paymentStatus === "PAID" ? "pagada" : "pendiente de confirmacion de pago"}.</p><p className="mt-5 rounded-xl bg-stone-800 p-4">{new Date(data.startAt).toLocaleString("es-MX")}<br />{data.services.map((service) => service.serviceName).join(", ")}</p><Link className="mt-6 inline-block text-sm underline underline-offset-8" href="/">Volver al inicio</Link></section></main>;
}
