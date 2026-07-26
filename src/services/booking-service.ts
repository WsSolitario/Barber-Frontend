import { httpClient } from "@/services/http-client";

export type Branch = { id: string; name: string; address?: string; phone?: string; timezone: string };
export type Service = { id: string; name: string; description?: string; price: string | number; durationMinutes: number; cleanupMinutes: number; depositRequired: string | number };
export type Barber = { id: string; name: string; description?: string; specialties: string[] };
export type AppointmentHold = { holdId: string; token: string; startAt: string; endAt: string; expiresAt: string };
export type Availability = { durationMinutes: number; slots: { startAt: string; endAt: string }[] };

export async function getBranches(): Promise<Branch[]> {
  const { data } = await httpClient.get<Branch[]>("/api/public/branches");
  return data;
}

export async function getServices(branchId: string): Promise<Service[]> {
  const { data } = await httpClient.get<Service[]>("/api/public/services", { params: { branchId } });
  return data;
}

export async function getBarbers(branchId: string, serviceId: string): Promise<Barber[]> {
  const { data } = await httpClient.get<Barber[]>("/api/public/barbers", { params: { branchId, serviceId } });
  return data;
}

export async function getAvailability(branchId: string, serviceId: string, barberId: string, date: string): Promise<Availability> {
  const { data } = await httpClient.get<Availability>("/api/public/availability", { params: { branchId, barberId, serviceId, date } });
  return data;
}

export async function createAppointmentHold(data: { branchId: string; serviceId: string; barberId: string; startAt: string }): Promise<AppointmentHold> {
  const response = await httpClient.post<AppointmentHold>("/api/public/appointment-holds", {
    branchId: data.branchId,
    serviceIds: [data.serviceId],
    barberId: data.barberId,
    startAt: data.startAt,
  });
  return response.data;
}

export type CreatedAppointment = { id: string; confirmationCode: string; total: string | number };

export async function createAppointment(holdToken: string, customer: { name: string; phone: string; email?: string; notes?: string }): Promise<CreatedAppointment> {
  const { data } = await httpClient.post<CreatedAppointment>("/api/public/appointments", { holdToken, customer });
  return data;
}

export async function createCheckoutSession(appointmentId: string): Promise<{ checkoutUrl: string }> {
  const { data } = await httpClient.post<{ checkoutUrl: string }>("/api/public/payments/stripe/session", { appointmentId });
  return data;
}
