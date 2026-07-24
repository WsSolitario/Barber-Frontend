import { httpClient } from "@/services/http-client";

export async function login(email: string, password: string) {
  const { data } = await httpClient.post<{ accessToken: string }>("/api/auth/login", { email, password });
  return data;
}

export async function refreshSession() {
  const { data } = await httpClient.post<{ accessToken: string }>("/api/auth/refresh");
  return data;
}
